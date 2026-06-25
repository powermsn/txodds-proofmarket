import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("ProofMarket console", () => {
  it("shows the replay-first dispute console and settles the late-goal market", () => {
    render(<App />);

    expect(screen.getByText("Replay demo mode")).toBeInTheDocument();
    expect(screen.getByText("Simulation only. No real-money wagering.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replay late-goal settlement/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Late goal dispute" })).toBeInTheDocument();
    expect(screen.getByText("PREVIOUS RECEIPT")).toBeInTheDocument();
    expect(screen.getByText("TXLINE PROOF VERIFIED")).toBeInTheDocument();
    expect(screen.getByText("FINAL SETTLEMENT")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /replay late-goal settlement/i }));

    expect(screen.getByRole("heading", { name: "Replay settlement executed" })).toBeInTheDocument();
    expect(screen.getByText("proof requested")).toBeInTheDocument();
    expect(screen.getByText("previous receipt")).toBeInTheDocument();
    expect(screen.getByText("proof verified")).toBeInTheDocument();
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
