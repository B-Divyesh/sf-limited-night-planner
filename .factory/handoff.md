# Limited Night Planner — repair handoff

## Release verdict: PASS

**Work order:** `limited-night-planner-repair-4`<br>
**Repaired candidate:** `c033d1a0cbc99bd328ed382f5ed36fdec9d3d693`<br>
**Repair commit:** `0c234c99f042cb9c44d846ca2882373c914bee63`<br>
**Production:** <https://limited-night-planner.sociobot.in/><br>
**Audited and deployed:** 2026-08-30 UTC

The product remains a Vite/TypeScript static offline PWA. It preserves the
existing inventory, pool, schedule, timer, print, export, local-first storage,
and optional Sociobot Night Pass behavior.

## Fixed verifier findings

1. **Unverified returned license could unlock the archive offline — fixed.** A
   returned or pasted token now stores `{ valid: false, checkedAt: 0,
   reason: "pending" }`. Archive access requires a successful verification for
   that token (`checkedAt > 0`), so only a previously verified cached verdict
   can work offline. Regression: `verifier-regressions.spec.ts` blocks only
   `api.sociobot.in`, opens `?license=qa-not-a-license`, and asserts that the
   URL is cleaned, no Archive control is present, and the pending verdict
   remains locked.
2. **Verification endpoint rate limit — verified.** A fresh 300-request burst
   of distinct invalid tokens returned **30 HTTP 200** and **270 HTTP 429**
   responses, with `Retry-After: 3` or `4`. The repeatable live contract
   check is `npm run test:license-rate-limit`; it asserts that a 300-request
   burst gets 429 and `Retry-After` on every rate-limited response. A second
   run inside the same window returned 4×200/296×429 with `Retry-After` 0–4,
   as expected for an already-active limit window.
3. **IndexedDB denial crashed plan creation — fixed.** The planner now opens
   an in-memory plan, shows a persistent recovery banner, and keeps print and
   JSON export usable when browser storage is denied. All archive, reset,
   restore, and import storage writes also fail softly with specific guidance.
   The regression overrides `indexedDB.open()` to throw `SecurityError` and
   verifies no page error, the recovery banner, and host-sheet export.
4. **Repeat-opponent warning was stale — fixed.** The Format screen retains an
   `aria-live` guidance element and refreshes it as numeric inputs change. The
   regression changes five players from five to six rounds and observes “after
   round 5,” then clears it on five rounds.
5. **Mobile links were below 44×44px — fixed.** All links, including the
   masthead, purchase disclosure, footer, and legal-page links, now have a
   44×44px minimum target. The 390px regression measures every visible Host
   sheet link and rejects any undersized target.
6. **Schema-invalid JSON exposed a TypeError — fixed.** Import validation now
   validates inventory item shapes before dereferencing. It returns the same
   actionable backup guidance as malformed JSON. Unit and browser regressions
   cover `{"version":1,"eventName":"shape","inventory":[null]}`.

## Verification evidence

```sh
npm ci                              # 62 packages; 0 vulnerabilities
npm run check                       # pass
npm test                            # 11/11 pass
npm run build                       # pass; dist/; 20-file precache lnp-d1866016e1c7
npm run test:e2e                    # 28/28 pass, desktop and 390px Chromium
npm run test:license-rate-limit     # pass; live endpoint 429 + Retry-After
```

- Playwright Axe found zero serious/critical findings on landing, all planner
  stops, Privacy, and Terms at desktop and 390px. Keyboard skip-link and
  Space activation remain covered. The CLI Axe launcher could not use the
  container's bundled Chrome, so the repository's Playwright Axe integration
  was used (the attached accessibility requirement allows either).
- Local mobile Lighthouse: **99 performance, 100 accessibility, 100 best
  practices, 100 SEO**; FCP 1.5s, LCP 2.0s, CLS 0.006, TBT 0ms.
- Production identity: all **21/21** deployable non-source-map files from
  `dist/` match the live custom domain byte-for-byte. The deployment-only
  `/staticwebapp.config.json` remains 404 and is absent from the worker
  precache. The deployed app bundle is `app-OPbOvCJt.js` (35,589 B raw,
  11,980 B gzip); CSS is 19,511 B raw / 5,150 B gzip; self-hosted fonts total
  78,904 B; mobile hero is 30,426 B.
- Live response policy: HTTPS/HSTS, CSP, Permissions-Policy, `nosniff`, and
  strict-origin referrer policy are present. Hashed assets are immutable for
  one year. A fresh free-use request capture contacted only
  `https://limited-night-planner.sociobot.in`.
- Live browser smoke: desktop five-player scheduling and timer produced no
  console/page errors; 390px had no undersized links; blocked first license
  verification stayed locked; IndexedDB denial recovered; an active worker
  restored a saved plan after an offline reload with no errors. Local browser
  coverage also passes worker update activation, legal routes, print, export,
  import recovery, and reduced-motion behavior.

## Deployment

Built `dist/` with the production command and deployed it to the configured
Azure Static Web App `sf-limited-night-planner` in resource group `sociobot`.
Azure confirmed deployment to its production endpoint; the custom domain was
then checked for exact artifact identity.

## Known gaps / next steps

None. The live billing limiter is deliberately checked separately because it
is a 300-request abuse-protection contract, not a normal offline unit test.
