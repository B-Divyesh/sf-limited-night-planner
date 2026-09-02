# Adversarial first-read review 4 — Limited Night Planner

**Checked:** 2026-09-02 UTC  
**Live URL:** <https://limited-night-planner.sociobot.in/>  
**Candidate reviewed:** `a5c3b98966be30746162bfa9e30165dc5c116848`  
**Verdict:** **FAIL**

The live planner is clear, usable, isolated in demo mode, and technically
sound. All 17 declared claim commands pass. This review is still a FAIL because
six findings remain: one declared test does not prove its whole claim, the
central fairness promise is unlisted, three required landing sections are
absent, and external links are not identified as external.

## Cold first read

Fresh Chromium contexts opened the live page at 390×844 and 1440×900 before
scrolling.

| Question | First-screen answer in my own words | Exact supporting copy | Result |
| --- | --- | --- | --- |
| What does this do? | It turns component counts into a tabletop-event plan. | `Plan a fair tabletop event.` and `Enter the component counts you have.` | Pass; the word `fair` is reviewed in F-4-2. |
| Who is it for? | Hosts using a mixed physical collection before friends arrive. | `For hosts using mixed components, build a fair schedule before friends arrive.` | Pass; the word `fair` is reviewed in F-4-2. |
| What should I select first? | Open the finished five-player sample. | `Try it with sample data` beside `See a ready five-player host sheet.` | Pass |

The sample action and all three offline, privacy, and free-use facts were fully
visible at both sizes. Their bottom edges were 727 px at 390×844 and 721 px at
1440×900. The mobile document width was exactly 390 px. The blocking first-read
rule does not apply.

## Findings

### F-4-1 — High — the core-planning test does not prove all outcomes in its claim

**Location and quote:** `.factory/claims.json`, `core-planning`: `Checks
component totals and creates pools, seating rounds, a timer, and a host sheet.`
The tagged test only checks `300/237`, one bye string, the presence of a `Start
timer` button, and a `Set-up checklist` heading.

**Why this matters:** The claims contract requires an observable result rather
than the presence of a control. This green test would still pass if the timer
button did nothing, if no pool instruction were generated, or if the host sheet
contained only its heading. A first-time host can therefore rely on outcomes
that this test does not verify. Those parts of the declared claim remain
untested.

**Concrete fix:** In `@claim:core-planning`, assert the generated instruction
`Count 237 components into 5 pools of 45`, assert concrete inventory and round
rows on the host sheet, start the timer, and confirm its value decreases.
Alternatively, narrow this claim to only the outcomes the test currently
checks.

### F-4-2 — High — `fair` is an unlisted and undefined product claim

**Locations and quotes:** landing headline `Plan a fair tabletop event.`;
landing introduction `build a fair schedule`; README opening `Plan a fair casual
tabletop event`; planner subtitle `Choose a fair deal before anyone sits down.`;
catalog description `Plan fair tabletop events with mixed components.`

**Why this matters:** No `.factory/claims.json` entry defines or tests fairness.
Equal component counts and non-repeating first-cycle pairings are useful, but
they do not establish that an event is fair. The Terms page also says the host
must check compatibility and rules and that pairings are not guarantees. A
visitor can therefore read a broader promise than the product can verify.

**Concrete fix:** Replace the headline with `Plan pools and rounds for a
tabletop event.` Replace the introduction with `For hosts using mixed
components, check counts and build a schedule before friends arrive.` Remove
`fair` from the README, planner subtitle, and catalog description. If fairness
is retained, define it as specific measurable behavior in a claim and test each
part.

### F-4-3 — Medium — the landing page has no product or live-preview section

**Location and quote:** after the hero illustration, the landing page moves
directly to `How the planner works`. The illustration alternative is `Blank
tabletop components traveling along brass routes into four equal player kits`;
it is conceptual artwork, not a view of the planner.

**Why this matters:** The required landing skeleton places the product itself or
a live preview before the process explanation. A visitor must leave the landing
page to see the component board, feasibility result, rounds, or host sheet.

**Concrete fix:** Add a read-only sample preview after the first screen. Show
the real `300/237 usable / needed` board, one generated round, and a host-sheet
excerpt, with an `Open the sample plan` link.

### F-4-4 — Medium — the landing page omits the required privacy and non-goals section

**Location and quote:** the only landing privacy detail is `Plan data stays in
this browser.` The page moves from `How the planner works` directly to the
footer.

**Why this matters:** A host is not told on the landing page that the planner
does not supply publisher rules or decide whether component groups are
compatible. The one-line storage fact also does not explain the optional
license-check exception.

**Concrete fix:** Add a section titled `What the planner does not check` before
the footer. State that the host supplies compatibility notes and official
rules. Add a short `Where your data goes` paragraph that distinguishes local
plan data from an explicit existing-license check.

### F-4-5 — Medium — the landing page hides the Night Pass feature boundary

**Location and quote:** landing fact `Planning, timers, printing, and exports
stay free.` The landing page does not mention Night Pass or local plan archives.
That information first appears after a visitor starts a plan and opens Host
sheet.

**Why this matters:** The required paid-feature section must state what is free,
what the paid feature unlocks, and its price. Although new sales are currently
unavailable, existing passes still unlock archives. The landing page states the
free boundary without explaining the omitted feature.

**Concrete fix:** Add an `Optional plan archives` section: `Planning, timers,
printing, and exports are free. Existing Night Pass holders can restore local
plan archives. New passes are not available yet.` If sales resume, add the
exact price before adding checkout.

### F-4-6 — Low — external links are not identified as external

**Locations and quotes:** the shared footer link is `Source`; the Privacy page
links to `sociobot.in`. Their accessible names do not say that they leave this
site.

**Why this matters:** The route contract says external links must identify
themselves. Keyboard and screen-reader visitors otherwise receive the same cue
as for an internal route.

**Concrete fix:** Use visible or screen-reader-complete labels such as `Source
code (external)` and `sociobot.in (external)`. Apply the shared footer change on
landing, demo, Privacy, Terms, and 404.

## Copy audit

Counts use visible whitespace-delimited words. URLs and code tokens count as
one word. No sentence exceeds 22 words, and none contains a banned marketing
term. F-4-2 records the unlisted qualitative claim. Headings, labels, and
controls are checked after the tables.

### Landing-page sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Headline | Plan a fair tabletop event. | 5 | **F-4-2** |
| Introduction | For hosts using mixed components, build a fair schedule before friends arrive. | 12 | **F-4-2** |
| Introduction | Enter the component counts you have. | 6 | Pass |
| Sample action note | See a ready five-player host sheet. | 6 | Pass; sample verified |
| Fact | Works offline after the first visit. | 6 | Pass; `offline-after-first-visit` |
| Fact | Plan data stays in this browser. | 6 | Pass; `local-plan-data` |
| Fact | Planning, timers, printing, and exports stay free. | 7 | Pass as a declared claim; disclosure gap is F-4-5 |
| Step 1 | Include only groups that can mix. | 6 | Pass |
| Step 2 | See whether the count covers each player. | 7 | Pass; `core-planning` |
| Step 3 | Avoid repeat opponents until everyone has played each other. | 9 | Pass; `first-cycle-pairings` |
| Step 4 | Use the timer and print the host sheet. | 8 | Pass; `core-planning` test gap is F-4-1 |
| Footer | Plan a casual limited event from mixed components. | 8 | Pass |
| Footer | Your plan stays in this browser. | 6 | Pass; `local-plan-data` |

The average sentence length is 7.4 words. `Planner for casual limited events`
and `How the planner works` identify their content. `Try it with sample data`
and `Start a real plan` name their results. Navigation items are links to named
destinations. Terminology is otherwise consistent: event, components, group,
pool, host sheet, plan, sample data, archive, and Night Pass.

### README sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Opening | Plan a fair casual tabletop event from mixed components. | 9 | **F-4-2** |
| Opening | It is for hosts who need pools, seating, timed rounds, and a host sheet without a card database. | 18 | Pass |
| What it does | Checks component totals and creates pools, seating rounds, a timer, and a host sheet. | 14 | Listed; test gap is **F-4-1** |
| What it does | Avoids repeat opponents until everyone has played each other. | 9 | Pass; `first-cycle-pairings` |
| What it does | It warns before pairings begin repeating. | 6 | Pass; `round-cycle-warning` |
| What it does | Keeps a running timer after a refresh. | 7 | Pass; `timer-persistence` |
| What it does | Exports the plan as JSON and the host sheet as CSV. | 11 | Pass; export claims |
| What it does | Keeps plan data in this browser and works offline after the first visit. | 13 | Pass; local/offline claims |
| What it does | Keeps planning, timers, printing, and exports free. | 7 | Pass; `free-core-tools` |
| Demo | Try the ready five-player sample at https://limited-night-planner.sociobot.in/demo/. | 7 | Pass |
| Demo | Demo data uses a separate browser database and is discarded when you start for real. | 15 | Pass; `demo-sandbox` |
| Run locally | Requires Node.js 22 or later. | 5 | Pass; developer prerequisite |
| Run locally | Vite prints the local address. | 5 | Pass; developer instruction |
| Run locally | Each browser keeps its own plans. | 6 | Pass; `local-plan-data` |
| Test and build | The deployed billing service has a separate check. | 8 | Pass; developer instruction |
| Test and build | Run this only when checking that service. | 7 | Pass; developer instruction |
| Test and build | It sends test licenses and confirms repeated checks are temporarily limited. | 11 | Pass; describes the named verification command, not a visitor capability |
| Test and build | Use npm run build for production. | 6 | Pass; developer instruction |
| Test and build | It creates the deployable site in dist/. | 7 | Pass; build output verified |
| Data, privacy, and billing | Plans and an existing Night Pass status stay in this browser. | 11 | Pass; local-data and Night Pass claims |
| Data, privacy, and billing | No plan data is sent to a server. | 8 | Pass; `local-plan-data` |
| Data, privacy, and billing | The app has no advertising, behavioral analytics, trackers, third-party fonts, or social embeds. | 13 | Pass; `no-third-party-requests` |
| Data, privacy, and billing | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | Pass; `night-pass-sales-unavailable` |
| Data, privacy, and billing | Sociobot/Dodo is the merchant of record. | 6 | Pass; required billing disclosure |
| Data, privacy, and billing | See the privacy policy and terms. | 6 | Pass |
| License | MIT. | 1 | Pass |
| License | See LICENSE. | 2 | Pass |

README headings name their sections. Links and commands name their destinations
or results. JSON, CSV, Node.js, Vite, and `dist/` are necessary format, runtime,
or command names in developer documentation.

## Demo and sandbox

| Check | Result and evidence |
| --- | --- |
| One-click entry | Pass. The first-screen action opens `/demo/` in one selection. |
| Immediate useful state | Pass. The first demo screen is the completed `Saturday mixed box night` host sheet with 300 usable / 237 needed components, five named players, five seating rounds, notes, print, and exports. |
| Persistent notice | Pass. `Demo — sample data, nothing is saved`, `Reset demo`, and `Start for real` remain above the planner. |
| Reset | Pass. Replacing Host notes and selecting `Reset demo` restored `Ask players to return unused sleeves after the final round.` |
| Separate storage | Pass. A direct fresh `/demo/` context created only `limited-night-planner-demo`. Starting for real removed it and used `limited-night-planner`. |
| Real data untouched | Pass. A real plan named `Review four private plan` remained present after entering, editing, resetting, and leaving the demo. |
| Requests and cookies | Pass. The full live landing/demo flow requested only `https://limited-night-planner.sociobot.in` and left the cookie jar empty. |
| Offline | Pass. A fresh live context acquired service-worker control; after going offline and reloading, the sample heading, banner, and offline status remained. |

The demo is not a blocking finding.

## Claims

Every exact `test` command from `.factory/claims.json` ran separately from the
clean candidate checkout after `npm ci`. Each ran in the configured desktop and
390 px projects.

| Claim ID | Command result | Coverage result |
| --- | --- | --- |
| `core-planning` | Pass — 2/2 | **Incomplete; F-4-1** |
| `demo-sandbox` | Pass — 2/2 | Pass |
| `offline-after-first-visit` | Pass — 2/2 | Pass |
| `local-plan-data` | Pass — 2/2 | Pass |
| `no-third-party-requests` | Pass — 2/2 | Pass |
| `no-analytics-cookies` | Pass — 2/2 | Pass |
| `json-export` | Pass — 2/2 | Pass |
| `csv-export` | Pass — 2/2 | Pass |
| `first-cycle-pairings` | Pass — 2/2 | Pass |
| `timer-persistence` | Pass — 2/2 | Pass |
| `timer-background` | Pass — 2/2 | Pass |
| `free-core-tools` | Pass — 2/2 | Pass |
| `night-pass-sales-unavailable` | Pass — 2/2 | Pass |
| `plan-deletion` | Pass — 2/2 | Pass |
| `reusable-archives` | Pass — 2/2 | Pass |
| `round-cycle-warning` | Pass — 2/2 | Pass |
| `offline-export` | Pass — 2/2 | Pass |

Total command result: **17/17 commands and 34/34 browser executions passed.**
F-4-1 is an inadequately asserted declared claim; F-4-2 is the unlisted live
and README claim. No command itself failed.

## Earlier findings checked from scratch

Every earlier review, polish record, and handoff was read. Live behavior and
source confirm that all earlier findings remain fixed.

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | The artwork-origin statement is absent from visitor copy and `src/app.ts`. |
| F-1-2 | Fixed | The live unknown route returns a designed 404 with `Page not found`, skip link, `main#main`, metadata, and routes back. |
| F-1-3 | Fixed | Landing, demo, Privacy, Terms, and 404 share the wordmark, navigation, product line, legal links, source link, and build label. |
| F-1-4 | Fixed | README billing-check guidance is split into short sentences without the cited protocol shorthand. |
| F-1-5 | Fixed | README project notes are a named list. |
| F-1-6 | Fixed | README and Privacy describe browser and license outcomes rather than IndexedDB/localStorage/API implementation details. |
| F-1-7 | Fixed | The cited decorative planner labels are absent; direct task labels are present. |
| F-1-8 | Fixed | Privacy uses `Plans stay in this browser`. |
| F-1-9 | Fixed | README states `Requires Node.js 22 or later.` |
| F-2-1 | Fixed | All three facts fit inside both tested first viewports. |
| F-2-2 | Fixed | Every route declares the delivered 180×180 Apple touch icon. |
| F-3-1 | Fixed | The overbroad fresh-use Wi-Fi sentence is absent and the first-visit offline boundary remains explicit. |
| F-3-2 | Fixed | Landing → Demo and browser Back focus the new h1 and announce `Demo opened.` / `Planner opened.` |
| F-3-3 | Fixed | `?demo=1` redirects to `/demo/` with demo title, canonical, Open Graph URL, and sample state. |
| F-3-4 | Fixed | `round-robin` is absent from visitor copy; the plain opponent wording is present. |
| F-3-5 | Fixed | Host sheet explains that it contains the set-up checklist, components, and seating. |

None of the earlier IDs is repeated as unfixed or regressed.

## Structure, accessibility, links, and identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. An unknown route
  returned the designed 404.
- Every checked route had `lang=en`, one h1, one main, a route title under 60
  characters, description, canonical, Open Graph/Twitter data, SVG favicon,
  and 180 px Apple touch icon.
- Deep links, browser Back, route focus, the polite route announcement, and the
  `?demo=1` redirect worked. F-4-3 through F-4-5 cover the landing information
  order; F-4-6 covers external-link labeling.
- All internal links, metadata assets, the source repository, `sociobot.in`,
  `robots.txt`, and `sitemap.xml` returned 200. The sitemap lists all four real
  routes.
- Live Axe scans at 390×844 and 1440×900 found zero violations on landing,
  demo, Privacy, Terms, and the designed 404. The factory URL verifier found no
  page errors, one h1, one main, valid language/title, complete image
  alternatives, and labeled buttons.
- Representative successful routes had no console or page errors. The browser
  reported only the expected HTTP 404 when the missing route itself was
  deliberately requested.
- The art-deco night-board identity is distinct and matches `.factory/design.md`:
  original route-table art, clipped paper panels, brass rails, compressed local
  type, and restrained motion. It is not a generic SaaS template.
- The production app bundle is 12.87 kB gzip, below the static-product budget.

## Missed leverage

No additional feature finding. The brief's clear portability need is covered
by JSON import/export, CSV export, print, and local-first storage. Component
counting and round generation are deterministic, so an AI step would add
uncertainty rather than value. Cloud sync would expand the local-first scope
without evidence of need.

## Verification summary

- `npm ci` passed with zero reported vulnerabilities.
- `npm test` passed: 15/15.
- `npm run check` passed.
- `npm run build` passed and produced `dist/`; 26 files were precached.
- `npm run test:e2e` passed: 84/84.
- Every declared claim command passed separately: 34/34 browser executions.
- Live demo reset, data isolation, offline reload, cookies, requests, routes,
  links, focus, metadata, and Axe checks passed as described above.

## What would make this perfect

Strengthen the core-planning claim test so each promised result is observed.
Replace or precisely define and test every `fair` promise. Add the real product
preview, privacy/non-goals, and optional archive sections to the landing page.
Identify external links in their accessible names. Then rerun the complete
claim, copy, live demo, route, accessibility, and first-read review. At that
point there should be no remaining finding.
