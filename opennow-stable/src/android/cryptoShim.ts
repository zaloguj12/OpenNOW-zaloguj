export function ensureCryptoShim(): void {
  if (typeof globalThis.crypto !== "undefined") {
    return;
  }

  throw new Error("Web Crypto is unavailable in this Android WebView runtime.");
}
