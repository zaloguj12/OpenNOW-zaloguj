# DO NOT USE THIS YET, IT IS NOT FULLY OPERATIONAL

# Android Build Guide

This explains how to build OpenNOW for Android. The Android build uses
Capacitor to wrap the existing React renderer inside a native Android WebView.
The native Kotlin plugin (android-plugin/GfnPlugin.kt) handles the parts that
cannot run in a browser: auth token storage, HTTP requests to NVIDIA's backend,
and WebSocket signaling.

---

## What you need

- Node.js 20+
- Android Studio (Electric Eel or newer)
- JDK 17
- Android SDK with API level 33 or higher

---

## Step 1 -- Install Capacitor

Run these commands inside opennow-stable/:

```powershell
cd opennow-stable
npm install @capacitor/core @capacitor/android @capacitor/splash-screen
```

---

## Step 2 -- Build the web app

```powershell
npm run build
```

This writes the compiled renderer to dist/. Capacitor copies this folder
into the Android project so the WebView loads it without a network request.

---

## Step 3 -- Add the Android platform

```powershell
npx cap add android
```

This creates the android/ folder with the Gradle project, MainActivity,
and the WebView configuration.

---

## Step 4 -- Copy the Kotlin plugin files

Copy both files from android-plugin/ into your Android source tree:

```powershell
$dest = "android\app\src\main\java\com\zortos\opennow"
New-Item -ItemType Directory -Force -Path $dest
Copy-Item android-plugin\GfnPlugin.kt $dest\
Copy-Item android-plugin\AndroidSignalingManager.kt $dest\
```

---

## Step 5 -- Register the plugin and OAuth redirect in MainActivity

Open android/app/src/main/java/com/zortos/opennow/MainActivity.kt
and replace its contents with this:

```kotlin
package com.zortos.opennow

import android.content.Intent
import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(GfnPlugin::class.java)
        super.onCreate(savedInstanceState)
    }

    // Receive the opennow://auth?code=... redirect from the system browser
    // after the user logs in. Hands the URI to GfnPlugin to complete the
    // OAuth PKCE token exchange.
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val uri = intent.data ?: return
        if (uri.scheme == "opennow" && uri.host == "auth") {
            val plugin = bridge.getPlugin("GfnPlugin")?.getInstance() as? GfnPlugin
            plugin?.handleOAuthRedirect(uri)
        }
    }
}
```

---

## Step 6 -- Add Gradle dependencies

Open android/app/build.gradle and add to the dependencies block:

```groovy
implementation "com.squareup.okhttp3:okhttp:4.12.0"
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0"
implementation "androidx.security:security-crypto:1.1.0-alpha06"
```

---

## Step 7 -- Add the OAuth redirect intent filter

Open android/app/src/main/AndroidManifest.xml and add this inside the
<activity> tag so the app catches the opennow://auth redirect after login:

```xml
<intent-filter android:autoVerify="false">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="opennow" android:host="auth" />
</intent-filter>
```

---

## Step 8 -- Sync and open in Android Studio

```powershell
npx cap sync android
npx cap open android
```

Then press Run in Android Studio to build and install the APK on a device
or emulator. To build from the command line instead:

```powershell
cd android
.\gradlew assembleDebug
```

The APK will be at android\app\build\outputs\apk\debug\app-debug.apk.

---

## Feature status

| Feature               | Status   | Notes                                                       |
|-----------------------|----------|-------------------------------------------------------------|
| UI / game library     | Done     | Full React renderer runs in the WebView                     |
| WebRTC streaming      | Done     | WebView handles WebRTC natively via Chromium                |
| Settings              | Done     | Stored in Android SharedPreferences                         |
| Signaling (WebSocket) | Done     | AndroidSignalingManager.kt handles the WS connection        |
| Login (OAuth PKCE)    | Done     | Browser opens, redirect caught by onNewIntent, tokens saved |
| Token refresh         | Done     | Refreshed on startup, stored in EncryptedSharedPreferences  |
| Touch input           | Done     | TouchInputHandler maps touch to GFN mouse protocol          |
| Virtual gamepad       | Done     | TouchGamepad.tsx overlaid during streaming on Android       |
| Session management    | Partial  | create/poll/stop done; claimSession stub only               |
| Subscription info     | Pending  | Requires fetchSubscription Kotlin impl                      |

---

## How login works end to end

1. The renderer calls getPlatformApi().login(). On Android this calls
   GfnPlugin.login() via Capacitor.

2. GfnPlugin generates a PKCE verifier + challenge, stores the pending
   PluginCall reference, and opens the NVIDIA login page in the system
   browser via Intent.ACTION_VIEW.

3. The user logs in. NVIDIA redirects the browser to opennow://auth?code=...

4. Android routes the opennow:// URI back to MainActivity.onNewIntent().

5. MainActivity calls plugin.handleOAuthRedirect(uri).

6. GfnPlugin exchanges the code for tokens (PKCE token exchange against
   https://login.nvidia.com/token), saves them in EncryptedSharedPreferences,
   and resolves the original Capacitor PluginCall with the session object.

7. The renderer receives the AuthSession and proceeds to load the game list.

---

## Project structure after Android is added

```
opennow-stable/
  android/                   <- generated by npx cap add android
    app/src/main/java/
      com/zortos/opennow/
        MainActivity.kt      <- register plugin + onNewIntent wiring
        GfnPlugin.kt         <- copied from android-plugin/
        AndroidSignalingManager.kt
  android-plugin/            <- source of truth for Kotlin files
    GfnPlugin.kt
    AndroidSignalingManager.kt
  capacitor.config.json      <- Capacitor configuration
  src/renderer/src/platform/
    detect.ts                <- Electron vs Capacitor vs web detection
    api.ts                   <- unified API bridge for both platforms
    index.ts                 <- re-exports
  src/renderer/src/gfn/
    touchInput.ts            <- touch-to-mouse translation for Android
  src/renderer/src/components/
    TouchGamepad.tsx         <- on-screen virtual gamepad for Android
```
