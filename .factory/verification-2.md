# Independent verification — FAIL

**Audited:** 2026-08-28 UTC
**Candidate commit:** `c578b1c8e09f8fb2b36acecb0ea968bd26b827ab`
**Production URL:** <https://limited-night-planner.sociobot.in/>
**Verdict:** **FAIL — do not release as a PWA.** The live service worker cannot install, so the required offline and update behaviour is absent.

## Executive evidence

The candidate's built worker precaches `/staticwebapp.config.json`. Azure Static Web Apps consumes that deployment configuration and returns **404** for it publicly. The worker's install handler uses atomic `cache.addAll(PRECACHE)`, so that one 404 rejects the install. In a fresh Chromium profile against the live URL:

- the page issued no successful `sw.js` installation request from its own registration path;
- an initially visible transient registration disappeared after installation;
- `navigator.serviceWorker.ready` remained unresolved after 3 seconds, `getRegistration()` was false, and there was no controller;
- the partially created `lnp-bd26f86b0bc1-static` cache remained, consistent with `caches.open()` occurring before `cache.addAll()` rejected.

Directly requesting every generated precache URL returned 200 except `/staticwebapp.config.json`, which returned `404 text/html`. The same result occurred in a complete live-vs-`dist` SHA-256 audit: 21 of 22 non-source-map build files matched byte-for-byte; this one configuration file was the sole non-200/non-matching path. Local Vite serves that file, which explains why the repository's local PWA tests pass while production fails.

## Local clean-checkout results

The repository was clean and already at the requested candidate SHA before installing dependencies. No product code was changed.

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`: 63 packages audited, 0 vulnerabilities. |
| Type check | PASS | `npm run check` (`tsc --noEmit`). No lint script exists. |
| Unit/delivery tests | PASS | `npm test`: 9/9 Vitest tests passed. |
| Exact production build | PASS | `npm run build` produced `dist/`; generated worker precached 21 paths (`lnp-bd26f86b0bc1`). |
| Browser suite | INCONCLUSIVE ENVIRONMENT / focused checks PASS | A full `npm run test:e2e` was attempted after installing the repository's Playwright Chromium. It was interrupted by a Chromium headless-shell `SIGSEGV` while creating a new browser context, not an application assertion. Focused reruns passed: normal odd-player/timer/export path on desktop and 390px mobile; offline reload at 390px; and the service-worker update test on both desktop and mobile against the local production build. |
| Local SW update | PASS locally | Both focused `service-worker-update.spec.ts` projects passed: a byte-different worker became waiting, **Update now** activated it and reloaded into the new version. This cannot compensate for production installation failure. |

## Live functional and UX checks

The online application shell otherwise behaves as the researched brief requires.

- At 1440×900 and 390×844, created a five-player event with named participants and 300 components; the planner reported **Ready with room**, generated three rounds with a bye in each, started the timer, opened the host sheet, and downloaded CSV. No page errors or console errors were observed.
- A live timer progressed to `44:59` and remained `44:59` after reload, demonstrating IndexedDB persistence while online.
- Boundary handling on the live mobile app was correct: players `1` -> `2`, `65` -> `64`, group count `-1` -> `0`, and `1000001` -> `1000000`. Invalid JSON preserved the plan and displayed: “This file is not valid planner JSON. Choose a JSON backup exported by Limited Night Planner.”
- Keyboard: Tab lands on the skip link and the observed visible focus ring is `rgb(224, 180, 76) solid 3px`.
- At 390px, document width equalled client width (390px); no horizontal overflow was found. With reduced motion, computed scroll behaviour was `auto` and button transition duration was `0.00001s`.
- Axe had zero serious/critical findings on the populated live host sheet at both desktop and 390px. The repository's standard-step axe test also passed in both viewport projects before the unrelated Chromium crash.
- Fresh free-use network capture contained only `https://limited-night-planner.sociobot.in`; no analytics, third-party scripts, or CDN fonts were observed. The optional license endpoint is not requested without a stored license.

## Deployment, privacy, and performance evidence

| Area | Result | Evidence |
| --- | --- | --- |
| Candidate/live identity | PARTIAL / defect exposed | All public application assets, legal pages, fonts, icons, manifest, HTML, and worker matched local `dist` byte-for-byte. The generated worker also includes non-public `staticwebapp.config.json`, which the live host returns as 404 and which breaks installation. |
| Response policy | PASS | HTTPS; HSTS; self-only CSP with the Sociobot API as the sole cross-origin `connect-src`; restrictive Permissions-Policy; `nosniff`; strict-origin referrer policy. |
| Cache and MIME | PASS | Hashed assets return `public, max-age=31536000, immutable`; document/worker use short revalidation; manifest returns `application/manifest+json`. |
| Bundle budgets | PASS | Initial app JS: 33,684 B raw / 11,660 B gzip; app CSS: 19,323 B raw / 5,120 B gzip; fonts: 78,904 B total; mobile hero: 30,426 B. All satisfy the stated static/PWA budgets. |
| Lighthouse | NOT AVAILABLE IN THIS CONTAINER | Lighthouse 13 was attempted against live Chromium. The first attempt had no Chrome path; a retry with Playwright Chromium ended `TargetCloseError` during CDP setup and produced no report. Direct accessibility, response, budget, and browser measurements above were completed. |

## Defects

### High — production service worker install fails; offline PWA promise is broken

**Reproduction**

1. Open the live URL in a new browser profile.
2. Wait for page load, then inspect `navigator.serviceWorker.getRegistration()` / `navigator.serviceWorker.ready`.
3. Fetch each path in live `sw.js`'s `PRECACHE` list.

**Observed**

`/staticwebapp.config.json` is in `PRECACHE` but returns 404 on the deployed host. `cache.addAll()` rejects; the worker never activates or controls the page. `navigator.serviceWorker.ready` does not resolve and the registration is absent after the failed install. Consequently a host cannot rely on first-visit caching, offline reload, or the in-app update flow in production.

**Expected**

All precache entries must be deployable public resources. Exclude deployment-only configuration from the generated precache (or otherwise ensure it is served), then re-deploy and verify a fresh-profile live offline reload and live update activation.

### Low — the full local Playwright command is not stable in this verifier container

`npm run test:e2e` hit a Chromium headless-shell segmentation fault while opening a new context. Focused tests passed, and the error did not originate in page code. This is not a product defect, but the release gate should be rerun in a stable browser environment after fixing the production PWA issue.

## Required next steps

1. Change the service-worker build input so `staticwebapp.config.json` is not precached; retain only actual deployable public files.
2. Deploy the rebuilt artifact and prove, on the live origin in a fresh profile, that the worker becomes controller, `context.setOffline(true)` + reload restores a saved plan, and a waiting worker activates via **Update now**.
3. Re-run `npm run test:e2e` through completion in a stable browser environment and rerun Lighthouse if that environment can launch Chrome.
