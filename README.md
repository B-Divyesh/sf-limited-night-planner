# Limited Night Planner

Plan a fair casual tabletop event from mixed components. It is for hosts who
need pools, seating, timed rounds, and a host sheet without a card database.

Live: <https://limited-night-planner.sociobot.in>

## What it does

- Checks component totals and creates pools, seating rounds, a timer, and a host
  sheet.
- Avoids repeat opponents for one round-robin cycle and warns before another
  cycle begins.
- Keeps a running timer after a refresh.
- Exports the plan as JSON and the host sheet as CSV.
- Keeps plan data in this browser and works offline after the first visit.
- Keeps planning, timers, printing, and exports free.

Try the ready five-player sample at
<https://limited-night-planner.sociobot.in/demo/>. Demo data uses a separate
browser database and is discarded when you start for real.

## Run locally

Requires Node.js 22 or a current Node.js LTS release.

```sh
npm install
npm run dev
```

Vite prints the local development URL. Plans are browser-local, so each browser profile has its own data.

## Test and build

```sh
npm run check
npm test
npx playwright install chromium # first time only
npm run test:e2e
npm run test:claims
npm run build
```

The billing service's live abuse-protection contract has a separate, intentional
network check. It sends 300 distinct invalid verification tokens and expects
HTTP 429 responses with `Retry-After`; run it only when checking the deployed
Sociobot billing endpoint:

```sh
npm run test:license-rate-limit
```

The exact production command is `npm run build`. It creates the static deploy artifact in `dist/`, with `dist/index.html` at its root and a generated, versioned service worker precache.

To inspect the production build:

```sh
npm run preview
```

## Data, privacy, and billing

Current and archived plans use IndexedDB. License state uses localStorage. No
plan data is sent to a server. The app has no advertising, behavioral
analytics, trackers, third-party fonts, or social embeds. The only application
API request is an optional existing Night Pass license verification against the
Sociobot billing service. Sociobot/Dodo is the merchant of record.

See [the privacy policy](./privacy/index.html) and [terms](./terms/index.html).
The product research is in [`.factory/brief.json`](./.factory/brief.json), the
visual system and generated-art provenance are in [`.factory/design.md`](./.factory/design.md),
the demo contract is in [`.factory/demo.md`](./.factory/demo.md), the claim
tests are in [`.factory/claims.json`](./.factory/claims.json), and verification
notes are in [`.factory/handoff.md`](./.factory/handoff.md).

## License

MIT. See [LICENSE](./LICENSE).
