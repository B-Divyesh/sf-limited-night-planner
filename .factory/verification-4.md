# Independent verification 4 — FAIL

**Audited:** 2026-08-30 UTC<br>
**Candidate commit:** `b8945912a73c510eb79e36cd1221f1e07a8d41a8`<br>
**Production URL:** <https://limited-night-planner.sociobot.in/><br>
**Verdict:** **FAIL — do not release this candidate as complete.**

The candidate is deployed exactly, its core planner works end to end, and the
earlier license-verification and API-rate-limit repairs are present. It still
fails the current acceptance contract because the mandatory claims manifest is
absent, the required one-click sample-data sandbox does not exist, the cold
first screen does not plainly identify the host audience, and the advertised
paid checkout returns HTTP 404.

## Release blockers

### High — `.factory/claims.json` is missing

The first required check from the clean candidate failed immediately:

```text
RELEASE_BLOCKER: .factory/claims.json missing
```

There are consequently no claim commands to run through the demo entry point
and no claim evidence. This is release-blocking under the supplied claims
contract. It also leaves several visitor-facing claims unlisted and untested,
including “works offline after first visit,” “repeat-free pairings,” JSON/CSV
exports, local-only plan data, and timer persistence.

### High — mandatory first-read and demo-sandbox checks fail

Fresh Chromium profile, service worker blocked, 1440×900, no interaction:

- **What it appears to do:** count a mixed component pile, test a pool, and
  produce timed rounds.
- **For whom:** the first screen does not say this is for an event host. A
  visitor must infer the audience.
- **What to click first:** **Start a night**.

The headline is “Plan the pile. Run the night.” and the supporting sentence is
“Count what you have, test a fair pool, and leave with a timed route for every
round.” The task is partly inferable, but the intended host is not named in
plain words.

More importantly, there is no **Try it with sample data** action. **Start a
night** creates a blank real plan in the normal IndexedDB namespace. Both
`/demo` and `/?demo=1` show the ordinary landing page with no sample content,
demo banner, reset action, or isolated storage. `.factory/demo.md` is also
absent. The mandatory one-click demo condition therefore fails independently
of the copy issue.

### High — the advertised Night Pass cannot be purchased

The live **Buy Night Pass** link targets the documented endpoint:

```text
https://api.sociobot.in/api/v1/products/limited-night-planner/checkout
```

A fresh GET returned HTTP 404 rather than redirecting to hosted checkout:

```json
{"error":"enabled factory product","status":404}
```

The page advertises a `$9 one time` license, so this is a broken primary paid
flow. Invalid-license verification itself worked: the query token was removed,
the API returned `{"valid":false,"reason":"invalid"}`, and archive access
stayed locked.

## Additional findings

### Medium — “repeat-free pairings” is false for accepted settings

The landing page says **Generate fair, repeat-free pairings.** A valid live plan
with five named players and six rounds generated six rounds but repeated
`Kai vs Morgan` and `Jo vs Sam` twice. The Format screen correctly warns,
“With 5 players, opponents begin repeating after round 5,” so the planner
behavior is transparent; the unqualified landing claim is still false and has
no claim test.

### Medium — denied `localStorage` prevents the free planner from loading

In a fresh production context where `Storage.getItem`/`setItem` threw
`SecurityError`, the page showed only **Skip to planner**, exposed no primary
button, and raised an uncaught `Denied` page error. License storage is optional
and must not prevent the free planner from rendering. By comparison, injected
IndexedDB denial recovered correctly with an in-memory plan and a persistent
backup warning.

### Medium — required site discovery/404 elements are absent

- `/this-route-does-not-exist` returns HTTP 200 and the normal landing page;
  there is no designed real 404 response.
- `/`, `/privacy/`, and `/terms/` have no canonical link, Open Graph title, or
  Twitter card metadata.
- The footer omits the required Param Factory attribution and build/version ID.
- The home title is 52 characters and unique, but “plan the pile, run the
  night” is not a plain description of the product job.

## Clean-checkout gates

The supplied workspace was clean and exactly at the candidate SHA before QA.
Product source was not modified.

| Check | Result | Fresh evidence |
| --- | --- | --- |
| Mandatory claims gate | **FAIL** | `.factory/claims.json` does not exist. |
| Install | PASS | `npm ci`: 62 packages, 0 vulnerabilities. |
| Unit/integration tests | PASS | `npm test`: 11/11 tests passed in 2 files. |
| Type check | PASS | `npm run check` (`tsc --noEmit`). |
| Lint | N/A | No lint script or configuration is available. |
| Exact production build | PASS | `npm run build`; `dist/`; 20-file precache `lnp-d1866016e1c7`. |
| Repository browser suite | PASS | `npm run test:e2e`: 28/28 tests at desktop and 390px. |
| Verification API rate limit | PASS | 300-request burst: 30×200, 270×429; every 429 had `Retry-After: 3` or `4`. |
| Mobile Lighthouse | PASS | 96 performance, 100 accessibility, 100 best practices, 100 SEO. |

## Core product exercise

A fresh live desktop flow created **QA Mixed Box Night** with five named
players. It entered 300 compatible components and excluded a separate
500-component group with different backs, then selected direct pools of 45 and
a reserve of 12. The live board correctly reported 300 usable, 237 needed, and
63 spare. Six rounds produced one bye in each round, the timer moved from
`45:00` to `44:59`, and the printable host sheet included the event, compatible
inventory, and host compatibility note while omitting the excluded group.

JSON export contained the complete plan and both inventory groups, including
the excluded flag. CSV export had the expected inventory header and 29 lines.
Reload restored the event and both inventory rows from IndexedDB. Print media
hid navigation/tools and used a white page. The normal flow produced no console
or page errors and made requests only to
`https://limited-night-planner.sociobot.in`.

At 390×844:

- the document and body both remained 390 px wide with no page overflow;
- the primary action was inside the first viewport;
- keyboard Tab focused **Skip to planner** with a 3 px brass outline, Enter
  moved focus to `<main>`, and the next Tab reached **Start a night**;
- players `1` and `65` recovered to `2` and `64` with announced guidance;
- counts `-1` and `1,000,001` recovered to `0` and `1,000,000`;
- malformed and schema-invalid JSON retained the current plan and gave the
  documented recovery message; a valid JSON import then opened successfully;
- all effective visible controls met the 44 px target (the only 1 px element
  measured was the deliberately hidden file input inside its full-width
  48 px label);
- reduced motion changed scroll behavior to `auto`, removed the hero transform,
  and reduced transitions/animations to `0.00001s`.

## Accessibility and browser quality

- Independent Playwright Axe scans found zero serious/critical findings on the
  live landing, Format, and Host sheet screens at desktop and on Host sheet at
  390 px. Lighthouse accessibility scored 100.
- The home, Privacy, and Terms pages each have `lang="en"`, one `<h1>`, one
  `<main>`, labels, meaningful image alternative text, and visible focus.
- The normal desktop/mobile runs had no console errors or uncaught page errors.
- The injected `localStorage` denial described above is the exception and is a
  real recovery defect.

## PWA, privacy, headers, and caching

- A fresh live worker controlled the page at version `lnp-d1866016e1c7`; it was
  active with no waiting worker. The repository's update test successfully
  installed a changed waiting worker, displayed **Update now**, activated it,
  and reloaded into the new version.
- After saving **Live Offline QA** and 240 components, browser offline mode plus
  reload restored the plan, displayed the offline banner, and kept worker
  control. `/privacy/` and `/terms/` also loaded offline. No browser errors
  occurred.
- The manifest declares standalone display, a versioned start URL, matching
  theme/background colors, 192/512 icons, and a 512 px maskable icon.
- Free-use request logs stayed same-origin. There were no analytics, trackers,
  CDN fonts, or third-party scripts. The optional license path sent only its
  token to `api.sociobot.in`; the response used origin-specific CORS and
  `Cache-Control: no-store`.
- Responses include HTTPS/HSTS, restrictive CSP with `frame-ancestors 'none'`,
  restrictive Permissions-Policy, `nosniff`, and strict-origin referrer policy.
  HTML, manifest, and worker revalidate after 30 seconds; hashed assets are
  immutable for one year.

Sign-in is not implemented, so the Microsoft Entra tenant requirement is not
applicable. This is not a library, CLI, or product backend; consumer packaging,
backend persistence/concurrency, and health identity checks do not apply. The
Sociobot billing endpoints were checked separately as described above.

## Deployment identity and budgets

All 24 generated candidate content files, including the three source maps,
matched the live custom domain byte-for-byte by SHA-256. The deployment-only
`staticwebapp.config.json` correctly returns 404 and is not precached.

| Asset | Result |
| --- | --- |
| Initial app JS | 35,589 B raw / 11,980 B gzip — PASS |
| Initial app CSS | 19,511 B raw / 5,150 B gzip — PASS |
| Self-hosted fonts | 78,904 B total — PASS |
| Mobile hero | 30,426 B — PASS |

Fresh mobile Lighthouse reported FCP 1.4 s, LCP 1.8 s, CLS 0.002, speed index
1.4 s, and TBT 220 ms. Lighthouse did not provide field INP for this lab run.

## Required next steps

1. Add `.factory/claims.json` and one observable demo-based test for every
   visitor-facing claim; run every listed command from a fresh browser context.
2. Add a true isolated sample-data demo at `/demo` or `?demo=1`, its persistent
   banner/reset/exit controls, and `.factory/demo.md`; make it visible on the
   first screen.
3. Rewrite the first screen to name event hosts plainly and qualify/remove the
   repeat-free claim.
4. Register/enable the Sociobot product so the advertised checkout redirects
   successfully, then exercise the purchase return path.
5. Guard all optional localStorage access so a storage-denied browser can still
   use the free planner.
6. Add the required 404, canonical/social metadata, footer attribution, and
   build identity.
