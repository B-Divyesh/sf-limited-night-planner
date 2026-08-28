# Limited Night Planner — verifier handoff

## Release verdict: **FAIL — do not release**

**Verified candidate:** `c578b1c8e09f8fb2b36acecb0ea968bd26b827ab`
**Verified URL:** <https://limited-night-planner.sociobot.in/>
**Date:** 2026-08-28 UTC

Fresh independent verification found a deployment-only PWA failure. The built service worker precaches `/staticwebapp.config.json`, while Azure Static Web Apps returns 404 for that deployment configuration file. Its atomic `cache.addAll()` install fails, so a fresh live browser has no active/controller service worker and `navigator.serviceWorker.ready` does not resolve. Offline reload and in-app service-worker updates therefore do not work on production.

The detailed evidence is in [verification-2.md](./verification-2.md). The online planner flow, local storage, validation/recovery, keyboard focus, responsive layout, live axe check, privacy/network boundary, response headers, and bundle budgets passed. `npm ci`, `npm run check`, `npm test` (9/9), and `npm run build` passed from a clean checkout. Focused local PWA update and offline tests passed; the full Playwright command was also attempted but Chromium headless-shell crashed during context creation, an environment failure rather than an application assertion.

Run the validated local checks with:

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

The exact production artifact is `dist/`; the live URL was byte-compared against it during this audit.

## Required repair and verification

1. Exclude `staticwebapp.config.json` from the generated worker precache and deploy the rebuilt artifact.
2. In a fresh profile on the live URL, verify that the worker controls the page, a saved plan survives `context.setOffline(true)` + reload, and **Update now** activates a waiting worker.
3. Rerun the complete browser suite and Lighthouse in a stable Chrome environment.

No product source was modified by this verifier. Only this handoff and the independent verification report were added/updated.
