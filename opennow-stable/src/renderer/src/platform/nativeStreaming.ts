/**
 * nativeStreaming.ts
 *
 * JS-side bridge to NativeStreamingPlugin (Kotlin).
 *
 * On Android this replaces the browser WebRTC path with a fully native
 * PeerConnection that decodes video via MediaCodec (hardware) and renders
 * directly to a SurfaceView overlaid on the WebView.
 *
 * The signaling flow is unchanged — BrowserSignalingClient still handles
 * the WebSocket exchange. Once we have the SDP offer we hand it to the
 * native plugin which does the rest:
 *
 *   offer SDP  →  NativeStreamingPlugin.nativeConnect()
 *                   → PeerConnection (libwebrtc)
 *                   → MediaCodec HW decoder
 *                   → SurfaceView (rendered behind WebView)
 *              ←  answer SDP
 *   answer SDP →  BrowserSignalingClient.sendAnswer()
 *
 * Input (keyboard / mouse / gamepad) continues to flow through the existing
 * JS data-channel path in webrtcClient.ts — only the media receive path
 * is replaced.
 *
 * Usage:
 *   import { isNativeStreamingAvailable, NativeStreamingBridge } from "./nativeStreaming";
 *
 *   if (isNativeStreamingAvailable()) {
 *     const bridge = new NativeStreamingBridge();
 *     const answerSdp = await bridge.connect(offerSdp, iceServers);
 *     bridge.onEvent((e) => { ... });
 *   }
 */

import type { IceServer, IceCandidatePayload } from "@shared/gfn";

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────

export interface NativeStreamEvent {
  type:
    | "connectionState"
    | "iceConnectionState"
    | "iceGatheringComplete"
    | "iceCandidate"
    | "controlMessage";
  state?: string;
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
  data?: string;
}

export interface NativeStreamStats {
  connectionState: string;
  iceConnectionState: string;
}

// ──────────────────────────────────────────────────────────────
// Availability check
// ──────────────────────────────────────────────────────────────

/**
 * Returns true when running inside the Capacitor Android shell AND the
 * NativeStreamingPlugin is registered (i.e. the AAR is present).
 */
export function isNativeStreamingAvailable(): boolean {
  const cap = (window as any).Capacitor;
  if (!cap) return false;
  // Check that the plugin is actually registered
  try {
    return (
      cap.isPluginAvailable?.("NativeStreamingPlugin") === true ||
      cap.Plugins?.NativeStreamingPlugin != null
    );
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────────────────────
// Low-level Capacitor call helper (same pattern as api.ts)
// ──────────────────────────────────────────────────────────────

function callNative(method: string, args: object = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const cap = (window as any).Capacitor;
    if (!cap) return reject(new Error("Capacitor not available"));
    if (cap.nativePromise) {
      cap.nativePromise("NativeStreamingPlugin", method, args).then(resolve).catch(reject);
      return;
    }
    const plugin = cap.Plugins?.NativeStreamingPlugin;
    if (plugin?.[method]) {
      plugin[method](args).then(resolve).catch(reject);
      return;
    }
    reject(new Error(`NativeStreamingPlugin.${method} not found`));
  });
}

// ──────────────────────────────────────────────────────────────
// Event listener bridge
// ──────────────────────────────────────────────────────────────

type EventListener = (event: NativeStreamEvent) => void;
const listeners = new Set<EventListener>();

// Capacitor fires plugin events via window.Capacitor.Plugins[name].addListener
// or via the global CapacitorCustomPlatform event bus depending on version.
// We hook both paths.
function setupEventBridge() {
  const cap = (window as any).Capacitor;
  if (!cap) return;

  const handler = (event: NativeStreamEvent) => {
    for (const cb of listeners) cb(event);
  };

  // Capacitor 6+ event bus
  try {
    cap.addListener?.("NativeStreamingPlugin", "nativeStreamEvent", handler);
  } catch (_) {}

  // Capacitor 4/5 plugin-level listener
  try {
    cap.Plugins?.NativeStreamingPlugin?.addListener?.("nativeStreamEvent", handler);
  } catch (_) {}
}

setupEventBridge();

// ──────────────────────────────────────────────────────────────
// NativeStreamingBridge
// ──────────────────────────────────────────────────────────────

export class NativeStreamingBridge {
  private connected = false;

  /**
   * Start a native stream session.
   *
   * @param offerSdp  The SDP offer received from the GFN signaling server.
   * @param iceServers ICE servers from the session info.
   * @returns The SDP answer to send back via signaling.
   */
  async connect(offerSdp: string, iceServers: IceServer[]): Promise<string> {
    const result = await callNative("nativeConnect", {
      offerSdp,
      iceServers: iceServers.map((s) => ({
        urls: s.urls,
        ...(s.username ? { username: s.username } : {}),
        ...(s.credential ? { credential: s.credential } : {}),
      })),
    });
    this.connected = true;
    return result.answerSdp as string;
  }

  /**
   * Add a remote ICE candidate received from the signaling server.
   */
  async addIceCandidate(candidate: IceCandidatePayload): Promise<void> {
    if (!this.connected) return;
    await callNative("nativeAddIceCandidate", {
      candidate: candidate.candidate,
      sdpMid: candidate.sdpMid ?? null,
      sdpMLineIndex: candidate.sdpMLineIndex ?? 0,
    });
  }

  /**
   * Register a listener for native stream events (connection state changes,
   * local ICE candidates, control channel messages).
   *
   * Returns an unsubscribe function.
   */
  onEvent(listener: EventListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  /**
   * Get current connection stats from the native layer.
   */
  async getStats(): Promise<NativeStreamStats> {
    return callNative("nativeGetStats") as Promise<NativeStreamStats>;
  }

  /**
   * Tear down the native peer connection and remove the SurfaceView overlay.
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;
    this.connected = false;
    await callNative("nativeDisconnect").catch(() => {});
  }
}
