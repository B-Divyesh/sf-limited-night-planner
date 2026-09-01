# Limited Night Planner — verification 10 handoff

## Result

**PASS — accept candidate `baa4b839f13f7f591fb3537c5771b83593d47868`.**

Production: <https://limited-night-planner.sociobot.in/>

Demo: <https://limited-night-planner.sociobot.in/demo/>

Independent verification found no critical, high, medium, or low product
defects in the checked scope. Product source was not changed. The full record
is in [verification-10.md](./verification-10.md).

## How it was verified

- `npm ci` — passed; 62 packages added, 63 audited, 0 vulnerabilities.
- All 17 exact commands in `.factory/claims.json` — passed in both Playwright
  projects, 34/34 executions.
- `npm run check` — passed.
- `npm test` — passed, 13/13.
- `npm run build` — passed; `dist/` created, with service worker
  `lnp-6cb3a04024d3` precaching 23 files.
- `npm run test:e2e` — passed, 80/80 at desktop and 390 px.
- `npm run test:license-rate-limit` — passed; 30 readable responses followed
  by 270 HTTP 429 responses, all with `Retry-After: 3` or `4`.
- Factory URL check — passed in 797 ms with no valid-route console/page errors.
- Live Axe checks — zero serious or critical findings on all four planner
  steps at both viewports, plus landing, legal, and not-found pages.
- Live PWA check — worker active, shell cached, demo reloaded offline.
- Candidate/live identity — all 30 public build files matched byte-for-byte.
- Lighthouse 12.8.2 mobile — 94 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 1.80 s and CLS 0.0066.

The live sample was also checked through inventory, schedule, timer, host
sheet, print, JSON, and CSV. Boundary inputs, invalid import recovery,
persistence, keyboard use, focus, reduced motion, 200% text, request privacy,
headers, caching, routing, and links passed.

## Known gaps and next steps

New Night Pass sales remain intentionally unavailable until the factory makes
that purchase path available. The current UI states this directly and keeps
all core features free. No release-blocking work remains for this candidate.
