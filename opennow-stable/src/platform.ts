export type RuntimePlatform = "electron" | "android" | "web";

interface RuntimePlatformProbe {
  window?: {
    openNow?: unknown;
    process?: {
      type?: string;
      versions?: {
        electron?: string;
      };
    };
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
    };
  };
  process?: {
    versions?: {
      electron?: string;
    };
  };
  userAgent?: string;
}

function getDefaultProbe(): RuntimePlatformProbe {
  const globalScope = globalThis as RuntimePlatformProbe;
  const navigatorScope = globalThis as { navigator?: { userAgent?: string } };
  return {
    window: globalScope.window,
    process: globalScope.process,
    userAgent: navigatorScope.navigator?.userAgent,
  };
}

export function isAndroidRuntime(probe: RuntimePlatformProbe = getDefaultProbe()): boolean {
  const capacitor = probe.window?.Capacitor;
  if (capacitor?.isNativePlatform?.() === true) {
    return capacitor.getPlatform?.() === "android";
  }

  if (capacitor?.getPlatform?.() === "android") {
    return true;
  }

  return /\bAndroid\b/i.test(probe.userAgent ?? "");
}

export function isElectronRuntime(probe: RuntimePlatformProbe = getDefaultProbe()): boolean {
  if (isAndroidRuntime(probe)) {
    return false;
  }

  return Boolean(
    probe.process?.versions?.electron ||
      probe.window?.process?.versions?.electron ||
      probe.window?.process?.type === "renderer" ||
      probe.window?.openNow,
  );
}

export function getRuntimePlatform(probe: RuntimePlatformProbe = getDefaultProbe()): RuntimePlatform {
  if (isAndroidRuntime(probe)) {
    return "android";
  }

  if (isElectronRuntime(probe)) {
    return "electron";
  }

  return "web";
}

export const runtimePlatform = getRuntimePlatform();
