## 1. Liquid — render the grid

- [x] 1.1 In `snippets/facets.liquid`, in the per-filter setup above the desktop value loop, detect the size facet with `filter.param_name contains 'available_erp_sizes'` and set a flag; append a size-grid modifier class to `visual_layout_class` when it is set.
- [x] 1.2 Raise `show_more_number` to 12 for that facet only, leaving 10/12 as-is for every other facet. Add a comment tying the 12 to the 4-column CSS so a later editor sees the invariant.
- [x] 1.3 Add a size branch to the desktop value loop, beside the existing `filtercolors` branch, rendering the value as a `<label for>` box wrapping the existing `<input type="checkbox">` — same bindings, same `label_class`, count kept in the visually-hidden text only.
- [x] 1.4 Confirm the mobile branch is left untouched, so the drawer keeps Dawn's default list. *(Verified in rendered HTML: `ob-size-grid` appears once, desktop only.)*

## 2. Collection layout

- [x] 2.1 Set `filter_type` to `vertical` in `templates/collection.json`. Found set to `horizontal` during implementation, which disabled Dawn's show-more truncation entirely and made task 1.2 inert; owner confirmed vertical is intended.
- [x] 2.2 Pull the remote `templates/collection.json` first and diff, so no theme-editor changes are clobbered. *(Only difference was Shopify's auto-generated header comment.)*

## 3. CSS — box, states, grid

- [x] 3.1 In `assets/component-facets.css`, add the 4-column grid scoped to the modifier class so no other facet is affected.
- [x] 3.2 Style the unselected box: bordered, centred label, wrapping to greater height rather than clipping.
- [x] 3.3 Style the selected state (inverted fill) off the existing `active` class, and the disabled state off the existing `disabled` class.
- [x] 3.4 Visually hide the checkbox while keeping it focusable, and give the box a visible `:focus-visible` ring.
- [x] 3.5 Use `padding-block` only, so the host layout keeps supplying inline padding. *(Caught during verification — a `padding` shorthand had killed the popup/sidebar inset and pushed boxes to the edge.)*

## 4. Verify on the dev store

- [x] 4.1 Push with `shopify theme push --theme=148245381229 --allow-live --only …`.
- [x] 4.2 4-column grid renders; 20 values, 12 visible, 8 behind "show more", cut on a complete row.
- [x] 4.3 Order is `35…47` then `XXS…XXL`, unchanged from before the change.
- [x] 4.4 Pre-filtered URL `?filter.p.m.akeneo.available_erp_sizes=40` renders box `40` active and checked, with every box in its original position.
- [x] 4.5 Second facet (`?filter.p.vendor=Holster`) narrows to 11 values in correct order.
- [x] 4.6 Below the threshold (11 values) no show-more control renders and nothing is hidden.
- [x] 4.7 Kleur, Merk, Gender, Producttype, Prijs all still render; all `ob-size-box` occurrences are inside the size grid, none leaked.
- [x] 4.8 Vertical layout confirmed live (`facets__form-vertical` present, horizontal form absent).
- [x] 4.9 Verified in-browser via DevTools MCP: grid measures 4 columns × 56.5px with 6px gaps in a 244px sidebar, no label overflows; focus ring renders (`:focus-visible` matches, `outline: solid 2px`); Space toggles the box, adds `filter.p.m.akeneo.available_erp_sizes=35` to the URL, narrows results to 4 products, and the selected box computes to `bg rgb(18,18,18)` / `color rgb(255,255,255)` / matching border. Screenshot confirms the 12-box grid, the "+ Meer weergeven" control and the untouched colour facet above it.

## 5. Close out

- [x] 5.1 Spec corrected twice against measured reality: the truncation requirement was written for the vertical layout (fixed by 2.1 rather than by bending the spec), and the "unavailable sizes stay visible" requirement was wrong — empty filter values are hidden by a Search & Discovery setting, so the grid shrinks instead. The spec now covers both settings so the theme needs no change if it's flipped.
- [x] 5.4 Added the "hide filter values with no results" setting to MIGRATION-TO-LIVE.md — it's shop config and does not travel with the theme.
- [x] 5.5 Recorded an out-of-scope defect spotted during verification: the **PDP** size picker renders raw unsorted option values (`35 36 37 40 39 42 38 41`) and shows the raw Akeneo key `shoe_size_eu` as its heading. Logged in playbook D6 as a candidate change; deliberately not fixed here.
- [x] 5.2 Note in MIXED-SHOPS-PLAYBOOK.md D6 that shipped code now depends on the facet-supplied ordering.
- [x] 5.3 Stopped before archiving and handed back for review, per the autopilot rule in CLAUDE.md. Approved 2026-08-11.
