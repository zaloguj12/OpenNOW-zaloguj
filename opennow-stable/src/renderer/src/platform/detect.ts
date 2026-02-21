export type Platform = "electron" | "capacitor" | "web";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "web";

  // Capacitor injects window.Capacitor when running inside a native app.
  // Check both the object and the isNativePlatform flag to be sure.
  const cap = (window as any).Capacitor;
  if (cap && (cap.isNativePlatform?.() || cap.isPluginAvailable || cap.platform === "android" || cap.platform === "ios")) {
    return "capacitor";
  }

  // Electron injects window.openNow via the preload context bridge
  if ((window as any).openNow) {
    return "electron";
  }

  return "web";
}

// Evaluated lazily so Capacitor's bridge has time to inject window.Capacitor
// before we check. Call getPlatform() instead of using PLATFORM directly
// in code that runs after module init.
let _platform: Platform | null = null;
export function getPlatform(): Platform {
  if (_platform) return _platform;
  _platform = detectPlatform();
  return _platform;
}

// Static export kept for backwards compat -- evaluated once at import time.
// On Android this may be wrong if Capacitor hasn't injected yet; prefer getPlatform().
export const PLATFORM: Platform = detectPlatform();

export const isElectron = () => getPlatform() === "electron";
export const isAndroid = () => getPlatform() === "capacitor";
export const isWeb = () => getPlatform() === "web";
