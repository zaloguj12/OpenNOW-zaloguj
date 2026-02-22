/**
 * BrowserSignalingClient -- pure browser WebSocket implementation of GFN signaling.
 *
 * This mirrors GfnSignalingClient from src/main/gfn/signaling.ts but uses the
 * browser's native WebSocket API instead of the Node "ws" package.
 * Used on Android/Capacitor where the WebView provides WebSocket natively.
 */

import type { IceCandidatePayload, MainToRendererSignalingEvent, SendAnswerRequest } from "@shared/gfn";

interface SignalingMessage {
  ackid?: number;
  ack?: number;
  hb?: number;
  peer_info?: { id: number };
  peer_msg?: { from: number; to: number; msg: string };
}

export class BrowserSignalingClient {
  private ws: WebSocket | null = null;
  private peerId = 2;
  private peerName = `peer-${Math.floor(Math.random() * 10_000_000_000)}`;
  private ackCounter = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<(event: MainToRendererSignalingEvent) => void>();

  constructor(
    private readonly signalingServer: string,
    private readonly sessionId: string,
    private readonly signalingUrl?: string,
  ) {}

  private buildSignInUrl(): string {
    let serverWithPort: string;
    if (this.signalingUrl) {
      const withoutScheme = this.signalingUrl.replace(/^wss?:\/\//, "");
      const hostPort = withoutScheme.split("/")[0];
      serverWithPort = hostPort && hostPort.length > 0
        ? (hostPort.includes(":") ? hostPort : `${hostPort}:443`)
        : (this.signalingServer.includes(":") ? this.signalingServer : `${this.signalingServer}:443`);
    } else {
      serverWithPort = this.signalingServer.includes(":")
        ? this.signalingServer
        : `${this.signalingServer}:443`;
    }
    return `wss://${serverWithPort}/nvst/sign_in?peer_id=${this.peerName}&version=2`;
  }

  onEvent(listener: (event: MainToRendererSignalingEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: MainToRendererSignalingEvent): void {
    for (const listener of this.listeners) listener(event);
  }

  private nextAckId(): number {
    return ++this.ackCounter;
  }

  private sendJson(payload: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private setupHeartbeat(): void {
    this.clearHeartbeat();
    this.heartbeatTimer = setInterval(() => this.sendJson({ hb: 1 }), 5000);
  }

  private clearHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private sendPeerInfo(): void {
    this.sendJson({
      ackid: this.nextAckId(),
      peer_info: {
        browser: "Chrome",
        browserVersion: "131",
        connected: true,
        id: this.peerId,
        name: this.peerName,
        peerRole: 0,
        resolution: "1920x1080",
        version: 2,
      },
    });
  }

  connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const url = this.buildSignInUrl();
      const protocol = `x-nv-sessionid.${this.sessionId}`;

      console.log("[BrowserSignaling] Connecting to:", url);

      const ws = new WebSocket(url, protocol);
      this.ws = ws;

      ws.onopen = () => {
        this.sendPeerInfo();
        this.setupHeartbeat();
        this.emit({ type: "connected" });
        resolve();
      };

      ws.onerror = (e) => {
        this.emit({ type: "error", message: `Signaling connect failed: ${String(e)}` });
        reject(new Error("WebSocket connection failed"));
      };

      ws.onclose = (e) => {
        this.clearHeartbeat();
        this.emit({ type: "disconnected", reason: e.reason || "socket closed" });
      };

      ws.onmessage = (e) => {
        this.handleMessage(e.data as string);
      };
    });
  }

  private handleMessage(text: string): void {
    let parsed: SignalingMessage;
    try {
      parsed = JSON.parse(text) as SignalingMessage;
    } catch {
      return;
    }

    if (typeof parsed.ackid === "number" && parsed.peer_info?.id !== this.peerId) {
      this.sendJson({ ack: parsed.ackid });
    }

    if (parsed.hb) {
      this.sendJson({ hb: 1 });
      return;
    }

    if (!parsed.peer_msg?.msg) return;

    let peerPayload: Record<string, unknown>;
    try {
      peerPayload = JSON.parse(parsed.peer_msg.msg) as Record<string, unknown>;
    } catch {
      return;
    }

    if (peerPayload.type === "offer" && typeof peerPayload.sdp === "string") {
      console.log(`[BrowserSignaling] Received OFFER (${peerPayload.sdp.length} chars)`);
      this.emit({ type: "offer", sdp: peerPayload.sdp });
      return;
    }

    if (typeof peerPayload.candidate === "string") {
      this.emit({
        type: "remote-ice",
        candidate: {
          candidate: peerPayload.candidate,
          sdpMid: typeof peerPayload.sdpMid === "string" || peerPayload.sdpMid === null
            ? peerPayload.sdpMid as string | null : undefined,
          sdpMLineIndex: typeof peerPayload.sdpMLineIndex === "number" || peerPayload.sdpMLineIndex === null
            ? peerPayload.sdpMLineIndex as number | null : undefined,
        },
      });
    }
  }

  sendAnswer(payload: SendAnswerRequest): void {
    const answer = {
      type: "answer",
      sdp: payload.sdp,
      ...(payload.nvstSdp ? { nvstSdp: payload.nvstSdp } : {}),
    };
    this.sendJson({
      peer_msg: { from: this.peerId, to: 1, msg: JSON.stringify(answer) },
      ackid: this.nextAckId(),
    });
  }

  sendIceCandidate(candidate: IceCandidatePayload): void {
    this.sendJson({
      peer_msg: {
        from: this.peerId,
        to: 1,
        msg: JSON.stringify({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid,
          sdpMLineIndex: candidate.sdpMLineIndex,
        }),
      },
      ackid: this.nextAckId(),
    });
  }

  disconnect(): void {
    this.clearHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
