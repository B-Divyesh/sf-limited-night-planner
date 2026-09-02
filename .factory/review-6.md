# Adversarial first-read review 6 — Limited Night Planner

**Checked:** 2026-09-02 UTC  
**Live URL:** <https://limited-night-planner.sociobot.in/>  
**Repository revision:** `7d33041b34a397383c17d890a8c71eebd818726c`  
**Verdict:** **PASS**

This review found no blocking or minor findings. It was repeated from fresh live browser contexts and a clean local clone.

## Cold first read

I opened the root before scrolling in fresh Chromium contexts at 390×844 and 1440×900.

| Question | Answer available before scrolling | Exact supporting text | Result |
| --- | --- | --- | --- |
| What does this do? | Plans pools and rounds for a tabletop event. | `Plan pools and rounds for a tabletop event.` | Confirmed |
| Who is it for? | Hosts using mixed components before friends arrive. | `For hosts using mixed components, check counts and build a schedule before friends arrive.` | Confirmed |
| What should I select first? | Open the ready five-player sample. | `Try it with sample data` and `See a ready five-player host sheet.` | Confirmed |

The sample action and all three offline/privacy/free facts were visible in both viewports. The 390px page had no horizontal overflow. The first-read blocking rule does not apply.

## Copy audit

Visible prose was counted by words. Labels, headings, controls, numbers, and image alternative were separately checked for plain meaning. No sentence exceeds 22 words. No jargon, banned marketing term, unexplained tournament shorthand, inconsistent product term, metaphor-only heading, or non-result-naming button was found.

### Landing page

| Location | Sentence or alternative | Words | Check |
| --- | --- | ---: | --- |
| Headline | Plan pools and rounds for a tabletop event. | 8 | `core-planning` |
| Lead | For hosts using mixed components, check counts and build a schedule before friends arrive. | 14 | Clear audience and use |
| Lead | Enter the component counts you have. | 6 | Clear real first step |
| Sample action note | See a ready five-player host sheet. | 6 | Clear result |
| Fact | Works offline after the first visit. | 6 | `offline-after-first-visit` |
| Fact | Plan data stays in this browser. | 6 | `local-plan-data` |
| Fact | Planning, timers, printing, and exports stay free. | 7 | `free-core-tools` |
| Image alternative | Blank tabletop components traveling along brass routes into four equal player kits | 12 | Describes image purpose |
| Sample preview | Check the count, first seating round, and host-sheet instruction before opening the sample. | 12 | `core-planning` |
| Component preview | Count 237 components into 5 pools of 45. | 8 | `core-planning` |
| Component preview | Set aside the 12-component reserve. | 4 | `core-planning` |
| Component preview | Included: Compatible mixed components · 300 | 5 | `core-planning` |
| Seating preview | Avery sits out; Morgan vs Kai; Sam vs Jo | 9 | `core-planning` |
| Step 1 | Include only groups that can mix. | 6 | Clear scope limit |
| Step 2 | See whether the count covers each player. | 7 | `core-planning` |
| Step 3 | Avoid repeat opponents until everyone has played each other. | 9 | `first-cycle-pairings` |
| Step 4 | Use the timer and print the host sheet. | 8 | `core-planning` |
| Limits | You supply compatibility notes and official rules. | 7 | Clear scope limit |
| Limits | The planner does not decide whether component groups can mix. | 10 | Clear scope limit |
| Privacy | Plans stay in this browser. | 5 | `local-plan-data` |
| License boundary | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | `night-pass-sales-unavailable` |
| Archive boundary | Planning, timers, printing, and exports are free. | 7 | `free-core-tools` |
| Archive boundary | Existing Night Pass holders can restore local plan archives. | 10 | `night-pass-sales-unavailable`, `reusable-archives` |
| Archive boundary | New passes are not available yet. | 6 | `night-pass-sales-unavailable` |
| Footer | Plan a casual limited event from mixed components. | 8 | `core-planning` |
| Footer | Your plan stays in this browser. | 6 | `local-plan-data` |

Headings name their content: `How the planner works`, `What the planner does not check`, `Where your data goes`, and `Optional plan archives`. Buttons name outcomes: `Try it with sample data`, `Start a real plan`, and `Open the sample plan`.

### README

| Location | Sentence | Words | Check |
| --- | --- | ---: | --- |
| Opening | Plan pools and rounds for a casual tabletop event. | 9 | `core-planning` |
| Opening | It is for hosts who need pools, seating, timed rounds, and a host sheet. | 14 | `core-planning` |
| What it does | Checks component totals and creates pools, seating rounds, a timer, and a host sheet. | 14 | `core-planning` |
| What it does | Avoids repeat opponents until everyone has played each other. | 9 | `first-cycle-pairings` |
| What it does | It warns before pairings begin repeating. | 6 | `round-cycle-warning` |
| What it does | Keeps a running timer after a refresh. | 7 | `timer-persistence` |
| What it does | Exports the plan as JSON and the host sheet as CSV. | 11 | `json-export`, `csv-export` |
| What it does | Keeps plan data in this browser and works offline after the first visit. | 13 | `local-plan-data`, `offline-after-first-visit` |
| What it does | Keeps planning, timers, printing, and exports free. | 7 | `free-core-tools` |
| Demo | Try the ready five-player sample at the demo URL. | 9 | `demo-sandbox` |
| Demo | Demo data uses a separate browser database and is discarded when you start for real. | 15 | `demo-sandbox` |
| Run locally | Requires Node.js 22 or later. | 6 | Clear prerequisite |
| Run locally | Vite prints the local address. | 6 | Developer instruction |
| Run locally | Each browser keeps its own plans. | 7 | `local-plan-data` |
| Test and build | The deployed billing service has a separate check. | 9 | Developer instruction |
| Test and build | Run this only when checking that service. | 8 | Developer instruction |
| Test and build | It sends test licenses and confirms repeated checks are temporarily limited. | 11 | Developer instruction |
| Test and build | Use `npm run build` for production. | 5 | Developer instruction |
| Test and build | It creates the deployable site in `dist/`. | 7 | Build result observed |
| Data and privacy | Plans and an existing Night Pass status stay in this browser. | 11 | `local-plan-data` |
| Data and privacy | No plan data is sent to a server. | 8 | `local-plan-data` |
| Data and privacy | The app has no advertising, behavioral analytics, trackers, third-party fonts, or social embeds. | 13 | `no-third-party-requests` |
| Data and privacy | Restoring an existing Night Pass sends its license token to Sociobot for a check. | 14 | `night-pass-sales-unavailable` |
| Data and privacy | Sociobot/Dodo is the merchant of record. | 5 | Billing disclosure |
| Data and privacy | See the privacy policy and terms. | 6 | Direct documentation link |
| License | MIT. | 1 | License statement |
| License | See LICENSE. | 2 | Direct documentation link |

`Live:` and command blocks are links, labels, and commands rather than sentences. README headings are descriptive and terminology matches the interface.

## Demo and sandbox

The root action reaches `/demo/` in one click. It immediately opens a completed five-player host sheet for **Saturday mixed box night**, with 300 usable / 237 needed components, five pools of 45, a 12-component reserve, realistic seating, and host-sheet actions.

The persistent banner says `Demo — sample data, nothing is saved`, states that the browser space is separate, and exposes **Reset demo** and **Start for real**. Code review confirms that demo initialization uses only `limited-night-planner-demo`, does not read the real plan, and clears demo storage before the real route opens. The declared test edits the sample, resets it, starts a real plan, and returns to an untouched sample.

A fresh live sample flow requested only `https://limited-night-planner.sociobot.in`. No third-party request, cookie, or provider key was observed. Declared browser tests separately confirm offline reload and offline exports.

## Claims and clean-clone verification

I cloned the reviewed repository into a new temporary directory, ran `npm ci`, and issued each exact `test` command listed in `.factory/claims.json` separately. All 17 claim commands passed in desktop and mobile projects. The complete claims run then passed all 34 executions; the complete browser suite recorded `{\"status\":\"passed\",\"failedTests\":[]}`.

| Claim IDs confirmed | Result |
| --- | --- |
| `core-planning`, `demo-sandbox`, `offline-after-first-visit`, `local-plan-data` | Passed |
| `no-third-party-requests`, `no-analytics-cookies`, `json-export`, `csv-export` | Passed |
| `first-cycle-pairings`, `timer-persistence`, `timer-background`, `free-core-tools` | Passed |
| `night-pass-sales-unavailable`, `plan-deletion`, `reusable-archives`, `round-cycle-warning`, `offline-export` | Passed |

The clean clone also passed `npm run check`, `npm test` (18 tests), `npm run build`, `npm run test:claims` (34 tests), and `npm run test:e2e` (86 tests). The build emitted `dist/` and a 26-file service-worker precache.

Every visitor-facing capability or boundary sentence on the landing page and README maps to a listed claim, a stated limitation, or a clearly marked developer instruction. No unlisted-claim finding applies.

## History confirmation

Every finding from reviews 1–5 was read and confirmed against current live behavior and source. None is merely marked fixed.

| Earlier finding IDs | Current confirmation |
| --- | --- |
| F-1-1 | Artwork-origin marketing copy remains absent; provenance is confined to `design.md`. |
| F-1-2, F-1-3 | The live 404 has shared skip/header/footer structure, `main`, route metadata, and return routes. Legal routes retain the shared skeleton. |
| F-1-4 through F-1-9 | README remains short and reader-facing; direct planner labels and the plain Privacy eyebrow remain live. |
| F-2-1 | The three offline/privacy/free facts fit before 844px mobile and 900px desktop viewport bottoms. |
| F-2-2 | Every checked route declares the local 180×180 Apple touch icon. |
| F-3-1 | The unsupported fresh-use Wi-Fi promise remains absent. |
| F-3-2, F-3-3 | Landing ↔ demo focuses the new h1 and announces it; `?demo=1` resolves to canonical `/demo/`. |
| F-3-4, F-3-5 | Visitor copy uses plain opponent wording and the Host sheet explanation names its contents. |
| F-4-1 | The core claim observes totals, pools, seating, timer progress, and host-sheet rows. |
| F-4-2 | The unsupported `fair` promise remains absent from visitor copy and metadata. |
| F-4-3 through F-4-5 | The landing retains its populated sample preview, explicit limits/data section, and archive sales boundary. |
| F-4-6 | External links visibly include `(external)`. |
| F-5-1 | The free-tools test spies on and observes `window.print`. |
| F-5-2 | The unsupported README database promise remains removed. |
| F-5-3 | The preview heading remains `Enough components for this plan`. |

## Structure, accessibility, and visual identity

`/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; the unknown route returned the designed 404. The crawl also confirmed 200 responses for sitemap, robots, favicon, Apple touch icon, social image, source repository, and Sociobot contact link. Every checked route has the correct title pattern, one h1, language, description, canonical URL, OG/Twitter image, and focusable main landmark.

Fresh root, demo, Privacy, Terms, and 404 loads showed no application console or page errors. The expected network message for the intentional 404 response was not treated as a page-script error. The clean browser suite covers keyboard operation, route focus and announcements, 390px reflow, 200% text, reduced motion, and Axe checks.

The midnight-paper art-deco transit system is visibly product-specific: original local hero art, stepped ticket controls, brass route grammar, dark night palette, and self-hosted Barlow Condensed / Atkinson Hyperlegible pairing match `.factory/design.md`. It is not a generic SaaS template. The brief does not imply a missing AI, sync, or import/export feature; the supplied inventory, pools, seating, timer, printable sheet, JSON import, JSON/CSV export, local storage, and offline behavior cover the stated job.

## Findings

None.

## What would make this perfect

Keep this verification boundary as the product changes: preserve the one-click isolated sample, test every new visitor-facing promise, and retain the direct wording that lets a host understand the first screen immediately.
