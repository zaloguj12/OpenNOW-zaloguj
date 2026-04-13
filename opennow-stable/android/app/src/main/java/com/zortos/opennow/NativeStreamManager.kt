package com.zortos.opennow

import android.content.Context
import android.util.Log
import org.webrtc.*
import org.webrtc.PeerConnection.*
import java.nio.ByteBuffer
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference

/**
 * NativeStreamManager — manages the native WebRTC streaming pipeline.
 *
 * This replaces the WebView-based GfnWebRtcClient by handling:
 * - PeerConnection lifecycle (offer/answer, ICE)
 * - SurfaceViewRenderer for zero-copy video display
 * - DataChannels for input (keyboard/mouse/gamepad) and control
 * - Audio playback via native WebRTC AudioTrack
 * - Heartbeat and stats collection
 *
 * The signaling WebSocket is still handled by AndroidSignalingManager;
 * this class only deals with the WebRTC side.
 */
class NativeStreamManager(private val context: Context) {

    companion object {
        private const val TAG = "NativeStreamManager"
        private const val DEFAULT_PARTIAL_RELIABLE_THRESHOLD_MS = 300
        private const val HEARTBEAT_INTERVAL_MS = 2000L
    }

    // ── State ────────────────────────────────────────────────────────────

    enum class StreamState {
        IDLE, CONNECTING, CONNECTED, FAILED, CLOSED
    }

    data class StreamDiagnostics(
        var connectionState: String = "closed",
        var inputReady: Boolean = false,
        var resolution: String = "",
        var codec: String = "",
        var bitrateKbps: Int = 0,
        var rttMs: Double = 0.0,
        var packetsLost: Int = 0,
        var packetsReceived: Int = 0,
        var framesDecoded: Int = 0,
        var framesDropped: Int = 0,
    )

    @Volatile var state = StreamState.IDLE
        private set
    @Volatile var inputReady = false
        private set

    val diagnostics = StreamDiagnostics()
    var onStateChanged: ((StreamState) -> Unit)? = null
    var onLog: ((String) -> Unit)? = null

    // ── WebRTC objects ───────────────────────────────────────────────────

    private var factory: PeerConnectionFactory? = null
    private var peerConnection: PeerConnection? = null
    private var reliableInputChannel: DataChannel? = null
    private var mouseInputChannel: DataChannel? = null
    private var controlChannel: DataChannel? = null
    private var surfaceRenderer: SurfaceViewRenderer? = null
    private var eglBase: EglBase? = null
    private var videoSink: ProxyVideoSink? = null

    private val inputEncoder = NativeInputEncoder()
    private var partialReliableThresholdMs = DEFAULT_PARTIAL_RELIABLE_THRESHOLD_MS

    // ICE candidates queued before remote description is set
    private val queuedCandidates = ConcurrentLinkedQueue<IceCandidate>()
    private val remoteDescriptionSet = AtomicBoolean(false)

    // Timers
    private val scheduler = Executors.newSingleThreadScheduledExecutor { r ->
        Thread(r, "NativeStreamTimer").also { it.isDaemon = true }
    }
    private var heartbeatFuture: ScheduledFuture<*>? = null
    private var statsFuture: ScheduledFuture<*>? = null

    // Last stats sample for delta calculations
    @Volatile private var lastBytesReceived = 0L
    @Volatile private var lastStatsTimeMs = 0L

    // ── Initialization ───────────────────────────────────────────────────

    /**
     * Initialize the PeerConnectionFactory and EGL context.
     * Call this once from MainActivity.onCreate().
     */
    fun initialize(renderer: SurfaceViewRenderer) {
        log("Initializing native stream manager")
        eglBase = EglBase.create()
        val eglContext = eglBase!!.eglBaseContext

        // Initialize renderer
        renderer.init(eglContext, null)
        renderer.setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT)
        renderer.setEnableHardwareScaler(true)
        surfaceRenderer = renderer

        // Initialize PeerConnectionFactory
        PeerConnectionFactory.initialize(
            PeerConnectionFactory.InitializationOptions.builder(context)
                .setEnableInternalTracer(false)
                .createInitializationOptions()
        )

        val encoderFactory = DefaultVideoEncoderFactory(eglContext, true, true)
        val decoderFactory = DefaultVideoDecoderFactory(eglContext)

        factory = PeerConnectionFactory.builder()
            .setVideoEncoderFactory(encoderFactory)
            .setVideoDecoderFactory(decoderFactory)
            .setOptions(PeerConnectionFactory.Options())
            .createPeerConnectionFactory()

        videoSink = ProxyVideoSink()
        videoSink!!.setTarget(renderer)

        log("Native stream manager initialized")
    }

    // ── Handle Offer ─────────────────────────────────────────────────────

    /**
     * Process a WebRTC offer from the GFN signaling server.
     *
     * This mirrors handleOffer() in webrtcClient.ts:
     * 1. Fix 0.0.0.0 in SDP
     * 2. Filter to preferred codec
     * 3. Create PeerConnection, set remote description
     * 4. Create data channels
     * 5. Create answer, munge SDP
     * 6. Set local description, gather ICE
     * 7. Send answer + nvstSdp via signaling
     *
     * @param onAnswer callback with (finalSdp, nvstSdp) to send via signaling
     */
    fun handleOffer(
        offerSdp: String,
        serverIp: String,
        mediaConnectionIp: String?,
        mediaConnectionPort: Int,
        iceServers: List<IceServer>,
        codec: String,
        colorQuality: String,
        resolution: String,
        fps: Int,
        maxBitrateKbps: Int,
        signalingServer: String,
        onAnswer: (sdp: String, nvstSdp: String) -> Unit,
        onIceCandidate: (candidate: String, sdpMid: String?, sdpMLineIndex: Int?) -> Unit,
    ) {
        cleanupPeerConnection()
        state = StreamState.CONNECTING
        onStateChanged?.invoke(state)
        diagnostics.connectionState = "connecting"
        inputReady = false
        remoteDescriptionSet.set(false)

        log("=== handleOffer START ===")
        log("ServerIp=$serverIp, mediaConn=${mediaConnectionIp}:${mediaConnectionPort}")
        log("Settings: codec=$codec, res=$resolution, fps=$fps, bitrate=${maxBitrateKbps}kbps")

        // 1. Fix 0.0.0.0
        val serverIpForSdp = mediaConnectionIp ?: serverIp
        var processedOffer = if (serverIpForSdp.isNotBlank()) {
            NativeSdpUtils.fixServerIp(offerSdp, serverIpForSdp).also {
                log("Fixed server IP in SDP: $serverIpForSdp")
            }
        } else offerSdp

        // Extract server ice-ufrag
        val serverIceUfrag = NativeSdpUtils.extractIceUfragFromOffer(processedOffer)
        log("Server ICE ufrag: $serverIceUfrag")

        // Parse partial reliable threshold
        val negotiated = NativeSdpUtils.parsePartialReliableThresholdMs(processedOffer)
        partialReliableThresholdMs = negotiated ?: DEFAULT_PARTIAL_RELIABLE_THRESHOLD_MS

        // 2. Filter to preferred codec
        processedOffer = NativeSdpUtils.preferCodec(processedOffer, codec)
        log("Filtered to codec $codec, SDP length=${processedOffer.length}")

        // 3. Create PeerConnection
        val rtcConfig = RTCConfiguration(iceServers).apply {
            bundlePolicy = BundlePolicy.MAXBUNDLE
            rtcpMuxPolicy = RtcpMuxPolicy.REQUIRE
            sdpSemantics = SdpSemantics.UNIFIED_PLAN
            continualGatheringPolicy = ContinualGatheringPolicy.GATHER_CONTINUALLY
        }

        val pcObserver = object : PeerConnection.Observer {
            override fun onSignalingChange(state: SignalingState) {
                log("Signaling state: $state")
            }

            override fun onIceConnectionChange(state: IceConnectionState) {
                log("ICE connection state: $state")
                when (state) {
                    IceConnectionState.CONNECTED -> {
                        this@NativeStreamManager.state = StreamState.CONNECTED
                        diagnostics.connectionState = "connected"
                        onStateChanged?.invoke(this@NativeStreamManager.state)
                    }
                    IceConnectionState.FAILED -> {
                        this@NativeStreamManager.state = StreamState.FAILED
                        diagnostics.connectionState = "failed"
                        onStateChanged?.invoke(this@NativeStreamManager.state)
                    }
                    IceConnectionState.DISCONNECTED, IceConnectionState.CLOSED -> {
                        this@NativeStreamManager.state = StreamState.CLOSED
                        diagnostics.connectionState = "closed"
                        onStateChanged?.invoke(this@NativeStreamManager.state)
                    }
                    else -> {}
                }
            }

            override fun onConnectionChange(newState: PeerConnectionState) {
                log("Peer connection state: $newState")
                diagnostics.connectionState = newState.name.lowercase()
            }

            override fun onIceConnectionReceivingChange(receiving: Boolean) {}

            override fun onIceGatheringChange(state: IceGatheringState) {
                log("ICE gathering state: $state")
            }

            override fun onIceCandidate(candidate: IceCandidate) {
                log("Local ICE candidate: ${candidate.sdp}")
                onIceCandidate(candidate.sdp, candidate.sdpMid, candidate.sdpMLineIndex)
            }

            override fun onIceCandidatesRemoved(candidates: Array<out IceCandidate>) {}

            override fun onAddStream(stream: MediaStream) {}
            override fun onRemoveStream(stream: MediaStream) {}

            override fun onDataChannel(dc: DataChannel) {
                log("Remote data channel: label=${dc.label()}")
                if (dc.label() == "control_channel") {
                    controlChannel = dc
                    dc.registerObserver(object : DataChannel.Observer {
                        override fun onBufferedAmountChange(prev: Long) {}
                        override fun onStateChange() {
                            log("Control channel state: ${dc.state()}")
                        }
                        override fun onMessage(buffer: DataChannel.Buffer) {
                            // Handle timer notifications etc.
                            handleControlMessage(buffer)
                        }
                    })
                }
            }

            override fun onRenegotiationNeeded() {}

            override fun onAddTrack(receiver: RtpReceiver, streams: Array<out MediaStream>) {
                val track = receiver.track() ?: return
                log("Track received: kind=${track.kind()}, id=${track.id()}")
                if (track is VideoTrack) {
                    track.addSink(videoSink)
                    log("Video track attached to SurfaceViewRenderer")
                }
                // Audio tracks are handled automatically by WebRTC's internal audio device
            }
        }

        val pc = factory!!.createPeerConnection(rtcConfig, pcObserver) ?: run {
            log("ERROR: Failed to create PeerConnection")
            state = StreamState.FAILED
            onStateChanged?.invoke(state)
            return
        }
        peerConnection = pc

        // 4. Create data channels
        createDataChannels(pc)

        // 5. Set remote description
        val remoteDesc = SessionDescription(SessionDescription.Type.OFFER, processedOffer)
        pc.setRemoteDescription(object : SdpObserver {
            override fun onCreateSuccess(desc: SessionDescription) {}
            override fun onCreateFailure(error: String) {}
            override fun onSetSuccess() {
                log("Remote description set")
                remoteDescriptionSet.set(true)
                flushQueuedCandidates()

                // 6. Create answer
                pc.createAnswer(object : SdpObserver {
                    override fun onCreateSuccess(answer: SessionDescription) {
                        log("Answer created, SDP length=${answer.description.length}")

                        // Munge answer SDP
                        val mungedSdp = NativeSdpUtils.mungeAnswerSdp(answer.description, maxBitrateKbps)
                        val mungedAnswer = SessionDescription(SessionDescription.Type.ANSWER, mungedSdp)

                        // Set local description
                        pc.setLocalDescription(object : SdpObserver {
                            override fun onCreateSuccess(desc: SessionDescription) {}
                            override fun onCreateFailure(error: String) {}
                            override fun onSetSuccess() {
                                log("Local description set")

                                // Send answer immediately — ICE candidates are trickled
                                // via continualGatheringPolicy=GATHER_CONTINUALLY
                                val finalSdp = pc.localDescription?.description ?: mungedSdp
                                log("Final SDP length=${finalSdp.length}")

                                // Build nvstSdp
                                val res = NativeSdpUtils.parseResolution(resolution)
                                val credentials = NativeSdpUtils.extractIceCredentials(finalSdp)
                                val nvstSdp = NativeSdpUtils.buildNvstSdp(
                                    width = res.width,
                                    height = res.height,
                                    fps = fps,
                                    maxBitrateKbps = maxBitrateKbps,
                                    partialReliableThresholdMs = partialReliableThresholdMs,
                                    codec = codec,
                                    colorQuality = colorQuality,
                                    credentials = credentials
                                )

                                onAnswer(finalSdp, nvstSdp)
                                log("Answer + nvstSdp sent via signaling")

                                // Inject manual ICE candidate from mediaConnectionInfo
                                if (!mediaConnectionIp.isNullOrBlank() && mediaConnectionPort > 0) {
                                    val ip = NativeSdpUtils.extractPublicIp(mediaConnectionIp)
                                    if (ip != null) {
                                        injectManualIceCandidate(pc, ip, mediaConnectionPort, serverIceUfrag)
                                    }
                                }

                                // Start heartbeat + stats
                                startHeartbeat()
                                startStatsCollection()

                                log("=== handleOffer COMPLETE ===")
                            }
                            override fun onSetFailure(error: String) {
                                log("ERROR: Set local description failed: $error")
                                state = StreamState.FAILED
                                onStateChanged?.invoke(state)
                            }
                        }, mungedAnswer)
                    }
                    override fun onCreateFailure(error: String) {
                        log("ERROR: Create answer failed: $error")
                        state = StreamState.FAILED
                        onStateChanged?.invoke(state)
                    }
                    override fun onSetSuccess() {}
                    override fun onSetFailure(error: String) {}
                }, MediaConstraints())
            }
            override fun onSetFailure(error: String) {
                log("ERROR: Set remote description failed: $error")
                state = StreamState.FAILED
                onStateChanged?.invoke(state)
            }
        }, remoteDesc)
    }

    // ── Data channels ────────────────────────────────────────────────────

    private fun createDataChannels(pc: PeerConnection) {
        // Reliable input channel
        val reliableInit = DataChannel.Init().apply {
            ordered = true
        }
        reliableInputChannel = pc.createDataChannel("input_channel_v1", reliableInit)
        reliableInputChannel?.registerObserver(object : DataChannel.Observer {
            override fun onBufferedAmountChange(prev: Long) {}
            override fun onStateChange() {
                val st = reliableInputChannel?.state()
                log("Reliable input channel state: $st")
            }
            override fun onMessage(buffer: DataChannel.Buffer) {
                onInputHandshakeMessage(buffer)
            }
        })

        // Partially reliable (mouse/gamepad) channel
        val prInit = DataChannel.Init().apply {
            ordered = false
            maxRetransmitTimeMs = partialReliableThresholdMs
        }
        mouseInputChannel = pc.createDataChannel("input_channel_partially_reliable", prInit)
        mouseInputChannel?.registerObserver(object : DataChannel.Observer {
            override fun onBufferedAmountChange(prev: Long) {}
            override fun onStateChange() {
                log("Mouse/PR channel state: ${mouseInputChannel?.state()}")
            }
            override fun onMessage(buffer: DataChannel.Buffer) {}
        })
    }

    private fun onInputHandshakeMessage(buffer: DataChannel.Buffer) {
        val data = buffer.data
        val bytes = ByteArray(data.remaining())
        data.get(bytes)

        if (bytes.size < 2) return

        val view = java.nio.ByteBuffer.wrap(bytes).order(java.nio.ByteOrder.LITTLE_ENDIAN)
        val firstWord = view.short.toInt() and 0xFFFF
        var version = 2

        if (firstWord == 526) { // 0x020e
            version = if (bytes.size >= 4) (view.short.toInt() and 0xFFFF) else 2
            log("Handshake: firstWord=526, version=$version")
        } else if (bytes[0] == 0x0e.toByte()) {
            version = firstWord
            log("Handshake: byte[0]=0x0e, version=$version")
        } else {
            log("Input message not a handshake: firstWord=$firstWord")
            return
        }

        if (!inputReady) {
            inputReady = true
            inputEncoder.protocolVersion = version
            diagnostics.inputReady = true
            log("Input handshake complete (protocol v$version) — input ready")
        }
    }

    // ── ICE candidate management ─────────────────────────────────────────

    fun addRemoteCandidate(candidate: String, sdpMid: String?, sdpMLineIndex: Int?) {
        log("Remote ICE candidate: $candidate (mid=$sdpMid)")
        val iceCandidate = IceCandidate(
            sdpMid ?: "0",
            sdpMLineIndex ?: 0,
            candidate
        )

        if (remoteDescriptionSet.get()) {
            peerConnection?.addIceCandidate(iceCandidate)
        } else {
            queuedCandidates.add(iceCandidate)
        }
    }

    private fun flushQueuedCandidates() {
        val pc = peerConnection ?: return
        while (queuedCandidates.isNotEmpty()) {
            val candidate = queuedCandidates.poll() ?: break
            pc.addIceCandidate(candidate)
        }
    }

    private fun injectManualIceCandidate(
        pc: PeerConnection,
        ip: String,
        port: Int,
        ufrag: String
    ) {
        val candidateStr = "candidate:1 1 udp 2130706431 $ip $port typ host"
        log("Injecting manual ICE: $ip:$port")
        val mids = listOf("0", "1", "2", "3")
        for (mid in mids) {
            try {
                val success = pc.addIceCandidate(IceCandidate(mid, mid.toInt(), candidateStr))
                if (success) {
                    log("Manual ICE candidate injected (mid=$mid)")
                    break
                }
            } catch (e: Exception) {
                log("Manual ICE failed for mid=$mid: ${e.message}")
            }
        }
    }

    // ── Input sending ────────────────────────────────────────────────────

    fun sendReliable(data: ByteArray) {
        val ch = reliableInputChannel ?: return
        if (ch.state() != DataChannel.State.OPEN) return
        ch.send(DataChannel.Buffer(ByteBuffer.wrap(data), true))
    }

    fun sendOnPRChannel(data: ByteArray) {
        val ch = mouseInputChannel
        if (ch != null && ch.state() == DataChannel.State.OPEN) {
            ch.send(DataChannel.Buffer(ByteBuffer.wrap(data), true))
            return
        }
        // Fallback to reliable
        sendReliable(data)
    }

    // Convenience: encode and send keyboard events
    fun sendKeyDown(keycode: Int, scancode: Int, modifiers: Int) {
        if (!inputReady) return
        sendReliable(inputEncoder.encodeKeyDown(keycode, scancode, modifiers))
    }

    fun sendKeyUp(keycode: Int, scancode: Int, modifiers: Int) {
        if (!inputReady) return
        sendReliable(inputEncoder.encodeKeyUp(keycode, scancode, modifiers))
    }

    fun sendMouseMove(dx: Int, dy: Int) {
        if (!inputReady) return
        sendReliable(inputEncoder.encodeMouseMove(dx, dy))
    }

    fun sendMouseButtonDown(button: Int) {
        if (!inputReady) return
        sendReliable(inputEncoder.encodeMouseButtonDown(button))
    }

    fun sendMouseButtonUp(button: Int) {
        if (!inputReady) return
        sendReliable(inputEncoder.encodeMouseButtonUp(button))
    }

    fun sendMouseWheel(delta: Int) {
        if (!inputReady) return
        sendReliable(inputEncoder.encodeMouseWheel(delta))
    }

    fun sendGamepadState(
        controllerId: Int, buttons: Int,
        lt: Int, rt: Int,
        lx: Int, ly: Int, rx: Int, ry: Int,
        bitmap: Int
    ) {
        if (!inputReady) return
        val usePR = mouseInputChannel?.state() == DataChannel.State.OPEN
        val data = inputEncoder.encodeGamepadState(
            controllerId, buttons, lt, rt, lx, ly, rx, ry, bitmap, usePR
        )
        if (usePR) sendOnPRChannel(data) else sendReliable(data)
    }

    // ── Heartbeat ────────────────────────────────────────────────────────

    private fun startHeartbeat() {
        heartbeatFuture?.cancel(false)
        heartbeatFuture = scheduler.scheduleAtFixedRate({
            if (inputReady) {
                sendReliable(inputEncoder.encodeHeartbeat())
            }
        }, HEARTBEAT_INTERVAL_MS, HEARTBEAT_INTERVAL_MS, TimeUnit.MILLISECONDS)
    }

    // ── Stats collection ─────────────────────────────────────────────────

    private fun startStatsCollection() {
        statsFuture?.cancel(false)
        statsFuture = scheduler.scheduleAtFixedRate({
            collectStats()
        }, 1000, 500, TimeUnit.MILLISECONDS)
    }

    private fun collectStats() {
        val pc = peerConnection ?: return
        pc.getStats { report ->
            val now = System.currentTimeMillis()
            for (stats in report.statsMap.values) {
                when (stats.type) {
                    "inbound-rtp" -> {
                        if (stats.members["kind"] == "video") {
                            val bytes = (stats.members["bytesReceived"] as? Number)?.toLong() ?: 0L
                            val framesDecoded = (stats.members["framesDecoded"] as? Number)?.toInt() ?: 0
                            val framesDropped = (stats.members["framesDropped"] as? Number)?.toInt() ?: 0
                            val packetsReceived = (stats.members["packetsReceived"] as? Number)?.toInt() ?: 0
                            val packetsLost = (stats.members["packetsLost"] as? Number)?.toInt() ?: 0

                            // Bitrate calculation
                            if (lastStatsTimeMs > 0) {
                                val dtMs = now - lastStatsTimeMs
                                val dBytes = bytes - lastBytesReceived
                                if (dtMs > 0 && dBytes >= 0) {
                                    diagnostics.bitrateKbps = ((dBytes * 8.0) / (dtMs / 1000.0) / 1000.0).toInt()
                                }
                            }
                            lastBytesReceived = bytes
                            lastStatsTimeMs = now

                            diagnostics.framesDecoded = framesDecoded
                            diagnostics.framesDropped = framesDropped
                            diagnostics.packetsReceived = packetsReceived
                            diagnostics.packetsLost = packetsLost
                        }
                    }
                    "candidate-pair" -> {
                        if (stats.members["state"] == "succeeded" && stats.members["nominated"] == true) {
                            val rtt = (stats.members["currentRoundTripTime"] as? Number)?.toDouble() ?: 0.0
                            diagnostics.rttMs = rtt * 1000.0
                        }
                    }
                }
            }
        }
    }

    // ── Control channel ──────────────────────────────────────────────────

    private fun handleControlMessage(buffer: DataChannel.Buffer) {
        try {
            val data = buffer.data
            val bytes = ByteArray(data.remaining())
            data.get(bytes)
            val text = String(bytes, Charsets.UTF_8)
            log("Control message: $text")
            // Timer notifications would be parsed here
        } catch (e: Exception) {
            // Ignore malformed control messages
        }
    }

    // ── Cleanup ──────────────────────────────────────────────────────────

    private fun cleanupPeerConnection() {
        heartbeatFuture?.cancel(false)
        heartbeatFuture = null
        statsFuture?.cancel(false)
        statsFuture = null

        reliableInputChannel?.close()
        reliableInputChannel = null
        mouseInputChannel?.close()
        mouseInputChannel = null
        controlChannel?.close()
        controlChannel = null

        peerConnection?.close()
        peerConnection = null

        inputReady = false
        remoteDescriptionSet.set(false)
        queuedCandidates.clear()
        inputEncoder.resetGamepadSequences()
        lastBytesReceived = 0L
        lastStatsTimeMs = 0L

        diagnostics.connectionState = "closed"
        diagnostics.inputReady = false
        state = StreamState.IDLE
    }

    fun dispose() {
        cleanupPeerConnection()
        videoSink?.setTarget(null)
        surfaceRenderer?.release()
        eglBase?.release()
        factory?.dispose()
        scheduler.shutdownNow()
        log("Native stream manager disposed")
    }

    fun isStreaming(): Boolean {
        return state == StreamState.CONNECTED || state == StreamState.CONNECTING
    }

    private fun log(msg: String) {
        Log.d(TAG, msg)
        onLog?.invoke(msg)
    }

    // ── Video sink proxy ─────────────────────────────────────────────────

    /**
     * Thread-safe proxy that can swap its target renderer.
     */
    class ProxyVideoSink : VideoSink {
        private val target = AtomicReference<VideoSink?>(null)

        fun setTarget(sink: VideoSink?) {
            target.set(sink)
        }

        override fun onFrame(frame: VideoFrame) {
            target.get()?.onFrame(frame)
        }
    }
}
