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
import { createSession, pollSession, stopSession, getActiveSessions, claimSession } from "@main/gfn/cloudmatch";
import { fetchMainGames, fetchLibraryGames, fetchPublicGames as fetchPublicGamesElectron, resolveLaunchAppId } from "@main/gfn/games";
import { BrowserSignalingClient } from "./browserSignaling";

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
  // Browser-native signaling client (WebSocket running in the WebView).
  // This replaces the Kotlin AndroidSignalingManager + Capacitor event bridge.
  let browserSignaling: BrowserSignalingClient | null = null;
  const signalingListeners = new Set<Function>();
  const fullscreenListeners = new Set<Function>();

  return {
    getAuthSession: (input?) =>
      withTimeout(
        callNativePlugin("getAuthSession", input as any),
        8000,
        { session: null, refresh: { attempted: false, forced: false, outcome: "not_attempted", message: "Plugin timeout" } }
      ),
    getLoginProviders: () =>
      callNativePlugin<{ providers: any[] }>("getLoginProviders").then((r) => r.providers ?? []),
    getRegions: (input?) => {
      const token = (input as any)?.token;
      const baseUrl = (input as any)?.providerStreamingBaseUrl ?? (input as any)?.streamingBaseUrl ?? "";
      return callNativePlugin<{ regions: any[] }>("getRegions", { token, streamingBaseUrl: baseUrl }).then((r) => r.regions ?? []);
    },

    login: (input) => callNativePlugin("login", input as any),
    logout: () => callNativePlugin("logout"),

    fetchSubscription: () => Promise.resolve(null as any),
    fetchMainGames: (input) => fetchMainGames((input as any).token, (input as any).providerStreamingBaseUrl),
    fetchLibraryGames: (input) => fetchLibraryGames((input as any).token, (input as any).providerStreamingBaseUrl),
    fetchPublicGames: () => fetchPublicGamesElectron(),
    resolveLaunchAppId: (input) => resolveLaunchAppId((input as any).token, (input as any).appIdOrUuid, (input as any).providerStreamingBaseUrl),

    createSession: (input) => createSession(input as any),
    pollSession: (input) => pollSession(input as any),
    stopSession: (input) => stopSession(input as any),
    getActiveSessions: (token?, streamingBaseUrl?) => getActiveSessions(token ?? "", streamingBaseUrl ?? ""),
    claimSession: (input) => claimSession(input as any),
    showSessionConflictDialog: () => callNativePlugin("showSessionConflictDialog"),

    connectSignaling: async (input) => {
      browserSignaling?.disconnect();
      browserSignaling = new BrowserSignalingClient(
        (input as any).signalingServer,
        (input as any).sessionId,
        (input as any).signalingUrl,
      );
      browserSignaling.onEvent((event) => {
        for (const cb of signalingListeners) cb(event);
      });
      await browserSignaling.connect();
    },
    disconnectSignaling: async () => {
      browserSignaling?.disconnect();
      browserSignaling = null;
    },
    sendAnswer: async (input) => {
      browserSignaling?.sendAnswer(input as any);
    },
    sendIceCandidate: async (input) => {
      browserSignaling?.sendIceCandidate(input as any);
    },

    onSignalingEvent: (listener) => {
      signalingListeners.add(listener);
      return () => signalingListeners.delete(listener);
    },

    // Fullscreen on Android is handled by the WebView / native layer.
    // We expose no-op implementations so the renderer code compiles unchanged.
    onToggleFullscreen: (listener) => {
      fullscreenListeners.add(listener);
      return () => fullscreenListeners.delete(listener);
    },
    toggleFullscreen: () => callNativePlugin("toggleFullscreen"),
    setOrientation: (mode: string) => callNativePlugin("setOrientation", { mode }),
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
          touchGamepadLayout: "{}",
        } as any
      ),
    setSetting: (key, value) => callNativePlugin("setSetting", { key, value }),
    resetSettings: () => callNativePlugin("resetSettings"),
    pingRegions: (urls: string[]) =>
      callNativePlugin<{ results: Record<string, number> }>("pingRegions", { urls }),
  };
}

// --- Native Stream API (Android native WebRTC path) ---

/**
 * Start a native WebRTC stream, bypassing the WebView-based RTCPeerConnection.
 * The Kotlin NativeStreamManager handles the PeerConnection, video rendering
 * (SurfaceViewRenderer), and DataChannels natively.
 *
 * The answer is NOT returned directly — it arrives via the "nativeStreamAnswer"
 * event which the caller must listen for and forward to signaling.
 */
export async function startNativeStream(params: {
  offerSdp: string;
  serverIp: string;
  mediaConnectionIp?: string;
  mediaConnectionPort: number;
  iceServers: string; // JSON stringified array
  codec: string;
  colorQuality: string;
  resolution: string;
  fps: number;
  maxBitrateKbps: number;
  signalingServer: string;
}): Promise<void> {
  await callCapacitor("GfnPlugin", "startNativeStream", params);
}

/**
 * Stop the native stream and tear down the PeerConnection.
 */
export async function stopNativeStream(): Promise<void> {
  await callCapacitor("GfnPlugin", "stopNativeStream", {});
}

/**
 * Forward a trickle ICE candidate from signaling to the native PeerConnection.
 */
export async function addNativeIceCandidate(candidate: {
  candidate: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
}): Promise<void> {
  await callCapacitor("GfnPlugin", "addNativeIceCandidate", candidate);
}

/**
 * Send input to the native DataChannel.
 * Used by the touch gamepad overlay to send encoded input.
 */
export async function sendNativeInput(input: Record<string, unknown>): Promise<void> {
  await callCapacitor("GfnPlugin", "sendNativeInput", input);
}

/**
 * Get the current state and diagnostics from the native stream manager.
 */
export async function getNativeStreamState(): Promise<{
  state: string;
  inputReady: boolean;
  connectionState: string;
  bitrateKbps: number;
  rttMs: number;
}> {
  return callCapacitor("GfnPlugin", "getNativeStreamState", {});
}

/**
 * Listen for events emitted by the native stream manager.
 * Events:
 *   - "nativeStreamAnswer": { sdp: string, nvstSdp: string }
 *   - "nativeIceCandidate": { candidate: string, sdpMid: string, sdpMLineIndex: number }
 *   - "nativeStreamError": { error: string }
 */
export function addNativeStreamListener(
  eventName: string,
  callback: (data: any) => void,
): (() => void) | undefined {
  const cap = (window as any).Capacitor;
  if (!cap) return undefined;

  // Capacitor plugin event listener
  const pluginHandle = cap.Plugins?.GfnPlugin;
  if (pluginHandle?.addListener) {
    const handle = pluginHandle.addListener(eventName, callback);
    return () => handle?.remove?.();
  }
  return undefined;
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

