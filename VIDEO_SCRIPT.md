# ProofMarket Video Script

Target length: 3-5 minutes.

## 0:00-0:20 - Dispute Setup

Show the first screen.

Narration:

> ProofMarket is a replay-first settlement lab for the Prediction Markets and Settlement track. The judge path starts with a frozen disputed market, not a market browser. The previous receipt says `1-1`, but the replay contains a late goal that changes settlement.

Point at:

- `Replay demo mode`
- `Live TxLINE: not configured`
- `Replay active`
- `PREVIOUS RECEIPT 1-1`
- `Simulation only. No real-money wagering.`

## 0:20-0:45 - Run The Judge Path

Click `Run settlement replay`.

Narration:

> The product advances through the proof lifecycle: Frozen, TxLINE proof requested, Receipt verified, Diff explained, and Settlement executed. The demo uses public synthetic replay fixtures, so it can be evaluated without a TxLINE token, wallet, payment, login, or hidden secret.

Point at:

- proof lifecycle strip
- `TXLINE PROOF VERIFIED`
- `FINAL SETTLEMENT 2-1`

## 0:45-1:30 - Receipt Diff

Scroll or focus on the receipt diff and inspector.

Narration:

> The important moment is the receipt diff. The previous proof had `statValue: 1-1`. The final receipt has `statValue: 2-1`. ProofMarket makes the correction inspectable before settlement updates.

Point at:

- `statValue 1-1 -> 2-1`
- `receiptId replay-proof-late-goal-pre -> replay-proof-late-goal-final`
- `Proof Receipt Inspector`
- `merkleRoot`, `merkleProof`, `slot`, `txSignature`

## 1:30-2:15 - Settlement Ledger

Show the highlighted ledger.

Narration:

> Once the proof is verified, the simulated settlement ledger updates. Over 2.5 resolves as the corrected outcome. The ledger is deliberately simulated: no real funds, no custody, no betting service.

Point at:

- `Over 2.5 wins +100 simulated credits`
- `No shares -100 simulated credits`
- settlement trace step `Replay settlement executed`

## 2:15-3:00 - Fallback And Compliance

Show README or stay in app and explain replay mode.

Narration:

> The public submission is honest about the integration boundary. It is shaped around TxLINE endpoints for fixtures, scores, odds, streams, and validation receipts, but the judge path is replay-first. If credentials or live services are missing, the app still demonstrates the settlement mechanism from local synthetic fixtures.

Point at:

- README TxLINE endpoints table
- `fixtures/replay/`
- compliance text

## 3:00-4:00 - Why This Fits The Track

Narration:

> ProofMarket is not an odds dashboard and not a consumer game. It is a settlement product. It shows how TxODDS and TxLINE data can power transparent dispute resolution for prediction-market builders: freeze the dispute, inspect the proof, diff the correction, and execute the corrected simulated ledger.

Close with:

- Track: Prediction Markets and Settlement
- Main CTA: `Run settlement replay`
- Replay-first judge path
