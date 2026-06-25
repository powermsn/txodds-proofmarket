export type TxlineMode = "live" | "replay";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "suspended"
  | "abandoned"
  | "cancelled";

export type VerificationStatus =
  | "not_requested"
  | "pending"
  | "verified"
  | "failed"
  | "replay_only";

export interface TxlineMatch {
  matchId: string;
  competitionId: string;
  competitionName: string;
  kickoffUtc: string;
  status: MatchStatus;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute?: number;
  updatedAtUtc: string;
  sourceMode: TxlineMode;
}

export interface TxlineProofReceipt {
  receiptId: string;
  matchId: string;
  statKey: string;
  statValue: string;
  merkleRoot?: string;
  merkleProof?: string[];
  txSignature?: string;
  slot?: number;
  verified: boolean;
  verifiedAtUtc?: string;
  verificationMode: "txline_proof" | "devnet_mock" | "replay_fixture";
}

export interface MarketState {
  marketId: string;
  type: "match_winner" | "total_goals" | "first_goal_team";
  selection: string;
  status: "open" | "locked" | "settled" | "disputed";
  settlementState:
    | "settled_cleanly"
    | "settled_after_correction"
    | "paused_for_correction"
    | "void_pending_policy";
  question: string;
}

export interface SettlementTraceStep {
  label: string;
  status: VerificationStatus;
  timestampUtc: string;
  sourceMode: TxlineMode;
  details: string;
  link?: string;
}

export interface AccountingEntry {
  account: string;
  delta: string;
  reason: string;
}

export interface ReplayScenario {
  id: string;
  title: string;
  matchId: string;
  match: TxlineMatch;
  disputedStat: string;
  market: MarketState;
  previousReceipt: TxlineProofReceipt | null;
  finalReceipt: TxlineProofReceipt;
  trace: SettlementTraceStep[];
  accounting: AccountingEntry[];
}

export interface ReceiptDiffEntry {
  field: keyof TxlineProofReceipt;
  before: string;
  after: string;
  explanation: string;
}

export interface SettlementResult {
  mode: TxlineMode;
  scenario: ReplayScenario;
  match: TxlineMatch;
  market: MarketState;
  receipt: TxlineProofReceipt;
  receiptDiff: ReceiptDiffEntry[];
  trace: SettlementTraceStep[];
  accounting: AccountingEntry[];
}
