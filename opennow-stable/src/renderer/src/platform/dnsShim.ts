// Browser shim for node:dns — DNS resolution is not available in WebView.
// Functions that call resolveHostnameWithFallback() will get null and use their fallback paths.

interface LookupResult {
  address: string;
  family: number;
}

export const promises = {
  lookup: async (_hostname: string): Promise<LookupResult | null> => null,
};

export class Resolver {
  setServers(_servers: string[]): void {
    // no-op
  }
  resolve4(_hostname: string, callback: (err: Error | null, addresses?: string[]) => void): void {
    callback(new Error("DNS not available in browser environment"), []);
  }
}

export default { promises, Resolver };
