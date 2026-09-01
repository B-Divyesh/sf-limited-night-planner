# Limited Night Planner — verification 9 handoff

## Result: FAIL

Do not accept the candidate named by work order
`limited-night-planner-verify-9`.

- Requested candidate: `baa4b839f13f7f591fb3537c5771fe5be94dd65f`
- Verification-input checkout, `origin/main`, and work-order base:
  `baa4b839f13f7f591fb3537c5771b83593d47868`
- Production: <https://limited-night-planner.sociobot.in/>
- Full report: [verification-9.md](./verification-9.md)

The requested object is absent from the clone and from every advertised origin
ref. The live deployment matches all 30 public build files from the different
checked-out revision byte-for-byte. Candidate identity therefore cannot be
established, which is a critical release blocker.

## What was verified

No product code was changed. On the available revision:

- Every one of the 17 commands in `.factory/claims.json` passed separately in
  both browser projects: 34/34 executions.
- `npm ci`, `npm run check`, `npm test` (13/13), `npm run build`, and
  `npm run test:e2e` (80/80) passed.
- Cold live first-read and the one-click isolated demo passed.
- Normal, boundary, invalid-input, persistence, print, timer, seating, import,
  JSON/CSV export, keyboard, focus, 390 px mobile, 200% text, reduced-motion,
  Axe, privacy-request, cookie, route, metadata, header, caching, service-worker
  update, and offline reload/export checks passed.
- The license verifier allowed 30 requests and then returned 270 HTTP 429
  responses with `Retry-After` for a 300-request burst.
- Fresh mobile Lighthouse scored 95 performance and 100 each for accessibility,
  best practices, and SEO. LCP was 1.76 s and CLS was 0.0025.

Evidence is in `.factory/verification-artifacts/`.

## Required next step

Provide or correct the candidate SHA, ensure that exact build is deployed, and
rerun independent verification. The tested application revision had no other
defect in scope.
