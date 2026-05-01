import type {
  AppUpdaterState,
  OpenNowApi,
  Settings,
} from "@shared/gfn";
import {
  DEFAULT_KEYBOARD_LAYOUT,
  getDefaultStreamPreferences,
} from "@shared/gfn";

import { getRuntimePlatform } from "../platform";
import { AndroidAuthRuntime } from "./auth";
import { ensureCryptoShim } from "./cryptoShim";

const DEFAULT_STREAM_PREFERENCES = getDefaultStreamPreferences();
const ANDROID_SETTINGS_KEY = "opennow.android.settings";

const DEFAULT_SETTINGS: Settings = {
  resolution: "1920x1080",
  aspectRatio: "16:9",
  posterSizeScale: 1,
  fps: 60,
  maxBitrateMbps: 75,
  codec: DEFAULT_STREAM_PREFERENCES.codec,
  decoderPreference: "auto",
  encoderPreference: "auto",
  colorQuality: DEFAULT_STREAM_PREFERENCES.colorQuality,
  region: "",
  clipboardPaste: false,
  mouseSensitivity: 1,
  mouseAcceleration: 1,
  shortcutToggleStats: "F3",
  shortcutTogglePointerLock: "F8",
  shortcutToggleFullscreen: "F10",
  shortcutStopStream: "Ctrl+Shift+Q",
  shortcutToggleAntiAfk: "Ctrl+Shift+K",
  shortcutToggleMicrophone: "Ctrl+Shift+M",
  shortcutScreenshot: "F11",
  shortcutToggleRecording: "F12",
  microphoneMode: "disabled",
  microphoneDeviceId: "",
  hideStreamButtons: false,
  showAntiAfkIndicator: true,
  showStatsOnLaunch: false,
  hideServerSelector: false,
  controllerMode: false,
  controllerUiSounds: false,
  controllerBackgroundAnimations: false,
  autoLoadControllerLibrary: false,
  autoFullScreen: false,
  favoriteGameIds: [],
  sessionCounterEnabled: false,
  sessionClockShowEveryMinutes: 60,
  sessionClockShowDurationSeconds: 30,
  windowWidth: 1400,
  windowHeight: 900,
  keyboardLayout: DEFAULT_KEYBOARD_LAYOUT,
  gameLanguage: "en_US",
  enableL4S: false,
  enableCloudGsync: false,
  discordRichPresence: false,
  autoCheckForUpdates: false,
};

interface AndroidWindow {
  openNow?: OpenNowApi;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(ANDROID_SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function storeSettings(settings: Settings): void {
  try {
    localStorage.setItem(ANDROID_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Local settings are best-effort until native persistence is wired.
  }
}

function unsupported(method: PropertyKey): never {
  throw new Error(`Android runtime method "${String(method)}" is not implemented yet.`);
}

export async function initializeAndroidRuntime(): Promise<OpenNowApi | null> {
  if (getRuntimePlatform() !== "android") {
    return null;
  }

  const targetWindow = window as unknown as AndroidWindow;
  if (targetWindow.openNow) {
    return targetWindow.openNow;
  }

  ensureCryptoShim();

  const authRuntime = new AndroidAuthRuntime();
  await authRuntime.initialize();

  let settings = loadSettings();
  const updaterState: AppUpdaterState = {
    status: "disabled",
    currentVersion: "android",
    message: "Updates are managed by Android.",
    updateSource: "github-releases",
    canCheck: false,
    canDownload: false,
    canInstall: false,
    isPackaged: true,
  };

  const implemented = {
    getAuthSession: authRuntime.getSession.bind(authRuntime),
    getLoginProviders: authRuntime.getProviders.bind(authRuntime),
    getRegions: authRuntime.getRegions.bind(authRuntime),
    login: authRuntime.login.bind(authRuntime),
    logout: authRuntime.logout.bind(authRuntime),
    logoutAll: authRuntime.logoutAll.bind(authRuntime),
    getSavedAccounts: authRuntime.getSavedAccounts.bind(authRuntime),
    switchAccount: authRuntime.switchAccount.bind(authRuntime),
    removeAccount: authRuntime.removeAccount.bind(authRuntime),
    getSettings: async () => settings,
    setSetting: async <K extends keyof Settings>(key: K, value: Settings[K]) => {
      settings = { ...settings, [key]: value };
      storeSettings(settings);
    },
    resetSettings: async () => {
      settings = { ...DEFAULT_SETTINGS };
      storeSettings(settings);
      return settings;
    },
    getUpdaterState: async () => updaterState,
    checkForUpdates: async () => updaterState,
    downloadUpdate: async () => updaterState,
    installUpdateAndRestart: async () => updaterState,
    onUpdaterStateChanged: () => () => undefined,
    onSignalingEvent: () => () => undefined,
    onToggleFullscreen: () => () => undefined,
    onTriggerScreenshot: () => () => undefined,
    toggleFullscreen: async () => undefined,
    setFullscreen: async () => undefined,
    togglePointerLock: async () => undefined,
    disconnectSignaling: async () => undefined,
    clearDiscordActivity: async () => undefined,
    quitApp: async () => undefined,
  } satisfies Partial<OpenNowApi>;

  const api = new Proxy(implemented, {
    get(target, property) {
      if (property in target) {
        return target[property as keyof typeof target];
      }
      return () => unsupported(property);
    },
  }) as unknown as OpenNowApi;

  targetWindow.openNow = api;
  return api;
}
