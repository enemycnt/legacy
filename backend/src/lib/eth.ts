import { type Hex, getAddress, recoverMessageAddress } from "viem";

export class SignatureRecoveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignatureRecoveryError";
  }
}

const SIGNATURE_REGEX = /^0x[0-9a-fA-F]{130}$/;

export const isSignatureLikelyValid = (signature: string): boolean =>
  SIGNATURE_REGEX.test(signature);

export async function recoverSignerAddress(
  message: string,
  signature: string
): Promise<string> {
  if (!isSignatureLikelyValid(signature)) {
    throw new SignatureRecoveryError("Malformed signature");
  }

  try {
    const address = await recoverMessageAddress({
      message,
      signature: signature as Hex,
    });

    return getAddress(address);
  } catch (_err) {
    throw new SignatureRecoveryError("Failed to recover signer");
  }
}
