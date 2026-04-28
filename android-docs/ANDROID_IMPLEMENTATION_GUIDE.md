# Android Rebuild - Implementation Guide

This is a step-by-step tactical guide for rebuilding the Android client with clean merge support.

---

## Phase 1: Foundation (Days 1-3)

### Task 1.1: Create Platform Detection

**Create: `src/platform.ts`**

```typescript
/**
 * Platform detection & abstraction layer
 * Determines runtime environment (Android, Electron, Web)
 */

export type Platform = 'android' | 'electron' | 'web';

declare global {
  interface Window {
    electron?: any;
    Capacitor?: any;
    capacitor?: any;
  }
}

export const PLATFORM_CHECK = {
  isAndroid: (): boolean => {
    return !!(
      window.Capacitor || 
      (window.capacitor && window.capacitor.Plugins)
    );
  },

  isElectron: (): boolean => {
    return !!(window.electron && window.electron.ipcRenderer);
  },

  isWeb: (): boolean => {
    return !PLATFORM_CHECK.isAndroid() && !PLATFORM_CHECK.isElectron();
  },
};

export function getPlatform(): Platform {
  if (PLATFORM_CHECK.isAndroid()) return 'android';
  if (PLATFORM_CHECK.isElectron()) return 'electron';
  return 'web';
}

export const platform = getPlatform();

// Export for easy checks in components
export const isAndroid = platform === 'android';
export const isElectron = platform === 'electron';
export const isWeb = platform === 'web';
```

**Test it:**
```bash
npm run typecheck
```

### Task 1.2: Create Android Directory Structure

**Create these empty files to establish the module:**

```bash
mkdir -p src/android
touch src/android/index.ts
touch src/android/auth.ts
touch src/android/cryptoShim.ts
touch src/android/platform.ts
touch src/android/capacitorBridge.ts
```

**Create: `src/android/index.ts`**

```typescript
/**
 * Android platform support module
 * Exports all Android-specific functionality
 */

export * from './auth';
export * from './cryptoShim';
export * from './platform';
export * from './capacitorBridge';
```

### Task 1.3: Refactor Auth Service

**Current issue:** Auth is baked into `src/main/gfn/auth.ts` with Electron specific code.

**Create: `src/shared/auth/contract.ts`** (NEW - shared interface)

```typescript
/**
 * Shared authentication contract
 * Platform-specific implementations provide these
 */

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface IAuthService {
  /**
   * Initiate login flow (OAuth PKCE)
   * Returns tokens if successful
   */
  login(): Promise<TokenResponse>;

  /**
   * Clear tokens and logout
   */
  logout(): Promise<void>;

  /**
   * Get current valid access token
   * Auto-refreshes if needed
   */
  getAccessToken(): Promise<string>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;
}
```

**Create: `src/android/auth.ts`**

```typescript
/**
 * Android authentication via Capacitor
 * Uses WebView OAuth PKCE flow
 */

import { Capacitor } from '@capacitor/core';
import type { IAuthService, TokenResponse } from '@shared/auth/contract';

export class AndroidAuthService implements IAuthService {
  private static instance: AndroidAuthService;

  private constructor() {}

  static getInstance(): AndroidAuthService {
    if (!AndroidAuthService.instance) {
      AndroidAuthService.instance = new AndroidAuthService();
    }
    return AndroidAuthService.instance;
  }

  async login(): Promise<TokenResponse> {
    try {
      const result = await Capacitor.Plugins.GfnPlugin.login();
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      };
    } catch (error) {
      throw new Error(`Android auth failed: ${error}`);
    }
  }

  async logout(): Promise<void> {
    try {
      await Capacitor.Plugins.GfnPlugin.logout();
    } catch (error) {
      console.warn('Logout failed:', error);
    }
  }

  async getAccessToken(): Promise<string> {
    try {
      const result = await Capacitor.Plugins.GfnPlugin.getToken();
      return result.accessToken;
    } catch (error) {
      throw new Error(`Failed to get token: ${error}`);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const result = await Capacitor.Plugins.GfnPlugin.hasToken();
      return result.hasToken ?? false;
    } catch {
      return false;
    }
  }
}

export const androidAuth = AndroidAuthService.getInstance();
```

**Update: `src/main/gfn/auth.ts`** (Extract contract, keep Electron impl)

```typescript
/**
 * Electron-specific authentication
 * [Keep existing implementation, just mark it as implementing IAuthService]
 */

import type { IAuthService, TokenResponse } from '@shared/auth/contract';

export class ElectronAuthService implements IAuthService {
  // ... existing code ...
  
  async login(): Promise<TokenResponse> {
    // existing implementation
  }
  
  async logout(): Promise<void> {
    // existing implementation
  }
  
  async getAccessToken(): Promise<string> {
    // existing implementation
  }
  
  async isAuthenticated(): Promise<boolean> {
    // existing implementation
  }
}

export const electronAuth = new ElectronAuthService();
```

### Task 1.4: Create Crypto Shim for Android

**Create: `src/android/cryptoShim.ts`**

```typescript
/**
 * Android secure token storage via Capacitor
 * Tokens are encrypted with device keystore (native)
 */

import { Capacitor } from '@capacitor/core';

interface TokenStorage {
  accessToken: string;
  refreshToken?: string;
  timestamp: number;
}

export class SecureTokenStorage {
  private static readonly KEY = 'gfn_tokens';

  /**
   * Store tokens securely on device
   * Native code handles encryption via Android Keystore
   */
  static async saveTokens(tokens: {
    accessToken: string;
    refreshToken?: string;
  }): Promise<void> {
    const data: TokenStorage = {
      ...tokens,
      timestamp: Date.now(),
    };

    try {
      await Capacitor.Plugins.GfnPlugin.setSecureData({
        key: this.KEY,
        value: JSON.stringify(data),
      });
    } catch (error) {
      throw new Error(`Failed to save tokens: ${error}`);
    }
  }

  /**
   * Retrieve tokens from secure storage
   */
  static async getTokens(): Promise<TokenStorage | null> {
    try {
      const result = await Capacitor.Plugins.GfnPlugin.getSecureData({
        key: this.KEY,
      });

      if (!result.value) return null;

      return JSON.parse(result.value);
    } catch (error) {
      console.warn('Failed to retrieve tokens:', error);
      return null;
    }
  }

  /**
   * Clear stored tokens
   */
  static async clearTokens(): Promise<void> {
    try {
      await Capacitor.Plugins.GfnPlugin.removeSecureData({
        key: this.KEY,
      });
    } catch (error) {
      console.warn('Failed to clear tokens:', error);
    }
  }
}
```

### Task 1.5: Platform Bridge Module

**Create: `src/android/capacitorBridge.ts`**

```typescript
/**
 * Capacitor platform bridge
 * Adapts Capacitor plugins to expected interfaces
 */

import { Capacitor } from '@capacitor/core';

export interface CapacitorConfig {
  appId: string;
  appName: string;
}

export class CapacitorBridge {
  private static config: CapacitorConfig | null = null;

  /**
   * Initialize Capacitor (call on app startup)
   */
  static async initialize(config: CapacitorConfig): Promise<void> {
    CapacitorBridge.config = config;

    // Initialize plugins
    try {
      const SplashScreen = Capacitor.Plugins.SplashScreen;
      await SplashScreen?.hide();
    } catch (error) {
      console.warn('Could not hide splash screen:', error);
    }
  }

  /**
   * Check if Capacitor is available
   */
  static isAvailable(): boolean {
    return !!Capacitor.Plugins;
  }

  /**
   * Exit app (Android specific)
   */
  static async exitApp(): Promise<void> {
    try {
      await Capacitor.Plugins.App.exitApp();
    } catch {
      window.close(); // fallback
    }
  }

  /**
   * Lock orientation to portrait (mobile)
   */
  static async lockPortrait(): Promise<void> {
    try {
      // Future: implement via ScreenOrientation plugin
    } catch (error) {
      console.warn('Could not lock orientation:', error);
    }
  }
}
```

### Task 1.6: Test Foundation

**Create: `src/platform.test.ts`**

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PLATFORM_CHECK, getPlatform, platform } from './platform';

describe('Platform Detection', () => {
  const originalWindow = { ...window };

  afterEach(() => {
    // Restore window
    Object.keys(originalWindow).forEach((key) => {
      // @ts-ignore
      window[key] = originalWindow[key];
    });
  });

  it('detects Electron', () => {
    // @ts-ignore
    window.electron = { ipcRenderer: {} };
    delete (window as any).Capacitor;

    expect(PLATFORM_CHECK.isElectron()).toBe(true);
    expect(PLATFORM_CHECK.isAndroid()).toBe(false);
    expect(PLATFORM_CHECK.isWeb()).toBe(false);
  });

  it('detects Android', () => {
    // @ts-ignore
    window.Capacitor = { Plugins: {} };
    delete (window as any).electron;

    expect(PLATFORM_CHECK.isAndroid()).toBe(true);
    expect(PLATFORM_CHECK.isElectron()).toBe(false);
    expect(PLATFORM_CHECK.isWeb()).toBe(false);
  });

  it('detects Web', () => {
    delete (window as any).Capacitor;
    delete (window as any).electron;

    expect(PLATFORM_CHECK.isWeb()).toBe(true);
    expect(PLATFORM_CHECK.isAndroid()).toBe(false);
    expect(PLATFORM_CHECK.isElectron()).toBe(false);
  });
});
```

### Task 1.7: Update package.json for Android builds

**Update: `opennow-stable/package.json`** (add scripts)

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "build:web": "vite build --config vite.config.web.ts",
    "build:android": "npm run build:web && npx cap sync android",
    "android:dev": "npm run build:android && npx cap open android",
    "preview": "electron-vite preview",
    "dist": "npm run build && cross-env CSC_IDENTITY_AUTO_DISCOVERY=false electron-builder",
    "dist:signed": "npm run build && electron-builder",
    "typecheck": "tsc --noEmit -p tsconfig.node.json && tsc --noEmit -p tsconfig.json",
    "test": "tsx --test src/shared/gfn.test.ts src/renderer/src/lib/launchOwnership.test.ts src/renderer/src/components/GameCard.test.ts src/renderer/src/gfn/inputProtocol.test.ts src/renderer/src/gfn/webrtcClient.test.ts src/platform.test.ts"
  },
  "devDependencies": {
    "@capacitor/android": "^8.1.0",
    "@capacitor/cli": "^8.1.0",
    "@capacitor/core": "^8.1.0"
  }
}
```

---

## Phase 2: Build Configuration (Days 4-6)

### Task 2.1: Create Capacitor Config

**Create: `opennow-stable/capacitor.config.json`**

```json
{
  "appId": "com.zortos.opennow",
  "appName": "OpenNOW",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "GfnPlugin": {
      "oauth_client_id": "YOUR_CLIENT_ID_HERE"
    },
    "Keyboard": {
      "resize": "body"
    },
    "SplashScreen": {
      "launchAutoHide": true
    }
  }
}
```

### Task 2.2: Create Web-only Build Config

**Create: `opennow-stable/vite.config.web.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@android': resolve(__dirname, 'src/android'),
    },
  },
  define: {
    'process.env.VITE_ANDROID': JSON.stringify(true),
  },
});
```

### Task 2.3: Update Electron Config to Skip Android

**Update: `opennow-stable/electron.vite.config.ts`** (add comment)

```typescript
// [At the top, add this comment]
// This config is ELECTRON-ONLY
// For Android/web builds, see: vite.config.web.ts
// For Capacitor config, see: capacitor.config.json

// [Keep all existing code unchanged]
```

### Task 2.4: Update .gitignore

**Update: `.gitignore`** (add platform-specific)

```
# Android/Capacitor
android/
ios/
*.gradle
build/
.gradle/
keystore.properties

# Web build output
dist/

# IDE
.idea/
.vscode/

# Node
node_modules/
```

---

## Phase 3: Integration Layer (Days 7-9)

### Task 3.1: Update Main Process for Platform Detection

**Update: `src/main/index.ts`** (top of file, before other imports)

```typescript
import { getPlatform, isAndroid, isElectron } from '@shared/../platform';

// Log platform on startup
const platform = getPlatform();
console.log(`[Main] Running on platform: ${platform}`);

// Conditional imports
import { ElectronAuthService } from './gfn/auth';
import { AndroidAuthService } from '../android/auth'; // Only imports, not executes

// Select auth service based on platform
const authService = isAndroid
  ? AndroidAuthService.getInstance()
  : ElectronAuthService.getInstance();

// [Rest of existing code...]
```

### Task 3.2: Update Preload for Platform

**Update: `src/preload/index.ts`** (top of file)

```typescript
import { contextBridge } from 'electron';
import { PLATFORM_CHECK } from '@shared/../platform';

// Detect platform before bridging
let bridge;

if (PLATFORM_CHECK.isAndroid()) {
  // Android: Use Capacitor's global APIs
  bridge = {
    /**
     * Simulate IPC for Android
     * Routes through Capacitor plugins
     */
    invoke: async (channel: string, args?: any) => {
      const { Capacitor } = window;
      return await Capacitor.Plugins.GfnPlugin.ipcInvoke({
        channel,
        args,
      });
    },
    send: (channel: string, args?: any) => {
      // Fire and forget
      const { Capacitor } = window;
      Capacitor.Plugins.GfnPlugin.ipcSend({ channel, args });
    },
  };
} else {
  // Electron: Use native context bridge
  bridge = {
    invoke: (channel, args) => window.electron.ipcRenderer.invoke(channel, args),
    send: (channel, args) => window.electron.ipcRenderer.send(channel, args),
  };
}

// Export unified API
contextBridge.exposeInMainWorld('openNow', bridge);

// [Rest of existing code...]
```

### Task 3.3: Update Renderer App Initialization

**Update: `src/renderer/src/App.tsx`** (in useEffect)

```typescript
import { useEffect, useState } from 'react';
import { getPlatform, isAndroid } from '@platform';
import { CapacitorBridge } from '@android/capacitorBridge';

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (isAndroid) {
          // Initialize Capacitor on Android
          await CapacitorBridge.initialize({
            appId: 'com.zortos.opennow',
            appName: 'OpenNOW',
          });
          console.log('[App] Android initialized');
        }

        // Platform detection complete
        const platform = getPlatform();
        console.log(`[App] Running on ${platform}`);

        setInitialized(true);
      } catch (error) {
        console.error('[App] Initialization failed:', error);
        setInitialized(false);
      }
    };

    initializeApp();
  }, []);

  if (!initialized) {
    return <div>Initializing...</div>;
  }

  // [Rest of existing render code...]
}

export default App;
```

---

## Phase 4: Verification (Day 10)

### Checklist

```
FOUNDATION
- [ ] src/platform.ts created and types check
- [ ] src/android/ directory with all files
- [ ] src/shared/auth/contract.ts created
- [ ] src/android/auth.ts implements contract
- [ ] src/main/gfn/auth.ts still works for Electron

BUILD CONFIG
- [ ] npm run typecheck passes
- [ ] npm run build:web succeeds (creates dist/)
- [ ] npm run dist still works (Electron build)

INTEGRATION
- [ ] src/main/index.ts detects platform
- [ ] src/preload/index.ts conditionally bridges
- [ ] src/renderer/src/App.tsx initializes platform

MERGE TEST
- [ ] All existing tests pass
- [ ] No breaking changes to src/shared/
- [ ] Electron build is identical to before
```

### Commands to Run

```bash
# Install deps
npm install

# Type check
npm run typecheck

# Test foundation
npm run test

# Build electron (should work as before)
npm run build
npm run dist

# Build web (new)
npm run build:web
ls dist/  # Should have index.html, js/, css/

# Typecheck again
npm run typecheck
```

---

## Phase 5: Capacitor/Android Native (Days 11-14)

See `ANDROID_REBUILD_STRATEGY.md` Section 3 for native code.

Quick steps:
1. `npx cap init opennow com.zortos.opennow`
2. `npx cap add android`
3. Create `android/app/src/main/java/com/zortos/opennow/GfnPlugin.kt`
4. Wire OAuth + token storage in Kotlin
5. `npm run build:android`
6. Test on device

---

## Quick Reference: File Changes by Phase

### Phase 1 Foundation
```
NEW:  src/platform.ts
NEW:  src/android/index.ts
NEW:  src/android/auth.ts
NEW:  src/android/cryptoShim.ts
NEW:  src/android/capacitorBridge.ts
NEW:  src/android/platform.ts
NEW:  src/shared/auth/contract.ts
NEW:  src/platform.test.ts
EDIT: src/main/gfn/auth.ts (add IAuthService implement)
EDIT: opennow-stable/package.json (add scripts)
```

### Phase 2 Build Config
```
NEW:  opennow-stable/capacitor.config.json
NEW:  opennow-stable/vite.config.web.ts
EDIT: .gitignore (add android, dist)
```

### Phase 3 Integration
```
EDIT: src/main/index.ts (add platform detection)
EDIT: src/preload/index.ts (conditional bridge)
EDIT: src/renderer/src/App.tsx (add Capacitor init)
```

### Phase 4 (Verification)
```
RUN:  npm run typecheck
RUN:  npm run test
RUN:  npm run build
RUN:  npm run build:web
```

---

## Merge Test: The Critical Proof

After Phase 4 completes, test merging upstream:

```bash
# Create Android branch
git checkout -b android/main

# Commit Phase 1-4 work
git add .
git commit -m "feat: add Android platform support with clean merge strategy"

# Switch to main, pull latest upstream
git checkout main
git pull origin main

# Merge Android changes
git checkout android/main
git merge main

# Result: Should be 0 conflicts ✓
# Why: All Android code is in isolated src/android/ and config files
```

If you see conflicts, they're likely in:
- `package.json` (dependencies)
- `tsconfig.json` (paths)

These are easily resolvable (keep both, alphabetize).

---

## Success Criteria

✅ All tests pass
✅ Electron build is identical to before
✅ Web build creates dist/
✅ Merge upstream = clean rebase
✅ Android developers can work independently
✅ No merge conflicts after upstream syncs (for 3+ consecutive releases)

---

## Support Links

- Capacitor Docs: https://capacitorjs.com/docs/getting-started
- Vite Config: https://vitejs.dev/config/
- TypeScript: https://www.typescriptlang.org/
- Git Rebase: https://git-scm.com/docs/git-rebase
