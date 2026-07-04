# ProofMarket Technical Notes

## Architecture

ProofMarket is a Vite + React + TypeScript app with a small tested domain layer.

- The React UI renders the dispute-resolution console and never needs secrets.
- The domain layer loads local replay fixtures and produces settlement results.
- The fixture files mirror the shared TxLINE data shapes so a live adapter can replace replay data later.
- The proof viewer displays replay receipts using the same fields expected from live TxLINE proofs.

## Data Flow

```text
fixtures/replay/*.json*
  -> settlementEngine.getReplayScenarios()
  -> selected disputed market
  -> Settle disputed market
  -> settlementEngine.runSettlementDemo()
  -> trace + final receipt + receipt diff + simulated accounting
  -> React console panels
```

The signature flow is `late-goal-dispute`:

1. A total-goals market appears ready to resolve from a `1-1` receipt.
2. An odds shock and late stoppage-time goal enter the replay.
3. Settlement pauses.
4. ProofMarket loads a newer replay receipt.
5. The receipt diff changes `statValue` from `1-1` to `2-1`.
6. The simulated ledger resolves the over-2.5 selection.

## Proof Model

`TxlineProofReceipt` fields used by the UI:

- `receiptId`
- `matchId`
- `statKey`
- `statValue`
- `merkleRoot`
- `merkleProof`
- `txSignature`
- `slot`
- `verified`
- `verifiedAtUtc`
- `verificationMode`

Current receipts use `verificationMode: replay_fixture`. If a devnet or live proof adapter is added later, the UI can display `devnet_mock` or `txline_proof` without changing the console flow.

## Replay and Fallback Mode

Replay is the default and required evaluation path.

Fallback rules:

- Missing `TXLINE_API_TOKEN`: use replay fixtures.
- Live TxLINE network error or rate limit: retry once in a future live adapter, then use replay fixtures.
- Schema mismatch in live mode: fail closed for live data, keep replay mode available.
- Solana RPC unavailable: show proof as `replay_fixture` or `devnet_mock`; do not block the demo.

The current app intentionally does not call live TxLINE or Solana RPC. That keeps the public repo safe to run with no secrets.

## Live Endpoint Targets

The future live adapter should use official TxLINE endpoint families:

- fixtures snapshot: `GET https://txline.txodds.com/api/fixtures/snapshot`
- latest score snapshots: `GET https://txline.txodds.com/api/scores/snapshot/{fixtureId}`
- live score stream: `GET https://txline.txodds.com/api/scores/stream`
- odds snapshot: `GET https://txline.txodds.com/api/odds/snapshot/{fixtureId}`
- live odds stream: `GET https://txline.txodds.com/api/odds/stream`
- score proof: `GET https://txline.txodds.com/api/scores/stat-validation`
- odds proof: `GET https://txline.txodds.com/api/odds/validation`

## Settlement States

- `settled_cleanly`: the final replay receipt resolves the market without dispute.
- `settled_after_correction`: a previous receipt is superseded by a corrected receipt and settlement executes.
- `paused_for_correction`: the market remains disputed while an operator reviews the corrected receipt.
- `void_pending_policy`: a suspended match blocks winner settlement until policy review.

## Known Limitations

- No real TxLINE adapter is included yet.
- No Solana program or devnet transaction is required for the main demo.
- The UI shows deterministic simulated accounting, not legal or financial settlement.
- Scenario data is synthetic and intentionally small for public repo safety.
- Live deployment, public repo, and demo video links are recorded in the root README and submission notes.
