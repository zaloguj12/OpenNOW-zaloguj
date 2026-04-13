package com.zortos.opennow

import android.app.Activity
import android.graphics.Color
import android.graphics.PixelFormat
import android.view.Gravity
import android.view.SurfaceHolder
import android.view.SurfaceView
import android.view.ViewGroup
import android.widget.FrameLayout

/**
 * NativeSurfaceManager
 *
 * Creates and manages a SurfaceView that sits on top of the Capacitor WebView.
 * The native WebRTC video decoder renders directly into this surface, bypassing
 * the WebView compositor entirely — this is the key latency win.
 *
 * Lifecycle:
 *   create()  → adds SurfaceView to the window, returns the Surface for MediaCodec
 *   resize()  → call when orientation changes
 *   destroy() → removes the SurfaceView and releases the surface
 */
class NativeSurfaceManager(private val activity: Activity) {

    private var surfaceView: SurfaceView? = null
    private var surfaceReadyCallback: ((SurfaceHolder) -> Unit)? = null

    /** True once the underlying Surface is ready for rendering. */
    var isSurfaceReady = false
        private set

    /**
     * Add the overlay SurfaceView to the activity's root view.
     * [onReady] is called on the main thread once the Surface is created.
     */
    fun create(onReady: (SurfaceHolder) -> Unit) {
        activity.runOnUiThread {
            if (surfaceView != null) {
                // Already created — just fire the callback if surface is ready
                surfaceView?.holder?.let { if (isSurfaceReady) onReady(it) }
                return@runOnUiThread
            }

            surfaceReadyCallback = onReady

            val sv = SurfaceView(activity).apply {
                // Transparent background so the WebView UI (stats overlay, buttons)
                // can still be rendered on top via a second transparent overlay.
                setZOrderMediaOverlay(true)
                holder.setFormat(PixelFormat.TRANSLUCENT)
                setBackgroundColor(Color.BLACK)
            }

            sv.holder.addCallback(object : SurfaceHolder.Callback {
                override fun surfaceCreated(holder: SurfaceHolder) {
                    isSurfaceReady = true
                    surfaceReadyCallback?.invoke(holder)
                }

                override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
                    // No-op: MediaCodec handles resolution changes internally
                }

                override fun surfaceDestroyed(holder: SurfaceHolder) {
                    isSurfaceReady = false
                }
            })

            val params = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT,
                Gravity.CENTER
            )

            // Insert below the WebView so the WebView UI (HUD, buttons) stays on top.
            // The WebView background must be transparent for the video to show through.
            val root = activity.window.decorView.rootView as? ViewGroup
                ?: activity.findViewById(android.R.id.content)
            root.addView(sv, 0, params) // index 0 = behind everything else

            surfaceView = sv
        }
    }

    /** Remove the SurfaceView from the window. Safe to call multiple times. */
    fun destroy() {
        activity.runOnUiThread {
            val sv = surfaceView ?: return@runOnUiThread
            val root = sv.parent as? ViewGroup
            root?.removeView(sv)
            surfaceView = null
            isSurfaceReady = false
            surfaceReadyCallback = null
        }
    }

    /** Bring the surface to front (e.g. after returning from background). */
    fun show() {
        activity.runOnUiThread {
            surfaceView?.visibility = android.view.View.VISIBLE
        }
    }

    /** Hide the surface without destroying it (e.g. when showing a dialog). */
    fun hide() {
        activity.runOnUiThread {
            surfaceView?.visibility = android.view.View.INVISIBLE
        }
    }

    fun getSurfaceHolder(): SurfaceHolder? = surfaceView?.holder
}
