# Limited Night Planner — review 5 handoff

## Result

**FAIL.** Review 5 found three remaining issues and changed no product code:

- the `free-core-tools` claim test does not exercise printing;
- the README's `without a card database` statement has no claims entry;
- the landing heading `Ready with room` is unclear out of context.

The complete report is [review-5.md](./review-5.md).

## What was verified

- Fresh production checks at 390×844 and 1440×900.
- One-click demo content, reset, separate IndexedDB namespaces, preservation of
  real data, same-origin requests, empty cookies, and offline reload.
- All 17 exact `.factory/claims.json` commands from a clean clone: 34/34 browser
  executions passed.
- `npm run check`, `npm test` (17/17), `npm run build`, and
  `npm run test:e2e` (86/86) passed from the clean clone.
- Live `verify-url.sh` passed. Live Axe checks found zero violations on
  landing, demo, Privacy, Terms, and 404 at mobile and desktop sizes.
- Every earlier review finding was checked in production and source; all 22
  remain fixed.

## How to reproduce

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Run each `test` command in `.factory/claims.json` separately. Use `/demo/` for
the isolated sample and test both 390×844 and 1440×900 against production.

## Next steps

Address F-5-1 through F-5-3 in `.factory/review-5.md`, then rerun the complete
review. No infrastructure, DNS, billing, deployment, or product code was
changed in this work order.
