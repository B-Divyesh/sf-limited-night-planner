# Polish 3 — cumulative repair map

**Candidate repaired:** `fdf80aac1de7a4524fc2377fc9ef7992bf57400f`
**Repair commit:** `9dd570e`

All earlier review records, polish records, and review 3 were reread. The rows
below map every finding to the current implementation and evidence.

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the public artwork-origin statement out of visitor copy. Provenance remains in `design.md`. | `standard routes have a shared header and footer, and the 404 is a complete route`; live root check and screenshot. |
| F-1-2 | Kept the designed 404 with `Page not found`, skip link, `main#main`, route metadata, Apple icon, and return links. | Live 404 result in `live-route-check.json`; accessibility suite. |
| F-1-3 | Kept the common wordmark, Demo/Privacy links, one-line footer, legal links, source link, and build label on every route. | `standard routes have a shared header and footer, and the 404 is a complete route`; live route check. |
| F-1-4 | Kept the short reader-facing billing-check sentences in README. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`. |
| F-1-5 | Kept the named README project-notes list. | Same review regression test. |
| F-1-6 | Kept browser and license outcome language in README and Privacy. | Same review regression test; live Privacy check. |
| F-1-7 | Kept direct planner labels such as Event details, Component check, Pool format, Set-up checklist, and Print and export. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; live demo screenshot. |
| F-1-8 | Kept `Plans stay in this browser` on Privacy. | Live Privacy route in `live-route-check.json`. |
| F-1-9 | Kept `Requires Node.js 22 or later.` in README. | Same review regression test. |
| F-2-1 | Kept all three required trust facts within the desktop first screen. | `desktop first screen keeps each offline, privacy, and free fact in view`; live bottoms 670.2, 695.8, and 721.4 px in a 900 px viewport. |
| F-2-2 | Kept the original 180 px Apple touch icon on all routes. | `ships an original 180 pixel Apple touch icon`; live route metadata check. |
| F-3-1 | Replaced the unlisted fresh-use claim with `Enter the component counts you have.` The only offline promise remains the separately tested first-visit claim. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; `@claim:offline-after-first-visit`; live root screenshot. |
| F-3-2 | Added the shared `route-focus.js` shell. Same-site document navigation now focuses the new `h1` and updates a polite route announcer; app routes wait until planner data has rendered. | `document route changes focus and announce the new route heading`; live check records `Demo opened.` and `Planner opened.` with both headings focused. |
| F-3-3 | Added a synchronous self-hosted `route-redirect.js`; `?demo=1` replaces the URL with `/demo/` before app rendering. | The `@claim:demo-sandbox` test now asserts final URL, title, canonical, and OG URL; live `queryDemo` check records `/demo/` metadata and banner. |
| F-3-4 | Replaced `round-robin` with `Avoid repeat opponents until everyone has played each other.` on landing and README. | Landing copy audit; review regression and cold-landing test; `@claim:first-cycle-pairings`. |
| F-3-5 | Replaced the Host sheet slogan with `Review the set-up checklist, component list, and seating in one host sheet.` | Review regression; live mobile demo screenshot. |

## Acceptance evidence

- The catalog description is verb-first and 48 characters:
  `Plan fair tabletop events with mixed components.`
- `.factory/claims.json` has 17 claims with one tagged observable browser test
  each. All 17 exact commands passed from a clean clone in desktop and mobile
  projects (34 executions).
- The full clean-clone browser suite passed 84 tests. The dedicated Axe suite
  passed 16 tests.
- Live proof is in `.factory/evidence/polish-3/`, including root and demo
  screenshots, `verify-url.sh` output, route/metadata/Axe/focus data, and the
  Lighthouse JSON report.
