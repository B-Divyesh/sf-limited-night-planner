# Limited Night Planner — independent verification 8 handoff

## Release result

**PASS — accept candidate `e4562bfa2a23d66c6ee1eb9646b6a7cef3635805`.**

- Work order: `limited-night-planner-verify-8`
- Live URL: <https://limited-night-planner.sociobot.in/>
- Detailed report: [`.factory/verification-8.md`](./verification-8.md)
- Product source changed during verification: no

The live deployment matches all 30 publicly served candidate files exactly.
The first screen explains the planner, names event hosts, and offers the sample
in one click. The real and sample planning flows, offline reload, JSON/CSV
exports, timer, seating, print view, local storage, mobile layout, keyboard
operation, and recovery paths all passed.

## Verification summary

From the clean requested commit on 2026-09-01 UTC:

```sh
npm ci                          # pass; 62 added, 0 reported vulnerabilities
npm test                        # pass; 11/11
npm run check                   # pass; no diagnostics
npm run build                   # pass; dist/ produced
npm run test:e2e                # pass; 80/80
npm run test:license-rate-limit # pass; allowance 30, then 270 HTTP 429
```

Every exact command in `.factory/claims.json` was also run separately:
**17/17 commands and 34/34 browser executions passed**.

Independent live confirmation found:

- zero serious or critical Axe findings on checked routes and states;
- zero console or page errors in the representative flows;
- only same-origin requests and zero cookies during ordinary/demo use;
- a 7.94:1 visible focus ring on **Import JSON**;
- no undersized visible control at 390 px;
- offline reload plus valid JSON and CSV downloads;
- worker `lnp-60c34bd6d363` controlling the page with no update waiting;
- secure response headers, correct revalidation/immutable caching, and a real
  404;
- 30 readable license checks followed by 270 HTTP 429 responses, each with a
  `Retry-After` header;
- Lighthouse 95 performance and 100 accessibility/best-practices/SEO, with
  1.65 s LCP, 0.0025 CLS, and 137,661 B transferred.

## Build identity and budgets

- JavaScript: 38,571 B raw / 12.91 kB gzip.
- Application CSS: 21,216 B raw / 5.49 kB gzip.
- Fonts: 78,904 B total.
- Mobile hero: 30,426 B.
- App SHA-256:
  `3ebb0761aecf78cd93a20a98193994199cfc630de5ebfb9fc763abfbfbf500c6`.
- Worker SHA-256:
  `fa477502cd5bd9989cf04472f330ff0938e353ac2b66b73301427875f75921ad`.

## Defects and follow-up

No critical, high, medium, or low defect was found in the checked scope.

New Night Pass sales remain intentionally unavailable until factory product
registration. The product discloses this and existing-pass restore remains
available. This does not limit the complete free planning workflow.

## Reproduce

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run test:claims
npm run build
```
