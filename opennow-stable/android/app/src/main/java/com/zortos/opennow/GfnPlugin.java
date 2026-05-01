package com.zortos.opennow;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "OpenNowGfn")
public class GfnPlugin extends Plugin {
    private static final String DEFAULT_IDP_ID = "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg";
    private static final String DEFAULT_STREAMING_URL = "https://prod.cloudmatchbeta.nvidiagrid.net/";

    @PluginMethod
    public void initializeAuth(PluginCall call) {
        JSObject result = new JSObject();
        result.put("providers", defaultProviders());
        call.resolve(result);
    }

    @PluginMethod
    public void getLoginProviders(PluginCall call) {
        JSObject result = new JSObject();
        result.put("providers", defaultProviders());
        call.resolve(result);
    }

    @PluginMethod
    public void getAuthSession(PluginCall call) {
        JSObject refresh = new JSObject();
        refresh.put("attempted", false);
        refresh.put("forced", call.getBoolean("forceRefresh", false));
        refresh.put("outcome", "not_attempted");
        refresh.put("message", "No Android native auth session is available yet.");

        JSObject result = new JSObject();
        result.put("refresh", refresh);
        call.resolve(result);
    }

    @PluginMethod
    public void getSavedAccounts(PluginCall call) {
        JSObject result = new JSObject();
        result.put("accounts", new JSArray());
        call.resolve(result);
    }

    @PluginMethod
    public void getRegions(PluginCall call) {
        JSObject result = new JSObject();
        result.put("regions", new JSArray());
        call.resolve(result);
    }

    @PluginMethod
    public void login(PluginCall call) {
        call.reject("Android native login is not implemented yet.");
    }

    @PluginMethod
    public void logout(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void logoutAll(PluginCall call) {
        call.resolve();
    }

    @PluginMethod
    public void switchAccount(PluginCall call) {
        call.reject("Android native account switching is not implemented yet.");
    }

    @PluginMethod
    public void removeAccount(PluginCall call) {
        call.resolve();
    }

    private JSArray defaultProviders() {
        JSObject provider = new JSObject();
        provider.put("idpId", DEFAULT_IDP_ID);
        provider.put("code", "NVIDIA");
        provider.put("displayName", "NVIDIA");
        provider.put("streamingServiceUrl", DEFAULT_STREAMING_URL);
        provider.put("priority", 0);

        JSArray providers = new JSArray();
        providers.put(provider);
        return providers;
    }
}
