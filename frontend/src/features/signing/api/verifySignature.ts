import type { VerifySignatureRequest, VerifySignatureResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL;

export async function verifySignature(body: VerifySignatureRequest): Promise<VerifySignatureResponse> {
  if (!API_BASE) {
    throw new Error("API URL is not configured. Set VITE_API_URL in your env.");
  }

  const response = await fetch(`${API_BASE}/verify-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to verify signature");
  }

  return (await response.json()) as VerifySignatureResponse;
}
