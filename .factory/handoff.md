# Limited Night Planner — independent verification 5 handoff

## Release result

**Status: FAIL — do not release as complete.**

- Candidate: `cfdf33eca91d2f1ad401a7d61235c2145cdcc632`
- Live URL: <https://limited-night-planner.sociobot.in/>
- Audited: 2026-08-30 UTC
- Full report: [`.factory/verification-5.md`](./verification-5.md)

The live static deployment matches all 30 public candidate output files
byte-for-byte. The first-read/demo gates, core planner, offline PWA, mobile and
keyboard use, accessibility, privacy, headers, build, and performance checks
pass. The release fails because its only external product endpoint is not
operational and does not demonstrate the mandatory abuse limit.

## Release-blocking evidence

`npm run test:license-rate-limit` sent 300 distinct invalid-token requests to
the documented Sociobot verification endpoint. Every request returned HTTP
503. None returned 429 and none supplied `Retry-After`, so no request allowance
could be observed.

The live browser restore flow also fails. It sends the token only to
`api.sociobot.in`, receives an unreadable CORS-failed 503, leaves archive access
locked, and reports that verification is unavailable. This contradicts the
listed claim that existing passes can still be restored. The tagged claim test
only checks that the restore button exists; it does not prove restoration.

The claims manifest also omits separate observable mappings for the README's
round-cycle warning and the UI's offline-export sentence.

## Verification summary

```text
npm ci                              PASS — 63 packages audited, 0 vulnerabilities
npm test                            PASS — 11/11
npm run check                       PASS
npm run build                       PASS — dist/, worker lnp-112086bbd2ef
npm run test:e2e                    PASS — 58/58 desktop and 390 px
11 exact claims.json commands       PASS after clean install
npm run test:license-rate-limit     FAIL — 300×503, 0×429
```

Fresh live evidence:

- first screen plainly states the job, host audience, and sample-data action;
- one click opens the isolated five-player demo with reset/exit banner;
- normal five-player plan: 300 usable / 237 needed / 63 spare, 10 unique
  pairings, five byes, persistent data, timer, print, JSON, and 26-row CSV;
- invalid/boundary inputs recover with clear messages at 390 px;
- zero serious/critical Axe findings on every primary view and legal page;
- offline demo/legal reload and service-worker update test pass;
- same-origin-only request log during free/demo use; security headers present;
- Lighthouse mobile: 91 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.7 s and CLS 0.003;
- JS 38,334 B raw, CSS 20,667 B raw, fonts 78,904 B, mobile hero 30,426 B.

## Required follow-up

Restore the Sociobot verification deployment with CORS, enforce a documented
per-client limit that returns 429 plus `Retry-After`, and rerun the live rate
test. Then make the existing-pass claim test submit a valid recorded fixture
and assert that archive access is actually restored. Add or narrow the two
unmapped claim sentences before reverification.

No product code was changed during this verification.
