# Limited Night Planner — polish 1 handoff

## Result

Review 1 is repaired and deployed. Repair commit:
`43c3cb0267036f2cd3b0af25e7c9eb83e36f0293` (`fix: polish reviewed routes and copy`).

Production: <https://limited-night-planner.sociobot.in/>
Demo: <https://limited-night-planner.sociobot.in/?demo=1>

The repair removes the untested artwork-origin statement, gives 404 and legal
pages the standard route skeleton, adds complete 404 metadata, rewrites the
reviewed reader-facing copy, and replaces transit-only labels with direct
planner labels. The full finding map is in [polish-1.md](./polish-1.md).

## Verification

### Clean clone

A fresh shallow clone of `origin/main` at the repair commit was installed in
`/tmp/limited-night-planner-clean-IPe5WS`.

- `npm ci` — passed; 62 packages added, 0 vulnerabilities reported.
- `npm run check` — passed.
- `npm test` — passed: 13 tests across 3 files.
- `npm run build` — passed; `dist/` exists with `dist/index.html`; service
  worker `lnp-6cb3a04024d3` precaches 23 files.
- `npm run test:e2e` — passed: 80 browser checks across desktop and 390 px
  mobile Chromium.
- Every exact command in `claims.json` was run separately in that clone. All
  17 commands passed in both browser projects (34 executions):
  `core-planning`, `demo-sandbox`, `offline-after-first-visit`,
  `local-plan-data`, `no-third-party-requests`, `no-analytics-cookies`,
  `json-export`, `csv-export`, `first-cycle-pairings`, `timer-persistence`,
  `timer-background`, `free-core-tools`, `night-pass-sales-unavailable`,
  `plan-deletion`, `reusable-archives`, `round-cycle-warning`, and
  `offline-export`.
- `npm run test:license-rate-limit` — passed: 30 readable invalid-license
  responses, then 270 HTTP 429 responses; CORS allowed the product origin and
  rate-limited responses carried `Retry-After` values of 3 or 4 seconds.

### Live deployment

`swa deploy ./dist --env production` deployed the committed build to the
scoped `sf-limited-night-planner` Static Web App. The root cold check used
`/opt/fleet/lib/verify-url.sh` and recorded a 200 response, 902 ms load,
correct title/lang/one H1/main/image alternatives, and no console or page
errors.

Fresh live browser checks recorded in
[`.factory/evidence/polish-1/live-route-check.json`](./evidence/polish-1/live-route-check.json)
confirm the following:

- `/`, `/?demo=1`, `/privacy/`, and `/terms/` return 200; `/no-such-page`
  returns 404.
- Each route has one H1, `main#main`, a skip link, the standard header and
  footer, its route-specific title, and no serious or critical Axe findings.
- The direct demo URL shows the persistent isolated-sample banner.
- The deployed 404 has title `Page not found — Limited Night Planner`.
- A fresh mobile context installed the live worker, then reloaded `?demo=1`
  offline with the sample plan, demo banner, and offline notice intact. See
  [live-offline-check.json](./evidence/polish-1/live-offline-check.json).

Visual evidence is in `./evidence/polish-1/`, including
`live-root-desktop.png`, `live-demo-mobile.png`,
`live-not-found-desktop.png`, `live-privacy-desktop.png`, and
`live-offline-demo-mobile.png`.

Lighthouse 12.8.2 against the live mobile route scored 100 for performance,
accessibility, best practices, and SEO. FCP was 1.4 s, LCP 1.6 s, CLS 0.002,
and TBT 0 ms. The report is
[lighthouse-mobile.json](./evidence/polish-1/lighthouse-mobile.json).

## Known gaps and next steps

None. The optional Night Pass sale remains intentionally unavailable and is
described plainly; the free planner, timer, print, and exports remain usable.
