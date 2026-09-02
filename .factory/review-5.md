# Adversarial first-read review 5 — Limited Night Planner

**Checked:** 2026-09-02 UTC  
**Live URL:** <https://limited-night-planner.sociobot.in/>  
**Candidate reviewed:** `b311d3268ece828eea6adb3d0fea3f051a141348`  
**Verdict:** **FAIL**

The first screen, demo, sandbox, routes, and declared test commands work. This
round still fails because one declared claim is not fully exercised, one README
capability is absent from the claims manifest, and one landing heading is not
clear out of context. There are no blocking first-read, demo, or failing-test
findings.

## Cold first read

Fresh Chromium contexts opened production at 390×844 and 1440×900 before
scrolling.

| Question | Answer in my own words | Exact first-screen copy | Result |
| --- | --- | --- | --- |
| What does it do? | It turns component counts into pools and seating rounds for a tabletop event. | `Plan pools and rounds for a tabletop event.` | Pass |
| Who is it for? | Hosts using mixed physical components before friends arrive. | `For hosts using mixed components, check counts and build a schedule before friends arrive.` | Pass |
| What should I select first? | Open the ready five-player sample. | `Try it with sample data` beside `See a ready five-player host sheet.` | Pass |

The sample action and all three required facts fit in both first screens. On the
phone, the fact bottoms were 775, 801, and 826 px in an 844 px viewport. On
desktop they were 725, 751, and 777 px in a 900 px viewport. The 390 px page
had no horizontal overflow.

## Findings

### F-5-1 — High — the free-tools claim does not test printing

**Location and quote:** landing and README: `Planning, timers, printing, and
exports stay free.` `.factory/claims.json` maps this to `free-core-tools`.
The tagged test only confirms that the timer, print, and export buttons are
visible. No test clicks **Print host sheet** or observes `window.print`.

**Why this matters:** The claims contract requires the promised result, not
only a visible control. The declared test would stay green if the print handler
were removed or broken, leaving the `printing` part untested.

**Concrete fix:** In `@claim:free-core-tools`, replace `window.print` with a
test spy, click **Print host sheet**, and assert that the spy ran without a
license. Keep the existing functional timer and export claim tests.

### F-5-2 — High — the README has an unlisted no-database claim

**Location and quote:** README opening: `It is for hosts who need pools,
seating, timed rounds, and a host sheet without a card database.`

**Why this matters:** `without a card database` is a capability a host can rely
on, but no `.factory/claims.json` entry says or tests it. The manifest cannot
currently account for every public capability statement.

**Concrete fix:** Rewrite the sentence as `It is for hosts who need pools,
seating, timed rounds, and a host sheet.` Alternatively, add a `no-card-database`
claim and a clean-context test that completes the sample flow without a card
database or card-data request.

### F-5-3 — Low — a sample-preview heading is unclear out of context

**Location and quote:** landing sample preview, h3: `Ready with room`.

**Why this matters:** In a heading list, `room` does not identify what is
available or what is ready. A first-time visitor must read nearby totals to
infer that the plan has spare components.

**Concrete fix:** Use `Enough components for this plan`, or include the result:
`Enough components, with 63 spare`.

## Copy audit

Counts use visible whitespace-delimited words. No sentence exceeds 22 words,
and no banned marketing term appears. F-5-2 and F-5-3 are the only copy flags.

### Landing-page sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Headline | Plan pools and rounds for a tabletop event. | 8 | Pass; `core-planning` |
| Introduction | For hosts using mixed components, check counts and build a schedule before friends arrive. | 14 | Pass |
| Introduction | Enter the component counts you have. | 6 | Pass |
| Sample action note | See a ready five-player host sheet. | 6 | Pass; sample verified |
| Fact | Works offline after the first visit. | 6 | Pass; `offline-after-first-visit` |
| Fact | Plan data stays in this browser. | 6 | Pass; `local-plan-data` |
| Fact | Planning, timers, printing, and exports stay free. | 7 | **F-5-1** |
| Sample preview | Check the count, first seating round, and host-sheet instruction before opening the sample. | 13 | Pass; `core-planning` |
| Sample preview | Count 237 components into 5 pools of 45. | 8 | Pass; `core-planning` |
| Sample preview | Set aside the 12-component reserve. | 5 | Pass; `core-planning` |
| Step 1 | Include only groups that can mix. | 6 | Pass |
| Step 2 | See whether the count covers each player. | 7 | Pass; `core-planning` |
| Step 3 | Avoid repeat opponents until everyone has played each other. | 9 | Pass; `first-cycle-pairings` |
| Step 4 | Use the timer and print the host sheet. | 8 | Pass; print coverage is **F-5-1** |
| Limits | You supply compatibility notes and official rules. | 7 | Pass; stated limit |
| Limits | The planner does not decide whether component groups can mix. | 10 | Pass; stated limit |
| Privacy | Plans stay in this browser. | 5 | Pass; `local-plan-data` |
| Privacy | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | Pass; `night-pass-sales-unavailable` |
| Archives | Planning, timers, printing, and exports are free. | 7 | **F-5-1** |
| Archives | Existing Night Pass holders can restore local plan archives. | 9 | Pass; listed Night Pass/archive claims |
| Archives | New passes are not available yet. | 6 | Pass; `night-pass-sales-unavailable` |
| Footer | Plan a casual limited event from mixed components. | 8 | Pass |
| Footer | Your plan stays in this browser. | 6 | Pass; `local-plan-data` |

Headings and actions were also checked. `Plan pools and rounds for a tabletop
event` is eight words; **Try it with sample data**, **Start a real plan**, and
**Open the sample plan** name their results. `How the planner works`, `What the
planner does not check`, `Where your data goes`, and `Optional plan archives`
name their sections. `Ready with room` is the sole heading flag in F-5-3.

### README sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Opening | Plan pools and rounds for a casual tabletop event. | 9 | Pass; `core-planning` |
| Opening | It is for hosts who need pools, seating, timed rounds, and a host sheet without a card database. | 18 | **F-5-2** |
| What it does | Checks component totals and creates pools, seating rounds, a timer, and a host sheet. | 14 | Pass; `core-planning` |
| What it does | Avoids repeat opponents until everyone has played each other. | 9 | Pass; `first-cycle-pairings` |
| What it does | It warns before pairings begin repeating. | 6 | Pass; `round-cycle-warning` |
| What it does | Keeps a running timer after a refresh. | 7 | Pass; `timer-persistence` |
| What it does | Exports the plan as JSON and the host sheet as CSV. | 11 | Pass; export claims |
| What it does | Keeps plan data in this browser and works offline after the first visit. | 13 | Pass; local/offline claims |
| What it does | Keeps planning, timers, printing, and exports free. | 7 | **F-5-1** |
| Demo | Try the ready five-player sample at https://limited-night-planner.sociobot.in/demo/. | 7 | Pass |
| Demo | Demo data uses a separate browser database and is discarded when you start for real. | 15 | Pass; `demo-sandbox` |
| Run locally | Requires Node.js 22 or later. | 5 | Pass |
| Run locally | Vite prints the local address. | 5 | Pass; developer instruction |
| Run locally | Each browser keeps its own plans. | 6 | Pass; `local-plan-data` |
| Test and build | The deployed billing service has a separate check. | 8 | Pass; developer instruction |
| Test and build | Run this only when checking that service. | 7 | Pass; developer instruction |
| Test and build | It sends test licenses and confirms repeated checks are temporarily limited. | 11 | Pass; command description |
| Test and build | Use npm run build for production. | 6 | Pass; developer instruction |
| Test and build | It creates the deployable site in dist/. | 7 | Pass; build result verified |
| Data and billing | Plans and an existing Night Pass status stay in this browser. | 11 | Pass; listed local/Night Pass claims |
| Data and billing | No plan data is sent to a server. | 8 | Pass; `local-plan-data` |
| Data and billing | The app has no advertising, behavioral analytics, trackers, third-party fonts, or social embeds. | 13 | Pass; `no-third-party-requests` |
| Data and billing | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | Pass; `night-pass-sales-unavailable` |
| Data and billing | Sociobot/Dodo is the merchant of record. | 6 | Pass; billing disclosure |
| Data and billing | See the privacy policy and terms. | 6 | Pass |
| License | MIT. | 1 | Pass |
| License | See LICENSE. | 2 | Pass |

README headings name their sections. JSON, CSV, Node.js, Vite, and `dist/` are
format, runtime, command, or output names in developer instructions. The
product terms otherwise remain consistent: event, components, group, pool,
host sheet, plan, sample data, archive, and Night Pass.

## Demo and sandbox

| Check | Result and evidence |
| --- | --- |
| One-click path | Pass. The first-screen action opens `/demo/`. |
| Immediate useful state | Pass. The first demo screen is `Saturday mixed box night`: 300 usable / 237 needed, a five-pool instruction, five named players, five rounds, notes, timer route, print, and exports. |
| Persistent notice | Pass. `Demo — sample data, nothing is saved`, **Reset demo**, and **Start for real** remain above the planner. |
| Reset | Pass. Changing Host notes and selecting **Reset demo** restored `Ask players to return unused sleeves after the final round.` |
| Isolation | Pass. The demo used `limited-night-planner-demo`; the real plan used `limited-night-planner`. Starting for real removed the demo database and preserved `Review 5 private plan`. |
| Requests and cookies | Pass. The live landing/demo flow contacted only `https://limited-night-planner.sociobot.in` and left the cookie jar empty. |
| Offline | Pass. After service-worker control, an offline `/demo/` reload retained the sample, banner, and offline status. |

The demo is not a blocking finding.

## Claims

Every exact `test` command in `.factory/claims.json` ran separately from a
clean clone after `npm ci`. Each command ran in the desktop and 390 px projects.

| Claim ID | Command | Result and observed evidence |
| --- | --- | --- |
| `core-planning` | `npm run test:claims -- --grep @claim:core-planning` | Pass 2/2: totals, pool instruction, seating, timer tick, inventory, and round rows |
| `demo-sandbox` | `npm run test:claims -- --grep @claim:demo-sandbox` | Pass 2/2: reset, separation, return to real plan, and query entry |
| `offline-after-first-visit` | `npm run test:claims -- --grep @claim:offline-after-first-visit` | Pass 2/2: dedicated offline contexts reload the sample |
| `local-plan-data` | `npm run test:claims -- --grep @claim:local-plan-data` | Pass 2/2: sample use stays on the app origin |
| `no-third-party-requests` | `npm run test:claims -- --grep @claim:no-third-party-requests` | Pass 2/2: no outside request during the planner flow |
| `no-analytics-cookies` | `npm run test:claims -- --grep @claim:no-analytics-cookies` | Pass 2/2: empty cookie jar |
| `json-export` | `npm run test:claims -- --grep @claim:json-export` | Pass 2/2: downloaded event and inventory parsed |
| `csv-export` | `npm run test:claims -- --grep @claim:csv-export` | Pass 2/2: inventory and round rows parsed |
| `first-cycle-pairings` | `npm run test:claims -- --grep @claim:first-cycle-pairings` | Pass 2/2: ten unique opponent pairs |
| `timer-persistence` | `npm run test:claims -- --grep @claim:timer-persistence` | Pass 2/2: running value survived reload |
| `timer-background` | `npm run test:claims -- --grep @claim:timer-background` | Pass 2/2: value advanced across a frozen-tab lifecycle |
| `free-core-tools` | `npm run test:claims -- --grep @claim:free-core-tools` | Command passes 2/2; print outcome remains untested in **F-5-1** |
| `night-pass-sales-unavailable` | `npm run test:claims -- --grep @claim:night-pass-sales-unavailable` | Pass 2/2: no checkout and fixture-backed restore |
| `plan-deletion` | `npm run test:claims -- --grep @claim:plan-deletion` | Pass 2/2: current plan and archive removal survive reload |
| `reusable-archives` | `npm run test:claims -- --grep @claim:reusable-archives` | Pass 2/2: snapshot reopens after working-copy changes |
| `round-cycle-warning` | `npm run test:claims -- --grep @claim:round-cycle-warning` | Pass 2/2: sixth-round warning for five players |
| `offline-export` | `npm run test:claims -- --grep @claim:offline-export` | Pass 2/2: JSON and CSV parse after offline reload |

Total command result: **17/17 commands and 34/34 browser executions passed.**
No command failed, so there is no failing-claim-test blocker. F-5-1 is a
coverage defect, and F-5-2 is an unlisted claim.

## Earlier findings checked from scratch

Every `review-*.md`, `polish-*.md`, and the prior handoff were read. Production
and current source confirm all 22 earlier findings remain fixed.

| Earlier ID | Result | Current live/code evidence |
| --- | --- | --- |
| F-1-1 | Fixed | The artwork-origin statement is absent from visitor copy. |
| F-1-2 | Fixed | The designed 404 has `Page not found`, a skip link, `main#main`, route metadata, and routes back. |
| F-1-3 | Fixed | Landing, demo, legal, and 404 routes share the wordmark, navigation, product line, legal links, source link, and build label. |
| F-1-4 | Fixed | Billing-check guidance is three short README sentences without the cited protocol shorthand. |
| F-1-5 | Fixed | README project notes remain a named list. |
| F-1-6 | Fixed | README and Privacy use browser/license outcomes rather than IndexedDB/localStorage/API jargon. |
| F-1-7 | Fixed | Direct labels such as Event details, Component check, Pool format, Set-up checklist, and Print and export remain. |
| F-1-8 | Fixed | Privacy says `Plans stay in this browser`. |
| F-1-9 | Fixed | README says `Requires Node.js 22 or later.` |
| F-2-1 | Fixed | All three facts fit in both current first-screen viewports. |
| F-2-2 | Fixed | Every route declares the delivered 180×180 Apple touch icon. |
| F-3-1 | Fixed | The fresh-use Wi-Fi sentence is absent; the tested first-visit boundary remains. |
| F-3-2 | Fixed | Landing → Demo focuses its h1 and announces `Demo opened.`; Back focuses the landing h1 and announces `Planner opened.` |
| F-3-3 | Fixed | `?demo=1` redirects to `/demo/` with demo title and canonical. |
| F-3-4 | Fixed | `round-robin` is absent; the opponent result is stated plainly. |
| F-3-5 | Fixed | The Host sheet subtitle names its checklist, component list, and seating. |
| F-4-1 | Fixed | `core-planning` now checks totals, pool output, concrete seating, a timer tick, and host-sheet rows. |
| F-4-2 | Fixed | `fair` is absent from visitor, README, metadata, manifest, and catalog copy. |
| F-4-3 | Fixed | The landing includes the real 300/237 sample preview, pool instruction, and first round. |
| F-4-4 | Fixed | The landing includes explicit limits and data-flow sections. |
| F-4-5 | Fixed | The landing explains free tools, existing-pass archives, and unavailable new sales. |
| F-4-6 | Fixed | External links are named `Source code (external)` and `sociobot.in (external)`. |

No earlier finding is repeated under its old ID.

## Structure, accessibility, and identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; an unknown route returns
  the designed 404. Each has `lang=en`, one rendered h1, one main, a route title,
  description, canonical, Open Graph/Twitter data, SVG favicon, and 180 px
  Apple icon.
- `?demo=1` resolves to `/demo/`. Deep links load, browser Back restores the
  landing, and document navigation focuses and announces the new h1.
- Every rendered destination returned 200. The only 404 was the deliberately
  requested missing page and its self-referencing skip fragment.
- Live Axe checks found zero violations on landing, demo, Privacy, Terms, and
  404 at both sizes. `verify-url.sh` found no console errors, missing
  alternatives, unlabeled buttons, or landmark failures.
- The art-deco night-board identity is distinct: original transit-table art,
  clipped paper shapes, brass rails, condensed local display type, and the
  navy/paper/signal palette match `.factory/design.md`. It is not a generic
  centered SaaS layout.
- The built app JavaScript is 13.59 kB gzip and CSS is 6.07 kB gzip.

## Missed leverage

No additional feature finding. JSON import/export, CSV export, print, offline
operation, timer persistence, and local archives cover the brief's obvious
portability needs. Pool arithmetic and seating rotation are deterministic; an
AI step would add uncertainty, and sync would conflict with the local-first
scope without evidence of demand.

## Verification summary

- Clean clone: `npm ci` passed with no reported vulnerabilities.
- All 17 exact claim commands passed separately: 34/34 browser executions.
- `npm run check` passed.
- `npm test` passed: 17/17.
- `npm run build` passed and produced `dist/`; 26 files were precached.
- `npm run test:e2e` passed: 86/86.
- Live `verify-url.sh` passed; live Axe returned zero violations on five routes
  at both viewports.

## What would make this perfect

Exercise the print result in `free-core-tools`, remove or list and test the
README's no-card-database promise, and rename `Ready with room` so the heading
states that the component count is sufficient. Then rerun the full clean-clone
claim, copy, demo, route, and accessibility checks.
