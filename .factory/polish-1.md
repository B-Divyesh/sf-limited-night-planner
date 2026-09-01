# Polish 1 — review 1 repair map

**Candidate repaired:** `111ea26c4a09af3e35fd575f8889d6ba08f2ed38`  
**Repair build:** `1.0.5-polish-1`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Removed the public artwork-origin statement from the footer. Artwork provenance remains in `design.md`, not visitor copy. | `standard routes have a shared header and footer, and the 404 is a complete route`; live `/` screenshot: `.factory/evidence/polish-1/live-root-desktop.png` |
| F-1-2 | Rebuilt `404.html` with a skip link, `main#main`, plain `Page not found` heading, canonical, Open Graph, Twitter metadata, and standard navigation. | `standard routes have a shared header and footer, and the 404 is a complete route`; `legal and not-found pages have no serious accessibility violations`; live `/no-such-page` check and screenshot: `.factory/evidence/polish-1/live-not-found-desktop.png` |
| F-1-3 | Gave Privacy, Terms, and 404 the same wordmark, Demo/Privacy navigation, footer description, legal links, source link, and build label as the app. | `standard routes have a shared header and footer, and the 404 is a complete route`; live `/privacy/`, `/terms/`, and `/no-such-page` checks |
| F-1-4 | Rewrote the billing check instructions as short, plain sentences without protocol shorthand. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; checked `README.md` |
| F-1-5 | Replaced the long project-notes sentence with five named links. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; checked `README.md` |
| F-1-6 | Replaced storage and billing implementation names with browser and license outcomes in README and Privacy. | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; live `/privacy/` check |
| F-1-7 | Replaced transit-only labels with direct task labels, including Event details, Component check, Pool format, Set-up checklist, and Print and export. | `review 1 plain-language regressions uses direct planner labels and records a short verb-first catalog description`; live `/?demo=1` screenshot: `.factory/evidence/polish-1/live-demo-mobile.png` |
| F-1-8 | Replaced the Privacy eyebrow with `Plans stay in this browser`. | `legal and not-found pages have no serious accessibility violations`; live `/privacy/` check |
| F-1-9 | Replaced the unexplained prerequisite shorthand with `Requires Node.js 22 or later.` | `review 1 plain-language regressions keeps the README reader-facing and removes the reviewed implementation shorthand`; checked `README.md` |

## Additional acceptance work

- The isolated one-click sample remains available at `/demo/` and directly at `?demo=1`; the `@claim:demo-sandbox` browser test now exercises the query entry point.
- All 17 declared claims have one tagged browser test. Every exact command in `claims.json` was run separately after a locked install.
- `.factory/catalog-description.txt` now contains a 48-character, verb-first description.

## Verification

- `npm run check`, `npm test`, `npm run build`, and `npm run test:e2e` pass locally.
- Individual `npm run test:claims -- --grep @claim:<id>` commands pass for all 17 IDs in `claims.json`, in both configured browser projects.
- Live verification evidence is recorded after deployment in `.factory/handoff.md`.
