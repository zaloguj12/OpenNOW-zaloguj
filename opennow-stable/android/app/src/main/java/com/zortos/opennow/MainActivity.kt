package com.zortos.opennow

import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import androidx.core.view.WindowCompat
import com.getcapacitor.BridgeActivity
import org.webrtc.SurfaceViewRenderer

class MainActivity : BridgeActivity() {

    /** SurfaceViewRenderer placed BEHIND the WebView for native video rendering. */
    var nativeSurfaceView: SurfaceViewRenderer? = null
        private set

    /** The NativeStreamManager instance shared with GfnPlugin. */
    var nativeStreamManager: NativeStreamManager? = null
        private set

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(GfnPlugin::class.java)
        super.onCreate(savedInstanceState)
        // Draw edge-to-edge so the WebView fills under system bars.
        // CSS then uses env(safe-area-inset-*) to avoid overlap.
        WindowCompat.setDecorFitsSystemWindows(window, false)
        // Force transparent system bars at runtime - required for HyperOS/MIUI
        // to correctly populate env(safe-area-inset-*) in the WebView.
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        // Keep screen on during app usage (streaming sessions can be long)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Set up native video surface behind the WebView
        setupNativeVideoSurface()
    }

    /**
     * Creates a SurfaceViewRenderer and inserts it BEHIND the WebView in the
     * view hierarchy. When streaming starts, the WebView background is made
     * transparent so the native video surface shows through.
     */
    private fun setupNativeVideoSurface() {
        val rootLayout = findViewById<ViewGroup>(android.R.id.content)
        val webViewContainer = rootLayout.getChildAt(0)

        // Create the SurfaceViewRenderer
        val surfaceView = SurfaceViewRenderer(this)
        surfaceView.layoutParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT,
            Gravity.CENTER
        )
        surfaceView.visibility = View.GONE  // Hidden until streaming starts
        surfaceView.setZOrderMediaOverlay(false) // Render behind WebView
        nativeSurfaceView = surfaceView

        // Insert the surface view at index 0 (behind everything else)
        rootLayout.addView(surfaceView, 0)

        // Initialize the native stream manager
        val manager = NativeStreamManager(this)
        manager.initialize(surfaceView)
        nativeStreamManager = manager

        // Wire state changes to toggle WebView transparency
        manager.onStateChanged = { state ->
            runOnUiThread {
                when (state) {
                    NativeStreamManager.StreamState.CONNECTING,
                    NativeStreamManager.StreamState.CONNECTED -> {
                        showNativeVideoSurface()
                    }
                    NativeStreamManager.StreamState.CLOSED,
                    NativeStreamManager.StreamState.FAILED,
                    NativeStreamManager.StreamState.IDLE -> {
                        hideNativeVideoSurface()
                    }
                }
            }
        }
    }

    /**
     * Makes the WebView transparent and shows the native video surface.
     * The touch gamepad overlay in the WebView remains visible on top.
     */
    fun showNativeVideoSurface() {
        nativeSurfaceView?.visibility = View.VISIBLE
        // Make the WebView and its container transparent
        bridge?.webView?.apply {
            setBackgroundColor(Color.TRANSPARENT)
            // Walk up setting backgrounds transparent so the surface shows through
            var parent = parent
            while (parent is View) {
                (parent as View).setBackgroundColor(Color.TRANSPARENT)
                parent = parent.getParent()
            }
        }
    }

    /**
     * Restores WebView opacity and hides the native video surface.
     */
    fun hideNativeVideoSurface() {
        nativeSurfaceView?.visibility = View.GONE
        // Restore the WebView background
        bridge?.webView?.apply {
            setBackgroundColor(Color.WHITE)
        }
    }

    /** Called by GfnPlugin.setOrientation to lock or restore screen rotation. */
    fun applyOrientation(mode: String) {
        requestedOrientation = when (mode) {
            "landscape" -> ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
            "portrait"  -> ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT
            else        -> ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED  // "sensor" / default
        }
    }

    // Receives the opennow://auth?code=... redirect from the system browser
    // after the user completes the NVIDIA login flow.
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val uri = intent.data ?: return
        // Only forward to plugin if this is a real OAuth callback (has a code param).
        // The bare opennow://auth link is just the return-to-app button -- ignore it.
        if (uri.scheme == "opennow" && uri.host == "auth" && uri.getQueryParameter("code") != null) {
            val plugin = bridge.getPlugin("GfnPlugin")?.getInstance() as? GfnPlugin
            plugin?.handleOAuthRedirect(uri)
        }
    }

    override fun onDestroy() {
        nativeStreamManager?.dispose()
        nativeStreamManager = null
        nativeSurfaceView = null
        super.onDestroy()
    }
}
