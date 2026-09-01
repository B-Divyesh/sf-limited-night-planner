# Limited Night Planner — independent verification 7 handoff

## Release result

**Status: FAIL — candidate is not accepted as complete.**

- Work order: `limited-night-planner-verify-7`
- Candidate: `c58c494fb2621e4e953ebe766fa5172caf80ce12`
- Live URL: <https://limited-night-planner.sociobot.in/>
- Full evidence: [`.factory/verification-7.md`](./verification-7.md)
- Product source changes: none

The live deployment matches all 30 public files in the candidate. The planner,
sample, persistence, scheduling, timer, print view, exports, privacy boundary,
offline reload, and service worker work. Acceptance is blocked by two focus
presentation defects and incomplete proof for the offline export promise.

## Release-blocking defects

1. **High — no visible keyboard focus for Import JSON.** Tab from **Export
   CSV** focuses `input#import-file`. The input is fully transparent and the
   visible 269×48 px label has no outline.
2. **High — paper-surface focus contrast is 1.59:1.** The global brass
   `#E0B44C` ring on paper `#F3E8CC` does not meet the required 3:1 contrast.
3. **High — offline export proof is incomplete.** The product promises
   “Exports … work offline” and offers JSON and CSV. The tagged offline check
   confirms CSV only.

## Verification summary

From the exact candidate and a locked install on 2026-09-01 UTC:

```sh
npm ci                       # pass; 62 packages, 0 vulnerabilities
npm run check                # pass
npm test                     # pass; 11/11
npm run test:e2e             # pass; 76/76
npm run build                # pass; dist/ produced
npm run test:license-rate-limit # pass; allowance 30, then 270 responses with 429 + Retry-After
```

All 17 commands in `.factory/claims.json` were run individually after install
and passed in both projects (34 browser executions). Before install, those
commands could not start because the clean clone had no local
`@playwright/test`; the installed rerun had no claim assertion error. The
offline-export check still has the coverage gap above.

Independent live evidence:

- Cold first-read: PASS; it states the job, audience, and first action, with a
  one-click sample.
- Four standard routes: HTTPS 200, correct title/lang/h1/main/alt, no console
  errors. Unknown routes return the designed HTTP 404.
- Live requests during free/demo/real use: product origin only; zero cookies.
- Axe: zero serious or critical results on checked desktop/mobile routes and
  planner states. Manual focus checks found the two defects above.
- 390 px and 200% text: no clipping, overlap, or horizontal overflow.
- Offline: `/demo/` reload and CSV export pass in a dedicated context.
- Service worker: live `lnp-c8541101da1b`; local update regression passes.
- Rate limit: 30 HTTP 200 responses, then 270 HTTP 429 responses; every 429
  included `Retry-After: 4` or `3`.
- Byte identity: 30/30 public files match candidate SHA-256 hashes.
- Lighthouse mobile: performance 95, accessibility 100, best practices 100,
  SEO 100; FCP 1.4 s, LCP 1.7 s, CLS 0.002, TBT 230 ms, transfer 130 KiB.
- Bundles: 38,571 B JavaScript, 20,950 B CSS, 78,904 B fonts, 30,426 B mobile
  hero; all required size budgets pass.

No separate lint command exists. This static PWA has no product backend,
sign-in flow, library package, or CLI. No unrelated resource, database,
setting, or secret was read or changed.

## Next steps

1. Add a visible label-level focus state for the transparent file input.
2. Replace the brass-on-paper focus ring with a color at or above 3:1.
3. Confirm both JSON and CSV downloads in the offline claim check, or narrow
   the promise.
4. Rebuild, deploy, and repeat the complete verification set.
