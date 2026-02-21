package com.zortos.opennow

import android.content.Intent
import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(GfnPlugin::class.java)
        super.onCreate(savedInstanceState)
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
