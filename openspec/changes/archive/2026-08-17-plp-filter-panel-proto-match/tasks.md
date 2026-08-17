## 1. FILTER heading + panel-wide toggle

- [x] 1.1 Add the FILTER heading markup (reusing `assets/icon-filter.svg` + label) to the top of `snippets/facets.liquid`'s vertical branch, above the accordion list
- [x] 1.2 Style the heading: 1.6rem icon, 0.8rem gap, label 1.2rem/600/uppercase/0.18em tracking, `#38B6FF` color, 1.2rem margin-bottom
- [x] 1.3 Wrap the accordion list in a toggle target and write `assets/ob-filter-panel-toggle.js` (or equivalent) to collapse/expand it on heading activation, with `aria-expanded` on the heading control
- [x] 1.4 Verify default state is expanded on fresh page load and the toggle doesn't fight the existing scroll-based summon/relocate control

## 2. Relocate the active-filter row

- [x] 2.1 Extract the active-filters block (`.active-facets.active-facets-desktop` in the vertical branch) from `snippets/facets.liquid` into its own render-able partial
- [x] 2.2 Remove it from the sidebar `<aside>` render path
- [x] 2.3 In `sections/main-collection-product-grid.liquid`, narrow the `facets-vertical-sort` bar from full page-width to the grid column's width, and render the extracted active-filters partial directly below it, above `#ProductGridContainer`
- [x] 2.4 Mirror the same change in `sections/main-search.liquid`
- [x] 2.5 Re-verify the scroll-based summon/relocate control's bounding-box math still targets only the accordion form, not the (now-moved) pill row

## 3. Restyle the active-filter pills

- [x] 3.1 Update pill styling in `assets/component-facets.css`: rounded-full, white background, 1px hairline border, padding `6px 8px 6px 12px`, 6px gap, 12px/500 full-ink label text
- [x] 3.2 Add/confirm the color-swatch dot prefix on color-value pills
- [x] 3.3 Style the "ACTIEF"-equivalent kicker label: 12px/600/uppercase/0.16em tracking, 40%-ink
- [x] 3.4 Style "Wis alles"/clear-all: 12px/500, 50%-ink, underline, inline after the last pill
- [x] 3.5 Confirm no checked/active-state styling inside the filter accordions themselves (checkboxes, color-swatch selection rings) was touched

## 4. Chevron reposition

- [x] 4.1 Move each accordion header's chevron from the left edge to the right edge (swap to `justify-content: space-between` on the header row)
- [x] 4.2 Confirm `icon-caret.svg` is reused and rotation on open/expand still works
- [x] 4.3 Remove/retire the now-unused left-aligned filled-triangle styling

## 5. Vertical rhythm

- [x] 5.1 Audit `.facets-vertical .facets__summary` / `.facets__disclosure-vertical` padding and border against the proto's measured 20px/20px padding + 1px 10%-ink bottom border, zero extra margin
- [x] 5.2 Correct any drift found

## 6. Hide reset link + max-price caption

- [x] 6.1 Add a CSS-only hide rule for the per-facet "Opnieuw instellen" link (`.facets__summary-row .facets__clear-inline-wrapper` — the vertical layout's actual reset-link selector; `.facets__reset` turned out to be horizontal-only and unused by this project) — keep the Liquid render and JS wiring intact
- [x] 6.2 Add a CSS-only hide rule for the price facet's `products.facets.max_price` caption in the vertical branch of `snippets/facets.liquid`

## 7. Verification

- [x] 7.1 Verify on `/collections/all` at desktop width: FILTER heading + toggle, relocated pill row, right-aligned chevrons, section rhythm, hidden reset link, hidden max-price caption
- [x] 7.2 Verify the same on the search results page (`/search?q=...`)
- [x] 7.3 Confirm the scroll-based summon/relocate control (existing shipped behavior) still works correctly after the pill-row relocation — live-tested: button appears when the form scrolls out of view, click relocates the panel, scrolling back resets it to natural flow
- [x] 7.4 Confirm product grid/cards are pixel-identical to before this change (out of scope, untouched — no edits to card-product.liquid, component-card.css, or the grid's own markup/CSS)
- [x] 7.5 Confirm checked/active-state control colors (checkboxes, color-swatch rings) are unchanged (still blue) — verified live across multiple filter combinations

Bug caught and fixed during live verification (not anticipated in the design): the active-filters partial originally rendered its `.active-facets-desktop` wrapper only when a filter was active, but Dawn's own `assets/facets.js` (`renderActiveFacets`) always does `document.querySelector('.active-facets-desktop').innerHTML = ...` on every AJAX filter update — with zero filters active on page load, that queried a nonexistent element and threw `TypeError: Cannot set properties of null`. Fixed by always rendering the wrapper (content conditional, wrapper unconditional), matching Dawn's own pattern.

Second bug caught live: relocating the block outside `<facet-filters-form class="facets small-hide">` meant it was no longer covered by that form's mobile-hiding class, so it leaked onto mobile as a duplicate of the native `.active-facets-mobile` row. Fixed by adding `small-hide` directly to the relocated block's wrapper.

## 9. Measured pixel-perfect pass (2026-08-17, after owner review)

The first cut was styled by eye and shipped a collapsed main column. Re-done as a proper
`pixel-perfect-conversion` cycle: measure the proto's computed styles → implement → re-measure
the implementation → diff the numbers.

- [x] 9.1 Fix `.facets-vertical-main` collapsing to content width (`flex: 1 1 0%` + `min-width: 0`) — the reported bug; invisible on a full catalog, only appears with a short result set
- [x] 9.2 Action bar: count left / sort right (reference arrangement; Dawn pushed both right), `padding-bottom: 20px`, 1px 10%-ink hairline, `margin-bottom: 28px`
- [x] 9.3 Facet sections re-based on the reference: `<details>` owns 20px block padding + the hairline, summary padding 0, 4px between sections, 16px summary→options
- [x] 9.4 Text option rows to a 32px pitch (6px block padding on a 20px row), with the absolutely-positioned checkmark re-centred against the new padding; size and colour grids explicitly scoped out
- [x] 9.5 FILTER heading flush with the action-bar top (Dawn's `.facets-container` adds a 10px indent) and 16px tall
- [x] 9.6 Pill height to exactly 30px: 12px close glyph (Dawn's `.svg-wrapper` is a fixed 20×20), 16px line-height, and no text line box on the `<facet-remove>` wrappers
- [x] 9.7 Re-measure and diff all 16 metrics against the proto — **all match**
- [x] 9.8 Re-verify search page, 390px mobile (no duplicate pill row), and the size/colour grids after zeroing the fieldset padding

## 10. Second review round (2026-08-17)

- [x] 10.1 Pill and clear-all labels: `letter-spacing: normal` — Dawn's `.button` base was tracking them at 1px / 0.6px where the reference tracks neither
- [x] 10.2 Clear-all vertically centred on the pills — Dawn's `.facets-vertical .active-facets facet-remove:last-of-type { margin-bottom: 1rem }` beat the reset on specificity (`:last-of-type` counts as a class), and `align-items: center` centres the *margin* box, so that 10px pushed the link 5px high
- [x] 10.3 "Sorteer op" label to 60% ink (was 85%) and the sort value to full ink, both measured off the reference
- [x] 10.4 Facet titles ("Shop op …") to full ink — a colour mismatch missed in the first measured pass, which compared size/weight/line-height but not `color`
- [x] 10.5 Active facet rows additionally semibold (owner's call; the reference draws no active/inactive distinction at all). Verified the 600 face is actually loaded, so it renders as 600 rather than being remapped to 700

## 11. FILTER toggle reworked (2026-08-17, owner correction)

The first build hid the whole accordion list (`hidden` on its wrapper). The owner's intent was
different: the heading should collapse and reopen the **facet sections**, keeping their headings
on screen.

- [x] 11.1 `assets/ob-filter-panel-toggle.js` now flips each `<details>`'s own `open` state instead of hiding the wrapper; headings stay visible and every facet stays individually operable
- [x] 11.2 State is derived from the live DOM (collapse while any section is open, otherwise reopen all), so it behaves sensibly after the shopper has collapsed sections one at a time
- [x] 11.3 Verified live: 7/7 sections collapse and reopen, headings visible throughout, panel never hidden
- [x] 11.4 Verified the collapsed state survives an AJAX filter change — Dawn's `renderFilters` only replaces each `<details>`'s innerHTML, never the element, so the `open` attribute persists
- [x] 11.5 Spec scenarios updated to describe section-level collapse instead of hiding the list

## 12. Third review round (2026-08-17) — alignment and icon identity

- [x] 12.1 FILTER icon replaced with the reference's actual glyph as `assets/icon-ob-filter-sliders.svg` (three stroked bars). Dawn's `icon-filter.svg` had been reused on a source-read judgement that it was "the same sliders icon" — it draws two *filled* bars. Verified identical to the proto: 9 lines, 24×24 viewBox, 12×13.3 rendered ink, `stroke-width: 2`, `fill: none`
- [x] 12.2 Facet chevron centred on its title — Dawn pins it at `top: calc(50% - 0.2rem)`, half of *its* ~0.4rem caret, which put the reference's 1.6rem chevron 6px low. Now `calc(50% - 0.8rem)`; verified 0 offset both collapsed and expanded
- [x] 12.3 Option rows centred — Dawn leaves the flex label at `align-items: normal`, so the 16px box top-aligned against 20px text (2px high). Set to `center`, and the checkmark re-anchored to `top: 50%; transform: translateY(-50%)` so it can no longer drift when the row padding changes
- [x] 12.4 Hover underline removed from facet titles and option labels (Dawn's `.facets__summary:hover .facets__summary-label` and `.facets-layout-list .facets__label:hover …`); verified the override wins on both source order and specificity
- [x] 12.5 All centre-line deltas re-measured at 0: chevron↔title, box↔text, checkmark↔box

## 8. Docs

- [x] 8.1 Update MIXED-SHOPS-PLAYBOOK.md if this records a new scoping/design decision worth capturing — added D13
- [x] 8.2 Stopped for owner review before archiving, per the project's default autopilot workflow. Three review rounds followed (sections 9–12); archived on explicit approval 2026-08-17
