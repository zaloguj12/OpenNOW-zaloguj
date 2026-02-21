package com.zortos.opennow

import com.getcapacitor.JSObject
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONObject
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicInteger

/**
 * AndroidSignalingManager — mirrors src/main/gfn/signaling.ts in Kotlin.
 *
 * It opens a WebSocket to the GFN signaling server and translates incoming
 * messages into Capacitor events that the renderer can listen to.
 *
 * The WebRTC offer/answer/ICE exchange itself still happens in the renderer
 * (webrtcClient.ts) — this class only handles the WebSocket transport layer.
 */
class AndroidSignalingManager(
    private val signalingServer: String,
    private val sessionId: String,
    private val signalingUrl: String?,
    private val onEvent: (JSObject) -> Unit,
) {
    private val http = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(0, TimeUnit.SECONDS) // no timeout for WebSocket reads
        .pingInterval(5, TimeUnit.SECONDS)
        .build()

    private var ws: WebSocket? = null
    private val ackCounter = AtomicInteger(0)
    private val peerId = 2
    private val peerName = "peer-${(0..9_999_999_999L).random()}"

    private val USER_AGENT =
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"

    private fun buildSignInUrl(): String {
        val serverWithPort = if (signalingUrl != null) {
            // Extract host:port from wss://host:port/path
            val withoutScheme = signalingUrl.removePrefix("wss://").removePrefix("ws://")
            val hostPort = withoutScheme.split("/").firstOrNull() ?: signalingServer
            if (hostPort.contains(":")) hostPort else "$hostPort:443"
        } else {
            if (signalingServer.contains(":")) signalingServer else "$signalingServer:443"
        }
        return "wss://$serverWithPort/nvst/sign_in?peer_id=$peerName&version=2"
    }

    fun connect() {
        val url = buildSignInUrl()
        val protocol = "x-nv-sessionid.$sessionId"

        val request = Request.Builder()
            .url(url)
            .header("Host", url.removePrefix("wss://").split("/").first())
            .header("Origin", "https://play.geforcenow.com")
            .header("User-Agent", USER_AGENT)
            .header("Sec-WebSocket-Protocol", protocol)
            .build()

        ws = http.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                sendPeerInfo(webSocket)
                emit(JSObject().also { it.put("type", "connected") })
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                handleMessage(webSocket, text)
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                emit(JSObject().also {
                    it.put("type", "error")
                    it.put("message", "Signaling connect failed: ${t.message}")
                })
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                emit(JSObject().also {
                    it.put("type", "disconnected")
                    it.put("reason", reason.ifEmpty { "socket closed" })
                })
            }
        })
    }

    private fun emit(event: JSObject) {
        onEvent(event)
    }

    private fun sendJson(payload: JSONObject) {
        ws?.send(payload.toString())
    }

    private fun sendPeerInfo(webSocket: WebSocket) {
        val msg = JSONObject().apply {
            put("ackid", ackCounter.incrementAndGet())
            put("peer_info", JSONObject().apply {
                put("browser", "Chrome")
                put("browserVersion", "131")
                put("connected", true)
                put("id", peerId)
                put("name", peerName)
                put("peerRole", 0)
                put("resolution", "1920x1080")
                put("version", 2)
            })
        }
        webSocket.send(msg.toString())
    }

    private fun handleMessage(webSocket: WebSocket, text: String) {
        val parsed = try {
            JSONObject(text)
        } catch (e: Exception) {
            return
        }

        // ACK handling
        if (parsed.has("ackid")) {
            val shouldAck = parsed.optJSONObject("peer_info")?.optInt("id") != peerId
            if (shouldAck) {
                webSocket.send(JSONObject().also { it.put("ack", parsed.getInt("ackid")) }.toString())
            }
        }

        // Heartbeat
        if (parsed.optInt("hb") == 1) {
            webSocket.send(JSONObject().also { it.put("hb", 1) }.toString())
            return
        }

        val peerMsg = parsed.optJSONObject("peer_msg") ?: return
        val msgStr = peerMsg.optString("msg").ifEmpty { return }

        val payload = try {
            JSONObject(msgStr)
        } catch (e: Exception) {
            return
        }

        when {
            payload.optString("type") == "offer" -> {
                val sdp = payload.optString("sdp")
                emit(JSObject().also {
                    it.put("type", "offer")
                    it.put("sdp", sdp)
                })
            }
            payload.has("candidate") -> {
                val candidate = JSObject().also {
                    it.put("candidate", payload.optString("candidate"))
                    it.put("sdpMid", payload.opt("sdpMid"))
                    it.put("sdpMLineIndex", payload.opt("sdpMLineIndex"))
                }
                emit(JSObject().also {
                    it.put("type", "remote-ice")
                    it.put("candidate", candidate)
                })
            }
        }
    }

    fun sendAnswer(sdp: String, nvstSdp: String?) {
        val answer = JSONObject().apply {
            put("type", "answer")
            put("sdp", sdp)
            if (nvstSdp != null) put("nvstSdp", nvstSdp)
        }
        sendJson(JSONObject().apply {
            put("peer_msg", JSONObject().apply {
                put("from", peerId)
                put("to", 1)
                put("msg", answer.toString())
            })
            put("ackid", ackCounter.incrementAndGet())
        })
    }

    fun sendIceCandidate(candidate: String, sdpMid: String?, sdpMLineIndex: Int?) {
        val payload = JSONObject().apply {
            put("candidate", candidate)
            if (sdpMid != null) put("sdpMid", sdpMid)
            if (sdpMLineIndex != null) put("sdpMLineIndex", sdpMLineIndex)
        }
        sendJson(JSONObject().apply {
            put("peer_msg", JSONObject().apply {
                put("from", peerId)
                put("to", 1)
                put("msg", payload.toString())
            })
            put("ackid", ackCounter.incrementAndGet())
        })
    }

    fun disconnect() {
        ws?.close(1000, "client disconnect")
        ws = null
    }
}

private fun ClosedRange<Long>.random(): Long =
    (Math.random() * (endInclusive - start + 1)).toLong() + start
