# ProofMarket

Prediction Markets and Settlement track.

ProofMarket: settlement you can replay. It turns TxLINE-style match data into verifiable result receipts and simulated outcome-accounting traces.

## Final Submission Checklist

- Live app URL: pending deployment
- Demo video URL: pending recording
- Public repo URL: pending publication
- Default mode: replay demo mode
- Main CTA: `Replay late-goal settlement`
- Superteam project description: see `SUBMISSION.md`
- Recording script: see `VIDEO_SCRIPT.md`
- Deployment steps: see `DEPLOYMENT.md`

This project is distinct from the other TxODDS submissions because it focuses on result verification, proof receipts, dispute resolution, and settlement traces. It is not an agentic trading system or a fan game.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

Replay mode is the primary judge path and does not require a TxLINE token, wallet, paid API, private key, or external secret.

## Replay Demo Flow

1. Open the app.
2. Confirm the banner says `Replay demo mode`.
3. Click `Replay late-goal settlement`.
4. Read the verdict strip: `PREVIOUS RECEIPT 1-1 -> TXLINE PROOF VERIFIED -> FINAL SETTLEMENT 2-1`.
5. Review the proof lifecycle: proof requested, previous receipt, proof verified, settlement executed.
6. Inspect the receipt fields and summary block.
7. Compare the receipt diff for the late-goal score correction.
8. Review the corrected simulated ledger.

## 3-5 Minute Demo Path

- `0:00` Dispute: show the frozen market and the previous `1-1` receipt.
- `0:45` Proof diff: click `Replay late-goal settlement`, then show TxLINE proof verified and the `1-1 -> 2-1` receipt diff.
- `1:30` Settlement ledger: show `Over 2.5 wins +100 simulated credits` and `No shares -100 simulated credits`.
- `2:15` Fallback/compliance: show replay mode, synthetic fixtures, no required token/wallet, and simulation-only compliance.

Included synthetic replay scenarios:

- Normal full-time result
- Late goal after odds moved
- Score correction
- Suspended match

Public fixture files live under `fixtures/replay/`:

- `matches.json`
- `events.jsonl`
- `odds.jsonl`
- `proofs.json`

All fixture content is synthetic demo data. The repo does not include raw TxODDS responses, live API captures, derived odds histories, sponsor-private material, keys, or tokens.

## TxLINE Endpoints Used

The current implementation runs from replay fixtures, but it is shaped around the shared TxLINE client contract. A live adapter should map these methods to official TxLINE endpoints:

| Shared method | Live endpoint target | ProofMarket use |
| --- | --- | --- |
| `getMatches` | `GET {TXLINE_API_BASE}/api/fixtures/snapshot` | Populate match and scenario candidates. |
| `getMatch` | `GET {TXLINE_API_BASE}/api/fixtures/snapshot` filtered by fixture | Hydrate disputed match metadata. |
| `getMatchEvents` | `GET {TXLINE_API_BASE}/api/scores/snapshot/{fixtureId}` or historical score sequence | Build event history for result review. |
| `getOdds` | `GET {TXLINE_API_BASE}/api/odds/snapshot/{fixtureId}` | Show odds context around disputed moments. |
| `streamMatch` | `GET {TXLINE_API_BASE}/api/scores/stream` and `GET {TXLINE_API_BASE}/api/odds/stream` | Live score/odds settlement triggers. |
| `getProofReceipt` | `GET {TXLINE_API_BASE}/api/scores/stat-validation` and `GET {TXLINE_API_BASE}/api/odds/validation` | Verify score/stat and odds receipts. |

If `TXLINE_API_TOKEN` is missing, if the live endpoint is unavailable, or if Solana RPC is unavailable, the demo stays in replay mode and labels receipts as `replay_fixture`.

## Compliance

This is a hackathon demo using TxLINE World Cup data. It does not offer real-money betting, custody, financial advice, or gambling services. Any prediction, market, or agent flow is simulation/devnet/replay unless explicitly marked otherwise. The project is not affiliated with FIFA or any tournament organizer.

## Commands

```bash
npm test
npm run lint
npm run build
```

## Project Shape

- `src/App.tsx`: replay-first dispute-resolution console UI.
- `src/domain/settlementEngine.ts`: settlement replay and receipt diff logic.
- `src/domain/types.ts`: local copy of the shared TxLINE-style types used by this app.
- `fixtures/replay/`: public synthetic replay fixture files.
- `tests/`: Vitest coverage for the domain behavior and first-screen console flow.
- `docs/TECHNICAL.md`: architecture, data flow, fallback mode, proof model, and known limitations.
