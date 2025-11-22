import { useCallback, useState } from "react";

import { createId } from "@/shared/lib/ids";
import { loadHistory, saveHistory } from "../storage";
import type { SignedMessageEntry } from "../types";

export interface AddEntryInput {
  message: string;
  signature: string;
  isValid: boolean;
  signer: string;
}

export type AddHistoryEntry = (input: AddEntryInput) => void;

export function useSignatureHistory() {
  const [history, setHistory] = useState<SignedMessageEntry[]>(() => loadHistory());

  const addEntry = useCallback<AddHistoryEntry>((input) => {
    const entry: SignedMessageEntry = {
      id: createId(),
      createdAt: new Date().toISOString(),
      message: input.message,
      signature: input.signature,
      isValid: input.isValid,
      signer: input.signer,
    };

    setHistory((prev) => {
      const next = [entry, ...prev];
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
