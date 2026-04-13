package com.zortos.opennow

import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * NativeInputEncoder — Kotlin port of src/renderer/src/gfn/inputProtocol.ts
 *
 * Encodes keyboard, mouse, gamepad, and heartbeat events into the exact binary
 * format the GFN server expects over WebRTC DataChannels.
 *
 * All multi-byte fields follow the same endianness as the official GFN browser
 * client:
 *   - Event type (4 bytes): Little-Endian
 *   - Payload fields: Big-Endian (unless noted otherwise)
 *   - Gamepad fields: Little-Endian (XInput convention)
 *   - Timestamps: Big-Endian (8 bytes, microseconds)
 *
 * Protocol v3+ adds outer framing wrappers (0x23 timestamp + 0x21/0x22 markers).
 */
class NativeInputEncoder {

    companion object {
        // Event types
        const val INPUT_HEARTBEAT = 2
        const val INPUT_KEY_DOWN = 3
        const val INPUT_KEY_UP = 4
        const val INPUT_MOUSE_REL = 7
        const val INPUT_MOUSE_BUTTON_DOWN = 8
        const val INPUT_MOUSE_BUTTON_UP = 9
        const val INPUT_MOUSE_WHEEL = 10
        const val INPUT_GAMEPAD = 12

        // Gamepad packet
        const val GAMEPAD_PACKET_SIZE = 38

        // XInput button flags
        const val GAMEPAD_DPAD_UP = 0x0001
        const val GAMEPAD_DPAD_DOWN = 0x0002
        const val GAMEPAD_DPAD_LEFT = 0x0004
        const val GAMEPAD_DPAD_RIGHT = 0x0008
        const val GAMEPAD_START = 0x0010
        const val GAMEPAD_BACK = 0x0020
        const val GAMEPAD_LS = 0x0040
        const val GAMEPAD_RS = 0x0080
        const val GAMEPAD_LB = 0x0100
        const val GAMEPAD_RB = 0x0200
        const val GAMEPAD_GUIDE = 0x0400
        const val GAMEPAD_A = 0x1000
        const val GAMEPAD_B = 0x2000
        const val GAMEPAD_X = 0x4000
        const val GAMEPAD_Y = 0x8000
    }

    var protocolVersion: Int = 2
        set(value) { field = value }

    // Per-gamepad sequence numbers for partially reliable channel (uint16 wrapping)
    private val gamepadSequences = HashMap<Int, Int>()

    fun resetGamepadSequences() {
        gamepadSequences.clear()
    }

    private fun getNextGamepadSequence(gamepadIndex: Int): Int {
        val current = gamepadSequences.getOrDefault(gamepadIndex, 1)
        gamepadSequences[gamepadIndex] = (current + 1) % 65536
        return current
    }

    private fun timestampUs(): Long {
        // System.nanoTime() / 1000 gives microseconds from a monotonic clock
        return System.nanoTime() / 1000
    }

    // ── Timestamp writer (Big-Endian 8 bytes) ────────────────────────────

    private fun writeTimestampBE(buf: ByteBuffer, offset: Int) {
        val tsUs = timestampUs()
        // Big-endian: high word first
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.position(offset)
        buf.putLong(tsUs)
    }

    // ── v3+ wrappers ─────────────────────────────────────────────────────

    /**
     * Single-event wrapper for v3+:
     * [0x23][8B timestamp BE][0x22][payload]
     */
    private fun wrapSingleEvent(payload: ByteArray): ByteArray {
        if (protocolVersion <= 2) return payload
        val wrapped = ByteArray(9 + 1 + payload.size)
        val buf = ByteBuffer.wrap(wrapped)
        wrapped[0] = 0x23
        writeTimestampBE(buf, 1)
        wrapped[9] = 0x22
        System.arraycopy(payload, 0, wrapped, 10, payload.size)
        return wrapped
    }

    /**
     * Mouse move wrapper for v3+:
     * [0x23][8B timestamp BE][0x21][2B length BE][payload]
     */
    private fun wrapMouseMoveEvent(payload: ByteArray): ByteArray {
        if (protocolVersion <= 2) return payload
        val wrapped = ByteArray(9 + 1 + 2 + payload.size)
        val buf = ByteBuffer.wrap(wrapped)
        wrapped[0] = 0x23
        writeTimestampBE(buf, 1)
        wrapped[9] = 0x21
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.position(10)
        buf.putShort(payload.size.toShort())
        System.arraycopy(payload, 0, wrapped, 12, payload.size)
        return wrapped
    }

    /**
     * Gamepad reliable wrapper for v3+:
     * [0x23][8B ts][0x21][2B size BE][payload]
     */
    private fun wrapGamepadReliable(payload: ByteArray): ByteArray {
        if (protocolVersion <= 2) return payload
        val wrapped = ByteArray(9 + 1 + 2 + payload.size)
        val buf = ByteBuffer.wrap(wrapped)
        wrapped[0] = 0x23
        writeTimestampBE(buf, 1)
        wrapped[9] = 0x21
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.position(10)
        buf.putShort(payload.size.toShort())
        System.arraycopy(payload, 0, wrapped, 12, payload.size)
        return wrapped
    }

    /**
     * Gamepad partially reliable wrapper for v3+:
     * [0x23][8B ts][0x26][1B idx][2B seq BE][0x21][2B size BE][payload]
     */
    private fun wrapGamepadPartiallyReliable(
        payload: ByteArray,
        gamepadIndex: Int,
        sequenceNumber: Int
    ): ByteArray {
        if (protocolVersion <= 2) return payload
        val wrapped = ByteArray(9 + 1 + 1 + 2 + 1 + 2 + payload.size)
        val buf = ByteBuffer.wrap(wrapped)
        wrapped[0] = 0x23
        writeTimestampBE(buf, 1)
        wrapped[9] = 0x26
        wrapped[10] = (gamepadIndex and 0xFF).toByte()
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.position(11)
        buf.putShort(sequenceNumber.toShort())
        wrapped[13] = 0x21
        buf.position(14)
        buf.putShort(payload.size.toShort())
        System.arraycopy(payload, 0, wrapped, 16, payload.size)
        return wrapped
    }

    // ── Public encoding methods ──────────────────────────────────────────

    /**
     * Heartbeat: 4-byte [type=2 LE]. No v3 wrapper (matches official client).
     */
    fun encodeHeartbeat(): ByteArray {
        val bytes = ByteArray(4)
        ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).putInt(INPUT_HEARTBEAT)
        return bytes
    }

    /**
     * Key down event.
     * Raw: [type 4B LE][keycode 2B BE][modifiers 2B BE][scancode 2B BE][timestamp 8B BE]
     */
    fun encodeKeyDown(keycode: Int, scancode: Int, modifiers: Int): ByteArray {
        return encodeKey(INPUT_KEY_DOWN, keycode, scancode, modifiers)
    }

    /**
     * Key up event.
     */
    fun encodeKeyUp(keycode: Int, scancode: Int, modifiers: Int): ByteArray {
        return encodeKey(INPUT_KEY_UP, keycode, scancode, modifiers)
    }

    private fun encodeKey(type: Int, keycode: Int, scancode: Int, modifiers: Int): ByteArray {
        val bytes = ByteArray(18)
        val buf = ByteBuffer.wrap(bytes)
        // type: LE
        buf.order(ByteOrder.LITTLE_ENDIAN)
        buf.putInt(type)
        // keycode, modifiers, scancode: BE
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.putShort(keycode.toShort())
        buf.putShort(modifiers.toShort())
        buf.putShort(scancode.toShort())
        // timestamp: BE
        buf.putLong(timestampUs())
        return wrapSingleEvent(bytes)
    }

    /**
     * Relative mouse move.
     * Raw: [type 4B LE][dx 2B BE][dy 2B BE][reserved 6B BE][timestamp 8B BE]
     */
    fun encodeMouseMove(dx: Int, dy: Int): ByteArray {
        val bytes = ByteArray(22)
        val buf = ByteBuffer.wrap(bytes)
        buf.order(ByteOrder.LITTLE_ENDIAN)
        buf.putInt(INPUT_MOUSE_REL)
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.putShort(dx.coerceIn(-32768, 32767).toShort())
        buf.putShort(dy.coerceIn(-32768, 32767).toShort())
        buf.putShort(0) // reserved
        buf.putInt(0)    // reserved
        buf.putLong(timestampUs())
        return wrapMouseMoveEvent(bytes)
    }

    /**
     * Mouse button down.
     * Raw: [type 4B LE][button 1B][pad 1B][reserved 4B BE][timestamp 8B BE]
     */
    fun encodeMouseButtonDown(button: Int): ByteArray {
        return encodeMouseButton(INPUT_MOUSE_BUTTON_DOWN, button)
    }

    /**
     * Mouse button up.
     */
    fun encodeMouseButtonUp(button: Int): ByteArray {
        return encodeMouseButton(INPUT_MOUSE_BUTTON_UP, button)
    }

    private fun encodeMouseButton(type: Int, button: Int): ByteArray {
        val bytes = ByteArray(18)
        val buf = ByteBuffer.wrap(bytes)
        buf.order(ByteOrder.LITTLE_ENDIAN)
        buf.putInt(type)
        bytes[4] = button.toByte()
        bytes[5] = 0
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.position(6)
        buf.putInt(0)    // reserved
        buf.putLong(timestampUs())
        return wrapSingleEvent(bytes)
    }

    /**
     * Mouse wheel.
     * Raw: [type 4B LE][horiz 2B BE][vert 2B BE][reserved 6B BE][timestamp 8B BE]
     */
    fun encodeMouseWheel(delta: Int): ByteArray {
        val bytes = ByteArray(22)
        val buf = ByteBuffer.wrap(bytes)
        buf.order(ByteOrder.LITTLE_ENDIAN)
        buf.putInt(INPUT_MOUSE_WHEEL)
        buf.order(ByteOrder.BIG_ENDIAN)
        buf.putShort(0) // horizontal
        buf.putShort(delta.coerceIn(-32768, 32767).toShort()) // vertical
        buf.putShort(0) // reserved
        buf.putInt(0)    // reserved
        buf.putLong(timestampUs())
        return wrapSingleEvent(bytes)
    }

    /**
     * Gamepad state packet (38 bytes, all LE except wrapped).
     *
     * @param controllerId 0-3
     * @param buttons 16-bit XInput button flags
     * @param leftTrigger 0-255
     * @param rightTrigger 0-255
     * @param leftStickX -32768..32767
     * @param leftStickY -32768..32767
     * @param rightStickX -32768..32767
     * @param rightStickY -32768..32767
     * @param bitmap connected-gamepad bitmask
     * @param usePartiallyReliable true = send on PR channel with sequence header
     */
    fun encodeGamepadState(
        controllerId: Int,
        buttons: Int,
        leftTrigger: Int,
        rightTrigger: Int,
        leftStickX: Int,
        leftStickY: Int,
        rightStickX: Int,
        rightStickY: Int,
        bitmap: Int,
        usePartiallyReliable: Boolean
    ): ByteArray {
        val bytes = ByteArray(GAMEPAD_PACKET_SIZE)
        val buf = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN)

        // 0x00: Type (u32 LE) = 12
        buf.putInt(INPUT_GAMEPAD)
        // 0x04: Payload size (u16 LE) = 26
        buf.putShort(26)
        // 0x06: Gamepad index (u16 LE)
        buf.putShort((controllerId and 0x03).toShort())
        // 0x08: Bitmap (u16 LE)
        buf.putShort(bitmap.toShort())
        // 0x0A: Inner payload size (u16 LE) = 20
        buf.putShort(20)
        // 0x0C: Button flags (u16 LE)
        buf.putShort(buttons.toShort())
        // 0x0E: Packed triggers (u16 LE: low=LT, high=RT)
        val packedTriggers = (leftTrigger and 0xFF) or ((rightTrigger and 0xFF) shl 8)
        buf.putShort(packedTriggers.toShort())
        // 0x10-0x16: Sticks (i16 LE each)
        buf.putShort(leftStickX.toShort())
        buf.putShort(leftStickY.toShort())
        buf.putShort(rightStickX.toShort())
        buf.putShort(rightStickY.toShort())
        // 0x18: Reserved (u16 LE) = 0
        buf.putShort(0)
        // 0x1A: Magic (u16 LE) = 85
        buf.putShort(85)
        // 0x1C: Reserved (u16 LE) = 0
        buf.putShort(0)
        // 0x1E: Timestamp (u64 LE)
        buf.putLong(timestampUs())

        return if (usePartiallyReliable) {
            val seq = getNextGamepadSequence(controllerId)
            wrapGamepadPartiallyReliable(bytes, controllerId, seq)
        } else {
            wrapGamepadReliable(bytes)
        }
    }
}
