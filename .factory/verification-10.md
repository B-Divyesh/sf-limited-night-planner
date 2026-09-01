# Independent verification 10 — PASS

**Checked:** 2026-09-01 UTC

**Work order:** `limited-night-planner-verify-10`

**Candidate commit:** `baa4b839f13f7f591fb3537c5771b83593d47868`

**Production URL:** <https://limited-night-planner.sociobot.in/>

**Result:** **PASS — accept this candidate.**

Confirmed from the exact candidate checkout and fresh browser profiles. The
live deployable files match the candidate build, the complete planning job
works, every declared claim check passes, and no release-blocking defect was
found. Product source was not changed during verification.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the checked scope.

New Night Pass purchases remain intentionally unavailable. The product says so
before presenting the existing-license restore control. Planning, timers,
printing, and exports remain free. This is a disclosed commercial follow-up,
not a functional release blocker.

## Mandatory opening checks

### Claims — PASS

Confirmed `.factory/claims.json` contains 17 entries. After `npm ci`, every
listed command was run separately through the demo entry point. All commands
passed in both configured browser profiles. Each manifest ID has exactly one
matching `@claim:<id>` tag.

| Claim | Result |
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
| `offline-export` | PASS — 2/2 |

Total: **17/17 commands and 34/34 browser executions passed**. The landing,
planner, README, Privacy, and Terms claims were checked against the manifest.
No unlisted product claim was found.

### Cold first-read — PASS

Confirmed on the live page in fresh 1440×900 and 390×844 contexts:

- What it does: **“Plan a fair tabletop event.”**
- For whom: **“For hosts using mixed components…”**
- What to click first: **“Try it with sample data”**, beside **“See a ready
  five-player host sheet.”**

The action appears in the first viewport at both sizes and opens `/demo/` in
one click. The first demo screen shows **Saturday mixed box night**, its
completed host sheet, and the persistent **Demo — sample data, nothing is
saved** banner with **Reset demo** and **Start for real**.

## Candidate checks

| Check | Result and evidence |
| --- | --- |
| Candidate identity | PASS — checkout was the requested full SHA and initially clean. |
| Locked install | PASS — `npm ci`; 62 packages added, 63 audited, 0 reported vulnerabilities. |
| Type check | PASS — `npm run check`; no TypeScript diagnostics. |
| Unit and delivery checks | PASS — `npm test`; 13/13 across three files. |
| Lint | N/A — no separate lint script or lint configuration is present. |
| Production build | PASS — `npm run build`; `dist/` produced and worker `lnp-6cb3a04024d3` precached 23 files. |
| Full browser suite | PASS — `npm run test:e2e`; 80/80 across desktop and 390 px Chromium. |
| Playwright version | PASS — `@playwright/test` and `playwright-core` are pinned to 1.58.2. |
| Factory URL check | PASS — 200 response in 797 ms; title, `lang=en`, one h1, main landmark, image alternatives, button names, and zero console/page errors. |

## End-to-end product checks

Confirmed the ready sample contains 300 usable components against 237 needed,
leaving 63 after the reserve. It produces five rounds for five named players,
with one bye in each round. The timer changed from `45:00` to `44:59`. The host
sheet contains the setup checklist, inventory, notes, schedule, and seating.

Confirmed the live JSON download parses as **Saturday mixed box night** with
two inventory groups. Confirmed the live 1,015-character CSV contains the event
row, inventory headers, and round headers. Confirmed the print action calls the
browser print function. A real plan named **Verifier persistence night** with
240 components survived reload.

Checked recovery at both sides of numeric limits. Players `1` and `65` became
`2` and `64`; component counts `-1` and `1,000,001` became `0` and `1,000,000`.
Each correction had a plain status message. Invalid JSON kept the planner open
and instructed the user to choose a planner JSON backup.

The full browser suite additionally confirms demo reset and storage separation,
timer refresh and background-tab behavior, first-cycle opponent uniqueness,
the repeat-cycle warning, current-plan deletion, archive deletion, recorded
existing-pass restore, storage-denial guidance, and both exports while offline.

## Accessibility, layout, and language

- Confirmed zero serious or critical Axe findings on every live planner step
  at desktop and 390 px, plus the landing, Privacy, Terms, and not-found pages.
- Confirmed every checked route has `lang=en`, one h1, one main landmark,
  route-specific metadata, complete image alternatives, and labelled controls.
- Confirmed Tab reaches the skip link first, Enter moves focus to main content,
  and Space starts a plan. The observed focused action had a designed 3 px ring.
- Confirmed visible links, buttons, and the file control meet 44×44 CSS px on
  the 390 px host sheet.
- Confirmed no horizontal overflow at 390 px. At 200% root text size, the
  document remained 390 px wide with no checked clipping or header overlap.
- Confirmed reduced-motion preference is active, uses automatic scrolling,
  and leaves zero rendered elements with a transition or animation over 0.01 ms.
- Confirmed the landing copy audit has no sentence over 22 words and no banned
  marketing term. Product terminology remains consistent.

## Privacy, headers, routes, and request allowance

Confirmed a complete live landing and demo flow requested only
`https://limited-night-planner.sociobot.in`, set zero cookies, and produced no
console or page errors. No third-party script, font, analytics request, or
social embed was observed.

Confirmed the live response provides a self-focused CSP with the documented
Sociobot API connection allowance, `frame-ancestors 'none'`, a restrictive
Permissions-Policy, `Referrer-Policy: strict-origin-when-cross-origin`, and
`X-Content-Type-Options: nosniff`. Hashed assets use one-year immutable caching.
HTML, the manifest, and the worker use 30-second revalidation. The manifest has
`application/manifest+json` content type.

Confirmed every link found on the landing, demo, Privacy, Terms, and 404 pages
returned 200, including the source and operator links. A missing product route
returned the designed page with HTTP 404. The expected browser notice for that
deliberate missing document was not present on any valid route.

Confirmed the product-license endpoint's documented 300-request check. The
observed allowance was **30** readable invalid-license responses. The remaining
**270** requests returned HTTP 429, all with `Retry-After: 3` or `4`. The CORS
preflight returned 200 and allowed the product origin.

No other service, resource, setting, secret, database, or product storage was
read. This product has no sign-in flow, general product backend, library
package, or CLI, so those check classes do not apply.

## PWA and deployment identity

Confirmed the live mobile page is controlled by service worker
`lnp-6cb3a04024d3`, and the application module is present in Cache Storage. A
fresh offline reload preserved the sample plan, demo banner, and offline status.
The full local browser suite confirms that a changed worker shows **Update now**,
activates when selected, reloads, and takes control.

The manifest declares standalone display, a versioned start URL, thesis colors,
192×192 and 512×512 icons, and a 512×512 maskable icon. The original visual
asset provenance and design tokens are recorded in `.factory/design.md`.

Confirmed all **30/30** publicly deployable files from a fresh candidate build
match production byte-for-byte. The deployment configuration is intentionally
not public.

- Application JavaScript SHA-256:
  `96089c7ed132e63e661fefecf7b123b05f11028dfdc1ebf11b44eb586adcce01`
- Service-worker SHA-256:
  `be3f52df32b1edbaac33b53bf5fc84ee48f2a9585b7029867775da815e4f53c5`
- Root HTML SHA-256:
  `77a0b969fa4198e89f74eb0efbd4c894c24b061d9bdd6f38729622a58c5ac086`
- Visible build ID: `1.0.5-polish-1`

## Performance and size budgets

| Budget or metric | Result |
| --- | --- |
| Initial JavaScript | 38,488 B raw / 12.83 kB gzip — PASS |
| Initial application CSS | 21,216 B raw / 5.49 kB gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Lighthouse performance | 94 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.35 s / 1.80 s / 0.0066 / 263 ms |
| Maximum checked interaction event | 72 ms — PASS |
| Total transferred size | 137,637 B — PASS |

Lighthouse does not provide lab INP. Chromium Event Timing recorded 12 events
across the primary mobile planner navigation and a maximum duration of 72 ms,
below the 200 ms interaction budget.

## Product fit

Confirmed the researched job is present: uncertain inventory, pack or pool
assumptions, fair seating rotation, round timing, compatibility notes, a
printable host sheet, local JSON/CSV ownership, and offline use. The visual
thesis records a distinct palette, type system, spacing, single-night mode,
motion policy, and original image provenance.

Checked whether the brief implies a missing model-assisted step. It does not:
the core work is deterministic arithmetic and scheduling, and the rules-neutral
scope intentionally leaves compatibility judgment to the host. Import and
export already provide the useful portability implied by the brief.
