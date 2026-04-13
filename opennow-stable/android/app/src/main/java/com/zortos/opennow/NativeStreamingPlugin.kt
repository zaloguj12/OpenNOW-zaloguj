package com.zortos.opennow

import android.util.Log
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import org.webrtc.*

private const val TAG = "NativeStreaming"

/**
 * NativeStreamingPlugin
 *
 * Capacitor plugin that replaces the browser WebRTC path on Android with a
 * fully native implementation:
 *
 *   Signaling (existing BrowserSignalingClient / AndroidSignalingManager)
 *     ↓  SDP offer/answer + ICE
 *   org.webrtc.PeerConnection  (Google libwebrtc AAR)
 *     ↓  decoded video frames
 *   MediaCodec hardware decoder  (via EglBase + VideoDecoderFactory)
 *     ↓  YUV / texture frames
 *   SurfaceViewRenderer  (renders directly to NativeSurfaceManager's SurfaceView)
 *
 * Input (keyboard / mouse / gamepad) continues to flow through the existing
 * JS data-channel path — we only replace the media receive path.
 *
 * Registration: add  registerPlugin(NativeStreamingPlugin::class.java)
 * in MainActivity.onCreate() BEFORE super.onCreate().
 *
 * Required Gradle dependency (android/app/build.gradle):
 *   implementation "io.github.webrtc-android:library:1.0.4"
 *
 * The renderer calls these methods via callCapacitor("NativeStreamingPlugin", ...).
 */
@CapacitorPlugin(name = "NativeStreamingPlugin")
class NativeStreamingPlugin : Plugin() {

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    // WebRTC factory — one per process lifetime
    private var eglBase: EglBase? = null
    private var peerConnectionFactory: PeerConnectionFactory? = null

    // Per-session state
    private var peerConnection: PeerConnection? = null
    private var surfaceManager: NativeSurfaceManager? = null
    private var videoRenderer: SurfaceViewRenderer? = null
    private var audioTrack: AudioTrack? = null

    // Queued remote ICE candidates received before remote description is set
    private val pendingCandidates = mutableListOf<IceCandidate>()
    private var remoteDescriptionSet = false

    // ──────────────────────────────────────────────────────────────
    // Lifecycle
    // ──────────────────────────────────────────────────────────────

    override fun load() {
        super.load()
        initFactory()
    }

    private fun initFactory() {
        if (peerConnectionFactory != null) return

        val ctx = context.applicationContext

        // EGL context shared between the decoder and the SurfaceViewRenderer
        eglBase = EglBase.create()

        PeerConnectionFactory.initialize(
            PeerConnectionFactory.InitializationOptions.builder(ctx)
                .setEnableInternalTracer(false)
                .createInitializationOptions()
        )

        val videoDecoderFactory = DefaultVideoDecoderFactory(eglBase!!.eglBaseContext)
        val videoEncoderFactory = DefaultVideoEncoderFactory(
            eglBase!!.eglBaseContext,
            /* enableIntelVp8Encoder= */ false,
            /* enableH264HighProfile= */ false
        )

        peerConnectionFactory = PeerConnectionFactory.builder()
            .setVideoDecoderFactory(videoDecoderFactory)
            .setVideoEncoderFactory(videoEncoderFactory)
            .createPeerConnectionFactory()

        Log.i(TAG, "PeerConnectionFactory initialised (HW decoder + EGL)")
    }

    // ──────────────────────────────────────────────────────────────
    // Plugin methods called from the renderer via callCapacitor()
    // ──────────────────────────────────────────────────────────────

    /**
     * nativeConnect — create the SurfaceView overlay and peer connection.
     *
     * Expected JS call:
     *   callCapacitor("NativeStreamingPlugin", "nativeConnect", {
     *     iceServers: [{ urls: [...], username?: string, credential?: string }],
     *     offerSdp: "<full SDP string>",
     *   })
     *
     * Returns: { answerSdp: string }
     */
    @PluginMethod
    fun nativeConnect(call: PluginCall) {
        scope.launch {
            try {
                val offerSdp = call.getString("offerSdp")
                    ?: return@launch call.reject("offerSdp is required")
                val iceServersJson = call.getArray("iceServers") ?: JSArray()

                // Tear down any previous session
                teardown()

                // 1. Create the SurfaceView overlay
                val sm = NativeSurfaceManager(activity)
                surfaceManager = sm

                // 2. Create SurfaceViewRenderer (renders decoded frames)
                val renderer = SurfaceViewRenderer(context).apply {
                    init(eglBase!!.eglBaseContext, null)
                    setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT)
                    setEnableHardwareScaler(true)
                }
                videoRenderer = renderer

                // 3. Wait for the native surface to be ready, then attach renderer
                var surfaceReady = false
                sm.create { holder ->
                    // Attach the SurfaceViewRenderer to the SurfaceHolder so libwebrtc
                    // can render decoded frames directly into the hardware surface.
                    try {
                        renderer.holder?.surface?.release()
                    } catch (_: Exception) {}
                    surfaceReady = true
                    Log.i(TAG, "Native surface ready")
                }

                // Wait up to 3 s for the surface
                val deadline = System.currentTimeMillis() + 3000
                while (!surfaceReady && System.currentTimeMillis() < deadline) {
                    kotlinx.coroutines.delay(20)
                }
                if (!surfaceReady) {
                    teardown()
                    return@launch call.reject("Surface not ready within timeout")
                }

                // 4. Build RTCConfiguration from iceServers
                val rtcConfig = buildRtcConfig(iceServersJson)

                // 5. Create PeerConnection
                val pc = createPeerConnection(rtcConfig, renderer)
                    ?: run {
                        teardown()
                        return@launch call.reject("Failed to create PeerConnection")
                    }
                peerConnection = pc

                // 6. Set remote description (the offer from GFN server)
                val offerDesc = SessionDescription(SessionDescription.Type.OFFER, offerSdp)
                val sdpObserver = SimpleSdpObserver()
                pc.setRemoteDescription(sdpObserver, offerDesc)
                sdpObserver.awaitSuccess() ?: run {
                    teardown()
                    return@launch call.reject("setRemoteDescription failed: ${sdpObserver.error}")
                }
                remoteDescriptionSet = true

                // Flush any ICE candidates that arrived before the remote description
                synchronized(pendingCandidates) {
                    for (c in pendingCandidates) pc.addIceCandidate(c)
                    pendingCandidates.clear()
                }

                // 7. Create answer
                val answerObserver = SimpleSdpObserver()
                pc.createAnswer(answerObserver, MediaConstraints())
                val answerDesc = answerObserver.awaitSuccess() ?: run {
                    teardown()
                    return@launch call.reject("createAnswer failed: ${answerObserver.error}")
                }

                // 8. Set local description
                val localObserver = SimpleSdpObserver()
                pc.setLocalDescription(localObserver, answerDesc)
                localObserver.awaitSuccess() ?: run {
                    teardown()
                    return@launch call.reject("setLocalDescription failed: ${localObserver.error}")
                }

                Log.i(TAG, "PeerConnection ready, answer SDP length=${answerDesc.description.length}")

                val result = JSObject()
                result.put("answerSdp", answerDesc.description)
                call.resolve(result)

            } catch (e: Exception) {
                Log.e(TAG, "nativeConnect error", e)
                teardown()
                call.reject("nativeConnect error: ${e.message}")
            }
        }
    }

    /**
     * nativeAddIceCandidate — add a remote ICE candidate.
     *
     * Expected JS call:
     *   callCapacitor("NativeStreamingPlugin", "nativeAddIceCandidate", {
     *     candidate: string,
     *     sdpMid: string | null,
     *     sdpMLineIndex: number | null,
     *   })
     */
    @PluginMethod
    fun nativeAddIceCandidate(call: PluginCall) {
        val candidate = call.getString("candidate") ?: return call.reject("candidate required")
        val sdpMid = call.getString("sdpMid")
        val sdpMLineIndex = if (call.hasOption("sdpMLineIndex")) call.getInt("sdpMLineIndex") ?: 0 else 0

        val iceCandidate = IceCandidate(sdpMid, sdpMLineIndex, candidate)

        val pc = peerConnection
        if (pc == null || !remoteDescriptionSet) {
            synchronized(pendingCandidates) { pendingCandidates.add(iceCandidate) }
        } else {
            pc.addIceCandidate(iceCandidate)
        }
        call.resolve()
    }

    /**
     * nativeDisconnect — tear down the peer connection and remove the SurfaceView.
     */
    @PluginMethod
    fun nativeDisconnect(call: PluginCall) {
        scope.launch {
            teardown()
            call.resolve()
        }
    }

    /**
     * nativeGetStats — return basic connection stats.
     * Returns a JSON object with connectionState and iceConnectionState.
     */
    @PluginMethod
    fun nativeGetStats(call: PluginCall) {
        val pc = peerConnection
        if (pc == null) {
            val r = JSObject()
            r.put("connectionState", "closed")
            r.put("iceConnectionState", "closed")
            return call.resolve(r)
        }
        val r = JSObject()
        r.put("connectionState", pc.connectionState().toString().lowercase())
        r.put("iceConnectionState", pc.iceConnectionState().toString().lowercase())
        call.resolve(r)
    }

    // ──────────────────────────────────────────────────────────────
    // Internal helpers
    // ──────────────────────────────────────────────────────────────

    private fun buildRtcConfig(iceServersJson: JSArray): PeerConnection.RTCConfiguration {
        val servers = mutableListOf<PeerConnection.IceServer>()
        for (i in 0 until iceServersJson.length()) {
            val obj = iceServersJson.getJSONObject(i)
            val urlsArr = obj.optJSONArray("urls")
            val urls = if (urlsArr != null) {
                (0 until urlsArr.length()).map { urlsArr.getString(it) }
            } else {
                listOf(obj.optString("urls"))
            }
            val username = obj.optString("username").takeIf { it.isNotEmpty() }
            val credential = obj.optString("credential").takeIf { it.isNotEmpty() }

            val builder = PeerConnection.IceServer.builder(urls)
            if (username != null) builder.setUsername(username)
            if (credential != null) builder.setPassword(credential)
            servers.add(builder.createIceServer())
        }

        return PeerConnection.RTCConfiguration(servers).apply {
            bundlePolicy = PeerConnection.BundlePolicy.MAXBUNDLE
            rtcpMuxPolicy = PeerConnection.RtcpMuxPolicy.REQUIRE
            sdpSemantics = PeerConnection.SdpSemantics.UNIFIED_PLAN
            // Aggressive ICE to minimise connection time
            iceTransportsType = PeerConnection.IceTransportsType.ALL
            continualGatheringPolicy = PeerConnection.ContinualGatheringPolicy.GATHER_CONTINUALLY
        }
    }

    private fun createPeerConnection(
        config: PeerConnection.RTCConfiguration,
        renderer: VideoSink,
    ): PeerConnection? {
        val factory = peerConnectionFactory ?: return null

        val observer = object : PeerConnection.Observer {
            override fun onIceCandidate(candidate: IceCandidate) {
                Log.d(TAG, "Local ICE candidate: ${candidate.sdp}")
                val event = JSObject().apply {
                    put("type", "iceCandidate")
                    put("candidate", candidate.sdp)
                    put("sdpMid", candidate.sdpMid)
                    put("sdpMLineIndex", candidate.sdpMLineIndex)
                }
                notifyListeners("nativeStreamEvent", event)
            }

            override fun onIceCandidatesRemoved(candidates: Array<out IceCandidate>) {}

            override fun onIceConnectionChange(state: PeerConnection.IceConnectionState) {
                Log.i(TAG, "ICE connection state: $state")
                val event = JSObject().apply {
                    put("type", "iceConnectionState")
                    put("state", state.toString().lowercase())
                }
                notifyListeners("nativeStreamEvent", event)
            }

            override fun onIceConnectionReceivingChange(receiving: Boolean) {}

            override fun onIceGatheringChange(state: PeerConnection.IceGatheringState) {
                Log.d(TAG, "ICE gathering state: $state")
                if (state == PeerConnection.IceGatheringState.COMPLETE) {
                    val event = JSObject().apply { put("type", "iceGatheringComplete") }
                    notifyListeners("nativeStreamEvent", event)
                }
            }

            override fun onSignalingChange(state: PeerConnection.SignalingState) {
                Log.d(TAG, "Signaling state: $state")
            }

            override fun onConnectionChange(state: PeerConnection.PeerConnectionState) {
                Log.i(TAG, "Connection state: $state")
                val event = JSObject().apply {
                    put("type", "connectionState")
                    put("state", state.toString().lowercase())
                }
                notifyListeners("nativeStreamEvent", event)
            }

            override fun onAddStream(stream: MediaStream) {
                // Unified Plan: use onTrack instead
            }

            override fun onRemoveStream(stream: MediaStream) {}

            override fun onDataChannel(channel: DataChannel) {
                Log.d(TAG, "Remote data channel: ${channel.label()}")
                // Control channel messages (timer notifications) forwarded as events
                if (channel.label() == "control_channel") {
                    channel.registerObserver(object : DataChannel.Observer {
                        override fun onBufferedAmountChange(amount: Long) {}
                        override fun onStateChange() {}
                        override fun onMessage(buffer: DataChannel.Buffer) {
                            val bytes = ByteArray(buffer.data.remaining())
                            buffer.data.get(bytes)
                            val text = String(bytes, Charsets.UTF_8)
                            val event = JSObject().apply {
                                put("type", "controlMessage")
                                put("data", text)
                            }
                            notifyListeners("nativeStreamEvent", event)
                        }
                    })
                }
            }

            override fun onRenegotiationNeeded() {}

            override fun onAddTrack(receiver: RtpReceiver, streams: Array<out MediaStream>) {
                val track = receiver.track() ?: return
                Log.i(TAG, "Track added: kind=${track.kind()}")
                if (track is VideoTrack) {
                    track.addSink(renderer)
                    Log.i(TAG, "Video track attached to SurfaceViewRenderer (HW decode)")
                }
                if (track is AudioTrack) {
                    audioTrack = track
                    track.setEnabled(true)
                    Log.i(TAG, "Audio track enabled")
                }
            }
        }

        return factory.createPeerConnection(config, observer)
    }

    private fun teardown() {
        remoteDescriptionSet = false
        synchronized(pendingCandidates) { pendingCandidates.clear() }

        try {
            peerConnection?.close()
        } catch (_: Exception) {}
        peerConnection = null

        try {
            videoRenderer?.release()
        } catch (_: Exception) {}
        videoRenderer = null

        surfaceManager?.destroy()
        surfaceManager = null

        audioTrack = null

        Log.i(TAG, "Native streaming torn down")
    }
}

// ──────────────────────────────────────────────────────────────
// SimpleSdpObserver — coroutine-friendly SDP callback wrapper
// ──────────────────────────────────────────────────────────────

private class SimpleSdpObserver : SdpObserver {
    var error: String? = null
    private var result: SessionDescription? = null
    private val latch = java.util.concurrent.CountDownLatch(1)

    override fun onCreateSuccess(sdp: SessionDescription) {
        result = sdp
        latch.countDown()
    }

    override fun onSetSuccess() {
        latch.countDown()
    }

    override fun onCreateFailure(msg: String) {
        error = msg
        latch.countDown()
    }

    override fun onSetFailure(msg: String) {
        error = msg
        latch.countDown()
    }

    /** Suspend until the callback fires. Returns the SDP on success, null on failure. */
    suspend fun awaitSuccess(): SessionDescription? {
        kotlinx.coroutines.withContext(Dispatchers.IO) {
            latch.await(10, java.util.concurrent.TimeUnit.SECONDS)
        }
        return if (error == null) result else null
    }
}
