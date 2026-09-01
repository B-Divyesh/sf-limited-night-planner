# Limited Night Planner — verification handoff 6

## Release result

**Status: FAIL — do not release this candidate as complete.**

- Work order: `limited-night-planner-verify-6`
- Candidate: `2006882bd834e7bfa773d5e9d546ac20975ae9ee`
- Live URL: <https://limited-night-planner.sociobot.in/>
- Full report: [`.factory/verification-6.md`](./verification-6.md)
- Product source changes: none

The live deployment matches all 30 publicly deployable candidate files and the
core planner works. Release is blocked by the following contract failures:

1. At 390 px with 200% text sizing, headline/fact text is clipped and the
   header overlaps. The page cannot scroll to the hidden text.
2. Privacy and Terms have no skip links. Planner-step changes leave focus on
   `<body>` and do not announce the new step.
3. `.factory/claims.json` omits shipped promises about background-tab timer
   behavior, deletion controls, analytics cookies, and reusable archives.
4. `.factory/copy-audit.md` does not cover every landing-page sentence.

## Evidence that passed

```sh
npm ci                          # pass; 63 packages audited, 0 vulnerabilities
npm run check                   # pass
npm test                        # pass; 11/11
npm run test:e2e                # pass; 62/62
npm run build                   # pass; dist/ produced
npm run test:license-rate-limit # pass; allowance 30, then 270×429 + Retry-After
```

Every one of the 13 exact claim commands passed in desktop and 390 px mobile
projects. The cold first screen clearly states the job and audience and offers
**Try it with sample data** in one click. The sample opens immediately with its
isolated demo banner and ready five-player plan.

Independent live checks confirmed the five-player 300/237/63 calculation, ten
unique first-cycle pairings, timer persistence, JSON/CSV/print output, invalid
input recovery, isolated demo reset, local persistence, same-origin-only free
flows, zero cookies, normal-size mobile layout/touch targets, reduced motion,
and offline reload/export. Playwright Axe found zero serious/critical findings,
but it does not detect the focus-management and text-resize failures above.

All 30 public build files matched live by SHA-256. Headers and cache policies
match the repository configuration. The activated worker is
`lnp-59a0f29454a6`; offline demo/legal reloads and the synthetic worker update
test passed.

Lighthouse mobile: performance 98, accessibility 100, best practices 100, SEO
100; FCP 1.2 s, LCP 1.4 s, CLS 0.039, TBT 150 ms, total transfer 134 KiB.
Bundle sizes are 38,367 B JS, 20,667 B CSS, 78,904 B fonts, and 30,426 B for the
mobile hero.

## Next steps

- Correct 200% mobile text reflow and header wrapping.
- Add legal-page skip links and planner-step focus/announcement behavior.
- Complete the claim manifest/tests and landing copy audit.
- Rerun the full verification contract before release.
