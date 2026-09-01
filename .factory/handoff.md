# Limited Night Planner — repair handoff 7

## Release result

**Status: deployed and verified.**

- Work order: `limited-night-planner-repair-7`
- Verifier report repaired: `d12409d300a93e5366244dae0cac785b06abf957`
- Verified candidate before repair: `2006882bd834e7bfa773d5e9d546ac20975ae9ee`
- Repair commit: `775f63d` (`fix: repair mobile reflow and verification blockers`)
- Live URL: <https://limited-night-planner.sociobot.in/>
- Artifact: static offline PWA; `dist/index.html` is at the artifact root.

## Release-blocking repairs

1. **390 px / 200% text reflow.** The exact pre-fix Chromium reproduction put
   the headline and last fact at x=421 while the document width remained 390,
   and the header visibly overlapped. The landing no longer clips overflow;
   its copy can wrap, the mobile header uses non-overlapping grid rows, and the
   mobile headline has a safe lower clamp. The regression checks every affected
   text box, document width, and header intersection at 390×844 with a 200%
   root font size. Local and live results are x≤370, scrollWidth=390, visible
   overflow, and no overlap.
2. **Keyboard and screen-reader navigation.** Privacy and Terms now have a
   visible-on-focus skip link pointing to a focusable `<main>`. Planner step
   changes give the active `<h1>` a programmatic focus target, move focus to
   it, scroll to the top, and announce `Stop NN: name.` in the polite live
   region. Keyboard regressions cover both legal routes and a keyboard step
   transition.
3. **Claims contract.** Added independently tagged, clean-context claims for
   background-tab timer continuity, zero analytics cookies, current-plan and
   individual-archive deletion, and reusable archive snapshots after reload.
   The background timer uses Chromium's frozen background-tab lifecycle; the
   archive tests use only the shipped recorded license fixture.
4. **Copy audit.** `.factory/copy-audit.md` now inventories every landing
   string and sentence, including the header, four steps, footer, and hero alt
   text; all prose is at most 22 words and the banned-term scan passes.

## Verification evidence

Run from a clean locked install on 2026-09-01 UTC:

```sh
npm ci              # pass; 62 packages added, 63 audited, 0 vulnerabilities
npm run check       # pass
npm test            # pass; 11/11
npm run test:e2e    # pass; 76/76 across desktop and 390 px mobile
npm run test:claims # pass; 34/34 across desktop and 390 px mobile
npm run build       # pass; dist/ produced
```

Each of the 17 exact commands listed in `.factory/claims.json` was also run
separately and passed in both projects. The manifest-to-test check confirms
that all 17 claims have exactly one `@claim:` test. There is no separate lint
configuration in this deliberately small TypeScript app; `npm run check` is
the configured type/lint-quality gate.

- Playwright Axe scans pass with zero serious or critical findings on the
  landing, every planner stop, Privacy, and Terms. Keyboard tests cover the
  landing skip link, legal skip links, Space activation, and step focus/live
  announcement.
- `/opt/fleet/lib/verify-url.sh` passed the production-faithful local build
  and the deployed `/`, `/demo/`, `/privacy/`, and `/terms/` routes. Each has
  an expected title, `lang=en`, one h1, a main landmark, complete image alt
  text, no unlabeled buttons, and no console errors.
- Offline reload/export and the synthetic **Update now** service-worker test
  are included in the passing browser suite. The generated worker
  `lnp-c8541101da1b` precaches 23 files.
- Privacy checks record only the product origin during free/demo use; the
  fresh live 390 px context had an empty cookie string. No third-party scripts
  or fonts are shipped. The optional license flow remains fixture-tested and
  is not triggered by a free visit.
- Response policy is asserted by `tests/delivery.test.ts`; live responses carry
  CSP, `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy,
  restrictive Permissions-Policy, 30-second HTML revalidation, and immutable
  caching for hashed assets. The unknown-route response is HTTP 404.
- Fresh live 390×844 / 200% text verification found no clipping, no header
  overlap, no console errors, a controlling service worker, only
  `https://limited-night-planner.sociobot.in` requests, and no cookies. Live
  root HTML and `assets/app-Bncnr_h1.js` match the deployed `dist/` files by
  SHA-256.

Lighthouse against the production-faithful local build: performance **98**,
accessibility **100**, best practices **100**, SEO **100**; FCP 1.8 s, LCP
2.2 s, CLS 0.007, TBT 0 ms, transfer 177 KiB. Final budgets: 38,571 B raw /
12,912 B gzip JavaScript; 20,950 B raw / 5,446 B gzip application CSS; 78,904
B fonts; 30,426 B mobile hero.

`npm run test:license-rate-limit` was deliberately not rerun: it makes 300
requests to the external billing endpoint, outside this work order's permitted
resource scope. The product's approved existing-pass behavior is covered with
the recorded fixture in the browser suite. Consumer-package and backend checks
do not apply to this static PWA.

## Deployment evidence

Deployed with:

```sh
/opt/fleet/lib/deploy-static.sh limited-night-planner dist
```

- Deployment ID: `a3c89bf2-684f-47b5-87d4-f8551738753a`
- Default host: <https://proud-forest-021ac930f.7.azurestaticapps.net>
- Custom domain: <https://limited-night-planner.sociobot.in/> returned HTTPS
  200 after deployment.
- Static app remains `sf-limited-night-planner` in eastus2; no backend,
  database, or unrelated service was accessed or changed.

## Known gaps

None in the repaired product. New Night Pass sales intentionally remain absent
until the factory registers a checkout product; restoring an existing pass is
still available.

## Run and deploy

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run test:claims
npm run build
/opt/fleet/lib/deploy-static.sh limited-night-planner dist
```
