import { recoverSignerAddress, SignatureRecoveryError, isSignatureLikelyValid } from "../lib/eth";

export interface SignatureVerificationResult {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
}

export async function verifySignature(
  message: string,
  signature: string
): Promise<SignatureVerificationResult> {
  if (!isSignatureLikelyValid(signature)) {
    return {
      isValid: false,
      signer: null,
      originalMessage: message,
    };
  }

  try {
    const signer = await recoverSignerAddress(message, signature);

    return {
      isValid: true,
      signer,
      originalMessage: message,
    };
  } catch (error) {
    if (error instanceof SignatureRecoveryError) {
      return {
        isValid: false,
        signer: null,
        originalMessage: message,
      };
    }

    throw error;
  }
}
