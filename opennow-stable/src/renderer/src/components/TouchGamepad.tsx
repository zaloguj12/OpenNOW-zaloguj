/**
 * TouchGamepad.tsx
 *
 * An on-screen virtual gamepad for Android / touch devices.
 *
 * It renders:
 *   - A D-pad (left side)
 *   - Two analog thumbsticks (left and right, draggable)
 *   - Face buttons A B X Y (right side)
 *   - Shoulder bumpers LB/RB and triggers LT/RT
 *   - Start + Back buttons (centre)
 *
 * All input is forwarded to the GfnWebRtcClient via the public touch helpers.
 *
 * The component is invisible on desktop -- it only renders when the device
 * has a touch screen and the stream is active.
 */

import { useCallback, useRef, useState } from "react";
import type { JSX } from "react";
import type { GfnWebRtcClient } from "../gfn/webrtcClient";
import {
  GAMEPAD_A, GAMEPAD_B, GAMEPAD_X, GAMEPAD_Y,
  GAMEPAD_LB, GAMEPAD_RB,
  GAMEPAD_LS, GAMEPAD_RS,
  GAMEPAD_DPAD_UP, GAMEPAD_DPAD_DOWN, GAMEPAD_DPAD_LEFT, GAMEPAD_DPAD_RIGHT,
  GAMEPAD_START, GAMEPAD_BACK,
} from "../gfn/inputProtocol";

interface Props {
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  visible: boolean;
}

// Clamp a number to [-1, 1].
function clamp(v: number): number {
  return Math.max(-1, Math.min(1, v));
}

// Face button component

interface FaceButtonProps {
  label: string;
  color: string;
  xinputFlag: number;
  clientRef: React.RefObject<GfnWebRtcClient | null>;
}

function FaceButton({ label, color, xinputFlag, clientRef }: FaceButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  const onPress = useCallback(() => {
    setPressed(true);
    clientRef.current?.sendGamepadButton(xinputFlag, true);
  }, [clientRef, xinputFlag]);

  const onRelease = useCallback(() => {
    setPressed(false);
    clientRef.current?.sendGamepadButton(xinputFlag, false);
  }, [clientRef, xinputFlag]);

  return (
    <button
      type="button"
      className={`tgp-face-btn ${pressed ? "tgp-face-btn--pressed" : ""}`}
      style={{
        borderColor: color,
        color: pressed ? "#000" : color,
        background: pressed ? color : "rgba(0,0,0,0.5)",
      }}
      onTouchStart={(e) => { e.preventDefault(); onPress(); }}
      onTouchEnd={(e)   => { e.preventDefault(); onRelease(); }}
      onTouchCancel={(e) => { e.preventDefault(); onRelease(); }}
    >
      {label}
    </button>
  );
}

// D-pad component

interface DpadProps {
  clientRef: React.RefObject<GfnWebRtcClient | null>;
}

function Dpad({ clientRef }: DpadProps): JSX.Element {
  const pressed = useRef(new Set<number>());

  const press = useCallback((flag: number) => {
    if (pressed.current.has(flag)) return;
    pressed.current.add(flag);
    clientRef.current?.sendGamepadButton(flag, true);
  }, [clientRef]);

  const release = useCallback((flag: number) => {
    if (!pressed.current.has(flag)) return;
    pressed.current.delete(flag);
    clientRef.current?.sendGamepadButton(flag, false);
  }, [clientRef]);

  const releaseAll = useCallback(() => {
    for (const flag of pressed.current) {
      clientRef.current?.sendGamepadButton(flag, false);
    }
    pressed.current.clear();
  }, [clientRef]);

  const flagsFromPosition = (el: HTMLElement, cx: number, cy: number): number[] => {
    const rect = el.getBoundingClientRect();
    const x = (cx - rect.left)  / rect.width  - 0.5;
    const y = (cy - rect.top)   / rect.height - 0.5;

    const flags: number[] = [];
    if (y < -0.2) flags.push(GAMEPAD_DPAD_UP);
    if (y >  0.2) flags.push(GAMEPAD_DPAD_DOWN);
    if (x < -0.2) flags.push(GAMEPAD_DPAD_LEFT);
    if (x >  0.2) flags.push(GAMEPAD_DPAD_RIGHT);
    return flags;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    for (const t of Array.from(e.changedTouches)) {
      for (const f of flagsFromPosition(target, t.clientX, t.clientY)) press(f);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const next = new Set<number>();
    for (const t of Array.from(e.touches)) {
      for (const f of flagsFromPosition(target, t.clientX, t.clientY)) next.add(f);
    }
    for (const f of pressed.current) {
      if (!next.has(f)) release(f);
    }
    for (const f of next) {
      press(f);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.touches.length === 0) releaseAll();
  };

  return (
    <div
      className="tgp-dpad"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="tgp-dpad-cross">
        <div className="tgp-dpad-up" />
        <div className="tgp-dpad-row">
          <div className="tgp-dpad-left" />
          <div className="tgp-dpad-center" />
          <div className="tgp-dpad-right" />
        </div>
        <div className="tgp-dpad-down" />
      </div>
    </div>
  );
}

// Analog thumbstick component

interface ThumbstickProps {
  side: "left" | "right";
  clientRef: React.RefObject<GfnWebRtcClient | null>;
}

function Thumbstick({ side, clientRef }: ThumbstickProps): JSX.Element {
  const stickRef = useRef<HTMLDivElement | null>(null);
  const knobRef  = useRef<HTMLDivElement | null>(null);
  const activeId = useRef<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const RADIUS = 36; // px -- how far the knob can travel from centre

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (activeId.current !== null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    activeId.current = touch.identifier;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const base = stickRef.current;
    if (!base || activeId.current === null) return;

    let touch: Touch | undefined;
    for (const t of Array.from(e.touches)) {
      if (t.identifier === activeId.current) { touch = t; break; }
    }
    if (!touch) return;

    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > RADIUS) {
      dx = (dx / dist) * RADIUS;
      dy = (dy / dist) * RADIUS;
    }

    setOffset({ x: dx, y: dy });

    const nx = clamp(dx / RADIUS);
    const ny = clamp(dy / RADIUS);
    clientRef.current?.sendGamepadStick(side, nx, ny);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    let found = false;
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === activeId.current) { found = true; break; }
    }
    if (!found) return;

    activeId.current = null;
    setOffset({ x: 0, y: 0 });
    clientRef.current?.sendGamepadStick(side, 0, 0);
  };

  return (
    <div
      ref={stickRef}
      className="tgp-stick"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={knobRef}
        className="tgp-stick-knob"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />
    </div>
  );
}

// Shoulder button

interface ShoulderProps {
  label: string;
  xinputFlag: number;
  clientRef: React.RefObject<GfnWebRtcClient | null>;
}

function ShoulderButton({ label, xinputFlag, clientRef }: ShoulderProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`tgp-shoulder ${pressed ? "tgp-shoulder--pressed" : ""}`}
      onTouchStart={(e) => { e.preventDefault(); setPressed(true);  clientRef.current?.sendGamepadButton(xinputFlag, true);  }}
      onTouchEnd={(e)   => { e.preventDefault(); setPressed(false); clientRef.current?.sendGamepadButton(xinputFlag, false); }}
      onTouchCancel={(e) => { e.preventDefault(); setPressed(false); clientRef.current?.sendGamepadButton(xinputFlag, false); }}
    >
      {label}
    </button>
  );
}

interface TriggerButtonProps {
  label: string;
  side: "left" | "right";
  clientRef: React.RefObject<GfnWebRtcClient | null>;
}

function TriggerButton({ label, side, clientRef }: TriggerButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`tgp-shoulder ${pressed ? "tgp-shoulder--pressed" : ""}`}
      onTouchStart={(e) => { e.preventDefault(); setPressed(true); clientRef.current?.sendGamepadTrigger(side, 255); }}
      onTouchEnd={(e) => { e.preventDefault(); setPressed(false); clientRef.current?.sendGamepadTrigger(side, 0); }}
      onTouchCancel={(e) => { e.preventDefault(); setPressed(false); clientRef.current?.sendGamepadTrigger(side, 0); }}
    >
      {label}
    </button>
  );
}

// Centre button (Start / Back)

interface CentreButtonProps {
  label: string;
  xinputFlag: number;
  clientRef: React.RefObject<GfnWebRtcClient | null>;
}

function CentreButton({ label, xinputFlag, clientRef }: CentreButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`tgp-centre ${pressed ? "tgp-centre--pressed" : ""}`}
      onTouchStart={(e) => { e.preventDefault(); setPressed(true);  clientRef.current?.sendGamepadButton(xinputFlag, true);  }}
      onTouchEnd={(e)   => { e.preventDefault(); setPressed(false); clientRef.current?.sendGamepadButton(xinputFlag, false); }}
      onTouchCancel={(e) => { e.preventDefault(); setPressed(false); clientRef.current?.sendGamepadButton(xinputFlag, false); }}
    >
      {label}
    </button>
  );
}

// Main component

export function TouchGamepad({ clientRef, visible }: Props): JSX.Element | null {
  if (!visible) return null;

  return (
    <div className="tgp">
      {/* Left side: shoulder + D-pad + left stick */}
      <div className="tgp-side tgp-side--left">
        <div className="tgp-shoulders">
          <TriggerButton label="LT" side="left" clientRef={clientRef} />
          <ShoulderButton label="LB" xinputFlag={GAMEPAD_LB} clientRef={clientRef} />
        </div>
        <div className="tgp-lower-left">
          <Dpad clientRef={clientRef} />
          <div className="tgp-stick-group">
            <Thumbstick side="left" clientRef={clientRef} />
            <FaceButton label="L3" color="rgba(255,255,255,0.5)" xinputFlag={GAMEPAD_LS} clientRef={clientRef} />
          </div>
        </div>
      </div>

      {/* Centre: Back + Start */}
      <div className="tgp-centre-cluster">
        <CentreButton label="&#9776;" xinputFlag={GAMEPAD_BACK}  clientRef={clientRef} />
        <CentreButton label="&#9654;" xinputFlag={GAMEPAD_START} clientRef={clientRef} />
      </div>

      {/* Right side: shoulder + face buttons + right stick */}
      <div className="tgp-side tgp-side--right">
        <div className="tgp-shoulders">
          <ShoulderButton label="RB" xinputFlag={GAMEPAD_RB} clientRef={clientRef} />
          <TriggerButton label="RT" side="right" clientRef={clientRef} />
        </div>
        <div className="tgp-lower-right">
          <div className="tgp-stick-group">
            <Thumbstick side="right" clientRef={clientRef} />
            <FaceButton label="R3" color="rgba(255,255,255,0.5)" xinputFlag={GAMEPAD_RS} clientRef={clientRef} />
          </div>
          <div className="tgp-face">
            <FaceButton label="Y" color="#f5c518" xinputFlag={GAMEPAD_Y} clientRef={clientRef} />
            <div className="tgp-face-row">
              <FaceButton label="X" color="#5b9bd5" xinputFlag={GAMEPAD_X} clientRef={clientRef} />
              <FaceButton label="B" color="#e05c5c" xinputFlag={GAMEPAD_B} clientRef={clientRef} />
            </div>
            <FaceButton label="A" color="#58d98a" xinputFlag={GAMEPAD_A} clientRef={clientRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
