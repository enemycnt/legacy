export type AuthPhase = "anonymous" | "email" | "otp" | "mfa" | "ready";

export type SignTypedDataParams = {
  domain: Record<string, unknown>;
  types: Record<string, Array<{ name: string; type: string }>>;
  primaryType: string;
  message: Record<string, unknown>;
};

export interface AuthContextValue {
  phase: AuthPhase;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  loginWithEmail: (email: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  completeMfa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  signTypedData: (typedData: SignTypedDataParams) => Promise<string>;
}
