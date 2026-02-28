---

> **Warning**  
> OpenNOW is under active development. Bugs and performance issues are expected while features are finalized.

> **Trademark & Affiliation Notice**  
> OpenNOW is an independent community project and is **not affiliated with, endorsed by, or sponsored by NVIDIA Corporation**.  
> **NVIDIA** and **GeForce NOW** are trademarks of NVIDIA Corporation. You must use your own GeForce NOW account.

---

# OpenNOW - Android

Unofficial GeForce NOW client for Android, built with Capacitor + React + WebRTC.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18 or newer | https://nodejs.org |
| Android Studio | Hedgehog or newer | https://developer.android.com/studio |
| Android SDK | API 36 (compile), API 24 (min) | Install via SDK Manager in Android Studio |
| JDK | 17 | Bundled with Android Studio |
| ADB | any | Part of Android SDK platform-tools |

After installing Android Studio, open it once and let it finish the initial SDK setup.

Add ADB to your PATH so it works from a terminal:

```powershell
# Add to your PowerShell profile or system environment variables
$env:PATH += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

---

## First time setup

```powershell
cd opennow-stable
npm install
```

The `android/` folder is already checked in. You do not need to run `cap init` or `cap add android`.

---

## Build and install

### Step 1 - Build the web bundle

```powershell
npm run build
```

### Step 2 - Sync web assets into the Android project

```powershell
npx cap sync android
```

Copies `dist/` into the Android project and updates Capacitor plugins.
Run this every time after `npm run build`.

### Step 3 - Build the APK

```powershell
cd android
.\gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4 - Install on device

Make sure your device is connected with USB debugging enabled.

```powershell
# Check device is visible
adb devices

# Uninstall old version first (avoids signature mismatch errors)
adb uninstall com.zortos.opennow

# Install
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

## Quick rebuild (after any code change)

Run all steps from the project root:

```powershell
cd opennow-stable
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
adb uninstall com.zortos.opennow
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

## Open in Android Studio

```powershell
npx cap open android
```

Or open the `android/` folder directly in Android Studio.

---

## Logcat (debug output)

```powershell
# Live output filtered to app logs
adb logcat | Select-String "Capacitor|chromium|WebRTC|GfnPlugin"

# Last 200 lines then exit
adb logcat -d | Select-String "Capacitor|Console|error" | Select-Object -Last 200
```

---

## Android details

- App ID: `com.zortos.opennow`
- Min SDK: API 24 (Android 7.0)
- Target/Compile SDK: API 36

## How it works

| Feature | Implementation |
|---------|---------------|
| Auth (login) | Kotlin `GfnPlugin.kt` -- opens a WebView activity for NVIDIA OAuth PKCE. Tokens stored in `EncryptedSharedPreferences` |
| Games API | Browser `fetch` running directly in the WebView -- no Kotlin involved |
| Session management | Browser `fetch` running directly in the WebView -- no Kotlin involved |
| Signaling | `BrowserSignalingClient` -- native WebSocket in the WebView -- no Kotlin involved |
| WebRTC | Browser built-in WebRTC stack inside the WebView |
| Settings | Kotlin `GfnPlugin.kt` -- stored in `SharedPreferences` |
