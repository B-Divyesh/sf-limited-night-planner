# Polish 2 — review repair map

**Candidate repaired:** `282e8a5803ec8d802ce6caf7538ef254b4cfe972`  
**Repair commit:** `fdf80aac1de7a4524fc2377fc9ef7992bf57400f`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the public artwork-origin claim removed. Provenance remains only in `design.md`. | Clean-clone `npm run test:e2e`; live `/` screenshot: `evidence/polish-2/live-root-desktop.png`. |
| F-1-2 | Kept the complete, plain-language 404 route with skip link, metadata, and return links. Added the route-wide Apple icon. | Live `https://limited-night-planner.sociobot.in/this-route-does-not-exist` is 404 with its title, icon, and zero serious/critical Axe findings in `live-route-check.json`. |
| F-1-3 | Kept the shared header, footer, navigation, and legal links on landing, demo, legal, and 404 routes. | `standard routes have a shared header and footer, and the 404 is a complete route`; live route check. |
| F-1-4 | Kept the short, reader-facing billing check guidance in README. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`. |
| F-1-5 | Kept the named README project-notes list. | Same clean-clone regression test. |
| F-1-6 | Kept browser and license outcome language in README and Privacy. | Same clean-clone regression test; live `/privacy/` check. |
| F-1-7 | Kept direct planner labels rather than decorative transit-only labels. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; live `?demo=1` check. |
| F-1-8 | Kept `Plans stay in this browser` as the Privacy eyebrow. | Live `https://limited-night-planner.sociobot.in/privacy/` has zero serious/critical Axe findings. |
| F-1-9 | Kept `Requires Node.js 22 or later.` in README. | Same clean-clone regression test. |
| F-2-1 | Reduced the desktop hero’s type scale, vertical padding, art minimum height, and action spacing while preserving the art-deco route layout. Added a viewport regression test for all three facts. | `desktop first screen keeps each offline, privacy, and free fact in view`; live `live-review-2-check.json` records bottoms 670.2, 695.8, and 721.4px in a 900px viewport; screenshot: `live-root-desktop.png`. |
| F-2-2 | Added the original `apple-touch-icon.png` at 180×180 and declared it on landing, demo, Privacy, Terms, and 404. Added delivery and route tests. | `ships an original 180 pixel Apple touch icon`; `standard routes have a shared header and footer, and the 404 is a complete route`; live route check records 200 PNG and `sizes=180x180` on every route. |

## Verification

- Fresh-clone install: `npm ci`.
- Fresh-clone quality gates: `npm run check`, `npm test` (14 tests), and `npm run build` passed.
- Every exact command in `claims.json` passed from the clean clone: 17 commands and 34 browser executions.
- Fresh-clone full browser suite: `npm run test:e2e` passed, 82 tests across desktop and mobile projects.
- Live `verify-url.sh` output: `evidence/polish-2/live-root-verify/verify.json` has no console errors, one h1, `lang=en`, one main landmark, no missing image alternatives, and no unlabeled buttons.
- Live Axe scans across `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404 passed at both 1440×900 and 390×844; evidence: `live-route-check.json`.
- Live mobile Lighthouse: performance 100 and accessibility 100; evidence: `live-lighthouse-mobile.json`.
