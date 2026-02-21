/**
 * Platform detection helpers.
 *
 * These let the renderer adapt its behaviour depending on whether it's running
 * inside Electron (desktop) or a plain browser (Android Chrome, iOS Safari,
 * desktop browser as a PWA, etc.).
 *
 * Keep this file free of React — it's used in both component and non-component
 * code so it must be a plain module.
 */

// True when running inside the Electron shell.
// window.openNow is injected by the preload script; it won't exist in a browser.
export function isElectron(): boolean {
  return typeof window !== "undefined" && "openNow" in window;
}

// True on any Android device (Chrome, Samsung Internet, Firefox for Android …).
export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

// True on iOS (iPhone, iPad, iPod) and iPadOS.
export function isIos(): boolean {
  return /ipad|iphone|ipod/i.test(navigator.userAgent) ||
    // iPadOS 13+ reports itself as "Macintosh" but has touch points
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

// True on any mobile/touch device.
export function isMobile(): boolean {
  return isAndroid() || isIos() || navigator.maxTouchPoints > 0;
}

// True on macOS (desktop Safari, Chrome for Mac, etc.).
export function isMac(): boolean {
  return /macintosh|mac os x/i.test(navigator.userAgent) && !isIos();
}

// True when the app was launched from a home-screen shortcut / PWA install.
export function isPwa(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
}

// Returns a human-readable description of the current platform (useful for
// logging and for the settings page hardware-acceleration label).
export function platformLabel(): string {
  if (isAndroid()) return "Android";
  if (isIos()) return "iOS";
  if (isMac()) return "macOS";
  if (/win/i.test(navigator.platform)) return "Windows";
  if (/linux/i.test(navigator.platform)) return "Linux";
  return "Unknown";
}
