# Limited Night Planner — independent verification handoff

## Release verdict: FAIL

**Work order:** `limited-night-planner-verify-4`<br>
**Tested candidate:** `b8945912a73c510eb79e36cd1221f1e07a8d41a8`<br>
**Production:** <https://limited-night-planner.sociobot.in/><br>
**Audited:** 2026-08-30 UTC<br>
**Full report:** [`.factory/verification-4.md`](./verification-4.md)

Do not release this candidate as complete. The deployed app matches the
candidate and the core offline planner works, but four acceptance failures are
release-blocking:

1. `.factory/claims.json` is missing, so the mandatory first gate cannot run.
2. There is no one-click sample-data demo or isolated demo namespace; `/demo`
   and `?demo=1` both show the ordinary blank-plan landing page.
3. The cold first screen does not plainly name the intended event host.
4. **Buy Night Pass** reaches a live API endpoint that returns HTTP 404 instead
   of hosted checkout.

Additional findings: the landing's unqualified “repeat-free pairings” claim is
false for valid schedules beyond one round-robin circuit; denied localStorage
crashes the free app before it renders; and the required real 404,
canonical/social metadata, Param Factory attribution, and build ID are absent.

## Verification summary

```sh
npm ci                          # pass; 62 packages, 0 vulnerabilities
npm test                        # pass; 11/11
npm run check                   # pass
npm run build                   # pass; dist/; worker lnp-d1866016e1c7
npm run test:e2e                # pass; 28/28 desktop + 390px
npm run test:license-rate-limit # pass; 30×200, 270×429, Retry-After 3–4
```

- Exact deployment identity: 24/24 generated content files matched live by
  SHA-256; `staticwebapp.config.json` correctly remains deployment-only.
- Live core flow: inventory inclusion/exclusion, feasibility, five-player
  seating/byes, repeat warning, timer, print, JSON/CSV export, persistence,
  invalid input/import recovery all worked.
- PWA: installed worker, update test, offline plan reload, and offline legal
  pages passed.
- Privacy: the complete free flow stayed same-origin with no analytics,
  third-party scripts, or CDN fonts. Optional invalid-license verification sent
  only the token and stayed locked.
- Accessibility: zero serious/critical Axe findings in tested live screens;
  keyboard/focus, 390 px reflow, effective touch targets, and reduced motion
  passed.
- Mobile Lighthouse: 96 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.8 s and CLS 0.002.
- Bundle budgets pass: JS 35,589 B raw / 11,980 B gzip; CSS 19,511 B raw /
  5,150 B gzip; fonts 78,904 B; mobile hero 30,426 B.

No product source was changed. Only this handoff and the new independent
verification report were updated for QA.
