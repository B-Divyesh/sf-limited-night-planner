# Independent verification 5 — FAIL

**Audited:** 2026-08-30 UTC  
**Candidate commit:** `cfdf33eca91d2f1ad401a7d61235c2145cdcc632`  
**Production URL:** <https://limited-night-planner.sociobot.in/>  
**Verdict:** **FAIL — do not release this candidate as complete.**

The deployed static PWA exactly matches the candidate, its required first-read
and demo gates pass, and the core planner works well. The release still fails
the acceptance contract because the Sociobot Night Pass verification endpoint
is unavailable, does not enforce the required observable 429 limit, and cannot
restore existing passes. The claims manifest also treats the presence of the
restore control as proof that restoration works, which does not test the
claimed outcome.

## Release blockers

### High — license verification is unavailable and no rate limit can be observed

The repository's intentional live contract check failed:

```text
$ npm run test:license-rate-limit
requestCount: 300
statusCounts: { "503": 300 }
retryAfterOnEvery429: false
Error: Expected ... HTTP 429 with Retry-After
```

No successful-request allowance was observable: all 300 concurrent requests
returned HTTP 503, none returned 429, and no `Retry-After` header was present.
This directly fails the supplied requirement for every server-side endpoint
used by the product.

A separate live browser check pasted an invalid token into **Have an existing
license? Restore it**. Chromium requested
`https://api.sociobot.in/api/v1/products/limited-night-planner/verify`, then
reported `net::ERR_FAILED`; the archive stayed locked and the UI said it could
not verify the pass. A direct request showed why:

```text
HTTP/2 503
content-type: text/html; charset=utf-8
```

The 503 response was the Azure service-unavailable page and omitted
`Access-Control-Allow-Origin`, so the browser could not read it. This is fresh
evidence of an external deployment/service failure, not a mismatch in the
static candidate.

### High — a mandatory claim test does not prove its stated outcome

`.factory/claims.json` claims: **“New Night Pass purchases are not available
yet; existing passes can still be restored.”** Its tagged test only confirms
that there is no checkout link and that a **Verify license** button is visible.
It never submits a fixture response or proves an existing pass restores archive
access. The live outcome is currently false because the endpoint above is
unavailable. Under the supplied claims contract, a control's presence is not
proof that the promised result happens.

The README also says the planner “warns before another [round-robin] cycle
begins,” and the host tools say exports “work offline.” Those outcomes are not
individually listed in `.factory/claims.json`. They have partial coverage in the
broader browser suite, but the manifest does not map each sentence to its own
observable demo claim test as required.

## Mandatory opening gates

The untouched clone was clean and exactly at the candidate SHA. The exact
claim commands were attempted before any other product checks; as expected for
an uninstalled clean clone, they initially could not load `@playwright/test`.
After the required locked install (`npm ci`), every exact command from
`.factory/claims.json` passed:

| Claim | Exact command result |
| --- | --- |
| `core-planning` | PASS — 2 tests |
| `demo-sandbox` | PASS — 2 tests |
| `offline-after-first-visit` | PASS — 2 tests |
| `local-plan-data` | PASS — 2 tests |
| `no-third-party-requests` | PASS — 2 tests |
| `json-export` | PASS — 2 tests |
| `csv-export` | PASS — 2 tests |
| `first-cycle-pairings` | PASS — 2 tests |
| `timer-persistence` | PASS — 2 tests |
| `free-core-tools` | PASS — 2 tests |
| `night-pass-sales-unavailable` | PASS — 2 tests, but inadequate as described above |

Each grep also selects the shared manifest-audit test, hence two tests per
command.

### Cold first-read result — PASS

Fresh Chromium profile, 1440×900, service worker blocked, no interaction:

- **What it does:** “Plan a fair tabletop event.”
- **For whom:** “For hosts using mixed components…”
- **What to click first:** the prominent **Try it with sample data** action,
  paired with “See a ready five-player host sheet.”

One click opened `/demo/`, immediately showed **Saturday mixed box night**,
the 300/237 component board, and the persistent **Demo — sample data, nothing
is saved** banner with reset and real-plan actions. This mandatory gate passes.

## Clean-checkout quality gates

| Check | Result | Evidence |
| --- | --- | --- |
| Install | PASS | `npm ci`: 62 packages added, 63 audited, 0 vulnerabilities. |
| Unit/integration | PASS | `npm test`: 11/11 tests in 2 files. |
| Type check | PASS | `npm run check` (`tsc --noEmit`). |
| Lint | N/A | No lint script or lint configuration exists. |
| Exact production build | PASS | `npm run build`; `dist/` created; worker cache `lnp-112086bbd2ef`. |
| Full browser suite | PASS | `npm run test:e2e`: 58/58 at desktop and 390 px. |
| All claim commands | PASS with coverage defect | All 11 exact commands passed after install. |
| Live rate-limit contract | **FAIL** | 300×503; no 429 and no `Retry-After`. |

## Live core product exercise

A fresh real plan named **QA mixed collection night** used five named players,
300 compatible components, and a separate excluded 500-component group with
different backs. Direct pools of 45 plus a reserve of 12 correctly produced:

- 300 usable, 237 needed, 63 spare, **Ready with room**;
- five rounds, five byes, and 10 unique opponent pairings;
- a host sheet containing the included group and host exception note while
  excluding the incompatible group;
- persisted event, both inventory rows, counts, and inclusion state after a
  reload;
- a print view with route navigation/tools hidden and a white background.

The live demo timer changed from `45:00` to `44:59` and remained `44:59` after
reload. JSON export contained the sample event and both inventory groups. CSV
export was 1,015 bytes/26 rows and contained both inventory and round headers.
The normal flows produced no console errors or uncaught page errors.

At 390×844, the page had no horizontal overflow. Player values `1` and `65`
recovered to `2` and `64` with explicit messages. Counts `-1` and `1,000,001`
recovered to `0` and `1,000,000` with explicit messages. Malformed JSON kept
the current plan and said to choose a planner JSON backup. The only element
reported below 44 px was the deliberately 1 px-wide file input inside its
full-width 44 px import label; all effective controls met the target.

Keyboard-only use focused **Skip to planner** first with a visible 3 px brass
outline, Enter moved to the planner, and Space started a real plan. Reduced
motion matched the media query, disabled smooth scrolling and hero transform,
and reduced animations to an effectively instant duration.

## Accessibility and structure

- Independent Playwright Axe scans found zero serious/critical findings on the
  live landing, Inventory, Format, Schedule, Host sheet, Privacy, and Terms
  views. The same result held on the 390 px host sheet.
- `verify-url.sh` passed live on `/`, `/demo/`, `/privacy/`, and `/terms/`:
  correct title/lang, one h1, main landmark, no missing image alt, no unlabeled
  buttons, and no console errors.
- Every standard route has a unique plain title, canonical URL, description,
  Open Graph/Twitter metadata, one h1, and one main landmark. The designed
  unknown route returns HTTP 404. All eight unique visible links returned 200.

## Privacy, headers, caching, and PWA

- A complete live demo flow requested only
  `https://limited-night-planner.sociobot.in`. No analytics, trackers, CDN
  fonts, third-party scripts, or plan-data requests were observed.
- The explicit license action contacted only `api.sociobot.in`, but failed as
  described above.
- Playwright saw CSP with `frame-ancestors 'none'`, restrictive
  Permissions-Policy, HSTS, `nosniff`, and strict-origin referrer policy on the
  live HTML response.
- HTML, manifest, and worker use 30-second revalidation. Hashed assets use
  `public, max-age=31536000, immutable`.
- Live worker `lnp-112086bbd2ef` was activated and controlling the page with no
  waiting worker. Its versioned static/pages caches existed and contained the
  module script. An update check completed cleanly. The repository's explicit
  worker-update test installed a changed waiting worker, showed **Update now**,
  activated it, and reloaded into the new version.
- After switching Chromium offline, `/demo/` reloaded under worker control with
  its sample plan and offline banner; `/privacy/` also loaded offline. No
  browser errors occurred.
- The manifest uses standalone display, versioned start URL, matching theme and
  background colors, 192/512 icons, and a 512 px maskable icon.

## Deployment identity and performance

All 30 candidate output files that are publicly deployed matched the custom
domain byte-for-byte by SHA-256, including HTML, app assets, manifest, worker,
legal pages, offline page, maps, icons, and the 404 response. The deployment is
the tested candidate, not an older build.

| Budget | Result |
| --- | --- |
| Initial app JavaScript | 38,334 B raw / 12,821 B gzip — PASS |
| Application CSS | 20,667 B raw / 5,378 B gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |

Fresh mobile Lighthouse: performance 91, accessibility 100, best practices
100, SEO 100; FCP 1.4 s, LCP 1.7 s, CLS 0.003, TBT 380 ms, speed index 1.4 s.
Lighthouse did not provide field INP in this lab run.

This is a static PWA, not a library/CLI or product backend. Consumer package,
backend concurrency/persistence/health checks, and sign-in tenant checks are
not applicable. The only server endpoint used by the PWA is the failed billing
verification path tested above.

## Required next steps

1. Restore the public Sociobot billing verification service and CORS response.
2. Enforce and document a per-client allowance that returns 429 with
   `Retry-After`, then make `npm run test:license-rate-limit` pass from a fresh
   external client.
3. Replace the Night Pass claim test with a recorded valid fixture that submits
   a token and proves archive access becomes available; retain a separate live
   smoke test for the gateway.
4. Add manifest entries/tests for the round-cycle warning and offline export
   sentences, or narrow/remove those claims.
