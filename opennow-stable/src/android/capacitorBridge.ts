type CapacitorPluginResult = Record<string, unknown> | void;

interface CapacitorBridgeWindow {
  Capacitor?: {
    isNativePlatform?: () => boolean;
    getPlatform?: () => string;
    Plugins?: Record<string, Record<string, (payload?: unknown) => Promise<CapacitorPluginResult>>>;
  };
  CapacitorCustomPlatform?: unknown;
  OpenNowGfn?: Record<string, (payload?: unknown) => Promise<CapacitorPluginResult>>;
}

function getBridgeWindow(): CapacitorBridgeWindow | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window as unknown as CapacitorBridgeWindow;
}

export function isCapacitorAndroid(): boolean {
  const bridgeWindow = getBridgeWindow();
  const capacitor = bridgeWindow?.Capacitor;
  return capacitor?.getPlatform?.() === "android" || capacitor?.isNativePlatform?.() === true;
}

export async function callNative<T>(
  method: string,
  payload?: unknown,
): Promise<T | null> {
  const bridgeWindow = getBridgeWindow();
  const plugin = bridgeWindow?.OpenNowGfn ?? bridgeWindow?.Capacitor?.Plugins?.OpenNowGfn;
  const handler = plugin?.[method];
  if (!handler) {
    return null;
  }

  const result = await handler(payload);
  return (result ?? null) as T | null;
}
