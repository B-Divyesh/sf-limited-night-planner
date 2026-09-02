# Independent verification 14 — PASS

**Checked:** 2026-09-02 UTC  
**Work order:** `limited-night-planner-verify-14`  
**Candidate:** `92c9001387edc92a4cecf92a4596d45e5b4a8bac`  
**Production:** <https://limited-night-planner.sociobot.in/>

## Disposition

**PASS — accept candidate `92c9001387edc92a4cecf92a4596d45e5b4a8bac`.**

No product code was changed during this independent verification. The fresh production bytes match the candidate build, including the application bundle and service worker.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found in the verified scope.

## Mandatory opening checks

### Claims: PASS

`.factory/claims.json` exists with 17 claims. After `npm ci`, every declared command was run separately against the shipped demo entry point. All 17 commands passed (34 Playwright executions): `core-planning`, `demo-sandbox`, `offline-after-first-visit`, `local-plan-data`, `no-third-party-requests`, `no-analytics-cookies`, `json-export`, `csv-export`, `first-cycle-pairings`, `timer-persistence`, `timer-background`, `free-core-tools`, `night-pass-sales-unavailable`, `plan-deletion`, `reusable-archives`, `round-cycle-warning`, and `offline-export`.

Landing, README, Privacy, and Terms claims were cross-checked with the manifest. No unlisted customer-facing promise was found.

### Cold first-read: PASS

A cold desktop production profile showed **“Plan pools and rounds for a tabletop event.”** It states that the product is for hosts using mixed components and that it checks counts and builds a schedule before friends arrive. The first main action is **“Try it with sample data”**, immediately explained as showing a ready five-player host sheet. One click enters `/demo/`, which shows the persistent **“Demo — sample data, nothing is saved”** banner with Reset demo and Start for real controls.

Screenshot: `verification-artifacts/verification-14-live-cold-desktop.png`.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — clean HEAD was the requested SHA before report changes. |
| Locked install | PASS — `npm ci`; 62 packages, 0 reported vulnerabilities. |
| Type check | PASS — `npm run check`. |
| Unit/integration | PASS — `npm test`, 18/18. |
| Lint | N/A — no lint script/configuration is provided. |
| Full browser suite | PASS — `npm run test:e2e`, 86 checks; Playwright report status `passed`. |
| Production build | PASS — `npm run build` produced `dist/`. |
| Browser pin | PASS — Playwright is pinned to 1.58.2. |

## End-to-end, PWA, and recovery

The live sample showed 300 usable / 237 required components, five pools of 45, a 12-component reserve, generated five-player seating, host-sheet rows, and a running timer. A sixth round warned that opponents repeat after round five; the timer changed to 44:59 after starting; JSON and CSV downloads were named for the sample; and invalid JSON retained the plan while showing actionable recovery text.

The live `/demo/` page was controlled by `sw.js`. In its own fresh browser context, service-worker update checking completed with an active worker, then an offline reload retained the sample heading and showed the offline-service notice. Reduced-motion emulation applied the CSS reduced-motion transition policy. At 390 px and 200% root text, `scrollWidth` remained 390 with no clipping; the mobile screenshot is `verification-artifacts/verification-14-live-cold-mobile.png`.

## Accessibility, privacy, headers, performance

- Live Axe scans of `/`, `/demo/`, `/privacy/`, `/terms/`, and a designed 404 had **0 violations**, including 0 serious/critical findings.
- Keyboard testing reached the skip link with a visible 3 px focus ring; activating it moved focus to the page heading. The full suite also passed planner keyboard, focus-contrast, route-announcement, form-recovery, mobile, and reduced-motion tests.
- Fresh live request logs for the cold landing and complete demo flow contained only `https://limited-night-planner.sociobot.in`; there were no cookies, third-party fonts/scripts, console errors, or page errors. A license is not contacted in ordinary demo use.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive Permissions-Policy, and CSP with `frame-ancestors 'none'`. HTML and `sw.js` revalidate at 30 seconds; hashed assets use one-year immutable caching. All internal links returned 200 and the designed unknown route returned 404.
- Fresh mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; LCP 1.6 s, CLS 0.007, TBT 0 ms. Evidence: `verification-artifacts/verification-14-lighthouse-mobile.json`.
- Build budgets pass: application JS is 41,621 bytes raw / 13,469 bytes gzip; CSS is 25,037 bytes raw / 6,061 bytes gzip; self-hosted fonts total 78,904 bytes raw. The hero WebP is 94,760 bytes.

## Deployment identity and server allowance

All **33** public files in the fresh `dist/` build matched production byte-for-byte. The live `assets/app-Cskqtnr0.js` SHA-256 is `34b85337efceefd6180616fbd73eb5516fc510b2101366a425f12f4ca99f436e`, and the live `sw.js` SHA-256 is `faa6195ada086b84b86ac5101f961978f7c91236a77861cfc82f087b706df76c`, equal to the candidate build. Visible production build ID: `1.0.8-polish-5`.

The only server-side interaction is existing-pass verification. Its documented burst check passed: `npm run test:license-rate-limit` sent 300 invalid-token requests and observed **30 HTTP 200** readable invalid responses followed by **270 HTTP 429** responses. Every 429 included `Retry-After` (observed 1–4 seconds); CORS preflight returned 200 for the product origin. The observed allowance is therefore 30 rapid verification requests per client before limiting.

This product has no sign-in, general backend, library, or CLI surface; those checks do not apply. No other product resources, services, settings, secrets, databases, or storage were accessed.

