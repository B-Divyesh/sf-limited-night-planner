# Limited Night Planner — polish 4 handoff

## Result

**PASS.** Repair commit
`9e1a40f737dc2d62c5ee56f3fce2e5b6d128a81f` is pushed to `main` and deployed
to <https://limited-night-planner.sociobot.in/>. The live bundle reports
`1.0.7-polish-4`.

This repair closes every finding in reviews 1–4. It replaces the undefined
fairness promise, adds a real sample-plan preview and the missing landing
sections, labels external links, and makes the core-planning claim test observe
every promised result. The art-deco night-transit identity, local-first PWA,
and isolated demo remain intact. See [polish-4.md](./polish-4.md) for the
finding-by-finding map.

The catalog description is now the 43-character verb-first sentence:
`Plan tabletop events with mixed components.`

## How to run

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run build
```

Use `/demo/` or `?demo=1` for the isolated sample. The persistent demo banner
offers **Reset demo** and **Start for real**. Sample data uses a separate
browser database and is discarded when leaving demo mode.

## Exact verification evidence

- Fresh clone at `9e1a40f`:
  - `npm ci` passed with no reported vulnerabilities.
  - `npm run check` passed.
  - `npm test` passed, 17/17 tests.
  - `npm run build` passed and produced `dist/`; 26 files were precached.
    App JavaScript is 13.59 kB gzip and CSS is 6.07 kB gzip.
  - Every exact command in `.factory/claims.json` ran separately and passed in
    desktop and 390px projects: 17 commands, 34 browser executions.
  - `npm run test:e2e` passed, 86/86 browser checks. This includes unit,
    integration, keyboard, route focus, route metadata, storage failure,
    privacy, offline reload/export, service-worker update, demo isolation, and
    browser Axe coverage.
- Production deployment used `/opt/fleet/lib/deploy-static.sh
  limited-night-planner dist`; Azure deployment ID
  `edf405e0-be94-4ac3-ae1b-6e0c6e2541f2` succeeded.
- Cold live root verification passed with no console errors, valid title and
  language, one h1/main, complete image alternatives, and labeled buttons:
  [verify.json](./evidence/polish-4/live-root-verify/verify.json). Screenshots:
  [desktop](./evidence/polish-4/live-root-verify/screenshot-desktop.png) and
  [mobile](./evidence/polish-4/live-root-verify/screenshot-mobile.png).
- Cold live `?demo=1` redirected to `/demo/`, showed the isolation banner,
  reset/start-real controls, and demo canonical metadata. The live timer moved
  from `45:00` to `44:59`; the host sheet showed the 237-component pool
  instruction, inventory, and round rows. Screenshot:
  [demo mobile](./evidence/polish-4/live-demo-mobile.png).
- Live Axe scans at desktop and 390px across landing, demo, Privacy, Terms,
  and the designed 404 found zero violations:
  [live Axe JSON](./evidence/polish-4/live-axe.json).
- Live mobile Lighthouse: Performance 100, Accessibility 100:
  [Lighthouse JSON](./evidence/polish-4/live-lighthouse-mobile.json).
- A cold live request log during landing-to-demo use contained only
  `https://limited-night-planner.sociobot.in`. A live 390px page also stayed at
  its viewport width at 200% text size.

## Known gaps and next steps

None. New Night Pass sales remain intentionally unavailable; existing verified
passes can restore local archives, as disclosed on the landing page, in the
planner, README, Privacy, and Terms.
