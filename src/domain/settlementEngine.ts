import matchesFixture from "../../fixtures/replay/matches.json";
import proofBundle from "../../fixtures/replay/proofs.json";
import type {
  ReceiptDiffEntry,
  ReplayScenario,
  SettlementResult,
  TxlineMatch,
  TxlineProofReceipt,
} from "./types";

interface ProofBundle {
  scenarios: Array<Omit<ReplayScenario, "match">>;
}

const matches = matchesFixture as TxlineMatch[];
const scenarios = (proofBundle as ProofBundle).scenarios.map((scenario) => {
  const match = matches.find((item) => item.matchId === scenario.matchId);

  if (!match) {
    throw new Error(`Replay fixture missing match ${scenario.matchId}`);
  }

  return { ...scenario, match };
});

export function getReplayScenarios(): ReplayScenario[] {
  return scenarios;
}

export function runSettlementDemo(scenarioId = "late-goal-dispute"): SettlementResult {
  const scenario = scenarios.find((item) => item.id === scenarioId);

  if (!scenario) {
    throw new Error(`Unknown replay scenario: ${scenarioId}`);
  }

  return {
    mode: "replay",
    scenario,
    match: scenario.match,
    market: scenario.market,
    receipt: scenario.finalReceipt,
    receiptDiff: getReceiptDiff(scenario.previousReceipt, scenario.finalReceipt),
    trace: scenario.trace,
    accounting: scenario.accounting,
  };
}

export function getReceiptDiff(
  previousReceipt: TxlineProofReceipt | null,
  finalReceipt: TxlineProofReceipt,
): ReceiptDiffEntry[] {
  if (!previousReceipt) {
    return [];
  }

  const diff: ReceiptDiffEntry[] = [];

  if (previousReceipt.statValue !== finalReceipt.statValue) {
    diff.push({
      field: "statValue",
      before: previousReceipt.statValue,
      after: finalReceipt.statValue,
      explanation: getStatValueExplanation(previousReceipt, finalReceipt),
    });
  }

  if (previousReceipt.receiptId !== finalReceipt.receiptId) {
    diff.push({
      field: "receiptId",
      before: previousReceipt.receiptId,
      after: finalReceipt.receiptId,
      explanation: "New replay receipt supersedes the pre-correction receipt.",
    });
  }

  return diff;
}

function getStatValueExplanation(
  previousReceipt: TxlineProofReceipt,
  finalReceipt: TxlineProofReceipt,
) {
  if (previousReceipt.matchId === "pm-late-goal-002" && finalReceipt.statValue === "2-1") {
    return "Score changed after stoppage-time goal confirmation.";
  }

  return "Verified stat changed between receipts.";
}
