package com.zortos.opennow

import android.content.Intent
import android.content.pm.ActivityInfo
import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(GfnPlugin::class.java)
        super.onCreate(savedInstanceState)
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
}
