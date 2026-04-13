package com.zortos.opennow

import android.app.Activity
import android.view.Gravity
import android.view.ViewGroup
import android.widget.FrameLayout
import org.webrtc.EglBase
import org.webrtc.RendererCommon
import org.webrtc.SurfaceViewRenderer

/**
 * NativeSurfaceManager
 *
 * Adds a SurfaceViewRenderer directly into the activity's view hierarchy,
 * sitting behind the WebView so the HUD / touch controls stay on top.
 * libwebrtc renders decoded frames straight into this view via EGL textures —
 * no WebView compositor involvement, which is the latency win.
 */
class NativeSurfaceManager(private val activity: Activity) {

    private var renderer: SurfaceViewRenderer? = null

    /**
     * Create and attach the renderer to the window.
     * Must be called on any thread — posts to main thread internally.
     * [eglContext] is the shared EglBase context from PeerConnectionFactory.
     */
    fun create(eglContext: EglBase.Context): SurfaceViewRenderer {
        val sv = SurfaceViewRenderer(activity).apply {
            init(eglContext, null)
            setScalingType(RendererCommon.ScalingType.SCALE_ASPECT_FIT)
            setEnableHardwareScaler(true)
            // Keep the z-order below the WebView so the UI overlay stays visible
            setZOrderMediaOverlay(false)
        }

        val params = FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
            Gravity.CENTER
        )

        activity.runOnUiThread {
            // Insert at index 0 so it sits behind the WebView
            val root = activity.window.decorView.rootView as? ViewGroup
                ?: activity.findViewById(android.R.id.content)
            root.addView(sv, 0, params)
        }

        renderer = sv
        return sv
    }

    /** Remove the renderer from the window and release GL resources. */
    fun destroy() {
        val sv = renderer ?: return
        renderer = null
        activity.runOnUiThread {
            (sv.parent as? ViewGroup)?.removeView(sv)
        }
        try { sv.release() } catch (_: Exception) {}
    }

    fun show() { activity.runOnUiThread { renderer?.visibility = android.view.View.VISIBLE } }
    fun hide() { activity.runOnUiThread { renderer?.visibility = android.view.View.INVISIBLE } }
}
