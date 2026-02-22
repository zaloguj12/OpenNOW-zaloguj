// Browser shim for node:crypto
// cloudmatch.ts only uses randomUUID() from crypto, which is natively
// available in modern browsers and the Android WebView via globalThis.crypto.
export function randomUUID(): string {
  return globalThis.crypto.randomUUID();
}

export default { randomUUID };
