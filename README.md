# Limited Night Planner

Limited Night Planner turns a mixed personal collection into a fair, timed casual limited event. It is for hosts who know roughly what is in their boxes but do not have—or want—a proprietary card database.

Live: <https://limited-night-planner.sociobot.in>

## What it does

- Counts any number of user-named component groups and excludes uncertain or incompatible groups without losing their counts.
- Tests pack or direct-pool assumptions against the usable total, including a host reserve.
- Builds a start-to-finish timetable and round-robin seating rotation, with byes for odd groups and a warning before matchups repeat.
- Runs a round timer that survives navigation, refreshes, and tab changes.
- Produces an ink-friendly host sheet and JSON/CSV exports.
- Stores plans locally in IndexedDB and works offline after the first visit.
- Offers an optional $9 one-time Night Pass for unlimited local plan snapshots. The complete planner, print view, timer, and exports stay free.

The app contains no official rules, card database, copyrighted game imagery, matchmaking, or online play. All game-specific details are entered by the host.

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
npm run build
```

The exact production command is `npm run build`. It creates the static deploy artifact in `dist/`, with `dist/index.html` at its root and a generated, versioned service worker precache.

To inspect the production build:

```sh
npm run preview
```

## Data, privacy, and billing

Current and archived plans use IndexedDB. License state uses localStorage. JSON and CSV exports let users take their data with them. No plan data is sent to a server. The only application API request is an optional license verification against the Sociobot billing service; Sociobot/Dodo is the merchant of record.

See [the privacy policy](./privacy/index.html) and [terms](./terms/index.html). The product research is in [`.factory/brief.json`](./.factory/brief.json), the visual system and generated-art provenance are in [`.factory/design.md`](./.factory/design.md), and verification notes are in [`.factory/handoff.md`](./.factory/handoff.md).

## License

MIT. See [LICENSE](./LICENSE).
