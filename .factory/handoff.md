# Limited Night Planner — review 3 handoff

## Result

**FAIL.** Product code was not modified. The committed independent review is [review-3.md](./review-3.md).

Five findings remain: an unlisted and overbroad first-visit/offline statement, document-route focus handling, query-demo canonical metadata, one `round-robin` jargon sentence, and one demo slogan.

## What was verified

- Fresh live first reads at 390×844 and 1440×900.
- One-click demo entry, immediate realistic sample, banner, reset/isolation, offline/privacy request behaviour.
- All 17 exact `.factory/claims.json` commands from a clean clone: 34/34 browser executions passed.
- `npm run check`, `npm test` (14/14), `npm run build`, and `npm run test:e2e` (82/82) from that clean clone passed.
- Route metadata, 404, links, headers/footers, keyboard basics, overflow, and Axe serious/critical findings across phone and desktop.

## How to reproduce

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Run every `test` entry in `.factory/claims.json` individually. Review the live landing at `/`, the sample at `/demo/` and `?demo=1`, then navigate between them with keyboard and browser Back.

## Next steps

Address F-3-1 through F-3-5 in `.factory/review-3.md`, add the proposed regression coverage, then repeat this complete review. No infrastructure, deployment, or external product resources were accessed or changed.
