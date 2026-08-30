# Limited Night Planner — repair handoff

## Release result

**Repair work order:** `limited-night-planner-repair-5`
**Verifier base:** `70b53bd635905207329e6f0d5103604c3af2b568`
**Candidate repaired:** `b8945912a73c510eb79e36cd1221f1e07a8d41a8`
**Repair commit:** `01e37e283accff9c9ae9b7b8ba43ae3e125cb85b`
**Status:** Ready for static deployment, with new Night Pass sales intentionally deferred.

The free, local-first planner is release-ready. The verifier's checkout URL
returned HTTP 404 because `limited-night-planner` was not registered in the
public billing product catalog. Registering a product is factory billing
infrastructure and is outside this repository's authority. Rather than retain
a broken purchase button, this repair removes the checkout offer, price claim,
and dead link. Existing Night Pass holders can still paste and verify a license
to recover their local archive. The free planner, timer, printing, JSON export,
and CSV export remain available.

## Repairs made

- Added `.factory/claims.json` with 11 observable product claims and exact
  Playwright regression commands.
- Added `/demo/`, linked from the first screen. It seeds a realistic
  five-player Saturday event in a separate `limited-night-planner-demo`
  IndexedDB database, has the persistent required banner, Reset demo, and
  Start for real controls. `.factory/demo.md` documents its contract.
- Rewrote the cold landing with a plain host-facing headline, one-click sample
  action, and qualified pairing wording: repeat opponents are avoided for one
  round-robin cycle, not indefinitely. `.factory/copy-audit.md` records the
  landing copy review.
- Made license storage safe when browser `localStorage` is denied; the free
  app now renders and works with an in-memory fallback.
- Added canonical, Open Graph, and Twitter metadata, an original-art social
  image, site footer attribution/build ID, `/demo/` sitemap entry, and a real
  404 response/page. The service worker precaches and routes the demo and 404
  pages, without caching non-success responses.
- Kept the existing PWA/local IndexedDB architecture and passed demo, offline,
  update, keyboard, accessibility, desktop, and 390 px browser coverage.

## Verification evidence

Run from a clean dependency install on 2026-08-30 UTC:

```sh
npm ci                              # pass; 63 packages audited, 0 vulnerabilities
npm run check                       # pass
npm test                            # pass; 11/11
npm run build                       # pass; dist/ produced
npm run test:e2e                    # pass; 54/54, desktop and 390 px mobile
npm run test:claims                 # pass; 22/22, each claim on both viewports
npm run test:license-rate-limit     # pass; 30×200, 270×429, Retry-After 3 or 4
```

- `verify-url.sh` passed locally for `/` and `/demo/`: expected title, `lang`,
  one h1, main landmark, no missing image alt text, no unlabeled buttons, and
  no console errors.
- Playwright Axe scans found zero serious or critical issues on the landing,
  all four planner stops, privacy, and terms. Keyboard coverage verifies skip
  link and Space activation.
- The offline claim uses its own browser context: after the first `/demo/`
  visit, it waits for service-worker control, sets the context offline,
  reloads, and verifies the seeded host sheet. The worker update regression
  verifies `Update now` activates the waiting worker and reloads into it.
- Privacy claim tests record every request through a complete demo flow and
  assert that only the local origin is used. The only separate live network
  check is the explicit license abuse-protection test above.
- Current build budget: JavaScript 38.36 kB raw / 12.84 kB gzip; application
  CSS 20.67 kB raw / 5.38 kB gzip; self-hosted fonts 78.90 kB total; responsive
  mobile hero 30.43 kB. The generated service worker precaches 23 files as
  `lnp-f95f815d2173`.
- Lighthouse CLI was not installed in this container. Its direct prerequisites
  (semantic/axe, responsive browser, no-console-error, PWA, bundle, and image
  budget checks) are covered by the commands above; no Lighthouse score is
  claimed here.

## Deploy and run

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run test:claims
npm run build
```

Static deploy artifact: `dist/` with `dist/index.html` at its root. Deployment
and live identity evidence will be appended after the configured static deploy
finishes.

## Known follow-up

The factory must register `limited-night-planner` through the approved
Sociobot billing workflow before offering a new Night Pass. After the hosted
checkout resolves successfully, restore the purchase link and one-time price,
add a checkout success regression, and update the corresponding claim. Do not
add a direct payment-provider integration or a raw billing credential to this
repository.
