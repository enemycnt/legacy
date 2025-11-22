/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import type { PropsWithChildren } from "react";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useConnectWithOtp, useDynamicContext, useMfa } from "@dynamic-labs/sdk-react-core";

import type { AuthContextValue, AuthPhase, SignTypedDataParams } from "./types";
import {
  errorMessage,
  getWalletAddress,
  requiresMfaFromUser,
  requiresMfaFromVerifyResponse,
  type WalletLike,
} from "./utils";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultContext: AuthContextValue = {
  phase: "anonymous",
  address: null,
  isLoading: false,
  error: null,
  loginWithEmail: async () => {
    throw new Error("AuthProvider is missing");
  },
  verifyOtp: async () => {
    throw new Error("AuthProvider is missing");
  },
  completeMfa: async () => {
    throw new Error("AuthProvider is missing");
  },
  logout: async () => {
    throw new Error("AuthProvider is missing");
  },
  signMessage: async () => {
    throw new Error("AuthProvider is missing");
  },
  signTypedData: async () => {
    throw new Error("AuthProvider is missing");
  },
};

export function AuthProvider({ children }: PropsWithChildren) {
  const { primaryWallet, user, handleLogOut, sdkHasLoaded, setLogInWithEmail } = useDynamicContext();
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();
  const { authenticateDevice } = useMfa();

  const [phase, setPhase] = useState<AuthPhase>("anonymous");
  const [address, setAddress] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = getWalletAddress(primaryWallet);

  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress);
      if (requiresMfaFromUser(user)) {
        setPhase("mfa");
      } else {
        setPhase("ready");
      }
    }
  }, [user, walletAddress]);

  const loginWithEmail = useCallback(
    async (email: string) => {
      setIsLoading(true);
      setError(null);
      setPendingEmail(email);
      setPhase("email");

      try {
        setLogInWithEmail?.(true);
        await connectWithEmail(email);
        setPhase("otp");
      } catch (err) {
        setError(errorMessage(err));
        setPhase("anonymous");
      } finally {
        setIsLoading(false);
      }
    },
    [connectWithEmail, setLogInWithEmail],
  );

  const verifyOtp = useCallback(
    async (code: string) => {
      if (!pendingEmail) {
        setError("Enter your email first.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await verifyOneTimePassword(code);
        const shouldPromptMfa =
          requiresMfaFromVerifyResponse(response) || requiresMfaFromUser(user);

        if (shouldPromptMfa) {
          setPhase("mfa");
        } else if (walletAddress) {
          setPhase("ready");
        } else {
          // Wait for embedded wallet to be provisioned and synced.
          setPhase("otp");
        }
      } catch (err) {
        setError(errorMessage(err));
        setPhase("otp");
      } finally {
        setIsLoading(false);
      }
    },
    [pendingEmail, user, verifyOneTimePassword, walletAddress],
  );

  const completeMfa = useCallback(
    async (code: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authenticateDevice({ code });
        if (walletAddress) {
          setPhase("ready");
        } else {
          setPhase("mfa");
        }
      } catch (err) {
        setError(errorMessage(err));
        setPhase("mfa");
      } finally {
        setIsLoading(false);
      }
    },
    [authenticateDevice, walletAddress],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await handleLogOut?.();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPhase("anonymous");
      setAddress(null);
      setPendingEmail(null);
      setIsLoading(false);
    }
  }, [handleLogOut]);

  const signMessage = useCallback(
    async (message: string) => {
      const wallet = primaryWallet as WalletLike | null;
      if (!wallet) {
        throw new Error("Embedded wallet not ready");
      }

      const walletClient = await wallet.getWalletClient?.();
      if (walletClient?.signMessage) {
        return walletClient.signMessage({ message });
      }

      const connector = wallet.connector ?? wallet;
      if (typeof connector?.signMessage === "function") {
        return connector.signMessage(message);
      }

      if (typeof wallet.getSigner === "function") {
        const signer = await wallet.getSigner();
        if (signer?.signMessage) {
          return signer.signMessage(message);
        }
      }

      throw new Error("Embedded wallet not ready");
    },
    [primaryWallet],
  );

  const signTypedData = useCallback(
    async (typedData: SignTypedDataParams) => {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
        throw new Error("Embedded wallet not ready");
      }

      const walletClient = await primaryWallet.getWalletClient?.();
      if (!walletClient || typeof walletClient.signTypedData !== "function") {
        throw new Error("Typed data signing is not supported");
      }

      // walletClient comes from Dynamic and is expected to match Viem's WalletClient signature.
      return walletClient.signTypedData(typedData as never);
    },
    [primaryWallet],
  );

  useEffect(() => {
    if (!sdkHasLoaded) return;
    if (requiresMfaFromUser(user)) {
      setPhase("mfa");
      return;
    }
    if (user && walletAddress) {
      setPhase("ready");
    }
  }, [sdkHasLoaded, user, walletAddress]);

  const value = useMemo<AuthContextValue>(
    () => ({
      phase,
      address,
      isLoading,
      error,
      loginWithEmail,
      verifyOtp,
      completeMfa,
      logout,
      signMessage,
      signTypedData,
    }),
    [
      phase,
      address,
      isLoading,
      error,
      loginWithEmail,
      verifyOtp,
      completeMfa,
      logout,
      signMessage,
      signTypedData,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext) ?? defaultContext;
}
