/**
 * Device headers for the GFN CloudMatch API.
 *
 * The server uses these to figure out what kind of client you are and
 * what streaming capabilities to advertise. Getting them wrong causes
 * sessions to fail or give you the wrong resolution caps.
 *
 * We send different values depending on whether we are on desktop or Android.
 */

export type DeviceOs = "WINDOWS" | "MACOS" | "LINUX" | "ANDROID" | "IOS";
export type DeviceType = "DESKTOP" | "MOBILE" | "TABLET" | "TV";
export type ClientType = "NATIVE" | "BROWSER" | "ANDROID";

export interface GfnDeviceProfile {
  os: DeviceOs;
  deviceType: DeviceType;
  clientType: ClientType;
  userAgent: string;
  clientPlatformName: string;
}

// The user-agent that the official GFN desktop client sends.
const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 " +
  "NVIDIACEFClient/HEAD/debb5919f6 GFN-PC/2.0.80.173";

// The user-agent that the official GFN Android app sends.
// Keeping it close to a real Chrome on Android so NVIDIA's servers
// give us a mobile-friendly session (correct resolution, touch input, etc).
const ANDROID_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 " +
  "NVIDIAApp/4.0.0 GFN-ANDROID/4.0.0";

/**
 * Return the device profile for the current platform.
 *
 * On Node.js / Electron the platform string comes from process.platform.
 * On Android we just return the Android profile directly since we know
 * what we are at build time.
 */
export function getDeviceProfile(forAndroid: boolean): GfnDeviceProfile {
  if (forAndroid) {
    return {
      os: "ANDROID",
      deviceType: "MOBILE",
      clientType: "ANDROID",
      userAgent: ANDROID_USER_AGENT,
      clientPlatformName: "android",
    };
  }

  // Detect the desktop OS from process.platform (only available in Node / Electron)
  let os: DeviceOs = "WINDOWS";
  if (typeof process !== "undefined") {
    if (process.platform === "darwin") os = "MACOS";
    else if (process.platform === "linux") os = "LINUX";
  }

  return {
    os,
    deviceType: "DESKTOP",
    clientType: "NATIVE",
    userAgent: DESKTOP_USER_AGENT,
    clientPlatformName: "windows", // GFN server expects this even on Mac/Linux for desktop sessions
  };
}

/**
 * Build the HTTP headers that go on every CloudMatch API request.
 * Pass forAndroid=true when building the Android native plugin.
 */
export function buildDeviceHeaders(
  token: string,
  clientId: string,
  deviceId: string,
  forAndroid: boolean,
): Record<string, string> {
  const profile = getDeviceProfile(forAndroid);
  const GFN_CLIENT_VERSION = "2.0.80.173";

  return {
    "User-Agent": profile.userAgent,
    Authorization: `GFNJWT ${token}`,
    "Content-Type": "application/json",
    Origin: "https://play.geforcenow.com",
    Referer: "https://play.geforcenow.com/",
    "nv-browser-type": "CHROME",
    "nv-client-id": clientId,
    "nv-client-streamer": "NVIDIA-CLASSIC",
    "nv-client-type": profile.clientType,
    "nv-client-version": GFN_CLIENT_VERSION,
    "nv-device-make": forAndroid ? "Google" : "UNKNOWN",
    "nv-device-model": forAndroid ? "Pixel 8" : "UNKNOWN",
    "nv-device-os": profile.os,
    "nv-device-type": profile.deviceType,
    "x-device-id": deviceId,
  };
}
