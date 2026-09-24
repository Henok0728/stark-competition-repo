# Viva booth (working title)

STARK hackathon: students **practise a thesis defence or class talk out loud**.

**Read first, then listen.** They paste the paper (title, research question, abstract, up to five references). We look those citations up on **Scholarxiv** before the mic. They talk (**Voxide**). We check the talk against **their text** and against **abstracts we actually fetched**. We coach **how to say it**. Viva questions come from **hits we pulled**, not invented papers. Host on **EthioDeploy**. No payments.

We do not decide scientific “truth.” We decide: said vs their manuscript, named source exists, claim vs that abstract. Missing API hit = **unverified**.

**Open talk:** no paste. Citations come from speech only, then the same Scholarxiv check.

Not a ChatGPT tab. Not a search-only paper chatbot. Not a TED “energy” scorer. Not a full-PDF factory.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_VOXIDE_PUBLIC_KEY` so the voice widget appears. Whitelist `localhost` and the EthioDeploy host in the Voxide dashboard. Scholarxiv key is still unused until FEAT-005.

## Claim a feature

Board: [`feature_lock.json`](feature_lock.json). Statuses: `unclaimed` | `claimed` | `released`.

1. Open a PR that sets one feature to `claimed`, with your **name** (or GitHub), **branch**, and `claimed_at`. Prefer that PR to touch only the lock file.
2. One owner per `id`. If two claims collide, the first merge wins.
3. Commit mainly the paths in that feature’s `deliverables`.
4. When the `verification` line is true, the same (or next) PR sets `released` and `released_at`.
5. There is no lock server. Git is the lock. Keep `main` demoable.

Work on `feat/p2-voxide`-style branches. Log releases in [`CHANGELOG.md`](CHANGELOG.md).

## Contest artifacts

1. **Thinking** — problem, rejected paths, and why this booth: document on Scholarxiv (FEAT-009).
2. **Clock** — this repo + changelog + STARK changelogs.
3. **Runs** — live EthioDeploy URL (FEAT-001).

## License

MIT. See [LICENSE](LICENSE).
