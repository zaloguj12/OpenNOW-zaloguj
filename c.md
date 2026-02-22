# OpenNOW

Unofficial GeForce NOW client. Supports Windows, macOS, Linux (via Electron) and Android (via Capacitor).

---

## Architecture Overview

The project is a single codebase that compiles to two targets:

- **Electron** — desktop app for Windows, macOS, Linux. The main process handles
  signaling (WebSocket via the `ws` package). The renderer handles WebRTC, games API,
  session management, and all UI.

- **Android (Capacitor)** — the same Vite/React renderer is bundled into a WebView.
  Session management, games API, and signaling all run directly in the WebView using
  browser-native `fetch` and `WebSocket`. A Kotlin Capacitor plugin (`GfnPlugin.kt`)
  handles auth (OAuth PKCE via a WebView activity) and settings storage only.

```
src/
  main/          Electron main process (signaling, window management)
  preload/       Electron preload script (window.openNow bridge)
  renderer/      React UI + WebRTC client (shared between Electron and Android)
    platform/    Platform abstraction layer
      api.ts     Electron vs Android API routing
      browserSignaling.ts   Android WebSocket signaling (browser-native)
      cryptoShim.ts         node:crypto shim for browser builds
  shared/        TypeScript types shared across main/renderer
android/         Capacitor Android project (Gradle)
  app/src/main/java/com/zortos/opennow/
    GfnPlugin.kt            Capacitor plugin (auth, settings)
    AndroidSignalingManager.kt  (legacy, no longer used by renderer)
    LoginActivity.kt        WebView-based OAuth login
```

---

## Prerequisites

### All platforms

- **Node.js** 18 or newer
- **npm** 9 or newer

```powershell
node --version   # must be >= 18
npm --version    # must be >= 9
```

### Electron (desktop builds only)

No extra tools needed beyond Node.js. Electron is installed as a dev dependency.

### Android

| Tool | Version | Notes |
|------|---------|-------|
| Android Studio | Hedgehog or newer | Installs SDK + build tools |
| Android SDK | API 36 (compile), API 24 (min) | Via SDK Manager in Android Studio |
| JDK | 17 | Bundled with Android Studio, or install separately |
| Kotlin | 1.9+ | Bundled with Android Studio |
| ADB | any | Part of Android SDK platform-tools |

After installing Android Studio, open it once and let it finish downloading the SDK.
Then add platform-tools to your PATH so `adb` works from a terminal:

```powershell
# Windows -- add to your PowerShell profile or system environment variables
$env:PATH += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

---

## Install dependencies

```powershell
cd opennow-stable
npm install
```

---

## Electron (Desktop)

### Development (hot reload)

```powershell
npm run dev
```

### Build renderer + main (no installer)

```powershell
npm run build
```

Output goes to `dist/` (renderer) and `dist-electron/` (main process).

### Package into installer

```powershell
npm run dist
```

Unsigned build -- skips code signing. Output in `dist-release/`.

```powershell
npm run dist:signed
```

Signed build -- requires code signing certificates configured in the environment.

### Packaging targets

| Platform | Formats | Artifact name |
|----------|---------|---------------|
| Windows | NSIS installer + portable exe | `OpenNOW-vX.Y.Z-setup-x64.exe` |
| macOS | dmg + zip (x64 and arm64) | `OpenNOW-vX.Y.Z-mac-x64.dmg` |
| Linux x64 | AppImage + deb | `OpenNOW-vX.Y.Z-linux-x64.AppImage` |
| Linux arm64 | AppImage + deb | `OpenNOW-vX.Y.Z-linux-arm64.AppImage` |

### Type checking

```powershell
npm run typecheck
```

---

## Android (Capacitor)

### One-time setup

Make sure you have done `npm install` first (see above).
The `android/` folder is the Gradle project checked in to the repo.
You do not need to run `cap init` or `cap add android` again.

### Full build and install workflow

**Step 1 -- Build the web bundle:**

```powershell
npm run build
```

**Step 2 -- Sync web assets into the Android project:**

```powershell
npx cap sync android
```

This copies `dist/` into `android/app/src/main/assets/public/` and updates
Capacitor plugins. Run this every time after `npm run build`.

**Step 3 -- Build the APK:**

```powershell
cd android
.\gradlew assembleDebug
```

Debug APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

For a release build (requires signing config):

```powershell
.\gradlew assembleRelease
```

**Step 4 -- Install on device:**

```powershell
# Make sure your device is connected with USB debugging enabled
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices

# Uninstall old version first (avoids signature mismatch errors)
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" uninstall com.zortos.opennow

# Install the new APK
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install app\build\outputs\apk\debug\app-debug.apk
```

### Quick rebuild (after code changes)

```powershell
cd opennow-stable
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" uninstall com.zortos.opennow
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install app\build\outputs\apk\debug\app-debug.apk
```

### Open in Android Studio

```powershell
npx cap open android
```

Or open the `android/` folder directly in Android Studio.

### Logcat (debug output from device)

```powershell
# All app output
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" logcat | Select-String "Capacitor|chromium|WebRTC|GfnPlugin"

# Last 200 lines then exit
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" logcat -d | Select-String "Capacitor|Console|error" | Select-Object -Last 200
```

### Android requirements summary

- `minSdkVersion` 24 (Android 7.0 Nougat)
- `targetSdkVersion` / `compileSdkVersion` 36
- App ID: `com.zortos.opennow`

---

## How the Android platform layer works

The renderer (`src/renderer/src/platform/api.ts`) detects at runtime whether it
is running in Electron or Capacitor and returns the appropriate API implementation.

On Android:

- **Auth** -- calls `GfnPlugin.kt` via Capacitor bridge. Opens a WebView activity
  (`LoginActivity.kt`) for the NVIDIA OAuth PKCE flow. Tokens are stored in
  `EncryptedSharedPreferences`.

- **Games API** -- imported directly from `src/main/gfn/games.ts` into the renderer
  bundle. Uses browser-native `fetch`. No Kotlin involved.

- **Session management** -- imported directly from `src/main/gfn/cloudmatch.ts`
  into the renderer bundle. Uses browser-native `fetch`. No Kotlin involved.

- **Signaling** -- `BrowserSignalingClient` (`src/renderer/src/platform/browserSignaling.ts`)
  opens a WebSocket directly in the WebView. No Kotlin involved.

- **WebRTC** -- handled entirely by the browser's built-in WebRTC stack inside the
  WebView. `GfnWebRtcClient` in `src/renderer/src/gfn/webrtcClient.ts` handles
  offer/answer, ICE, and media track setup.

- **Settings** -- calls `GfnPlugin.kt` via Capacitor bridge. Stored in
  `SharedPreferences`.

---

## CI/CD

Workflow: `.github/workflows/auto-build.yml`

- Triggers on pushes to `dev`/`main` and pull requests
- Builds: Windows, macOS (x64/arm64), Linux x64, Linux arm64
- Artifacts uploaded to GitHub Releases

### Tagged releases

```powershell
git tag opennow-stable-v0.2.4
git push origin opennow-stable-v0.2.4
```

Format: `opennow-stable-vX.Y.Z`. The workflow automatically builds all platforms
and creates or updates the GitHub Release.

---

## Project dependencies (key packages)

| Package | Used for |
|---------|---------|
| `electron` | Desktop app host |
| `electron-vite` | Build system (Vite + Electron integration) |
| `electron-builder` | Packaging and installers |
| `@capacitor/core` | Android WebView bridge |
| `@capacitor/android` | Android Gradle plugin |
| `@capacitor/cli` | `npx cap` commands |
| `ws` | WebSocket in Electron main process (signaling) |
| `react` / `react-dom` | UI framework |
| `lucide-react` | Icons |
| `typescript` | Type checking |
| `vite` | Renderer bundler |
