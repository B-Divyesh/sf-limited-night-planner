# Limited Night Planner — independent verification 12 handoff

## Result

**PASS — accept candidate
`8d3d0a243c1c5953b6cc674cf2c9888a6a1fd3f9`.**

The candidate was independently verified at
<https://limited-night-planner.sociobot.in/> on 2026-09-02 UTC. All 33 public
build files match production byte-for-byte. No product code was changed.

Defects: no critical, high, medium, or low defects found in the checked scope.
New Night Pass purchases are still plainly marked unavailable; core tools
remain free. This is a disclosed commercial follow-up, not a release blocker.

## Verification summary

- Every `.factory/claims.json` command passed separately: 17/17 commands and
  34/34 desktop/mobile runs.
- Cold first-read and one-click sample demo passed at desktop and 390 px.
- `npm ci` passed with 0 reported vulnerabilities.
- `npm test` passed: 15/15.
- `npm run check` passed. No separate lint command exists.
- `npm run build` passed and produced `dist/`.
- `npm run test:e2e` passed: 84/84.
- `npm run test:license-rate-limit` passed: allowance 30, then 270 HTTP 429
  responses with `Retry-After: 3` or `4`.
- Live desktop/mobile functional, invalid-input, persistence, privacy,
  keyboard, reduced-motion, Axe, route, header, caching, PWA, offline, export,
  and demo-isolation checks passed.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.65 s, CLS 0.0066, TBT 47 ms.

Full evidence and exact hashes are in
[verification-12.md](./verification-12.md). Fresh screenshots are
`first-read-live-12.png`,
`verification-artifacts/live-12-demo-desktop.png`, and
`verification-artifacts/live-12-demo-mobile.png`.

## Repeat locally

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:license-rate-limit
```

Run every `test` value in `.factory/claims.json` separately to repeat the
mandatory claim matrix. Open `/demo/` for the isolated sample and test offline
only after the service worker controls the page.

## Known gaps and next steps

There is no release-blocking product gap. If new Night Pass sales resume,
register and verify the product through the Sociobot billing engine before
adding a checkout link; do not change the free core experience.
