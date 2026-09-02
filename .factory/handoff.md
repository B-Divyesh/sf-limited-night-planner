# Limited Night Planner — verification 14 handoff

## Current verification result

**PASS — candidate `92c9001387edc92a4cecf92a4596d45e5b4a8bac` is accepted.**

Independent verification ran `npm ci`, every separate declared claim command
(17/17; 34 browser executions), `npm run check`, `npm test` (18/18),
`npm run test:e2e` (86 checks), and `npm run build` successfully. Fresh
production checks passed for first-read/demo, accessibility, privacy requests,
headers/caching, mobile, keyboard, reduced motion, PWA offline reload, and
Lighthouse (100/100/100/100). All 33 fresh `dist/` public files match
production byte-for-byte. Existing-pass verification limits after 30 rapid
requests and returns 429 with `Retry-After`.

See [verification-14.md](./verification-14.md) and
`verification-artifacts/verification-14-*` for full evidence. No product
code was changed during this verification; no known gaps remain.

---

## Result

**Complete.** Repair commit `94bea74659d49ab4f88987739d45baf6e2a02726`
closes every finding from reviews 1–5. It is pushed to `main` and deployed to
<https://limited-night-planner.sociobot.in/>.

The round-five changes make the free-tools print promise observable with a
`window.print` spy, remove the unlisted README database promise, replace the
ambiguous component-preview heading, and update the catalog sentence to:
`Plan pools and rounds from mixed tabletop components.`

The full finding map is [polish-5.md](./polish-5.md). There are no known gaps
or deferred findings.

## Verification

- A new clone at `94bea74` ran `npm ci`, `npm run check`, `npm test` (18/18),
  and `npm run build` successfully.
- Every exact command declared in `.factory/claims.json` ran separately in that
  clone: 17/17 commands and 34/34 browser executions passed.
- Clean-clone `npm run test:e2e` passed 86/86 tests. It includes the Axe,
  privacy-request, keyboard, mobile, service-worker, and offline suites.
- Built artifact: 26 files precached; application JavaScript is 13.5 KB gzip
  and CSS is 7.2 KB gzip.
- Live root verification passed with no console errors: one h1, `lang=en`, a
  main landmark, no missing image alternatives, and no unlabeled buttons.
  Evidence: `evidence/polish-5/live-root-verify/verify.json`.
- Live Axe scans found zero violations on `/`, `/demo/`, `/privacy/`, `/terms/`,
  and the designed 404 at 1440×900 and 390×844. Evidence:
  `evidence/polish-5/live-route-axe-and-demo-check.json`.
- Live checks confirm first-screen facts fit, `?demo=1` reaches `/demo/`, focus
  announcements work, demo reset stays separate, printing fires once, and the
  worker reloads the demo offline. Evidence:
  `evidence/polish-5/live-first-screen-focus-offline.json` and
  `evidence/polish-5/live-route-axe-and-demo-check.json`.
- Live mobile Lighthouse: Performance 100 and Accessibility 100 (LCP 1.4 s,
  CLS 0.007, total blocking time 0 ms). Evidence:
  `evidence/polish-5/live-lighthouse-mobile.json`.

## Run and deploy

```sh
npm ci
npm run check
npm test
npm run build
npm run test:e2e
```

Run each `test` command from `.factory/claims.json` separately. The isolated
sample is at `/demo/`; `?demo=1` also resolves there. The deployed static
artifact is `dist/` and was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh limited-night-planner dist
```

## Known gaps and next steps

None. Future feature work should preserve the separate demo storage namespace,
the local-first data boundary, and the declared-claim test contract.
