# Polish 5 — complete adversarial repair map

**Candidate repaired:** `b311d3268ece828eea6adb3d0fea3f051a141348`  
**Product repair commit:** `94bea74659d49ab4f88987739d45baf6e2a02726`  
**Live check:** 2026-09-02 UTC at <https://limited-night-planner.sociobot.in/>

Every review and earlier polish report was reread. All rows below name the
implemented repair and current evidence. The live route, Axe, and demo result
is recorded in `evidence/polish-5/live-route-axe-and-demo-check.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept artwork-origin language out of visitor copy; provenance stays in `design.md`. | `standard routes have a shared header and footer, and the 404 is a complete route`; live root screenshot `evidence/polish-5/live-root-desktop.png`. |
| F-1-2 | Retained the complete designed 404 with metadata, skip link, `main#main`, and return links. | Same route test; live `https://limited-night-planner.sociobot.in/this-route-does-not-exist` is 404 with one h1/main and zero Axe violations. |
| F-1-3 | Retained the shared wordmark, Demo/Privacy navigation, product line, legal links, source link, and build label on every route. | Same route test; five-route live check in `live-route-axe-and-demo-check.json`. |
| F-1-4 | Retained short billing-check guidance in README. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; clean-clone `npm test`. |
| F-1-5 | Retained the named README project-notes list. | Same README regression test; clean-clone `npm test`. |
| F-1-6 | Retained reader-facing browser and license language in README and Privacy. | Same README regression test; live `/privacy/` route check. |
| F-1-7 | Retained direct planner labels instead of transit-only labels. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; `evidence/polish-5/live-demo-repair-mobile.png`. |
| F-1-8 | Retained `Plans stay in this browser` on Privacy. | Live `https://limited-night-planner.sociobot.in/privacy/` scan: zero Axe violations. |
| F-1-9 | Retained `Requires Node.js 22 or later.` in README. | Same README regression test; clean-clone `npm test`. |
| F-2-1 | Retained all three offline/privacy/free facts in the first screen. | `evidence/polish-5/live-first-screen-focus-offline.json`: bottoms 725/751/777 px at 1440×900 and 775/801/826 px at 390×844. |
| F-2-2 | Retained the original 180×180 Apple touch icon on every route. | `standard routes have a shared header and footer, and the 404 is a complete route`; live five-route metadata check. |
| F-3-1 | Retained removal of the unsupported fresh-use Wi-Fi promise. | `cold landing names event hosts, offers the sample first, and explains pairings plainly`; live root screenshot. |
| F-3-2 | Retained focus transfer and polite route announcements. | `evidence/polish-5/live-first-screen-focus-offline.json`: Demo h1 focus with `Demo opened.`, then landing h1 focus with `Planner opened.` |
| F-3-3 | Retained synchronous `?demo=1` entry to the canonical demo route. | `@claim:demo-sandbox`; live demo repair flow ends at `https://limited-night-planner.sociobot.in/demo/` with the Demo title and banner. |
| F-3-4 | Retained plain wording for opponent rotation and removed tournament shorthand. | Plain-language regression test; live root screenshot. |
| F-3-5 | Retained the explanatory Host sheet subtitle. | `@claim:core-planning`; live demo screenshot `evidence/polish-5/live-demo-repair-mobile.png`. |
| F-4-1 | Retained observable totals, pools, seating, ticking timer, and host-sheet rows in the claim test. | `@claim:core-planning`, passed in both clean-clone browser projects. |
| F-4-2 | Retained removal of undefined `fair` promises. | `removes the undefined fairness promise and records the review-four landing sections`; live root cold check. |
| F-4-3 | Retained the read-only five-player sample preview with real totals, pool instruction, and first seating round. | `landing shows the sample plan, limits, privacy boundary, and optional archive boundary`; `evidence/polish-5/live-root-desktop.png`. |
| F-4-4 | Retained explicit non-goals and browser-data sections. | Same landing-structure test; live root screenshot. |
| F-4-5 | Retained the free-tools, existing-pass archive, and unavailable-new-sales boundary. | Same landing-structure test; live root screenshot. |
| F-4-6 | Retained accessible `(external)` link names. | `identifies every reviewed external link as external`; live five-route link check. |
| F-5-1 | The `free-core-tools` claim now replaces `window.print` with a spy, clicks **Print host sheet**, and asserts one call without a license. | `@claim:free-core-tools`, passed in both clean-clone browser projects; live demo repair flow records `printCalls: "1"`. |
| F-5-2 | Removed the unlisted `without a card database` sentence from README rather than making an untestable capability claim. | `keeps the round-five copy concrete and lists no card-database promise`; clean-clone `npm test`. |
| F-5-3 | Replaced the landing-preview heading with `Enough components for this plan`. | Same round-five regression test; live root mobile and desktop scans record `hasClearPreviewHeading: true`. |

## Acceptance evidence

- Clean clone at `94bea74`: `npm ci`, `npm run check`, `npm test` (18 tests),
  and `npm run build` all passed.
- Every one of the 17 exact commands in `.factory/claims.json` passed separately
  in that clone: 34 browser executions across desktop and mobile.
- Clean-clone `npm run test:e2e` passed: 86 tests, including accessibility,
  privacy-request, service-worker, route, mobile, and offline cases.
- Live `verify-url.sh` has no console errors, a valid title/language, one h1,
  main landmark, complete alternatives, and labeled buttons:
  `evidence/polish-5/live-root-verify/verify.json`.
- Live Axe scans have zero violations on landing, demo, Privacy, Terms, and 404
  at desktop and 390 px mobile widths. The deliberate document-404 request
  alone logs its expected network 404 in the browser console.
- Live mobile Lighthouse: Performance 100, Accessibility 100, LCP 1.4 s, CLS
  0.007, and total blocking time 0 ms:
  `evidence/polish-5/live-lighthouse-mobile.json`.
