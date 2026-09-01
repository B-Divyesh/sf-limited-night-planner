# Independent verification 8 — PASS

**Checked:** 2026-09-01 UTC  
**Work order:** `limited-night-planner-verify-8`  
**Candidate commit:** `e4562bfa2a23d66c6ee1eb9646b6a7cef3635805`  
**Production URL:** <https://limited-night-planner.sociobot.in/>  
**Result:** **PASS — accept this candidate.**

Confirmed from a clean checkout and fresh browser profiles. The live deployment
matches the candidate, the smallest useful planning job works, every declared
claim check passes, and no release-blocking defect remains. No product source
was changed during verification.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the checked scope.

New Night Pass purchases remain intentionally unavailable until the factory
registers the product. The product states this plainly, existing-pass restore
is checked with a recorded response, and all core planning, timer, print, and
export tools remain free. This is a disclosed commercial follow-up, not a
functional release blocker.

## Mandatory opening checks

### Claims — PASS

Confirmed `.factory/claims.json` contains 17 entries. After `npm ci`, every
listed `test` command was run separately and passed in both configured browser
projects. Each manifest ID occurs exactly once as an `@claim:<id>` tag in the
test source.

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
| `offline-export` | PASS — 2/2; JSON and CSV both parsed offline |

Total: **17/17 commands and 34/34 browser executions passed**. The landing,
planner, README, Privacy, and Terms claims were cross-checked against the
manifest. No unlisted product claim was found.

### Cold first-read — PASS

Confirmed on the live page in a fresh 1440×900 context and checked again at
390×844:

- What it does: **“Plan a fair tabletop event.”**
- For whom: **“For hosts using mixed components…”**
- What to click first: **“Try it with sample data”**, beside **“See a ready
  five-player host sheet.”**

The action is visible without setup and opens `/demo/` in one click. The first
demo screen immediately shows **Saturday mixed box night**, a `300/237`
component board, a completed host sheet, and the persistent **Demo — sample
data, nothing is saved** banner with **Reset demo** and **Start for real**.

## Clean-checkout checks

| Check | Result and evidence |
| --- | --- |
| Candidate identity | PASS — `HEAD` and `origin/main` were the requested SHA; worktree started clean. |
| Locked install | PASS — `npm ci`; 62 packages added, 63 audited, 0 reported vulnerabilities. |
| Type check | PASS — `npm run check`; no TypeScript diagnostics. |
| Unit/integration | PASS — `npm test`; 11/11 across two files. |
| Lint | N/A — no separate lint script or configuration is present. |
| Production build | PASS — `npm run build`; `dist/` produced and worker `lnp-60c34bd6d363` precached 23 files. |
| Full browser suite | PASS — `npm run test:e2e`; 80/80 across desktop Chromium and 390 px mobile Chromium. |
| Playwright version | PASS — `@playwright/test` and `playwright-core` are locked to 1.58.2. |
| URL structure script | PASS — live `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with no console errors. |

## End-to-end product checks

Confirmed the five-player sample produces 10 unique opponent pairs across one
round-robin cycle and five byes. The live timer changed from `45:00` to
`44:59` and remained at `44:59` after reload. The host sheet reports 300 usable
and 237 needed components, includes the compatible group, preserves the host
notes, and lists all five rounds.

Confirmed both downloads while the live 390 px demo was offline:

- JSON parsed as event **Saturday mixed box night** with two inventory groups.
- CSV contained inventory and round headers and 26 lines.

Checked a fresh real plan with normal, boundary, and invalid values. Player
values `1` and `65` corrected to `2` and `64`. Component counts `-1` and
`1,000,001` corrected to `0` and `1,000,000`. A valid 300-component plan named
**Independent QA night** survived reload. Six rounds for five players produced
the expected repeat-opponent notice. Schema-invalid JSON kept the current plan
and displayed the plain recovery instruction. Print media hid route controls
and host tools and used a white page.

The configured suite additionally checks demo reset and separation, storage
denial guidance, current-plan and archive deletion, existing-pass restore with
a recorded response, background-tab timer continuity, empty states, and
Enter/Space operation.

## Accessibility, mobile, and language

- Confirmed zero serious or critical Axe findings on the live landing, mobile
  host sheet, Privacy, and Terms. The full suite checks every planner stop.
- Confirmed every standard route has `lang=en`, a route-specific title, one
  h1, one main landmark, complete image alternatives, and labelled buttons.
- Confirmed the keyboard skip link, planner step focus movement, live step
  announcement, and keyboard operation of the primary path.
- Confirmed the visible **Import JSON** control receives a 3 px focus ring.
  Its ring is `rgb(224, 180, 76)` on `rgb(24, 37, 56)`, or **7.94:1**.
- Confirmed no visible link, button, form field, or labelled composite control
  measured below 44×44 CSS px on the 390 px host sheet.
- Confirmed 200% root text at 390 px retained `scrollWidth=390` with no
  horizontal loss.
- Confirmed reduced motion uses `scroll-behavior: auto`, no hero transform,
  and a `0.01 ms` transition.
- Checked `.factory/copy-audit.md` and the current product copy. The cold-screen
  wording is direct and the same terms are used throughout.

## Privacy, headers, routes, and request allowance

Confirmed a complete live landing and demo flow requested only
`https://limited-night-planner.sociobot.in`, set zero cookies, and produced no
console errors or uncaught page errors. Demo storage contained one current demo
plan; the separate real database contained zero plans and zero archives.

Confirmed the root response provides CSP with `frame-ancestors 'none'`, HSTS,
`X-Content-Type-Options: nosniff`, a strict-origin referrer policy, and a
restrictive Permissions-Policy. HTML and the worker revalidate after 30
seconds. Hashed JavaScript and CSS use one-year immutable caching.

Checked every internal link discovered on `/`, `/demo/`, `/privacy/`, and
`/terms/`; all eight URL/fragment forms returned 200. An unknown route returned
the designed page with HTTP 404. `robots.txt` and `sitemap.xml` list the four
public routes.

Confirmed the product-license verification allowance with the repository's
documented 300-request check. The first **30** requests returned readable HTTP
200 invalid-license results; the next **270** returned HTTP 429, all with
`Retry-After: 4` or `3`. The preflight returned 200 and allowed the deployed
product origin.

No other service, app setting, secret, database, resource, or product storage
was read. This product has no sign-in flow, product backend, library package,
or CLI, so those check classes do not apply.

## PWA and deployment identity

Confirmed the live 390 px page is controlled by worker
`lnp-60c34bd6d363`; a fresh update check had no waiting worker. The local
production browser suite confirms a changed worker displays **Update now**,
activates on selection, reloads, and takes control. A dedicated live context
then reloaded the demo offline and completed both exports.

The manifest declares standalone display, a versioned start URL, thesis
colors, 192×192 and 512×512 icons, and a 512×512 maskable icon. The checked
illustration is original, product-specific, free of visible text or brands,
and its generation provenance is recorded in `.factory/design.md`.

Confirmed all **30/30** publicly deployable files in candidate `dist/` match
the custom domain byte-for-byte. The deployment-only config returns 404.

- Application JavaScript SHA-256:
  `3ebb0761aecf78cd93a20a98193994199cfc630de5ebfb9fc763abfbfbf500c6`
- Service-worker SHA-256:
  `fa477502cd5bd9989cf04472f330ff0938e353ac2b66b73301427875f75921ad`
- Visible build ID: `1.0.4-repair-8`

## Performance and size budgets

| Budget or metric | Result |
| --- | --- |
| Initial JavaScript | 38,571 B raw / 12.91 kB gzip — PASS |
| Application CSS | 21,216 B raw / 5.49 kB gzip — PASS |
| Self-hosted fonts | 78,904 B — PASS |
| Mobile hero | 30,426 B — PASS |
| Lighthouse performance | 95 — PASS |
| Lighthouse accessibility | 100 — PASS |
| Lighthouse best practices | 100 — PASS |
| Lighthouse SEO | 100 — PASS |
| FCP / LCP / CLS / TBT | 1.35 s / 1.65 s / 0.0025 / 231 ms |
| Event Timing maximum across checked primary interactions | 48 ms — PASS |
| Total transferred size | 137,661 B — PASS |

Lighthouse does not provide lab INP. Chromium Event Timing supported the
checked primary interactions and reported a maximum 48 ms duration, below the
200 ms interaction budget.

## Scope and product fit

Confirmed the researched job is represented: uncertain inventory, pool or
pack assumptions, seating rotation, round timing, compatibility notes,
printable host sheet, JSON/CSV ownership, and offline use. The visual thesis
records a distinct palette, type system, spacing, single-night treatment,
motion policy, and original asset provenance.

Checked the optional-feature question. A model-assisted step is not an obvious
fit for this rules-neutral, local-first calculation tool. JSON/CSV ownership
and import already provide the useful portability implied by the brief.
