# First-read product QA review 1 — Limited Night Planner

**Checked:** 2026-09-01 UTC  
**Live URL:** <https://limited-night-planner.sociobot.in/>  
**Commit reviewed:** `111ea26c4a09af3e35fd575f8889d6ba08f2ed38`  
**Verdict:** **FAIL**

The core planning flow is clear and functional. This review is a FAIL because
nine findings remain: an unlisted public claim, incomplete route structure,
and copy that does not meet the plain-language contract.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900 showed this before scrolling:

| Check | Confirmed result |
| --- | --- |
| What it does | It helps a host plan a fair tabletop event from mixed components. |
| Who it is for | Hosts who are preparing an event before friends arrive. |
| What to select first | **Try it with sample data**, beside `See a ready five-player host sheet.` |
| Phone layout | The headline and sample action were above the fold. Width and scroll width were both 390 px. |

The first screen answers the three cold-read questions. This opening check
passes.

## Findings

### F-1-1 — High — public artwork-origin claim has no listed proof

**Location and quote:** landing footer: `Poster artwork is original
AI-generated imagery.`

**Check:** `.factory/claims.json` has no entry or tagged test for this public
statement.

**Why this matters:** A visitor cannot confirm the stated asset origin from the
product. The claims contract requires each claim-like public statement to have
an observable test, or to be removed.

**Concrete fix:** Remove this sentence from the footer and retain provenance in
`.factory/design.md`; or add a deterministic asset-provenance test and matching
claims entry.

### F-1-2 — Medium — the 404 page is missing route metadata and keyboard structure

**Location and quote:** `404.html` has no Open Graph or Twitter metadata and
starts with `<header>` rather than a skip link. Its heading is `This page is not
on the route.`

**Check:** Live `/no-such-page` correctly returns 404 and offers a way back,
but it has no `a[href="#main"]`, its `<main>` has no `id="main"`, and it lacks
the metadata supplied by the other routes.

**Why this matters:** A keyboard visitor cannot skip repeated navigation on this
route, and a shared-link preview lacks the standard route information. `route`
does not plainly name a missing page.

**Concrete fix:** Add the shared skip link and `id="main"`, add canonical/OG/
Twitter metadata, use the standard header and footer, and change the heading to
`Page not found`.

### F-1-3 — Medium — headers and footers are not consistent across routes

**Location and quote:** the app footer includes `Plan a casual limited event
from mixed components.`, **Privacy**, **Terms**, and the factory build label.
The Privacy, Terms, and 404 footers omit that product line and do not each
contain both **Privacy** and **Terms**. Their headers only show
`← Limited Night Planner`.

**Check:** Live `/privacy/`, `/terms/`, and `/no-such-page` do not use the
shared route skeleton used by `/` and `/demo/`.

**Why this matters:** A visitor entering through a legal or missing-page URL
does not receive the same navigation and legal links as one who starts on the
landing page.

**Concrete fix:** Use one shared header/footer on every route: home wordmark,
Demo and Privacy navigation, skip link, product one-line description, Privacy,
Terms, and the factory build label.

### F-1-4 — Medium — the README contains a 37-word sentence with technical shorthand

**Location and quote:** README, **Test and build**: `It checks browser-origin
CORS, a normal readable invalid-token response, then sends 300 distinct invalid
verification tokens and expects rapid requests to receive HTTP 429 responses
with Retry-After; run it only when checking the deployed Sociobot billing
endpoint.` (37 words)

**Check:** This exceeds 22 words and uses CORS, HTTP 429, Retry-After,
endpoint, and invalid-token without plain wording.

**Why this matters:** The reader has to decode the mechanism before learning
when to run the check.

**Concrete fix:** Replace it with: `Run this only when checking the deployed
billing service. It sends test licenses and confirms that repeated checks are
temporarily limited.` Put protocol details in a developer note if needed.

### F-1-5 — Low — the README project-notes sentence is over the copy limit

**Location and quote:** README, **Data, privacy, and billing**: `The product
research is in ... and verification notes are in handoff.md.` (33 words when
link paths are counted by displayed file name).

**Check:** This sentence combines five unrelated references and exceeds the
22-word limit.

**Why this matters:** A reader looking for privacy information has to parse an
implementation inventory.

**Concrete fix:** Replace it with a short `Project notes` list: **Brief**,
**Design**, **Demo**, **Claims**, **Handoff**.

### F-1-6 — Low — README storage and billing sentences use implementation jargon

**Location and quotes:** README, **Data, privacy, and billing**:

- `Current and archived plans use IndexedDB.`
- `License state uses localStorage.`
- `The only application API request is an optional existing Night Pass license verification against the Sociobot billing service.`

**Check:** IndexedDB, localStorage, API, and verification describe browser
implementation rather than the reader's outcome.

**Why this matters:** A host needs to know where information goes, not the
browser feature that holds it.

**Concrete fix:** Replace the first two with `Plans and an existing Night Pass
status stay in this browser.` Replace the third with `Restoring an existing
Night Pass sends its license token to Sociobot for a check.`

### F-1-7 — Low — decorative transit labels do not name their content

**Location and quotes:** live labels include `Local night service`, `Sample
route`, `Departure`, `Arrivals board`, `Live departure board`, `Assembly route`,
`Generated route`, `Limited night · host route`, `Before departure`, `Round
route`, and `Dispatch desk`.

**Check:** These labels are visible in the real and sample planner. Several
appear before the concrete heading they qualify; the sample host sheet opens
with `Limited night · host route` and `Before departure`.

**Why this matters:** The labels add a visual theme but do not identify the
section for a host who has not seen the product before.

**Concrete fix:** Remove them or use direct names: `Sample plan`, `Event
details`, `Inventory`, `Component check`, `Pool format`, `Rounds and seating`,
`Host sheet`, `Set-up checklist`, and `Print and export`.

### F-1-8 — Low — the privacy-page eyebrow is a slogan rather than page information

**Location and quote:** `/privacy/`: `Your data stays at your table`.

**Check:** This line precedes the Privacy heading but does not name the page or
state the storage rule directly.

**Why this matters:** A visitor scanning headings does not receive a concrete
privacy summary from this line.

**Concrete fix:** Replace it with `Plans stay in this browser` or remove it;
the following storage section supplies the detail.

### F-1-9 — Low — the README prerequisite uses unexplained shorthand

**Location and quote:** README, **Run locally**: `Requires Node.js 22 or a
current Node.js LTS release.`

**Check:** `LTS` is unexplained shorthand.

**Why this matters:** A reader new to the tooling cannot choose the required
version from this sentence alone.

**Concrete fix:** Replace it with `Requires Node.js 22 or later.`

## Copy audit

Word counts use visible words. Links count by their displayed label or purpose,
not by URL. Labels, headings, and controls are checked separately because they
are not sentences.

### Landing-page sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Hero | Plan a fair tabletop event. | 5 | Pass |
| Hero | For hosts using mixed components, build a fair schedule before friends arrive. | 11 | Pass |
| Hero | No card database or venue Wi-Fi needed. | 7 | Pass |
| Hero action note | See a ready five-player host sheet. | 6 | Pass |
| Fact | Works offline after the first visit. | 6 | Listed: `offline-after-first-visit` |
| Fact | Plan data stays in this browser. | 6 | Listed: `local-plan-data` |
| Fact | Planning, timers, printing, and exports stay free. | 7 | Listed: `free-core-tools` |
| Step 1 | Include only groups that can mix. | 7 | Pass |
| Step 2 | See whether the count covers each player. | 7 | Pass |
| Step 3 | Avoid repeat opponents for one round-robin cycle. | 7 | Listed: `first-cycle-pairings` |
| Step 4 | Use the timer and print the host sheet. | 8 | Listed: `core-planning` |
| Footer | Plan a casual limited event from mixed components. | 8 | Listed: `core-planning` |
| Footer | Your plan stays in this browser. | 6 | Listed: `local-plan-data` |
| Footer | Poster artwork is original AI-generated imagery. | 6 | **F-1-1** |

The five-word headline, **How the planner works**, **Try it with sample data**,
and **Start a real plan** pass. The label issue is F-1-7.

### README sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Opening | Plan a fair casual tabletop event from mixed components. | 9 | Pass |
| Opening | It is for hosts who need pools, seating, timed rounds, and a host sheet without a card database. | 18 | Pass |
| What it does | Checks component totals and creates pools, seating rounds, a timer, and a host sheet. | 14 | Listed: `core-planning` |
| What it does | Avoids repeat opponents for one round-robin cycle and warns before another cycle begins. | 13 | Listed: `first-cycle-pairings`, `round-cycle-warning` |
| What it does | Keeps a running timer after a refresh. | 7 | Listed: `timer-persistence` |
| What it does | Exports the plan as JSON and the host sheet as CSV. | 11 | Listed: `json-export`, `csv-export` |
| What it does | Keeps plan data in this browser and works offline after the first visit. | 13 | Listed: `local-plan-data`, `offline-after-first-visit` |
| What it does | Keeps planning, timers, printing, and exports free. | 7 | Listed: `free-core-tools` |
| Demo | Try the ready five-player sample at the demo URL. | 9 | Pass |
| Demo | Demo data uses a separate browser database and is discarded when you start for real. | 15 | Listed: `demo-sandbox` |
| Run locally | Requires Node.js 22 or a current Node.js LTS release. | 9 | **F-1-9** |
| Run locally | Vite prints the local development URL. | 6 | Pass in developer context |
| Run locally | Plans are browser-local, so each browser profile has its own data. | 11 | Pass |
| Test and build | The billing service's live contract has a separate, intentional network check. | 12 | Jargon; simplify with F-1-4 |
| Test and build | It checks browser-origin CORS, a normal readable invalid-token response, then sends 300 distinct invalid verification tokens and expects rapid requests to receive HTTP 429 responses with Retry-After; run it only when checking the deployed Sociobot billing endpoint. | 37 | **F-1-4** |
| Test and build | The exact production command is `npm run build`. | 8 | Pass in developer context |
| Test and build | It creates the static deploy artifact in `dist/`, with `dist/index.html` at its root and a generated, versioned service worker precache. | 21 | Jargon; simplify with F-1-4 |
| Data and privacy | Current and archived plans use IndexedDB. | 6 | **F-1-6** |
| Data and privacy | License state uses localStorage. | 4 | **F-1-6** |
| Data and privacy | No plan data is sent to a server. | 8 | Listed: `local-plan-data` |
| Data and privacy | The app has no advertising, behavioral analytics, trackers, third-party fonts, or social embeds. | 13 | Listed: `no-third-party-requests` |
| Data and privacy | The only application API request is an optional existing Night Pass license verification against the Sociobot billing service. | 18 | **F-1-6** |
| Data and privacy | Sociobot/Dodo is the merchant of record. | 7 | Pass: required billing disclosure |
| Data and privacy | See the privacy policy and terms. | 6 | Pass |
| Data and privacy | The product research is in brief.json, the visual system and generated-art provenance are in design.md, the demo contract is in demo.md, the claim tests are in claims.json, and verification notes are in handoff.md. | 33 | **F-1-5** |
| License | MIT. | 1 | Pass |
| License | See LICENSE. | 2 | Pass |

## Demo and sandbox checks

| Check | Result and evidence |
| --- | --- |
| One-click entry | Pass. The landing action opens `/demo/` in one selection. |
| First demo screen | Pass. It immediately shows **Saturday mixed box night**, 300 usable / 237 needed components, inventory, host notes, rounds, and host-sheet actions. |
| Demo notice and controls | Pass. The persistent notice says `Demo — sample data, nothing is saved` and includes **Reset demo** and **Start for real**. |
| Separation | Pass. The `demo-sandbox` claim test edits, resets, leaves the demo, creates a real plan, and confirms separate stores. |
| Live offline reload | Pass. After worker control, offline reload retained the sample and showed `Offline service · your saved planner and timer still work.` |
| Live request log | Pass. A fresh landing/sample flow requested only `https://limited-night-planner.sociobot.in`. |

## Claims and clean-checkout checks

An isolated clone at the reviewed commit completed `npm ci`, `npm test` (11
passing), `npm run check`, and `npm run build` (a 23-file service-worker
precache). `npm run test:e2e` completed the configured 80 browser checks.

Every exact command in `.factory/claims.json` was run separately. All 17 passed
in both configured browser projects (34 executions): `core-planning`,
`demo-sandbox`, `offline-after-first-visit`, `local-plan-data`,
`no-third-party-requests`, `no-analytics-cookies`, `json-export`, `csv-export`,
`first-cycle-pairings`, `timer-persistence`, `timer-background`,
`free-core-tools`, `night-pass-sales-unavailable`, `plan-deletion`,
`reusable-archives`, `round-cycle-warning`, and `offline-export`.

The public landing and README capability claims map to those entries except
the artwork-origin statement in F-1-1.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I
read `.factory/handoff.md` and all earlier `verification*.md` reports. Current
live behavior and tests confirm the prior reported conditions are repaired:
worker installation/offline reload, update activation, numeric correction,
clear JSON-import recovery, focus contrast, import focus, legal-page skip
links, 200% phone text, and claim coverage for timer, deletion, archives,
cookies, and both offline exports.

## Route, accessibility, and identity checks

| Check | Result |
| --- | --- |
| Main routes | Pass: `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. `/no-such-page` returns a real 404. |
| Titles, main heading, description, canonical, favicon | Pass on main routes; 404 exception is F-1-2. |
| OG/Twitter image | Pass on main routes; 404 exception is F-1-2. |
| Sitemap and robots | Pass; sitemap lists all main routes. |
| Links | Pass; rendered internal links returned 200 or intended 404. GitHub and sociobot.in links returned 200. |
| Navigation, back, route focus | Pass for real routes and planner steps. Browser back restores landing after the demo; planner changes focus the h1 and announce the step. |
| Console and page errors | Pass in representative live landing, sample, and offline flows. |
| Keyboard and mobile | Current 80-check browser suite passes skip links, focus, 44 px links, and 200% 390 px text. 404 exception is F-1-2. |
| Visual identity | Pass. Original art-deco tabletop art, stepped shapes, self-hosted type, paper/night palette, and no-motion fallback match `.factory/design.md` and are not a generic template. |
| Missed leverage | Pass. The brief's inventory totals, pools, seating rotation, timer, printable sheet, local export/import, and offline operation are present. The brief does not establish a need for AI or sync. |

## What would make this perfect

Remove or prove the footer artwork-origin statement, apply the shared route
skeleton and metadata to legal and 404 pages, and complete the plain-language
README and interface-label repairs. Then rerun the same clean checks and live
first-read review.
