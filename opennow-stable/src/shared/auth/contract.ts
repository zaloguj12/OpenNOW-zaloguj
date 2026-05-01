import type {
  AuthLoginRequest,
  AuthSession,
  AuthSessionRequest,
  AuthSessionResult,
  LoginProvider,
  RegionsFetchRequest,
  SavedAccount,
  StreamRegion,
} from "@shared/gfn";

export interface AuthRuntimeContract {
  initialize(): Promise<void>;
  getProviders(): Promise<LoginProvider[]>;
  getRegions(input?: RegionsFetchRequest): Promise<StreamRegion[]>;
  login(input: AuthLoginRequest): Promise<AuthSession>;
  logout(): Promise<void>;
  logoutAll(): Promise<void>;
  getSavedAccounts(): Promise<SavedAccount[]>;
  switchAccount(userId: string): Promise<AuthSession>;
  removeAccount(userId: string): Promise<void>;
  getSession(input?: AuthSessionRequest): Promise<AuthSessionResult>;
}

export type AuthRuntimeMethod = keyof AuthRuntimeContract;
