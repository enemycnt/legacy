import { describe, expect, it } from "vitest";
import { privateKeyToAccount } from "viem/accounts";
import {
  recoverSignerAddress,
  SignatureRecoveryError,
} from "../src/lib/eth";
import { verifySignature } from "../src/services/signatureService";

const privateKey =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const account = privateKeyToAccount(privateKey);
const message = "Hello from Web3";

describe("eth helper", () => {
  it("recovers the signer address from a valid signature", async () => {
    const signature = await account.signMessage({ message });
    const recovered = await recoverSignerAddress(message, signature);

    expect(recovered).toBe(account.address);
  });

  it("throws a SignatureRecoveryError on malformed signature input", async () => {
    await expect(
      recoverSignerAddress(message, "0x1234")
    ).rejects.toBeInstanceOf(SignatureRecoveryError);
  });
});

describe("signature service", () => {
  it("marks valid signatures as valid", async () => {
    const signature = await account.signMessage({ message });
    const result = await verifySignature(message, signature);

    expect(result).toEqual({
      isValid: true,
      signer: account.address,
      originalMessage: message,
    });
  });

  it("returns invalid when the signature is incorrect", async () => {
    const signature = await account.signMessage({ message });
    const tampered =
      signature.slice(0, -1) + (signature.endsWith("a") ? "b" : "a");

    const result = await verifySignature(message, tampered);

    expect(result.isValid).toBe(false);
    expect(result.signer).toBeNull();
    expect(result.originalMessage).toBe(message);
  });
});
