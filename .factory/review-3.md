# Adversarial first-read review 3 — Limited Night Planner

**Checked:** 2026-09-02 UTC  
**Live URL:** <https://limited-night-planner.sociobot.in/>  
**Candidate reviewed:** `937fb78112f63538a6d94268fb416627491d0863`  
**Verdict:** **FAIL**

The core job is clear, the sample is useful, and all declared claims pass. This is a FAIL because five findings remain.

## Cold first read

Fresh Chromium contexts opened the live landing page at 390×844 and 1440×900 before scrolling or reading repository material.

| Question | First-screen answer | Exact supporting copy | Result |
| --- | --- | --- | --- |
| What does this do? | It plans a fair tabletop event. | `Plan a fair tabletop event.` | Pass |
| Who is it for? | Hosts with mixed components who need a schedule before friends arrive. | `For hosts using mixed components, build a fair schedule before friends arrive.` | Pass |
| What should I select first? | Open the finished sample host sheet. | `Try it with sample data` / `See a ready five-player host sheet.` | Pass |

The sample action, its outcome, and all three offline/privacy/free facts were fully visible at both sizes. The 390 px page had no horizontal document overflow. The art-deco night-board, original route-table art, clipped paper panels, brass rails, and local typefaces are distinct and match the documented design rather than a generic SaaS template.

## Findings

### F-3-1 — High — the landing makes an unlisted, stronger fresh-use offline claim

**Location and quote:** landing hero: `No card database or venue Wi-Fi needed.`

**Check:** This sentence has no entry in `.factory/claims.json`. It also implies that a new visitor can use the planner with no connection, while the listed and tested fact is only `Works offline after the first visit.` A fresh offline browser cannot obtain the app before that first visit.

**Why this matters:** A host arriving at a venue for the first time can rely on this wording and discover that the app has not yet been cached. The sentence is both an unlisted claim and less precise than the product's actual offline boundary.

**Concrete fix:** Remove the sentence, or replace it with `Enter the component counts you have.` Keep the separate listed `Works offline after the first visit.` fact. If a no-card-database assertion is retained, add a separately observable claim and clean-context test for it.

### F-3-2 — Medium — navigation between document routes leaves focus on `<body>`

**Location and evidence:** live landing → **Try it with sample data** → `/demo/`, then browser Back. In both directions, `document.activeElement` was `BODY`; it was not the new route's `<h1>`, and no route-change announcement was made.

**Why this matters:** The route contract requires focus to move to the new `<h1>` and announce the change. Keyboard and screen-reader visitors lose their place after using the visible Demo link or the first-screen sample action.

**Concrete fix:** Handle document-route navigation and history restoration in the shared page shell: on navigation from another product route, focus the new `main h1` with `tabindex="-1"` and announce its route name in a polite live region. Add a Playwright test covering `/` → `/demo/` and browser Back.

### F-3-3 — Medium — the documented `?demo=1` entry declares the landing as its canonical page

**Location and evidence:** direct live `https://limited-night-planner.sociobot.in/?demo=1` opens the sample and sets the title to `Demo — Limited Night Planner`, but its canonical remains `https://limited-night-planner.sociobot.in/`. `.factory/demo.md` explicitly documents `?demo=1` as a demo entry point.

**Why this matters:** The browser is showing the sample product state while telling search engines and shared metadata consumers that it is the ordinary landing page. This is inconsistent route metadata for a public, documented entry URL.

**Concrete fix:** Redirect `?demo=1` to `/demo/` before rendering, or update its canonical, description, Open Graph, and Twitter metadata to the `/demo/` route. Add a route-metadata test for the query entry point.

### F-3-4 — Low — `round-robin` is unexplained tournament jargon in landing and README copy

**Location and quote:** landing step 3 and README: `Avoid repeat opponents for one round-robin cycle.`

**Why this matters:** The target user is a casual tabletop host, not necessarily a tournament organiser. The sentence states the useful result but uses a term a new host may not understand.

**Concrete fix:** Use `Avoid repeat opponents until everyone has played each other.` in both locations. It preserves the declared `first-cycle-pairings` claim and names the outcome in ordinary language.

### F-3-5 — Low — the demo host-sheet subtitle is a slogan, not an explanation

**Location and quote:** live demo, Host sheet: `One page for every transition.`

**Why this matters:** It does not tell a first-time host what the page contains or how it helps them run the event. `Transition` is also undefined in this context.

**Concrete fix:** Replace it with `Review the set-up checklist, component list, and seating in one host sheet.`

## Landing-page copy audit

Word counts use visible whitespace-delimited words. Headings, navigation, and controls are checked after the sentence table. No sentence exceeds 22 words.

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Headline | Plan a fair tabletop event. | 5 | Pass |
| Hero | For hosts using mixed components, build a fair schedule before friends arrive. | 12 | Pass |
| Hero | No card database or venue Wi-Fi needed. | 7 | **F-3-1** unlisted/overbroad claim |
| Sample action note | See a ready five-player host sheet. | 6 | Pass |
| Fact | Works offline after the first visit. | 6 | Pass; `offline-after-first-visit` |
| Fact | Plan data stays in this browser. | 6 | Pass; `local-plan-data` |
| Fact | Planning, timers, printing, and exports stay free. | 7 | Pass; `free-core-tools` |
| Step 1 | Include only groups that can mix. | 6 | Pass |
| Step 2 | See whether the count covers each player. | 7 | Pass |
| Step 3 | Avoid repeat opponents for one round-robin cycle. | 7 | **F-3-4** jargon; `first-cycle-pairings` |
| Step 4 | Use the timer and print the host sheet. | 8 | Pass; `core-planning` |
| Footer | Plan a casual limited event from mixed components. | 8 | Pass |
| Footer | Your plan stays in this browser. | 6 | Pass; `local-plan-data` |

`Planner for casual limited events` and `How the planner works` name their sections. `Try it with sample data` and `Start a real plan` name their results. The navigation labels name destinations. Apart from F-3-1 and F-3-4, the landing has no long sentence, marketing adjective, metaphor heading, inconsistent term, or non-result-naming button.

## README copy audit

Every reader-facing prose sentence is listed. The README has no sentence over 22 words. JSON, CSV, Node.js, Vite, and `dist/` are format/runtime names in developer instructions, not unexplained visitor-facing marketing language.

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Opening | Plan a fair casual tabletop event from mixed components. | 9 | Pass |
| Opening | It is for hosts who need pools, seating, timed rounds, and a host sheet without a card database. | 18 | Pass |
| What it does | Checks component totals and creates pools, seating rounds, a timer, and a host sheet. | 14 | Pass; `core-planning` |
| What it does | Avoids repeat opponents for one round-robin cycle and warns before another cycle begins. | 13 | **F-3-4** jargon; listed claims |
| What it does | Keeps a running timer after a refresh. | 7 | Pass; `timer-persistence` |
| What it does | Exports the plan as JSON and the host sheet as CSV. | 11 | Pass; listed export claims |
| What it does | Keeps plan data in this browser and works offline after the first visit. | 13 | Pass; listed claims |
| What it does | Keeps planning, timers, printing, and exports free. | 7 | Pass; `free-core-tools` |
| Demo | Try the ready five-player sample at https://limited-night-planner.sociobot.in/demo/. | 7 | Pass |
| Demo | Demo data uses a separate browser database and is discarded when you start for real. | 15 | Pass; `demo-sandbox` |
| Run locally | Requires Node.js 22 or later. | 5 | Pass |
| Run locally | Vite prints the local address. | 5 | Pass |
| Run locally | Each browser keeps its own plans. | 6 | Pass; `local-plan-data` |
| Test and build | The deployed billing service has a separate check. | 8 | Pass |
| Test and build | Run this only when checking that service. | 7 | Pass |
| Test and build | It sends test licenses and confirms repeated checks are temporarily limited. | 11 | Pass |
| Test and build | Use npm run build for production. | 6 | Pass |
| Test and build | It creates the deployable site in dist/. | 7 | Pass |
| Data, privacy, and billing | Plans and an existing Night Pass status stay in this browser. | 11 | Pass; `local-plan-data` |
| Data, privacy, and billing | No plan data is sent to a server. | 8 | Pass; `local-plan-data` |
| Data, privacy, and billing | The app has no advertising, behavioral analytics, trackers, third-party fonts, or social embeds. | 13 | Pass; `no-third-party-requests` |
| Data, privacy, and billing | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | Pass; `night-pass-sales-unavailable` |
| Data, privacy, and billing | Sociobot/Dodo is the merchant of record. | 6 | Pass; required billing disclosure |
| Data, privacy, and billing | See the privacy policy and terms. | 6 | Pass |
| License | MIT. | 1 | Pass |
| License | See LICENSE. | 2 | Pass |

Terminology is otherwise consistent: **event** for the occasion, **components** for physical material, **group** for compatible inventory, **pool** for each player's allocation, **host sheet** for the output, **plan** for stored work, and **sample data** for the demo.

## Demo and sandbox

| Check | Result |
| --- | --- |
| One-click entry | Pass. The visible landing action opens `/demo/`. |
| Immediate useful sample | Pass. The first demo view is the finished `Saturday mixed box night` host sheet, with 300 usable / 237 needed components, five named players, five seating rounds, byes, notes, printing, and both exports. |
| Persistent notice | Pass. `Demo — sample data, nothing is saved`, **Reset demo**, and **Start for real** are shown above the planner. |
| Reset and isolation | Pass. The declared `demo-sandbox` test edits, resets, starts for real, and re-enters the sample in separate browser storage. |
| Privacy/offline | Pass. The declared local-data, third-party-request, cookie, offline reload, and offline export tests passed from clean browser contexts. Live landing/demo requests were product-origin only. |

F-3-5 is the only plain-language defect found in the demo UI. It does not make the demo weak or non-isolated.

## Claims

Each exact test command in `.factory/claims.json` was run separately after `npm ci` in a clean clone. All 17 commands passed in both configured browser projects (34 browser executions):

| Claim ID | Result |
| --- | --- |
| `core-planning` | Pass |
| `demo-sandbox` | Pass |
| `offline-after-first-visit` | Pass |
| `local-plan-data` | Pass |
| `no-third-party-requests` | Pass |
| `no-analytics-cookies` | Pass |
| `json-export` | Pass |
| `csv-export` | Pass |
| `first-cycle-pairings` | Pass |
| `timer-persistence` | Pass |
| `timer-background` | Pass |
| `free-core-tools` | Pass |
| `night-pass-sales-unavailable` | Pass |
| `plan-deletion` | Pass |
| `reusable-archives` | Pass |
| `round-cycle-warning` | Pass |
| `offline-export` | Pass |

F-3-1 is the only live claim-like landing sentence without a matching claim entry. No declared claim test failed.

## Earlier findings checked from scratch

Every earlier review, polish record, and handoff was read. The live site and source confirm each earlier finding is actually fixed:

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | The public artwork-origin claim is absent from the live footer and `src/app.ts`. |
| F-1-2 | Fixed | The live unknown route returns a designed 404 with `Page not found`, skip link, `main#main`, metadata, and return links. |
| F-1-3 | Fixed | Landing, demo, Privacy, Terms, and 404 have the shared wordmark, Demo/Privacy links, one-line footer, legal links, Source link, and build label. |
| F-1-4 | Fixed | README billing-check instructions are split into short reader-facing sentences. |
| F-1-5 | Fixed | README project notes are a named link list. |
| F-1-6 | Fixed | README and Privacy use browser/license outcome language rather than storage/API implementation shorthand. |
| F-1-7 | Fixed | The cited transit-only planner labels are absent; task labels such as Event details and Print and export are present. |
| F-1-8 | Fixed | Privacy uses `Plans stay in this browser`. |
| F-1-9 | Fixed | README states `Requires Node.js 22 or later.` |
| F-2-1 | Fixed | At 1440×900 the three fact bottoms are 670, 696, and 721 px, all within the first viewport. |
| F-2-2 | Fixed | A local 180×180 Apple touch icon is declared on every checked route. |

None of the earlier IDs is repeated as an unfixed or regressed issue.

## Structure, routing, accessibility, and links

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; an unknown route returns the designed 404. Every checked route has `lang=en`, exactly one h1, one main landmark, a route title, description, canonical, Open Graph/Twitter data, favicon, and Apple touch icon.
- All rendered internal links, the Source repository link, and the contact link returned 200. `robots.txt`, `sitemap.xml`, and the social image are present.
- Fresh Axe scans at 390×844 and 1440×900 found zero serious or critical violations on the five checked routes. There was no page error or app console error on successful routes. The expected HTTP-404 network message occurs only when deliberately requesting the missing route.
- The header/footer skeleton is consistent and skip links work. Deep links and browser Back render the correct route. F-3-2 records the route-focus failure, and F-3-3 records the query-demo metadata failure.

## Missed leverage

No further feature finding. The brief's obvious portability need is covered by JSON import/export, CSV host-sheet export, print, and local-first storage. The remaining planning operations are deterministic; an AI step would not improve the rules-neutral, offline-first core job. Sync would broaden the stated local-first scope without evidence that it is needed.

## Verification summary

- Clean clone: `npm ci` passed with no vulnerabilities reported.
- `npm run check` passed.
- `npm test` passed: 14/14 tests.
- `npm run build` passed and produced `dist/`; the app bundle was 12.84 kB gzip and the service worker precached 24 files.
- `npm run test:e2e` passed: 82/82 tests.
- All 17 exact declared claim commands passed separately: 34/34 browser executions.

## What would make this perfect

Remove or accurately test the fresh-use connectivity claim, move focus and announce document-route changes, make the query demo canonical to `/demo/`, and replace the two remaining jargon/slogan lines. Add regression tests for each route/metadata and focus behaviour. Rerun the complete clean-clone claim, accessibility, and first-read checklist; then there should be no remaining finding.
