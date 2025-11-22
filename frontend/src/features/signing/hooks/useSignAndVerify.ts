import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/useAuth";
import type { AddHistoryEntry } from "@/features/history/hooks/useSignatureHistory";
import { verifySignature } from "../api/verifySignature";
import type { VerifySignatureRequest, VerifySignatureResponse } from "../types";

interface UseSignAndVerifyOptions {
  onVerified?: (result: VerifySignatureResponse, signature: string, message: string) => void;
  addHistoryEntry?: AddHistoryEntry;
}

export function useSignAndVerify(options?: UseSignAndVerifyOptions) {
  const { signMessage, address } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: VerifySignatureRequest) => verifySignature(payload),
  });

  const signAndVerify = useCallback(
    async (message: string) => {
      const signature = await signMessage(message);
      const result = await mutation.mutateAsync({ message, signature });

      options?.addHistoryEntry?.({
        message,
        signature,
        isValid: result.isValid,
        signer: result.signer ?? address ?? "",
      });
      options?.onVerified?.(result, signature, message);

      return { signature, result };
    },
    [address, mutation, options, signMessage],
  );

  return { signAndVerify, mutation };
}
