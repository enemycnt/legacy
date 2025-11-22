import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import theme from "@/shared/theme";
import { HistoryStep } from "./HistoryStep";
import type { SignedMessageEntry } from "../types";

const entries: SignedMessageEntry[] = [
  {
    id: "1",
    createdAt: "2023-01-01T00:00:00.000Z",
    message: "hello world",
    signature: "0xsig",
    isValid: true,
    signer: "0x123",
  },
  {
    id: "2",
    createdAt: "2023-01-02T00:00:00.000Z",
    message: "another",
    signature: "0xsig2",
    isValid: false,
    signer: "0x456",
  },
];

const renderWithChakra = (ui: ReactNode) => render(<ChakraProvider value={theme}>{ui}</ChakraProvider>);

describe("HistoryStep", () => {
  it("renders history entries", () => {
    renderWithChakra(<HistoryStep entries={entries} onClear={vi.fn()} />);

    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    expect(screen.getByText(/another/i)).toBeInTheDocument();
    expect(screen.getAllByText(/valid/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/invalid/i).length).toBeGreaterThan(0);
  });
});
