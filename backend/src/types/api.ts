export interface SignatureVerifyRequest {
  message: string;
  signature: string;
}

export interface SignatureVerifyResponse {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
}
