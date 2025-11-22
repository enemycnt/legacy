import { beforeEach, describe, expect, it } from "vitest";

import { SIGNATURE_HISTORY_STORAGE_KEY, loadHistory, saveHistory } from "./storage";
import type { SignedMessageEntry } from "./types";

const sampleEntry: SignedMessageEntry = {
  id: "1",
  createdAt: "2023-01-01T00:00:00.000Z",
  message: "hello world",
  signature: "0xsig",
  isValid: true,
  signer: "0x1234",
};

describe("history storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when nothing stored", () => {
    expect(loadHistory()).toEqual([]);
  });

  it("persists and loads entries", () => {
    saveHistory([sampleEntry]);
    const loaded = loadHistory();
    expect(loaded).toEqual([sampleEntry]);
  });

  it("ignores malformed data", () => {
    localStorage.setItem(SIGNATURE_HISTORY_STORAGE_KEY, JSON.stringify([{ foo: "bar" }]));
    expect(loadHistory()).toEqual([]);
  });
});
