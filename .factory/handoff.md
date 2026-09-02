# Limited Night Planner — verification 13 handoff

## Result

**PASS.** Candidate `90876d28009965b691dfc875afb46591e7aed336` is accepted
at <https://limited-night-planner.sociobot.in/>. Fresh byte comparison confirms
all 33 publicly served production files exactly match this candidate’s build.
Visible live build ID: `1.0.7-polish-4`.

No product code was changed during this verification. The detailed independent
report is [verification-13.md](./verification-13.md).

## How to run

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run build
```

Use `/demo/` or `?demo=1` for the isolated sample. The persistent demo banner
offers **Reset demo** and **Start for real**. Sample data uses a separate
browser database and is discarded when leaving demo mode.

## Exact verification evidence

- Fresh checkout at `90876d28009965b691dfc875afb46591e7aed336`:
  - `npm ci` passed with no reported vulnerabilities.
  - `npm run check` passed.
  - `npm test` passed, 17/17 tests.
  - `npm run build` passed and produced `dist/`; 26 files were precached.
    App JavaScript is 13.59 kB gzip and CSS is 6.07 kB gzip.
  - Every exact command in `.factory/claims.json` ran separately before the
    normal test gates and passed. The whole suite also passed: 17 claims, 34
    desktop/390px browser executions.
  - `npm run test:e2e` passed, 86/86 browser checks. This includes unit,
    integration, keyboard, route focus, route metadata, storage failure,
    privacy, offline reload/export, service-worker update, demo isolation, and
    browser Axe coverage.
- Production cold-read passed: headline identifies the tabletop planning job,
  identifies hosts with mixed components, and offers **Try it with sample
  data** first. One click opens the isolated demo banner with reset/start-real
  controls.
- Live request capture found only same-origin page resources, no cookies, and
  no console/page errors. Production headers provide CSP, HSTS, nosniff,
  strict referrer policy, and immutable caching for hashes.
- Live offline reload after service-worker control passed at `/demo/`; the
  sample host sheet and offline notice remained available.
- Live Axe across Landing, Demo, Privacy, Terms, and 404 found zero serious or
  critical findings. Mobile Lighthouse was 100 for performance, accessibility,
  best practices, and SEO (FCP 1.4 s, LCP 1.5 s, CLS 0, TBT 0 ms).
- The live rate-limit check observed 30 readable invalid-token responses out
  of 300 rapid requests, then 270 HTTP 429 responses with `Retry-After`.

## Known gaps and next steps

None. New Night Pass sales remain intentionally unavailable; existing verified
passes can restore local archives, as disclosed on the landing page, in the
planner, README, Privacy, and Terms.
