package com.zortos.opennow

import android.content.Intent
import android.net.Uri
import android.util.Base64
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import androidx.activity.result.ActivityResult
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MediaType.Companion.toMediaType
import org.json.JSONObject
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.concurrent.TimeUnit

/**
 * GfnPlugin -- Capacitor plugin that exposes the GFN backend API to the WebView renderer.
 *
 * This mirrors what the Electron main process does (src/main/gfn/), but in Kotlin
 * using OkHttp instead of Node's fetch. The renderer calls these methods through
 * the platform API bridge (src/renderer/src/platform/api.ts).
 *
 * Registration in MainActivity:
 *
 *   class MainActivity : BridgeActivity() {
 *     override fun onCreate(savedInstanceState: Bundle?) {
 *       registerPlugin(GfnPlugin::class.java)
 *       super.onCreate(savedInstanceState)
 *     }
 *   }
 *
 * OAuth redirect wiring in MainActivity -- add this override:
 *
 *   override fun onNewIntent(intent: Intent) {
 *     super.onNewIntent(intent)
 *     val uri = intent.data ?: return
 *     if (uri.scheme == "opennow" && uri.host == "auth") {
 *       val plugin = bridge.getPlugin("GfnPlugin")?.getInstance() as? GfnPlugin
 *       plugin?.handleOAuthRedirect(uri)
 *     }
 *   }
 *
 * AndroidManifest.xml intent-filter (inside the <activity> tag):
 *
 *   <intent-filter android:autoVerify="false">
 *     <action android:name="android.intent.action.VIEW" />
 *     <category android:name="android.intent.category.DEFAULT" />
 *     <category android:name="android.intent.category.BROWSABLE" />
 *     <data android:scheme="opennow" android:host="auth" />
 *   </intent-filter>
 *
 * Required Gradle dependencies (in android/app/build.gradle):
 *
 *   implementation "com.squareup.okhttp3:okhttp:4.12.0"
 *   implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0"
 *   implementation "androidx.security:security-crypto:1.1.0-alpha06"
 */
@CapacitorPlugin(name = "GfnPlugin")
class GfnPlugin : Plugin() {

    private val http: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .followRedirects(true)
            .dns(okhttp3.Dns.SYSTEM)
            .build()
    }

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private val GFN_CLIENT_VERSION = "2.0.80.173"
    private val ANDROID_USER_AGENT =
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 " +
        "NVIDIAApp/4.0.0 GFN-ANDROID/4.0.0"

    // Pending OAuth call -- set when login() is called, resolved by handleOAuthRedirect()
    @Volatile private var pendingLoginCall: PluginCall? = null
    @Volatile private var pendingCodeVerifier: String? = null
    @Volatile private var pendingProviderIdpId: String? = null
    @Volatile private var pendingRedirectPort: Int? = null

    @ActivityCallback
    private fun onLoginResult(call: PluginCall?, result: ActivityResult) {
        val data = result.data
        val code = data?.getStringExtra(LoginActivity.RESULT_CODE)
        val error = data?.getStringExtra(LoginActivity.RESULT_ERROR)
        val port = pendingRedirectPort ?: 2259
        val uri = if (code != null)
            android.net.Uri.parse("http://localhost:$port/?code=$code")
        else
            android.net.Uri.parse("http://localhost:$port/?error=${error ?: "cancelled"}")
        handleOAuthRedirect(uri)
    }

    // ──────────────────────────────────────────────────────────────
    // Encrypted storage
    // ──────────────────────────────────────────────────────────────

    private fun getEncryptedPrefs() = try {
        val masterKey = MasterKey.Builder(activity)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()
        EncryptedSharedPreferences.create(
            activity,
            "opennow_auth",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    } catch (e: Exception) {
        // Fall back to plain SharedPreferences if encryption is unavailable
        activity.getSharedPreferences("opennow_auth", android.content.Context.MODE_PRIVATE)
    }

    private fun saveTokens(tokens: JSONObject, provider: JSONObject) {
        getEncryptedPrefs().edit().apply {
            putString("tokens", tokens.toString())
            putString("provider", provider.toString())
            putString("saved_at", System.currentTimeMillis().toString())
            apply()
        }
    }

    private fun loadSavedSession(): Pair<JSONObject, JSONObject>? {
        val prefs = getEncryptedPrefs()
        val tokensStr = prefs.getString("tokens", null) ?: return null
        val providerStr = prefs.getString("provider", null) ?: return null
        return try {
            Pair(JSONObject(tokensStr), JSONObject(providerStr))
        } catch (e: Exception) {
            null
        }
    }

    private fun clearSavedSession() {
        getEncryptedPrefs().edit().clear().apply()
    }

    // ──────────────────────────────────────────────────────────────
    // Helper utilities
    // ──────────────────────────────────────────────────────────────

    private fun commonHeaders(token: String): Map<String, String> {
        val clientId = java.util.UUID.randomUUID().toString()
        val deviceId = java.util.UUID.randomUUID().toString()
        return mapOf(
            "User-Agent" to ANDROID_USER_AGENT,
            "Authorization" to "GFNJWT $token",
            "Content-Type" to "application/json",
            "Origin" to "https://play.geforcenow.com",
            "Referer" to "https://play.geforcenow.com/",
            "nv-browser-type" to "CHROME",
            "nv-client-id" to clientId,
            "nv-client-streamer" to "NVIDIA-CLASSIC",
            "nv-client-type" to "ANDROID",
            "nv-client-version" to GFN_CLIENT_VERSION,
            "nv-device-make" to "Google",
            "nv-device-model" to "Pixel 8",
            "nv-device-os" to "ANDROID",
            "nv-device-type" to "MOBILE",
            "x-device-id" to deviceId,
        )
    }

    private fun get(url: String, headers: Map<String, String>): String {
        val conn = java.net.URL(url).openConnection() as javax.net.ssl.HttpsURLConnection
        try {
            conn.requestMethod = "GET"
            conn.connectTimeout = 15_000
            conn.readTimeout = 15_000
            headers.forEach { (k, v) -> conn.setRequestProperty(k, v) }
            val status = conn.responseCode
            val stream = if (status in 200..299) conn.inputStream else conn.errorStream
            return stream?.bufferedReader()?.readText() ?: "{}"
        } finally {
            conn.disconnect()
        }
    }

    private fun post(url: String, body: String, headers: Map<String, String>): String {
        val conn = java.net.URL(url).openConnection() as javax.net.ssl.HttpsURLConnection
        try {
            conn.requestMethod = "POST"
            conn.doOutput = true
            conn.connectTimeout = 15_000
            conn.readTimeout = 15_000
            conn.setRequestProperty("Content-Type", "application/json")
            headers.forEach { (k, v) -> conn.setRequestProperty(k, v) }
            conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            val status = conn.responseCode
            val stream = if (status in 200..299) conn.inputStream else conn.errorStream
            return stream?.bufferedReader()?.readText() ?: "{}"
        } finally {
            conn.disconnect()
        }
    }

    private fun <T> runAsync(call: PluginCall, block: suspend () -> T, toJs: (T) -> JSObject) {
        scope.launch {
            try {
                val result = block()
                call.resolve(toJs(result))
            } catch (e: Exception) {
                call.reject(e.message ?: "Unknown error", e)
            }
        }
    }

    // ──────────────────────────────────────────────────────────────
    // PKCE helpers
    // ──────────────────────────────────────────────────────────────

    private fun generateCodeVerifier(): String {
        val bytes = ByteArray(32)
        SecureRandom().nextBytes(bytes)
        return Base64.encodeToString(bytes, Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING)
    }

    private fun generateCodeChallenge(verifier: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(verifier.toByteArray(Charsets.US_ASCII))
        return Base64.encodeToString(digest, Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING)
    }

    // ──────────────────────────────────────────────────────────────
    // Auth
    // ──────────────────────────────────────────────────────────────

    @PluginMethod
    fun getAuthSession(call: PluginCall) {
        scope.launch {
            val result = JSObject()
            val saved = try { loadSavedSession() } catch (e: Exception) { null }

            if (saved == null) {
                result.put("session", JSONObject.NULL)
                result.put("refresh", JSObject().also {
                    it.put("attempted", false)
                    it.put("forced", false)
                    it.put("outcome", "not_attempted")
                    it.put("message", "No saved session on this device")
                })
                call.resolve(result)
                return@launch
            }

            val (tokens, provider) = saved
            val expiresAt = tokens.optLong("expiresAt", 0L)
            val now = System.currentTimeMillis()
            val refreshToken = tokens.optString("refreshToken", "")

            // If token is still valid (>5 min remaining), return it as-is
            if (expiresAt > now + 300_000L) {
                val session = buildSessionObject(tokens, provider)
                result.put("session", session)
                result.put("refresh", JSObject().also {
                    it.put("attempted", false)
                    it.put("forced", false)
                    it.put("outcome", "not_attempted")
                    it.put("message", "Token still valid")
                })
                call.resolve(result)
                return@launch
            }

            // Token is expired or near expiry -- try to refresh
            if (refreshToken.isEmpty()) {
                result.put("session", buildSessionObject(tokens, provider))
                result.put("refresh", JSObject().also {
                    it.put("attempted", false)
                    it.put("forced", false)
                    it.put("outcome", "missing_refresh_token")
                    it.put("message", "No refresh token available")
                })
                call.resolve(result)
                return@launch
            }

            try {
                val newTokens = refreshTokens(refreshToken)
                saveTokens(newTokens, provider)
                result.put("session", buildSessionObject(newTokens, provider))
                result.put("refresh", JSObject().also {
                    it.put("attempted", true)
                    it.put("forced", false)
                    it.put("outcome", "refreshed")
                    it.put("message", "Token refreshed successfully")
                })
            } catch (e: Exception) {
                // Refresh failed -- return the stale session anyway
                result.put("session", buildSessionObject(tokens, provider))
                result.put("refresh", JSObject().also {
                    it.put("attempted", true)
                    it.put("forced", false)
                    it.put("outcome", "failed")
                    it.put("message", e.message ?: "Token refresh failed")
                })
            }

            call.resolve(result)
        }
    }

    private fun refreshTokens(refreshToken: String): JSONObject {
        val json = volleyPostSync(
            url = "https://login.nvidia.com/token",
            params = mapOf(
                "grant_type" to "refresh_token",
                "client_id" to "ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ",
                "refresh_token" to refreshToken
            )
        )

        if (json.has("error")) {
            throw Exception("Token refresh error: ${json.optString("error_description", json.optString("error"))}")
        }

        val expiresIn = json.optLong("expires_in", 3600L)
        return JSONObject().apply {
            put("accessToken", json.optString("access_token"))
            put("refreshToken", json.optString("refresh_token", refreshToken)) // keep old if not returned
            put("idToken", json.optString("id_token"))
            put("expiresAt", System.currentTimeMillis() + expiresIn * 1000L)
        }
    }

    /**
     * Builds the AuthSession object the renderer expects.
     * Mirrors the shape from src/shared/gfn.ts: { tokens, user, provider }
     */
    private fun buildSessionObject(tokens: JSONObject, provider: JSONObject): JSONObject {
        // Decode the user info from the JWT id_token payload (no signature verification needed here)
        val idToken = tokens.optString("idToken", tokens.optString("id_token", ""))
        val userJson = decodeJwtPayload(idToken)

        val user = JSONObject().apply {
            put("userId", userJson.optString("sub", "unknown"))
            put("displayName", userJson.optString("name", userJson.optString("preferred_username", "GFN User")))
            put("email", userJson.optString("email", ""))
            put("avatarUrl", JSONObject.NULL)
            put("membershipTier", "unknown")
        }

        return JSONObject().apply {
            put("tokens", tokens)
            put("user", user)
            put("provider", provider)
        }
    }

    private fun decodeJwtPayload(jwt: String): JSONObject {
        return try {
            val parts = jwt.split(".")
            if (parts.size < 2) return JSONObject()
            val payloadBytes = Base64.decode(parts[1], Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING)
            JSONObject(String(payloadBytes, Charsets.UTF_8))
        } catch (e: Exception) {
            JSONObject()
        }
    }

    @PluginMethod
    fun getLoginProviders(call: PluginCall) {
        runAsync(call, block = {
            try {
                val url = "https://pcs.geforcenow.com/v1/serviceUrls"
                val headers = mapOf(
                    "User-Agent" to ANDROID_USER_AGENT,
                    "Accept" to "application/json"
                )
                get(url, headers) as String?
            } catch (e: Exception) {
                // If the network call fails, fall back to the hardcoded default
                android.util.Log.w("GfnPlugin", "getLoginProviders fetch failed: ${e.message}")
                null
            }
        }, toJs = { body ->
            val arr = com.getcapacitor.JSArray()
            var parsed = false
            if (body != null) {
                android.util.Log.d("GfnPlugin", "serviceUrls raw response: $body")
                try {
                    val root = JSONObject(body)
                    val endpoints = root.optJSONObject("gfnServiceInfo")?.optJSONArray("gfnServiceEndpoints")
                    if (endpoints != null) {
                        for (i in 0 until endpoints.length()) {
                            val ep = endpoints.getJSONObject(i)
                            arr.put(JSObject().also {
                                it.put("idpId", ep.optString("idpId"))
                                it.put("code", ep.optString("loginProviderCode"))
                                it.put("displayName", ep.optString("loginProviderDisplayName"))
                                it.put("streamingServiceUrl", ep.optString("streamingServiceUrl"))
                                it.put("priority", ep.optInt("loginProviderPriority", 99))
                            })
                        }
                        parsed = arr.length() > 0
                    }
                } catch (e: Exception) {
                    android.util.Log.w("GfnPlugin", "getLoginProviders parse failed: ${e.message}")
                }
            }
            // Fallback: hardcoded from live pcs.geforcenow.com/v1/serviceUrls response (2026-03-02)
            if (!parsed) {
                data class P(val idpId: String, val code: String, val name: String, val url: String, val priority: Int)
                val fallback = listOf(
                    P("PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg", "NVIDIA", "NVIDIA",           "https://prod.cloudmatchbeta.nvidiagrid.net/",         1),
                    P("Q1qniNEW0JjufNnXEqzjTONfWoEYAvTdsg5mBRsEork",  "KDD",    "au",               "https://prod.kdd.geforcenow.nvidiagrid.net/",          5),
                    P("e2SnCkOjoqZiiDRhjSDVv0xzWjJ28vntfo933yWSKx4",  "TWM",    "Taiwan Mobile",    "https://prod.twm.geforcenow.nvidiagrid.net/",          6),
                    P("UPWx8p5zwVUqGXorNji6qCzocVGDNWN7rqmPexEvedY",  "ZAI",    "Zain",             "https://prod.zai.geforcenow.nvidiagrid.net/",          7),
                    P("pC8KYgDzm2TMgkPO1YlOSj8PjhT57JIbdlwDfFZNZFA",  "TKC",    "GAME+",            "https://prod.tkc.geforcenow.nvidiagrid.net/",          8),
                    P("QwbAt7Fqmb5vmdOCuXtIlAF3YOACR4rot7xirVFlnkE",  "STR",    "StarHub",          "https://prod.str.geforcenow.nvidiagrid.net/",          9),
                    P("IsvVBA3Aj8KZ7gwwuRUhB6-tOF2o2F1wncD-XjYv100",  "DIG",    "Digevo",           "https://prod.DIG.geforcenow.nvidiagrid.net/",         10),
                    P("HVmQH98-CMT7FBuj_X3_QPmEYhJ-zzvFvM3mwmWwczw",  "ABY",    "ABYA",             "https://prod.aby.geforcenow.nvidiagrid.net/",         11),
                    P("SBcX86bSGvOo6kgTpV_dRtqSs_3uU0hsK3r1JZGQElo",  "PNT",    "Cloud.GG",         "https://prod.pnt.geforcenow.nvidiagrid.net/",         12),
                    P("4880Rhf61Q-Mab81qdnnVBFxF1LtOlrgxlaqvnI5Xis",  "YES",    "YES",              "https://prod.yes.geforcenow.nvidiagrid.net/",         15),
                    P("z6t8yLbASocZyaERyRoWvr4cm3P2lN7qZgqNqmPpJOs",  "GCS",    "GFN.AM",           "https://am-west.gcs.geforcenow.nvidiagrid.net/",      16),
                    P("XE399GXVdFM_XtGGQU1OcSxi1GVp0kRnOtq3wkTcOag",  "RAN",    "rain",             "https://prod.RAN.geforcenow.nvidiagrid.net/",         17),
                    P("Kglwxcypk1jzx0tv1r8fVjOIRfXwKMtE0cgoJ3gmXv4",  "GKR",    "GFN Korea",        "https://prod.gkr.geforcenow.nvidiagrid.net/",         18),
                    P("Q0g4IWPZrHIiXS2nh3I5fg59Aq09xhtd5xjd19nhJJM",  "BPC",    "Brothers Pictures", "https://prod.BPC.geforcenow.nvidiagrid.net/",        19),
                )
                for (p in fallback) {
                    arr.put(JSObject().also {
                        it.put("idpId", p.idpId)
                        it.put("code", p.code)
                        it.put("displayName", p.name)
                        it.put("streamingServiceUrl", p.url)
                        it.put("priority", p.priority)
                    })
                }
            }
            JSObject().also { it.put("providers", arr) }
        })
    }

    /**
     * login() -- opens the NVIDIA OAuth page in the system browser using PKCE.
     *
     * This call does NOT resolve immediately. It stores the PluginCall reference
     * and resolves it when handleOAuthRedirect() is called by MainActivity
     * after the browser redirects back to opennow://auth.
     *
     * The AndroidManifest.xml intent-filter and MainActivity.onNewIntent() wiring
     * are described in the file header comment.
     */
    @PluginMethod
    fun startLogin(call: PluginCall) {
        call.setKeepAlive(true)

        val providerIdpId = call.getString("providerIdpId", "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg")!!

        val verifier = generateCodeVerifier()
        val challenge = generateCodeChallenge(verifier)
        val nonce = java.util.UUID.randomUUID().toString().replace("-", "")

        val candidatePorts = listOf(2259, 6460, 7119, 8870, 9096)
        val port = candidatePorts.firstOrNull { p ->
            try { java.net.ServerSocket(p).also { it.close() }; true }
            catch (e: Exception) { false }
        } ?: 2259

        pendingLoginCall = call
        pendingCodeVerifier = verifier
        pendingProviderIdpId = providerIdpId
        pendingRedirectPort = port

        val redirectUri = "http://localhost:$port"
        val deviceId = java.security.MessageDigest.getInstance("SHA-256")
            .digest("${android.os.Build.HOST}:${android.os.Build.SERIAL}:opennow-stable".toByteArray())
            .joinToString("") { "%02x".format(it) }
        val locale = java.util.Locale.getDefault().toString().replace('_', '-')
        val query = mapOf(
            "response_type" to "code",
            "device_id" to deviceId,
            "scope" to "openid consent email tk_client age",
            "client_id" to "ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ",
            "redirect_uri" to redirectUri,
            "ui_locales" to locale,
            "nonce" to nonce,
            "prompt" to "select_account",
            "code_challenge" to challenge,
            "code_challenge_method" to "S256",
            "idp_id" to providerIdpId,
        ).entries.joinToString("&") { (k, v) -> "${Uri.encode(k)}=${Uri.encode(v)}" }
        val authUrl = "https://login.nvidia.com/authorize?$query"

        // Launch LoginActivity via the Capacitor bridge with @ActivityCallback wiring
        activity.runOnUiThread {
            val intent = Intent(activity, LoginActivity::class.java)
            intent.putExtra(LoginActivity.EXTRA_AUTH_URL, authUrl)
            intent.putExtra(LoginActivity.EXTRA_REDIRECT_PORT, port)
            startActivityForResult(call, intent, "onLoginResult")
        }
    }

    /**
     * Called by MainActivity.onNewIntent() when the system browser redirects back to
     * opennow://auth?code=...
     *
     * Do NOT call this from JS -- it is an internal entry point from the Activity.
     */
    fun handleOAuthRedirect(uri: Uri) {
        activity.runOnUiThread {
            android.widget.Toast.makeText(activity,
                "redirect: verifier=${pendingCodeVerifier != null} call=${pendingLoginCall != null} uri=$uri",
                android.widget.Toast.LENGTH_LONG).show()
        }
        val verifier = pendingCodeVerifier ?: return
        val port = pendingRedirectPort ?: 2259
        val call = pendingLoginCall

        pendingLoginCall = null
        pendingCodeVerifier = null
        pendingProviderIdpId = null
        pendingRedirectPort = null

        val code = uri.getQueryParameter("code")
        val error = uri.getQueryParameter("error")

        if (error != null || code == null) {
            call?.reject(uri.getQueryParameter("error_description") ?: error ?: "no code returned")
            return
        }

        // Run token exchange on a coroutine using HttpURLConnection
        // (same underlying stack as WebView, avoids OkHttp DNS init issue)
        scope.launch {
            try {
                activity.runOnUiThread {
                    android.widget.Toast.makeText(activity, "exchanging code...", android.widget.Toast.LENGTH_SHORT).show()
                }
                val json = volleyPostSync(
                    url = "https://login.nvidia.com/token",
                    params = mapOf(
                        "grant_type" to "authorization_code",
                        "client_id" to "ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ",
                        "code" to code,
                        "redirect_uri" to "http://localhost:$port",
                        "code_verifier" to verifier
                    )
                )
                if (json.has("error")) {
                    call?.reject("${json.optString("error")}: ${json.optString("error_description")}")
                    return@launch
                }
                val expiresIn = json.optLong("expires_in", 3600L)
                val tokens = JSONObject().apply {
                    put("accessToken", json.optString("access_token"))
                    put("refreshToken", json.optString("refresh_token", ""))
                    put("idToken", json.optString("id_token", ""))
                    put("expiresAt", System.currentTimeMillis() + expiresIn * 1000L)
                }
                val provider = JSONObject().apply {
                    put("idpId", "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg")
                    put("code", "NVIDIA")
                    put("displayName", "NVIDIA")
                    put("streamingServiceUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")
                    put("priority", 0)
                }
                saveTokens(tokens, provider)
                val session = buildSessionObject(tokens, provider)
                activity.runOnUiThread {
                    android.widget.Toast.makeText(activity, "tokens OK, resolving call", android.widget.Toast.LENGTH_SHORT).show()
                }
                // Resolve with the session fields directly (not wrapped in { session: ... })
                // because JS does: const session = await login() then setAuthSession(session)
                val result = JSObject(session.toString())
                call?.resolve(result)
            } catch (e: Exception) {
                val msg = e.message ?: "unknown"
                activity.runOnUiThread {
                    android.widget.Toast.makeText(activity, msg, android.widget.Toast.LENGTH_LONG).show()
                }
                call?.reject("Token exchange failed: $msg")
            }
        }
    }

    @PluginMethod
    fun saveSession(call: PluginCall) {
        try {
            val tokensObj = call.getObject("tokens") ?: run { call.reject("Missing tokens"); return }
            val providerObj = call.getObject("provider") ?: run { call.reject("Missing provider"); return }
            val tokens = JSONObject(tokensObj.toString())
            val provider = JSONObject(providerObj.toString())
            saveTokens(tokens, provider)
            val session = buildSessionObject(tokens, provider)
            val result = JSObject(session.toString())
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("saveSession failed: ${e.message}", e)
        }
    }

    // Simple synchronous POST using HttpURLConnection -- called from coroutine scope.
    // Uses the same DNS stack as the system WebView, unlike OkHttp which has init issues.
    private fun volleyPostSync(url: String, params: Map<String, String>): JSONObject {
        val body = params.entries.joinToString("&") { (k, v) ->
            "${java.net.URLEncoder.encode(k, "UTF-8")}=${java.net.URLEncoder.encode(v, "UTF-8")}"
        }
        val conn = java.net.URL(url).openConnection() as javax.net.ssl.HttpsURLConnection
        try {
            conn.requestMethod = "POST"
            conn.doOutput = true
            conn.connectTimeout = 15_000
            conn.readTimeout = 15_000
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
            conn.setRequestProperty("User-Agent", ANDROID_USER_AGENT)
            conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            val status = conn.responseCode
            val stream = if (status in 200..299) conn.inputStream else conn.errorStream
            val text = stream?.bufferedReader()?.readText() ?: throw Exception("Empty response (HTTP $status)")
            if (status !in 200..299) throw Exception("HTTP $status: $text")
            return JSONObject(text)
        } finally {
            conn.disconnect()
        }
    }

    private fun exchangeCodeForTokens(code: String, verifier: String, port: Int = 2259): JSONObject {
        // Use HttpURLConnection (Android native stack) to avoid OkHttp DNS init issues
        val postBody = "grant_type=authorization_code" +
            "&client_id=ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ" +
            "&code=${java.net.URLEncoder.encode(code, "UTF-8")}" +
            "&redirect_uri=${java.net.URLEncoder.encode("http://localhost:$port", "UTF-8")}" +
            "&code_verifier=${java.net.URLEncoder.encode(verifier, "UTF-8")}"

        val url = java.net.URL("https://login.nvidia.com/token")
        val conn = url.openConnection() as javax.net.ssl.HttpsURLConnection
        try {
            conn.requestMethod = "POST"
            conn.doOutput = true
            conn.connectTimeout = 15_000
            conn.readTimeout = 15_000
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
            conn.setRequestProperty("User-Agent", ANDROID_USER_AGENT)
            conn.outputStream.use { it.write(postBody.toByteArray(Charsets.UTF_8)) }

            val responseBody = conn.inputStream.bufferedReader().readText()
            val json = JSONObject(responseBody)

            if (json.has("error")) {
                throw Exception("${json.optString("error")}: ${json.optString("error_description")}")
            }

            val expiresIn = json.optLong("expires_in", 3600L)
            return JSONObject().apply {
                put("accessToken", json.optString("access_token"))
                put("refreshToken", json.optString("refresh_token", ""))
                put("idToken", json.optString("id_token", ""))
                put("expiresAt", System.currentTimeMillis() + expiresIn * 1000L)
            }
        } finally {
            conn.disconnect()
        }
    }

    private fun fetchProviderInfo(providerIdpId: String): JSONObject {
        // Always return the default immediately -- no network call needed.
        return JSONObject().apply {
            put("idpId", providerIdpId)
            put("code", "NVIDIA")
            put("displayName", "NVIDIA")
            put("streamingServiceUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")
            put("priority", 0)
        }
    }

    // Legacy stub -- login is now handled by startLogin + oauthCode event + saveSession
    @PluginMethod
    fun login(call: PluginCall) {
        startLogin(call)
    }

    @PluginMethod
    fun logout(call: PluginCall) {
        clearSavedSession()
        pendingLoginCall?.reject("Logged out")
        pendingLoginCall = null
        pendingCodeVerifier = null
        pendingProviderIdpId = null
        pendingRedirectPort = null
        call.resolve()
    }

    // ──────────────────────────────────────────────────────────────
    // Games
    // ──────────────────────────────────────────────────────────────

    // ──────────────────────────────────────────────────────────────
    // GraphQL / Games helpers (mirrors src/main/gfn/games.ts)
    // ──────────────────────────────────────────────────────────────

    private val GRAPHQL_URL = "https://games.geforce.com/graphql"
    private val PANELS_QUERY_HASH = "f8e26265a5db5c20e1334a6872cf04b6e3970507697f6ae55a6ddefa5420daf0"
    private val LCARS_CLIENT_ID = "ec7e38d4-03af-4b58-b131-cfb0495903ab"

    private fun gfnGraphQLHeaders(token: String): Map<String, String> = mapOf(
        "Accept" to "application/json, text/plain, */*",
        "Content-Type" to "application/graphql",
        "Origin" to "https://play.geforcenow.com",
        "Referer" to "https://play.geforcenow.com/",
        "Authorization" to "GFNJWT $token",
        "nv-client-id" to LCARS_CLIENT_ID,
        "nv-client-type" to "NATIVE",
        "nv-client-version" to GFN_CLIENT_VERSION,
        "nv-client-streamer" to "NVIDIA-CLASSIC",
        "nv-device-os" to "WINDOWS",
        "nv-device-type" to "DESKTOP",
        "nv-device-make" to "UNKNOWN",
        "nv-device-model" to "UNKNOWN",
        "nv-browser-type" to "CHROME",
        "User-Agent" to ANDROID_USER_AGENT,
    )

    private fun getVpcId(token: String, baseUrl: String): String {
        return try {
            val url = "${baseUrl.trimEnd('/')}/v2/serverInfo"
            val body = get(url, gfnGraphQLHeaders(token))
            JSONObject(body).optJSONObject("requestStatus")?.optString("serverId") ?: "GFN-PC"
        } catch (e: Exception) {
            "GFN-PC"
        }
    }

    private fun fetchPanels(token: String, panelNames: List<String>, vpcId: String): String {
        val variables = JSONObject().apply {
            put("vpcId", vpcId)
            put("locale", "en_US")
            put("panelNames", org.json.JSONArray(panelNames))
        }.toString()
        val extensions = "{\"persistedQuery\":{\"sha256Hash\":\"$PANELS_QUERY_HASH\"}}"
        val requestType = if (panelNames.contains("LIBRARY")) "panels/Library" else "panels/MainV2"
        val huId = System.currentTimeMillis().toString(16) + Math.random().toString().takeLast(8)
        val params = "requestType=${java.net.URLEncoder.encode(requestType, "UTF-8")}" +
            "&extensions=${java.net.URLEncoder.encode(extensions, "UTF-8")}" +
            "&huId=$huId" +
            "&variables=${java.net.URLEncoder.encode(variables, "UTF-8")}"
        val url = "$GRAPHQL_URL?$params"
        return get(url, gfnGraphQLHeaders(token))
    }

    @PluginMethod
    fun fetchPublicGames(call: PluginCall) {
        runAsync(call, block = {
            val url = "https://static.nvidiagrid.net/supported-public-game-list/locales/gfnpc-en-US.json"
            get(url, mapOf("User-Agent" to ANDROID_USER_AGENT, "Accept" to "application/json"))
        }, toJs = { body ->
            val result = JSObject()
            result.put("games", body)
            result
        })
    }

    private fun flattenPanels(body: String): org.json.JSONArray {
        val root = JSONObject(body)
        val games = org.json.JSONArray()
        val panels = root.optJSONObject("data")?.optJSONArray("panels") ?: return games
        for (pi in 0 until panels.length()) {
            val sections = panels.getJSONObject(pi).optJSONArray("sections") ?: continue
            for (si in 0 until sections.length()) {
                val items = sections.getJSONObject(si).optJSONArray("items") ?: continue
                for (ii in 0 until items.length()) {
                    val item = items.getJSONObject(ii)
                    if (item.optString("__typename") == "GameItem") {
                        val app = item.optJSONObject("app") ?: continue
                        games.put(appToGame(app))
                    }
                }
            }
        }
        return games
    }

    private fun appToGame(app: JSONObject): JSONObject {
        val appId = app.optString("id", "")
        val variants = app.optJSONArray("variants") ?: org.json.JSONArray()
        val variantList = org.json.JSONArray()
        var selectedVariantIndex = 0
        var launchAppId: String? = null

        for (i in 0 until variants.length()) {
            val v = variants.getJSONObject(i)
            val vid = v.optString("id", "")
            val store = v.optString("appStore", "Unknown")
            val selected = v.optJSONObject("gfn")?.optJSONObject("library")?.optBoolean("selected", false) ?: false
            if (selected) selectedVariantIndex = i
            if (launchAppId == null && vid.matches(Regex("\\d+"))) launchAppId = vid
            val vObj = JSONObject().apply {
                put("id", vid)
                put("store", store)
                put("supportedControls", v.optJSONArray("supportedControls") ?: org.json.JSONArray())
            }
            variantList.put(vObj)
        }

        if (launchAppId == null && appId.matches(Regex("\\d+"))) launchAppId = appId

        val images = app.optJSONObject("images")
        val imageUrl = images?.let {
            it.optString("GAME_BOX_ART", "").ifEmpty {
                it.optString("TV_BANNER", "").ifEmpty {
                    it.optString("HERO_IMAGE", "")
                }
            }
        }?.ifEmpty { null }

        val selectedVariant = if (variantList.length() > selectedVariantIndex)
            variantList.getJSONObject(selectedVariantIndex).optString("id", "") else ""
        val gameId = "$appId:${selectedVariant.ifEmpty { "default" }}"

        return JSONObject().apply {
            put("id", gameId)
            put("uuid", appId)
            put("launchAppId", launchAppId ?: JSONObject.NULL)
            put("title", app.optString("title", "Unknown"))
            put("description", app.optString("description", app.optString("longDescription", "")))
            put("imageUrl", imageUrl ?: JSONObject.NULL)
            put("playType", app.optJSONObject("gfn")?.optString("playType", "") ?: "")
            put("membershipTierLabel", app.optJSONObject("gfn")?.optString("minimumMembershipTierLabel", "") ?: "")
            put("selectedVariantIndex", selectedVariantIndex)
            put("variants", variantList)
        }
    }

    @PluginMethod
    fun fetchMainGames(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val baseUrl = call.getString("providerStreamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!
        runAsync(call, block = {
            val vpcId = getVpcId(token, baseUrl)
            val body = fetchPanels(token, listOf("MAIN"), vpcId)
            flattenPanels(body)
        }, toJs = { games ->
            val result = JSObject()
            result.put("games", games.toString())
            result
        })
    }

    @PluginMethod
    fun fetchLibraryGames(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val baseUrl = call.getString("providerStreamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!
        runAsync(call, block = {
            val vpcId = getVpcId(token, baseUrl)
            val body = fetchPanels(token, listOf("LIBRARY"), vpcId)
            flattenPanels(body)
        }, toJs = { games ->
            val result = JSObject()
            result.put("games", games.toString())
            result
        })
    }

    // ──────────────────────────────────────────────────────────────
    // Session management
    // ──────────────────────────────────────────────────────────────

    @PluginMethod
    fun createSession(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val baseUrl = call.getString("streamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!
        val appId = call.getString("appId") ?: run { call.reject("Missing appId"); return }

        val requestedZoneAddress = call.getString("requestedZoneAddress", "")!!.trim().ifEmpty { null }

        val bodyJson = JSONObject().apply {
            put("sessionRequestData", JSONObject().apply {
                put("appId", appId)
                put("clientIdentification", "GFN-PC")
                put("clientPlatformName", "android")
                put("streamerVersion", 1)
                put("clientVersion", "30.0")
                put("sdkVersion", "1.0")
                put("useOps", true)
                put("audioMode", 2)
                put("appLaunchMode", 1)
                put("accountLinked", true)
                put("userAge", 26)
                if (requestedZoneAddress != null) put("requestedZoneAddress", requestedZoneAddress)
            })
        }.toString()

        runAsync(call, block = {
            val url = "${baseUrl.trimEnd('/')}/v2/session?keyboardLayout=en-US&languageCode=en_US"
            post(url, bodyJson, commonHeaders(token))
        }, toJs = { body ->
            val json = JSONObject(body)
            val session = json.optJSONObject("session") ?: JSONObject()
            val result = JSObject()
            result.put("sessionId", session.optString("sessionId"))
            result.put("status", session.optInt("status"))
            result.put("serverIp", session.optJSONObject("sessionControlInfo")?.optString("ip") ?: "")
            result.put("zone", "prod")
            result.put("signalingServer", "")
            result.put("signalingUrl", "")
            result
        })
    }

    @PluginMethod
    fun pollSession(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val sessionId = call.getString("sessionId") ?: run { call.reject("Missing sessionId"); return }
        val baseUrl = call.getString("streamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!

        runAsync(call, block = {
            val url = "${baseUrl.trimEnd('/')}/v2/session/$sessionId"
            get(url, commonHeaders(token))
        }, toJs = { body ->
            val json = JSONObject(body)
            val session = json.optJSONObject("session") ?: JSONObject()
            val result = JSObject()
            result.put("sessionId", session.optString("sessionId"))
            result.put("status", session.optInt("status"))
            result.put("queuePosition", session.optInt("queuePosition", 0))
            result.put("serverIp", session.optJSONObject("sessionControlInfo")?.optString("ip") ?: "")
            result.put("zone", call.getString("zone", "prod")!!)
            result.put("signalingServer", "")
            result.put("signalingUrl", "")
            result
        })
    }

    @PluginMethod
    fun stopSession(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val sessionId = call.getString("sessionId") ?: run { call.reject("Missing sessionId"); return }
        val baseUrl = call.getString("streamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!

        runAsync(call, block = {
            val url = "${baseUrl.trimEnd('/')}/v2/session/$sessionId"
            val conn = java.net.URL(url).openConnection() as javax.net.ssl.HttpsURLConnection
            try {
                conn.requestMethod = "DELETE"
                conn.connectTimeout = 15_000
                conn.readTimeout = 15_000
                commonHeaders(token).forEach { (k, v) -> conn.setRequestProperty(k, v) }
                conn.responseCode // trigger the request
            } finally {
                conn.disconnect()
            }
        }, toJs = { JSObject() })
    }

    @PluginMethod
    fun getActiveSessions(call: PluginCall) {
        val token = call.getString("token") ?: run {
            call.resolve(JSObject().also { it.put("sessions", com.getcapacitor.JSArray()) })
            return
        }
        val baseUrl = call.getString("streamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!

        runAsync(call, block = {
            val url = "${baseUrl.trimEnd('/')}/v2/session"
            get(url, commonHeaders(token))
        }, toJs = { body ->
            val result = JSObject()
            result.put("sessions", body)
            result
        })
    }

    @PluginMethod
    fun claimSession(call: PluginCall) {
        call.reject("claimSession not yet implemented on Android")
    }

    @PluginMethod
    fun fetchSubscription(call: PluginCall) {
        call.reject("fetchSubscription not yet implemented on Android")
    }

    @PluginMethod
    fun getRegions(call: PluginCall) {
        // GFN does not expose a public regions API -- use the known zone list.
        // Zone address hostnames from GFN v2/serverInfo metaData (authenticated response).
        // These are passed as requestedZoneAddress in the session create body.
        // Verified from live API response 2026-02-27.
        val knownRegions = listOf(
            // US
            Pair("Northern California (USA)", "us-california-north.cloudmatchbeta.nvidiagrid.net"),
            Pair("Southern California (USA)", "us-california-south.cloudmatchbeta.nvidiagrid.net"),
            Pair("Oregon (USA)",              "us-oregon.cloudmatchbeta.nvidiagrid.net"),
            Pair("Arizona (USA)",             "us-arizona.cloudmatchbeta.nvidiagrid.net"),
            Pair("Texas (USA)",               "us-texas.cloudmatchbeta.nvidiagrid.net"),
            Pair("Illinois (USA)",            "us-illinois.cloudmatchbeta.nvidiagrid.net"),
            Pair("Florida (USA)",             "us-florida.cloudmatchbeta.nvidiagrid.net"),
            Pair("Georgia (USA)",             "us-georgia.cloudmatchbeta.nvidiagrid.net"),
            Pair("Virginia (USA)",            "us-virginia.cloudmatchbeta.nvidiagrid.net"),
            Pair("New Jersey (USA)",          "us-new-jersey.cloudmatchbeta.nvidiagrid.net"),
            // CA
            Pair("Quebec (Canada)",           "ca-quebec.cloudmatchbeta.nvidiagrid.net"),
            // EU
            Pair("United Kingdom 1",          "eu-united-kingdom-1.cloudmatchbeta.nvidiagrid.net"),
            Pair("United Kingdom 2",          "eu-united-kingdom-2.cloudmatchbeta.nvidiagrid.net"),
            Pair("Sweden",                    "eu-sweden.cloudmatchbeta.nvidiagrid.net"),
            Pair("Netherlands North",         "eu-netherlands-north.cloudmatchbeta.nvidiagrid.net"),
            Pair("Netherlands South",         "eu-netherlands-south.cloudmatchbeta.nvidiagrid.net"),
            Pair("Germany",                   "eu-germany.cloudmatchbeta.nvidiagrid.net"),
            Pair("France 1",                  "eu-france-1.cloudmatchbeta.nvidiagrid.net"),
            Pair("France 2",                  "eu-france-2.cloudmatchbeta.nvidiagrid.net"),
            Pair("Poland",                    "eu-poland.cloudmatchbeta.nvidiagrid.net"),
            Pair("Bulgaria",                  "eu-bulgaria.cloudmatchbeta.nvidiagrid.net"),
            // AP
            Pair("Japan",                     "ap-japan.cloudmatchbeta.nvidiagrid.net")
        )
        val arr = com.getcapacitor.JSArray()
        for ((name, url) in knownRegions) {
            arr.put(JSObject().also {
                it.put("name", name)
                it.put("url", url)
            })
        }
        val result = JSObject()
        result.put("regions", arr)
        call.resolve(result)
    }

    @PluginMethod
    fun resolveLaunchAppId(call: PluginCall) {
        call.reject("resolveLaunchAppId not yet implemented on Android")
    }

    // ──────────────────────────────────────────────────────────────
    // Signaling
    // ──────────────────────────────────────────────────────────────

    private var signalingManager: AndroidSignalingManager? = null

    @PluginMethod
    fun connectSignaling(call: PluginCall) {
        val sessionId = call.getString("sessionId") ?: run { call.reject("Missing sessionId"); return }
        val signalingServer = call.getString("signalingServer") ?: run { call.reject("Missing signalingServer"); return }
        val signalingUrl = call.getString("signalingUrl")

        scope.launch {
            try {
                signalingManager?.disconnect()
                signalingManager = AndroidSignalingManager(
                    signalingServer = signalingServer,
                    sessionId = sessionId,
                    signalingUrl = signalingUrl,
                    onEvent = { event -> notifyListeners("signalingEvent", event) }
                )
                signalingManager?.connect()
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message ?: "Signaling connection failed", e)
            }
        }
    }

    @PluginMethod
    fun disconnectSignaling(call: PluginCall) {
        signalingManager?.disconnect()
        signalingManager = null
        call.resolve()
    }

    @PluginMethod
    fun sendAnswer(call: PluginCall) {
        val sdp = call.getString("sdp") ?: run { call.reject("Missing sdp"); return }
        val nvstSdp = call.getString("nvstSdp")
        scope.launch {
            try {
                signalingManager?.sendAnswer(sdp, nvstSdp)
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message ?: "sendAnswer failed", e)
            }
        }
    }

    @PluginMethod
    fun sendIceCandidate(call: PluginCall) {
        val candidate = call.getString("candidate") ?: run { call.reject("Missing candidate"); return }
        val sdpMid = call.getString("sdpMid")
        val sdpMLineIndex = if (call.hasOption("sdpMLineIndex")) call.getInt("sdpMLineIndex") else null
        scope.launch {
            try {
                signalingManager?.sendIceCandidate(candidate, sdpMid, sdpMLineIndex)
                call.resolve()
            } catch (e: Exception) {
                call.reject(e.message ?: "sendIceCandidate failed", e)
            }
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Settings
    // ──────────────────────────────────────────────────────────────

    @PluginMethod
    fun getSettings(call: PluginCall) {
        val prefs = try {
            activity.getSharedPreferences("opennow_settings", android.content.Context.MODE_PRIVATE)
        } catch (e: Exception) {
            call.reject("getSettings failed: ${e.message}")
            return
        }
        val result = JSObject()
        result.put("resolution", prefs.getString("resolution", "1920x1080"))
        result.put("fps", prefs.getInt("fps", 60))
        result.put("maxBitrateMbps", prefs.getInt("maxBitrateMbps", 75))
        result.put("codec", prefs.getString("codec", "H264"))
        result.put("decoderPreference", prefs.getString("decoderPreference", "auto"))
        result.put("encoderPreference", prefs.getString("encoderPreference", "auto"))
        result.put("colorQuality", prefs.getString("colorQuality", "10bit_420"))
        result.put("region", prefs.getString("region", ""))
        result.put("clipboardPaste", prefs.getBoolean("clipboardPaste", false))
        result.put("mouseSensitivity", prefs.getFloat("mouseSensitivity", 1f).toDouble())
        result.put("shortcutToggleStats", "F3")
        result.put("shortcutTogglePointerLock", "F8")
        result.put("shortcutStopStream", "Ctrl+Shift+Q")
        result.put("shortcutToggleAntiAfk", "Ctrl+Shift+K")
        result.put("shortcutToggleMicrophone", "Ctrl+Shift+M")
        result.put("microphoneMode", prefs.getString("microphoneMode", "disabled"))
        result.put("microphoneDeviceId", "")
        result.put("hideStreamButtons", prefs.getBoolean("hideStreamButtons", false))
        result.put("sessionClockShowEveryMinutes", prefs.getInt("sessionClockShowEveryMinutes", 60))
        result.put("sessionClockShowDurationSeconds", prefs.getInt("sessionClockShowDurationSeconds", 30))
        result.put("windowWidth", 1400)
        result.put("windowHeight", 900)
        call.resolve(result)
    }

    @PluginMethod
    fun setSetting(call: PluginCall) {
        val key = call.getString("key") ?: run { call.reject("Missing key"); return }
        val prefs = activity.getSharedPreferences("opennow_settings", android.content.Context.MODE_PRIVATE).edit()

        when (key) {
            "fps", "maxBitrateMbps", "sessionClockShowEveryMinutes", "sessionClockShowDurationSeconds" ->
                prefs.putInt(key, call.getInt("value") ?: 0)
            "clipboardPaste", "hideStreamButtons" ->
                prefs.putBoolean(key, call.getBoolean("value") ?: false)
            "mouseSensitivity" ->
                prefs.putFloat(key, (call.getFloat("value") ?: 1f))
            else ->
                prefs.putString(key, call.getString("value") ?: "")
        }

        prefs.apply()
        call.resolve()
    }

    @PluginMethod
    fun resetSettings(call: PluginCall) {
        activity.getSharedPreferences("opennow_settings", android.content.Context.MODE_PRIVATE)
            .edit().clear().apply()
        getSettings(call)
    }

    @PluginMethod
    fun toggleFullscreen(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun setOrientation(call: PluginCall) {
        val mode = call.getString("mode", "sensor") ?: "sensor"
        activity.runOnUiThread {
            (activity as? MainActivity)?.applyOrientation(mode)
        }
        call.resolve()
    }

    // ──────────────────────────────────────────────────────────────
    // Region ping
    // ──────────────────────────────────────────────────────────────

    @PluginMethod
    fun pingRegions(call: PluginCall) {
        val urlsArray = call.getArray("urls") ?: run { call.reject("Missing urls"); return }
        val urls = mutableListOf<String>()
        for (i in 0 until urlsArray.length()) {
            urls.add(urlsArray.getString(i))
        }

        // Use a CountDownLatch + plain threads -- no async/await imports needed.
        // All pings fire in parallel, latch waits for all to finish.
        scope.launch {
            val latch = java.util.concurrent.CountDownLatch(urls.size)
            val resultsMap = java.util.concurrent.ConcurrentHashMap<String, Int>()

            for (url in urls) {
                Thread {
                    val start = System.currentTimeMillis()
                    try {
                        // Raw TCP connect to port 443 -- no TLS handshake, just measures
                        // network round trip time. Much closer to in-game UDP latency
                        // than a full HTTPS request which adds 200-300ms of TLS overhead.
                        val socket = java.net.Socket()
                        socket.connect(java.net.InetSocketAddress(url, 443), 5000)
                        socket.close()
                    } catch (e: Exception) {
                        // Connection refused or timeout -- elapsed still valid for timeout case
                    }
                    val elapsed = (System.currentTimeMillis() - start).toInt()
                    val ms = if (elapsed < 5 || elapsed >= 4900) -1 else elapsed
                    resultsMap[url] = ms
                    latch.countDown()
                }.start()
            }

            // Wait up to 6 seconds for all threads
            latch.await(6, java.util.concurrent.TimeUnit.SECONDS)

            val results = JSObject()
            for ((url, ms) in resultsMap) {
                results.put(url, ms.toString())
            }
            val out = JSObject()
            out.put("results", results)
            call.resolve(out)
        }
    }

    @PluginMethod
    fun showSessionConflictDialog(call: PluginCall) {
        activity.runOnUiThread {
            val builder = android.app.AlertDialog.Builder(activity)
            builder.setTitle("Active Session Detected")
            builder.setMessage("You have an active session running. Resume it or start a new one?")
            builder.setPositiveButton("Resume") { _, _ -> call.resolve(JSObject().also { it.put("choice", "resume") }) }
            builder.setNeutralButton("Start New") { _, _ -> call.resolve(JSObject().also { it.put("choice", "new") }) }
            builder.setNegativeButton("Cancel") { _, _ -> call.resolve(JSObject().also { it.put("choice", "cancel") }) }
            builder.setCancelable(false)
            builder.show()
        }
    }
}
