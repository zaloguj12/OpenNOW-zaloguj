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

import { getPlatform } from "./detect";
import type { OpenNowApi } from "@shared/gfn";

// Call a Capacitor native plugin method directly via the low-level bridge.
// This bypasses registerPlugin() which behaves inconsistently across Capacitor versions.
function callCapacitor(plugin: string, method: string, args: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const cap = (window as any).Capacitor;
    if (!cap) {
      reject(new Error("Capacitor bridge not available"));
      return;
    }
    // Capacitor 6+ exposes nativePromise directly
    if (cap.nativePromise) {
      cap.nativePromise(plugin, method, args).then(resolve).catch(reject);
      return;
    }
    // Fallback: Capacitor 4/5 style
    if (cap.Plugins?.[plugin]?.[method]) {
      cap.Plugins[plugin][method](args).then(resolve).catch(reject);
      return;
    }
    reject(new Error(`Plugin ${plugin}.${method} not found on bridge`));
  });
}

// Wraps a plugin call with a timeout so a hung Kotlin coroutine can't freeze the UI.
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

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
  return callCapacitor("GfnPlugin", method, args ?? {}) as Promise<T>;
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
      const { registerPlugin } = await import("@capacitor/core");
      const plugin = registerPlugin("GfnPlugin");
      signalingListenerHandle = await (plugin as any).addListener(
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
    getAuthSession: (input?) =>
      withTimeout(
        callNativePlugin("getAuthSession", input as any),
        8000,
        { session: null, refresh: { attempted: false, forced: false, outcome: "not_attempted", message: "Plugin timeout" } }
      ),
    getLoginProviders: () =>
      callNativePlugin<{ providers: any[] }>("getLoginProviders").then((r) => r.providers ?? []),
    getRegions: (input?) =>
      callNativePlugin<{ regions: any[] }>("getRegions", input as any).then((r) => r.regions ?? []),

    // On Android login opens a Chrome Custom Tab instead of Electron's shell.openExternal
    login: (input) => callNativePlugin("login", input as any),
    logout: () => callNativePlugin("logout"),

    fetchSubscription: (input) => callNativePlugin("fetchSubscription", input as any),
    fetchMainGames: (input) =>
      callNativePlugin<{ games: any }>("fetchMainGames", input as any).then((r) =>
        typeof r.games === "string" ? JSON.parse(r.games) : r.games ?? []),
    fetchLibraryGames: (input) =>
      callNativePlugin<{ games: any }>("fetchLibraryGames", input as any).then((r) =>
        typeof r.games === "string" ? JSON.parse(r.games) : r.games ?? []),
    fetchPublicGames: () =>
      callNativePlugin<{ games: any }>("fetchPublicGames").then((r) =>
        typeof r.games === "string" ? JSON.parse(r.games) : r.games ?? []),
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

    getSettings: () =>
      withTimeout(
        callNativePlugin("getSettings"),
        8000,
        // Default settings returned if the plugin hangs
        {
          resolution: "1920x1080", fps: 60, maxBitrateMbps: 75, codec: "H264",
          decoderPreference: "auto", encoderPreference: "auto", colorQuality: "10bit_420",
          region: "", clipboardPaste: false, mouseSensitivity: 1,
          shortcutToggleStats: "F3", shortcutTogglePointerLock: "F8",
          shortcutStopStream: "Ctrl+Shift+Q", shortcutToggleAntiAfk: "Ctrl+Shift+K",
          shortcutToggleMicrophone: "Ctrl+Shift+M", microphoneMode: "disabled",
          microphoneDeviceId: "", hideStreamButtons: false,
          sessionClockShowEveryMinutes: 60, sessionClockShowDurationSeconds: 30,
          windowWidth: 1400, windowHeight: 900,
        } as any
      ),
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

  const platform = getPlatform();
  if (platform === "electron") {
    _api = getElectronApi();
  } else if (platform === "capacitor") {
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
