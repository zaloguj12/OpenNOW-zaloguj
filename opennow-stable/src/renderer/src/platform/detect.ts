/**
 * Platform detection helpers.
 *
 * We run in one of two environments:
 *   - Electron: the normal desktop app, with window.openNow exposed by the preload script
 *   - Capacitor: the Android/iOS build, where native APIs go through Capacitor plugins
 *
 * Everything in the app should import from here instead of touching
 * window.openNow or Capacitor directly.
 */

export type Platform = "electron" | "capacitor" | "web";

function detectPlatform(): Platform {
  // Capacitor injects window.Capacitor when running inside a native app
  if (typeof window !== "undefined" && (window as any).Capacitor) {
    return "capacitor";
  }

  // Electron injects window.openNow via the preload context bridge
  if (typeof window !== "undefined" && (window as any).openNow) {
    return "electron";
  }

  // Plain browser / development server fallback
  return "web";
}

export const PLATFORM: Platform = detectPlatform();

export const isElectron = PLATFORM === "electron";
export const isAndroid = PLATFORM === "capacitor";
export const isWeb = PLATFORM === "web";
