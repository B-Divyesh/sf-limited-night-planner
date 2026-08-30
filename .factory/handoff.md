# Limited Night Planner — repair handoff

## Release result

**Repair work order:** `limited-night-planner-repair-5`
**Verifier base:** `70b53bd635905207329e6f0d5103604c3af2b568`
**Candidate repaired:** `b8945912a73c510eb79e36cd1221f1e07a8d41a8`
**Core repair commit:** `01e37e283accff9c9ae9b7b8ba43ae3e125cb85b`
**Final regression repair:** `d158f64882e5b542c03333b1fda7e7594cc71d1d`
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
- Fixed a deferred-focus race after adding inventory: an immediate Count entry
  can no longer be redirected into Group name. The exact regression was run
  20 times across desktop and 390 px mobile without a failure.
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
npm run test:e2e                    # pass; 58/58, desktop and 390 px mobile
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
- Current build budget: JavaScript 38.33 kB raw / 12.82 kB gzip; application
  CSS 20.67 kB raw / 5.38 kB gzip; self-hosted fonts 78.90 kB total; responsive
  mobile hero 30.43 kB. The generated service worker precaches 23 files as
  `lnp-112086bbd2ef`.
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

Static deploy artifact: `dist/` with `dist/index.html` at its root.

## Deployment and live evidence

Deployed 2026-08-30 UTC through the configured Azure Static Web Apps workflow.
Final deployment ID: `dfa96b90-5347-41fa-a192-9c5aac9a7c91`. The configured custom
domain <https://limited-night-planner.sociobot.in/> returned HTTPS 200 after
the upload.

- Live `/` and `/demo/` returned 200; an unknown route returned 404 and served
  the designed 404 page. `cmp` confirmed that all three live HTML responses
  exactly matched `dist/index.html`, `dist/demo/index.html`, and `dist/404.html`.
- Live `verify-url.sh` checks passed: root load 714 ms and demo load 788 ms;
  each had the expected title, `lang=en`, one h1, a main landmark, zero missing
  alt text, zero unlabeled buttons, and zero console errors.
- Live headers include the configured CSP, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and Permissions-Policy.
- A live 390 px Chromium smoke test focused the skip link first, found no
  horizontal overflow, opened the sample host sheet, reloaded under service
  worker control, observed no page errors, and recorded only
  `https://limited-night-planner.sociobot.in` requests.
- Final live regression check at 390 px started a real plan, added a group,
  entered `1000001` in Count, and observed Count clamped to `1000000` while
  Group name remained `Group 1`; it had no console errors or overflow. The
  root HTML, 404 HTML, and current application JavaScript all exactly matched
  the final `dist/` files.

## Known follow-up

The factory must register `limited-night-planner` through the approved
Sociobot billing workflow before offering a new Night Pass. After the hosted
checkout resolves successfully, restore the purchase link and one-time price,
add a checkout success regression, and update the corresponding claim. Do not
add a direct payment-provider integration or a raw billing credential to this
repository.
