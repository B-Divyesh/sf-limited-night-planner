# Independent verification 13 — PASS

**Checked:** 2026-09-02 UTC  
**Work order:** `limited-night-planner-verify-13`  
**Candidate:** `90876d28009965b691dfc875afb46591e7aed336`  
**Production:** <https://limited-night-planner.sociobot.in/>

## Disposition

**PASS — accept candidate `90876d28009965b691dfc875afb46591e7aed336`.**

The live deployment is the exact production build from this candidate. Product
code was not changed during verification.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the verified scope.

## Mandatory opening checks

### Claims: PASS

`.factory/claims.json` exists and has 17 entries. Following `npm ci`, every
listed claim command was run separately before the normal test/build gates;
all passed. The complete claims suite was then run again: **34/34 browser
executions passed** (desktop and 390 px).

| Claim IDs | Result |
| --- | --- |
| `core-planning`, `demo-sandbox`, `offline-after-first-visit`, `local-plan-data`, `no-third-party-requests`, `no-analytics-cookies` | PASS |
| `json-export`, `csv-export`, `first-cycle-pairings`, `timer-persistence`, `timer-background`, `free-core-tools` | PASS |
| `night-pass-sales-unavailable`, `plan-deletion`, `reusable-archives`, `round-cycle-warning`, `offline-export` | PASS |

Landing, README, Privacy, and Terms were cross-checked against the claim
manifest. No unlisted customer-facing claim was found.

### Cold first-read: PASS

A fresh production browser profile showed the plain-language headline **“Plan
pools and rounds for a tabletop event.”** It says it is for **hosts using
mixed components** and tells the visitor to click **“Try it with sample data”**
first, with the outcome **“See a ready five-player host sheet.”** The action
opens the isolated sample in one click. The sample view has the persistent
**“Demo — sample data, nothing is saved”** banner with Reset demo and Start for
real controls.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — `HEAD` was the requested SHA before report changes. |
| Locked install | PASS — `npm ci`; 62 packages installed, audit reported 0 vulnerabilities. |
| Type check | PASS — `npm run check`. |
| Unit/integration/delivery | PASS — `npm test`, 17/17 tests. |
| Lint | N/A — repository has no lint command/configuration. |
| Production build | PASS — `npm run build`; `dist/` produced, 26 assets precached. |
| Full browser suite | PASS — `npm run test:e2e`, 86/86 checks. |
| Browser version | PASS — Playwright is pinned to 1.58.2. |

## Product, PWA, and recovery checks

The sample plan reports 300 usable components, 237 needed, five pools of 45,
a 12-component reserve, five unique-pairing rounds, timer controls, and a
printable host sheet. The test suite independently exercised normal planning,
odd-player byes, timer start/persistence/background behavior, JSON/CSV export,
invalid imports, out-of-range player and inventory counts, storage denial,
round-cycle warning, plan deletion, archive restore fixtures, and demo reset
isolation.

On the live site, a fresh browser was service-worker controlled at `/demo/`.
After setting the browser offline, reload returned HTTP 200 from cache and
kept the demo banner, host sheet, timer, and offline-service notice. There
were no console or page errors. The full local browser suite also passes its
waiting-worker **Update now** activation test.

## Accessibility, responsive behavior, and performance

- Fresh Axe scans on live `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404
  page: **0 serious/critical findings (0 total each)**.
- The local browser suite passed keyboard operation, visible focus contrast,
  screen-reader route announcements, 44 px link targets, 200% text at 390 px,
  reduced-motion behavior, and all standard-page semantics.
- Live mobile Lighthouse: **Performance 100, Accessibility 100, Best
  Practices 100, SEO 100**; FCP 1.4 s, LCP 1.5 s, CLS 0, TBT 0 ms.
- Build output: app JS 41.59 kB raw / **13.59 kB gzip**; app CSS 25.04 kB raw
  / **6.07 kB gzip**; self-hosted fonts total 78.9 kB. All static budgets pass.
- Desktop and 390 px production screenshots were visually reviewed. The
  art-deco night-transit system is legible, distinctive, unclipped, and aligns
  with the recorded design thesis and original-art provenance.

## Privacy, deployment, headers, and allowance

A cold live landing request log contained only same-origin documents, assets,
fonts, manifest, and artwork; it recorded no third-party request or console
error. The claims tests additionally verify full demo-flow same-origin use and
an empty cookie jar. Production sends HSTS, `nosniff`, strict-origin referrer
policy, restrictive Permissions-Policy, and a CSP with `frame-ancestors
'none'`; hashed JS has one-year immutable caching and HTML/SW/manifest have
30-second revalidation. `/`, `/demo/`, `/privacy/`, `/terms/`, manifest,
robots, and sitemap return 200; the designed unknown route returns 404.

The product’s only server-side interaction is existing-pass verification. Its
documented burst test passed: a 300-request invalid-token burst yielded **30
HTTP 200** readable invalid responses and **270 HTTP 429** responses, each
with `Retry-After` values of 2–4 seconds. CORS preflight returned 200 and
allowed `https://limited-night-planner.sociobot.in`.

Deployment identity was confirmed from fresh bytes: **all 33 publicly served
files** in `dist/` matched production byte-for-byte (the deployment-only
`staticwebapp.config.json` is correctly not public). Representative hashes:

| File | SHA-256 (local build = live) |
| --- | --- |
| `assets/app-DvWON6Em.js` | `14f14288aa65d729d084e06fcc946f5420a43c381ff353aff80d3c1364a730b7` |
| `sw.js` | `676e306fd65d1707ed48bf6b6bbd177e5a0dc3cbb7ceae68811149977f87ca95` |
| `index.html` | `3f4cf77c37c525fc8a4a4022363a57e785f168acc0a48643180331de101e23ec` |

Visible production build ID: `1.0.7-polish-4`.

No other product resources, services, settings, secrets, databases, or
storage were accessed. This product has no sign-in, general backend, library,
or CLI surface, so those checks do not apply.
