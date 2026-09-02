# Limited Night Planner — polish 3 handoff

## Result

**PASS.** Repair commit `9dd570e` is deployed to
<https://limited-night-planner.sociobot.in/>. The production artifact was sent
to the scoped `sf-limited-night-planner` Static Web App on 2026-09-02 UTC.

This repair removes the overbroad fresh-use connectivity statement, makes the
documented query demo path redirect to the canonical demo route, moves focus
and announces document-route changes, and replaces the two remaining jargon or
slogan lines. It preserves the art-deco night-board identity and the offline
PWA class.

## Verification

Fresh clone: `/tmp/limited-night-planner-clean.5QfUll` at `9dd570e`.

- `npm ci` passed with 0 vulnerabilities.
- `npm run check` passed.
- `npm test` passed: 15 tests.
- `npm run build` passed. `dist/` was created; initial JavaScript is 13.9 kB
  gzip across the app bundle and route helpers, and the service worker
  precaches 26 files.
- `npm run test:e2e` passed: 84 browser tests.
- Every exact command in `.factory/claims.json` passed separately from that
  clean clone: 17 claim commands, 34 desktop/mobile executions.
- `npx playwright test tests/e2e/accessibility.spec.ts` passed: 16 tests.
- Local URL verification passed with no console errors, one title, `lang=en`,
  one `<h1>`, one `<main>`, no missing image alternatives, and no unlabeled
  buttons: `.factory/evidence/polish-3/local-verify/verify.json`.

Production checks after deployment:

- `verify-url.sh` passed for `/`:
  `.factory/evidence/polish-3/live-root-verify/verify.json`.
- The live route check covers `/`, `/demo/`, `/privacy/`, `/terms/`, and the
  designed 404 at desktop and mobile. It records route titles, metadata,
  Apple icon, focus announcements, query-demo redirect, no horizontal mobile
  overflow, and zero serious/critical Axe findings:
  `.factory/evidence/polish-3/live-route-check.json`.
- The deliberate 404 request produces the expected network message only. All
  normal routes have no console errors. Every navigational link returned 200;
  the 404 page's `#main` skip link is recorded as a same-document fragment.
- Live mobile Lighthouse: Performance **98**, Accessibility **100**, FCP
  1,484 ms, LCP 1,584 ms, CLS 0.0703, with no runtime error:
  `.factory/evidence/polish-3/live-lighthouse-mobile.json`.
- Visual checks were reviewed at
  `.factory/evidence/polish-3/live-root-desktop.png` and
  `.factory/evidence/polish-3/live-demo-mobile.png`.

## How to run

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Run each `test` command from `.factory/claims.json` separately to repeat the
claim matrix. Open `/demo/` or `?demo=1` for isolated sample data. The query
entry immediately resolves to `/demo/`.

## Known gaps

None. Plans remain local to the browser. The demo uses its own storage space,
has reset and real-plan actions, and does not touch ordinary plans.
