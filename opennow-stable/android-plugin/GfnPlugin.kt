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

    private val http = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .followRedirects(true)
        .build()

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
        val builder = Request.Builder().url(url)
        headers.forEach { (k, v) -> builder.header(k, v) }
        val response = http.newCall(builder.build()).execute()
        return response.body?.string() ?: "{}"
    }

    private fun post(url: String, body: String, headers: Map<String, String>): String {
        val mediaType = "application/json".toMediaType()
        val builder = Request.Builder()
            .url(url)
            .post(body.toRequestBody(mediaType))
        headers.forEach { (k, v) -> builder.header(k, v) }
        val response = http.newCall(builder.build()).execute()
        return response.body?.string() ?: "{}"
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
            val saved = loadSavedSession()

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
        val body = FormBody.Builder()
            .add("grant_type", "refresh_token")
            .add("client_id", "ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ")
            .add("refresh_token", refreshToken)
            .build()

        val request = Request.Builder()
            .url("https://login.nvidia.com/token")
            .post(body)
            .header("User-Agent", ANDROID_USER_AGENT)
            .build()

        val responseBody = http.newCall(request).execute().body?.string() ?: throw Exception("Empty token response")
        val json = JSONObject(responseBody)

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
            val url = "https://pcs.geforcenow.com/v1/serviceUrls"
            val req = Request.Builder()
                .url(url)
                .header("User-Agent", ANDROID_USER_AGENT)
                .header("Accept", "application/json")
                .build()
            val body = http.newCall(req).execute().body?.string() ?: "{}"
            JSONObject(body)
        }, toJs = { json ->
            val result = JSObject()
            try {
                val endpoints = json
                    .optJSONObject("gfnServiceInfo")
                    ?.optJSONArray("gfnServiceEndpoints")

                val providers = com.getcapacitor.JSArray()
                if (endpoints != null) {
                    for (i in 0 until endpoints.length()) {
                        val ep = endpoints.getJSONObject(i)
                        val provider = JSObject()
                        provider.put("idpId", ep.optString("idpId"))
                        provider.put("code", ep.optString("loginProviderCode"))
                        provider.put("displayName", ep.optString("loginProviderDisplayName"))
                        provider.put("streamingServiceUrl", ep.optString("streamingServiceUrl"))
                        provider.put("priority", ep.optInt("loginProviderPriority", 0))
                        providers.put(provider)
                    }
                }
                result.put("providers", providers)
            } catch (e: Exception) {
                result.put("providers", com.getcapacitor.JSArray())
            }
            result
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
    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    fun login(call: PluginCall) {
        // Keep call alive across the OAuth redirect round-trip
        call.setKeepAlive(true)

        val providerIdpId = call.getString("providerIdpId", "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg")!!

        val verifier = generateCodeVerifier()
        val challenge = generateCodeChallenge(verifier)
        val nonce = java.util.UUID.randomUUID().toString().replace("-", "")

        pendingLoginCall = call
        pendingCodeVerifier = verifier
        pendingProviderIdpId = providerIdpId

        val params = mapOf(
            "response_type" to "code",
            "scope" to "openid consent email tk_client age",
            "client_id" to "ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ",
            "redirect_uri" to "opennow://auth",
            "ui_locales" to "en_US",
            "nonce" to nonce,
            "prompt" to "select_account",
            "idp_id" to providerIdpId,
            "code_challenge" to challenge,
            "code_challenge_method" to "S256",
        )

        val query = params.entries.joinToString("&") { (k, v) ->
            "${Uri.encode(k)}=${Uri.encode(v)}"
        }
        val authUrl = "https://login.nvidia.com/authorize?$query"

        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(authUrl))
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        activity.startActivity(intent)

        // The call will be resolved by handleOAuthRedirect() when the browser comes back
    }

    /**
     * Called by MainActivity.onNewIntent() when the system browser redirects back to
     * opennow://auth?code=...
     *
     * Do NOT call this from JS -- it is an internal entry point from the Activity.
     */
    fun handleOAuthRedirect(uri: Uri) {
        val call = pendingLoginCall ?: return
        val verifier = pendingCodeVerifier ?: return
        val providerIdpId = pendingProviderIdpId ?: return

        pendingLoginCall = null
        pendingCodeVerifier = null
        pendingProviderIdpId = null

        val code = uri.getQueryParameter("code")
        val error = uri.getQueryParameter("error")

        if (error != null || code == null) {
            call.reject("OAuth error: ${uri.getQueryParameter("error_description") ?: error ?: "no code returned"}")
            return
        }

        scope.launch {
            try {
                // Exchange authorization code for tokens
                val tokens = exchangeCodeForTokens(code, verifier)

                // Fetch provider info so we can include it in the session
                val providerJson = fetchProviderInfo(providerIdpId)

                saveTokens(tokens, providerJson)

                val session = buildSessionObject(tokens, providerJson)
                val result = JSObject()
                result.put("session", session)
                call.resolve(result)
            } catch (e: Exception) {
                call.reject("Token exchange failed: ${e.message}", e)
            }
        }
    }

    private fun exchangeCodeForTokens(code: String, verifier: String): JSONObject {
        val body = FormBody.Builder()
            .add("grant_type", "authorization_code")
            .add("client_id", "ZU7sPN-miLujMD95LfOQ453IB0AtjM8sMyvgJ9wCXEQ")
            .add("code", code)
            .add("redirect_uri", "opennow://auth")
            .add("code_verifier", verifier)
            .build()

        val request = Request.Builder()
            .url("https://login.nvidia.com/token")
            .post(body)
            .header("User-Agent", ANDROID_USER_AGENT)
            .build()

        val responseBody = http.newCall(request).execute().body?.string()
            ?: throw Exception("Empty token response")
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
    }

    private fun fetchProviderInfo(providerIdpId: String): JSONObject {
        return try {
            val url = "https://pcs.geforcenow.com/v1/serviceUrls"
            val req = Request.Builder()
                .url(url)
                .header("User-Agent", ANDROID_USER_AGENT)
                .header("Accept", "application/json")
                .build()
            val body = http.newCall(req).execute().body?.string() ?: "{}"
            val json = JSONObject(body)
            val endpoints = json.optJSONObject("gfnServiceInfo")?.optJSONArray("gfnServiceEndpoints")
            if (endpoints != null) {
                for (i in 0 until endpoints.length()) {
                    val ep = endpoints.getJSONObject(i)
                    if (ep.optString("idpId") == providerIdpId) {
                        return JSONObject().apply {
                            put("idpId", ep.optString("idpId"))
                            put("code", ep.optString("loginProviderCode"))
                            put("displayName", ep.optString("loginProviderDisplayName"))
                            put("streamingServiceUrl", ep.optString("streamingServiceUrl"))
                            put("priority", ep.optInt("loginProviderPriority", 0))
                        }
                    }
                }
            }
            // Fallback: return a minimal provider object
            JSONObject().apply {
                put("idpId", providerIdpId)
                put("code", "unknown")
                put("displayName", "NVIDIA")
                put("streamingServiceUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")
                put("priority", 0)
            }
        } catch (e: Exception) {
            JSONObject().apply {
                put("idpId", providerIdpId)
                put("code", "unknown")
                put("displayName", "NVIDIA")
                put("streamingServiceUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")
                put("priority", 0)
            }
        }
    }

    @PluginMethod
    fun logout(call: PluginCall) {
        clearSavedSession()
        pendingLoginCall?.reject("Logged out")
        pendingLoginCall = null
        pendingCodeVerifier = null
        pendingProviderIdpId = null
        call.resolve()
    }

    // ──────────────────────────────────────────────────────────────
    // Games
    // ──────────────────────────────────────────────────────────────

    @PluginMethod
    fun fetchPublicGames(call: PluginCall) {
        runAsync(call, block = {
            val url = "https://static.nvidiagrid.net/supported-public-game-list/gfnpc-supported-games.json"
            val req = Request.Builder().url(url)
                .header("User-Agent", ANDROID_USER_AGENT)
                .header("Accept", "application/json")
                .build()
            http.newCall(req).execute().body?.string() ?: "[]"
        }, toJs = { body ->
            val result = JSObject()
            result.put("games", body)
            result
        })
    }

    @PluginMethod
    fun fetchMainGames(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val baseUrl = call.getString("providerStreamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!
        runAsync(call, block = {
            val url = "${baseUrl.trimEnd('/')}/v2/games?cmsId=gfn"
            get(url, commonHeaders(token))
        }, toJs = { body ->
            val result = JSObject()
            result.put("games", body)
            result
        })
    }

    @PluginMethod
    fun fetchLibraryGames(call: PluginCall) {
        val token = call.getString("token") ?: run { call.reject("Missing token"); return }
        val baseUrl = call.getString("providerStreamingBaseUrl", "https://prod.cloudmatchbeta.nvidiagrid.net/")!!
        runAsync(call, block = {
            val url = "${baseUrl.trimEnd('/')}/v2/library"
            get(url, commonHeaders(token))
        }, toJs = { body ->
            val result = JSObject()
            result.put("games", body)
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
            val req = Request.Builder()
                .url(url)
                .delete()
            commonHeaders(token).forEach { (k, v) -> req.header(k, v) }
            http.newCall(req.build()).execute()
            Unit
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
        val result = JSObject()
        result.put("regions", com.getcapacitor.JSArray())
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
        val prefs = activity.getSharedPreferences("opennow_settings", android.content.Context.MODE_PRIVATE)
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
