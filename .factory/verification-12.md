# Independent verification 12 — PASS

**Checked:** 2026-09-02 UTC

**Work order:** `limited-night-planner-verify-12`

**Candidate commit:** `8d3d0a243c1c5953b6cc674cf2c9888a6a1fd3f9`

**Production URL:** <https://limited-night-planner.sociobot.in/>

**Result:** **PASS — accept this candidate.**

The exact candidate was tested from a clean checkout. Its production build
matches the live deployment byte-for-byte, every declared claim passes, and
the complete planning job works online and offline. Product code was not
changed during verification.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the checked scope.

New Night Pass purchases remain intentionally unavailable and the interface
says so before the existing-license restore control. All core planning,
timing, printing, and export tools are free. This disclosed commercial
follow-up is not a release blocker.

## Mandatory opening gates

### Claims — PASS

`.factory/claims.json` exists with 17 entries. After `npm ci`, every listed
command was run separately before other product tests. Every command passed in
both configured browser projects. Every manifest ID has exactly one matching
`@claim:<id>` tag.

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

Total: **17/17 commands and 34/34 browser executions passed**. Landing,
planner, README, Privacy, and Terms copy was cross-checked against the
manifest. No unlisted product claim was found.

### Cold first-read — PASS

A fresh live browser profile answers all three required questions without
scrolling:

- What it does: **“Plan a fair tabletop event.”**
- For whom: **“For hosts using mixed components…”**
- What to click first: **“Try it with sample data”**, beside **“See a ready
  five-player host sheet.”**

At 390×844, the headline, audience sentence, sample action, and stated outcome
end at 369, 460, 528, and 584 CSS pixels. One click opens `/demo/` on the
completed **Saturday mixed box night** host sheet. The persistent banner says
**Demo — sample data, nothing is saved** and exposes **Reset demo** and
**Start for real**.

Screenshot: `first-read-live-12.png`.

## Clean-checkout gates

| Check | Result and evidence |
| --- | --- |
| Candidate identity | PASS — `HEAD` and `origin/main` were the requested full SHA before report changes. |
| Locked install | PASS — `npm ci`; 62 packages added, 63 audited, 0 vulnerabilities reported. |
| Unit/integration/delivery tests | PASS — `npm test`; 15/15 across three files. |
| Type check | PASS — `npm run check`; no diagnostics. |
| Lint | N/A — no lint script or lint configuration exists. |
| Production build | PASS — `npm run build`; `dist/` created and worker `lnp-a43a7db57d45` precached 26 files. |
| Full browser suite | PASS — `npm run test:e2e`; 84/84 across desktop and 390 px Chromium. |
| Playwright pin | PASS — Playwright packages are pinned to 1.58.2. |
| License allowance check | PASS — `npm run test:license-rate-limit`; 30 allowed and 270 rate-limited responses. |

## Independent end-to-end checks

The live sample reported 300 usable components against 237 needed. Five
rounds produced all ten unique opponent pairs and five byes. The timer changed
from `45:00` to `44:59` and remained at `44:59` after reload. Browser print was
invoked. The JSON export parsed as **Saturday mixed box night** with two
inventory groups. The 1,015-byte CSV contained inventory and round headers.

A blank plan displayed **Waiting for a count** and **Add inventory to test this
plan.** Ten components changed it to **Short for this deal** with the recovery
instruction **Find 182 more or reduce the pool.**

Boundary recovery worked on production: players `1` and `65` became `2` and
`64`; counts `-1` and `1,000,001` became `0` and `1,000,000`. Each correction
showed its allowed range. **Verifier boundary night** survived reload.
Malformed JSON and a file over 2 MB both kept the current plan usable and gave
specific recovery instructions.

Demo reset restored the sample host notes. A real plan survived a demo visit
and returned after **Start for real**. Demo mode used
`limited-night-planner-demo`; leaving it removed that database and retained
the separate `limited-night-planner` database.

## Accessibility, responsive behavior, and visual review

- Fresh live Axe scans found zero serious or critical findings on Landing,
  Demo, Privacy, Terms, and the designed 404 at both 1440 px and 390 px.
- Every checked route had `lang=en`, one h1, one main landmark, a route-specific
  title, and no image missing alternative text. The unknown route returned its
  complete designed page with HTTP 404.
- Tab reached **Skip to planner** first. Its focus ring was a visible 3 px
  brass outline. Enter focused `main`; keyboard activation opened the planner,
  and a schedule route change focused the h1 and announced
  **Stop 03: Schedule.**
- The 390 px host sheet had no horizontal overflow and no checked interactive
  target under 44×44 CSS px. At 200% root text size, the document remained 390
  px wide with no checked clipping.
- With `prefers-reduced-motion: reduce`, no rendered element retained an
  animation or transition longer than 0.01 ms.
- Fresh desktop and phone screenshots were visually inspected. The night
  transit-board design is coherent, legible, unclipped, and distinct. Palette,
  type, spacing, motion, and generated-art provenance are recorded in
  `.factory/design.md`.

Screenshots: `verification-artifacts/live-12-demo-desktop.png` and
`verification-artifacts/live-12-demo-mobile.png`.

## Privacy, headers, links, and request allowance

A fresh live landing/demo/timer/print/export flow made 29 requests, all to
`https://limited-night-planner.sociobot.in`. It set zero cookies and produced
no console or page errors. No third-party script, font, analytics request, or
social embed appeared.

Live valid and 404 responses provide HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a restrictive
Permissions-Policy, and a self-focused CSP with `frame-ancestors 'none'` and
only the documented Sociobot API connection allowance. Hashed assets use
one-year immutable caching. HTML, the manifest, and service worker use
30-second revalidation. The manifest is served as
`application/manifest+json`. No CSP console violation occurred.

All links discovered on Landing, Demo, Privacy, Terms, and 404 returned 200,
including the source and operator links. Every skip-link fragment existed.
`robots.txt` and `sitemap.xml` returned 200.

The product-specific license verification test sent the documented
300-request burst. The observed allowance was **30** readable invalid-license
responses; the other **270** responses were HTTP 429 and carried
`Retry-After: 3` or `4`. CORS preflight returned 200 and allowed the product
origin.

No other product resource, service setting, secret, database, or storage was
read. This product has no sign-in, general application backend, library, or
CLI, so those checks do not apply.

## PWA and deployment identity

The live demo was controlled by service worker `lnp-a43a7db57d45`. A direct
registration update check completed with an activated worker and no waiting
update; the application module was present in Cache Storage. Offline reload at
390 px preserved the sample event, displayed the offline-service notice, and
exported valid JSON. The local full suite also simulated a changed worker and
confirmed that **Update now** activates it and reloads under the new version.

The manifest declares standalone display, a versioned start URL, thesis
colors, 192×192 and 512×512 icons, and a 512×512 maskable icon. The Apple icon
is 180×180 and the social image is 1200×630.

All **33/33** publicly deployable files from the fresh candidate build matched
production byte-for-byte. `staticwebapp.config.json` was correctly excluded
because deployment consumes it.

- Application JavaScript SHA-256:
  `4f5f3330ef9fd09b8cc38d3fde8b575e46e95579977443ad4752c64bb1f291ff`
- Service-worker SHA-256:
  `c5ca48332de5a1be5232c96123def4a09321932ccc5dfb4ab69f16b1d5399868`
- Root HTML SHA-256:
  `28af0b1fd6a4fea7bc17e4f2c3e2b1358c59d86026af702c3fa3ab835d3179b1`
- Visible build ID: `1.0.6-polish-3`

## Performance and budgets

| Budget or metric | Fresh result |
| --- | --- |
| Initial JavaScript | 38,625 B raw / 12.87 kB gzip — PASS |
| Application CSS | 21,235 B raw / 5.49 kB gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Lighthouse performance | 100 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.35 s / 1.65 s / 0.0066 / 47 ms |
| Maximum observed interaction duration | 48 ms — PASS |
| Total transferred size | 138,831 B — PASS |

Chromium Event Timing recorded 130 entries across the primary 390 px planner
navigation. The maximum duration was 48 ms, below the 200 ms interaction
budget.

## Product fit and disposition

The researched job is complete: uncertain inventory, pack or direct-pool
assumptions, compatibility notes, seating rotation, timed rounds, printable
host sheet, local JSON/CSV ownership, and offline use. The tool deliberately
does not supply publisher rules or card data.

No model-assisted step is an obvious missing feature. This job is deterministic
arithmetic and scheduling; compatibility judgment belongs to the host. Import
and export cover the implied portability need.

**Disposition: PASS. Candidate `8d3d0a243c1c5953b6cc674cf2c9888a6a1fd3f9`
is release-ready at the tested URL.**
