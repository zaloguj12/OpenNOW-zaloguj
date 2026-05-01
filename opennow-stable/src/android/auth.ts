import type {
  AuthLoginRequest,
  AuthRefreshStatus,
  AuthSession,
  AuthSessionRequest,
  AuthSessionResult,
  LoginProvider,
  RegionsFetchRequest,
  SavedAccount,
  StreamRegion,
} from "@shared/gfn";
import type { AuthRuntimeContract } from "@shared/auth/contract";

import { callNative } from "./capacitorBridge";

const DEFAULT_PROVIDER: LoginProvider = {
  idpId: "PDiAhv2kJTFeQ7WOPqiQ2tRZ7lGhR2X11dXvM4TZSxg",
  code: "NVIDIA",
  displayName: "NVIDIA",
  streamingServiceUrl: "https://prod.cloudmatchbeta.nvidiagrid.net/",
  priority: 0,
};

const NOT_ATTEMPTED_REFRESH: AuthRefreshStatus = {
  attempted: false,
  forced: false,
  outcome: "not_attempted",
  message: "Android auth runtime has no saved session.",
};

export class AndroidAuthRuntime implements AuthRuntimeContract {
  private session: AuthSession | null = null;
  private providers: LoginProvider[] = [DEFAULT_PROVIDER];

  async initialize(): Promise<void> {
    const restored = await callNative<{ session?: AuthSession | null; providers?: LoginProvider[] }>("initializeAuth");
    if (Array.isArray(restored?.providers) && restored.providers.length > 0) {
      this.providers = restored.providers;
    }
    this.session = restored?.session ?? this.loadStoredSession();
  }

  async getProviders(): Promise<LoginProvider[]> {
    const result = await callNative<{ providers?: LoginProvider[] }>("getLoginProviders");
    if (Array.isArray(result?.providers) && result.providers.length > 0) {
      this.providers = result.providers;
    }
    return this.providers;
  }

  async getRegions(input: RegionsFetchRequest = {}): Promise<StreamRegion[]> {
    const result = await callNative<{ regions?: StreamRegion[] }>("getRegions", input);
    return Array.isArray(result?.regions) ? result.regions : [];
  }

  async login(input: AuthLoginRequest): Promise<AuthSession> {
    const result = await callNative<{ session?: AuthSession }>("login", input);
    if (!result?.session) {
      throw new Error("Android native login is not available yet.");
    }

    this.session = result.session;
    this.storeSession(result.session);
    return result.session;
  }

  async logout(): Promise<void> {
    await callNative("logout");
    this.session = null;
    this.storeSession(null);
  }

  async logoutAll(): Promise<void> {
    await callNative("logoutAll");
    this.session = null;
    this.storeSession(null);
  }

  async getSavedAccounts(): Promise<SavedAccount[]> {
    const result = await callNative<{ accounts?: SavedAccount[] }>("getSavedAccounts");
    if (Array.isArray(result?.accounts)) {
      return result.accounts;
    }

    return this.session
      ? [{
          userId: this.session.user.userId,
          displayName: this.session.user.displayName,
          email: this.session.user.email,
          avatarUrl: this.session.user.avatarUrl,
          membershipTier: this.session.user.membershipTier,
          providerCode: this.session.provider.code,
        }]
      : [];
  }

  async switchAccount(userId: string): Promise<AuthSession> {
    const result = await callNative<{ session?: AuthSession }>("switchAccount", { userId });
    if (!result?.session) {
      throw new Error("Android account switching is not available yet.");
    }
    this.session = result.session;
    this.storeSession(result.session);
    return result.session;
  }

  async removeAccount(userId: string): Promise<void> {
    await callNative("removeAccount", { userId });
    if (this.session?.user.userId === userId) {
      this.session = null;
      this.storeSession(null);
    }
  }

  async getSession(input: AuthSessionRequest = {}): Promise<AuthSessionResult> {
    const result = await callNative<AuthSessionResult>("getAuthSession", input);
    if (result) {
      this.session = result.session;
      this.storeSession(result.session);
      return result;
    }

    return {
      session: this.session,
      refresh: {
        ...NOT_ATTEMPTED_REFRESH,
        forced: Boolean(input.forceRefresh),
        message: this.session
          ? "Android auth session restored from local runtime cache."
          : NOT_ATTEMPTED_REFRESH.message,
      },
    };
  }

  private loadStoredSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem("opennow.android.authSession");
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  }

  private storeSession(session: AuthSession | null): void {
    try {
      if (session) {
        localStorage.setItem("opennow.android.authSession", JSON.stringify(session));
      } else {
        localStorage.removeItem("opennow.android.authSession");
      }
    } catch {
      // Ignore storage failures; native storage will be the durable source.
    }
  }
}
