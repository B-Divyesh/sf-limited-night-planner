# Independent verification 7 — FAIL

**Checked:** 2026-09-01 UTC  
**Work order:** `limited-night-planner-verify-7`  
**Candidate commit:** `c58c494fb2621e4e953ebe766fa5172caf80ce12`  
**Production URL:** <https://limited-night-planner.sociobot.in/>  
**Result:** **FAIL — do not accept this candidate as complete.**

The live deployment matches the candidate and the main planning job works. The
cold first-read and one-click sample gates pass. All configured checks pass
after the locked install. The candidate still misses mandatory accessibility
and claim-proof requirements described below.

No product source was modified during this verification.

## Release-blocking findings

### High — “Import JSON” has no visible keyboard focus

Confirmed on the live `/demo/` host sheet in fresh desktop Chromium:

1. Focus **Export CSV** and press Tab once.
2. `document.activeElement` becomes `input#import-file` and
   `:focus-visible` is true.
3. The input has `opacity: 0`. Its computed focus outline is
   `rgb(224, 180, 76) solid 3px`, so the entire outline is also invisible.
4. The visible 269×48 px **Import JSON** label has `outline: none 0px`.

The control remains operable, but a keyboard user cannot see where focus is.
This does not meet the required designed, visible focus state.

### High — focus-ring contrast on paper is below 3:1

Confirmed on the live real-plan inventory empty state by moving keyboard focus
to **Add first group**. The visible ring is `#E0B44C` on the `#F3E8CC` paper
surface. Their calculated contrast is **1.59:1**, below the required **3:1**.
The same global brass ring is used by standard controls on paper surfaces.

Dark-surface focus rings and the signal-dark custom checkbox/choice rings have
adequate contrast. This finding is limited to the brass ring on paper.

### High — the offline export promise is only partly checked

The host sheet says, “Exports are always free and work offline,” and offers
both **Export JSON backup** and **Export CSV**. The manifest claim
`offline-export` says “Exports work offline.” Its sole tagged check downloads
only CSV while offline. No check downloads the JSON backup offline.

The JSON action works online, and the CSV action works offline. The current
claim check does not confirm the complete plural promise. Confirm both formats
offline or narrow the visible claim and manifest entry to CSV.

## Mandatory opening gates

### Claims

`.factory/claims.json` is present with 17 entries. Before installation, every
listed command was invoked as required; each could not start because the clean
clone had no local `@playwright/test` package. `npm ci` then installed the
locked dependencies with zero reported vulnerabilities. Every exact command
was repeated and passed in both configured projects.

| Claim ID | Installed result |
| --- | --- |
| `core-planning` | PASS — 2/2 |
| `demo-sandbox` | PASS — 2/2 |
| `offline-after-first-visit` | PASS — 2/2 |
| `local-plan-data` | PASS — 2/2 |
| `no-third-party-requests` | PASS — 2/2 |
| `no-analytics-cookies` | PASS — 2/2 |
| `json-export` | PASS — 2/2 |
| `csv-export` | PASS — 2/2 |
| `first-cycle-pairings` | PASS — 2/2 |
| `timer-persistence` | PASS — 2/2 |
| `timer-background` | PASS — 2/2 |
| `free-core-tools` | PASS — 2/2 |
| `night-pass-sales-unavailable` | PASS — 2/2 |
| `plan-deletion` | PASS — 2/2 |
| `reusable-archives` | PASS — 2/2 |
| `round-cycle-warning` | PASS — 2/2 |
| `offline-export` | PASS — 2/2, with the JSON coverage gap above |

Each manifest ID occurs exactly once as an `@claim:<id>` tag in the test
source. The 17 commands produced 34 passing browser executions after install.

### Cold first-read — PASS

Confirmed from a fresh live 1440×900 page and the 390 px layout:

- **What it does:** “Plan a fair tabletop event.”
- **For whom:** “For hosts using mixed components…”
- **What to click first:** **Try it with sample data**, beside “See a ready
  five-player host sheet.”

The action is visible on the first screen and opens `/demo/` in one click. The
result immediately shows **Saturday mixed box night**, the `300/237` component
board, and the persistent **Demo — sample data, nothing is saved** banner with
**Reset demo** and **Start for real**.

## Clean-checkout quality gates

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate and worktree | PASS | Started clean at the exact requested SHA; `origin/main` was the same SHA. |
| Locked install | PASS | `npm ci`: 62 packages added, 63 audited, 0 vulnerabilities. |
| Type check | PASS | `npm run check` completed with no diagnostics. |
| Unit/integration | PASS | `npm test`: 11/11 in two files. |
| Lint | N/A | No lint script or lint configuration is present. |
| Production build | PASS | `npm run build`; `dist/` created; worker `lnp-c8541101da1b` precaches 23 files. |
| Browser suite | PASS | `npm run test:e2e`: 76/76 across desktop and 390 px mobile. |
| Listed claim commands | PASS after install | 17/17 commands; 34/34 project executions. |
| URL structure check | PASS | `/`, `/demo/`, `/privacy/`, and `/terms/` each returned 200 with no console errors. |
| Product endpoint allowance | PASS | 30 readable 200 responses, then 270 HTTP 429 responses; every 429 had `Retry-After: 4` or `3`. |

## End-to-end product checks

The live five-player sample confirms the smallest useful product:

- `300/237` usable/needed components and a 12-component reserve;
- five seating rounds, five byes, and all ten opponent pairs exactly once;
- a timer that advances and retains its value after reload;
- JSON containing the event and both inventory groups;
- CSV with inventory and round headers and 26 lines;
- a host sheet containing the compatible group and exception note while
  omitting the excluded different-back group;
- print media hides navigation and host tools and uses a white page.

A fresh real plan confirmed recovery and boundaries. Player values `1` and
`65` corrected to `2` and `64`. Counts `-1` and `1,000,001` corrected to `0`
and `1,000,000`. A valid 300-component value and event name survived reload.
Six rounds for five players showed the repeat-opponent warning. Schema-invalid
JSON preserved the plan and showed a plain recovery message.

The full browser suite also confirms demo reset/separation, current-plan and
archive deletion, storage-denial guidance, a recorded existing-license flow,
background-tab timer continuity, empty states, and Space/Enter operation.

## Accessibility, responsive layout, and language

- Independent live Axe checks found zero serious or critical results on the
  landing, schedule, host sheet, 390 px host sheet, Privacy, and Terms.
- The repository suite confirms the same result on every planner stop.
- The standard routes have `lang=en`, a route-specific title, one h1, one main
  landmark, complete image alternatives, and no unlabeled buttons.
- Privacy and Terms skip links move keyboard focus to main content. Planner
  step changes focus the h1 and announce the new stop.
- At 390×844 with a 200% root text size, document width remained 390 px, no
  checked text box was clipped, and header items did not overlap.
- Visible composite controls meet the 44×44 px target. The transparent file
  input is contained by a visible 269×48 px label.
- Reduced-motion Chromium reported `scroll-behavior: auto`, no hero transform,
  and a `0.01 ms` hero transition.
- `.factory/copy-audit.md` covers the landing copy. All listed prose is at most
  22 words, and the product-facing banned-word scan is clear.

The two manual focus findings remain release blockers even though automated
accessibility checks report no serious or critical rule result.

## Privacy, response policy, caching, and PWA

- A complete live landing, demo, and real-plan flow requested only
  `https://limited-night-planner.sociobot.in` and set zero cookies.
- The same flow produced zero console errors and zero uncaught page errors.
- Root HTML returned CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, a
  strict-origin referrer policy, and a restrictive Permissions-Policy.
- HTML revalidates after 30 seconds. The live module uses
  `public, max-age=31536000, immutable`.
- All internal links found across the four standard routes returned 200. The
  two external links were listed but not requested. An unknown route returned
  the designed page with HTTP 404.
- The manifest has standalone display, a versioned start URL, the product
  colors, 192/512 icons, and a 512 px maskable icon.
- Live worker `lnp-c8541101da1b` activated and controlled the page. Its update
  check left no waiting worker. The local synthetic update check confirms that
  **Update now** activates a changed worker and reloads into it.
- A fresh dedicated mobile context reloaded `/demo/` offline and exported the
  CSV with no console or page errors.

The product-specific license endpoint allowed the deployed origin. A fresh
300-request check observed an allowance of **30** normal responses followed by
**270** HTTP 429 responses, all with `Retry-After`. No settings, secrets,
databases, or unrelated resources were read.

## Deployment identity and performance

All 30 publicly deployable candidate files matched the custom domain
byte-for-byte by SHA-256. `staticwebapp.config.json` correctly remained
deployment-only and returned 404. The live footer reports build
`1.0.3-repair-7`, and the worker version matches the candidate build.

| Budget or metric | Result |
| --- | --- |
| Initial JavaScript | 38,571 B raw / 12.91 kB gzip — PASS |
| Application CSS | 20,950 B raw / 5.43 kB gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Lighthouse performance | 95 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.4 s / 1.7 s / 0.002 / 230 ms |
| Total transfer | 130 KiB — PASS |

Lighthouse does not provide lab INP. Direct interaction checks completed
without a visible delay.

## Scope and product fit

The required brief is represented: inventory, pool/pack assumptions, seating,
timer, notes, print, JSON/CSV ownership, and offline use. The visual thesis is
product-specific and documents palette, typography, spacing, motion, and
original generated-art provenance. The image review found no visible text,
logo, brand, or proprietary component.

This is a static PWA, not a library, CLI, signed-in product, or product backend.
Consumer-package, backend concurrency/persistence/health, and identity-tenant
checks do not apply. Optional AI assistance would not improve this
rules-neutral, local-first planning job; import/export already addresses the
obvious portability need.

## Required next steps

1. Give the visible **Import JSON** label a designed `:focus-within` or
   equivalent keyboard focus indicator.
2. Use a focus color with at least 3:1 contrast on paper surfaces and add a
   computed-color regression check.
3. Extend `@claim:offline-export` to download and inspect both JSON and CSV
   while offline, or narrow the public promise to the checked format.
4. Repeat every claim command, the full browser suite, and independent live
   accessibility checks before acceptance.
