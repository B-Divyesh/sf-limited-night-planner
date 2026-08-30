# Limited Night Planner — repair handoff 6

## Release result

**Status: ready for static deployment.**

- Work order: `limited-night-planner-repair-6`
- Verifier report repaired: `093eda1a13f5f51a5880dd7492e3d1a11fcab236`
- Verified candidate: `cfdf33eca91d2f1ad401a7d61235c2145cdcc632`
- Artifact: static offline PWA; deployment artifact is `dist/` with
  `dist/index.html` at its root.

## Release-blocking repairs

1. **Existing Night Pass restoration now has an outcome regression, not a
   control-presence check.** The report correctly found that the old claim test
   only proved that a Restore button existed. The `@claim:night-pass-sales-unavailable`
   test now intercepts the exact Sociobot verification URL with the recorded
   valid response in `tests/fixtures/license-valid.json`, submits an existing
   pass, asserts the restored notice and Archive action, and archives the
   current plan. It also still proves that no checkout link is advertised.

2. **The live billing contract is asserted at the boundary.** The reported 503
   was no longer reproducible during this repair: the deployed Sociobot endpoint
   now returned readable CORS JSON for an invalid pass. The strengthened
   `npm run test:license-rate-limit` performs an OPTIONS preflight for
   `https://limited-night-planner.sociobot.in`, requires an invalid-token JSON
   response, then sends 300 distinct invalid tokens and requires HTTP 429 plus
   `Retry-After` on every limited response. This is an external service check;
   no payment credentials or payment-provider integration were added to the
   static PWA. When a check cannot complete, the app now says to check the
   connection and retry instead of incorrectly calling every failure “offline.”

3. **Every remaining claim sentence is mapped to an observable demo test.**
   `.factory/claims.json` now includes `round-cycle-warning` and
   `offline-export`. Their independent browser regressions respectively make
   the five-player sample schedule six rounds and download its CSV after a
   service-worker-controlled offline reload.

All planner behavior that passed verification remains intact: isolated demo
data, local IndexedDB plans, timer, seating, print, JSON/CSV export, PWA
offline/update flow, responsive layout, keyboard operation, and legal routes.

## Verification evidence

Run on 2026-08-30 UTC after a clean locked install:

```sh
npm ci                              # pass; 62 packages added, 63 audited, 0 vulnerabilities
npm run check                       # pass
npm test                            # pass; 11/11
npm run test:e2e                    # pass; 62/62, desktop and 390 px mobile
npm run test:claims                 # pass; 26/26, desktop and 390 px mobile
npm run build                       # pass; dist/ produced
npm run test:license-rate-limit     # pass; CORS 200, 30×200 invalid JSON, 270×429 with Retry-After 4/3
```

Each of the 13 exact commands in `.factory/claims.json` was also run
separately and passed in both Playwright projects. The offline claim tests use
their own browser context and close only that context.

- The project’s Playwright Axe scans passed with zero serious or critical
  findings on the landing, all planner stops, Privacy, and Terms. Keyboard
  coverage verifies the skip link and Space activation. The standalone Axe CLI
  could not launch in this container because its bundled ChromeDriver supports
  Chrome 152 while the supplied Playwright Chromium is 145; the project’s
  Playwright Axe integration is the supported browser scanner used here.
- `/opt/fleet/lib/verify-url.sh` passed against the production-faithful local
  build for `/`, `/demo/`, `/privacy/`, and `/terms/`: each returned 200 with
  its expected title, `lang=en`, one h1, a main landmark, zero missing image
  alt attributes, zero unlabeled buttons, and zero browser console errors.
  Desktop load samples were 672 ms, 709 ms, 561 ms, and 556 ms respectively.
- The complete browser suite covers desktop plus 390×844 mobile, invalid input
  recovery, touch targets, keyboard, service-worker updates, offline reload,
  and same-origin-only free/demo request flows.
- Final build budget: JavaScript 38,367 B raw / 12.84 kB gzip; application CSS
  20,667 B raw / 5.38 kB gzip; self-hosted fonts 78,904 B; mobile hero 30,426 B.
  The generated worker `lnp-59a0f29454a6` precaches 23 files. Lighthouse CLI
  could not use the container’s non-stable Playwright Chromium; no new
  Lighthouse score is claimed.

## Run and deploy

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run test:claims
npm run build
npm run test:license-rate-limit
```

Deploy the generated `dist/` with the configured static deployment command:

```sh
/opt/fleet/lib/deploy-static.sh limited-night-planner dist
```

## Known gaps

None in the product repair. New Night Pass sales intentionally remain absent
until the factory registers a checkout product. Existing pass restoration uses
the approved Sociobot verification API only.
