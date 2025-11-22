import type { SignedMessageEntry } from "./types";

const STORAGE_KEY = "web3-signer:history";

export function loadHistory(): SignedMessageEntry[] {
  if (typeof localStorage === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidEntry);
  } catch (err) {
    console.error("Failed to load signature history", err);
    return [];
  }
}

export function saveHistory(entries: SignedMessageEntry[]) {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error("Failed to persist signature history", err);
  }
}

function isValidEntry(entry: unknown): entry is SignedMessageEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    typeof (entry as Partial<SignedMessageEntry>).id === "string" &&
    typeof (entry as Partial<SignedMessageEntry>).createdAt === "string" &&
    typeof (entry as Partial<SignedMessageEntry>).message === "string" &&
    typeof (entry as Partial<SignedMessageEntry>).signature === "string" &&
    typeof (entry as Partial<SignedMessageEntry>).signer === "string" &&
    typeof (entry as Partial<SignedMessageEntry>).isValid === "boolean"
  );
}

export { STORAGE_KEY as SIGNATURE_HISTORY_STORAGE_KEY };
