import crypto from "node:crypto";
import dns from "node:dns";

import type {
  ActiveSessionInfo,
  ColorQuality,
  NegotiatedStreamProfile,
  IceServer,
  SessionAdAction,
  SessionAdInfo,
  SessionAdState,
  SessionClaimRequest,
  SessionCreateRequest,
  SessionInfo,
  SessionPollRequest,
  SessionStopRequest,
  StreamSettings,
} from "@shared/gfn";

import {
  DEFAULT_KEYBOARD_LAYOUT,
  colorQualityBitDepth,
  colorQualityChromaFormat,
  resolveGfnKeyboardLayout,
} from "@shared/gfn";

import type { CloudMatchRequest, CloudMatchResponse, GetSessionsResponse } from "./types";
import { SessionError } from "./errorCodes";

import { buildDeviceHeaders } from "@shared/deviceHeaders";

const GFN_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 NVIDIACEFClient/HEAD/debb5919f6 GFN-PC/2.0.80.173";
const GFN_CLIENT_VERSION = "2.0.80.173";
const SESSION_MODIFY_ACTION_AD_UPDATE = 6;
const READY_SESSION_STATUSES = new Set([2, 3]);

const AD_ACTION_CODES: Record<SessionAdAction, number> = {
  start: 1,
  pause: 2,
  resume: 3,
  finish: 4,
  cancel: 5,
};

const GFN_AD_MEDIA_PROFILE_ORDER = new Map<string, number>([
  ["mp4deinterlaced720p", 0],
  ["webm", 1],
  ["hlsadaptive", 2],
]);

function isReadySessionStatus(status: number): boolean {
  return READY_SESSION_STATUSES.has(status);
}

async function resolveHostnameWithFallback(hostname: string): Promise<string | null> {
  // Try system resolver first, then fall back to Cloudflare (1.1.1.1) and Google (8.8.8.8)
  try {
    const r = await dns.promises.lookup(hostname);
    if (r && (r as any).address) return (r as any).address;
  } catch {
    // ignore and try custom resolvers
  }

  const fallbackServers = ["1.1.1.1", "8.8.8.8"];
  for (const server of fallbackServers) {
    try {
      const resolver = new dns.Resolver();
      resolver.setServers([server]);
      const addrs: string[] = await new Promise((resolve, reject) => {
        resolver.resolve4(hostname, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });
      if (addrs && addrs.length > 0) return addrs[0];
    } catch {
      // try next fallback
    }
  }

  return null;
}

async function normalizeIceServers(response: CloudMatchResponse): Promise<IceServer[]> {
  const raw = response.session.iceServerConfiguration?.iceServers ?? [];
  const servers = raw
    .map((entry) => {
      const urls = Array.isArray(entry.urls) ? entry.urls : [entry.urls];
      return {
        urls,
        username: entry.username,
        credential: entry.credential,
      };
    })
    .filter((entry) => entry.urls.length > 0);

  if (servers.length > 0) {
    // Attempt to resolve any hostnames in STUN/TURN URLs to IPs to avoid relying on the
    // renderer's DNS resolution. This makes it possible to try alternate DNS servers
    // when the system resolver fails.
    const resolvedServers: IceServer[] = [];
    for (const s of servers) {
      const resolvedUrls: string[] = [];
      for (const u of s.urls) {
          try {
          const m = u.match(/^([a-zA-Z0-9+.-]+):([^/]+)/);
          if (m) {
            const scheme = m[1];
            const hostPort = m[2];
            const host = hostPort.split(":")[0];
            const portPart = hostPort.includes(":") ? ":" + hostPort.split(":").slice(1).join(":") : "";

            // Helper to bracket IPv6 literals when necessary
            const bracketIfIpv6 = (h: string) => {
              if (h.startsWith("[") && h.endsWith("]")) return h;
              // Heuristic: contains ':' and is not an IPv4 dotted-quad
              if (h.includes(":") && !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(h)) {
                return `[${h}]`;
              }
              return h;
            };

            // If host already looks like an IPv4 or bracketed IPv6, keep original URL
            if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) || /^\[[0-9a-fA-F:]+\]$/.test(host)) {
              resolvedUrls.push(u);
            } else {
              const ip = await resolveHostnameWithFallback(host);
              const finalHost = ip ?? host;
              const maybeBracketted = bracketIfIpv6(finalHost);
              resolvedUrls.push(`${scheme}:${maybeBracketted}${portPart}`);
            }
          } else {
            resolvedUrls.push(u);
          }
        } catch {
          resolvedUrls.push(u);
        }
      }
      resolvedServers.push({ urls: resolvedUrls, username: s.username, credential: s.credential });
    }

    return resolvedServers;
  }

  // Default fallbacks — try to resolve known STUN hostnames to IPs as well
  const defaults = ["s1.stun.gamestream.nvidia.com:19308", "stun.l.google.com:19302", "stun1.l.google.com:19302"];
  const out: IceServer[] = [];
  for (const d of defaults) {
    const parts = d.split(":");
    const host = parts[0];
    const port = parts.length > 1 ? `:${parts.slice(1).join(":")}` : "";
    const ip = await resolveHostnameWithFallback(host);
    const bracketIfIpv6 = (h: string) => (h.includes(":") && !h.startsWith("[") ? `[${h}]` : h);
    if (ip) out.push({ urls: [`stun:${bracketIfIpv6(ip)}${port}`] });
    else out.push({ urls: [`stun:${bracketIfIpv6(host)}${port}`] });
  }

  return out;
}

/**
 * Extract the streaming server IP from the CloudMatch response, matching Rust's
 * `streaming_server_ip()` priority chain:
 *   1. connectionInfo[usage==14].ip (direct IP)
 *   2. Host extracted from connectionInfo[usage==14].resourcePath (for rtsps:// URLs)
 *   3. sessionControlInfo.ip (fallback)
 */
function streamingServerIp(response: CloudMatchResponse): string | null {
  const connections = response.session.connectionInfo ?? [];
  const sigConn = connections.find((conn) => conn.usage === 14);

  if (sigConn) {
    // Priority 1: Direct IP field
    const rawIp = sigConn.ip;
    const directIp = Array.isArray(rawIp) ? rawIp[0] : rawIp;
    if (directIp && directIp.length > 0) {
      return directIp;
    }

    // Priority 2: Extract host from resourcePath (Alliance format: rtsps://host:port)
    if (sigConn.resourcePath) {
      const host = extractHostFromUrl(sigConn.resourcePath);
      if (host) return host;
    }
  }

  // Priority 3: sessionControlInfo.ip
  const controlIp = response.session.sessionControlInfo?.ip;
  if (controlIp && controlIp.length > 0) {
    return Array.isArray(controlIp) ? controlIp[0] : controlIp;
  }

  return null;
}

/**
 * Extract host from a URL string (handles rtsps://, rtsp://, wss://, https://).
 * Matches Rust's extract_host_from_url().
 */
function extractHostFromUrl(url: string): string | null {
  const prefixes = ["rtsps://", "rtsp://", "wss://", "https://"];
  let afterProto: string | null = null;
  for (const prefix of prefixes) {
    if (url.startsWith(prefix)) {
      afterProto = url.slice(prefix.length);
      break;
    }
  }
  if (!afterProto) return null;

  // Get host (before port or path)
  const host = afterProto.split(":")[0]?.split("/")[0];
  if (!host || host.length === 0 || host.startsWith(".")) return null;
  return host;
}

/**
 * Check if a given IP/hostname is a CloudMatch zone load balancer hostname
 * (not a real game server IP). Zone hostnames look like:
 *   np-ams-06.cloudmatchbeta.nvidiagrid.net
 */
function isZoneHostname(ip: string): boolean {
  return ip.includes("cloudmatchbeta.nvidiagrid.net") || ip.includes("cloudmatch.nvidiagrid.net");
}

function resolveSignaling(response: CloudMatchResponse): {
  serverIp: string;
  signalingServer: string;
  signalingUrl: string;
  mediaConnectionInfo?: { ip: string; port: number };
} {
  const connections = response.session.connectionInfo ?? [];
  const signalingConnection =
    connections.find((conn) => conn.usage === 14 && conn.ip) ?? connections.find((conn) => conn.ip);

  // Use the Rust-matching priority chain for server IP
  const serverIp = streamingServerIp(response);
  if (!serverIp) {
    throw new Error("CloudMatch response did not include a signaling host");
  }

  const resourcePath = signalingConnection?.resourcePath ?? "/nvst/";

  // Build signaling URL matching Rust's build_signaling_url() behavior:
  // - rtsps://host:port -> extract host, convert to wss://host/nvst/
  // - wss://... -> use as-is
  // - /path -> wss://serverIp:443/path
  // - fallback -> wss://serverIp:443/nvst/
  const { signalingUrl, signalingHost } = buildSignalingUrl(resourcePath, serverIp);

  // Use the resolved signaling host (which may differ from serverIp if extracted from rtsps:// URL)
  const effectiveHost = signalingHost ?? serverIp;
  const signalingServer = effectiveHost.includes(":")
    ? effectiveHost
    : `${effectiveHost}:443`;

  return {
    serverIp,
    signalingServer,
    signalingUrl,
    mediaConnectionInfo: resolveMediaConnectionInfo(connections, serverIp, {
      logMissing: isReadySessionStatus(response.session.status),
    }),
  };
}

/**
 * Resolve the media connection endpoint (IP + port) from the session's connectionInfo array.
 * Matches Rust's media_connection_info() priority chain:
 *   1. usage=2 (Primary media path, UDP)
 *   2. usage=17 (Alternative media path)
 *   3. usage=14 with highest port (Alliance fallback — distinguishes media port from signaling port)
 *   4. Fallback: use serverIp with the highest port from any usage=14 entry
 *
 * For each entry, IP is extracted from:
 *   a. The .ip field directly
 *   b. The hostname in .resourcePath (e.g. rtsps://80-250-97-40.server.net:48322)
 *   c. Fallback to serverIp (only for usage=14 Alliance fallback)
 */
function resolveMediaConnectionInfo(
  connections: Array<{ ip?: string; port: number; usage: number; protocol?: number; resourcePath?: string }>,
  serverIp: string,
  options?: { logMissing?: boolean },
): { ip: string; port: number } | undefined {
  // Helper: extract IP from a connection entry
  const extractIp = (conn: { ip?: string; resourcePath?: string }): string | null => {
    // Try direct IP field
    const rawIp = conn.ip;
    const directIp = Array.isArray(rawIp) ? rawIp[0] : rawIp;
    if (directIp && directIp.length > 0) return directIp;

    // Try hostname from resourcePath
    if (conn.resourcePath) {
      const host = extractHostFromUrl(conn.resourcePath);
      if (host) return host;
    }

    return null;
  };

  // Helper: extract port from a connection entry (fallback to resourcePath URL port)
  const extractPort = (conn: { port: number; resourcePath?: string }): number => {
    if (conn.port > 0) return conn.port;

    // Try extracting port from resourcePath URL
    if (conn.resourcePath) {
      try {
        const url = new URL(conn.resourcePath.replace("rtsps://", "https://").replace("rtsp://", "http://"));
        const portStr = url.port;
        if (portStr) return parseInt(portStr, 10);
      } catch {
        // Ignore
      }
    }

    return 0;
  };

  // Priority 1: usage=2 (Primary media path, UDP)
  const primary = connections.find((c) => c.usage === 2);
  if (primary) {
    const ip = extractIp(primary);
    const port = extractPort(primary);
    console.log(`[CloudMatch] resolveMediaConnectionInfo: usage=2 candidate: ip=${ip}, port=${port}`);
    if (ip && port > 0) return { ip, port };
  }

  // Priority 2: usage=17 (Alternative media path)
  const alt = connections.find((c) => c.usage === 17);
  if (alt) {
    const ip = extractIp(alt);
    const port = extractPort(alt);
    console.log(`[CloudMatch] resolveMediaConnectionInfo: usage=17 candidate: ip=${ip}, port=${port}`);
    if (ip && port > 0) return { ip, port };
  }

  // Priority 3: usage=14 with highest port (Alliance fallback)
  const alliance = connections
    .filter((c) => c.usage === 14)
    .sort((a, b) => b.port - a.port);

  for (const conn of alliance) {
    const ip = extractIp(conn) ?? serverIp;
    const port = extractPort(conn);
    console.log(`[CloudMatch] resolveMediaConnectionInfo: usage=14 candidate: ip=${ip}, port=${port} (serverIp fallback=${serverIp})`);
    if (ip && port > 0) return { ip, port };
  }

  if (options?.logMissing) {
    console.warn(`[CloudMatch] resolveMediaConnectionInfo: NO valid media connection info found (serverIp=${serverIp})`);
  }
  return undefined;
}

/**
 * Build signaling WSS URL from the resourcePath, matching Rust implementation.
 * Returns the URL and optionally the extracted host (if different from serverIp).
 */
function buildSignalingUrl(
  raw: string,
  serverIp: string,
): { signalingUrl: string; signalingHost: string | null } {
  if (raw.startsWith("rtsps://") || raw.startsWith("rtsp://")) {
    // Extract hostname from RTSP URL, convert to wss://
    const withoutScheme = raw.startsWith("rtsps://")
      ? raw.slice("rtsps://".length)
      : raw.slice("rtsp://".length);
    const host = withoutScheme.split(":")[0]?.split("/")[0];
    if (host && host.length > 0 && !host.startsWith(".")) {
      return {
        signalingUrl: `wss://${host}/nvst/`,
        signalingHost: host,
      };
    }
    return {
      signalingUrl: `wss://${serverIp}:443/nvst/`,
      signalingHost: null,
    };
  }

  if (raw.startsWith("wss://")) {
    // Already a full WSS URL, use as-is; extract host
    const withoutScheme = raw.slice("wss://".length);
    const host = withoutScheme.split("/")[0] ?? null;
    return { signalingUrl: raw, signalingHost: host };
  }

  if (raw.startsWith("/")) {
    // Relative path
    return {
      signalingUrl: `wss://${serverIp}:443${raw}`,
      signalingHost: null,
    };
  }

  // Fallback
  return {
    signalingUrl: `wss://${serverIp}:443/nvst/`,
    signalingHost: null,
  };
}

function requestHeaders(token: string): Record<string, string> {
  const clientId = crypto.randomUUID();
  const deviceId = crypto.randomUUID();
  // Use the shared device header builder so Android and desktop stay in sync.
  return buildDeviceHeaders(token, clientId, deviceId, false);
}

function parseResolution(input: string): { width: number; height: number } {
  const [rawWidth, rawHeight] = input.split("x");
  const width = Number.parseInt(rawWidth ?? "", 10);
  const height = Number.parseInt(rawHeight ?? "", 10);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 1920, height: 1080 };
  }

  return { width, height };
}

function timezoneOffsetMs(): number {
  return -new Date().getTimezoneOffset() * 60 * 1000;
}

function buildSessionRequestBody(input: SessionCreateRequest): CloudMatchRequest {
  const { width, height } = parseResolution(input.settings.resolution);
  const requestedZoneAddress = input.requestedZoneAddress?.trim() || undefined;
  const cq = input.settings.colorQuality;
  // IMPORTANT: hdrEnabled is a SEPARATE toggle from color quality.
  // The Rust reference (cloudmatch.rs) uses settings.hdr_enabled independently.
  // 10-bit color depth does NOT mean HDR — you can have 10-bit SDR.
  // Conflating them caused the server to set up an HDR pipeline, which
  // dynamically downscaled resolution to ~540p.
  const hdrEnabled = false; // No HDR toggle implemented yet; hardcode off like claim body
  const bitDepth = colorQualityBitDepth(cq);
  const chromaFormat = colorQualityChromaFormat(cq);
  const accountLinked = input.accountLinked ?? true;

  return {
    sessionRequestData: {
      appId: input.appId,
      internalTitle: input.internalTitle || null,
      availableSupportedControllers: [],
      networkTestSessionId: null,
      parentSessionId: null,
      clientIdentification: "GFN-PC",
      deviceHashId: crypto.randomUUID(),
      clientVersion: "30.0",
      sdkVersion: "1.0",
      streamerVersion: 1,
      clientPlatformName: "windows",
      clientRequestMonitorSettings: [
        {
          widthInPixels: width,
          heightInPixels: height,
          framesPerSecond: input.settings.fps,
          sdrHdrMode: hdrEnabled ? 1 : 0,
          displayData: {
            desiredContentMaxLuminance: hdrEnabled ? 1000 : 0,
            desiredContentMinLuminance: 0,
            desiredContentMaxFrameAverageLuminance: hdrEnabled ? 500 : 0,
          },
          dpi: 100,
        },
      ],
      useOps: true,
      audioMode: 2,
      metaData: [
        { key: "SubSessionId", value: crypto.randomUUID() },
        { key: "wssignaling", value: "1" },
        { key: "GSStreamerType", value: "WebRTC" },
        { key: "networkType", value: "Unknown" },
        { key: "ClientImeSupport", value: "0" },
        {
          key: "clientPhysicalResolution",
          value: JSON.stringify({ horizontalPixels: width, verticalPixels: height }),
        },
        { key: "surroundAudioInfo", value: "2" },
      ],
      sdrHdrMode: hdrEnabled ? 1 : 0,
      clientDisplayHdrCapabilities: hdrEnabled
        ? {
            version: 1,
            hdrEdrSupportedFlagsInUint32: 1,
            staticMetadataDescriptorId: 0,
          }
        : null,
      surroundAudioInfo: 0,
      remoteControllersBitmap: 0,
      clientTimezoneOffset: timezoneOffsetMs(),
      enhancedStreamMode: 1,
      appLaunchMode: 1,
      secureRTSPSupported: false,
      partnerCustomData: "",
      accountLinked,
      enablePersistingInGameSettings: true,
      userAge: 26,
      ...(requestedZoneAddress ? { requestedZoneAddress } : {}),
      requestedStreamingFeatures: {
        reflex: input.settings.fps >= 120,
        bitDepth,
        cloudGsync: false,
        enabledL4S: false,
        mouseMovementFlags: 0,
        trueHdr: hdrEnabled,
        supportedHidDevices: 0,
        profile: 0,
        fallbackToLogicalResolution: false,
        hidDevices: null,
        chromaFormat,
        prefilterMode: 0,
        prefilterSharpness: 0,
        prefilterNoiseReduction: 0,
        hudStreamingMode: 0,
        sdrColorSpace: 2,
        hdrColorSpace: hdrEnabled ? 4 : 0,
      },
    },
  };
}

function cloudmatchUrl(zone: string): string {
  return `https://${zone}.cloudmatchbeta.nvidiagrid.net`;
}

function resolveStreamingBaseUrl(zone: string, provided?: string): string {
  if (provided && provided.trim()) {
    const trimmed = provided.trim();
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
  }
  return cloudmatchUrl(zone);
}

function shouldUseServerIp(baseUrl: string): boolean {
  return baseUrl.includes("cloudmatchbeta.nvidiagrid.net");
}

function resolvePollStopBase(zone: string, provided?: string, serverIp?: string): string {
  const base = resolveStreamingBaseUrl(zone, provided);
  // Only use serverIp if it's a real server IP (not a zone hostname).
  // The Rust version checks: if we're NOT an alliance partner AND we have a server_ip, use it.
  // But if the "serverIp" is actually the zone hostname (from an early poll when connectionInfo
  // was empty), using it is circular and doesn't help.
  if (serverIp && shouldUseServerIp(base) && !isZoneHostname(serverIp)) {
    return `https://${serverIp}`;
  }
  return base;
}

function toPositiveInt(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = Math.trunc(value);
    return normalized > 0 ? normalized : undefined;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  }
  return undefined;
}

function extractQueuePosition(payload: CloudMatchResponse): number | undefined {
  // Primary: seatSetupInfo (official client reads seatSetupInfo.queuePosition when seatSetupStep==1)
  const seat = payload.session.seatSetupInfo;
  if (seat?.seatSetupStep === 1) {
    const pos = toPositiveInt(seat.queuePosition);
    if (pos !== undefined) return pos;
  }

  // Fallback: direct field
  const direct = toPositiveInt(payload.session.queuePosition);
  if (direct !== undefined) return direct;

  // Fallback: sessionProgress
  const nestedSessionProgress = payload.session.sessionProgress;
  if (nestedSessionProgress) {
    const nested = toPositiveInt(nestedSessionProgress.queuePosition);
    if (nested !== undefined) return nested;
  }

  // Fallback: progressInfo
  const nestedProgressInfo = payload.session.progressInfo;
  if (nestedProgressInfo) {
    const nested = toPositiveInt(nestedProgressInfo.queuePosition);
    if (nested !== undefined) return nested;
  }

  return undefined;
}

function extractQueueEta(payload: CloudMatchResponse): number | undefined {
  // Primary: seatSetupInfo.seatSetupEta (seconds)
  const seat = payload.session.seatSetupInfo;
  if (seat?.seatSetupStep === 1 && typeof seat.seatSetupEta === "number" && seat.seatSetupEta > 0) {
    return seat.seatSetupEta;
  }

  // Fallback: direct eta
  if (typeof payload.session.eta === "number" && payload.session.eta > 0) {
    return payload.session.eta;
  }

  // Fallback: sessionProgress.eta
  const eta1 = payload.session.sessionProgress?.eta;
  if (typeof eta1 === "number" && eta1 > 0) return eta1;

  // Fallback: progressInfo.eta
  const eta2 = payload.session.progressInfo?.eta;
  if (typeof eta2 === "number" && eta2 > 0) return eta2;

  return undefined;
}

function mergeAdState(
  previous: SessionAdState | undefined,
  next: SessionAdState,
): SessionAdState {
  // When the server sends an empty ad list during the grace period (right after starting
  // an ad), preserve the previous ad list so the UI doesn't flicker to "watch ad" briefly.
  if (next.serverSentEmptyAds && previous) {
    return {
      ...previous,
      ...next,
      sessionAds: previous.sessionAds,
      ads: previous.ads,
      serverSentEmptyAds: true,
    };
  }
  return next;
}

function extractAdState(response: CloudMatchResponse): SessionAdState | undefined {
  const ads = response.session.sessionAds ?? response.session.sessionAds;
  const isRequired = response.session.isAdsRequired ?? response.session.sessionAdsRequired;
  const sessionAdsArray = Array.isArray(ads) ? ads : [];
  // Normalize to unified SessionAdInfo shape
  const normalizedAds: SessionAdInfo[] = sessionAdsArray.map((ad) => ({
    adId: ad.adId ?? "",
    adState: ad.adState,
    adUrl: ad.adUrl ?? ad.mediaUrl ?? ad.videoUrl ?? ad.url,
    mediaUrl: ad.mediaUrl ?? ad.adUrl ?? ad.videoUrl ?? ad.url,
    adMediaFiles: ad.adMediaFiles,
    clickThroughUrl: ad.clickThroughUrl,
    adLengthInSeconds: ad.adLengthInSeconds,
    durationMs: ad.durationMs ?? ad.durationInMs,
    title: ad.title,
    description: ad.description,
  }));

  // Opportunistic metadata
  const opportunity = response.session.opportunity;
  const serverSentEmptyAds = ads === null;

  if (normalizedAds.length === 0 && !isRequired && !opportunity) {
    return undefined;
  }

  return {
    isAdsRequired: Boolean(isRequired),
    sessionAdsRequired: response.session.sessionAdsRequired,
    isQueuePaused: opportunity?.queuePaused,
    gracePeriodSeconds: opportunity?.gracePeriodSeconds,
    message: opportunity?.message ?? opportunity?.description,
    sessionAds: normalizedAds,
    ads: normalizedAds,
    opportunity: opportunity
      ? {
          state: opportunity.state,
          queuePaused: opportunity.queuePaused,
          gracePeriodSeconds: opportunity.gracePeriodSeconds,
          message: opportunity.message,
          title: opportunity.title,
          description: opportunity.description,
        }
      : undefined,
    serverSentEmptyAds,
    enableL4S: response.session.finalizedStreamingFeatures?.enabledL4S,
  };
}

function extractNegotiatedStreamProfile(response: CloudMatchResponse): NegotiatedStreamProfile | undefined {
  const sessionRequest = response.session.sessionRequestData;
  const finalized = response.session.finalizedStreamingFeatures;

  // Prefer finalized settings from the session if present
  const bitDepth = finalized?.bitDepth ?? sessionRequest?.requestedStreamingFeatures?.bitDepth;
  const chromaFormat = finalized?.chromaFormat ?? sessionRequest?.requestedStreamingFeatures?.chromaFormat;
  const enabledL4S = finalized?.enabledL4S ?? sessionRequest?.requestedStreamingFeatures?.enabledL4S;

  if (bitDepth === undefined && chromaFormat === undefined && enabledL4S === undefined) {
    return undefined;
  }

  let colorQuality: ColorQuality | undefined;
  if (typeof bitDepth === "number" && typeof chromaFormat === "number") {
    if (bitDepth === 10 && chromaFormat === 2) colorQuality = "10bit_444";
    else if (bitDepth === 10 && chromaFormat === 0) colorQuality = "10bit_420";
    else if (bitDepth === 0 && chromaFormat === 2) colorQuality = "8bit_444";
    else if (bitDepth === 0 && chromaFormat === 0) colorQuality = "8bit_420";
  }

  const monitor = response.session.monitorSettings?.[0];
  const resolution = monitor
    ? `${monitor.widthInPixels ?? 0}x${monitor.heightInPixels ?? 0}`
    : undefined;
  const fps = monitor?.framesPerSecond ?? undefined;

  return {
    resolution,
    fps,
    colorQuality,
    enableL4S: enabledL4S,
  };
}

async function toSessionInfo(zone: string, streamingBaseUrl: string, payload: CloudMatchResponse): Promise<SessionInfo> {
  if (payload.requestStatus.statusCode !== 1) {
    // Use SessionError for parsing error responses
    const errorJson = JSON.stringify(payload);
    throw SessionError.fromResponse(200, errorJson);
  }

  const signaling = resolveSignaling(payload);
  const queuePosition = extractQueuePosition(payload);
  const queueEta = extractQueueEta(payload);
  const adState = extractAdState(payload);

  // Debug logging to trace signaling resolution
  const connections = payload.session.connectionInfo ?? [];
  console.log(
    `[CloudMatch] toSessionInfo: status=${payload.session.status}, ` +
    `queuePosition=${queuePosition ?? "n/a"}, ` +
    `connectionInfo=${connections.length} entries, ` +
    `serverIp=${signaling.serverIp}, ` +
    `signalingServer=${signaling.signalingServer}, ` +
    `signalingUrl=${signaling.signalingUrl}`,
  );
  for (const conn of connections) {
    console.log(
      `[CloudMatch]   conn: usage=${conn.usage} ip=${conn.ip ?? "null"} port=${conn.port} ` +
      `resourcePath=${conn.resourcePath ?? "null"}`,
    );
  }

  return {
    sessionId: payload.session.sessionId,
    status: payload.session.status,
    queuePosition,
    queueEta,
    adState,
    seatSetupStep: payload.session.seatSetupInfo?.seatSetupStep,
    zone,
    streamingBaseUrl,
    serverIp: signaling.serverIp,
    signalingServer: signaling.signalingServer,
    signalingUrl: signaling.signalingUrl,
    gpuType: payload.session.gpuType,
    iceServers: await normalizeIceServers(payload),
    mediaConnectionInfo: signaling.mediaConnectionInfo,
    negotiatedStreamProfile: extractNegotiatedStreamProfile(payload),
    clientId: undefined,
    deviceId: undefined,
  };
}

export async function createSession(input: SessionCreateRequest): Promise<SessionInfo> {
  if (!input.token) {
    throw new Error("Missing token for session creation");
  }

  if (!/^\d+$/.test(input.appId)) {
    throw new Error(`Invalid launch appId '${input.appId}' (must be numeric)`);
  }

  const body = buildSessionRequestBody(input);
  console.log("[DEBUG] session request body:", JSON.stringify(body, null, 2));

  const base = resolveStreamingBaseUrl(input.zone, input.streamingBaseUrl);
  const url = `${base}/v2/session?keyboardLayout=en-US&languageCode=en_US`;
  const response = await fetch(url, {
    method: "POST",
    headers: requestHeaders(input.token),
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    // Use SessionError to parse and throw detailed error
    throw SessionError.fromResponse(response.status, text);
  }

  const payload = JSON.parse(text) as CloudMatchResponse;
  // Log full raw response so we can see if server returned serverId, assignedZone, etc.
  console.log("[DEBUG] createSession raw response:", JSON.stringify(payload, null, 2));
  return await toSessionInfo(input.zone, base, payload);
}

export async function pollSession(input: SessionPollRequest): Promise<SessionInfo> {
  if (!input.token) {
    throw new Error("Missing token for session polling");
  }

  const base = resolvePollStopBase(input.zone, input.streamingBaseUrl, input.serverIp);
  const url = `${base}/v2/session/${input.sessionId}`;
  const headers = requestHeaders(input.token);
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const text = await response.text();
  if (!response.ok) {
    throw SessionError.fromResponse(response.status, text);
  }

  const payload = JSON.parse(text) as CloudMatchResponse;

  // Merge ad state to avoid flickering during grace periods
  const previousAdState = (globalThis as { lastAdState?: SessionAdState }).lastAdState;
  const currentAdState = extractAdState(payload);
  const mergedAdState = currentAdState && previousAdState
    ? mergeAdState(previousAdState, currentAdState)
    : currentAdState;
  if (mergedAdState) {
    (globalThis as { lastAdState?: SessionAdState }).lastAdState = mergedAdState;
  }

  // Match Rust behavior: if the poll was routed through the zone load balancer
  // and the response now contains a real server IP in connectionInfo, re-poll
  // directly via the real server IP. This ensures the signaling data and
  // connection info are correct (the zone LB may return different data than
  // a direct server poll).
  const realServerIp = streamingServerIp(payload);
  const polledViaZone = isZoneHostname(new URL(base).hostname);
  const realIpDiffers =
    realServerIp &&
    realServerIp.length > 0 &&
    !isZoneHostname(realServerIp) &&
    realServerIp !== input.serverIp;

  // Log poll response when session becomes ready (status 2 or 3) so we can check assigned zone
  if (payload.session.status === 2 || payload.session.status === 3) {
    console.log("[DEBUG] pollSession ready response:", JSON.stringify(payload, null, 2));
  }

  if (polledViaZone && realIpDiffers && (payload.session.status === 2 || payload.session.status === 3)) {
    // Session is ready and we now know the real server IP — re-poll directly
    console.log(
      `[CloudMatch] Session ready: re-polling via real server IP ${realServerIp} (was: ${new URL(base).hostname})`,
    );
    const directBase = `https://${realServerIp}`;
    const directUrl = `${directBase}/v2/session/${input.sessionId}`;
    try {
      const directResponse = await fetch(directUrl, {
        method: "GET",
        headers,
      });
      if (directResponse.ok) {
        const directText = await directResponse.text();
        const directPayload = JSON.parse(directText) as CloudMatchResponse;
        if (directPayload.requestStatus.statusCode === 1) {
          console.log("[CloudMatch] Direct re-poll succeeded, using direct response for signaling info");
          return await toSessionInfo(input.zone, directBase, directPayload);
        }
      }
    } catch (e) {
      // Direct poll failed — fall through to use the original zone LB response
      console.warn("[CloudMatch] Direct re-poll failed, using zone LB response:", e);
    }
  }

  return await toSessionInfo(input.zone, base, payload);
}

export async function stopSession(input: SessionStopRequest): Promise<void> {
  if (!input.token) {
    throw new Error("Missing token for session stop");
  }

  const base = resolvePollStopBase(input.zone, input.streamingBaseUrl, input.serverIp);
  const url = `${base}/v2/session/${input.sessionId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: requestHeaders(input.token),
  });

  if (!response.ok) {
    const text = await response.text();
    // Use SessionError to parse and throw detailed error
    throw SessionError.fromResponse(response.status, text);
  }
}

/**
 * Get list of active sessions (status 2 or 3)
 * Returns sessions that are Ready or Streaming
 */
export async function getActiveSessions(
  token: string,
  streamingBaseUrl: string,
): Promise<ActiveSessionInfo[]> {
  if (!token) {
    throw new Error("Missing token for getting active sessions");
  }

  const deviceId = crypto.randomUUID();
  const clientId = crypto.randomUUID();

  const base = streamingBaseUrl.trim().endsWith("/")
    ? streamingBaseUrl.trim().slice(0, -1)
    : streamingBaseUrl.trim();
  const url = `${base}/v2/session`;

  const headers = buildDeviceHeaders(token, clientId, deviceId, false);

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const text = await response.text();

  if (!response.ok) {
    // Return empty list on failure (matching Rust behavior)
    console.warn(`Get sessions failed: ${response.status} - ${text.slice(0, 200)}`);
    return [];
  }

  let sessionsResponse: GetSessionsResponse;
  try {
    sessionsResponse = JSON.parse(text) as GetSessionsResponse;
  } catch {
    return [];
  }

  if (sessionsResponse.requestStatus.statusCode !== 1) {
    console.warn(`Get sessions API error: ${sessionsResponse.requestStatus.statusDescription}`);
    return [];
  }

  // Filter active sessions (status 2 = Ready, status 3 = Streaming)
  const activeSessions: ActiveSessionInfo[] = sessionsResponse.sessions
    .filter((s) => s.status === 2 || s.status === 3)
    .map((s) => {
      // Extract appId from sessionRequestData
      const appId = s.sessionRequestData?.appId ? Number(s.sessionRequestData.appId) : 0;

      // Get server IP from sessionControlInfo
      const serverIp = s.sessionControlInfo?.ip;

      // Build signaling URL from connection info
      const connInfo = s.connectionInfo?.find((conn) => conn.usage === 14 && conn.ip);
      const connIp = connInfo?.ip;
      const signalingUrl = Array.isArray(connIp)
        ? connIp.map((ip: string) => `wss://${ip}:443/nvst/`)
        : typeof connIp === "string"
          ? [`wss://${connIp}:443/nvst/`]
          : Array.isArray(serverIp)
            ? serverIp.map((ip: string) => `wss://${ip}:443/nvst/`)
            : typeof serverIp === "string"
              ? [`wss://${serverIp}:443/nvst/`]
              : undefined;

      // Extract resolution and fps from monitor settings
      const monitorSettings = s.monitorSettings?.[0];
      const resolution = monitorSettings
        ? `${monitorSettings.widthInPixels ?? 0}x${monitorSettings.heightInPixels ?? 0}`
        : undefined;
      const fps = monitorSettings?.framesPerSecond ?? undefined;

      return {
        sessionId: s.sessionId,
        appId,
        gpuType: s.gpuType,
        status: s.status,
        serverIp,
        signalingUrl: Array.isArray(signalingUrl) ? signalingUrl[0] : signalingUrl,
        resolution,
        fps,
      };
    });

  return activeSessions;
}

/**
 * Report session ad action
 */
export async function reportSessionAd(
  input: {
    token?: string;
    streamingBaseUrl?: string;
    serverIp?: string;
    zone: string;
    sessionId: string;
    adId: string;
    action: SessionAdAction;
    clientTimestamp?: number;
    watchedTimeInMs?: number;
    pausedTimeInMs?: number;
    cancelReason?: string;
    errorInfo?: string;
  },
): Promise<void> {
  if (!input.token) {
    throw new Error("Missing token for session ad report");
  }

  const deviceId = crypto.randomUUID();
  const clientId = crypto.randomUUID();

  const base = input.serverIp
    ? `https://${input.serverIp}`
    : resolvePollStopBase(input.zone, input.streamingBaseUrl);

  const url = `${base}/v2/session/${input.sessionId}`;

  const body = {
    sessionRequestData: {
      action: SESSION_MODIFY_ACTION_AD_UPDATE,
      adId: input.adId,
      adActionCode: AD_ACTION_CODES[input.action],
      clientTimestamp: input.clientTimestamp ?? Date.now(),
      watchedTimeInMs: input.watchedTimeInMs ?? 0,
      pausedTimeInMs: input.pausedTimeInMs ?? 0,
      cancelReason: input.cancelReason ?? "",
      errorInfo: input.errorInfo ?? "",
      // minimal required fields for a modify request
      appId: 0,
      internalTitle: null,
      availableSupportedControllers: [],
      networkTestSessionId: null,
      parentSessionId: null,
      clientIdentification: "GFN-PC",
      deviceHashId: deviceId,
      clientPlatformName: "windows",
      metaData: [
        { key: "SubSessionId", value: crypto.randomUUID() },
        { key: "wssignaling", value: "1" },
        { key: "GSStreamerType", value: "WebRTC" },
        { key: "networkType", value: "Unknown" },
        { key: "ClientImeSupport", value: "0" },
      ],
      surroundAudioInfo: 0,
      clientTimezoneOffset: timezoneOffsetMs(),
      clientRequestMonitorSettings: [],
      appLaunchMode: 1,
      sdkVersion: "1.0",
      streamerVersion: 1,
      enhancedStreamMode: 1,
      useOps: true,
      clientDisplayHdrCapabilities: null,
      accountLinked: true,
      partnerCustomData: "",
      enablePersistingInGameSettings: true,
      secureRTSPSupported: false,
      userAge: 26,
      requestedStreamingFeatures: {
        reflex: false,
        bitDepth: 0,
        cloudGsync: false,
        enabledL4S: false,
        mouseMovementFlags: 0,
        trueHdr: false,
        supportedHidDevices: 0,
        profile: 0,
        fallbackToLogicalResolution: false,
        hidDevices: null,
        chromaFormat: 0,
        prefilterMode: 0,
        prefilterSharpness: 0,
        prefilterNoiseReduction: 0,
        hudStreamingMode: 0,
        sdrColorSpace: 2,
        hdrColorSpace: 0,
      },
    },
    metaData: [],
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...buildDeviceHeaders(input.token, clientId, deviceId, true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw SessionError.fromResponse(response.status, text);
  }
}

/**
 * Build claim/resume request payload
 */
function buildClaimRequestBody(sessionId: string, appId: string, settings: StreamSettings): unknown {
  const { width, height } = parseResolution(settings.resolution);
  const cq = settings.colorQuality;
  const chromaFormat = colorQualityChromaFormat(cq);
  // Claim/resume uses SDR mode (matching Rust: hdr_enabled defaults false for claims).
  // HDR is only negotiated on the initial session create.
  const hdrEnabled = false;
  const deviceId = crypto.randomUUID();
  const subSessionId = crypto.randomUUID();
  const timezoneMs = timezoneOffsetMs();
  const keyboardLayout = resolveGfnKeyboardLayout(settings.keyboardLayout ?? DEFAULT_KEYBOARD_LAYOUT, process.platform);
  const languageCode = settings.gameLanguage ?? "en_US";

  // Build HDR capabilities if enabled
  const hdrCapabilities = hdrEnabled
    ? {
        version: 1,
        hdrEdrSupportedFlagsInUint32: 3, // 1=HDR10, 2=EDR, 3=both
        staticMetadataDescriptorId: 0,
        displayData: {
          maxLuminance: 1000,
          minLuminance: 0.01,
          maxFrameAverageLuminance: 500,
        },
      }
    : null;

  return {
    action: 2,
    data: "RESUME",
    sessionRequestData: {
      audioMode: 2,
      remoteControllersBitmap: 0,
      sdrHdrMode: hdrEnabled ? 1 : 0,
      networkTestSessionId: null,
      availableSupportedControllers: [],
      clientVersion: "30.0",
      deviceHashId: deviceId,
      internalTitle: null,
      clientPlatformName: "windows",
      metaData: [
        { key: "SubSessionId", value: subSessionId },
        { key: "wssignaling", value: "1" },
        { key: "GSStreamerType", value: "WebRTC" },
        { key: "networkType", value: "Unknown" },
        { key: "ClientImeSupport", value: "0" },
        { key: "keyboardLayout", value: keyboardLayout },
        { key: "languageCode", value: languageCode },
        {
          key: "clientPhysicalResolution",
          value: JSON.stringify({ horizontalPixels: width, verticalPixels: height }),
        },
        { key: "surroundAudioInfo", value: "2" },
      ],
      surroundAudioInfo: 0,
      clientTimezoneOffset: timezoneMs,
      clientIdentification: "GFN-PC",
      parentSessionId: null,
      appId: parseInt(appId, 10),
      streamerVersion: 1,
      appLaunchMode: 1,
      sdkVersion: "1.0",
      enhancedStreamMode: 1,
      useOps: true,
      clientDisplayHdrCapabilities: hdrCapabilities,
      accountLinked: true,
      partnerCustomData: "",
      enablePersistingInGameSettings: true,
      secureRTSPSupported: false,
      userAge: 26,
      requestedStreamingFeatures: {
        reflex: false,
        bitDepth: 0,
        // RESUME claims must not renegotiate session creation-only streaming features.
        cloudGsync: settings.enableCloudGsync ?? false,
        enabledL4S: settings.enableL4S ?? false,
        profile: 0,
        fallbackToLogicalResolution: false,
        chromaFormat,
        prefilterMode: 0,
        hudStreamingMode: 0,
        mouseMovementFlags: 0,
        trueHdr: false,
        supportedHidDevices: 0,
        hidDevices: null,
        sdrColorSpace: 2,
        hdrColorSpace: 0,
      },
    },
    metaData: [],
  };
}

/**
 * Claim/Resume an existing session
 * Required before connecting to an existing session
 */
export async function claimSession(input: SessionClaimRequest): Promise<SessionInfo> {
  if (!input.token) {
    throw new Error("Missing token for session claim");
  }

  const deviceId = crypto.randomUUID();
  const clientId = crypto.randomUUID();

  // Provide default values for optional parameters
  const appId = input.appId ?? "0";
  const settings = input.settings ?? {
    resolution: "1920x1080",
    fps: 60,
    maxBitrateMbps: 75,
    codec: "H264",
    colorQuality: "8bit_420",
    keyboardLayout: DEFAULT_KEYBOARD_LAYOUT,
    gameLanguage: "en_US",
    enableL4S: false,
    enableCloudGsync: false,
  };
  const keyboardLayout = resolveGfnKeyboardLayout(settings.keyboardLayout ?? DEFAULT_KEYBOARD_LAYOUT, process.platform);
  const languageCode = settings.gameLanguage ?? "en_US";

  // The session list endpoint returns the zone LB hostname in sessionControlInfo.ip.
  // A claim PUT sent to the zone LB returns HTTP 400 because it does not handle
  // session-level mutations. The real game server IP is only reliably available from
  // the individual session endpoint (GET /v2/session/{id}). Resolve it here before
  // building the claim URL.
  // IMPORTANT: We must query the SAME zone LB where the session is hosted (use serverIp),
  // not the provider's generic streamingBaseUrl (which may route to a different zone LB).
  let effectiveServerIp = input.serverIp;
  console.log(`[CloudMatch] claimSession: input serverIp=${input.serverIp}, isZone=${isZoneHostname(input.serverIp)}`);
  if (isZoneHostname(effectiveServerIp)) {
    const zoneBase = `https://${effectiveServerIp}`;
    const prefetchUrl = `${zoneBase}/v2/session/${input.sessionId}`;
    console.log(`[CloudMatch] claimSession: pre-flight query ${prefetchUrl}`);
    const prefetchHeaders = buildDeviceHeaders(input.token, clientId, deviceId, false);
    try {
      const prefetchResp = await fetch(prefetchUrl, { method: "GET", headers: prefetchHeaders });
      console.log(`[CloudMatch] claimSession: pre-flight response status=${prefetchResp.status}`);
      if (prefetchResp.ok) {
        const prefetchPayload = JSON.parse(await prefetchResp.text()) as CloudMatchResponse;
        const realIp = streamingServerIp(prefetchPayload);
        console.log(`[CloudMatch] claimSession: extracted realIp=${realIp}, isZone=${realIp ? isZoneHostname(realIp) : 'N/A'}`);
        if (realIp) {
          effectiveServerIp = realIp;
          const ipType = isZoneHostname(realIp) ? 'zone LB' : 'direct IP';
          console.log(`[CloudMatch] claimSession: using extracted ${ipType}: ${realIp}`);
        }
      } else {
        console.warn(`[CloudMatch] claimSession: pre-flight returned HTTP ${prefetchResp.status}, text=${await prefetchResp.text()}`);
      }
    } catch (e) {
      console.warn("[CloudMatch] claimSession: pre-flight poll failed, proceeding with zone hostname:", e);
    }
  }

  const claimUrl = `https://${effectiveServerIp}/v2/session/${input.sessionId}?${new URLSearchParams({ keyboardLayout, languageCode }).toString()}`;

  // Pre-claim validation: check session status before deciding whether to send a RESUME claim.
  // Status 1 (setup/launching/queuing) sessions cannot be RESUME'd — the server will reject
  // with SESSION_NOT_PAUSED. For these sessions we skip the claim PUT and poll directly.
  // Status 2/3 (ready/streaming) sessions are paused and can be RESUME'd normally.
  let preClaimStatus: number | null = null;
  try {
    const validationUrl = `https://${effectiveServerIp}/v2/session/${input.sessionId}`;
    const validationHeaders = buildDeviceHeaders(input.token, clientId, deviceId, false);
    const validationResp = await fetch(validationUrl, { method: "GET", headers: validationHeaders });
    if (validationResp.ok) {
      const validationText = await validationResp.text();
      const validationPayload = JSON.parse(validationText) as CloudMatchResponse;
      preClaimStatus = validationPayload.session?.status ?? 0;
      const errorCode = validationPayload.session?.errorCode ?? 0;
      console.log(`[CloudMatch] claimSession: pre-claim validation status=${preClaimStatus}, errorCode=${errorCode}`);
      console.log(`[CloudMatch] claimSession: validation response (first 1000 chars): ${validationText.slice(0, 1000)}`);
      if (preClaimStatus === 1) {
        console.log(`[CloudMatch] claimSession: session is still launching (status=1), skipping RESUME claim — polling directly to ready state`);
      } else if (preClaimStatus !== 2 && preClaimStatus !== 3) {
        console.warn(`[CloudMatch] claimSession: session not in ready state (status=${preClaimStatus}), claim may fail`);
      }
    } else {
      console.warn(`[CloudMatch] claimSession: pre-claim validation returned HTTP ${validationResp.status}`);
    }
  } catch (e) {
    console.warn("[CloudMatch] claimSession: pre-claim validation failed:", e);
  }

  // Only send the RESUME claim PUT if the session is in a paused state (status 2 or 3).
  // For status=1 (still launching) we bypass the claim and fall through to the polling loop.
  if (preClaimStatus !== 1) {
    const payload = buildClaimRequestBody(input.sessionId, appId, settings);

    const headers: Record<string, string> = {
      "User-Agent": GFN_USER_AGENT,
      Authorization: `GFNJWT ${input.token}`,
      "Content-Type": "application/json",
      Origin: "https://play.geforcenow.com",
      Referer: "https://play.geforcenow.com/",
      "nv-client-id": clientId,
      "nv-client-streamer": "NVIDIA-CLASSIC",
      "nv-client-type": "NATIVE",
      "nv-client-version": GFN_CLIENT_VERSION,
      "nv-device-os": process.platform === "win32" ? "WINDOWS" : process.platform === "darwin" ? "MACOS" : "LINUX",
      "nv-device-type": "DESKTOP",
      "x-device-id": deviceId,
    };

    console.log(`[CloudMatch] claimSession PUT ${claimUrl}`);
    console.log(`[CloudMatch] claimSession body: ${JSON.stringify(payload)}`);
    const response = await fetch(claimUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    console.log(`[CloudMatch] claimSession response: HTTP ${response.status}`);
    console.log(`[CloudMatch] claimSession response body FULL: ${text}`);

    if (!response.ok) {
      throw SessionError.fromResponse(response.status, text);
    }

    const apiResponse = JSON.parse(text) as CloudMatchResponse;

    if (apiResponse.requestStatus.statusCode !== 1) {
      throw SessionError.fromResponse(200, text);
    }
  }

  // Poll until session is ready (status 2 or 3)
  const getUrl = `https://${effectiveServerIp}/v2/session/${input.sessionId}`;
  const maxAttempts = 60;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const pollHeaders = buildDeviceHeaders(input.token, clientId, deviceId, false);

    const pollResponse = await fetch(getUrl, {
      method: "GET",
      headers: pollHeaders,
    });

    if (!pollResponse.ok) {
      continue;
    }

    const pollText = await pollResponse.text();
    let pollApiResponse: CloudMatchResponse;

    try {
      pollApiResponse = JSON.parse(pollText) as CloudMatchResponse;
    } catch {
      continue;
    }

    const sessionData = pollApiResponse.session;

    if (sessionData.status === 2 || sessionData.status === 3) {
      // Session is ready
      const signaling = resolveSignaling(pollApiResponse);
      const queuePosition = extractQueuePosition(pollApiResponse);

      return {
        sessionId: sessionData.sessionId,
        status: sessionData.status,
        queuePosition,
        zone: "", // Zone not applicable for claimed sessions
        streamingBaseUrl: `https://${effectiveServerIp}`,
        serverIp: signaling.serverIp,
        signalingServer: signaling.signalingServer,
        signalingUrl: signaling.signalingUrl,
        gpuType: sessionData.gpuType,
        iceServers: await normalizeIceServers(pollApiResponse),
        mediaConnectionInfo: signaling.mediaConnectionInfo,
        negotiatedStreamProfile: extractNegotiatedStreamProfile(pollApiResponse),
      };
    }

    // Status 1 (setup/launching), 6 (cleaning up), etc. — continue polling for ready state (2 or 3)
    // Only break if we encounter a terminal error state (status 4, 5, etc.)
    if (sessionData.status > 3 && sessionData.status !== 6) {
      break;
    }
  }

  throw new Error("Session did not become ready after claiming");
}
