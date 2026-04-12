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
 * Supports an edit mode for repositioning the three main clusters:
 *   - Left cluster (LT/LB + D-pad + left stick/L3)
 *   - Center cluster (Back/Start)
 *   - Right cluster (RB/RT + right stick/R3 + ABXY)
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

export interface TouchGamepadLayoutOffsets {
  leftOffsetX: number;
  leftOffsetY: number;
  centerOffsetX: number;
  centerOffsetY: number;
  rightOffsetX: number;
  rightOffsetY: number;
}

interface Props {
  clientRef: React.RefObject<GfnWebRtcClient | null>;
  visible: boolean;
  editMode?: boolean;
  layoutOffsets?: TouchGamepadLayoutOffsets;
  onLayoutChange?: (cluster: "left" | "center" | "right", deltaX: number, deltaY: number) => void;
}

function clamp(v: number): number {
  return Math.max(-1, Math.min(1, v));
}

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

interface DraggableClusterProps {
  cluster: "left" | "center" | "right";
  offsetX: number;
  offsetY: number;
  editMode: boolean;
  onDrag: (cluster: "left" | "center" | "right", deltaX: number, deltaY: number) => void;
  children: React.ReactNode;
  className?: string;
}

function DraggableCluster({
  cluster,
  offsetX,
  offsetY,
  editMode,
  onDrag,
  children,
  className = "",
}: DraggableClusterProps): JSX.Element {
  const dragState = useRef<{ startX: number; startY: number; identifier: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!editMode) return;
    e.stopPropagation();
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

    const deltaX = foundTouch.clientX - dragState.current.startX;
    const deltaY = foundTouch.clientY - dragState.current.startY;

    dragState.current.startX = foundTouch.clientX;
    dragState.current.startY = foundTouch.clientY;

    onDrag(cluster, deltaX, deltaY);
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
      className={`tgp-cluster ${editMode ? "tgp-cluster--editing" : ""} ${className}`}
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {editMode && (
        <div className="tgp-cluster-label">
          {cluster === "left" ? "LEFT" : cluster === "center" ? "CENTER" : "RIGHT"}
        </div>
      )}
      {children}
    </div>
  );
}

export function TouchGamepad({
  clientRef,
  visible,
  editMode = false,
  layoutOffsets,
  onLayoutChange,
}: Props): JSX.Element | null {
  if (!visible) return null;

  const offsets = layoutOffsets ?? {
    leftOffsetX: 0,
    leftOffsetY: 0,
    centerOffsetX: 0,
    centerOffsetY: 0,
    rightOffsetX: 0,
    rightOffsetY: 0,
  };

  const handleDrag = useCallback(
    (cluster: "left" | "center" | "right", deltaX: number, deltaY: number) => {
      onLayoutChange?.(cluster, deltaX, deltaY);
    },
    [onLayoutChange]
  );

  const inputDisabled = editMode;

  return (
    <div className={`tgp ${editMode ? "tgp--editing" : ""}`}>
      {/* Left side: shoulder + D-pad + left stick */}
      <DraggableCluster
        cluster="left"
        offsetX={offsets.leftOffsetX}
        offsetY={offsets.leftOffsetY}
        editMode={editMode}
        onDrag={handleDrag}
        className="tgp-side tgp-side--left"
      >
        <div className="tgp-shoulders">
          <TriggerButton label="LT" side="left" clientRef={clientRef} disabled={inputDisabled} />
          <ShoulderButton label="LB" xinputFlag={GAMEPAD_LB} clientRef={clientRef} disabled={inputDisabled} />
        </div>
        <div className="tgp-lower-left">
          <Dpad clientRef={clientRef} disabled={inputDisabled} />
          <div className="tgp-stick-group">
            <Thumbstick side="left" clientRef={clientRef} disabled={inputDisabled} />
            <FaceButton label="L3" color="rgba(255,255,255,0.5)" xinputFlag={GAMEPAD_LS} clientRef={clientRef} disabled={inputDisabled} />
          </div>
        </div>
      </DraggableCluster>

      {/* Centre: Back + Start */}
      <DraggableCluster
        cluster="center"
        offsetX={offsets.centerOffsetX}
        offsetY={offsets.centerOffsetY}
        editMode={editMode}
        onDrag={handleDrag}
        className="tgp-centre-cluster"
      >
        <CentreButton label="&#9776;" xinputFlag={GAMEPAD_BACK} clientRef={clientRef} disabled={inputDisabled} />
        <CentreButton label="&#9654;" xinputFlag={GAMEPAD_START} clientRef={clientRef} disabled={inputDisabled} />
      </DraggableCluster>

      {/* Right side: shoulder + face buttons + right stick */}
      <DraggableCluster
        cluster="right"
        offsetX={offsets.rightOffsetX}
        offsetY={offsets.rightOffsetY}
        editMode={editMode}
        onDrag={handleDrag}
        className="tgp-side tgp-side--right"
      >
        <div className="tgp-shoulders">
          <ShoulderButton label="RB" xinputFlag={GAMEPAD_RB} clientRef={clientRef} disabled={inputDisabled} />
          <TriggerButton label="RT" side="right" clientRef={clientRef} disabled={inputDisabled} />
        </div>
        <div className="tgp-lower-right">
          <div className="tgp-stick-group">
            <Thumbstick side="right" clientRef={clientRef} disabled={inputDisabled} />
            <FaceButton label="R3" color="rgba(255,255,255,0.5)" xinputFlag={GAMEPAD_RS} clientRef={clientRef} disabled={inputDisabled} />
          </div>
          <div className="tgp-face">
            <FaceButton label="Y" color="#f5c518" xinputFlag={GAMEPAD_Y} clientRef={clientRef} disabled={inputDisabled} />
            <div className="tgp-face-row">
              <FaceButton label="X" color="#5b9bd5" xinputFlag={GAMEPAD_X} clientRef={clientRef} disabled={inputDisabled} />
              <FaceButton label="B" color="#e05c5c" xinputFlag={GAMEPAD_B} clientRef={clientRef} disabled={inputDisabled} />
            </div>
            <FaceButton label="A" color="#58d98a" xinputFlag={GAMEPAD_A} clientRef={clientRef} disabled={inputDisabled} />
          </div>
        </div>
      </DraggableCluster>
    </div>
  );
}
