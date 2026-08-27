# Limited Night Planner — build handoff

## Shipped

- A complete four-stop host workflow: inventory, format, schedule, and printable host sheet.
- Flexible, user-named inventory groups with compatibility notes and include/exclude controls; live calculations show usable, needed, per-player, spare, tight, and short states.
- Pack and direct-pool assumptions, player names, reserve, setup/build/round/changeover timing, and a visible warning when configured rounds must repeat matchups.
- Deterministic round-robin table rotation with byes for odd player counts.
- A live round timer with start, pause, reset, next-round controls, and persisted end time so it survives navigation and refresh.
- Printable host checklist, inventory manifest, exception notes, seating route, JSON backup/import, and CSV export.
- IndexedDB persistence with a first-class empty state, validated import errors, confirmed reset, save status, and explicit offline state.
- Installable PWA manifest with 192px, 512px, and maskable original icons. The generated service worker precaches the hashed app shell, serves cached assets, provides an offline fallback, claims clients, and presents an in-app update action.
- Optional $9 one-time Night Pass using the Sociobot billing contract. Checkout targets `/api/v1/products/limited-night-planner/checkout`, returned licenses are stored under `sb_license:limited-night-planner`, verification is cached for at most one day, past purchases can be restored by token, and a valid license unlocks unlimited local plan archives. Core planning, timer, printing, and exports remain free.
- Dedicated `/privacy/` and `/terms/` pages; no analytics, trackers, CDN fonts, proprietary rules, or copyrighted game art.
- The product-specific art-deco transit system in `.factory/design.md`, plus an original reviewed route-table illustration and authored PWA icon. Source prompt and provenance are in `assets/src/`.

## Run and deploy

```sh
npm install
npm run dev
npm run check
npm test
npx playwright install chromium  # first browser-test run only
npm run test:e2e
npm run build
```

The required build command is exactly `npm run build`. Static output is `dist/`; `dist/index.html` is at its root.

## Verification (2026-08-27)

- `npm run check`: passed with no TypeScript errors.
- `npm test`: 8/8 unit tests passed (inventory math, reserve handling, shortage state, repeated/unique seating, odd-player byes, schedule timing, import validation, CSV escaping).
- `npm run test:e2e`: 5/5 Playwright tests passed at a Pixel 7 viewport. Coverage includes a real plan creation route, timer progression, seating, export, legal pages, keyboard operation, and reload after `context.setOffline(true)`.
- Axe via `@axe-core/playwright`: zero serious or critical findings on both landing and populated planner states.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ …`: HTTP 200; load 700 ms locally; title and `lang` present; exactly one `<h1>`; `<main>` present; zero missing alt attributes; zero unlabeled buttons; zero console/page errors.
- Lighthouse 13 mobile: **Performance 99, Accessibility 100, Best Practices 100, SEO 100**. FCP 1.4 s, LCP 1.8 s, TBT 0 ms, CLS 0, Speed Index 1.4 s.
- Production budgets: initial app JavaScript 32.43 KB (11.27 KB gzip), app CSS 19.13 KB (5.08 KB gzip), Latin font files 78.9 KB total, mobile hero WebP 30.4 KB, desktop hero WebP 94.8 KB.
- Responsive visual review completed at 390×844 and 1440×900. Print-specific CSS removes navigation, billing, and decorative ink-heavy chrome.

## Known gaps / release notes

- The factory still needs to register the live paid product. The UI intentionally uses the slug-based production Sociobot endpoint and no hard-coded product ID; a real checkout/receipt could not be exercised before that registration. Invalid pasted licenses remain locked when verification is unavailable.
- Plan archives are intentionally device-local and have no cloud sync. Users should use the free JSON export to move or back up event data.
- Timing and compatibility guidance is user-authored planning support, not official game rules. This is stated in the UI and terms.
