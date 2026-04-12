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
 *
 * Supports an edit mode where every element can be individually dragged
 * to a custom position. Positions are stored as viewport percentages (vw/vh)
 * so the layout scales correctly across different screen sizes.
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

// ─── Per-element layout system ───────────────────────────────────────────────

/** Position of a single gamepad element in viewport percentages */
export interface ElementPosition {
  /** Left offset as % of viewport width (0–100) */
  x: number;
  /** Top offset as % of viewport height (0–100) */
  y: number;
}

/** Full layout: element ID → position. Missing keys use defaults. */
export type GamepadLayout = Record<string, ElementPosition>;

/** All draggable element IDs */
export type GamepadElementId =
  | "lt" | "lb" | "dpad" | "lstick"
  | "back" | "start"
  | "rb" | "rt" | "rstick"
  | "btn-y" | "btn-x" | "btn-b" | "btn-a";

/** Default positions (viewport %) — matches the original flex layout */
export const DEFAULT_POSITIONS: Record<GamepadElementId, ElementPosition> = {
  lt:      { x: 1.4,  y: 3.5 },
  lb:      { x: 9.3,  y: 3.5 },
  dpad:    { x: 1.8,  y: 51.8 },
  lstick:  { x: 18.1, y: 52.5 },
  back:    { x: 43.5, y: 82 },
  start:   { x: 50,   y: 82 },
  rb:      { x: 83.7, y: 3.5 },
  rt:      { x: 91.6, y: 3.5 },
  rstick:  { x: 72.1, y: 52.5 },
  "btn-y": { x: 88.6, y: 42.5 },
  "btn-x": { x: 84.4, y: 55 },
  "btn-b": { x: 93,   y: 55 },
  "btn-a": { x: 88.8, y: 67.5 },
};

export const ALL_ELEMENT_IDS: GamepadElementId[] = [
  "lt", "lb", "dpad", "lstick",
  "back", "start",
  "rb", "rt", "rstick",
  "btn-y", "btn-x", "btn-b", "btn-a",
];

/** Parse the JSON layout string from settings, falling back to empty */
export function parseLayout(json: string): GamepadLayout {
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as GamepadLayout;
    }
  } catch {
    // invalid JSON — use defaults
  }
  return {};
}

/** Resolve element position: user override → default */
function getPosition(layout: GamepadLayout, id: GamepadElementId): ElementPosition {
  return layout[id] ?? DEFAULT_POSITIONS[id];
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  visible: boolean;
  editMode?: boolean;
  layout?: GamepadLayout;
  onElementDrag?: (id: GamepadElementId, x: number, y: number) => void;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function clamp(v: number): number {
  return Math.max(-1, Math.min(1, v));
}

// ─── Sub-components (unchanged game input logic) ─────────────────────────────

interface FaceButtonProps {
  label: string;
  color: string;
  xinputFlag: number;
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled?: boolean;
}

function FaceButton({ label, color, xinputFlag, clientRef, disabled }: FaceButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  const onPress = useCallback(() => {
    if (disabled) return;
    setPressed(true);
    clientRef.current?.sendGamepadButton(xinputFlag, true);
  }, [clientRef, xinputFlag, disabled]);

  const onRelease = useCallback(() => {
    if (disabled) return;
    setPressed(false);
    clientRef.current?.sendGamepadButton(xinputFlag, false);
  }, [clientRef, xinputFlag, disabled]);

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

interface DpadProps {
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled?: boolean;
}

function Dpad({ clientRef, disabled }: DpadProps): JSX.Element {
  const pressed = useRef(new Set<number>());

  const press = useCallback((flag: number) => {
    if (disabled) return;
    if (pressed.current.has(flag)) return;
    pressed.current.add(flag);
    clientRef.current?.sendGamepadButton(flag, true);
  }, [clientRef, disabled]);

  const release = useCallback((flag: number) => {
    if (disabled) return;
    if (!pressed.current.has(flag)) return;
    pressed.current.delete(flag);
    clientRef.current?.sendGamepadButton(flag, false);
  }, [clientRef, disabled]);

  const releaseAll = useCallback(() => {
    if (disabled) return;
    for (const flag of pressed.current) {
      clientRef.current?.sendGamepadButton(flag, false);
    }
    pressed.current.clear();
  }, [clientRef, disabled]);

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
    if (disabled) return;
    const target = e.currentTarget;
    for (const t of Array.from(e.changedTouches)) {
      for (const f of flagsFromPosition(target, t.clientX, t.clientY)) press(f);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
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
    if (disabled) return;
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

interface ThumbstickProps {
  side: "left" | "right";
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled?: boolean;
}

function Thumbstick({ side, clientRef, disabled }: ThumbstickProps): JSX.Element {
  const stickRef = useRef<HTMLDivElement | null>(null);
  const knobRef  = useRef<HTMLDivElement | null>(null);
  const activeId = useRef<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const RADIUS = 36;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    if (activeId.current !== null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    activeId.current = touch.identifier;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const base = stickRef.current;
    if (!base || activeId.current === null) return;

    let foundTouch: { identifier: number; clientX: number; clientY: number } | undefined;
    for (const t of Array.from(e.touches)) {
      if (t.identifier === activeId.current) { foundTouch = t; break; }
    }
    if (!foundTouch) return;

    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    let dx = foundTouch.clientX - cx;
    let dy = foundTouch.clientY - cy;
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
    if (disabled) return;
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

interface ShoulderProps {
  label: string;
  xinputFlag: number;
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled?: boolean;
}

function ShoulderButton({ label, xinputFlag, clientRef, disabled }: ShoulderProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`tgp-shoulder ${pressed ? "tgp-shoulder--pressed" : ""}`}
      onTouchStart={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(true);
        clientRef.current?.sendGamepadButton(xinputFlag, true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      }}
    >
      {label}
    </button>
  );
}

interface TriggerButtonProps {
  label: string;
  side: "left" | "right";
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled?: boolean;
}

function TriggerButton({ label, side, clientRef, disabled }: TriggerButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`tgp-shoulder ${pressed ? "tgp-shoulder--pressed" : ""}`}
      onTouchStart={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(true);
        clientRef.current?.sendGamepadTrigger(side, 255);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(false);
        clientRef.current?.sendGamepadTrigger(side, 0);
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(false);
        clientRef.current?.sendGamepadTrigger(side, 0);
      }}
    >
      {label}
    </button>
  );
}

interface CentreButtonProps {
  label: string;
  xinputFlag: number;
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled?: boolean;
}

function CentreButton({ label, xinputFlag, clientRef, disabled }: CentreButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`tgp-centre ${pressed ? "tgp-centre--pressed" : ""}`}
      onTouchStart={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(true);
        clientRef.current?.sendGamepadButton(xinputFlag, true);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        if (disabled) return;
        setPressed(false);
        clientRef.current?.sendGamepadButton(xinputFlag, false);
      }}
    >
      {label}
    </button>
  );
}

// ─── DraggableElement — wraps a single element for edit-mode dragging ─────────

interface DraggableElementProps {
  id: GamepadElementId;
  position: ElementPosition;
  editMode: boolean;
  onDrag: (id: GamepadElementId, x: number, y: number) => void;
  children: React.ReactNode;
  label?: string;
}

function DraggableElement({
  id,
  position,
  editMode,
  onDrag,
  children,
  label,
}: DraggableElementProps): JSX.Element {
  const dragState = useRef<{ startX: number; startY: number; identifier: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!editMode) return;
    e.stopPropagation();
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (!touch) return;
    dragState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      identifier: touch.identifier,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!editMode || !dragState.current) return;
    e.stopPropagation();
    e.preventDefault();

    let foundTouch: { identifier: number; clientX: number; clientY: number } | undefined;
    for (const t of Array.from(e.touches)) {
      if (t.identifier === dragState.current.identifier) {
        foundTouch = t;
        break;
      }
    }
    if (!foundTouch) return;

    const deltaXpx = foundTouch.clientX - dragState.current.startX;
    const deltaYpx = foundTouch.clientY - dragState.current.startY;

    dragState.current.startX = foundTouch.clientX;
    dragState.current.startY = foundTouch.clientY;

    // Convert pixel deltas to viewport percentages
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const newX = Math.max(0, Math.min(100, position.x + (deltaXpx / vw) * 100));
    const newY = Math.max(0, Math.min(100, position.y + (deltaYpx / vh) * 100));

    onDrag(id, newX, newY);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!editMode || !dragState.current) return;
    e.stopPropagation();

    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === dragState.current.identifier) {
        dragState.current = null;
        break;
      }
    }
  };

  return (
    <div
      className={`tgp-element ${editMode ? "tgp-element--editing" : ""}`}
      style={{
        left: `${position.x}vw`,
        top: `${position.y}vh`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {editMode && label && (
        <div className="tgp-element-label">{label}</div>
      )}
      {children}
    </div>
  );
}

// ─── StickGroup — stick + L3/R3 button grouped together ──────────────────────

function StickGroup({
  side,
  clientRef,
  disabled,
  xinputFlag,
}: {
  side: "left" | "right";
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  disabled: boolean;
  xinputFlag: number;
}): JSX.Element {
  return (
    <div className="tgp-stick-group">
      <Thumbstick side={side} clientRef={clientRef} disabled={disabled} />
      <FaceButton
        label={side === "left" ? "L3" : "R3"}
        color="rgba(255,255,255,0.5)"
        xinputFlag={xinputFlag}
        clientRef={clientRef}
        disabled={disabled}
      />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function TouchGamepad({
  clientRef,
  visible,
  editMode = false,
  layout = {},
  onElementDrag,
}: Props): JSX.Element | null {
  if (!visible) return null;

  const handleDrag = useCallback(
    (id: GamepadElementId, x: number, y: number) => {
      onElementDrag?.(id, x, y);
    },
    [onElementDrag]
  );

  const inputDisabled = editMode;

  /** Get resolved position for an element */
  const pos = (id: GamepadElementId) => getPosition(layout, id);

  return (
    <div className={`tgp ${editMode ? "tgp--editing" : ""}`}>
      {/* LT */}
      <DraggableElement id="lt" position={pos("lt")} editMode={editMode} onDrag={handleDrag} label="LT">
        <TriggerButton label="LT" side="left" clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* LB */}
      <DraggableElement id="lb" position={pos("lb")} editMode={editMode} onDrag={handleDrag} label="LB">
        <ShoulderButton label="LB" xinputFlag={GAMEPAD_LB} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* D-Pad */}
      <DraggableElement id="dpad" position={pos("dpad")} editMode={editMode} onDrag={handleDrag} label="D-Pad">
        <Dpad clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* Left Stick + L3 */}
      <DraggableElement id="lstick" position={pos("lstick")} editMode={editMode} onDrag={handleDrag} label="L-Stick">
        <StickGroup side="left" clientRef={clientRef} disabled={inputDisabled} xinputFlag={GAMEPAD_LS} />
      </DraggableElement>

      {/* Back */}
      <DraggableElement id="back" position={pos("back")} editMode={editMode} onDrag={handleDrag} label="Back">
        <CentreButton label="&#9776;" xinputFlag={GAMEPAD_BACK} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* Start */}
      <DraggableElement id="start" position={pos("start")} editMode={editMode} onDrag={handleDrag} label="Start">
        <CentreButton label="&#9654;" xinputFlag={GAMEPAD_START} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* RB */}
      <DraggableElement id="rb" position={pos("rb")} editMode={editMode} onDrag={handleDrag} label="RB">
        <ShoulderButton label="RB" xinputFlag={GAMEPAD_RB} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* RT */}
      <DraggableElement id="rt" position={pos("rt")} editMode={editMode} onDrag={handleDrag} label="RT">
        <TriggerButton label="RT" side="right" clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* Right Stick + R3 */}
      <DraggableElement id="rstick" position={pos("rstick")} editMode={editMode} onDrag={handleDrag} label="R-Stick">
        <StickGroup side="right" clientRef={clientRef} disabled={inputDisabled} xinputFlag={GAMEPAD_RS} />
      </DraggableElement>

      {/* Y */}
      <DraggableElement id="btn-y" position={pos("btn-y")} editMode={editMode} onDrag={handleDrag} label="Y">
        <FaceButton label="Y" color="#f5c518" xinputFlag={GAMEPAD_Y} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* X */}
      <DraggableElement id="btn-x" position={pos("btn-x")} editMode={editMode} onDrag={handleDrag} label="X">
        <FaceButton label="X" color="#5b9bd5" xinputFlag={GAMEPAD_X} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* B */}
      <DraggableElement id="btn-b" position={pos("btn-b")} editMode={editMode} onDrag={handleDrag} label="B">
        <FaceButton label="B" color="#e05c5c" xinputFlag={GAMEPAD_B} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>

      {/* A */}
      <DraggableElement id="btn-a" position={pos("btn-a")} editMode={editMode} onDrag={handleDrag} label="A">
        <FaceButton label="A" color="#58d98a" xinputFlag={GAMEPAD_A} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableElement>
    </div>
  );
}
