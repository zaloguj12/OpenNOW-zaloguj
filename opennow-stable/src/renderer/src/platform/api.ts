/**
 * Platform API bridge.
 *
 * The renderer always calls functions from this file instead of touching
 * window.openNow (Electron) or Capacitor plugins (Android) directly.
 *
 * On Electron everything just forwards to the existing window.openNow API.
 * On Android / Capacitor we call the GfnPlugin that lives in the Android project.
 *
 * NOTE: The Capacitor plugin paths below (e.g. "@capacitor/...") will only resolve
 * once you run `npm install @capacitor/core @capacitor/android` inside opennow-stable.
 * Until then the Electron path is the only one compiled. The Android build is wired
 * up separately via `npx cap add android` after the npm install.
 */

import { PLATFORM } from "./detect";
import type { OpenNowApi } from "@shared/gfn";

// --- Electron path ---

function getElectronApi(): OpenNowApi {
  const api = (window as any).openNow as OpenNowApi | undefined;
  if (!api) {
    throw new Error("window.openNow is not available -- are you running outside of Electron?");
  }
  return api;
}

// --- Capacitor / Android path ---

/**
 * Call a method on the native GfnPlugin via Capacitor.
 * On Android the plugin is implemented in Kotlin inside the android/ folder.
 */
async function callNativePlugin<T>(method: string, args?: Record<string, unknown>): Promise<T> {
  // We import Capacitor lazily so it never crashes when running in Electron
  // (the package simply won't be installed there).
  let Plugins: any;
  try {
    const cap = await import("@capacitor/core");
    Plugins = cap.Plugins;
  } catch {
    throw new Error(
      `Capacitor core is not installed. ` +
      `Run: npm install @capacitor/core @capacitor/android --save`,
    );
  }

  const GfnPlugin = Plugins?.GfnPlugin;
  if (!GfnPlugin) {
    throw new Error("GfnPlugin is not registered. Make sure android/ is initialised and the plugin is listed in MainActivity.java.");
  }

  return GfnPlugin[method](args ?? {}) as Promise<T>;
}

/**
 * Thin wrapper that builds an OpenNowApi-compatible object over Capacitor.
 *
 * Each method maps 1:1 to a method on the Kotlin GfnPlugin. The plugin itself
 * makes the same HTTP calls that the Electron main process makes, but from
 * the Android layer (OkHttp / Retrofit).
 *
 * For WebRTC the renderer still does all the work -- Android just supplies
 * auth tokens, session data, and signaling messages the same way Electron does.
 */
function buildCapacitorApi(): OpenNowApi {
  // Event listeners are handled differently on Capacitor (addListener vs ipcRenderer.on)
  // We store them in a plain Map so the renderer's unsubscribe callbacks still work.
  const signalingListeners = new Set<Function>();
  const fullscreenListeners = new Set<Function>();

  // Capacitor forwards server-push events as plugin events we can subscribe to.
  let signalingListenerHandle: any = null;

  async function ensureSignalingEvents() {
    if (signalingListenerHandle) return;
    try {
      const cap = await import("@capacitor/core");
      signalingListenerHandle = await cap.Plugins.GfnPlugin.addListener(
        "signalingEvent",
        (event: any) => {
          for (const cb of signalingListeners) {
            cb(event);
          }
        },
      );
    } catch {
      // Plugin not available yet -- will be retried on next call
    }
  }

  return {
    getAuthSession: (input?) => callNativePlugin("getAuthSession", input as any),
    getLoginProviders: () => callNativePlugin("getLoginProviders"),
    getRegions: (input?) => callNativePlugin("getRegions", input as any),

    // On Android login opens a Chrome Custom Tab instead of Electron's shell.openExternal
    login: (input) => callNativePlugin("login", input as any),
    logout: () => callNativePlugin("logout"),

    fetchSubscription: (input) => callNativePlugin("fetchSubscription", input as any),
    fetchMainGames: (input) => callNativePlugin("fetchMainGames", input as any),
    fetchLibraryGames: (input) => callNativePlugin("fetchLibraryGames", input as any),
    fetchPublicGames: () => callNativePlugin("fetchPublicGames"),
    resolveLaunchAppId: (input) => callNativePlugin("resolveLaunchAppId", input as any),

    createSession: (input) => callNativePlugin("createSession", input as any),
    pollSession: (input) => callNativePlugin("pollSession", input as any),
    stopSession: (input) => callNativePlugin("stopSession", input as any),
    getActiveSessions: (token?, streamingBaseUrl?) =>
      callNativePlugin("getActiveSessions", { token, streamingBaseUrl }),
    claimSession: (input) => callNativePlugin("claimSession", input as any),
    showSessionConflictDialog: () => callNativePlugin("showSessionConflictDialog"),

    connectSignaling: (input) => callNativePlugin("connectSignaling", input as any),
    disconnectSignaling: () => callNativePlugin("disconnectSignaling"),
    sendAnswer: (input) => callNativePlugin("sendAnswer", input as any),
    sendIceCandidate: (input) => callNativePlugin("sendIceCandidate", input as any),

    onSignalingEvent: (listener) => {
      signalingListeners.add(listener);
      void ensureSignalingEvents();
      return () => signalingListeners.delete(listener);
    },

    // Fullscreen on Android is handled by the WebView / native layer.
    // We expose no-op implementations so the renderer code compiles unchanged.
    onToggleFullscreen: (listener) => {
      fullscreenListeners.add(listener);
      return () => fullscreenListeners.delete(listener);
    },
    toggleFullscreen: () => callNativePlugin("toggleFullscreen"),
    togglePointerLock: () => Promise.resolve(), // no pointer lock on touch screens

    getSettings: () => callNativePlugin("getSettings"),
    setSetting: (key, value) => callNativePlugin("setSetting", { key, value }),
    resetSettings: () => callNativePlugin("resetSettings"),
  };
}

// --- Exported singleton ---

let _api: OpenNowApi | null = null;

/**
 * Get the platform API. Call this instead of window.openNow everywhere.
 *
 * The result is cached after the first call so we never rebuild it.
 */
export function getPlatformApi(): OpenNowApi {
  if (_api) return _api;

  if (PLATFORM === "electron") {
    _api = getElectronApi();
  } else if (PLATFORM === "capacitor") {
    _api = buildCapacitorApi();
  } else {
    // Plain web / dev server -- forward to Electron API if accidentally present,
    // otherwise throw a clear error.
    try {
      _api = getElectronApi();
    } catch {
      throw new Error(
        "No platform API found. Run the app inside Electron or a Capacitor shell.",
      );
    }
  }

  return _api;
}
