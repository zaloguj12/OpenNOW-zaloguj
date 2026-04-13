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
import org.webrtc.*

private const val TAG = "NativeStreaming"

/**
 * NativeStreamingPlugin
 *
 * Replaces the browser WebRTC path on Android with a fully native pipeline:
 *
 *   GFN signaling offer (SDP)
 *     → PeerConnection (libwebrtc / io.github.webrtc-sdk:android)
 *     → DefaultVideoDecoderFactory  →  MediaCodec HW decoder
 *     → SurfaceViewRenderer  (added directly to the Activity window behind the WebView)
 *
 * Input (touch gamepad / data channels) is unchanged — only media receive is native.
 */
@CapacitorPlugin(name = "NativeStreamingPlugin")
class NativeStreamingPlugin : Plugin() {

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    // One EglBase + factory per process lifetime
    private var eglBase: EglBase? = null
    private var peerConnectionFactory: PeerConnectionFactory? = null

    // Per-session
    private var peerConnection: PeerConnection? = null
    private var surfaceManager: NativeSurfaceManager? = null
    private var videoTrackRef: VideoTrack? = null
    private var audioTrackRef: AudioTrack? = null

    private val pendingCandidates = mutableListOf<IceCandidate>()
    private var remoteDescSet = false

    // ──────────────────────────────────────────────────────────────
    // Plugin lifecycle
    // ──────────────────────────────────────────────────────────────

    override fun load() {
        super.load()
        initFactory()
    }

    private fun initFactory() {
        if (peerConnectionFactory != null) return

        val ctx = context.applicationContext
        eglBase = EglBase.create()

        PeerConnectionFactory.initialize(
            PeerConnectionFactory.InitializationOptions
                .builder(ctx)
                .setEnableInternalTracer(false)
                .createInitializationOptions()
        )

        peerConnectionFactory = PeerConnectionFactory.builder()
            .setVideoDecoderFactory(DefaultVideoDecoderFactory(eglBase!!.eglBaseContext))
            .setVideoEncoderFactory(
                DefaultVideoEncoderFactory(eglBase!!.eglBaseContext, false, false)
            )
            .createPeerConnectionFactory()

        Log.i(TAG, "PeerConnectionFactory ready (HW decode via MediaCodec)")
    }

    // ──────────────────────────────────────────────────────────────
    // Plugin methods
    // ──────────────────────────────────────────────────────────────

    /**
     * nativeConnect
     *
     * JS: callCapacitor("NativeStreamingPlugin", "nativeConnect", {
     *       offerSdp: string,
     *       iceServers: [{ urls, username?, credential? }]
     *     })
     * Returns: { answerSdp: string }
     */
    @PluginMethod
    fun nativeConnect(call: PluginCall) {
        scope.launch {
            try {
                val offerSdp = call.getString("offerSdp")
                    ?: return@launch call.reject("offerSdp required")
                val iceServersJson = call.getArray("iceServers") ?: JSArray()

                teardown()

                // 1. Create SurfaceViewRenderer and add it to the window
                val sm = NativeSurfaceManager(activity)
                surfaceManager = sm
                val renderer = sm.create(eglBase!!.eglBaseContext)
                Log.i(TAG, "SurfaceViewRenderer added to window")

                // 2. Create PeerConnection wired to the renderer
                val pc = createPeerConnection(buildRtcConfig(iceServersJson), renderer)
                    ?: return@launch run { teardown(); call.reject("createPeerConnection failed") }
                peerConnection = pc

                // 3. Set remote description
                val setRemote = SimpleSdpObserver()
                pc.setRemoteDescription(
                    setRemote,
                    SessionDescription(SessionDescription.Type.OFFER, offerSdp)
                )
                setRemote.awaitSuccess()
                    ?: return@launch run {
                        teardown()
                        call.reject("setRemoteDescription failed: ${setRemote.error}")
                    }
                remoteDescSet = true

                // Flush queued candidates
                synchronized(pendingCandidates) {
                    pendingCandidates.forEach { pc.addIceCandidate(it) }
                    pendingCandidates.clear()
                }

                // 4. Create answer
                val createAnswer = SimpleSdpObserver()
                pc.createAnswer(createAnswer, MediaConstraints())
                val answer = createAnswer.awaitSuccess()
                    ?: return@launch run {
                        teardown()
                        call.reject("createAnswer failed: ${createAnswer.error}")
                    }

                // 5. Set local description
                val setLocal = SimpleSdpObserver()
                pc.setLocalDescription(setLocal, answer)
                setLocal.awaitSuccess()
                    ?: return@launch run {
                        teardown()
                        call.reject("setLocalDescription failed: ${setLocal.error}")
                    }

                Log.i(TAG, "Native PeerConnection ready, answer=${answer.description.length} chars")
                call.resolve(JSObject().apply { put("answerSdp", answer.description) })

            } catch (e: Exception) {
                Log.e(TAG, "nativeConnect error", e)
                teardown()
                call.reject("nativeConnect error: ${e.message}")
            }
        }
    }

    @PluginMethod
    fun nativeAddIceCandidate(call: PluginCall) {
        val sdp = call.getString("candidate") ?: return call.reject("candidate required")
        val mid = call.getString("sdpMid")
        val idx = call.getInt("sdpMLineIndex") ?: 0
        val ic = IceCandidate(mid, idx, sdp)
        val pc = peerConnection
        if (pc == null || !remoteDescSet) {
            synchronized(pendingCandidates) { pendingCandidates.add(ic) }
        } else {
            pc.addIceCandidate(ic)
        }
        call.resolve()
    }

    @PluginMethod
    fun nativeDisconnect(call: PluginCall) {
        scope.launch { teardown(); call.resolve() }
    }

    @PluginMethod
    fun nativeGetStats(call: PluginCall) {
        val pc = peerConnection
        call.resolve(JSObject().apply {
            put("connectionState", pc?.connectionState()?.toString()?.lowercase() ?: "closed")
            put("iceConnectionState", pc?.iceConnectionState()?.toString()?.lowercase() ?: "closed")
        })
    }

    // ──────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────

    private fun buildRtcConfig(json: JSArray): PeerConnection.RTCConfiguration {
        val servers = mutableListOf<PeerConnection.IceServer>()
        for (i in 0 until json.length()) {
            val obj = json.getJSONObject(i)
            val urlsArr = obj.optJSONArray("urls")
            val urls = if (urlsArr != null)
                (0 until urlsArr.length()).map { urlsArr.getString(it) }
            else
                listOf(obj.optString("urls"))
            val b = PeerConnection.IceServer.builder(urls)
            obj.optString("username").takeIf { it.isNotEmpty() }?.let { b.setUsername(it) }
            obj.optString("credential").takeIf { it.isNotEmpty() }?.let { b.setPassword(it) }
            servers.add(b.createIceServer())
        }
        return PeerConnection.RTCConfiguration(servers).apply {
            bundlePolicy = PeerConnection.BundlePolicy.MAXBUNDLE
            rtcpMuxPolicy = PeerConnection.RtcpMuxPolicy.REQUIRE
            sdpSemantics = PeerConnection.SdpSemantics.UNIFIED_PLAN
            iceTransportsType = PeerConnection.IceTransportsType.ALL
            continualGatheringPolicy = PeerConnection.ContinualGatheringPolicy.GATHER_CONTINUALLY
        }
    }

    private fun createPeerConnection(
        config: PeerConnection.RTCConfiguration,
        renderer: VideoSink,
    ): PeerConnection? {
        return peerConnectionFactory?.createPeerConnection(
            config,
            object : PeerConnection.Observer {
                override fun onIceCandidate(c: IceCandidate) {
                    Log.d(TAG, "Local ICE: ${c.sdp}")
                    notifyListeners("nativeStreamEvent", JSObject().apply {
                        put("type", "iceCandidate")
                        put("candidate", c.sdp)
                        put("sdpMid", c.sdpMid)
                        put("sdpMLineIndex", c.sdpMLineIndex)
                    })
                }
                override fun onIceCandidatesRemoved(c: Array<out IceCandidate>) {}
                override fun onIceConnectionChange(s: PeerConnection.IceConnectionState) {
                    Log.i(TAG, "ICE: $s")
                    notifyListeners("nativeStreamEvent", JSObject().apply {
                        put("type", "iceConnectionState")
                        put("state", s.toString().lowercase())
                    })
                }
                override fun onIceConnectionReceivingChange(r: Boolean) {}
                override fun onIceGatheringChange(s: PeerConnection.IceGatheringState) {
                    if (s == PeerConnection.IceGatheringState.COMPLETE)
                        notifyListeners("nativeStreamEvent", JSObject().apply {
                            put("type", "iceGatheringComplete")
                        })
                }
                override fun onSignalingChange(s: PeerConnection.SignalingState) {}
                override fun onConnectionChange(s: PeerConnection.PeerConnectionState) {
                    Log.i(TAG, "Connection: $s")
                    notifyListeners("nativeStreamEvent", JSObject().apply {
                        put("type", "connectionState")
                        put("state", s.toString().lowercase())
                    })
                }
                override fun onAddStream(s: MediaStream) {}
                override fun onRemoveStream(s: MediaStream) {}
                override fun onDataChannel(ch: DataChannel) {
                    if (ch.label() != "control_channel") return
                    ch.registerObserver(object : DataChannel.Observer {
                        override fun onBufferedAmountChange(a: Long) {}
                        override fun onStateChange() {}
                        override fun onMessage(buf: DataChannel.Buffer) {
                            val b = ByteArray(buf.data.remaining()).also { buf.data.get(it) }
                            notifyListeners("nativeStreamEvent", JSObject().apply {
                                put("type", "controlMessage")
                                put("data", String(b, Charsets.UTF_8))
                            })
                        }
                    })
                }
                override fun onRenegotiationNeeded() {}
                override fun onAddTrack(recv: RtpReceiver, streams: Array<out MediaStream>) {
                    val track = recv.track() ?: return
                    Log.i(TAG, "Track: ${track.kind()}")
                    when (track) {
                        is VideoTrack -> {
                            videoTrackRef = track
                            track.addSink(renderer)
                            track.setEnabled(true)
                            Log.i(TAG, "Video → SurfaceViewRenderer (HW decode)")
                        }
                        is AudioTrack -> {
                            audioTrackRef = track
                            track.setEnabled(true)
                            Log.i(TAG, "Audio track enabled")
                        }
                    }
                }
            }
        )
    }

    private fun teardown() {
        remoteDescSet = false
        synchronized(pendingCandidates) { pendingCandidates.clear() }
        videoTrackRef?.dispose()
        videoTrackRef = null
        audioTrackRef = null
        try { peerConnection?.close() } catch (_: Exception) {}
        peerConnection = null
        surfaceManager?.destroy()
        surfaceManager = null
        Log.i(TAG, "Torn down")
    }
}

// ──────────────────────────────────────────────────────────────
// SimpleSdpObserver
// ──────────────────────────────────────────────────────────────

private class SimpleSdpObserver : SdpObserver {
    var error: String? = null
    private var sdp: SessionDescription? = null
    private val latch = java.util.concurrent.CountDownLatch(1)

    override fun onCreateSuccess(s: SessionDescription) { sdp = s; latch.countDown() }
    override fun onSetSuccess() { latch.countDown() }
    override fun onCreateFailure(e: String) { error = e; latch.countDown() }
    override fun onSetFailure(e: String) { error = e; latch.countDown() }

    suspend fun awaitSuccess(): SessionDescription? {
        kotlinx.coroutines.withContext(Dispatchers.IO) {
            latch.await(10, java.util.concurrent.TimeUnit.SECONDS)
        }
        return if (error == null) sdp else null
    }
}
