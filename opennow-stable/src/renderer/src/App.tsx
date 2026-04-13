import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";

import { getPlatformApi } from "./platform/index";
import {
  startNativeStream,
  stopNativeStream,
  addNativeIceCandidate,
  getNativeStreamState,
} from "./platform/api";
import { isAndroid } from "./platform/detect";  // isAndroid is now a function -- call it as isAndroid()
import { TouchGamepad, parseLayout } from "./components/TouchGamepad";
import type { GamepadElementId, GamepadLayout } from "./components/TouchGamepad";
import { TouchInputHandler } from "./gfn/touchInput";

import type {
  ActiveSessionInfo,
  AuthSession,
  AuthUser,
  GameInfo,
  LoginProvider,
  MainToRendererSignalingEvent,
  SessionInfo,
  Settings,
  SubscriptionInfo,
  StreamRegion,
  VideoCodec,
} from "@shared/gfn";

import {
  GfnWebRtcClient,
  type StreamDiagnostics,
  type StreamTimeWarning,
} from "./gfn/webrtcClient";
import { formatShortcutForDisplay, isShortcutMatch, normalizeShortcut } from "./shortcuts";
import { useControllerNavigation } from "./controllerNavigation";

// UI Components
import { LoginScreen } from "./components/LoginScreen";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { LibraryPage } from "./components/LibraryPage";
import { SettingsPage } from "./components/SettingsPage";
import { StreamLoading } from "./components/StreamLoading";
import { StreamView } from "./components/StreamView";

const codecOptions: VideoCodec[] = ["H264", "H265", "AV1"];
const resolutionOptions = ["1280x720", "1920x1080", "2560x1440", "3840x2160", "2560x1080", "3440x1440"];
const fpsOptions = [30, 60, 120, 144, 240];
const SESSION_READY_POLL_INTERVAL_MS = 2000;
const SESSION_READY_TIMEOUT_MS = 180000;

type GameSource = "main" | "library" | "public";
type AppPage = "home" | "library" | "settings";
type StreamStatus = "idle" | "queue" | "setup" | "starting" | "connecting" | "streaming";
type StreamLoadingStatus = "queue" | "setup" | "starting" | "connecting";
type ExitPromptState = { open: boolean; gameTitle: string };
type StreamWarningState = {
  code: StreamTimeWarning["code"];
  message: string;
  tone: "warn" | "critical";
  secondsLeft?: number;
};
type LaunchErrorState = {
  stage: StreamLoadingStatus;
  title: string;
  description: string;
  codeLabel?: string;
};

const APP_PAGE_ORDER: AppPage[] = ["home", "library", "settings"];

const isMac = navigator.platform.toLowerCase().includes("mac");

const DEFAULT_SHORTCUTS = {
  shortcutToggleStats: "F3",
  shortcutTogglePointerLock: "F8",
  shortcutStopStream: "Ctrl+Shift+Q",
  shortcutToggleAntiAfk: "Ctrl+Shift+K",
  shortcutToggleMicrophone: "Ctrl+Shift+M",
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function isSessionReadyForConnect(status: number): boolean {
  return status === 2 || status === 3;
}

function isNumericId(value: string | undefined): value is string {
  if (!value) return false;
  return /^\d+$/.test(value);
}

function parseNumericId(value: string | undefined): number | null {
  if (!isNumericId(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function defaultVariantId(game: GameInfo): string {
  const fallback = game.variants[0]?.id;
  const preferred = game.variants[game.selectedVariantIndex]?.id;
  return preferred ?? fallback ?? game.id;
}

function defaultDiagnostics(): StreamDiagnostics {
  return {
    connectionState: "closed",
    inputReady: false,
    connectedGamepads: 0,
    resolution: "",
    codec: "",
    isHdr: false,
    bitrateKbps: 0,
    decodeFps: 0,
    renderFps: 0,
    packetsLost: 0,
    packetsReceived: 0,
    packetLossPercent: 0,
    jitterMs: 0,
    rttMs: 0,
    framesReceived: 0,
    framesDecoded: 0,
    framesDropped: 0,
    decodeTimeMs: 0,
    renderTimeMs: 0,
    jitterBufferDelayMs: 0,
    inputQueueBufferedBytes: 0,
    inputQueuePeakBufferedBytes: 0,
    inputQueueDropCount: 0,
    inputQueueMaxSchedulingDelayMs: 0,
    gpuType: "",
    serverRegion: "",
    micState: "uninitialized",
    micEnabled: false,
  };
}

function isSessionLimitError(error: unknown): boolean {
  if (error && typeof error === "object" && "gfnErrorCode" in error) {
    const candidate = error.gfnErrorCode;
    if (typeof candidate === "number") {
      return candidate === 3237093643 || candidate === 3237093718;
    }
  }
  if (error instanceof Error) {
    const msg = error.message.toUpperCase();
    return msg.includes("SESSION LIMIT") || msg.includes("INSUFFICIENT_PLAYABILITY") || msg.includes("DUPLICATE SESSION");
  }
  return false;
}

function warningTone(code: StreamTimeWarning["code"]): "warn" | "critical" {
  if (code === 3) {
    return "critical";
  }
  return "warn";
}

function warningMessage(code: StreamTimeWarning["code"]): string {
  if (code === 1) return "Session time limit approaching";
  if (code === 2) return "Idle timeout approaching";
  return "Maximum session time approaching";
}

function toLoadingStatus(status: StreamStatus): StreamLoadingStatus {
  switch (status) {
    case "queue":
    case "setup":
    case "starting":
    case "connecting":
      return status;
    default:
      return "queue";
  }
}

function toCodeLabel(code: number | undefined): string | undefined {
  if (code === undefined) return undefined;
  if (code === 3237093643) return `SessionLimitExceeded (${code})`;
  if (code === 3237093718) return `SessionInsufficientPlayabilityLevel (${code})`;
  return `GFN Error ${code}`;
}

function extractLaunchErrorCode(error: unknown): number | undefined {
  if (error && typeof error === "object") {
    if ("gfnErrorCode" in error) {
      const directCode = error.gfnErrorCode;
      if (typeof directCode === "number") return directCode;
    }
    if ("statusCode" in error) {
      const statusCode = error.statusCode;
      if (typeof statusCode === "number" && statusCode > 0 && statusCode < 255) {
        return 3237093632 + statusCode;
      }
    }
  }
  if (error instanceof Error) {
    const match = error.message.match(/\b(3237\d{6,})\b/);
    if (match) {
      const code = Number(match[1]);
      if (Number.isFinite(code)) return code;
    }
  }
  return undefined;
}

function toLaunchErrorState(error: unknown, stage: StreamLoadingStatus): LaunchErrorState {
  const unknownMessage = "The game could not start. Please try again.";

  const titleFromError =
    error && typeof error === "object" && "title" in error && typeof error.title === "string"
      ? error.title.trim()
      : "";
  const descriptionFromError =
    error && typeof error === "object" && "description" in error && typeof error.description === "string"
      ? error.description.trim()
      : "";
  const statusDescription =
    error && typeof error === "object" && "statusDescription" in error && typeof error.statusDescription === "string"
      ? error.statusDescription.trim()
      : "";
  const messageFromError = error instanceof Error ? error.message.trim() : "";
  const combined = `${statusDescription} ${messageFromError}`.toUpperCase();
  const code = extractLaunchErrorCode(error);

  if (
    isSessionLimitError(error) ||
    combined.includes("INSUFFICIENT_PLAYABILITY") ||
    combined.includes("SESSION_LIMIT") ||
    combined.includes("DUPLICATE SESSION")
  ) {
    return {
      stage,
      title: "Duplicate Session Detected",
      description: "Another session is already running on your account. Close it first or wait for it to timeout, then launch again.",
      codeLabel: toCodeLabel(code),
    };
  }

  return {
    stage,
    title: titleFromError || "Launch Failed",
    description: descriptionFromError || messageFromError || statusDescription || unknownMessage,
    codeLabel: toCodeLabel(code),
  };
}

export function App(): JSX.Element {
  // Auth State
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [providers, setProviders] = useState<LoginProvider[]>([]);
  const [providerIdpId, setProviderIdpId] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [startupStatusMessage, setStartupStatusMessage] = useState("Restoring saved session...");
  const [startupRefreshNotice, setStartupRefreshNotice] = useState<{
    tone: "success" | "warn";
    text: string;
  } | null>(null);

  // Navigation
  const [currentPage, setCurrentPage] = useState<AppPage>("home");

  // Games State
  const [games, setGames] = useState<GameInfo[]>([]);
  const [libraryGames, setLibraryGames] = useState<GameInfo[]>([]);
  const [source, setSource] = useState<GameSource>("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGameId, setSelectedGameId] = useState("");
  const [variantByGameId, setVariantByGameId] = useState<Record<string, string>>({});
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<Settings>({
    resolution: "1920x1080",
    fps: 60,
    maxBitrateMbps: 75,
    codec: "H264",
    decoderPreference: "auto",
    encoderPreference: "auto",
    colorQuality: "10bit_420",
    region: "",
    clipboardPaste: false,
    mouseSensitivity: 1,
    shortcutToggleStats: DEFAULT_SHORTCUTS.shortcutToggleStats,
    shortcutTogglePointerLock: DEFAULT_SHORTCUTS.shortcutTogglePointerLock,
    shortcutStopStream: DEFAULT_SHORTCUTS.shortcutStopStream,
    shortcutToggleAntiAfk: DEFAULT_SHORTCUTS.shortcutToggleAntiAfk,
    shortcutToggleMicrophone: DEFAULT_SHORTCUTS.shortcutToggleMicrophone,
    microphoneMode: "disabled",
    microphoneDeviceId: "",
    hideStreamButtons: false,
    sessionClockShowEveryMinutes: 60,
    sessionClockShowDurationSeconds: 30,
    windowWidth: 1400,
    windowHeight: 900,
    touchGamepadLayout: "{}",
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [regions, setRegions] = useState<StreamRegion[]>([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  // Stream State
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");
  const [diagnostics, setDiagnostics] = useState<StreamDiagnostics>(defaultDiagnostics());
  const [showStatsOverlay, setShowStatsOverlay] = useState(true);
  const [antiAfkEnabled, setAntiAfkEnabled] = useState(false);
  const [escHoldReleaseIndicator, setEscHoldReleaseIndicator] = useState<{ visible: boolean; progress: number }>({
    visible: false,
    progress: 0,
  });
  const [exitPrompt, setExitPrompt] = useState<ExitPromptState>({ open: false, gameTitle: "Game" });
  const [streamingGame, setStreamingGame] = useState<GameInfo | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | undefined>();
  const [queueEta, setQueueEta] = useState<number | undefined>();
  const [navbarActiveSession, setNavbarActiveSession] = useState<ActiveSessionInfo | null>(null);
  const [isResumingNavbarSession, setIsResumingNavbarSession] = useState(false);
  const [launchError, setLaunchError] = useState<LaunchErrorState | null>(null);
  const [sessionStartedAtMs, setSessionStartedAtMs] = useState<number | null>(null);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState(0);
  const [streamWarning, setStreamWarning] = useState<StreamWarningState | null>(null);
  const [touchGamepadHidden, setTouchGamepadHidden] = useState(false);
  const [touchGamepadEditMode, setTouchGamepadEditMode] = useState(false);

  const handleControllerPageNavigate = useCallback((direction: "prev" | "next"): void => {
    if (!authSession || streamStatus !== "idle") {
      return;
    }
    const currentIndex = APP_PAGE_ORDER.indexOf(currentPage);
    const step = direction === "next" ? 1 : -1;
    const nextIndex = (currentIndex + step + APP_PAGE_ORDER.length) % APP_PAGE_ORDER.length;
    setCurrentPage(APP_PAGE_ORDER[nextIndex]);
  }, [authSession, currentPage, streamStatus]);

  const handleControllerBackAction = useCallback((): boolean => {
    if (!authSession || streamStatus !== "idle") {
      return false;
    }
    if (currentPage !== "home") {
      setCurrentPage("home");
      return true;
    }
    return false;
  }, [authSession, currentPage, streamStatus]);

  const controllerConnected = useControllerNavigation({
    enabled: streamStatus !== "streaming" || exitPrompt.open,
    onNavigatePage: handleControllerPageNavigate,
    onBackAction: handleControllerBackAction,
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clientRef = useRef<GfnWebRtcClient | null>(null);
  const touchHandlerRef = useRef<TouchInputHandler | null>(null);
  const sessionRef = useRef<SessionInfo | null>(null);
  const hasInitializedRef = useRef(false);
  const regionsRequestRef = useRef(0);
  const launchInFlightRef = useRef(false);
  const exitPromptResolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  // Session ref sync
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    document.body.classList.toggle("controller-mode", controllerConnected);
    return () => {
      document.body.classList.remove("controller-mode");
    };
  }, [controllerConnected]);

  // Derived state
  const selectedProvider = useMemo(() => {
    return providers.find((p) => p.idpId === providerIdpId) ?? authSession?.provider ?? null;
  }, [providers, providerIdpId, authSession]);

  const effectiveStreamingBaseUrl = useMemo(() => {
    return selectedProvider?.streamingServiceUrl ?? "";
  }, [selectedProvider]);

  const loadSubscriptionInfo = useCallback(
    async (session: AuthSession): Promise<void> => {
      const token = session.tokens.idToken ?? session.tokens.accessToken;
      const subscription = await getPlatformApi().fetchSubscription({
        token,
        providerStreamingBaseUrl: session.provider.streamingServiceUrl,
        userId: session.user.userId,
      });
      setSubscriptionInfo(subscription);
    },
    [],
  );

  const refreshNavbarActiveSession = useCallback(async (): Promise<void> => {
    if (!authSession) {
      setNavbarActiveSession(null);
      return;
    }
    const token = authSession.tokens.idToken ?? authSession.tokens.accessToken;
    if (!token || !effectiveStreamingBaseUrl) {
      setNavbarActiveSession(null);
      return;
    }
    try {
      const activeSessions = await getPlatformApi().getActiveSessions(token, effectiveStreamingBaseUrl);
      const candidate = activeSessions.find((entry) => entry.status === 3 || entry.status === 2) ?? null;
      setNavbarActiveSession(candidate);
    } catch (error) {
      console.warn("Failed to refresh active sessions:", error);
    }
  }, [authSession, effectiveStreamingBaseUrl]);

  useEffect(() => {
    if (!startupRefreshNotice) return;
    const timer = window.setTimeout(() => setStartupRefreshNotice(null), 7000);
    return () => window.clearTimeout(timer);
  }, [startupRefreshNotice]);

  useEffect(() => {
    if (!authSession || streamStatus !== "idle") {
      return;
    }
    void refreshNavbarActiveSession();
    const timer = window.setInterval(() => {
      void refreshNavbarActiveSession();
    }, 10000);
    return () => window.clearInterval(timer);
  }, [authSession, refreshNavbarActiveSession, streamStatus]);

  // Initialize app
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initialize = async () => {
      try {
        // Step 1: detect platform
        const { getPlatform } = await import("./platform/detect");
        const plat = getPlatform();
        setStartupStatusMessage(`Platform: ${plat} | Capacitor: ${!!(window as any).Capacitor}`);
        await new Promise(r => setTimeout(r, 600));

        // Step 2: wait for Capacitor bridge if needed
        if ((window as any).Capacitor) {
          setStartupStatusMessage("Waiting for Capacitor bridge...");
          await new Promise<void>((resolve) => {
            if ((window as any).Capacitor?.isNativePlatform?.()) {
              resolve();
            } else {
              document.addEventListener("deviceready", () => resolve(), { once: true });
              setTimeout(resolve, 1000);
            }
          });
        }

        // Step 3: load settings
        setStartupStatusMessage("Step 3: loading settings...");
        const loadedSettings = await getPlatformApi().getSettings();
        setSettings(loadedSettings);
        setSettingsLoaded(true);
        setStartupStatusMessage("Step 3: settings OK");
        await new Promise(r => setTimeout(r, 300));

        // Step 4: load providers
        setStartupStatusMessage("Step 4: calling getLoginProviders...");
        let providerList: any[] = [];
        try {
          const providerResult = await Promise.race([
            getPlatformApi().getLoginProviders(),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error("providers timeout")), 5000))
          ]);
          providerList = Array.isArray(providerResult) ? providerResult : [];
          setStartupStatusMessage(`Step 4: got ${providerList.length} providers`);
        } catch (e) {
          setStartupStatusMessage(`Step 4: failed (${e}) -- using default`);
          providerList = [{ idpId: "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg", code: "NVIDIA", displayName: "NVIDIA", streamingServiceUrl: "https://prod.cloudmatchbeta.nvidiagrid.net/", priority: 0 }];
        }
        await new Promise(r => setTimeout(r, 600));

        // Step 5: restore session
        setStartupStatusMessage("Step 5: restoring session...");
        const sessionResult = await getPlatformApi().getAuthSession({ forceRefresh: false });
        setStartupStatusMessage(`Step 5: session=${sessionResult.session ? "found" : "none"} outcome=${sessionResult.refresh.outcome}`);
        await new Promise(r => setTimeout(r, 300));

        const persistedSession = sessionResult.session;

        if (sessionResult.refresh.outcome === "refreshed") {
          setStartupRefreshNotice({
            tone: "success",
            text: "Session restored. Token refreshed.",
          });
          setStartupStatusMessage("Token refreshed. Loading your account...");
        } else if (sessionResult.refresh.outcome === "failed") {
          setStartupRefreshNotice({
            tone: "warn",
            text: "Token refresh failed. Using saved session token.",
          });
          setStartupStatusMessage("Token refresh failed. Continuing with saved session...");
        } else if (sessionResult.refresh.outcome === "missing_refresh_token") {
          setStartupStatusMessage("Saved session has no refresh token. Continuing...");
        } else if (persistedSession) {
          setStartupStatusMessage("Session restored.");
        } else {
          setStartupStatusMessage("No saved session found.");
        }

        // Update isInitializing FIRST so UI knows we're done loading
        setIsInitializing(false);
        setProviders(providerList);
        setAuthSession(persistedSession);

        const activeProviderId = persistedSession?.provider?.idpId ?? providerList[0]?.idpId ?? "";
        setProviderIdpId(activeProviderId);

        if (persistedSession) {
          // Load regions
          const token = persistedSession.tokens.idToken ?? persistedSession.tokens.accessToken;
          const discovered = await getPlatformApi().getRegions({ token, providerStreamingBaseUrl: persistedSession.provider.streamingServiceUrl } as any);
          setRegions(discovered);

          try {
            await loadSubscriptionInfo(persistedSession);
          } catch (error) {
            console.warn("Failed to load subscription info:", error);
            setSubscriptionInfo(null);
          }

          // Load games
          try {
            const mainGames = await getPlatformApi().fetchMainGames({
              token,
              providerStreamingBaseUrl: persistedSession.provider.streamingServiceUrl,
            });
            setGames(mainGames);
            setSource("main");
            setSelectedGameId(mainGames[0]?.id ?? "");
            setVariantByGameId(
              mainGames.reduce((acc, g) => {
                acc[g.id] = defaultVariantId(g);
                return acc;
              }, {} as Record<string, string>)
            );

            // Also load library
            const libGames = await getPlatformApi().fetchLibraryGames({
              token,
              providerStreamingBaseUrl: persistedSession.provider.streamingServiceUrl,
            });
            setLibraryGames(libGames);
          } catch {
            // Fallback to public games
            const publicGames = await getPlatformApi().fetchPublicGames();
            setGames(publicGames);
            setSource("public");
          }
        } else {
          // Load public games for non-logged in users
          const publicGames = await getPlatformApi().fetchPublicGames();
          setGames(publicGames);
          setSource("public");
          setSubscriptionInfo(null);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
        setStartupStatusMessage("Session restore failed. Please sign in again.");
        // Always set isInitializing to false even on error
        setIsInitializing(false);
      }
    };

    void initialize();
  }, []);

  const shortcuts = useMemo(() => {
    const parseWithFallback = (value: string, fallback: string) => {
      const parsed = normalizeShortcut(value);
      return parsed.valid ? parsed : normalizeShortcut(fallback);
    };
    const toggleStats        = parseWithFallback(settings.shortcutToggleStats,        DEFAULT_SHORTCUTS.shortcutToggleStats);
    const togglePointerLock  = parseWithFallback(settings.shortcutTogglePointerLock,  DEFAULT_SHORTCUTS.shortcutTogglePointerLock);
    const stopStream         = parseWithFallback(settings.shortcutStopStream,         DEFAULT_SHORTCUTS.shortcutStopStream);
    const toggleAntiAfk      = parseWithFallback(settings.shortcutToggleAntiAfk,      DEFAULT_SHORTCUTS.shortcutToggleAntiAfk);
    const toggleMicrophone   = parseWithFallback(settings.shortcutToggleMicrophone,   DEFAULT_SHORTCUTS.shortcutToggleMicrophone);
    return { toggleStats, togglePointerLock, stopStream, toggleAntiAfk, toggleMicrophone };
  }, [
    settings.shortcutToggleStats,
    settings.shortcutTogglePointerLock,
    settings.shortcutStopStream,
    settings.shortcutToggleAntiAfk,
    settings.shortcutToggleMicrophone,
  ]);

  const hasTouchInput = typeof navigator !== "undefined" && typeof window !== "undefined" && (
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window
  );

  const shouldShowTouchGamepad = streamStatus === "streaming" && (
    isAndroid() || hasTouchInput
  );

  useEffect(() => {
    if (streamStatus === "streaming" || streamStatus === "idle") {
      setTouchGamepadHidden(false);
    }
  }, [streamStatus]);

  const requestEscLockedPointerCapture = useCallback(async (target: HTMLVideoElement) => {
    // Touch screens don't use pointer lock -- skip entirely on Android.
    if (isAndroid()) return;

    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    }

    const nav = navigator as any;
    if (document.fullscreenElement && nav.keyboard?.lock) {
      await nav.keyboard.lock([
        "Escape", "F11", "BrowserBack", "BrowserForward", "BrowserRefresh",
      ]).catch(() => {});
    }

    await (target.requestPointerLock({ unadjustedMovement: true } as any) as unknown as Promise<void>)
      .catch((err: DOMException) => {
        if (err.name === "NotSupportedError") {
          return target.requestPointerLock();
        }
        throw err;
      })
      .catch(() => {});
  }, []);

  const resolveExitPrompt = useCallback((confirmed: boolean) => {
    const resolver = exitPromptResolverRef.current;
    exitPromptResolverRef.current = null;
    setExitPrompt((prev) => (prev.open ? { ...prev, open: false } : prev));
    resolver?.(confirmed);
  }, []);

  const requestExitPrompt = useCallback((gameTitle: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (exitPromptResolverRef.current) {
        exitPromptResolverRef.current(false);
      }
      exitPromptResolverRef.current = resolve;
      setExitPrompt({
        open: true,
        gameTitle: gameTitle || "this game",
      });
    });
  }, []);

  const handleExitPromptConfirm = useCallback(() => {
    resolveExitPrompt(true);
  }, [resolveExitPrompt]);

  const handleExitPromptCancel = useCallback(() => {
    resolveExitPrompt(false);
  }, [resolveExitPrompt]);

  useEffect(() => {
    return () => {
      if (exitPromptResolverRef.current) {
        exitPromptResolverRef.current(false);
        exitPromptResolverRef.current = null;
      }
    };
  }, []);

  // Force landscape orientation on Android while streaming
  useEffect(() => {
    if (!isAndroid()) return;
    const api = getPlatformApi() as any;
    if (typeof api.setOrientation !== "function") return;
    if (streamStatus === "streaming") {
      api.setOrientation("landscape");
    } else if (streamStatus === "idle") {
      api.setOrientation("sensor");
    }
  }, [streamStatus]);

  // Listen for F11 fullscreen toggle from main process
  useEffect(() => {
    const unsubscribe = getPlatformApi().onToggleFullscreen(() => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    });
    return () => unsubscribe();
  }, []);

  // Anti-AFK interval
  useEffect(() => {
    if (!antiAfkEnabled || streamStatus !== "streaming") return;

    const interval = window.setInterval(() => {
      clientRef.current?.sendAntiAfkPulse();
    }, 240000); // 4 minutes

    return () => clearInterval(interval);
  }, [antiAfkEnabled, streamStatus]);

  // Restore focus to video element when navigating away from Settings during streaming
  useEffect(() => {
    if (streamStatus === "streaming" && currentPage !== "settings" && videoRef.current) {
      const timer = window.setTimeout(() => {
        if (videoRef.current && document.activeElement !== videoRef.current) {
          videoRef.current.focus();
          console.log("[App] Restored focus to video element after leaving Settings");
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentPage, streamStatus]);

  useEffect(() => {
    if (streamStatus === "idle" || sessionStartedAtMs === null) {
      setSessionElapsedSeconds(0);
      return;
    }

    const updateElapsed = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - sessionStartedAtMs) / 1000));
      setSessionElapsedSeconds(elapsed);
    };

    updateElapsed();
    const timer = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(timer);
  }, [sessionStartedAtMs, streamStatus]);

  useEffect(() => {
    if (!streamWarning) return;
    const warning = streamWarning;
    const timer = window.setTimeout(() => {
      setStreamWarning((current) => (current === warning ? null : current));
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [streamWarning]);

  // Signaling events
  useEffect(() => {
    const useNativePath = isAndroid();
    const nativeCleanups: Array<(() => void) | undefined> = [];

    const unsubscribe = getPlatformApi().onSignalingEvent(async (event: MainToRendererSignalingEvent) => {
      console.log(`[App] Signaling event: ${event.type}`, event.type === "offer" ? `(SDP ${event.sdp.length} chars)` : "", event.type === "remote-ice" ? event.candidate : "");
      try {
        if (event.type === "offer") {
          const activeSession = sessionRef.current;
          if (!activeSession) {
            console.warn("[App] Received offer but no active session in sessionRef!");
            return;
          }
          console.log("[App] Active session for offer:", JSON.stringify({
            sessionId: activeSession.sessionId,
            serverIp: activeSession.serverIp,
            signalingServer: activeSession.signalingServer,
            mediaConnectionInfo: activeSession.mediaConnectionInfo,
            iceServersCount: activeSession.iceServers?.length,
          }));

          // ── NATIVE PATH (Android) ──────────────────────────────────
          // Route the WebRTC offer to the native Kotlin NativeStreamManager
          // which handles PeerConnection, video rendering (SurfaceViewRenderer),
          // and input DataChannels natively — bypassing WebView overhead.
          if (useNativePath) {
            console.log("[App] Using NATIVE WebRTC path (Android)");
            try {
              // startNativeStream keeps the PluginCall open until the
              // native answer SDP is ready, then returns it directly.
              const result = await startNativeStream({
                offerSdp: event.sdp,
                serverIp: activeSession.serverIp || "",
                mediaConnectionIp: activeSession.mediaConnectionInfo?.ip,
                mediaConnectionPort: activeSession.mediaConnectionInfo?.port || 0,
                iceServers: JSON.stringify(activeSession.iceServers || []),
                codec: settings.codec,
                colorQuality: settings.colorQuality,
                resolution: settings.resolution,
                fps: settings.fps,
                maxBitrateKbps: settings.maxBitrateMbps * 1000,
                signalingServer: activeSession.signalingServer || "",
              });

              // Forward the answer SDP back to signaling
              if (result.sdp) {
                console.log("[App] Native answer received, forwarding to signaling");
                await getPlatformApi().sendAnswer({ sdp: result.sdp, nvstSdp: result.nvstSdp });
              }

              setLaunchError(null);
              setStreamStatus("streaming");
              setSessionStartedAtMs((current) => current ?? Date.now());
              console.log("[App] Native stream started successfully");

              // Start polling native stream state for diagnostics
              const statsPollTimer = window.setInterval(async () => {
                try {
                  const state = await getNativeStreamState();
                  setDiagnostics((prev) => ({
                    ...prev,
                    connectionState: state.connectionState,
                    inputReady: state.inputReady,
                    bitrateKbps: state.bitrateKbps || prev.bitrateKbps,
                    rttMs: state.rttMs || prev.rttMs,
                  }));
                } catch {
                  // Ignore polling errors
                }
              }, 1000);
              nativeCleanups.push(() => window.clearInterval(statsPollTimer));
            } catch (e) {
              console.error("[App] Native stream start failed:", e);
              setLaunchError({
                message: `Native stream failed: ${e instanceof Error ? e.message : String(e)}`,
                step: "connecting",
              });
            }
            return;
          }

          // ── JS PATH (Electron / fallback) ──────────────────────────
          if (!clientRef.current && videoRef.current && audioRef.current) {
            clientRef.current = new GfnWebRtcClient({
              videoElement: videoRef.current,
              audioElement: audioRef.current,
              microphoneMode: settings.microphoneMode,
              microphoneDeviceId: settings.microphoneDeviceId || undefined,
              onLog: (line: string) => console.log(`[WebRTC] ${line}`),
              onStats: (stats) => setDiagnostics(stats),
              onEscHoldProgress: (visible, progress) => {
                setEscHoldReleaseIndicator({ visible, progress });
              },
              onTimeWarning: (warning) => {
                setStreamWarning({
                  code: warning.code,
                  message: warningMessage(warning.code),
                  tone: warningTone(warning.code),
                  secondsLeft: warning.secondsLeft,
                });
              },
              onMicStateChange: (state) => {
                console.log(`[App] Mic state: ${state.state}${state.deviceLabel ? ` (${state.deviceLabel})` : ""}`);
              },
            });
            // Auto-start microphone if mode is enabled
            if (settings.microphoneMode !== "disabled") {
              void clientRef.current.startMicrophone();
            }
          }

          if (clientRef.current) {
            await clientRef.current.handleOffer(event.sdp, activeSession, {
              codec: settings.codec,
              colorQuality: settings.colorQuality,
              resolution: settings.resolution,
              fps: settings.fps,
              maxBitrateKbps: settings.maxBitrateMbps * 1000,
            });
            setLaunchError(null);
            setStreamStatus("streaming");
            setSessionStartedAtMs((current) => current ?? Date.now());

            // On Android, set up touch-to-mouse translation on the video element.
            if (isAndroid() && videoRef.current && clientRef.current) {
              touchHandlerRef.current?.dispose();
              touchHandlerRef.current = new TouchInputHandler(videoRef.current, clientRef.current);
            }
          }
        } else if (event.type === "remote-ice") {
          // Forward remote ICE candidates to the appropriate path
          if (useNativePath) {
            await addNativeIceCandidate(event.candidate);
          } else {
            await clientRef.current?.addRemoteCandidate(event.candidate);
          }
        } else if (event.type === "disconnected") {
          console.warn("Signaling disconnected:", event.reason);
          // On Android/WebView, the GFN server closes the signaling WebSocket
          // after the offer/answer exchange completes -- this is normal and does
          // NOT mean the stream ended. Only tear down if we are not yet streaming.
          if (useNativePath) {
            // Native path: check native stream state
            try {
              const nativeState = await getNativeStreamState();
              if (nativeState.state === "connected" || nativeState.state === "connecting") {
                console.warn("[App] Signaling closed after native stream established -- ignoring");
                return;
              }
            } catch { /* ignore */ }
          } else if (clientRef.current?.isStreaming?.()) {
            console.warn("[App] Signaling closed after stream established -- ignoring (WebRTC media still active)");
            return;
          }
          touchHandlerRef.current?.dispose();
          touchHandlerRef.current = null;
          if (useNativePath) {
            stopNativeStream().catch(() => {});
          } else {
            clientRef.current?.dispose();
            clientRef.current = null;
          }
          setStreamStatus("idle");
          setSession(null);
          setStreamingGame(null);
          setLaunchError(null);
          setSessionStartedAtMs(null);
          setSessionElapsedSeconds(0);
          setStreamWarning(null);
          setEscHoldReleaseIndicator({ visible: false, progress: 0 });
          setDiagnostics(defaultDiagnostics());
          launchInFlightRef.current = false;
        } else if (event.type === "error") {
          console.error("Signaling error:", event.message);
        }
      } catch (error) {
        console.error("Signaling event error:", error);
      }
    });

    return () => {
      unsubscribe();
      for (const cleanup of nativeCleanups) cleanup?.();
    };
  }, [settings]);

  // Save settings when changed
  const updateSetting = useCallback(async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (settingsLoaded) {
      await getPlatformApi().setSetting(key, value);
    }
  }, [settingsLoaded]);

  // Handle touch gamepad per-element layout changes
  const touchGamepadLayout: GamepadLayout = useMemo(() => parseLayout(settings.touchGamepadLayout), [settings.touchGamepadLayout]);

  const handleTouchGamepadElementDrag = useCallback(
    (id: GamepadElementId, x: number, y: number) => {
      setSettings((prev) => {
        const currentLayout = parseLayout(prev.touchGamepadLayout);
        const nextLayout = { ...currentLayout, [id]: { x, y } };
        const nextJson = JSON.stringify(nextLayout);

        if (settingsLoaded) {
          getPlatformApi().setSetting("touchGamepadLayout", nextJson);
        }

        return {
          ...prev,
          touchGamepadLayout: nextJson,
        };
      });
    },
    [settingsLoaded]
  );

  const resetTouchGamepadLayout = useCallback(async () => {
    setSettings((prev) => ({ ...prev, touchGamepadLayout: "{}" }));
    if (settingsLoaded) {
      await getPlatformApi().setSetting("touchGamepadLayout", "{}");
    }
  }, [settingsLoaded]);

  // Login handler
  const handleLogin = useCallback(async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const session = await getPlatformApi().login({ providerIdpId: providerIdpId || undefined }) as any;
      // Login resolved -- stop spinner immediately so user can see the app
      setAuthSession(session);
      if (session?.provider?.idpId) setProviderIdpId(session.provider.idpId);
      setIsLoggingIn(false);

      // Load the rest in the background -- don't block the UI
      const token = session.tokens.idToken ?? session.tokens.accessToken;

      getPlatformApi().getRegions({ token, providerStreamingBaseUrl: session.provider?.streamingServiceUrl } as any).then(setRegions).catch(() => {});
      loadSubscriptionInfo(session).catch(() => setSubscriptionInfo(null));

      getPlatformApi().fetchMainGames({
        token,
        providerStreamingBaseUrl: session.provider.streamingServiceUrl,
      }).then((mainGames) => {
        setGames(mainGames);
        setSource("main");
        setSelectedGameId(mainGames[0]?.id ?? "");
      }).catch((e: any) => {
        // Fall back to public games but show the error briefly
        setLoginError("games: " + (e?.message ?? String(e)));
        setTimeout(() => setLoginError(null), 8000);
        getPlatformApi().fetchPublicGames().then((g) => { setGames(g); setSource("public"); }).catch(() => {});
      });

      getPlatformApi().fetchLibraryGames({
        token,
        providerStreamingBaseUrl: session.provider.streamingServiceUrl,
      }).then(setLibraryGames).catch(() => {});
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
      setIsLoggingIn(false);
    }
  }, [loadSubscriptionInfo, providerIdpId]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    await getPlatformApi().logout();
    setAuthSession(null);
    setGames([]);
    setLibraryGames([]);
    setNavbarActiveSession(null);
    setIsResumingNavbarSession(false);
    setLaunchError(null);
    setSubscriptionInfo(null);
    setCurrentPage("home");
    const publicGames = await getPlatformApi().fetchPublicGames();
    setGames(publicGames);
    setSource("public");
  }, []);

  // Load games handler
  const loadGames = useCallback(async (targetSource: GameSource) => {
    setIsLoadingGames(true);
    try {
      const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
      const baseUrl = effectiveStreamingBaseUrl;

      let result: GameInfo[] = [];
      if (targetSource === "main" && token) {
        result = await getPlatformApi().fetchMainGames({ token, providerStreamingBaseUrl: baseUrl });
      } else if (targetSource === "library" && token) {
        result = await getPlatformApi().fetchLibraryGames({ token, providerStreamingBaseUrl: baseUrl });
        setLibraryGames(result);
      } else if (targetSource === "public") {
        result = await getPlatformApi().fetchPublicGames();
      }

      if (targetSource !== "library") {
        setGames(result);
        setSource(targetSource);
        setSelectedGameId(result[0]?.id ?? "");
      }
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoadingGames(false);
    }
  }, [authSession, effectiveStreamingBaseUrl]);

  const claimAndConnectSession = useCallback(async (existingSession: ActiveSessionInfo): Promise<void> => {
    const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
    if (!token) {
      throw new Error("Missing token for session resume");
    }
    if (!existingSession.serverIp) {
      throw new Error("Active session is missing server address. Start the game again to create a new session.");
    }

    const claimed = await getPlatformApi().claimSession({
      token,
      streamingBaseUrl: effectiveStreamingBaseUrl,
      serverIp: existingSession.serverIp,
      sessionId: existingSession.sessionId,
      settings: {
        resolution: settings.resolution,
        fps: settings.fps,
        maxBitrateMbps: settings.maxBitrateMbps,
        codec: settings.codec,
        colorQuality: settings.colorQuality,
      },
    });

    console.log("Claimed session:", {
      sessionId: claimed.sessionId,
      signalingServer: claimed.signalingServer,
      signalingUrl: claimed.signalingUrl,
      status: claimed.status,
    });

    await sleep(1000);

    setSession(claimed);
    sessionRef.current = claimed;
    setQueuePosition(undefined);
    setStreamStatus("connecting");
    await getPlatformApi().connectSignaling({
      sessionId: claimed.sessionId,
      signalingServer: claimed.signalingServer,
      signalingUrl: claimed.signalingUrl,
    });
  }, [authSession, effectiveStreamingBaseUrl, settings]);

  // Play game handler
  const handlePlayGame = useCallback(async (game: GameInfo) => {
    if (!selectedProvider) return;

    if (launchInFlightRef.current || streamStatus !== "idle") {
      console.warn("Ignoring play request: launch already in progress or stream not idle", {
        inFlight: launchInFlightRef.current,
        streamStatus,
      });
      return;
    }

    launchInFlightRef.current = true;
    let loadingStep: StreamLoadingStatus = "queue";
    const updateLoadingStep = (next: StreamLoadingStatus): void => {
      loadingStep = next;
      setStreamStatus(next);
    };

    setSessionStartedAtMs(Date.now());
    setSessionElapsedSeconds(0);
    setStreamWarning(null);
    setLaunchError(null);
    setStreamingGame(game);
    updateLoadingStep("queue");
    setQueuePosition(undefined);
    setQueueEta(undefined);

    try {
      const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
      const selectedVariantId = variantByGameId[game.id] ?? defaultVariantId(game);

      // Resolve appId
      let appId: string | null = null;
      if (isNumericId(selectedVariantId)) {
        appId = selectedVariantId;
      } else if (isNumericId(game.launchAppId)) {
        appId = game.launchAppId;
      }

      if (!appId && token) {
        try {
          const resolved = await getPlatformApi().resolveLaunchAppId({
            token,
            providerStreamingBaseUrl: effectiveStreamingBaseUrl,
            appIdOrUuid: game.uuid ?? selectedVariantId,
          });
          if (resolved && isNumericId(resolved)) {
            appId = resolved;
          }
        } catch {
          // Ignore resolution errors
        }
      }

      if (!appId) {
        throw new Error("Could not resolve numeric appId for this game");
      }

      // Check for active sessions first
      if (token) {
        try {
          console.log("[DEBUG] checking for active sessions...");
          const activeSessions = await getPlatformApi().getActiveSessions(token, effectiveStreamingBaseUrl);
          console.log("[DEBUG] active sessions:", activeSessions.length);
          if (activeSessions.length > 0) {
            const existingSession = activeSessions[0];
            await claimAndConnectSession(existingSession);
            setNavbarActiveSession(null);
            return;
          }
        } catch (error) {
          console.error("Failed to claim/resume session:", error);
          // Continue to create new session
        }
      }

      // Create new session
      // If a region is selected, POST the session directly to that zone's URL.
      // The official GFN client achieves zone selection by routing the POST to
      // the chosen zone's cloudmatch endpoint, NOT via requestedZoneAddress.
      const sessionStreamingBaseUrl = settings.region
        ? settings.region.startsWith("http")
          ? settings.region.replace(/\/$/, "")
          : `https://${settings.region}`
        : effectiveStreamingBaseUrl;
      console.log("[DEBUG] settings.region =", settings.region);
      console.log("[DEBUG] sessionStreamingBaseUrl =", sessionStreamingBaseUrl);
      const newSession = await getPlatformApi().createSession({
        token: token || undefined,
        streamingBaseUrl: sessionStreamingBaseUrl,
        appId,
        internalTitle: game.title,
        accountLinked: game.playType !== "INSTALL_TO_PLAY",
        zone: "prod",
        requestedZoneAddress: settings.region
          ? (() => { try { return new URL(settings.region).hostname || settings.region; } catch { return settings.region; } })()
          : undefined,
        settings: {
          resolution: settings.resolution,
          fps: settings.fps,
          maxBitrateMbps: settings.maxBitrateMbps,
          codec: settings.codec,
          colorQuality: settings.colorQuality,
        },
      });

      setSession(newSession);
      setQueuePosition(newSession.queuePosition);
      setQueueEta(newSession.queueEta);

      let finalSession: SessionInfo | null = null;
      let isInQueueMode = (newSession.queuePosition ?? 0) >= 1;
      let timeoutStartAttempt = 1;
      const maxAttempts = Math.ceil(SESSION_READY_TIMEOUT_MS / SESSION_READY_POLL_INTERVAL_MS);
      let attempt = 0;

      while (true) {
        attempt++;
        await sleep(SESSION_READY_POLL_INTERVAL_MS);

        const polled = await getPlatformApi().pollSession({
          token: token || undefined,
          streamingBaseUrl: newSession.streamingBaseUrl ?? effectiveStreamingBaseUrl,
          serverIp: newSession.serverIp,
          zone: newSession.zone,
          sessionId: newSession.sessionId,
        });

        setSession(polled);
        setQueuePosition(polled.queuePosition);
        setQueueEta(polled.queueEta);

        const wasInQueueMode = isInQueueMode;
        isInQueueMode = (polled.queuePosition ?? 0) >= 1;
        if (wasInQueueMode && !isInQueueMode) {
          timeoutStartAttempt = attempt;
        }

        console.log(
          `Poll attempt ${attempt}: status=${polled.status}, queuePosition=${polled.queuePosition ?? "n/a"}, serverIp=${polled.serverIp}, queueMode=${isInQueueMode}`,
        );

        if (isSessionReadyForConnect(polled.status)) {
          finalSession = polled;
          break;
        }

        if (isInQueueMode) {
          updateLoadingStep("queue");
        } else if (polled.status === 1) {
          updateLoadingStep("setup");
        }

        if (!isInQueueMode && attempt - timeoutStartAttempt >= maxAttempts) {
          throw new Error(`Session did not become ready in time (${Math.round(SESSION_READY_TIMEOUT_MS / 1000)}s)`);
        }
      }

      setQueuePosition(undefined);
      setQueueEta(undefined);
      updateLoadingStep("connecting");

      const sessionToConnect = sessionRef.current ?? finalSession ?? newSession;
      console.log("Connecting signaling with:", {
        sessionId: sessionToConnect.sessionId,
        signalingServer: sessionToConnect.signalingServer,
        signalingUrl: sessionToConnect.signalingUrl,
        status: sessionToConnect.status,
      });

      await getPlatformApi().connectSignaling({
        sessionId: sessionToConnect.sessionId,
        signalingServer: sessionToConnect.signalingServer,
        signalingUrl: sessionToConnect.signalingUrl,
      });
    } catch (error) {
      console.error("Launch failed:", error);
      setLaunchError(toLaunchErrorState(error, loadingStep));
      await getPlatformApi().disconnectSignaling().catch(() => {});
      clientRef.current?.dispose();
      clientRef.current = null;
      setSession(null);
      setStreamStatus("idle");
      setQueuePosition(undefined);
      setQueueEta(undefined);
      setSessionStartedAtMs(null);
      setSessionElapsedSeconds(0);
      setStreamWarning(null);
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      setDiagnostics(defaultDiagnostics());
      void refreshNavbarActiveSession();
    } finally {
      launchInFlightRef.current = false;
    }
  }, [
    authSession,
    claimAndConnectSession,
    effectiveStreamingBaseUrl,
    refreshNavbarActiveSession,
    selectedProvider,
    settings,
    streamStatus,
    variantByGameId,
  ]);

  const handleResumeFromNavbar = useCallback(async () => {
    if (!selectedProvider || !navbarActiveSession || isResumingNavbarSession) {
      return;
    }
    if (launchInFlightRef.current || streamStatus !== "idle") {
      return;
    }

    launchInFlightRef.current = true;
    setIsResumingNavbarSession(true);
    let loadingStep: StreamLoadingStatus = "setup";
    const updateLoadingStep = (next: StreamLoadingStatus): void => {
      loadingStep = next;
      setStreamStatus(next);
    };

    setLaunchError(null);
    setQueuePosition(undefined);
    setSessionStartedAtMs(Date.now());
    setSessionElapsedSeconds(0);
    setStreamWarning(null);
    updateLoadingStep("setup");

    try {
      await claimAndConnectSession(navbarActiveSession);
      setNavbarActiveSession(null);
    } catch (error) {
      console.error("Navbar resume failed:", error);
      setLaunchError(toLaunchErrorState(error, loadingStep));
      await getPlatformApi().disconnectSignaling().catch(() => {});
      clientRef.current?.dispose();
      clientRef.current = null;
      setSession(null);
      setStreamStatus("idle");
      setQueuePosition(undefined);
      setSessionStartedAtMs(null);
      setSessionElapsedSeconds(0);
      setStreamWarning(null);
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      setDiagnostics(defaultDiagnostics());
      void refreshNavbarActiveSession();
    } finally {
      launchInFlightRef.current = false;
      setIsResumingNavbarSession(false);
    }
  }, [
    claimAndConnectSession,
    isResumingNavbarSession,
    navbarActiveSession,
    refreshNavbarActiveSession,
    selectedProvider,
    streamStatus,
  ]);

  // Stop stream handler
  const handleStopStream = useCallback(async () => {
    try {
      resolveExitPrompt(false);
      await getPlatformApi().disconnectSignaling();

      const current = sessionRef.current;
      if (current) {
        const token = authSession?.tokens.idToken ?? authSession?.tokens.accessToken;
        await getPlatformApi().stopSession({
          token: token || undefined,
          streamingBaseUrl: current.streamingBaseUrl,
          serverIp: current.serverIp,
          zone: current.zone,
          sessionId: current.sessionId,
        });
      }

      touchHandlerRef.current?.dispose();
      touchHandlerRef.current = null;
      clientRef.current?.dispose();
      clientRef.current = null;
      setSession(null);
      setStreamStatus("idle");
      setStreamingGame(null);
      setNavbarActiveSession(null);
      setLaunchError(null);
      setSessionStartedAtMs(null);
      setSessionElapsedSeconds(0);
      setStreamWarning(null);
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      setDiagnostics(defaultDiagnostics());
      void refreshNavbarActiveSession();
    } catch (error) {
      console.error("Stop failed:", error);
    }
  }, [authSession, refreshNavbarActiveSession, resolveExitPrompt]);

  const handleDismissLaunchError = useCallback(async () => {
    await getPlatformApi().disconnectSignaling().catch(() => {});
    clientRef.current?.dispose();
    clientRef.current = null;
    setSession(null);
    setLaunchError(null);
    setStreamingGame(null);
    setQueuePosition(undefined);
    setSessionStartedAtMs(null);
    setSessionElapsedSeconds(0);
    setStreamWarning(null);
    setEscHoldReleaseIndicator({ visible: false, progress: 0 });
    setDiagnostics(defaultDiagnostics());
    void refreshNavbarActiveSession();
  }, [refreshNavbarActiveSession]);

  const releasePointerLockIfNeeded = useCallback(async () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
      setEscHoldReleaseIndicator({ visible: false, progress: 0 });
      await sleep(75);
    }
  }, []);

  const handlePromptedStopStream = useCallback(async () => {
    if (streamStatus === "idle") {
      return;
    }

    await releasePointerLockIfNeeded();

    const gameName = (streamingGame?.title || "this game").trim();
    const shouldExit = await requestExitPrompt(gameName);
    if (!shouldExit) {
      return;
    }

    await handleStopStream();
  }, [handleStopStream, releasePointerLockIfNeeded, requestExitPrompt, streamStatus, streamingGame?.title]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Android doesn't have a physical keyboard -- skip all shortcut handling.
      if (isAndroid()) return;

      const target = e.target as HTMLElement | null;
      const isTyping = !!target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      );
      if (isTyping) {
        return;
      }

      if (exitPrompt.open) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          handleExitPromptCancel();
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          handleExitPromptConfirm();
        }
        return;
      }

      const isPasteShortcut = e.key.toLowerCase() === "v" && !e.altKey && (isMac ? e.metaKey : e.ctrlKey);
      if (streamStatus === "streaming" && isPasteShortcut) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (settings.clipboardPaste) {
          void (async () => {
            const client = clientRef.current;
            if (!client) return;

            try {
              const text = await navigator.clipboard.readText();
              if (text && client.sendText(text) > 0) {
                return;
              }
            } catch (error) {
              console.warn("Clipboard read failed, falling back to paste shortcut:", error);
            }

            client.sendPasteShortcut(isMac);
          })();
        }
        return;
      }

      if (isShortcutMatch(e, shortcuts.toggleStats)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setShowStatsOverlay((prev) => !prev);
        return;
      }

      if (isShortcutMatch(e, shortcuts.togglePointerLock)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (streamStatus === "streaming" && videoRef.current) {
          if (document.pointerLockElement === videoRef.current) {
            document.exitPointerLock();
          } else {
            void requestEscLockedPointerCapture(videoRef.current);
          }
        }
        return;
      }

      if (isShortcutMatch(e, shortcuts.stopStream)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void handlePromptedStopStream();
        return;
      }

      if (isShortcutMatch(e, shortcuts.toggleAntiAfk)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (streamStatus === "streaming") {
          setAntiAfkEnabled((prev) => !prev);
        }
        return;
      }

      if (isShortcutMatch(e, shortcuts.toggleMicrophone)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (streamStatus === "streaming") {
          clientRef.current?.toggleMicrophone();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    exitPrompt.open,
    handleExitPromptCancel,
    handleExitPromptConfirm,
    handlePromptedStopStream,
    requestEscLockedPointerCapture,
    settings.clipboardPaste,
    shortcuts,
    streamStatus,
  ]);

  // Filter games by search
  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return games;
    return games.filter((g) => g.title.toLowerCase().includes(query));
  }, [games, searchQuery]);

  const filteredLibraryGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return libraryGames;
    return libraryGames.filter((g) => g.title.toLowerCase().includes(query));
  }, [libraryGames, searchQuery]);

  const gameTitleByAppId = useMemo(() => {
    const titles = new Map<number, string>();
    const allKnownGames = [...games, ...libraryGames];

    for (const game of allKnownGames) {
      const idsForGame = new Set<number>();
      const launchId = parseNumericId(game.launchAppId);
      if (launchId !== null) {
        idsForGame.add(launchId);
      }
      for (const variant of game.variants) {
        const variantId = parseNumericId(variant.id);
        if (variantId !== null) {
          idsForGame.add(variantId);
        }
      }
      for (const appId of idsForGame) {
        if (!titles.has(appId)) {
          titles.set(appId, game.title);
        }
      }
    }

    return titles;
  }, [games, libraryGames]);

  const activeSessionGameTitle = useMemo(() => {
    if (!navbarActiveSession) return null;
    const mappedTitle = gameTitleByAppId.get(navbarActiveSession.appId);
    if (mappedTitle) {
      return mappedTitle;
    }
    if (session?.sessionId === navbarActiveSession.sessionId && streamingGame?.title) {
      return streamingGame.title;
    }
    return null;
  }, [gameTitleByAppId, navbarActiveSession, session?.sessionId, streamingGame?.title]);

  // Show login screen if not authenticated
  if (!authSession) {
    return (
      <>
        <LoginScreen
          providers={providers}
          selectedProviderId={providerIdpId}
          onProviderChange={setProviderIdpId}
          onLogin={handleLogin}
          isLoading={isLoggingIn}
          error={loginError}
          isInitializing={isInitializing}
          statusMessage={startupStatusMessage}
        />
        {controllerConnected && (
          <div className="controller-hint">
            <span>D-pad Navigate</span>
            <span>A Select</span>
            <span>B Back</span>
          </div>
        )}
      </>
    );
  }

  const showLaunchOverlay = streamStatus !== "idle" || launchError !== null;

  // Show stream lifecycle (waiting/connecting/streaming/failure)
  if (showLaunchOverlay) {
    const loadingStatus = launchError ? launchError.stage : toLoadingStatus(streamStatus);
    return (
      <>
        {streamStatus !== "idle" && (
          <StreamView
            videoRef={videoRef}
            audioRef={audioRef}
            stats={diagnostics}
            showStats={showStatsOverlay}
            shortcuts={{
              toggleStats: formatShortcutForDisplay(settings.shortcutToggleStats, isMac),
              togglePointerLock: formatShortcutForDisplay(settings.shortcutTogglePointerLock, isMac),
              stopStream: formatShortcutForDisplay(settings.shortcutStopStream, isMac),
              toggleMicrophone: formatShortcutForDisplay(settings.shortcutToggleMicrophone, isMac),
            }}
            hideStreamButtons={settings.hideStreamButtons}
            serverRegion={session?.serverIp}
            connectedControllers={diagnostics.connectedGamepads}
            antiAfkEnabled={antiAfkEnabled}
            escHoldReleaseIndicator={escHoldReleaseIndicator}
            exitPrompt={exitPrompt}
            sessionElapsedSeconds={sessionElapsedSeconds}
            sessionClockShowEveryMinutes={settings.sessionClockShowEveryMinutes}
            sessionClockShowDurationSeconds={settings.sessionClockShowDurationSeconds}
            streamWarning={streamWarning}
            isConnecting={streamStatus === "connecting"}
            gameTitle={streamingGame?.title ?? "Game"}
            showTouchGamepadToggle={shouldShowTouchGamepad}
            touchGamepadHidden={touchGamepadHidden}
            onToggleFullscreen={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              } else {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }}
            onConfirmExit={handleExitPromptConfirm}
            onCancelExit={handleExitPromptCancel}
            onEndSession={() => {
              void handlePromptedStopStream();
            }}
            onToggleMicrophone={() => {
              clientRef.current?.toggleMicrophone();
            }}
            onToggleTouchGamepad={() => {
              setTouchGamepadHidden((hidden) => !hidden);
            }}
            touchGamepadEditMode={touchGamepadEditMode}
            onToggleTouchGamepadEditMode={() => {
              setTouchGamepadEditMode((mode) => !mode);
            }}
            onResetTouchGamepadLayout={() => {
              void resetTouchGamepadLayout();
            }}
          >
            <TouchGamepad
              clientRef={clientRef}
              visible={shouldShowTouchGamepad && !touchGamepadHidden}
              editMode={touchGamepadEditMode}
              layout={touchGamepadLayout}
              onElementDrag={handleTouchGamepadElementDrag}
            />
          </StreamView>
        )}

        {streamStatus !== "streaming" && (
          <StreamLoading
            gameTitle={streamingGame?.title ?? "Game"}
            gameCover={streamingGame?.imageUrl}
            status={loadingStatus}
            queuePosition={queuePosition}
            estimatedWait={
              queueEta !== undefined
                ? queueEta >= 60
                  ? `${Math.ceil(queueEta / 60)}m`
                  : `${queueEta}s`
                : undefined
            }
            error={
              launchError
                ? {
                    title: launchError.title,
                    description: launchError.description,
                    code: launchError.codeLabel,
                  }
                : undefined
            }
            onCancel={() => {
              if (launchError) {
                void handleDismissLaunchError();
                return;
              }
              // During loading (not yet streaming) skip the exit prompt and cancel directly.
              void handleStopStream();
            }}
          />
        )}
        {controllerConnected && streamStatus !== "streaming" && (
          <div className="controller-hint controller-hint--overlay">
            <span>D-pad Navigate</span>
            <span>A Select</span>
            <span>B Back</span>
          </div>
        )}
      </>
    );
  }

  // Main app layout
  return (
    <div className="app-container">
      {startupRefreshNotice && (
        <div className={`auth-refresh-notice auth-refresh-notice--${startupRefreshNotice.tone}`}>
          {startupRefreshNotice.text}
        </div>
      )}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        activeSession={navbarActiveSession}
        activeSessionGameTitle={activeSessionGameTitle}
        isResumingSession={isResumingNavbarSession}
        onResumeSession={() => {
          void handleResumeFromNavbar();
        }}
      />

      <main className="main-content">
        {currentPage === "home" && (
          <HomePage
            games={filteredGames}
            source={source}
            onSourceChange={loadGames}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPlayGame={handlePlayGame}
            isLoading={isLoadingGames}
            selectedGameId={selectedGameId}
            onSelectGame={setSelectedGameId}
          />
        )}

        {currentPage === "library" && (
          <LibraryPage
            games={filteredLibraryGames}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPlayGame={handlePlayGame}
            isLoading={isLoadingGames}
            selectedGameId={selectedGameId}
            onSelectGame={setSelectedGameId}
          />
        )}

        {currentPage === "settings" && (
          <SettingsPage
            settings={settings}
            regions={regions}
            onSettingChange={updateSetting}
            user={authSession.user}
            subscription={subscriptionInfo}
            onLogout={handleLogout}
          />
        )}
      </main>
      {controllerConnected && (
        <div className="controller-hint">
          <span>D-pad Navigate</span>
          <span>A Select</span>
          <span>B Back</span>
          <span>LB/RB Tabs</span>
        </div>
      )}
    </div>
  );
}
