# OpenNOW - Android

Unofficial GeForce NOW client for Android, built with Capacitor + React + WebRTC.

---

> **Warning**  
> OpenNOW is under active development. Bugs and performance issues are expected while features are finalized.

> **Trademark & Affiliation Notice**  
> OpenNOW is an independent community project and is **not affiliated with, endorsed by, or sponsored by NVIDIA Corporation**.  
> **NVIDIA** and **GeForce NOW** are trademarks of NVIDIA Corporation. You must use your own GeForce NOW account.

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

# Install (use -r for reinstall/update)
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

> **Note**: Local debug builds use your machine's debug keystore. If you previously installed a CI-built APK, you may need to uninstall first due to signature mismatch: `adb uninstall com.zortos.opennow`

---

## Quick rebuild (after any code change)

Run all steps from the project root:

```powershell
cd opennow-stable
npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
adb install -r app\build\outputs\apk\debug\app-debug.apk
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

## CI Build Artifacts

GitHub Actions builds APKs automatically on pushes and PRs. When CI signing is configured (see below), the workflow produces **signed release APKs** that can be upgraded in-place without uninstalling.

### Installing CI builds

1. Go to **Actions** → select a successful workflow run
2. Download the `opennow-android-release` artifact (or `opennow-android-debug` if signing isn't configured)
3. Extract and install: `adb install -r app-release.apk`

Successive CI builds use the same signing certificate, so you can install updates directly without uninstalling first.

---

## CI Signing Setup (for maintainers)

### Why is this needed?

Android requires APKs to be signed, and only allows in-place upgrades when both the package name AND signing certificate match. By default, debug builds use an auto-generated debug keystore unique to each machine. Since GitHub Actions runners are ephemeral, each CI run would generate a new keystore, causing signature mismatches that force users to uninstall before installing a new CI build.

This repository uses stable CI signing to solve this: a single keystore is stored as a GitHub secret and used for all CI builds, ensuring consistent signatures.

### Setting up CI signing

#### 1. Generate a keystore (one-time)

```bash
keytool -genkey -v -keystore ci-release.keystore -alias ci-key -keyalg RSA -keysize 2048 -validity 10000
```

Remember the passwords you set for the keystore and key.

#### 2. Encode keystore as base64

```bash
base64 -i ci-release.keystore -o keystore-base64.txt
```

#### 3. Add GitHub secrets

Go to **Settings** → **Secrets and variables** → **Actions** and add these secrets:

| Secret Name | Value |
|-------------|-------|
| `ANDROID_KEYSTORE_BASE64` | Contents of `keystore-base64.txt` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias (e.g., `ci-key`) |
| `ANDROID_KEY_PASSWORD` | Key password |

#### 4. Verify

Push a commit or trigger the workflow manually. The workflow will now produce `opennow-android-release` artifacts signed with your stable keystore.

### Without CI signing configured

If the secrets are not set, the workflow falls back to building a debug APK signed with the runner's ephemeral debug keystore. These APKs will still require uninstall/reinstall between CI builds due to signature mismatches.

---

## Local Release Signing

For local release builds (e.g., for Play Store), create `android/keystore.properties`:

```properties
RELEASE_STORE_FILE=path/to/your-release.keystore
RELEASE_STORE_PASSWORD=your-keystore-password
RELEASE_KEY_ALIAS=your-key-alias
RELEASE_KEY_PASSWORD=your-key-password
```

Then build with:

```powershell
cd android
.\gradlew assembleRelease
```

> **Important**: Never commit `keystore.properties` or keystore files to version control.

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
