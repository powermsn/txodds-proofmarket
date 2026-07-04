import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";

describe("ProofMarket console", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the replay-first dispute console and settles the late-goal market", () => {
    render(<App />);

    expect(screen.getByText("Replay demo mode")).toBeInTheDocument();
    expect(screen.getByText("Simulation only. No real-money wagering.")).toBeInTheDocument();
    expect(screen.getByText("Live TxLINE: not configured")).toBeInTheDocument();
    expect(screen.getByText("Replay active")).toBeInTheDocument();
    expect(screen.getByText("Fixture source: replay")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run settlement replay/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Late goal dispute" })).toBeInTheDocument();
    expect(screen.getByText("Frozen")).toBeInTheDocument();
    expect(screen.getByText("PREVIOUS RECEIPT")).toBeInTheDocument();
    expect(screen.getByText("TXLINE PROOF VERIFIED")).toBeInTheDocument();
    expect(screen.getByText("FINAL SETTLEMENT")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /run settlement replay/i }));

    expect(screen.getByText("TxLINE proof requested")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(450));
    expect(screen.getByText("Receipt verified")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(450));
    expect(screen.getByText("Diff explained")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(450));
    expect(screen.getAllByText("Settlement executed").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Replay settlement executed" })).toBeInTheDocument();
    expect(screen.getByText("proof requested")).toBeInTheDocument();
    expect(screen.getByText("receipt verified")).toBeInTheDocument();
    expect(screen.getByText("diff explained")).toBeInTheDocument();
    expect(screen.getByText("settlement executed")).toBeInTheDocument();
    expect(screen.getAllByText("replay-proof-late-goal-final").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1-1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2-1").length).toBeGreaterThan(0);
    expect(screen.getByText("Over 2.5 wins +100 simulated credits")).toBeInTheDocument();
    expect(screen.getByText("No shares -100 simulated credits")).toBeInTheDocument();
    expect(screen.getByText("Proof Receipt Inspector")).toBeInTheDocument();
    expect(screen.getByText("merkleRoot")).toBeInTheDocument();
    expect(screen.getByText("merkleProof")).toBeInTheDocument();
    expect(screen.getByText("slot")).toBeInTheDocument();
    expect(screen.getByText("receipt summary")).toBeInTheDocument();
  });
});
