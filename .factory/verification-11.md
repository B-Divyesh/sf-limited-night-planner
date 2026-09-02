# Independent verification 11 — PASS

**Checked:** 2026-09-02 UTC

**Work order:** `limited-night-planner-verify-11`

**Candidate commit:** `fdf80aac1de7a4524fc2377fc9ef7992bf57400f`

**Production URL:** <https://limited-night-planner.sociobot.in/>

**Result:** **PASS — accept this candidate.**

The candidate was checked from its exact clean checkout after a lockfile
install. The complete product flow works on production, all declared claims
pass, and every public file from the fresh candidate build matches production
byte-for-byte. Product code was not changed during verification.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the checked scope.

New Night Pass purchases remain intentionally unavailable. The product says so
before the existing-license restore control. Planning, timers, printing, and
exports remain free. This disclosed commercial follow-up is not a release
defect.

## Mandatory opening gates

### Claims — PASS

`.factory/claims.json` contains 17 entries. After `npm ci`, every listed
command was run separately from the exact candidate checkout through the demo
entry point. Each command passed in both configured browser profiles. Each ID
also has exactly one matching `@claim:<id>` tag.

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

Total: **17/17 commands and 34/34 browser executions passed**. The live
landing, planner, README, Privacy, and Terms copy was cross-checked against the
manifest. No unlisted product claim was found.

### Cold first-read — PASS

Fresh 1440×900 and 390×844 browser profiles answered all three questions in
the first viewport:

- What it does: **“Plan a fair tabletop event.”**
- For whom: **“For hosts using mixed components…”**
- What to click first: **“Try it with sample data”**, beside **“See a ready
  five-player host sheet.”**

At 390 px, the headline, audience sentence, action, and outcome ended at 369,
460, 528, and 584 px respectively. One click opened `/demo/` on the completed
host sheet for **Saturday mixed box night**. The persistent banner said
**Demo — sample data, nothing is saved** and exposed **Reset demo** and
**Start for real**.

## Candidate and local quality gates

| Check | Result and evidence |
| --- | --- |
| Candidate identity | PASS — exact SHA checked out with no tracked or untracked changes. |
| Locked install | PASS — `npm ci`; 62 packages added, 63 audited, 0 vulnerabilities reported. |
| Type check | PASS — `npm run check`; no diagnostics. |
| Unit and delivery tests | PASS — `npm test`; 14/14 across three files. |
| Lint | N/A — no lint script or lint configuration exists. |
| Production build | PASS — `npm run build`; `dist/` produced and worker `lnp-75501b97f78f` precached 24 files. |
| Full browser suite | PASS — `npm run test:e2e`; 82/82 on desktop and 390 px Chromium. |
| Browser version | PASS — Playwright packages are pinned to 1.58.2. |
| Factory URL verifier | PASS — 200 response in 1,056 ms; title, `lang=en`, one h1, main landmark, image alternatives, named buttons, and zero console/page errors. |

## Independent end-to-end checks

The live sample reported 300 usable components against 237 needed. Its five
rounds produced ten unique opponent pairs and five byes. The round timer moved
from `45:00` to `44:59`. Browser print was invoked. The JSON download parsed as
**Saturday mixed box night** with two inventory groups. The 1,015-byte CSV
contained both inventory and round headers.

The empty plan displayed **No components counted yet** and **Waiting for a
count**. Entering ten components changed the result to **Short for this deal**
with the actionable message **Find 182 more or reduce the pool.**

Boundary recovery worked on production: players `1` and `65` became `2` and
`64`; component counts `-1` and `1,000,001` became `0` and `1,000,000`. Each
correction displayed its allowed range. A plan named **Verifier boundary
night** survived reload. Malformed JSON left the plan usable and instructed
the host to choose a planner JSON backup.

Demo reset restored the sample host notes. A real plan remained unchanged
through a demo visit and reappeared after **Start for real**. While demo mode
was active, IndexedDB contained `limited-night-planner-demo`; leaving demo
discarded that database and retained the separate `limited-night-planner`
database.

## Accessibility, responsive behavior, and language

- Fresh live Axe scans found zero serious or critical findings on landing,
  Demo, Privacy, Terms, and the designed 404, plus all four planner stops, at
  both 1440 px and 390 px.
- Every checked route had `lang=en`, one h1, one main landmark, a route-specific
  title, and no image missing alternative text. The unknown route returned
  HTTP 404 with its complete designed page.
- Tab focused **Skip to planner** first. Its focus ring was a visible 3 px
  brass outline. Enter focused `main`; Space started a real plan; keyboard
  route activation focused the h1 and announced **Stop 03: Schedule.**
- At 390 px, the host sheet had no horizontal overflow and no checked link,
  button, or file label under 44×44 CSS px. With root text at 200%, the document
  remained 390 px wide and the checked first-screen/header content did not
  clip.
- With `prefers-reduced-motion: reduce`, scroll behavior was automatic and no
  rendered element retained a transition or animation longer than 0.01 ms.
- Landing copy remains within the recorded 22-word sentence limit and uses no
  banned marketing term. Terminology is consistent.

## Privacy, headers, routes, and request allowance

A complete fresh live landing/demo/timer/export flow made requests only to
`https://limited-night-planner.sociobot.in`, set zero cookies, and produced no
console or page errors. No third-party script, font, analytics request, or
social embed appeared.

Live responses provide HSTS, a self-focused CSP with only the documented
Sociobot API connection allowance, `frame-ancestors 'none'`, a restrictive
Permissions-Policy, `Referrer-Policy: strict-origin-when-cross-origin`, and
`X-Content-Type-Options: nosniff`. Hashed assets use one-year immutable
caching. HTML, the manifest, and service worker use 30-second revalidation.
The manifest has `application/manifest+json` content type. All non-fragment
links found across landing, Demo, Privacy, Terms, and 404 returned 200; every
skip-link fragment target existed.

The product-specific license verification endpoint was sent the documented
300-request burst. The observed allowance was **30** readable invalid-license
responses; the remaining **270** responses were HTTP 429 and every one carried
`Retry-After: 3` or `4`. Its CORS preflight returned 200 and allowed the product
origin.

No other product, service, setting, secret, database, or storage resource was
read. This product has no sign-in, general application backend, library, or
CLI, so those checks do not apply.

## PWA and deployment identity

The live demo was controlled by service worker `lnp-75501b97f78f`. A direct
registration update check completed with an activated worker and no waiting
update. The application module was present in Cache Storage. Offline reload at
390 px preserved **Saturday mixed box night**, showed the offline-service
notice, and exported valid JSON. The full local browser suite also simulated a
changed worker and confirmed that **Update now** activates it and reloads into
the new version.

The manifest declares standalone display, a versioned start URL, thesis
colors, 192×192 and 512×512 icons, and a 512×512 maskable icon. The generated
hero and authored icon provenance are recorded in `.factory/design.md`.

All **31/31** publicly deployable files from the fresh candidate build matched
production byte-for-byte. `staticwebapp.config.json` was correctly excluded
because deployment consumes it rather than serving it.

- Application JavaScript SHA-256:
  `254fc55b4f04f3ad231542ba56d5c60e67aac45cc9a4df6d8a8c3742f0172471`
- Service-worker SHA-256:
  `94167054cdbfb6523246e4b7c094d587a3a30250923cd62c6d6ad66eba31e44d`
- Root HTML SHA-256:
  `7f4c7ac47e5b292fc097c3b0490d4da85f64f9f556b4aaa17cd3a17f24025f24`
- Visible build ID: `1.0.5-polish-1`

## Performance and size budgets

| Budget or metric | Fresh result |
| --- | --- |
| Initial JavaScript | 38,488 B raw / 12.84 kB gzip — PASS |
| Initial application CSS | 21,218 B raw / 5.48 kB gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Lighthouse performance | 100 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.35 s / 1.65 s / 0.0066 / 0 ms |
| Maximum observed interaction event | 88 ms — PASS |
| Total transferred size | 137,570 B — PASS |

Lighthouse does not report lab INP. Chromium Event Timing observed 105 events
through the primary 390 px planner navigation; the maximum duration was 88 ms,
below the 200 ms interaction budget.

## Product fit and missed leverage

The researched job is complete: uncertain inventory, pack or direct-pool
assumptions, compatibility notes, fair seating rotation, timed rounds, a
printable host sheet, local JSON/CSV ownership, and offline use. The visual
thesis records a product-specific art-deco transit system, palette, typography,
spacing, single-night treatment, motion policy, and original asset provenance.

The brief does not imply a useful model-assisted step. Its core arithmetic and
scheduling are deterministic, while compatibility judgment intentionally stays
with the host. Import and export already cover the implied portability need.
