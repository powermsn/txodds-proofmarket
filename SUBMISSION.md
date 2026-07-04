# ProofMarket Submission

## Track

Prediction Markets and Settlement.

## One-Line Pitch

ProofMarket is settlement you can replay: it shows how a disputed football market moves from a frozen result, to a TxLINE-style proof receipt, to a corrected simulated settlement ledger.

## What Judges Should Click

Open the app and click `Run settlement replay`.

That path shows the core product in under 90 seconds:

1. A disputed total-goals market is frozen on a previous `1-1` receipt.
2. The proof lifecycle advances through Frozen, TxLINE proof requested, Receipt verified, Diff explained, and Settlement executed.
3. The receipt diff shows the corrected `2-1` final settlement.
4. The simulated ledger resolves: `Over 2.5 wins +100 simulated credits` and `No shares -100 simulated credits`.

Replay mode is the primary judge path. No TxLINE token, wallet, payment, login, private key, KYC, or external secret is required.

## Why TxODDS / TxLINE Matters

Prediction market settlement needs more than a final score on a generic scoreboard. Builders need a data path that can explain why a result changed, what proof receipt superseded the previous one, and how settlement should update after a late goal or score correction.

ProofMarket is built around that oracle/proof moment:

- TxLINE match state identifies the disputed football result.
- TxLINE score and odds data provide the event context around the dispute.
- TxLINE validation/proof endpoints map to the proof receipt inspector.
- The receipt diff makes late corrections visible before settlement executes.
- The ledger shows how a prediction-market builder could wire verified results into settlement logic.

The current public demo uses synthetic replay fixtures shaped around the TxLINE client contract. It does not claim live TxLINE production data is already connected.

## TxLINE Endpoints

The app is replay-first today. A live adapter should map the local client methods to these TxLINE endpoint targets:

| Shared method | Live endpoint target | ProofMarket use |
| --- | --- | --- |
| `getMatches` | `GET {TXLINE_API_BASE}/api/fixtures/snapshot` | Populate match and scenario candidates. |
| `getMatch` | `GET {TXLINE_API_BASE}/api/fixtures/snapshot` filtered by fixture | Hydrate disputed match metadata. |
| `getMatchEvents` | `GET {TXLINE_API_BASE}/api/scores/snapshot/{fixtureId}` or historical score sequence | Build event history for result review. |
| `getOdds` | `GET {TXLINE_API_BASE}/api/odds/snapshot/{fixtureId}` | Show odds context around disputed moments. |
| `streamMatch` | `GET {TXLINE_API_BASE}/api/scores/stream` and `GET {TXLINE_API_BASE}/api/odds/stream` | Live score/odds settlement triggers. |
| `getProofReceipt` | `GET {TXLINE_API_BASE}/api/scores/stat-validation` and `GET {TXLINE_API_BASE}/api/odds/validation` | Verify score/stat and odds receipts. |

## Mock / Replay Fallback

Replay fixtures live in `fixtures/replay/` and are synthetic:

- `matches.json`
- `events.jsonl`
- `odds.jsonl`
- `proofs.json`

Fallback behavior:

- Missing `TXLINE_API_TOKEN`: run replay mode.
- Live TxLINE unavailable: keep replay mode available.
- Solana RPC unavailable: show replay proof receipts and do not block the demo.
- Schema mismatch in a future live adapter: fail closed for live data and keep replay mode available.

## Compliance

This is a hackathon demo using TxLINE-style World Cup football data. It does not offer real-money betting, custody, financial advice, gambling services, deposits, withdrawals, or real market creation. All prediction-market and settlement flows are simulation/devnet/replay unless explicitly marked otherwise. The project is not affiliated with FIFA or any tournament organizer.

## Known Limits

- The public judge path is replay-first and uses synthetic fixtures.
- Live TxLINE API wiring is documented as the next adapter step, not claimed as complete.
- No real-money settlement, custody, wallet connection, KYC, or legal wagering flow is implemented.
- The ledger uses deterministic simulated credits only.
- Public deployment URL, demo video URL, and public repo URL must be replaced before final Superteam submission.
