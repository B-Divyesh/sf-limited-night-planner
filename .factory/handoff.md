# Limited Night Planner — repair handoff

## Release verdict: ready

**Work order:** `limited-night-planner-repair-3`

**Verifier report:** commit `60faec9fdffe2e24e1e18a3812626af0aa0c5921`, candidate `c578b1c8e09f8fb2b36acecb0ea968bd26b827ab`

**Production URL:** <https://limited-night-planner.sociobot.in/>

**Date:** 2026-08-28 UTC

The release-blocking production PWA defect is repaired. Azure Static Web Apps consumes `staticwebapp.config.json` instead of serving it, and the generated worker now excludes that deployment-only file from its atomic precache. The final worker contains 20 public URLs and no `/staticwebapp.config.json` entry.

## Root cause and regression coverage

The candidate generated its precache from every file in `dist/`. That included Azure's deployment configuration, which returns 404 on the public origin; `cache.addAll()` therefore rejected the complete service-worker installation. Local tests missed this because Vite Preview served the config file as an ordinary asset.

The repair now covers both boundaries:

- `tests/delivery.test.ts` builds the artifact, parses `dist/sw.js`, and asserts that the deployment config is absent while the app and offline shells remain present.
- `scripts/serve-dist.mjs` models the production host by returning 404 for `/staticwebapp.config.json`; Playwright uses it for every browser test.
- `tests/e2e/offline.spec.ts` proves that a fresh worker still becomes controller, caches the application module, and restores a saved plan after `context.setOffline(true)` and reload.
- `tests/e2e/service-worker-update.spec.ts` proves a byte-different waiting worker activates through **Update now** and reloads into the new version.
- Playwright and `playwright-core` are pinned to 1.58.2, matching the supplied browser revision and eliminating verifier-environment skew.

The researched brief, art-deco night-service visual system, generated asset, local-first data model, paid unlock, and all previously passing product behavior are unchanged.

## Clean local verification

Run from `/work/repo`:

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Results on 2026-08-28 UTC:

- Clean install: 62 packages installed, 0 vulnerabilities.
- Type check: passed (`tsc --noEmit`). No separate lint script is configured.
- Unit/delivery: 10/10 passed, including exact precache exclusion coverage.
- Production build: passed; `dist/index.html` is at the artifact root; worker reports 20 precached files (`lnp-5ab2dd05f7e7`).
- Browser: 16/16 passed serially on Chromium 1.58.2 at 1440×900 and a Pixel 7 mobile profile fixed to 390×844.
- Workflow: odd-player seating/bye, timer, host sheet, JSON download, input bounds, import recovery, legal pages, IndexedDB persistence, and offline reload passed.
- Keyboard/accessibility: skip link and planner actions passed by keyboard; axe found zero serious/critical issues on landing and all four planner stops in both projects.
- Privacy: fresh free use contacted only the application origin; no analytics, CDN font, or third-party script request.
- Offline/update: worker controlled a fresh page despite the deployment config returning 404; saved state reloaded offline; the waiting-worker update activated and reloaded on desktop and mobile.
- Response-policy fixture: restrictive CSP and Permissions-Policy, manifest MIME, and immutable hashed-asset policy passed.
- Budgets: initial JS 33,684 B raw / 11,660 B gzip; CSS 19,323 B raw / 5,120 B gzip; fonts 78,904 B total; mobile hero 30,426 B.
- Local mobile Lighthouse 13.0.1: performance 98, accessibility 100, best practices 100, SEO 100; FCP 1.7 s, LCP 2.2 s, CLS 0.002, TBT 0 ms.

## Deployment and live evidence

Deployment and post-deploy identity, response-policy, fresh-profile offline, and update evidence will be recorded here immediately after the exact `dist/` artifact is uploaded.

## Known gaps

None known. Package/consumer validation is not applicable to this static PWA artifact.
