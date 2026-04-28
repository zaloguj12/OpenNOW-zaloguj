# Android Client Clean Rebuild Strategy

## Executive Summary
This document outlines how to rebuild the Android client for **clean upstream mergeability**. The core principle: **Android is an optional platform target, not a fork divergence**.

Current state: Android branch is 205 commits behind upstream with significant drift.
Target state: Android support integrated as an isolated platform layer with zero coupling to base logic.

---

## 1. Architecture: The Platform Abstraction Layer

### 1.1 Three-Tier Design

```
┌─────────────────────────────────────────────────────┐
│              Shared Logic (src/shared/)              │
│     (gfn.ts, ipc.ts, logger.ts, types, etc)         │
│     ✓ Zero platform knowledge                        │
│     ✓ Zero Capacitor/Electron dependencies          │
└─────────────────────────────────────────────────────┘
                         ▲
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐  ┌───▼──────────┐  ┌──▼──────────┐
│  Electron UI   │  │   Web Bundle │  │  Platform   │
│  (Main/Preload)│  │  (Renderer)  │  │  Adapters   │
│                │  │              │  │             │
│ - Auth/Session │  │ - React UI   │  │ ios/        │
│ - IPC handlers │  │ - WebRTC     │  │ android/    │
│ - Desktop      │  │ - Stream mgmt│  │ web/        │
│   features     │  │              │  │ electron/   │
└────────────────┘  └──────────────┘  └─────────────┘
```

### 1.2 Where Android Lives (Minimal Changes)

**Only these files should reference Android/Capacitor:**

```
src/
├── android/                    ← NEW: Android-only code
│   ├── capacitorPlugins.ts     ← GfnPlugin bridge
│   ├── auth.ts                 ← OAuth WebView handling
│   ├── cryptoShim.ts           ← Token encryption (native)
│   └── platform.ts             ← Platform abstraction for renderer
├── shared/                     ← UNCHANGED: Platform-agnostic
│   ├── gfn.ts
│   ├── ipc.ts
│   ├── logger.ts
│   └── ...
├── main/                       ← MINIMAL changes: Conditional imports
│   ├── index.ts                ← Platform detector
│   ├── gfn/                    ← Shared business logic
│   └── ...
├── renderer/                   ← MINIMAL changes: Use platform abstraction
│   └── src/
│       ├── App.tsx             ← Check for Android at load time
│       └── ...
└── capacitor.config.json       ← Config file (not code)
```

---

## 2. Implementation Steps

### Phase 1: Foundation (No Breaking Changes)

#### Step 1.1: Create Platform Detection Module
**File: `src/platform.ts`**
```typescript
export const PLATFORM = {
  isAndroid: () => !!window.capacitor || !!window.Capacitor,
  isElectron: () => !!window.electron,
  isWeb: () => !window.capacitor && !window.electron,
};

export type Platform = 'android' | 'electron' | 'web';
export const getPlatform = (): Platform => {
  if (PLATFORM.isAndroid()) return 'android';
  if (PLATFORM.isElectron()) return 'electron';
  return 'web';
};
```

#### Step 1.2: Platform-Specific Auth Service
**File: `src/main/auth.ts` (refactor)**

Currently, auth is tightly coupled to Electron. Extract:
```typescript
// src/shared/auth/authContract.ts
export interface IAuthService {
  login(): Promise<{ accessToken: string; refreshToken: string }>;
  logout(): Promise<void>;
  getToken(): Promise<string>;
}

// src/main/auth.ts (Electron implementation)
export class ElectronAuthService implements IAuthService { }

// src/android/auth.ts (Capacitor implementation)
export class AndroidAuthService implements IAuthService { }
```

#### Step 1.3: Platform-Specific Crypto
**File: `src/android/cryptoShim.ts` (NEW)**

Android token storage:
```kotlin
// android/app/src/main/java/com/zortos/opennow/GfnPlugin.kt
// Store encrypted tokens in SharedPreferences via Capacitor
```

JavaScript bridge:
```typescript
// src/android/cryptoShim.ts
export async function getSecureToken(): Promise<string> {
  const result = await Capacitor.Plugins.GfnPlugin.getToken();
  return result.token;
}
```

#### Step 1.4: Shared IPC Contracts (No Changes to src/shared/ipc.ts)

The existing IPC contracts stay the same. What changes:
- **Electron**: Uses native IPC
- **Android**: Routes through Capacitor bridge to simulated IPC

#### Step 1.5: Conditional Preload
**File: `src/preload/index.ts` (minimal refactor)**

```typescript
const contextBridge = (() => {
  if (window.Capacitor) {
    return createCapacitorBridge();
  }
  return electron.contextBridge;
})();
```

### Phase 2: Build Pipeline

#### Step 2.1: Multi-Target Build System
**File: `opennow-stable/vite.config.web.ts`** (new entry point for web/Android)

Current `electron.vite.config.ts` stays for Electron builds.

```typescript
// vite.config.android.ts - Capacitor doesn't use Vite normally,
// but we build the web bundle separately
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@shared': resolve('src/shared'),
      '@platform': resolve('src/android'),
    },
  },
});
```

#### Step 2.2: Capacitor Configuration
**File: `opennow-stable/capacitor.config.json`** (new)

```json
{
  "appId": "com.zortos.opennow",
  "appName": "OpenNOW",
  "webDir": "dist",
  "plugins": {
    "GfnPlugin": {},
    "Keyboard": {},
    "SplashScreen": {}
  }
}
```

#### Step 2.3: Build Scripts
**File: `opennow-stable/package.json` - new scripts**

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:android": "npm run build && npx cap sync android",
    "android:dev": "npm run build:android && npx cap open android",
    "android:build": "cd android && ./gradlew assembleRelease"
  }
}
```

### Phase 3: Capacitor Native Code (Minimal Kotlin)

**File: `android/app/src/main/java/com/zortos/opennow/GfnPlugin.kt`**

Keep this **very simple**:
- PKCE OAuth flow (webview)
- Token encryption (EncryptedSharedPreferences)
- IPC bridge to web

```kotlin
@CapacitorPlugin(name = "GfnPlugin")
class GfnPlugin : Plugin() {
    @PluginMethod
    fun login(call: PluginCall) {
        // Launch OAuth WebView
        // Return tokens
    }
    
    @PluginMethod
    fun getToken(call: PluginCall) {
        // Retrieve encrypted token
    }
}
```

---

## 3. Key Design Decisions for Mergeability

### 3.1 Golden Rule: `src/shared/` is Untouchable

**Never** add platform-specific code to:
- `src/shared/gfn.ts` - pure business logic
- `src/shared/ipc.ts` - contract definitions
- `src/shared/logger.ts` - logging

**Instead**: Create wrapper modules in `src/android/` that adapt shared interfaces.

### 3.2 Conditional Imports in Main Process

**Before:**
```typescript
// ❌ WRONG - creates merge conflicts
import { cloudmatchApi } from '@gfn/cloudmatch.ts';
if (isAndroid) {
  // Android-specific branch
}
```

**After:**
```typescript
// ✓ CORRECT - clean separation
const authService = getPlatform() === 'android' 
  ? new AndroidAuthService()
  : new ElectronAuthService();
```

### 3.3 Use `.gitignore` for Platform-Specific

**File: `.gitignore`**
```
# Capacitor
android/
ios/
*.gradle
build/

# Platform-specific configs
.capacitorrc.json
keystore.properties
```

Platform artifacts are generated, not committed (except in Android repo, they commit `android/`).

### 3.4 Feature Flags for Gradual Rollout

**File: `src/shared/config.ts`** (new)
```typescript
export const CONFIG = {
  features: {
    androidSupport: process.env.VITE_ANDROID === 'true',
    electronOnly: process.env.VITE_ELECTRON === 'true',
  },
};
```

---

## 4. Merge Strategy

### 4.1 Branch Structure
```
main (upstream)
├── develop (new feature branch)
├── android/main (tracking platform branch, merge-friendly)
└── bugfix/* (cherry-pickable)
```

### 4.2 Merging Upstream Changes

**Workflow:**
1. **New upstream commit arrives** (e.g., v0.3.9)
2. **Checkout `main`**: `git checkout main && git pull`
3. **Rebase android branch**: `git checkout android/main && git rebase main`
   - **99% of conflicts resolved automatically** (Android changes in isolated paths)
   - **Rare conflicts**: Only if upstream modifies `src/android/` or `capacitor.config.json`

**Why this works:**
- Upstream changes in `src/shared/`, `src/main/`, `src/renderer/` don't touch Android code
- Android is all in `src/android/` and `android/` directory
- No intertwined logic = clean fast-forward merges

### 4.3 Publishing Updates

```bash
# Update to latest upstream
git checkout main
git pull origin main:main

# Sync Android branch
git checkout android/main
git rebase main

# Build and push
npm run build:android
cd android && ./gradlew assembleRelease
git push origin android/main
```

---

## 5. Comparison: Before vs. After

### Before (Current Android Branch)
```
Merge conflicts: ❌❌❌ Frequent
Files modified: src/main/*, src/renderer/*, electron.vite.config.ts, package.json
Sync effort: Manual cherry-picking
Divergence drift: 205 commits behind
```

### After (Proposed)
```
Merge conflicts: ✓ Rare (only in 2-3 files)
Files modified: src/android/*, capacitor.config.json
Sync effort: `git rebase main` (automated)
Divergence drift: 0 (always catchable)
```

---

## 6. Implementation Checklist

### Foundation Layer
- [ ] Create `src/platform.ts` (platform detection)
- [ ] Create `src/android/` directory structure
- [ ] Extract auth to `src/shared/auth/contract.ts`
- [ ] Create `src/android/auth.ts` (Capacitor implementation)
- [ ] Create `src/android/cryptoShim.ts` (token storage)

### Build Layer
- [ ] Add `vite.config.web.ts` (web/Android build config)
- [ ] Add `capacitor.config.json`
- [ ] Update `package.json` with build scripts
- [ ] Update `.gitignore` for platform artifacts

### Integration Layer
- [ ] Refactor `src/preload/index.ts` for platform detection
- [ ] Add minimal `src/main/platform.ts` for boot-time detection
- [ ] Update `src/renderer/App.tsx` to handle Capacitor lifecycle

### Native Layer (Android)
- [ ] Create `GfnPlugin.kt` (OAuth + token management)
- [ ] Wire Capacitor bridge to shared IPC contracts
- [ ] Update `android/` Gradle build files
- [ ] Add CI/CD signing setup

### Testing & Merge
- [ ] Run `npm run typecheck` on both platforms
- [ ] Test electron build: `npm run dist`
- [ ] Test Android build: `npm run build:android`
- [ ] Merge upstream commit into `android/main` (should be clean)
- [ ] Document merge process in CONTRIBUTING.md

---

## 7. File Change Summary

### Modified Files (Minimal)
- `opennow-stable/package.json` - add build scripts
- `src/main/index.ts` - platform detection at boot
- `src/preload/index.ts` - conditional context bridge
- `src/renderer/App.tsx` - Capacitor initialization

### New Files
- `src/platform.ts`
- `src/android/` (directory with 5-6 files)
- `opennow-stable/capacitor.config.json`
- `opennow-stable/vite.config.web.ts`
- `android/app/.../GfnPlugin.kt`

### Unchanged (Most Code!)
- `src/shared/**` - completely untouched
- `src/main/gfn/**` - business logic preserved
- `src/renderer/` - React UI mostly unchanged
- All existing tests

---

## 8. Expected Outcome

✅ **Clean merges from upstream**
- Run `git rebase main` after upstream releases
- Resolve <5 conflicts (if any)
- No major recoding cycles

✅ **Platform isolation**
- Android code lives in `src/android/`
- Electron code stays in `src/main/`
- Shared code in `src/shared/`

✅ **Maintainability**
- New developers understand: "Android changes in one place"
- Future PRs: "Does this affect both platforms?"
- Tech debt: Centralized, not scattered

✅ **Release velocity**
- Main branch: Electron releases unaffected by Android work
- Android branch: Can land features independently
- Sync: Intentional, not reactive

---

## 9. Next Steps

1. **Review & approve** this architecture
2. **Start Phase 1** (Platform detection + auth refactor)
3. **Test electron build** (should still work, zero changes to Electron logic)
4. **Test capacitor build** (new flow)
5. **Merge real upstream commit** (v0.3.9 or next) and verify clean rebase

---

## 10. Additional Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Original Android Branch: https://github.com/zaloguj12/OpenNOW-Android_Fork/tree/Android
- This fork: https://github.com/OpenCloudGaming/OpenNOW
