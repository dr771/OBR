## 1. Groundwork

- [x] 1.1 Pull the live `templates/product.json` into a scratch directory with no `.shopifyignore`, diff it against the repo copy, and record which side is authoritative before anything writes to it
- [x] 1.2 Add `assets/component-ob-pdp.css` and link it from `sections/main-product.liquid`, holding the PDP's measured design tokens as custom properties
- [x] 1.3 Add the guarded Fraunces 600 face in `layout/theme.liquid` beside the existing body 500/600 faces, and confirm with `document.fonts` that a 600 face actually loads

## 2. Section shell

- [x] 2.1 Cap the product section at 128rem with a 2.4rem inset, scoped to the product section rather than the theme page width
- [x] 2.2 Apply the `1.12`/`0.88` two-column split with a 5.6rem gutter and a 40rem information-column minimum at desktop, keeping the stacked media-first order below the breakpoint
- [x] 2.3 Verify a collection page's shell is untouched by 2.1 and 2.2 by diffing computed styles before and after

## 3. Gallery chrome

- [x] 3.1 Switch the gallery to the thumbnail layout and give the main image its framed surface — `1.06/1` aspect, 3.2rem radius, hairline border, contained image at 4rem inset, 2.4rem below the breakpoint
- [x] 3.2 Restyle the thumbnail rail as a four-column grid at a 1.2rem gap with 1.2rem radii, 0.8rem image inset, hairline idle border, and full-ink border plus ring when selected
- [x] 3.3 Move Dawn's thumbnail prev/next buttons out of their flanking positions into the counter row, preserving their `data-step`, `aria-controls` and accessible labels
- [x] 3.4 Lay out the counter row with the localized `Afbeelding X van Y` counter at its start and both chevrons at its end, and restyle the chevrons as 3.4rem circles with hairline borders and 1.6rem glyphs
- [x] 3.5 Confirm the gallery, thumbnail grid and counter row are suppressed correctly when a colour resolves to a single image

## 4. Information column

- [x] 4.1 Apply the measured brand, title and price typography, and confirm the title renders at a true 600 rather than a remapped 400
- [x] 4.2 Add the hairline rule, 2.8rem margin and 2.4rem padding to each option block, with a `Label: value` row that names the current selection and updates on change
- [x] 4.3 Restyle the add-to-cart row to 5.6rem with a pill radius and semibold label, keeping the wishlist control in its current position and rendering no quantity control
- [x] 4.4 Restyle the collapsible detail stack — hairline bottom rules, `1.6rem 0` triggers at 1.4rem semibold, 1.4rem/2.275rem bodies, first panel open, chevron reflecting state

## 5. Option pickers

- [x] 5.1 Resize PDP colour chips to 4.8rem with a 0.8rem radius and 0.4rem inset, hairline idle border, and full-ink border plus ring when selected
- [x] 5.2 Restyle size boxes to a uniform 4.4rem height with square corners, hairline idle border on white, and full-ink inverted surface when selected
- [x] 5.3 Add hover treatments for both, and confirm unavailable and keyboard-focus states still read distinctly against the new selected states
- [x] 5.4 Diff a collection page's card chips before and after to prove the shared rail JS and PLP chip styling are unaffected

## 6. New furniture

- [x] 6.1 Add `snippets/ob-breadcrumb.liquid` — a navigation landmark with a localized label, linked ancestors, current page as plain text, and chevron separators hidden from assistive technology
- [x] 6.2 Render the breadcrumb above the product section and style it to the measured values
- [x] 6.3 Add `snippets/ob-usp-strip.liquid` plus a repeatable `usp` block on `main-product` with translatable text and a curated icon select
- [x] 6.4 Style the strip — bounding hairline rules, 2rem padding, two-up at desktop and one-up below, 2rem accent icons hidden from assistive technology — and confirm it disappears cleanly when no statement is configured
- [x] 6.5 Add `snippets/ob-size-chart.liquid` with SweatyBetty's `trigger`/`dialog` surface split, rendering the trigger only for recognized size options
- [x] 6.6 Place the trigger at the end of the size label row, style it to the measured values, and make it withhold rather than open an empty panel while no tables exist
- [x] 6.7 Add `snippets/ob-product-badge.liquid` reading a bestseller product metafield, rendering nothing when unset
- [x] 6.8 Place the badge on the gallery frame and beside the price, style both treatments, and confirm neither leaves a gap when the flag is unset

## 7. Verification

- [x] 7.1 Re-measure the implementation against `.tmp-pdp/proto-metrics.json` with the identical extraction, element by element, and report the diff with its coverage stated
- [x] 7.2 Check centre-line alignment on every row that pairs an icon with text — USP statements, the size-guide trigger, the counter row, the price and its badge
- [x] 7.3 Verify on the FitFlop product (seven images, many colours) that thumbnail scrolling, the counter, and the colour rail all behave, then re-verify after a colour change
- [x] 7.4 Verify at 390px, tablet, and desktop that nothing overflows horizontally and the stacked order is media first
- [x] 7.5 Verify a product with no bestseller flag and no USP statements renders with no holes
- [x] 7.6 Push with `--only` on the changed files; handle `templates/product.json` as a separate reviewed template push

## 8. Shop-side and docs

- [x] 8.1 Create the bestseller metafield definition in the shop and append it to `MIGRATION-TO-LIVE.md` immediately
- [x] 8.2 Configure the two USP statements in the theme editor and record them in `MIGRATION-TO-LIVE.md`
- [x] 8.3 Record the PDP-narrower-than-PLP width decision in `MIXED-SHOPS-PLAYBOOK.md`
- [x] 8.4 Stop before archiving and hand the code back for review, per the autopilot rule
