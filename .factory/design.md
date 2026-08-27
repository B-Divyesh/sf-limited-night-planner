# Limited Night Planner — visual thesis

## Direction and rationale

**Art-deco transit poster, after the last train.** A host is routing a finite pile of physical components through arrivals (inventory), assembly (packs or pools), departure (start time), and stops (rounds). The interface borrows the confidence and legibility of a 1930s station board without copying any real railway, game, or poster. Strong vertical rails, stepped corners, ticket-shaped controls, route dots, and compressed headings make planning feel orderly while warm paper and ink keep it social rather than administrative.

This is intentionally a single, dark “night service” mode. The painted midnight background is core to the event-at-night premise; warm paper surfaces and high-contrast ink provide the working layer. It does not follow the OS light/dark preference.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--night` | `#101827` | Explicit page background |
| `--night-raised` | `#182538` | Navigation and recessed controls |
| `--paper` | `#F3E8CC` | Primary working surfaces |
| `--paper-deep` | `#E4D3AD` | Secondary paper and dividers |
| `--ink` | `#182132` | Text on paper |
| `--chalk` | `#FFF8E8` | Text on night |
| `--muted-night` | `#C8D0D7` | Secondary text on night |
| `--muted-ink` | `#5B554A` | Secondary text on paper |
| `--signal` | `#E75B3C` | Primary actions, current stop |
| `--signal-dark` | `#9E2F20` | Active state / contrast support |
| `--brass` | `#E0B44C` | Routes, focus, selected states |
| `--green` | `#26775A` | Feasible / ready state |
| `--warning` | `#9B580F` | Tight inventory / attention |
| `--danger` | `#A52C2C` | Invalid or destructive state |

All body combinations target WCAG AA (4.5:1). State is always reinforced with an icon or written label, never color alone.

## Typography

- **Display:** `Barlow Condensed`, self-hosted variable subset, 600–800. Tall station-poster headings, uppercase only for short labels and wayfinding.
- **Utility/body:** `Atkinson Hyperlegible Next`, self-hosted variable subset, 400–700. Clear numerals and distinguishable letterforms for hurried, low-light venue use.
- Scale: 16px body; 18px lead; 20px section title; fluid 30–44px page title; fluid 44–72px hero display. Tabular figures for counts and timers.
- Long copy is capped near 68 characters. Labels are concise and sentence case.

## Spacing and shape

- 4px base rhythm; primary steps are 8, 12, 16, 24, 32, 48, and 64px.
- Content max-width 1180px. The phone layout at 390px becomes one route: navigation scrolls horizontally, plan panes stack, secondary illustration detail disappears, and the live timer becomes the first content item.
- Corners are clipped/stepped (`polygon` or pseudo-elements), not generically rounded. Inputs use 2px radii for usability; paper panels use 12px clipped corners.
- Controls are at least 44px tall with 8px separation. A 3px brass focus ring with a night offset is visible everywhere.

## Interaction grammar

- The planner is a four-stop line: **Inventory → Format → Schedule → Host sheet**. The route header shows the current stop and completion marks.
- Primary actions are signal-red ticket shapes. Secondary actions are ink outlines. Selected choices fill with midnight blue and display a check mark.
- Calculated feasibility is an always-visible departure board: required, available, spare/short, and a written “Ready / Short” status.
- Updates autosave immediately to IndexedDB. The masthead shows “Saved on this device”; failures show a persistent recovery action.
- Destructive reset names what will be removed and requires confirmation. Import validates before replacing data.

## Motion policy

- 180–240ms transitions only, using opacity and transform: a new route stop enters 8px from its travel direction; status chips crossfade; the timer progress line contracts linearly because it represents elapsed time.
- No decorative loops, parallax, flashing, or autoplay. Timer completion uses one restrained pulse plus text and optional notification.
- With `prefers-reduced-motion: reduce`, travel becomes an instant opacity change, smooth scrolling is disabled, and the completion pulse is removed. Meaning and depth remain through borders, scale, and layer contrast.

## Original asset plan and prompt sheet

### Hero: “The midnight route table”

A wide editorial illustration shows an abstract tabletop as a transit map: anonymous card-sized paper rectangles and neutral wooden tokens enter from separate route lines, converge at a circular station clock, then leave as four tidy participant kits. It explains the product promise without depicting proprietary cards, rules, brands, or game art. It is cropped wide on desktop and becomes a quiet banner on mobile.

**Master prompt:** “Original wide art-deco transit poster illustration for a tabletop event planning app. Overhead-oblique view of a midnight navy table transformed into an imaginary transit map. Blank unmarked cream card rectangles and simple geometric wooden tokens arrive along thin brass route lines, converge beneath an abstract station clock, then depart as four neat equal player kits. Screen-printed paper texture, stepped geometric framing, sharp 1930s poster shapes, limited palette of midnight navy, warm cream, oxidized brass, and signal red, dramatic pool of warm lamplight, crisp silhouette, generous negative space, sophisticated editorial composition. No humans, no recognizable game pieces, no playing-card suits, no readable text, no letters, no numbers, no logos, no watermark, no brands, no copyrighted characters, no gradients, no photorealism.”

**Generation:** `/opt/fleet/lib/gen-image.sh`, Azure OpenAI `factory-image`, 1536×1024, high quality; generated 2026-08-27. Original product asset under the repository MIT license. Source candidate and prompt metadata live in `assets/src/`; shipped responsive WebP derivatives live in `public/assets/`.

### Authored assets

- PWA icons are original inline/vector constructions: midnight field, cream ticket diamond, brass route, red station dot. No stock icon set.
- Small UI marks use CSS geometry or authored SVG, with text labels where the symbol is not universal.

## Print treatment

The host sheet drops the night canvas, navigation, and purchase controls. It prints black ink on white at A4/Letter, preserves the route/checklist structure, leaves generous handwritten-note lines, and avoids splitting round cards. The generated illustration is omitted to save ink.
