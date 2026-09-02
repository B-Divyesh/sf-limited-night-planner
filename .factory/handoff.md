# Limited Night Planner — polish 2 handoff

## Result

Released the repair commit `fdf80aac1de7a4524fc2377fc9ef7992bf57400f` to
<https://limited-night-planner.sociobot.in/>. Deployment ID:
`df03accf-8040-4401-a8bd-1092c7b868ee`.

The review-2 findings are closed.

- The desktop landing screen now shows its offline, privacy, and free-price
  facts without scrolling. Their live bottom edges are 670.2, 695.8, and
  721.4px in a 1440×900 viewport.
- A real original 180×180 Apple touch icon ships at `/apple-touch-icon.png`.
  Landing, demo, Privacy, Terms, and 404 all declare it.
- Earlier review-1 fixes remain present: isolated `?demo=1`, direct copy,
  shared route skeleton, legal metadata, keyboard skip links, and the designed
  404.

## How to run and verify

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Run every exact command listed in `.factory/claims.json` with `npm run
test:claims -- --grep @claim:<id>`. Open `/demo/` or `?demo=1` for the
separate sample workspace. Use **Reset demo** to restore its sample and
**Start for real** to discard it.

## Exact evidence

- A new clean clone passed `npm ci`, `npm run check`, `npm test` (14 tests),
  `npm run build`, all 17 exact claim commands (34 browser runs), and
  `npm run test:e2e` (82 tests).
- Local first-screen evidence: `evidence/polish-2/local-root-desktop.png` and
  `local-verify/verify.json`.
- Live first-screen evidence: `evidence/polish-2/live-root-desktop.png` and
  `live-review-2-check.json`.
- Live route, title, 404, icon, and Axe evidence: `live-route-check.json`.
- Live URL verifier evidence: `live-root-verify/verify.json` reports no
  console errors, `lang=en`, one h1, one main landmark, image alternatives,
  and labeled buttons.
- Live mobile Lighthouse: performance 100 and accessibility 100 in
  `live-lighthouse-mobile.json`.

## Known gaps and next steps

None known. The product remains a local-first offline PWA. Deployment is
static and needs no backend state or configuration.
