package com.zortos.opennow

/**
 * NativeSdpUtils — Kotlin port of src/renderer/src/gfn/sdp.ts
 *
 * All SDP manipulation functions used during the WebRTC offer/answer
 * negotiation with the GFN streaming server.
 */
object NativeSdpUtils {

    private const val TAG = "NativeSdpUtils"

    // ── IP extraction ────────────────────────────────────────────────────

    /**
     * Convert dash-separated hostname to dotted IP if it matches the GFN pattern.
     * e.g. "80-250-97-40.cloudmatchbeta.nvidiagrid.net" -> "80.250.97.40"
     */
    fun extractPublicIp(hostOrIp: String?): String? {
        if (hostOrIp.isNullOrBlank()) return null
        // Already a dotted IP?
        if (hostOrIp.matches(Regex("""^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$"""))) {
            return hostOrIp
        }
        // Dash-separated hostname
        val firstLabel = hostOrIp.split(".").firstOrNull() ?: return null
        val parts = firstLabel.split("-")
        if (parts.size == 4 && parts.all { it.matches(Regex("""^\d{1,3}$""")) }) {
            return parts.joinToString(".")
        }
        return null
    }

    // ── Server IP fix ────────────────────────────────────────────────────

    /**
     * Fix 0.0.0.0 in the server's SDP offer with the actual server IP.
     * Replaces c=IN IP4 0.0.0.0 and a=candidate: lines containing 0.0.0.0.
     */
    fun fixServerIp(sdp: String, serverIp: String): String {
        val ip = extractPublicIp(serverIp) ?: return sdp
        // 1. Fix c= lines
        var fixed = sdp.replace("c=IN IP4 0.0.0.0", "c=IN IP4 $ip")
        // 2. Fix ICE candidate lines: a=candidate:... 0.0.0.0 ...
        fixed = fixed.replace(
            Regex("""(a=candidate:\S+\s+\d+\s+\w+\s+\d+\s+)0\.0\.0\.0(\s+)"""),
            "$1$ip$2"
        )
        return fixed
    }

    // ── ICE credential extraction ────────────────────────────────────────

    data class IceCredentials(
        val ufrag: String,
        val pwd: String,
        val fingerprint: String
    )

    /**
     * Extract the server's ice-ufrag from the offer SDP.
     */
    fun extractIceUfragFromOffer(sdp: String): String {
        val match = Regex("""a=ice-ufrag:([^\r\n]+)""").find(sdp)
        return match?.groupValues?.getOrNull(1)?.trim() ?: ""
    }

    /**
     * Extract ICE credentials (ufrag, pwd, fingerprint) from SDP.
     */
    fun extractIceCredentials(sdp: String): IceCredentials {
        val lines = sdp.split(Regex("""\r?\n"""))
        val ufrag = lines.firstOrNull { it.startsWith("a=ice-ufrag:") }
            ?.removePrefix("a=ice-ufrag:")?.trim() ?: ""
        val pwd = lines.firstOrNull { it.startsWith("a=ice-pwd:") }
            ?.removePrefix("a=ice-pwd:")?.trim() ?: ""
        val fingerprint = lines.firstOrNull { it.startsWith("a=fingerprint:sha-256 ") }
            ?.removePrefix("a=fingerprint:sha-256 ")?.trim() ?: ""
        return IceCredentials(ufrag, pwd, fingerprint)
    }

    // ── Codec preference ─────────────────────────────────────────────────

    private fun normalizeCodec(name: String): String {
        val upper = name.uppercase()
        return if (upper == "HEVC") "H265" else upper
    }

    /**
     * Filter SDP to prefer a specific codec.
     * Removes all other video codec payload types from the m=video line.
     */
    fun preferCodec(sdp: String, codec: String): String {
        val lineEnding = if (sdp.contains("\r\n")) "\r\n" else "\n"
        val lines = sdp.split(Regex("""\r?\n"""))

        var inVideoSection = false
        val payloadTypesByCodec = HashMap<String, MutableList<String>>()
        val codecByPayloadType = HashMap<String, String>()
        val rtxAptByPayloadType = HashMap<String, String>()

        // Pass 1: collect codec→payload-type mappings
        for (line in lines) {
            if (line.startsWith("m=video")) {
                inVideoSection = true; continue
            }
            if (line.startsWith("m=") && inVideoSection) {
                inVideoSection = false
            }
            if (!inVideoSection || !line.startsWith("a=rtpmap:")) continue

            val rest = line.substringAfter("a=rtpmap:")
            val parts = rest.split(Regex("""\s+"""), 2)
            val pt = parts.getOrNull(0) ?: continue
            val codecPart = parts.getOrNull(1) ?: continue
            val codecName = normalizeCodec(codecPart.split("/").firstOrNull()?.trim() ?: "")
            if (pt.isBlank() || codecName.isBlank()) continue

            payloadTypesByCodec.getOrPut(codecName) { mutableListOf() }.add(pt)
            codecByPayloadType[pt] = codecName
        }

        // Pass 2: collect RTX apt mappings
        inVideoSection = false
        for (line in lines) {
            if (line.startsWith("m=video")) {
                inVideoSection = true; continue
            }
            if (line.startsWith("m=") && inVideoSection) {
                inVideoSection = false
            }
            if (!inVideoSection || !line.startsWith("a=fmtp:")) continue

            val rest = line.substringAfter(":", "")
            val parts = rest.split(Regex("""\s+"""), 2)
            val pt = parts.getOrNull(0) ?: continue
            val params = parts.getOrNull(1) ?: continue
            val aptMatch = Regex("""(?:^|;)\s*apt=(\d+)""", RegexOption.IGNORE_CASE).find(params)
            if (aptMatch != null) {
                rtxAptByPayloadType[pt] = aptMatch.groupValues[1]
            }
        }

        val preferredPayloads = payloadTypesByCodec[codec] ?: return sdp
        if (preferredPayloads.isEmpty()) return sdp

        val preferred = preferredPayloads.toHashSet()
        val allowed = HashSet(preferred)

        // Keep RTX payloads linked to preferred payloads
        for ((rtxPt, apt) in rtxAptByPayloadType) {
            if (preferred.contains(apt) && codecByPayloadType[rtxPt] == "RTX") {
                allowed.add(rtxPt)
            }
        }

        // Filter SDP lines
        val filtered = mutableListOf<String>()
        inVideoSection = false
        for (line in lines) {
            if (line.startsWith("m=video")) {
                inVideoSection = true
                val parts = line.split(Regex("""\s+"""))
                val header = parts.take(3)
                val available = parts.drop(3).filter { allowed.contains(it) }
                val ordered = mutableListOf<String>()
                for (pt in preferredPayloads) {
                    if (available.contains(pt)) ordered.add(pt)
                }
                for (pt in available) {
                    if (!preferred.contains(pt)) ordered.add(pt)
                }
                filtered.add(if (ordered.isNotEmpty()) (header + ordered).joinToString(" ") else line)
                continue
            }
            if (line.startsWith("m=") && inVideoSection) {
                inVideoSection = false
            }
            if (inVideoSection &&
                (line.startsWith("a=rtpmap:") || line.startsWith("a=fmtp:") || line.startsWith("a=rtcp-fb:"))
            ) {
                val rest = line.substringAfter(":", "")
                val pt = rest.split(Regex("""\s+"""), 1).firstOrNull() ?: ""
                if (pt.isNotBlank() && !allowed.contains(pt)) continue
            }
            filtered.add(line)
        }
        return filtered.joinToString(lineEnding)
    }

    // ── Answer SDP munging ───────────────────────────────────────────────

    /**
     * Inject b=AS: bitrate limits and stereo=1 for opus into the answer SDP.
     */
    fun mungeAnswerSdp(sdp: String, maxBitrateKbps: Int): String {
        val lineEnding = if (sdp.contains("\r\n")) "\r\n" else "\n"
        val lines = sdp.split(Regex("""\r?\n"""))
        val result = mutableListOf<String>()

        for (i in lines.indices) {
            val line = lines[i]
            result.add(line)

            if (line.startsWith("m=video") || line.startsWith("m=audio")) {
                val bitrate = if (line.startsWith("m=video")) maxBitrateKbps else 128
                val nextLine = lines.getOrNull(i + 1) ?: ""
                if (!nextLine.startsWith("b=")) {
                    result.add("b=AS:$bitrate")
                }
            }

            // Append stereo=1 to opus fmtp
            if (line.startsWith("a=fmtp:") && line.contains("minptime=") && !line.contains("stereo=1")) {
                result[result.size - 1] = "$line;stereo=1"
            }
        }
        return result.joinToString(lineEnding)
    }

    // ── NVST SDP builder ─────────────────────────────────────────────────

    /**
     * Build the NvstSdp metadata string sent alongside the WebRTC answer.
     *
     * This mirrors buildNvstSdp() from sdp.ts and encodes quality/FEC/DRC
     * settings that the GFN server encoder uses.
     */
    fun buildNvstSdp(
        width: Int,
        height: Int,
        fps: Int,
        maxBitrateKbps: Int,
        partialReliableThresholdMs: Int,
        codec: String,
        colorQuality: String,
        credentials: IceCredentials
    ): String {
        val minBitrate = maxOf(5000, (maxBitrateKbps * 0.35).toInt())
        val initialBitrate = maxOf(minBitrate, (maxBitrateKbps * 0.7).toInt())
        val isHighFps = fps >= 90
        val is120Fps = fps == 120
        val is240Fps = fps >= 240
        val isAv1 = codec == "AV1"
        val bitDepth = if (colorQuality.startsWith("10bit")) 10 else 8

        val lines = mutableListOf(
            "v=0",
            "o=SdpTest test_id_13 14 IN IPv4 127.0.0.1",
            "s=-",
            "t=0 0",
            "a=general.icePassword:${credentials.pwd}",
            "a=general.iceUserNameFragment:${credentials.ufrag}",
            "a=general.dtlsFingerprint:${credentials.fingerprint}",
            "m=video 0 RTP/AVP",
            "a=msid:fbc-video-0",
            // FEC
            "a=vqos.fec.rateDropWindow:10",
            "a=vqos.fec.minRequiredFecPackets:2",
            "a=vqos.fec.repairMinPercent:5",
            "a=vqos.fec.repairPercent:5",
            "a=vqos.fec.repairMaxPercent:35",
            // DRC disabled
            "a=vqos.drc.enable:0",
            // DFC disabled
            "a=vqos.dfc.enable:0",
            // Video encoder
            "a=video.dx9EnableNv12:1",
            "a=video.dx9EnableHdr:1",
            "a=vqos.qpg.enable:1",
            "a=vqos.resControl.qp.qpg.featureSetting:7",
            "a=bwe.useOwdCongestionControl:1",
            "a=video.enableRtpNack:1",
            "a=vqos.bw.txRxLag.minFeedbackTxDeltaMs:200",
            "a=vqos.drc.bitrateIirFilterFactor:18",
            "a=video.packetSize:1140",
            "a=packetPacing.minNumPacketsPerGroup:15",
        )

        if (isHighFps) {
            lines.addAll(listOf(
                "a=bwe.iirFilterFactor:8",
                "a=video.encoderFeatureSetting:47",
                "a=video.encoderPreset:6",
                "a=vqos.resControl.cpmRtc.badNwSkipFramesCount:600",
                "a=vqos.resControl.cpmRtc.decodeTimeThresholdMs:9",
                "a=video.fbcDynamicFpsGrabTimeoutMs:${if (is120Fps) 6 else 18}",
                "a=vqos.resControl.cpmRtc.serverResolutionUpdateCoolDownCount:${if (is120Fps) 6000 else 12000}",
            ))
        }

        if (is240Fps) {
            lines.addAll(listOf(
                "a=video.enableNextCaptureMode:1",
                "a=vqos.maxStreamFpsEstimate:240",
                "a=video.videoSplitEncodeStripsPerFrame:3",
                "a=video.updateSplitEncodeStateDynamically:1",
            ))
        }

        lines.addAll(listOf(
            "a=vqos.adjustStreamingFpsDuringOutOfFocus:1",
            "a=vqos.resControl.cpmRtc.ignoreOutOfFocusWindowState:1",
            "a=vqos.resControl.perfHistory.rtcIgnoreOutOfFocusWindowState:1",
            "a=vqos.resControl.cpmRtc.featureMask:0",
            "a=vqos.resControl.cpmRtc.enable:0",
            "a=vqos.resControl.cpmRtc.minResolutionPercent:100",
            "a=vqos.resControl.cpmRtc.resolutionChangeHoldonMs:999999",
            "a=packetPacing.numGroups:${if (is120Fps) 3 else 5}",
            "a=packetPacing.maxDelayUs:1000",
            "a=packetPacing.minNumPacketsFrame:10",
            "a=video.rtpNackQueueLength:1024",
            "a=video.rtpNackQueueMaxPackets:512",
            "a=video.rtpNackMaxPacketCount:25",
            "a=vqos.drc.qpMaxResThresholdAdj:4",
            "a=vqos.grc.qpMaxResThresholdAdj:4",
            "a=vqos.drc.iirFilterFactor:100",
        ))

        if (isAv1) {
            lines.addAll(listOf(
                "a=vqos.drc.minQpHeadroom:20",
                "a=vqos.drc.lowerQpThreshold:100",
                "a=vqos.drc.upperQpThreshold:200",
                "a=vqos.drc.minAdaptiveQpThreshold:180",
                "a=vqos.drc.qpCodecThresholdAdj:0",
                "a=vqos.drc.qpMaxResThresholdAdj:20",
                "a=vqos.dfc.minQpHeadroom:20",
                "a=vqos.dfc.qpLowerLimit:100",
                "a=vqos.dfc.qpMaxUpperLimit:200",
                "a=vqos.dfc.qpMinUpperLimit:180",
                "a=vqos.dfc.qpMaxResThresholdAdj:20",
                "a=vqos.dfc.qpCodecThresholdAdj:0",
                "a=vqos.grc.minQpHeadroom:20",
                "a=vqos.grc.lowerQpThreshold:100",
                "a=vqos.grc.upperQpThreshold:200",
                "a=vqos.grc.minAdaptiveQpThreshold:180",
                "a=vqos.grc.qpMaxResThresholdAdj:20",
                "a=vqos.grc.qpCodecThresholdAdj:0",
                "a=video.minQp:25",
                "a=video.enableAv1RcPrecisionFactor:1",
            ))
        }

        lines.addAll(listOf(
            "a=video.clientViewportWd:$width",
            "a=video.clientViewportHt:$height",
            "a=video.maxFPS:$fps",
            "a=video.initialBitrateKbps:$initialBitrate",
            "a=video.initialPeakBitrateKbps:$maxBitrateKbps",
            "a=vqos.bw.maximumBitrateKbps:$maxBitrateKbps",
            "a=vqos.bw.minimumBitrateKbps:$minBitrate",
            "a=vqos.bw.peakBitrateKbps:$maxBitrateKbps",
            "a=vqos.bw.serverPeakBitrateKbps:$maxBitrateKbps",
            "a=vqos.bw.enableBandwidthEstimation:1",
            "a=vqos.bw.disableBitrateLimit:0",
            "a=vqos.grc.maximumBitrateKbps:$maxBitrateKbps",
            "a=vqos.grc.enable:0",
            "a=video.maxNumReferenceFrames:4",
            "a=video.mapRtpTimestampsToFrames:1",
            "a=video.encoderCscMode:3",
            "a=video.dynamicRangeMode:0",
            "a=video.bitDepth:$bitDepth",
            "a=video.scalingFeature1:${if (isAv1) 1 else 0}",
            "a=video.prefilterParams.prefilterModel:0",
            "m=audio 0 RTP/AVP",
            "a=msid:audio",
            "m=mic 0 RTP/AVP",
            "a=msid:mic",
            "a=rtpmap:0 PCMU/8000",
            "m=application 0 RTP/AVP",
            "a=msid:input_1",
            "a=ri.partialReliableThresholdMs:$partialReliableThresholdMs",
            "",
        ))

        return lines.joinToString("\n")
    }

    // ── Resolution parser ────────────────────────────────────────────────

    data class Resolution(val width: Int, val height: Int)

    fun parseResolution(resolution: String): Resolution {
        val parts = resolution.split("x")
        val w = parts.getOrNull(0)?.toIntOrNull() ?: 1920
        val h = parts.getOrNull(1)?.toIntOrNull() ?: 1080
        return if (w > 0 && h > 0) Resolution(w, h) else Resolution(1920, 1080)
    }

    // ── Partial reliable threshold parser ────────────────────────────────

    fun parsePartialReliableThresholdMs(sdp: String): Int? {
        val match = Regex("""a=ri\.partialReliableThresholdMs:(\d+)""", RegexOption.IGNORE_CASE).find(sdp)
        val parsed = match?.groupValues?.getOrNull(1)?.toIntOrNull() ?: return null
        return if (parsed > 0) parsed.coerceIn(1, 5000) else null
    }
}
