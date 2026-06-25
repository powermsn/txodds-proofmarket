import { describe, expect, it } from "vitest";
import {
  getReceiptDiff,
  getReplayScenarios,
  runSettlementDemo,
} from "../src/domain/settlementEngine";

describe("ProofMarket replay settlement engine", () => {
  it("settles the disputed late-goal market with a paused trace and replay proof receipt", () => {
    const result = runSettlementDemo("late-goal-dispute");

    expect(result.mode).toBe("replay");
    expect(result.market.status).toBe("settled");
    expect(result.market.settlementState).toBe("settled_after_correction");
    expect(result.receipt.verificationMode).toBe("replay_fixture");
    expect(result.accounting.find((entry) => entry.account === "Yes shares")?.delta).toBe(
      "+100 simulated credits",
    );
    expect(result.trace.map((step) => step.label)).toEqual([
      "Market created",
      "Odds shock detected",
      "Match appeared final",
      "Settlement paused",
      "Updated proof requested",
      "Proof verified",
      "Replay settlement executed",
    ]);
  });

  it("shows a receipt diff when a late goal changes the disputed score", () => {
    const scenarios = getReplayScenarios();
    const scenario = scenarios.find((item) => item.id === "late-goal-dispute");

    expect(scenario).toBeDefined();
    const diff = getReceiptDiff(scenario!.previousReceipt, scenario!.finalReceipt);

    expect(diff).toEqual([
      {
        field: "statValue",
        before: "1-1",
        after: "2-1",
        explanation: "Score changed after stoppage-time goal confirmation.",
      },
      {
        field: "receiptId",
        before: "replay-proof-late-goal-pre",
        after: "replay-proof-late-goal-final",
        explanation: "New replay receipt supersedes the pre-correction receipt.",
      },
    ]);
  });

  it("ships the four required replay scenarios", () => {
    expect(getReplayScenarios().map((scenario) => scenario.id)).toEqual([
      "normal-full-time",
      "late-goal-dispute",
      "score-correction",
      "suspended-match",
    ]);
  });
});
