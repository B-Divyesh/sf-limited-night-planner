# Independent verification 6 — FAIL

**Audited:** 2026-09-01 UTC

**Work order:** `limited-night-planner-verify-6`

**Candidate commit:** `2006882bd834e7bfa773d5e9d546ac20975ae9ee`

**Production URL:** <https://limited-night-planner.sociobot.in/>

**Verdict:** **FAIL — do not release this candidate as complete.**

The live static PWA matches the candidate and the core planning job works. The
mandatory first-read and one-click demo gates pass, every listed claim command
passes, and the production build is fast. The candidate nevertheless fails the
acceptance contract because text is lost at 200% sizing, keyboard/screen-reader
navigation is incomplete, and the claims manifest omits user-facing promises.

No product source was modified during verification.

## Release-blocking findings

### High — 200% text sizing clips content on the 390 px layout

In a fresh 390×844 Chromium context, applying a 200% root text size caused the
landing page to lose content:

- the headline's `TABLETOP` text was clipped at the right edge;
- the final free-tools fact was clipped;
- the header wordmark and navigation overlapped;
- affected text boxes extended to x=421 while the viewport and document
  scroll width both remained 390 px, so the hidden text could not be reached by
  horizontal scrolling.

The direct cause is the enlarged content extending past the viewport while
`.landing` uses `overflow: hidden`. This fails the attached accessibility rule
that text resize to 200% must not lose content.

### High — mandatory claims coverage is incomplete

All 13 entries currently in `.factory/claims.json` have one tagged test and all
pass. However, the shipped product makes additional promises that have no
manifest entry and no dedicated `@claim:` test:

- `src/app.ts`: “The timer continues if you switch tabs.” The existing timer
  test checks reload persistence, not a background-tab transition.
- `privacy/index.html`: “Start over removes the current plan; archived plans
  can be removed individually.” No claim entry covers either deletion outcome.
- `privacy/index.html`: “The app itself does not set analytics cookies.” The
  no-third-party request test does not assert the cookie jar.
- The unlocked Night Pass panel says “Save reusable snapshots on this device.”
  The current claim test creates an archive but does not reload or reopen it.

Independent smoke checks found zero cookies and confirmed that Start over
removes the current plan after confirmation. Those spot checks do not replace
the required clean-sandbox tagged regressions. Under the supplied claims
contract, unlisted claims are release-blocking.

### High — keyboard and screen-reader navigation misses required focus behavior

- `/privacy/` and `/terms/` contain no skip link and their `<main>` elements
  have no skip target. The first Tab focuses “← Limited Night Planner”. The
  attached accessibility and site-structure rules require a skip link on every
  page.
- Activating a planner step replaces the view, then attempts to focus its
  `<h1>`. The heading has no `tabindex`, so focus actually lands on `<body>`.
  The `aria-live` announcer remains empty. A keyboard/screen-reader user is not
  moved to or told about the new step as required.

Axe reported zero serious or critical rule findings, but these interaction
issues are not detected by the automated ruleset.

### Medium — the mandatory landing copy audit is incomplete

`.factory/copy-audit.md` audits the first-screen copy only. It omits the
sentences in “How the planner works” and the footer, including the pairing,
timer, local-data, and generated-art statements. The attached plain-words
contract requires every landing-page sentence and its word count.

## Mandatory opening gates

### Claims

The first pre-install command could not start because a clean clone had no
`@playwright/test` package. After the required locked install, every exact
command from `.factory/claims.json` passed in both configured projects. No
claim assertion failed.

| Claim | Exact command result |
| --- | --- |
| `core-planning` | PASS — desktop and 390 px mobile |
| `demo-sandbox` | PASS — desktop and 390 px mobile |
| `offline-after-first-visit` | PASS — desktop and 390 px mobile |
| `local-plan-data` | PASS — desktop and 390 px mobile |
| `no-third-party-requests` | PASS — desktop and 390 px mobile |
| `json-export` | PASS — desktop and 390 px mobile |
| `csv-export` | PASS — desktop and 390 px mobile |
| `first-cycle-pairings` | PASS — desktop and 390 px mobile |
| `timer-persistence` | PASS — desktop and 390 px mobile |
| `free-core-tools` | PASS — desktop and 390 px mobile |
| `night-pass-sales-unavailable` | PASS — desktop and 390 px mobile |
| `round-cycle-warning` | PASS — desktop and 390 px mobile |
| `offline-export` | PASS — desktop and 390 px mobile |

Each grep selects one tagged test in each browser project: 26 passing browser
executions across the 13 commands.

### Cold first-read — PASS

Fresh desktop Chromium, 1440×900, service worker blocked, no interaction:

- **What it does:** “Plan a fair tabletop event.”
- **For whom:** “For hosts using mixed components…”
- **What to click first:** **Try it with sample data**, beside “See a ready
  five-player host sheet.”

The same content and action were visible in the first 390×844 viewport. One
click opened `/demo/`, immediately showed **Saturday mixed box night**, the
300/237 component board, and the persistent **Demo — sample data, nothing is
saved** banner with **Reset demo** and **Start for real**.

## Clean-checkout quality gates

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate and worktree | PASS | Started clean at the exact requested SHA. |
| Locked install | PASS | `npm ci`: 62 packages added, 63 audited, 0 vulnerabilities. |
| Type check | PASS | `npm run check` (`tsc --noEmit`). |
| Unit/integration tests | PASS | `npm test`: 11/11 in two files. |
| Lint | N/A | No lint script or lint configuration is present. |
| Exact production build | PASS | `npm run build`; `dist/` created; worker `lnp-59a0f29454a6` precaches 23 files. |
| Full browser suite | PASS | `npm run test:e2e`: 62/62 across desktop and 390 px mobile. |
| Listed claim commands | PASS | 13/13 commands; 26/26 project executions. |
| Live endpoint allowance | PASS | 30 readable 200 responses, then 270 HTTP 429 responses, all with `Retry-After` 4 or 3. |

## End-to-end product evidence

A fresh real plan named **QA mixed collection night** used five named players,
300 compatible components, and an excluded 500-component group with different
backs. Direct pools of 45 plus a reserve of 12 produced:

- 300 usable, 237 needed, 63 spare, **Ready with room**;
- five rounds, five byes, and all ten opponent pairs exactly once;
- a host sheet containing the included group and exception note, without the
  excluded 500-component group;
- persisted event, inventory, inclusion, and host-note state after reload;
- a white print view with navigation and tools hidden.

The demo timer moved from `45:00` to `44:59` and remained `44:59` after reload.
JSON export contained the sample event and both inventory groups. CSV export
was 1,015 bytes and 26 lines with inventory and round headers.

Recovery checks passed: player values 1 and 65 corrected to 2 and 64 with
explicit messages; counts -1 and 1,000,001 corrected to 0 and 1,000,000;
schema-invalid JSON preserved the plan and gave the documented recovery text;
canceling Start over preserved the plan, while confirming removed it after
reload. The empty inventory state names the next action.

At normal text size, every planner stop fit within 390 px and every effective
visible control met 44×44 px. Desktop and mobile flows had no uncaught page
errors. A focused standard control showed a 3 px brass ring. Reduced-motion
Chromium used `scroll-behavior: auto`, removed the hero transform, and reduced
transitions/animations to 0.01 ms.

## Accessibility and structure

- Independent Playwright Axe scans found zero serious/critical findings on the
  live landing, all four planner stops at 390 px, the desktop host sheet,
  Privacy, and Terms.
- `/opt/fleet/lib/verify-url.sh` passed `/`, `/demo/`, `/privacy/`, and
  `/terms/`: each returned 200 with a title, `lang=en`, one h1, one main,
  complete image alt attributes, labeled buttons, and zero console errors.
- All four standard routes expose distinct titles, canonical URLs,
  descriptions, Open Graph metadata, and Twitter cards. The four internal
  links returned 200; an unknown route returned the designed HTTP 404.
- The skip-link and 200%-text defects above remain release blockers despite
  the automated scanner results.

## Privacy, delivery, and PWA

- A complete live demo and real-planner flow requested only
  `https://limited-night-planner.sociobot.in`; there were no analytics, CDN
  fonts, trackers, or plan-data requests. A separate cookie check found none.
- The optional existing-license request goes only to the documented Sociobot
  product verification endpoint. Its CORS preflight returned 200 for the
  product origin, and its observed per-client allowance was 30 requests before
  429 responses with `Retry-After`.
- Live HTML carries CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, a
  strict-origin referrer policy, and restrictive Permissions-Policy.
- HTML, manifest, and worker revalidate after 30 seconds. Hashed assets use
  `public, max-age=31536000, immutable`.
- The live worker `lnp-59a0f29454a6` was activated and controlling the page,
  with versioned static/page caches and the module script cached. Its update
  check completed with no waiting worker. The repository's synthetic update
  regression passed and proved **Update now** activates a changed worker.
- After going offline, `/demo/`, `/privacy/`, and `/terms/` reloaded from the
  worker with their expected content and no console/page errors. Demo CSV
  export still worked offline.
- The manifest has standalone display, a versioned start URL, palette-matched
  theme/background colors, 192/512 icons, and a 512 px maskable icon.

## Deployment identity and performance

All 30 publicly deployable files in the candidate `dist/` matched the custom
domain byte-for-byte by SHA-256. `staticwebapp.config.json` correctly remained
unpublished and returned 404. The live deployment is the tested candidate.

| Budget or metric | Result |
| --- | --- |
| Initial app JavaScript | 38,367 B raw / 12.84 kB gzip — PASS |
| Application CSS | 20,667 B raw / 5.38 kB gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Lighthouse performance | 98 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.2 s / 1.4 s / 0.039 / 150 ms — PASS |
| Total transfer | 134 KiB — PASS |

Lighthouse did not report lab INP. Direct interaction tests remained
responsive.

This is a static PWA, not a library, CLI, or product backend. Consumer-package,
backend concurrency/persistence/health, and sign-in-tenant checks are not
applicable. AI assistance would not improve the brief's rules-neutral,
local-first core; import/export already covers the implied portability need.

## Required next steps

1. Make the 390 px landing and header retain all content at 200% text size;
   remove clipping and allow the header to reflow.
2. Add skip links and targets to Privacy and Terms. Give the planner h1 a
   programmatic focus target and announce each step change.
3. Add one manifest entry and one tagged observable test for every uncovered
   promise, or remove/narrow those promises.
4. Expand `.factory/copy-audit.md` to cover every sentence on the landing page.
5. Rerun every claim command, the full browser suite, the 200% text check, and
   independent live verification before release.
