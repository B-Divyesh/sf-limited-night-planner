# Adversarial first-read review 2 — Limited Night Planner

**Checked:** 2026-09-01 UTC

**Live URL:** <https://limited-night-planner.sociobot.in/>

**Commit reviewed:** `282e8a5803ec8d802ce6caf7538ef254b4cfe972`

**Verdict:** **FAIL**

The product is clear, usable, and honestly demonstrated. There are no blocking
findings and all declared claims pass. The verdict is still FAIL because two
findings remain: the desktop first screen hides all three required trust facts,
and Apple touch-icon metadata does not meet the route contract.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900 were opened before repository
copy was read and before either page was scrolled.

| Question | First-screen answer | Exact supporting copy | Result |
| --- | --- | --- | --- |
| What does this do? | Plans a fair tabletop event. | `Plan a fair tabletop event.` | Pass |
| For whom? | Hosts using mixed components before friends arrive. | `For hosts using mixed components, build a fair schedule before friends arrive.` | Pass |
| What should I select first? | Open the ready sample. | `Try it with sample data` and `See a ready five-player host sheet.` | Pass |

The sample action was visible in both viewports and the mobile layout had no
horizontal page overflow. The first-read blocking rule does not apply because
all three questions were answerable.

## Findings

### F-2-1 — Medium — the desktop first screen hides all three required trust facts

**Location and quote:** landing first screen at 1440×900. The lines `Works
offline after the first visit.`, `Plan data stays in this browser.`, and
`Planning, timers, printing, and exports stay free.` all sit below the initial
viewport. The first line begins at exactly y=900 px.

**Why this matters:** The first screen contract requires three plain facts about
privacy, offline use, and price. A desktop visitor sees the headline, sample
action, and real-plan action, but must scroll before seeing any of those trust
facts.

**Concrete fix:** Reduce the desktop hero's vertical footprint or place the
three facts beside the actions so all three are fully visible at 1440×900.
Keep the current 390×844 result, where all three already fit. Add a viewport
test that checks each fact's bottom edge is at or above `window.innerHeight`.

### F-2-2 — Low — Apple touch-icon metadata is missing or the wrong size

**Location and quote:** `/` and `/demo/` declare
`<link rel="apple-touch-icon" href="/icon-192.png">`; `/privacy/`, `/terms/`,
and the designed 404 declare no Apple touch icon. The repository contains no
180×180 touch icon.

**Why this matters:** The site-structure contract requires an SVG favicon plus
a 180 px Apple touch icon, consistently across routes. Saved touch shortcuts
can otherwise receive a scaled or generic icon, and metadata differs depending
on the entry route.

**Concrete fix:** Add an original 180×180 PNG derived from the existing icon,
reference it as `rel="apple-touch-icon"` on every HTML route, and add a delivery
test that confirms the link and a 200 response on `/`, `/demo/`, `/privacy/`,
`/terms/`, and the 404 document.

## Landing-page copy audit

Word counts use whitespace-delimited visible words. Headings, labels, and
controls are checked separately below. No sentence exceeds 22 words, the
average is 7 words, and no banned marketing term appears.

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Headline | Plan a fair tabletop event. | 5 | Pass |
| Introduction | For hosts using mixed components, build a fair schedule before friends arrive. | 12 | Pass |
| Introduction | No card database or venue Wi-Fi needed. | 7 | Pass |
| Sample action note | See a ready five-player host sheet. | 6 | Pass |
| Fact | Works offline after the first visit. | 6 | Pass; listed claim |
| Fact | Plan data stays in this browser. | 6 | Pass; listed claim |
| Fact | Planning, timers, printing, and exports stay free. | 7 | Pass; listed claim |
| Step 1 | Include only groups that can mix. | 6 | Pass |
| Step 2 | See whether the count covers each player. | 7 | Pass |
| Step 3 | Avoid repeat opponents for one round-robin cycle. | 7 | Pass; listed claim |
| Step 4 | Use the timer and print the host sheet. | 8 | Pass; listed claim |
| Footer | Plan a casual limited event from mixed components. | 8 | Pass |
| Footer | Your plan stays in this browser. | 6 | Pass; listed claim |

The headings `Planner for casual limited events` and `How the planner works`
name their sections. `Try it with sample data` and `Start a real plan` name the
result of each action. The navigation labels are destinations, not action
buttons. No jargon, empty slogan, metaphor heading, or inconsistent product
term requires a copy finding on this route.

## README copy audit

Every prose sentence is listed. The average is 8.85 words and no sentence
exceeds 22 words. JSON, CSV, Node.js, Vite, and `dist/` are required format,
runtime, or command names in developer instructions rather than unexplained
marketing jargon.

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Opening | Plan a fair casual tabletop event from mixed components. | 9 | Pass |
| Opening | It is for hosts who need pools, seating, timed rounds, and a host sheet without a card database. | 18 | Pass |
| What it does | Checks component totals and creates pools, seating rounds, a timer, and a host sheet. | 14 | Pass; listed claim |
| What it does | Avoids repeat opponents for one round-robin cycle and warns before another cycle begins. | 13 | Pass; listed claims |
| What it does | Keeps a running timer after a refresh. | 7 | Pass; listed claim |
| What it does | Exports the plan as JSON and the host sheet as CSV. | 11 | Pass; listed claims |
| What it does | Keeps plan data in this browser and works offline after the first visit. | 13 | Pass; listed claims |
| What it does | Keeps planning, timers, printing, and exports free. | 7 | Pass; listed claim |
| Demo | Try the ready five-player sample at https://limited-night-planner.sociobot.in/demo/. | 7 | Pass |
| Demo | Demo data uses a separate browser database and is discarded when you start for real. | 15 | Pass; listed claim |
| Run locally | Requires Node.js 22 or later. | 5 | Pass |
| Run locally | Vite prints the local address. | 5 | Pass |
| Run locally | Each browser keeps its own plans. | 6 | Pass; listed claim |
| Test and build | The deployed billing service has a separate check. | 8 | Pass |
| Test and build | Run this only when checking that service. | 7 | Pass |
| Test and build | It sends test licenses and confirms repeated checks are temporarily limited. | 11 | Pass |
| Test and build | Use npm run build for production. | 6 | Pass |
| Test and build | It creates the deployable site in dist/. | 7 | Pass |
| Data, privacy, and billing | Plans and an existing Night Pass status stay in this browser. | 11 | Pass; listed claims |
| Data, privacy, and billing | No plan data is sent to a server. | 8 | Pass; listed claim |
| Data, privacy, and billing | The app has no advertising, behavioral analytics, trackers, third-party fonts, or social embeds. | 13 | Pass; listed claim |
| Data, privacy, and billing | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | Pass; listed claim |
| Data, privacy, and billing | Sociobot/Dodo is the merchant of record. | 6 | Pass; required billing disclosure |
| Data, privacy, and billing | See the privacy policy and terms. | 6 | Pass |
| License | MIT. | 1 | Pass |
| License | See LICENSE. | 2 | Pass |

README headings name their content, and its links and commands name their
destinations or results. Terminology is consistent: **event** for the occasion,
**components** for physical material, **group** for compatible inventory,
**pool** for each player's allocation, **host sheet** for the output, **plan**
for stored work, and **sample data** for the demo contents.

## Demo and sandbox

| Check | Result and evidence |
| --- | --- |
| One-click entry | Pass. The first-screen action opens `/demo/` in one selection. |
| Immediate product state | Pass. The first demo screen is the completed **Saturday mixed box night** host sheet with 300 usable / 237 needed components, five named players, five rounds, byes, notes, print, and exports. |
| Persistent notice | Pass. `Demo — sample data, nothing is saved`, **Reset demo**, and **Start for real** remain present across planner steps. |
| Reset | Pass. Editing Host notes and selecting **Reset demo** restored `Ask players to return unused sleeves after the final round.` |
| Isolation | Pass. A direct fresh `/demo/` context created only `limited-night-planner-demo`. A real plan named **Review 2 private plan** remained unchanged after entering, editing, resetting, and leaving the demo. |
| Requests and cookies | Pass. The live landing/demo flow requested only `https://limited-night-planner.sociobot.in` and set no cookies. |
| Offline | Pass. After service-worker control, a live offline reload kept the sample, demo title, and offline status. |

## Claims

Every exact command in `.factory/claims.json` was run separately from the
initially clean checkout after `npm ci`. Each command ran in the configured
desktop and 390 px projects.

| Claim ID | Result |
| --- | --- |
| `core-planning` | Pass — 2/2 |
| `demo-sandbox` | Pass — 2/2 |
| `offline-after-first-visit` | Pass — 2/2 |
| `local-plan-data` | Pass — 2/2 |
| `no-third-party-requests` | Pass — 2/2 |
| `no-analytics-cookies` | Pass — 2/2 |
| `json-export` | Pass — 2/2 |
| `csv-export` | Pass — 2/2 |
| `first-cycle-pairings` | Pass — 2/2 |
| `timer-persistence` | Pass — 2/2 |
| `timer-background` | Pass — 2/2 |
| `free-core-tools` | Pass — 2/2 |
| `night-pass-sales-unavailable` | Pass — 2/2 |
| `plan-deletion` | Pass — 2/2 |
| `reusable-archives` | Pass — 2/2 |
| `round-cycle-warning` | Pass — 2/2 |
| `offline-export` | Pass — 2/2 |

Total: **17/17 commands and 34/34 browser executions passed.** Landing and
README capability statements map to the manifest. No unlisted product claim
or untested declared claim was found.

## Earlier findings checked from scratch

The current `review-1.md`, `polish-1.md`, and handoff were read. Each earlier
finding was checked in live output and source.

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | The artwork-origin claim is absent from the live footer and `src/app.ts`. |
| F-1-2 | Fixed | The live missing route returns 404 with `Page not found`, skip link, `main#main`, canonical, OG, Twitter, and a route back. |
| F-1-3 | Fixed | Landing, demo, Privacy, Terms, and 404 use the same wordmark, Demo/Privacy header links, product line, Privacy/Terms/Source footer links, and build label. |
| F-1-4 | Fixed | README billing-check guidance is split into three short sentences without protocol shorthand. |
| F-1-5 | Fixed | README project notes are a named list rather than one long sentence. |
| F-1-6 | Fixed | Reader-facing README and Privacy copy describe browser storage and the Sociobot check without IndexedDB/localStorage/API jargon. |
| F-1-7 | Fixed | The cited transit-only labels are absent; live planner labels use Event details, Component check, Pool format, Rounds and seating, Set-up checklist, and Print and export. |
| F-1-8 | Fixed | The Privacy eyebrow is `Plans stay in this browser`. |
| F-1-9 | Fixed | README says `Requires Node.js 22 or later.` |

No earlier finding is repeated under its old ID.

## Structure, accessibility, and visual identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown route
  returns the designed 404 with a way back.
- Every checked route has `lang=en`, one h1, one main landmark, a route-specific
  title, description, canonical, OG/Twitter data, and an SVG favicon. The
  touch-icon exception is F-2-2.
- Browser back returns from the demo to the landing/real plan. Planner-step
  changes focus the h1 and announce the new step.
- All rendered links on landing, demo, Privacy, Terms, and 404 resolved to 200,
  apart from the deliberately tested missing route itself. Metadata assets,
  `robots.txt`, and `sitemap.xml` also returned 200.
- Fresh live Axe scans found zero serious or critical violations on every main
  route and the 404 at desktop and mobile sizes. The factory URL check found no
  console errors, missing alternatives, unlabelled buttons, or landmark errors.
- The art-deco night-board identity is distinct: original route-table art,
  clipped paper panels, brass rails, compressed headings, and self-hosted type
  match `.factory/design.md`. It is not a generic SaaS template.
- The landing follows the expected information order, but its desktop
  first-screen trust facts fail the placement requirement in F-2-1.

## Missed leverage

No finding. The brief's useful extension is portability, and JSON import/export
plus CSV export are present. The remaining work—counting components, checking a
fixed allocation, and building round-robin seating—is deterministic. A model
step would add uncertainty to a rules-neutral planner, and cloud sync would
conflict with the local-first scope without clear evidence of demand.

## Verification summary

- `npm ci` — passed; lockfile unchanged.
- All 17 exact claim commands — passed, 34/34 browser executions.
- `npm run check` — passed.
- `npm test` — passed, 13/13.
- `npm run build` — passed; `dist/` created and 23 files precached.
- `npm run test:e2e` — passed, 80/80.
- Factory `verify-url.sh` — passed; HTTP 200, one h1, title, language, main,
  image alternatives, labelled buttons, and no console errors.
- Live Axe checks — zero serious or critical findings on five routes at both
  viewports.

## What would make this perfect

Place all three offline/privacy/price facts fully inside the 1440×900 first
viewport, then add and reference a 180×180 Apple touch icon on every route.
Rerun the same first-screen geometry, route metadata, claim, and accessibility
checks. With those two findings closed, this review found nothing else to fix.
