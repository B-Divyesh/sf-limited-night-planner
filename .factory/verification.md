# Verification report — FAIL

**Audited:** 2026-08-28 (UTC)  
**Candidate:** `16205f47cd48bb2f576d4fb4b90cfd75ce881869`  
**Live URL:** <https://limited-night-planner.sociobot.in/>  
**Verdict:** **FAIL** — do not release this candidate.

## Scope and environment

Verification used a clean, unchanged checkout at the candidate SHA, Node 22, and Chromium installed for the repository's Playwright 1.55.0 dependency. The repository pins Playwright 1.55 while the supplied browser cache was for 1.58, so Chromium revision 1234 was installed with `npx playwright install chromium` before browser tests. No product source files were changed.

The live deployment was verified against the produced `dist/` artifact. SHA-256 matched for every deployed non-source-map file: HTML, generated app JS/CSS, all three self-hosted fonts, image assets, icons, manifest, service worker, offline page, legal pages, robots, and sitemap. The deployed app asset hashes are `app-Bc5xIj5h.js` = `cd03c808…f5269090` and `app-KGsRTwH6.css` = `4b6e45fa…f5e1c9`.

## Checks run

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`: 63 packages audited; 0 vulnerabilities reported. |
| Unit tests | PASS | `npm test`: 8/8 Vitest tests passed. |
| Type check | PASS | `npm run check` (`tsc --noEmit`) passed. |
| Exact production build | PASS | `npm run build` passed; `dist/` produced and the service worker precached 20 files. |
| Browser suite | PASS | `npm run test:e2e`: 5/5 Playwright tests passed after installing matching Chromium. |
| Bundle budgets | PASS | Initial JS 32,432 B raw / 11,270 B gzip; CSS 19,176 B raw / 5,100 B gzip; fonts total 78,904 B; mobile hero 30,426 B. All are within the stated static/PWA budgets. |
| Normal end-to-end workflow | PASS | On both 1440×900 and 390×844: created a five-player direct-pool event, entered names and 300 components, generated five seating rounds with a bye, started the timer, reached host sheet, and downloaded JSON. No online console/page errors. |
| Keyboard and visible focus | PASS | Skip link and planner path operate by keyboard; observed focus ring was `rgb(224, 180, 76) solid 3px`. |
| Responsive / print / reduced motion | PASS | No horizontal overflow at 390px or desktop; print hides masthead/tools and shows host sheet; reduced motion computes `scroll-behavior: auto` and transition duration `0.00001s`. |
| Privacy and outbound requests | PASS | Fresh app load requested only `https://limited-night-planner.sociobot.in`; no analytics, CDN fonts, or third-party scripts. Plan remains in IndexedDB; license request is not made without a stored license. |
| Offline reload | PASS | On live 390px app, after saved plan and active SW (`lnp-v2-static`), `context.setOffline(true)` + reload restored “Live offline audit” and displayed the offline banner. Chromium logs the expected failed connectivity probe while offline. |
| PWA update | **FAIL** | A clean temporary copy of the exact `dist/` was served locally. After changing only SW cache version `lnp-v2` → `lnp-v3`, the app displayed “A fresh version is ready. Update now”. Clicking **Update now** left `registration.waiting === true` after 1.5 s; the new worker was not activated/reloaded. |
| Axe serious/critical | **FAIL** | Independent axe run on populated Format step at desktop and 390px found one serious `color-contrast` violation. `.field-help` has `#c8d0d7` on `#f3e8cc`, contrast **1.27:1** at 14.4px (WCAG AA requires 4.5:1). |
| Invalid input / recovery | PARTIAL | Malformed JSON stays recoverable and does not replace the plan, but its user message is raw parser text. Numeric values clamp internally without feedback while displaying the invalid entered number until rerender. |
| Live response policy / caching | PARTIAL | HTTPS, HSTS, strict-origin referrer policy, and `nosniff` are present. No CSP or Permissions-Policy is returned. All hashed static assets are only `cache-control: public, must-revalidate, max-age=30` rather than immutable long-lived cached assets; manifest is `application/octet-stream` rather than a manifest JSON MIME type. |

## Defects

### High — PWA update action does not apply an available service-worker update

**Reproduction:** Open a new local browser profile against the production build, wait for SW control, deploy a byte-different `sw.js`, call `registration.update()`, wait for the in-app update toast, then click **Update now**.

**Observed:** the app shows the update toast, but the updated worker remains in `registration.waiting`; no controller change or reload follows. The button posts `SKIP_WAITING` to `navigator.serviceWorker.controller` (the active old worker), rather than the waiting worker. Hosts can remain on a stale cached shell even after accepting an update.

**Expected:** the waiting worker receives `SKIP_WAITING`, activates, claims clients, and causes a controlled reload.

### High — serious WCAG contrast failure in the standard planner path

**Reproduction:** Start a night, add any group, go to Format, and run axe.

**Observed:** `p.field-help` (“Write only your own notes…”) renders `#c8d0d7` on `#f3e8cc` at 1.27:1. This occurs at both audited viewports and violates the explicit “zero serious/critical” gate.

**Expected:** body-sized helper text on paper meets at least 4.5:1 (for example, use the documented paper-surface muted ink token).

### Medium — out-of-range numbers visibly disagree with the calculation

**Reproduction:** On Inventory enter Players `65` and Count `1000001`.

**Observed:** fields continue to display `65` and `1000001`, but the live board silently computes 64 players and 1,000,000 components (Needed 2,892; Usable 1,000,000). Switching steps rerenders fields as `64` and `1000000`. Similarly, a displayed player count of `0` is silently calculated as 2.

**Expected:** validate and explain the bound immediately, or update the displayed field synchronously. A host must not have to infer which value the plan actually uses.

### Medium — malformed import feedback exposes parser text, not an actionable recovery message

**Reproduction:** Import a file containing `not json`.

**Observed:** toast says `Unexpected token 'o', "not json" is not valid JSON`.

**Expected:** plain-language recovery guidance such as “This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.” The existing state did remain intact.

### Low — response policy and static caching are below the PWA delivery guidance

**Observed:** no Content-Security-Policy or Permissions-Policy; every fingerprinted JS/CSS/image/icon asset returns a 30-second revalidating cache policy, and the manifest has `application/octet-stream` MIME.

**Expected:** deploy immutable, long-lived caching for fingerprinted assets; serve the manifest as `application/manifest+json` (or JSON); consider an appropriate CSP and Permissions-Policy.

## Notes

- The first `npm run test:e2e` attempt failed solely because the repository's Playwright browser executable was absent. It was rerun after the prescribed `npx playwright install chromium`, then passed 5/5.
- A Lighthouse CLI run was attempted with the installed Chromium and `--no-sandbox`, but the container's launcher could not connect to Chrome and generated no report. This does not affect the direct budget measurements above or the independent axe results.
- Original first-load online console/page-error capture was clean. The deliberate offline reload logs `net::ERR_FAILED` for the app's manifest connectivity probe, while the app correctly catches it and serves the saved plan.

## Required next steps

1. Send the update message to `registration.waiting` (with a safe fallback), then add an automated test proving button click activates and reloads the new worker.
2. Correct helper-text color on paper and extend axe coverage to the Format/Schedule/Host sheet states and desktop.
3. Make numeric validation visible and actionable; replace raw JSON parser output with product copy.
4. Configure production immutable caching and manifest MIME/security headers, then rerun this verification.
