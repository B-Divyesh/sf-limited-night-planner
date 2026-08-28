# Limited Night Planner — independent verification handoff

## Release verdict: FAIL

**Work order:** `limited-night-planner-verify-3`
**Candidate:** `c033d1a0cbc99bd328ed382f5ed36fdec9d3d693`
**Production:** <https://limited-night-planner.sociobot.in/>
**Audited:** 2026-08-28 UTC

Do not release this candidate as complete. The earlier production-only worker installation condition is repaired: production exactly matches the candidate, a fresh worker controls the live app, and a saved plan reloads offline. The candidate still fails two release requirements:

1. A newly returned, unverified `?license=` token is treated as an already verified paid license when the verification service is unavailable.
2. The Sociobot verification endpoint returned HTTP 200 for all 300 rapid invalid-token requests; no HTTP 429 or `Retry-After` threshold was observed.

Additional findings: initial IndexedDB denial prevents starting a plan with an uncaught page error; the repeat-opponent warning is stale after a rounds edit; multiple visible mobile links are below 44×44px; and malformed structured JSON reports an internal TypeError.

## Verification summary

- Clean detached checkout at the exact candidate: `npm ci` passed (0 vulnerabilities), `npm run check` passed, and no separate lint script exists.
- `npm test`: 10/10 passed; `npm run build`: passed, producing `dist/` and a 20-entry `lnp-5ab2dd05f7e7` precache; `npm run test:e2e`: 16/16 passed.
- Live identity: 21/21 deployable non-map files matched the clean `dist/` build. Live/local worker SHA-256: `15fe5a91acf25be24f48e0701aa6cb58ca8ce7e3a0f4b553747b4d72cc312093`.
- Live PWA/offline: pass at 390px, including worker control, saved-plan offline reload, and no page/console errors. Local update activation passes.
- Live desktop and 390px normal flow: five-player inventory/pool/rounds/timer workflow passed with no overflow or normal-flow errors; input bounds and malformed JSON recovery passed.
- Axe: zero serious/critical findings on checked planner screens at both widths and on both legal pages. Keyboard skip link/visible 3px focus and reduced motion passed.
- Privacy/policy/cache/budget: fresh free use contacted only the application origin; no trackers/CDN fonts/scripts; restrictive headers and immutable hashed assets present. JS 33,684 B raw, CSS 19,323 B raw, fonts 78,904 B, mobile hero 30,426 B. Local mobile Lighthouse: 98/100/100/100 (performance/accessibility/best practices/SEO), LCP 2.1 s.

See `.factory/verification-3.md` for exact reproductions, headers, test coverage, severity, and next steps.

## Re-run

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Then repeat the live unavailable-verification check and the rapid verification-endpoint check. The latter must produce HTTP 429 with `Retry-After` at a documented threshold before a PASS is possible.
