import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  CheckCircle2,
  CircleDollarSign,
  FileJson,
  GitCompareArrows,
  Play,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getReceiptDiff,
  getReplayScenarios,
  runSettlementDemo,
} from "./domain/settlementEngine";
import type { ReplayScenario, SettlementResult } from "./domain/types";
import "./styles.css";

const scenarios = getReplayScenarios();
type ReplayStage = "frozen" | "requested" | "verified" | "diff" | "executed";

const replayStages: Array<{
  key: ReplayStage;
  label: string;
  compactLabel: string;
  detail: string;
}> = [
  {
    key: "frozen",
    label: "Frozen",
    compactLabel: "frozen",
    detail: "Market settlement is locked while the previous receipt is reviewed.",
  },
  {
    key: "requested",
    label: "TxLINE proof requested",
    compactLabel: "proof requested",
    detail: "ProofMarket requests the active score receipt from the TxLINE evidence path.",
  },
  {
    key: "verified",
    label: "Receipt verified",
    compactLabel: "receipt verified",
    detail: "The replay receipt source, slot, and proof fields are visible for inspection.",
  },
  {
    key: "diff",
    label: "Diff explained",
    compactLabel: "diff explained",
    detail: "The previous 1-1 receipt is compared with the corrected 2-1 receipt.",
  },
  {
    key: "executed",
    label: "Settlement executed",
    compactLabel: "settlement executed",
    detail: "The corrected simulated ledger is produced from the verified receipt.",
  },
];

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState("late-goal-dispute");
  const [settlementResult, setSettlementResult] = useState<SettlementResult | null>(null);
  const [replayStage, setReplayStage] = useState<ReplayStage>("frozen");
  const timers = useRef<Array<number>>([]);
  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0],
    [selectedScenarioId],
  );
  const visibleReceipt =
    settlementResult?.receipt ?? selectedScenario.previousReceipt ?? selectedScenario.finalReceipt;
  const visibleDiff =
    settlementResult?.receiptDiff ??
    getReceiptDiff(selectedScenario.previousReceipt, selectedScenario.finalReceipt);
  const receiptSummary = getReceiptSummary(visibleReceipt);
  const previousScore = selectedScenario.previousReceipt?.statValue ?? "policy check";
  const finalScore = selectedScenario.finalReceipt.statValue;
  const outcomeHighlights = getOutcomeHighlights(selectedScenario, settlementResult);
  const activeStage = replayStages.find((stage) => stage.key === replayStage) ?? replayStages[0];
  const currentStageIndex = replayStages.findIndex((stage) => stage.key === replayStage);

  useEffect(() => {
    return () => clearReplayTimers(timers.current);
  }, []);

  function selectScenario(scenario: ReplayScenario) {
    clearReplayTimers(timers.current);
    setSelectedScenarioId(scenario.id);
    setSettlementResult(null);
    setReplayStage("frozen");
  }

  function settleDisputedMarket() {
    clearReplayTimers(timers.current);
    setSettlementResult(null);
    setReplayStage("requested");
    timers.current = [
      window.setTimeout(() => setReplayStage("verified"), 400),
      window.setTimeout(() => setReplayStage("diff"), 800),
      window.setTimeout(() => {
        setReplayStage("executed");
        setSettlementResult(runSettlementDemo(selectedScenario.id));
      }, 1200),
    ];
  }

  return (
    <main className="app-shell">
      <section className="evidence-strip" aria-label="TxLINE evidence strip">
        <span>
          <ShieldCheck size={14} aria-hidden="true" />
          Live TxLINE: not configured
        </span>
        <span>Replay active</span>
        <span>Fixture source: replay</span>
        <span>Replay fixture hash: pm-replay-v1</span>
        <span>Last proof source: {visibleReceipt.verificationMode}</span>
        <span>Fallback reason: no live token required</span>
        <span>Verification target: TxLINE fixtures/events/proofs</span>
      </section>

      <section className="console-header" aria-labelledby="page-title">
        <div>
          <div className="mode-row">
            <span className="mode-pill">
              <ShieldCheck size={16} aria-hidden="true" />
              Replay demo mode
            </span>
            <span className="mode-pill track-pill">Prediction Markets and Settlement</span>
            <span className="compliance-pill">Simulation only. No real-money wagering.</span>
          </div>
          <h1 id="page-title">ProofMarket</h1>
          <p className="headline">
            Freeze the disputed market, verify the TxLINE proof path, diff the receipt, then execute
            corrected simulated settlement.
          </p>
        </div>
        <button className="primary-action" type="button" onClick={settleDisputedMarket}>
          <Play size={18} aria-hidden="true" />
          Run settlement replay
        </button>
      </section>

      <section className="status-band" aria-label="Compliance statement">
        <AlertTriangle size={18} aria-hidden="true" />
        <p>Simulation/devnet/replay only. No real-money wagering, custody, advice, or affiliation.</p>
      </section>

      <section className="verdict-theater" aria-labelledby="verdict-title">
        <div className="hero-left">
          <div className="section-kicker">Hero scenario</div>
          <h2 id="verdict-title">{selectedScenario.title}</h2>
          <div className="command-scoreboard">
            <span>{selectedScenario.match.homeTeam}</span>
            <strong>
              {selectedScenario.match.homeScore}-{selectedScenario.match.awayScore}
            </strong>
            <span>{selectedScenario.match.awayTeam}</span>
          </div>
          <dl className="hero-facts">
            <div>
              <dt>Frozen market state</dt>
              <dd>{selectedScenario.market.question}</dd>
            </div>
            <div>
              <dt>Selection</dt>
              <dd>{selectedScenario.market.selection}</dd>
            </div>
            <div>
              <dt>Disputed stat</dt>
              <dd>{selectedScenario.disputedStat}</dd>
            </div>
          </dl>
          <div className="scenario-list compact-queue" aria-label="Disputed market queue">
            {scenarios.map((scenario) => (
              <button
                className={scenario.id === selectedScenario.id ? "scenario active" : "scenario"}
                key={scenario.id}
                type="button"
                onClick={() => selectScenario(scenario)}
              >
                <FileJson size={16} aria-hidden="true" />
                <span>{scenario.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="proof-pipeline">
          <div className="pipeline-heading">
            <div>
              <div className="section-kicker">Proof pipeline</div>
              <h2>{activeStage.label}</h2>
            </div>
            <Clock3 size={22} aria-hidden="true" />
          </div>
          <p className="stage-detail">{activeStage.detail}</p>
          <div className="lifecycle-row" aria-label="Proof lifecycle">
            {replayStages.slice(1).map((stage) => {
              const stepIndex = replayStages.findIndex((item) => item.key === stage.key);
              const isComplete = currentStageIndex >= stepIndex;
              return (
                <span className={isComplete ? "lifecycle-step complete" : "lifecycle-step"} key={stage.key}>
                  {stage.compactLabel}
                </span>
              );
            })}
          </div>
          <div className="progress-line" aria-hidden="true">
            <span style={{ width: `${Math.max(currentStageIndex, 0) * 25}%` }} />
          </div>
          <div className="verdict-strip" aria-label="Receipt verdict">
            <div className="verdict-card previous">
              <span>PREVIOUS RECEIPT</span>
              <strong>{previousScore}</strong>
            </div>
            <ArrowRight aria-hidden="true" className="verdict-arrow" />
            <div className={currentStageIndex >= 2 ? "verdict-card proof verified" : "verdict-card proof"}>
              <span>TXLINE PROOF VERIFIED</span>
              <strong>{currentStageIndex >= 2 ? "verified" : "pending"}</strong>
            </div>
            <ArrowRight aria-hidden="true" className="verdict-arrow" />
            <div className={replayStage === "executed" ? "verdict-card final settled" : "verdict-card final"}>
              <span>FINAL SETTLEMENT</span>
              <strong>{finalScore}</strong>
            </div>
          </div>
        </div>

        <div className="hero-right" aria-label="Settlement result">
          <div className="section-kicker">Corrected ledger</div>
          <h2>{replayStage === "executed" ? "Settlement executed" : "Awaiting verified proof"}</h2>
          <dl className="receipt-mini">
            <div>
              <dt>Receipt</dt>
              <dd>{visibleReceipt.receiptId}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{visibleReceipt.verificationMode}</dd>
            </div>
            <div>
              <dt>Slot</dt>
              <dd>{visibleReceipt.slot ?? "replay-slot"}</dd>
            </div>
          </dl>
          <div className="outcome-callout">
          {outcomeHighlights.map((item) => (
            <p className={item.tone} key={item.text}>
              {item.text}
            </p>
          ))}
          </div>
        </div>
      </section>

      <div className="inspector-workbench">
        <section className="panel trace-panel" aria-labelledby="trace-title">
          <div className="panel-title-row">
            <div>
              <div className="section-kicker">Settlement trace</div>
              <h2 id="trace-title">{settlementResult ? "Replay settlement executed" : "Ready to replay"}</h2>
            </div>
            <CheckCircle2 size={24} className="title-icon" aria-hidden="true" />
          </div>
          <ol className="trace-list">
            {(settlementResult?.trace ?? selectedScenario.trace).map((step) => (
              <li key={`${selectedScenario.id}-${step.label}`}>
                <span className={`trace-dot ${step.status}`} />
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.details}</p>
                  <time dateTime={step.timestampUtc}>{formatTime(step.timestampUtc)}</time>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel receipt-panel" aria-labelledby="receipt-title">
          <div className="panel-title-row">
            <div>
              <div className="section-kicker">Proof receipt</div>
              <h2 id="receipt-title">Proof Receipt Inspector</h2>
            </div>
            <ReceiptText size={24} className="title-icon" aria-hidden="true" />
          </div>
          <dl className="receipt-grid inspector-grid">
            <div>
              <dt>receiptId</dt>
              <dd>{visibleReceipt.receiptId}</dd>
            </div>
            <div>
              <dt>statKey</dt>
              <dd>{visibleReceipt.statKey}</dd>
            </div>
            <div>
              <dt>statValue</dt>
              <dd>{visibleReceipt.statValue}</dd>
            </div>
            <div>
              <dt>verified</dt>
              <dd>{visibleReceipt.verified ? "Verified" : "Not verified"}</dd>
            </div>
            <div>
              <dt>verificationMode/source</dt>
              <dd>{visibleReceipt.verificationMode}</dd>
            </div>
            <div>
              <dt>txSignature / trace link</dt>
              <dd>{visibleReceipt.txSignature}</dd>
            </div>
            <div>
              <dt>merkleRoot</dt>
              <dd>{visibleReceipt.merkleRoot ?? "replay-root-unavailable"}</dd>
            </div>
            <div>
              <dt>merkleProof</dt>
              <dd>{visibleReceipt.merkleProof?.join(" -> ") ?? "replay-proof-unavailable"}</dd>
            </div>
            <div>
              <dt>slot</dt>
              <dd>{visibleReceipt.slot ?? "replay-slot"}</dd>
            </div>
          </dl>
          <div className="summary-block">
            <span>receipt summary</span>
            <pre>{receiptSummary}</pre>
          </div>
        </section>

        <section className="panel diff-panel" aria-labelledby="diff-title">
          <div className="panel-title-row">
            <div>
              <div className="section-kicker">Receipt diff</div>
              <h2 id="diff-title">Late update review</h2>
            </div>
            <GitCompareArrows size={24} className="title-icon" aria-hidden="true" />
          </div>
          {visibleDiff.length > 0 ? (
            <div className="diff-table" role="table" aria-label="Receipt differences">
              <div role="row" className="diff-head">
                <span role="columnheader">Field</span>
                <span role="columnheader">Before</span>
                <span role="columnheader">After</span>
              </div>
              {visibleDiff.map((diff) => (
                <div role="row" className="diff-row" key={diff.field}>
                  <span role="cell">{diff.field}</span>
                  <span role="cell">{diff.before}</span>
                  <span role="cell">{diff.after}</span>
                  <p>{diff.explanation}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No receipt change for this replay scenario.</p>
          )}
        </section>

        <section className="panel accounting-panel" aria-labelledby="accounting-title">
          <div className="panel-title-row">
            <div>
              <div className="section-kicker">Simulated accounting</div>
              <h2 id="accounting-title">Outcome ledger</h2>
            </div>
            <CircleDollarSign size={24} className="title-icon" aria-hidden="true" />
          </div>
          <ul className="accounting-list">
            {(settlementResult?.accounting ?? selectedScenario.accounting).map((entry) => (
              <li key={`${selectedScenario.id}-${entry.account}`}>
                <strong>{entry.account}</strong>
                <span>{entry.delta}</span>
                <p>{entry.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

function getReceiptSummary(receipt: SettlementResult["receipt"]) {
  return JSON.stringify(
    {
      receiptId: receipt.receiptId,
      matchId: receipt.matchId,
      statKey: receipt.statKey,
      statValue: receipt.statValue,
      verified: receipt.verified,
      verificationMode: receipt.verificationMode,
      txSignature: receipt.txSignature ?? "replay://trace/unavailable",
      merkleRoot: receipt.merkleRoot ?? "replay-root-unavailable",
      merkleProof: receipt.merkleProof ?? ["replay-proof-unavailable"],
      slot: receipt.slot ?? "replay-slot",
    },
    null,
    2,
  );
}

function getOutcomeHighlights(
  scenario: ReplayScenario,
  settlementResult: SettlementResult | null,
) {
  const accounting = settlementResult?.accounting ?? scenario.accounting;

  if (scenario.id === "late-goal-dispute") {
    return [
      { text: "Over 2.5 wins +100 simulated credits", tone: "positive" },
      { text: "No shares -100 simulated credits", tone: "negative" },
    ];
  }

  return accounting.map((entry, index) => ({
    text: `${entry.account} ${entry.delta}`,
    tone: index === 0 ? "positive" : "negative",
  }));
}

function clearReplayTimers(timerList: Array<number>) {
  timerList.forEach((timer) => window.clearTimeout(timer));
  timerList.length = 0;
}
