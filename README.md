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

Requires Node.js 22 or later.

```sh
npm install
npm run dev
```

Vite prints the local address. Each browser keeps its own plans.

## Test and build

```sh
npm run check
npm test
npx playwright install chromium # first time only
npm run test:e2e
npm run test:claims
npm run build
```

The deployed billing service has a separate check. Run this only when checking
that service. It sends test licenses and confirms repeated checks are
temporarily limited:

```sh
npm run test:license-rate-limit
```

Use `npm run build` for production. It creates the deployable site in `dist/`.

To inspect the production build:

```sh
npm run preview
```

## Data, privacy, and billing

Plans and an existing Night Pass status stay in this browser. No plan data is
sent to a server. The app has no advertising, behavioral analytics, trackers,
third-party fonts, or social embeds. Restoring an existing Night Pass sends its
license token to Sociobot for a check. Sociobot/Dodo is the merchant of record.

See [the privacy policy](./privacy/index.html) and [terms](./terms/index.html).

## Project notes

- [Brief](./.factory/brief.json)
- [Design and artwork provenance](./.factory/design.md)
- [Demo](./.factory/demo.md)
- [Claims and tests](./.factory/claims.json)
- [Handoff](./.factory/handoff.md)

## License

MIT. See [LICENSE](./LICENSE).
