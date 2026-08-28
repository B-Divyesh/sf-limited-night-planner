# Independent verification 3 — FAIL

**Audited:** 2026-08-28 UTC
**Candidate commit:** `c033d1a0cbc99bd328ed382f5ed36fdec9d3d693`
**Production URL:** <https://limited-night-planner.sociobot.in/>
**Verdict:** **FAIL — do not release this candidate as complete.**

The earlier production-only service-worker condition is repaired: the live deployment is the exact candidate artifact, installs a worker, and restores saved state offline. The release verdict remains FAIL because a newly returned, unverified license is treated as valid when verification is unavailable, and the required Sociobot verification-API rate limiting was not observed.

## Release blockers

### High — an unverified returned license receives the paid archive while verification is unavailable

Fresh 390px production-browser check:

1. A new browser context denied only requests to `https://api.sociobot.in/**`.
2. It opened `https://limited-night-planner.sociobot.in/?license=qa-not-a-license`, then created a plan and opened **Host sheet**.

The app removed the query token and stored:

```json
{"valid":true,"checkedAt":0,"reason":"pending"}
```

It displayed **Archive current plan** and the notice “Offline: using your last verified Night Pass.” The token had no successful verification. Expected behavior is that offline paid access may use an actual previously successful cached verdict, but a newly captured pending token must remain locked until its first successful verification.

### High — the required verification-endpoint rate limit was not observed

A fresh burst of 300 rapid requests, with distinct invalid tokens, to:

`GET https://api.sociobot.in/api/v1/products/limited-night-planner/verify?license=…`

returned 300 HTTP 200 responses. A follow-up request was also HTTP 200. No request returned HTTP 429 and no `Retry-After` header was present, so no threshold was observed. This does not meet the work order requirement that a product API endpoint respond with 429 and `Retry-After` during a rapid-request burst.

The ordinary invalid-license response was correct (`{"valid":false,"reason":"invalid"}`), with `Cache-Control: no-store` and origin-specific CORS for `https://limited-night-planner.sociobot.in`.

## Clean checkout and quality gates

Verification used a fresh detached worktree at the candidate SHA; product source was not modified.

| Check | Result | Evidence |
| --- | --- | --- |
| Install | PASS | `npm ci`: 62 packages, 0 vulnerabilities. |
| Type check | PASS | `npm run check` (`tsc --noEmit`). |
| Lint | N/A | No lint script or lint configuration exists. |
| Unit/delivery tests | PASS | `npm test`: 10/10 tests passed. |
| Exact production build | PASS | `npm run build` produced `dist/`; generated worker precached 20 files as `lnp-5ab2dd05f7e7`. |
| Browser suite | PASS | `npm run test:e2e`: 16/16 Chromium tests passed at 1440×900 and 390×844, including service-worker update and offline reload. |
| Build budgets | PASS | Initial JS 33,684 B raw / 11,576 B gzip; app CSS 19,323 B raw / 5,131 B gzip; fonts 78,904 B; mobile hero 30,426 B. All are within 200 KB / 50 KB / 120 KB / 300 KB budgets. |
| Local mobile Lighthouse | PASS | Lighthouse 13.0.1: 98 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 1.7 s, LCP 2.1 s, CLS 0, TBT 0 ms. |

## Product and browser exercise

Fresh live desktop (1440×900) and mobile (390×844) sessions exercised the brief’s core job:

- Created a five-player event, entered five names, added 300 compatible components, selected direct pools of 45 with a 12-component reserve, generated six rounds, observed a bye each round, and started the timer (`45:00` to `44:59`).
- The plan had no horizontal overflow at either width (390px client and scroll widths were equal on mobile), and normal runs had no console or page errors.
- Boundary input recovery worked: players `65 → 64` and `1 → 2`; inventory count `-1 → 0`.
- Syntactically malformed JSON retained the existing plan and displayed actionable recovery text.
- The existing automated browser suite additionally covered JSON/CSV export, reset confirmation, print treatment, persistence, update activation, legal pages, and inventory upper bounds.
- Fresh free-use request capture contacted only `https://limited-night-planner.sociobot.in`; there are no analytics, trackers, CDN fonts, or third-party scripts. Data is stored locally in IndexedDB. Sign-in is not implemented, so no identity tenant is applicable.

## PWA, deployment, and response policy

- **Candidate identity:** all 21 deployable non-source-map files in the clean `dist/` matched production byte-for-byte. Local and live `sw.js` SHA-256: `15fe5a91acf25be24f48e0701aa6cb58ca8ce7e3a0f4b553747b4d72cc312093`.
- `/staticwebapp.config.json` returned 404 on production and is absent from the generated precache. This confirms the prior deployment-only precache condition is repaired.
- A fresh live worker was controlled and active at version `lnp-5ab2dd05f7e7`, with no waiting worker.
- At 390px, after creating and saving “Live offline persistence,” `context.setOffline(true)` followed by reload restored the plan, displayed the offline banner, remained controlled by the worker, and produced no console/page errors.
- The local exact-production update test passed: a waiting worker displayed **Update now**, activated, and reloaded into the new worker version.
- The manifest supplies standalone display, a versioned start URL, themed background, 192/512 icons, and a 512px maskable icon.
- Production has HTTPS/HSTS, restrictive CSP (`connect-src` is self plus the Sociobot API), `frame-ancestors 'none'`, restrictive Permissions-Policy, `nosniff`, and strict-origin referrer policy. Hashed JS was `public, max-age=31536000, immutable`; HTML, manifest, and worker use 30-second revalidation; the manifest MIME type is `application/manifest+json`.

## Accessibility, keyboard, responsive, and design checks

- Axe found zero serious/critical findings on the landing, Format, and Host sheet screens at desktop and 390px, and zero on Privacy and Terms at 390px.
- Keyboard Tab reached “Skip to planner”; the visible focus style was a `3px` brass outline. Keyboard activation of the primary planner path passed in the browser suite.
- Reduced-motion evaluation returned `scroll-behavior: auto` and `0.00001s` transition/animation durations.
- The visual system matches the documented product-specific night-service thesis and self-hosts its two font families. The original hero artwork has model, date, prompt, and licensing provenance in `.factory/design.md`.

## Additional defects

### Medium — initial local-storage denial leaves plan creation unusable

In a production browser context where `indexedDB.open()` reported `SecurityError`, the landing page loaded but **Start a night** emitted an uncaught `Denied` page error, stayed on the landing page, and gave no recovery guidance. The local-first product needs an actionable storage-unavailable state.

### Medium — repeat-opponent guidance does not refresh after changing rounds

For five players, changing **Rounds** from 3 to 6 left the Format screen without the promised “opponents begin repeating after round 5” guidance. It is only calculated on a full Format render, so a host can move directly to the six-round schedule without seeing the warning.

### Medium — visible mobile links do not meet the 44×44px target minimum

At 390px on Host sheet, measured visible links included the brand (207×40), purchase disclosure Terms (35×17), and footer Privacy (46×22), Terms (39×22), and Source (45×22). These are smaller than the required 44×44px touch target baseline.

### Low — malformed structured JSON exposes implementation text

Importing `{"version":1,"eventName":"shape","inventory":[null]}` retained the plan but announced `Cannot read properties of null (reading 'id')`. Schema-invalid imports should use the same clear recovery wording as malformed JSON.

## Required next steps

1. Store a pending returned token as unverified and grant offline paid access only after one successful verification has been cached.
2. Add verification-endpoint request limiting that returns HTTP 429 with `Retry-After`, then rerun the burst check and record the threshold.
3. Provide a usable local-storage-unavailable state, refresh repeat-opponent guidance with the input change, and make all visible mobile links at least 44×44px.
4. Validate import item shapes before dereferencing and return actionable import guidance.

Library/CLI consumer checks and backend concurrency/health checks are not applicable to this static offline PWA. The paid license verification request is the only server-side endpoint in product scope.
