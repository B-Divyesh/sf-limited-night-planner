# Polish 4 — complete adversarial repair map

**Candidate repaired:** `a5c3b98966be30746162bfa9e30165dc5c116848`  
**Product repair commit:** `9e1a40f737dc2d62c5ee56f3fce2e5b6d128a81f`  
**Live check:** 2026-09-02 UTC at <https://limited-night-planner.sociobot.in/>

Every earlier review and polish record was reread. The table maps each finding
to its current repair and evidence. “Live root” means the cold production check
at <https://limited-night-planner.sociobot.in/> recorded in
`evidence/polish-4/live-root-verify/verify.json`; its exact desktop and mobile
screenshot paths are `evidence/polish-4/live-root-verify/screenshot-desktop.png`
and `evidence/polish-4/live-root-verify/screenshot-mobile.png`.

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the public artwork-origin statement out of visitor copy. Provenance remains only in `design.md`. | `standard routes have a shared header and footer, and the 404 is a complete route`; Live root screenshot. |
| F-1-2 | Kept the designed 404 with `Page not found`, skip link, `main#main`, metadata, Apple icon, and return links. | `standard routes have a shared header and footer, and the 404 is a complete route`; live `/this-route-does-not-exist` returned 404 with one h1/main; `live-axe.json`. |
| F-1-3 | Kept one header/footer skeleton across landing, demo, legal, and 404 routes. | `standard routes have a shared header and footer, and the 404 is a complete route`; live route check. |
| F-1-4 | Kept the short, reader-facing billing-check instructions in README. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; clean-clone `npm test`. |
| F-1-5 | Kept the named README project-notes list. | Same review regression; clean-clone `npm test`. |
| F-1-6 | Kept browser and license outcome language in README and Privacy. | Same review regression; live `/privacy/` check. |
| F-1-7 | Kept direct planner labels rather than transit-only labels. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; live demo screenshot: `evidence/polish-4/live-demo-mobile.png`. |
| F-1-8 | Kept `Plans stay in this browser` on Privacy. | Live `/privacy/` route and zero-violation Axe result in `evidence/polish-4/live-axe.json`. |
| F-1-9 | Kept `Requires Node.js 22 or later.` in README. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; clean-clone `npm test`. |
| F-2-1 | Retained all three trust facts in the desktop and phone first screen after reflowing the longer plain headline. | `desktop first screen keeps each offline, privacy, and free fact in view`; Live root desktop/mobile screenshots. |
| F-2-2 | Kept the local 180px Apple touch icon declared on every route. | `standard routes have a shared header and footer, and the 404 is a complete route`; live route check. |
| F-3-1 | Kept the unsupported fresh-use Wi-Fi promise removed. | `cold landing names event hosts, offers the sample first, and explains pairings plainly`; cold live landing text check. |
| F-3-2 | Kept document-route focus movement and polite announcements. | `document route changes focus and announce the new route heading`; full clean-clone browser suite. |
| F-3-3 | Kept the synchronous `?demo=1` redirect to `/demo/` and demo metadata. | `@claim:demo-sandbox`; cold live `?demo=1` landed on `/demo/` with its canonical URL. |
| F-3-4 | Kept the plain opponent wording and removed tournament shorthand. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; live root screenshot. |
| F-3-5 | Kept the Host sheet explanation in place of the slogan. | Same direct-label regression; live demo screenshot. |
| F-4-1 | Strengthened `@claim:core-planning`: it now observes 300/237 totals, the five-pool instruction, concrete seating, a timer tick, host-sheet inventory, and a host-sheet round. The claim sandbox text now names those observations. | `@claim:core-planning` passed separately in both browser projects; cold live demo changed from `45:00` to `44:59` and showed the required pool, inventory, and round content. |
| F-4-2 | Removed `fair` from landing, planner, README, catalog description, metadata, and manifest. The new first-screen headline is `Plan pools and rounds for a tabletop event.` | `removes the undefined fairness promise and records the review-four landing sections`; cold live landing has no `fair` text; Live root screenshots. |
| F-4-3 | Added a read-only five-player sample preview directly below the first screen. It shows the real 300/237 board, pool instruction, first round, and a link to `/demo/`. | `landing shows the sample plan, limits, privacy boundary, and optional archive boundary`; Live root screenshots. |
| F-4-4 | Added `What the planner does not check` and `Where your data goes`, naming compatibility/rules limits and the explicit existing-license check. | Same landing-skeleton test; live root check and screenshots. |
| F-4-5 | Added `Optional plan archives`, explaining free core tools, existing-pass archive restoration, and unavailable new sales. | Same landing-skeleton test; live root check and screenshots. |
| F-4-6 | Renamed the shared source link to `Source code (external)` and the privacy contact link to `sociobot.in (external)`. | `standard routes have a shared header and footer, and the 404 is a complete route`; cold live route check across all five routes. |

## Verification

- Clean clone at `9e1a40f`: `npm ci`, `npm run check`, `npm test` (17/17),
  `npm run build`, every one of the 17 exact claim commands separately, and
  `npm run test:e2e` (86/86) all passed.
- Live `verify-url.sh` passed with no console errors, valid title/language, one
  h1/main, complete image alternatives, and labeled buttons:
  `evidence/polish-4/live-root-verify/verify.json`.
- Live Axe scans on landing, demo, Privacy, Terms, and 404 at desktop and
  390px found zero violations: `evidence/polish-4/live-axe.json`.
- Live mobile Lighthouse scored Performance 100 and Accessibility 100:
  `evidence/polish-4/live-lighthouse-mobile.json`.
