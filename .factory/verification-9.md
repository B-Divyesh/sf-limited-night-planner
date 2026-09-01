# Independent verification 9 — FAIL

**Checked:** 2026-09-01 UTC  
**Work order:** `limited-night-planner-verify-9`  
**Requested candidate:** `baa4b839f13f7f591fb3537c5771fe5be94dd65f`  
**Source actually available and tested:** `baa4b839f13f7f591fb3537c5771b83593d47868`  
**Production URL:** <https://limited-night-planner.sociobot.in/>  
**Result:** **FAIL — do not accept the named candidate.**

The application at the available source revision is functionally release-ready,
but the named candidate cannot be verified. The requested SHA does not exist in
the clean clone and was not advertised by any origin ref at verification start.
The input `HEAD`, `origin/main`, and work-order base were instead
`baa4b839f13f7f591fb3537c5771b83593d47868`.
All 30 public build files from that different revision match production
byte-for-byte. This is a release-provenance failure, regardless of the otherwise
passing product checks.

No product source was changed during verification.

## Defects by severity

### Critical

1. **QA-9-01 — The requested candidate is unavailable and is not the deployed
   revision.** `git cat-file -t baa4b839f13f7f591fb3537c5771fe5be94dd65f`
   reports that the object does not exist. Before this report commit, a fresh
   `git ls-remote origin` listed only
   `baa4b839f13f7f591fb3537c5771b83593d47868` for `HEAD` and `main`.
   The clean checkout is that same alternate SHA. Its production build matches
   all 30 publicly deployed files, proving what is live but not establishing
   any relationship to the requested candidate. The factory must provide or
   correct the candidate SHA and rerun independent verification.

### High, medium, and low

None found in the tested product revision.

## Mandatory opening gates

### Claims — PASS on the available revision, not attributable to the requested candidate

`.factory/claims.json` exists and contains 17 entries. After `npm ci`, every
listed command was run separately from the clean checkout through the production
demo entry point used by the Playwright configuration. Every command passed in
both configured projects.

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
planner, README, Privacy, and Terms copy was cross-checked against the manifest;
no unlisted behavioral claim was found.

### Cold first-read — PASS

A fresh live 1440×900 context with service workers blocked showed, without
scrolling:

- what it does: **“Plan a fair tabletop event.”**
- who it is for: **“For hosts using mixed components…”**
- what to click: **“Try it with sample data”**, beside **“See a ready
  five-player host sheet.”**

The action was also visible at 390×844 and opened `/demo/` in one click. The
first demo view immediately showed **Saturday mixed box night**, the `300/237`
component board, and the persistent **Demo — sample data, nothing is saved**
banner with **Reset demo** and **Start for real**.

## Clean-checkout gates

| Check | Evidence |
| --- | --- |
| Candidate identity | **FAIL** — requested SHA absent; checkout and `origin/main` are the different SHA above. |
| Locked install | PASS — `npm ci`; 62 packages added, 63 audited, 0 reported vulnerabilities. |
| Unit/integration tests | PASS — `npm test`; 13/13 across three files. |
| Type check | PASS — `npm run check`; no diagnostics. |
| Lint | N/A — the repository has no lint script or lint configuration. |
| Production build | PASS — `npm run build`; `dist/` produced and worker `lnp-6cb3a04024d3` precached 23 files. |
| Full browser suite | PASS — `npm run test:e2e`; 80/80 across desktop Chromium and 390 px mobile Chromium. |
| URL verification | PASS — factory `verify-url.sh` recorded HTTP 200, correct title/lang/one H1/main/image alternatives, and no browser errors. |
| Playwright pin | PASS — test packages are pinned to 1.58.2. |

## End-to-end behavior

The live five-player sample generated all 10 unique opponent pairs in one
round-robin cycle plus five byes. The timer advanced from `45:00` to `44:59`
and still showed `44:59` after reload. JSON exported the correct event with two
inventory groups. CSV contained both inventory and round headers and 26 lines.
Print media hid host controls and used a white page.

A fresh real plan named **Independent QA night** persisted after reload.
Boundary values recovered immediately: players `1` and `65` became `2` and
`64`; component counts `-1` and `1,000,001` became `0` and `1,000,000`.
Five players with six rounds displayed the expected warning that opponents
repeat after round five. Schema-invalid JSON preserved the current plan and
gave a plain instruction to choose an exported planner backup.

The complete suite additionally passed demo reset/separation, storage-denial
recovery, current-plan and archive deletion, recorded existing-license restore,
background-tab timer continuity, empty states, and Enter/Space operation.

## Accessibility, mobile, and visual review

- Fresh live Axe checks found zero serious or critical findings on the landing,
  desktop host sheet, and 390 px host sheet. The full suite checked all planner
  stops plus Privacy, Terms, and 404.
- Keyboard Tab first reached **Skip to planner**; Enter focused `main`.
  The primary demo link showed a 3 px brass focus ring and activated with Enter.
- Planner route changes, announcements, and keyboard actions passed in the full
  suite. No keyboard trap was found.
- At 390 px there was no horizontal overflow. All checked visible links,
  buttons, fields, and the file-input label measured at least 44×44 CSS px.
  The 200% text-size layout check passed in the full suite.
- Reduced motion matched the preference, changed scroll behavior to `auto`,
  removed the hero transform, and reduced transitions to `0.01 ms`.
- The inspected desktop and phone screenshots show a coherent, product-specific
  night transit-board design with legible content and no clipping or misleading
  imagery. The single-mode decision, palette, typography, spacing, motion, and
  generated-art provenance are recorded in `.factory/design.md`.

Evidence is in `.factory/verification-artifacts/`.

## Privacy, network, headers, and routes

A full fresh live landing/demo/schedule/host-sheet/export flow requested only
`https://limited-night-planner.sociobot.in`, set zero cookies, and produced no
console or uncaught page errors. The demo database contained one sample plan;
the real database contained no plan or archive store/data. Existing-pass restore
is the only documented path that contacts `api.sociobot.in`.

The live root sends CSP including `frame-ancestors 'none'`, HSTS,
`X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a restrictive
`Permissions-Policy`. HTML and `sw.js` revalidate after 30 seconds; hashed JS
and CSS use one-year immutable caching. No CSP console violation occurred.

`/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with route-specific
titles, `lang=en`, one H1, one main landmark, canonical metadata, complete image
alternatives, and descriptions within 155 characters. Every discovered internal
link returned 200. The source repository link returned 200. An unknown path
returned the designed page with HTTP 404 and links back to the planner and demo.
`robots.txt` points to a sitemap containing all four public routes.

The documented product-license rate-limit check sent 300 rapid requests. The
first **30** returned readable HTTP 200 invalid-license results; the following
**270** returned HTTP 429. Every limited response carried `Retry-After` (observed
values 1–4 seconds), and CORS allowed the deployed product origin. No unrelated
resource, app setting, secret, database, service, or storage was accessed. The
product has no sign-in flow or product backend.

## PWA and offline behavior

The live phone context was controlled by service worker `lnp-6cb3a04024d3`.
A fresh `registration.update()` found no waiting worker. The full local browser
suite passed the waiting-worker **Update now** activation/reload path. After the
live context went offline, `/demo/` reloaded with its sample plan, demo banner,
and offline status; JSON and CSV exports still worked.

The manifest uses `display: standalone`, versioned start URL
`/?source=installed&v=1`, thesis colors, 192×192 and 512×512 icons, and a 512×512
maskable icon.

## Deployment identity and budgets

All **30/30** public files in the build from the available checkout matched the
live custom domain byte-for-byte. `staticwebapp.config.json` correctly returned
404. This proves deployment identity only for
`baa4b839f13f7f591fb3537c5771b83593d47868`, not for the requested SHA.

- Application JavaScript SHA-256:
  `96089c7ed132e63e661fefecf7b123b05f11028dfdc1ebf11b44eb586adcce01`
- Service-worker SHA-256:
  `be3f52df32b1edbaac33b53bf5fc84ee48f2a9585b7029867775da815e4f53c5`
- Visible build ID: `1.0.5-polish-1`

| Budget or metric | Result |
| --- | --- |
| Initial JavaScript | 38,488 B raw / 12,833 B gzip — PASS |
| Application CSS | 21,216 B raw / 5,489 B gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Total transferred | 137,607 B — PASS |
| Lighthouse performance | 95 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.38 s / 1.76 s / 0.0025 / 251.5 ms |
| Maximum observed Event Timing duration | 96 ms — PASS |

Lighthouse does not provide a lab INP. The checked primary mobile interactions
had a maximum Event Timing duration of 96 ms, below the 200 ms interaction
budget.

## Scope and disposition

The available revision satisfies the researched job: uncertain inventory,
pool/pack assumptions, seating rotation, timed rounds, compatibility notes,
printable host sheet, local export/import, and offline operation. AI is not an
obvious missing step for this rules-neutral local calculation tool. New Night
Pass sales remain intentionally unavailable and are stated plainly; existing
passes can be restored, while all core tools remain free.

**Release remains blocked solely by QA-9-01.** Provide the actual candidate
object or correct the work-order SHA, then rerun verification against that exact
revision and confirm the same bytes are deployed.
