import assert from "node:assert/strict";
import test from "node:test";

import { getRuntimePlatform, isAndroidRuntime, isElectronRuntime } from "./platform";

test("detects Capacitor Android before Electron preload markers", () => {
  const probe = {
    window: {
      openNow: {},
      Capacitor: {
        isNativePlatform: () => true,
        getPlatform: () => "android",
      },
    },
  };

  assert.equal(isAndroidRuntime(probe), true);
  assert.equal(isElectronRuntime(probe), false);
  assert.equal(getRuntimePlatform(probe), "android");
});

test("detects Electron from process versions", () => {
  assert.equal(
    getRuntimePlatform({
      process: {
        versions: {
          electron: "41.1.1",
        },
      },
    }),
    "electron",
  );
});

test("falls back to web when no native runtime marker exists", () => {
  assert.equal(getRuntimePlatform({ userAgent: "Mozilla/5.0" }), "web");
});
