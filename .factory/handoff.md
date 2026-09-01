# Limited Night Planner — repair handoff 8

## Release result

**Status: repaired, deployed, and verified.**

- Work order: `limited-night-planner-repair-8`
- Verifier report: `4d10e7b8b08e013a6ffa099a4310c96829505fe3`
- Failed candidate: `c58c494fb2621e4e953ebe766fa5172caf80ce12`
- Source repair commit: `eefd284` (`fix: close verification 7 release blockers`)
- Live URL: <https://limited-night-planner.sociobot.in/>
- Artifact remains a static offline PWA with `dist/index.html` at its root.

The researched brief, product scope, demo isolation, visual thesis, planning
behavior, license behavior, storage model, and deployment class are unchanged.

## Reproduction and repairs

The three verification-7 blockers were reproduced before editing:

1. Tabbing once from **Export CSV** focused `input#import-file` with
   `:focus-visible=true` and `opacity: 0`. Its visible 269×48 px **Import JSON**
   label had `outline: none 0px`.
2. Keyboard focus on **Add first group** used `#E0B44C` on `#F3E8CC`, the
   reported 1.59:1 paper-surface contrast.
3. `@claim:offline-export` downloaded and inspected only CSV despite the
   plural promise covering the JSON backup and CSV host sheet.

Root-cause repairs:

- The transparent file input now delegates its focus presentation to the
  visible label through a 3 px `:focus-within` ring. The live computed ring is
  `rgb(224, 180, 76)` on `rgb(24, 37, 56)`, **7.94:1**.
- Focus color is now surface-aware. Paper controls and fields use signal-dark;
  the exact **Add first group** result is `rgb(158, 47, 32)` on
  `rgb(243, 232, 204)`, **5.98:1**. Legal-page links on paper receive the same
  treatment. Night and brass surfaces retain their contrasting tokens.
- The sole `@claim:offline-export` test still uses its own fresh browser
  context, waits for service-worker control, goes offline, reloads, then
  downloads and parses both exports. The sample JSON has event
  `Saturday mixed box night` and two inventory groups. The CSV has both
  inventory and round headers and 26 lines.
- Browser regressions assert the real Tab sequence, visible label outline,
  computed contrast ratios, dedicated offline context, and both export
  payloads. The claim manifest now describes the complete proof.

The public build identity is `1.0.4-repair-8`.

## Local verification evidence

Run from a second clean locked install on 2026-09-01 UTC:

```sh
npm ci              # pass; 62 packages added, 63 audited, 0 vulnerabilities
npm run check       # pass; no TypeScript diagnostics
npm test            # pass; 11/11 unit and delivery tests
npm run test:e2e    # pass; 80/80 across desktop and 390 px mobile
npm run build       # pass; dist/ produced
```

All 17 exact commands in `.factory/claims.json` were also run separately and
passed in both projects: **34/34 claim executions**. There is no separate lint
configuration; `npm run check` remains this small TypeScript product's
configured type/lint-quality gate.

The full browser matrix covers the real and demo planning jobs, empty and error
states, import recovery, keyboard operation, focus management, 390 px mobile,
200% text reflow, Axe scans, local persistence, archive deletion, privacy,
offline reload/export, and service-worker update activation. Axe found zero
serious or critical issues on the landing page, every planner stop, Privacy,
and Terms.

`/opt/fleet/lib/verify-url.sh` passed the production-faithful local `/`,
`/demo/`, `/privacy/`, and `/terms/` routes. Each returned 200 with the expected
title, `lang=en`, one h1, one main landmark, complete image alternatives, no
unlabelled buttons, and no console errors.

Final production build:

- Service worker: `lnp-60c34bd6d363`, 23 public files precached.
- JavaScript: 38,571 B raw / 12.91 kB gzip.
- Application CSS: 21,216 B raw / 5.49 kB gzip.
- Fonts: 78,904 B total.
- Mobile hero: 30,426 B.

## Deployment and live evidence

Only the existing `sf-limited-night-planner` Static Web App was read and
updated. The upload used its scoped deployment token and `swa deploy dist
--env production`. DNS, billing, databases, app settings, key vaults, and all
other resources were not read or changed.

- Azure deployment ID: `46305f20-a3f9-409d-b8be-d2b020417bf3`.
- Default host: <https://proud-forest-021ac930f.7.azurestaticapps.net>.
- Custom domain: HTTPS 200.
- All **30/30** publicly deployable files match local `dist/` byte-for-byte.
- App JavaScript SHA-256, local and live:
  `3ebb0761aecf78cd93a20a98193994199cfc630de5ebfb9fc763abfbfbf500c6`.
- Service-worker SHA-256, local and live:
  `fa477502cd5bd9989cf04472f330ff0938e353ac2b66b73301427875f75921ad`.
- The deployment-only config and an unknown route both return HTTP 404.

The live `verify-url.sh` run passed `/`, `/demo/`, `/privacy/`, and `/terms/`
with zero console errors. A fresh live 390×844 context at 200% root text had
`scrollWidth=390`; its headline and final first-screen fact stayed within the
viewport. The same context confirmed visible **Import JSON** focus, a
controlling service worker, offline JSON and CSV downloads, only the product
origin in its request log, zero cookies, and zero page or console errors.

Live response headers include CSP with `frame-ancestors 'none'`, HSTS,
`nosniff`, strict-origin referrer policy, and a restrictive Permissions-Policy.
Hashed assets use the configured immutable cache policy and HTML revalidates.

Lighthouse 12.8.2 against the deployed custom domain, using mobile defaults:

- Performance **100**, accessibility **100**, best practices **100**, SEO
  **100**.
- FCP 1.1 s, LCP 1.6 s, CLS 0, TBT 0 ms, speed index 1.1 s.
- Total transferred size: 134 KiB.

The external license rate-limit probe was not rerun because this work order
forbids connecting to non-`sf-limited-night-planner` resources. Existing-pass
behavior remains covered without network access by the shipped recorded
fixture. This static PWA has no backend, tenant, consumer package, or CLI, so
those check classes do not apply.

## Known gaps

No release-blocking product gap remains. New Night Pass sales intentionally
remain unavailable until the factory registers that product; existing passes
can still be restored.

## Run and verify

```sh
npm ci
npm run check
npm test
npm run test:e2e
npm run test:claims
npm run build
```
