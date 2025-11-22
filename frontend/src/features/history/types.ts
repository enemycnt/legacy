export interface SignedMessageEntry {
  id: string;
  createdAt: string;
  message: string;
  signature: string;
  isValid: boolean;
  signer: string;
}
