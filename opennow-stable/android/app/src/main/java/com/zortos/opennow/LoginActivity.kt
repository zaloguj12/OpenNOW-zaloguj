package com.zortos.opennow

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * LoginActivity -- shows the NVIDIA OAuth login page in a WebView.
 *
 * We use an in-app WebView instead of a Custom Tab or external browser because:
 * - Custom Tabs on Android block http://localhost redirects
 * - External browser can't be intercepted
 * - WebView lets us catch the localhost redirect in shouldOverrideUrlLoading
 *
 * Started by GfnPlugin.startLogin() via startActivityForResult().
 * Returns the auth code via setResult() to GfnPlugin.
 */
class LoginActivity : Activity() {

    companion object {
        const val EXTRA_AUTH_URL = "auth_url"
        const val EXTRA_REDIRECT_PORT = "redirect_port"
        const val RESULT_CODE = "auth_code"
        const val RESULT_ERROR = "auth_error"
    }

    private lateinit var webView: WebView
    private var port: Int = 2259

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val authUrl = intent.getStringExtra(EXTRA_AUTH_URL) ?: run { finish(); return }
        port = intent.getIntExtra(EXTRA_REDIRECT_PORT, 2259)

        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.userAgentString =
                "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36"

            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val url = request.url
                    // Intercept the localhost redirect -- this is the OAuth callback
                    if (url.host == "localhost" && url.port == port) {
                        val code = url.getQueryParameter("code")
                        val error = url.getQueryParameter("error")
                        val result = Intent()
                        if (code != null) {
                            result.putExtra(RESULT_CODE, code)
                        } else {
                            result.putExtra(RESULT_ERROR, url.getQueryParameter("error_description") ?: error ?: "no code")
                        }
                        setResult(RESULT_OK, result)
                        finish()
                        return true
                    }
                    return false
                }
            }

            loadUrl(authUrl)
        }

        setContentView(webView)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            val result = Intent()
            result.putExtra(RESULT_ERROR, "cancelled")
            setResult(RESULT_OK, result)
            finish()
        }
    }
}
