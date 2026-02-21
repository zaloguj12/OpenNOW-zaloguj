/**
 * touchInput.ts
 *
 * Translates touch events on the streaming video element into the same
 * mouse/gamepad packets that the desktop path sends.  This is what makes
 * Android (and iOS) able to actually interact with the streamed game.
 *
 * Strategy
 * --------
 * - Single finger  -> relative mouse movement + left-click on tap
 * - Two fingers    -> right-click on double-tap, scroll on swipe
 * - On-screen D-pad / buttons are rendered by the TouchGamepad component
 *   and call the public helpers below directly.
 *
 * We do NOT simulate absolute mouse position because the GFN protocol uses
 * relative deltas -- the same as a real mouse with pointer lock.
 */

import type { GfnWebRtcClient } from "./webrtcClient";

// How many pixels a finger must move before we treat it as a drag vs a tap.
const TAP_MOVE_THRESHOLD_PX = 8;

// How long (ms) a press can last and still count as a tap.
const TAP_MAX_DURATION_MS = 300;

// How long (ms) between two taps for a double-tap to fire.
const DOUBLE_TAP_WINDOW_MS = 350;

interface TouchState {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  startTimeMs: number;
  moved: boolean;
}

export class TouchInputHandler {
  private readonly video: HTMLVideoElement;
  private readonly client: GfnWebRtcClient;

  // Per-identifier touch state (supports up to 2 fingers).
  private touches = new Map<number, TouchState>();

  // Timestamp of the last tap (for double-tap detection).
  private lastTapTimeMs = 0;

  // Whether a left-mouse-button-down was sent (so we can always send the matching up).
  private leftButtonDown = false;
  private rightButtonDown = false;

  // Cleanup functions registered on install.
  private cleanups: Array<() => void> = [];

  constructor(video: HTMLVideoElement, client: GfnWebRtcClient) {
    this.video = video;
    this.client = client;
    this.install();
  }

  // Public helpers (called by the on-screen gamepad component)

  /** Send an on-screen button press (XInput button flag). */
  public pressButton(xinputFlag: number): void {
    this.client.sendGamepadButton(xinputFlag, true);
  }

  public releaseButton(xinputFlag: number): void {
    this.client.sendGamepadButton(xinputFlag, false);
  }

  public setStick(side: "left" | "right", x: number, y: number): void {
    this.client.sendGamepadStick(side, x, y);
  }

  // Installation / teardown

  private install(): void {
    const opts: AddEventListenerOptions = { passive: false };

    const onStart  = (e: TouchEvent) => this.onTouchStart(e);
    const onMove   = (e: TouchEvent) => this.onTouchMove(e);
    const onEnd    = (e: TouchEvent) => this.onTouchEnd(e);
    const onCancel = (e: TouchEvent) => this.onTouchCancel(e);

    this.video.addEventListener("touchstart",  onStart,  opts);
    this.video.addEventListener("touchmove",   onMove,   opts);
    this.video.addEventListener("touchend",    onEnd,    opts);
    this.video.addEventListener("touchcancel", onCancel, opts);

    this.cleanups.push(
      () => this.video.removeEventListener("touchstart",  onStart),
      () => this.video.removeEventListener("touchmove",   onMove),
      () => this.video.removeEventListener("touchend",    onEnd),
      () => this.video.removeEventListener("touchcancel", onCancel),
    );
  }

  public dispose(): void {
    for (const fn of this.cleanups.splice(0)) fn();
    this.releaseAllButtons();
  }

  private releaseAllButtons(): void {
    if (this.leftButtonDown) {
      this.client.sendMouseButtonUp(1);
      this.leftButtonDown = false;
    }
    if (this.rightButtonDown) {
      this.client.sendMouseButtonUp(3);
      this.rightButtonDown = false;
    }
  }

  // Touch event handlers

  private onTouchStart(e: TouchEvent): void {
    e.preventDefault();

    for (const touch of Array.from(e.changedTouches)) {
      this.touches.set(touch.identifier, {
        startX:      touch.clientX,
        startY:      touch.clientY,
        lastX:       touch.clientX,
        lastY:       touch.clientY,
        startTimeMs: Date.now(),
        moved:       false,
      });
    }
  }

  private onTouchMove(e: TouchEvent): void {
    e.preventDefault();

    if (e.touches.length === 2) {
      this.handleTwoFingerScroll(e);
      return;
    }

    // Single-finger drag -> relative mouse movement
    const touch = e.changedTouches[0];
    if (!touch) return;

    const state = this.touches.get(touch.identifier);
    if (!state) return;

    const dx = touch.clientX - state.lastX;
    const dy = touch.clientY - state.lastY;

    const dist = Math.sqrt(
      (touch.clientX - state.startX) ** 2 +
      (touch.clientY - state.startY) ** 2,
    );
    if (dist > TAP_MOVE_THRESHOLD_PX) {
      state.moved = true;
    }

    state.lastX = touch.clientX;
    state.lastY = touch.clientY;

    // Scale movement -- finger movement feels faster than a mouse, so dampen it.
    const scale = 0.7;
    this.client.sendRelativeMouseMove(
      Math.round(dx * scale),
      Math.round(dy * scale),
    );
  }

  private onTouchEnd(e: TouchEvent): void {
    e.preventDefault();

    for (const touch of Array.from(e.changedTouches)) {
      const state = this.touches.get(touch.identifier);
      if (!state) continue;

      const duration = Date.now() - state.startTimeMs;
      const wasTap   = !state.moved && duration < TAP_MAX_DURATION_MS;

      if (wasTap) {
        this.handleTap();
      }

      this.touches.delete(touch.identifier);
    }
  }

  private onTouchCancel(e: TouchEvent): void {
    for (const touch of Array.from(e.changedTouches)) {
      this.touches.delete(touch.identifier);
    }
    this.releaseAllButtons();
  }

  // Gesture interpretation

  private handleTap(): void {
    const now          = Date.now();
    const sinceLastTap = now - this.lastTapTimeMs;
    this.lastTapTimeMs = now;

    if (sinceLastTap < DOUBLE_TAP_WINDOW_MS) {
      // Double-tap -> right click
      this.client.sendMouseButtonDown(3);
      this.rightButtonDown = true;
      setTimeout(() => {
        this.client.sendMouseButtonUp(3);
        this.rightButtonDown = false;
      }, 80);
    } else {
      // Single tap -> left click
      this.client.sendMouseButtonDown(1);
      this.leftButtonDown = true;
      setTimeout(() => {
        this.client.sendMouseButtonUp(1);
        this.leftButtonDown = false;
      }, 80);
    }
  }

  private handleTwoFingerScroll(e: TouchEvent): void {
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    if (!t1 || !t2) return;

    const s1 = this.touches.get(t1.identifier);
    const s2 = this.touches.get(t2.identifier);
    if (!s1 || !s2) return;

    const avgDy = ((t1.clientY - s1.lastY) + (t2.clientY - s2.lastY)) / 2;

    s1.lastX = t1.clientX;
    s1.lastY = t1.clientY;
    s2.lastX = t2.clientX;
    s2.lastY = t2.clientY;

    if (Math.abs(avgDy) > 1) {
      // GFN scroll delta is negated (scroll up = positive delta)
      this.client.sendMouseWheel(Math.round(-avgDy * 3));
    }
  }
}
