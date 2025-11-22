export const errorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
};

export type WalletLike = {
  address?: string;
  connector?: {
    signMessage?: (message: string) => Promise<string> | string;
  };
  signMessage?: (message: string) => Promise<string> | string;
  getSigner?: () => Promise<{ signMessage?: (message: string) => Promise<string> | string }>;
  getWalletClient?: () => Promise<{ signMessage?: (args: { message: string }) => Promise<string> }>;
};

export const getWalletAddress = (wallet: unknown): string | undefined => {
  if (wallet && typeof wallet === "object" && "address" in wallet) {
    const value = (wallet as { address?: unknown }).address;
    return typeof value === "string" ? value : undefined;
  }
  return undefined;
};

export const requiresMfaFromScope = (scope: unknown) =>
  typeof scope === "string" && scope.includes("requiresAdditionalAuth");

export const requiresMfaFromUser = (maybeUser: unknown) =>
  requiresMfaFromScope((maybeUser as { scope?: unknown } | null | undefined)?.scope);

export const requiresMfaFromVerifyResponse = (response: unknown) => {
  if (!response || typeof response !== "object") return false;
  const mfaToken = (response as { mfaToken?: unknown }).mfaToken;
  if (typeof mfaToken === "string" && mfaToken.length > 0) return true;
  const scope = (response as { user?: { scope?: unknown } }).user?.scope;
  return requiresMfaFromScope(scope);
};
