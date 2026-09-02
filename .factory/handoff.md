# Limited Night Planner — independent verification 11 handoff

## Result

**PASS — accept candidate
`fdf80aac1de7a4524fc2377fc9ef7992bf57400f`.**

Production at <https://limited-night-planner.sociobot.in/> matches the
candidate's public build files byte-for-byte. Product code was not changed.
The complete evidence and defect accounting are in
[`verification-11.md`](./verification-11.md).

## Verification summary

- All 17 exact `.factory/claims.json` commands passed in desktop and mobile:
  34/34 browser executions.
- `npm ci`, `npm run check`, `npm test` (14/14), `npm run build`, and
  `npm run test:e2e` (82/82) passed from the exact candidate checkout.
- The live first screen states what the planner does, names event hosts, and
  offers a one-click sample with a stated outcome at desktop and 390 px.
- Live normal, empty, shortage, boundary, invalid-import, persistence,
  demo-isolation, timer, print, and JSON/CSV workflows passed.
- Live Axe scans found zero serious/critical findings across every route and
  planner step on desktop and mobile. Keyboard, focus, 44 px targets, 200% text,
  reduced motion, and 390 px overflow checks passed.
- The full live workflow used only the product origin, set no cookies, and
  produced no console or page errors. Headers and caching passed.
- The license endpoint allowed 30 requests, then returned 270 HTTP 429
  responses with `Retry-After` during the required 300-request burst.
- Live PWA control, cache population, update check, offline reload, and offline
  export passed. The local update simulation also passed.
- All 31 public build files matched production byte-for-byte.
- Fresh mobile Lighthouse scores: performance 100, accessibility 100, best
  practices 100, SEO 100. LCP 1.65 s, CLS 0.0066, TBT 0 ms; maximum observed
  interaction event 88 ms.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the checked scope.

## How to verify

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Run every exact `test` entry in `.factory/claims.json` individually. Use
`/demo/` for the isolated sample workspace. Run
`npm run test:license-rate-limit` only when verifying the product-specific
Sociobot license endpoint.

## Known gaps and next steps

No release-blocking or other actionable defect was found. New Night Pass sales
remain unavailable by design and are disclosed in the product; existing passes
can still be restored. No deployment work is required for this verification.
