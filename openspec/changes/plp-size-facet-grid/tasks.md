## 1. Liquid — render the grid

- [ ] 1.1 In `snippets/facets.liquid`, in the per-filter setup above the desktop value loop (~line 118-128), detect the size facet with `filter.param_name contains 'available_erp_sizes'` and set a flag; append a size-grid modifier class to `visual_layout_class` when it is set.
- [ ] 1.2 Raise `show_more_number` to 12 for that facet only, leaving 10/12 as-is for every other facet. Add a comment tying the 12 to the 4-column CSS so a later editor sees the invariant.
- [ ] 1.3 Add a size branch to the desktop value loop (~line 228, beside the existing `filtercolors` branch) that renders the value as a `<label for>` box wrapping the existing `<input type="checkbox">` — same `value.param_name`, `value.value`, `checked` and `disabled` bindings, same `label_class`, with the count kept in the visually-hidden text only.
- [ ] 1.4 Confirm the mobile branch (~line 614) is left untouched, so the drawer keeps Dawn's default list.

## 2. CSS — box, states, grid

- [ ] 2.1 In `assets/component-facets.css`, add the 4-column grid for the size list (`grid-template-columns: repeat(4, 1fr)`), scoped to the modifier class so no other facet is affected.
- [ ] 2.2 Style the unselected box: bordered, centred label, min-width sized for the widest current token (`XXL`), wrapping to greater height rather than clipping.
- [ ] 2.3 Style the selected state (inverted fill: dark background, light text) off the existing `active` class, and the disabled state off the existing `disabled` class (muted, `pointer-events: none`).
- [ ] 2.4 Visually hide the checkbox itself while keeping it focusable, and give the box a visible `:focus-visible` ring so keyboard use is not degraded.

## 3. Verify on the dev store

- [ ] 3.1 Push with `shopify theme push --theme=148245381229 --allow-live --only snippets/facets.liquid assets/component-facets.css`.
- [ ] 3.2 On `/collections/all`, confirm: 4-column grid, 12 boxes visible, 8 behind "show more", and the visible area ending on a complete row.
- [ ] 3.3 Confirm value order is `35…47` then `XXS…XXL`, unchanged from before the change.
- [ ] 3.4 Select a size — results filter, URL gains the parameter, the box inverts, and no box changes position.
- [ ] 3.5 Load a pre-filtered URL directly (`?filter.p.m.akeneo.available_erp_sizes=40`) and confirm the box renders selected on arrival.
- [ ] 3.6 Apply a second facet (e.g. Merk) to force zero-count sizes, and confirm they stay in place as disabled boxes rather than disappearing.
- [ ] 3.7 Check a footwear-only collection or filter combination that yields fewer than 12 values, and confirm no "show more" control appears and the grid does not stretch.
- [ ] 3.8 Confirm Kleur, Merk, Gender, Producttype and Prijs render exactly as before.
- [ ] 3.9 Tab to the grid and confirm the focus ring is visible and space toggles a value.

## 4. Close out

- [ ] 4.1 Note in MIXED-SHOPS-PLAYBOOK.md D6 that the facet-supplied ordering is now depended on by shipped code, so the re-verification when the real assortment lands has a consequence.
- [ ] 4.2 Stop before archiving and hand back for review, per the autopilot rule in CLAUDE.md.
