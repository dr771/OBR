## Context

`snippets/facets.liquid` renders every facet through one shared value loop. Inside it, the colour facet already gets special treatment via a `filter.param_name contains 'filtercolors'` branch that swaps the default `<label><input>` pair for a swatch chip; everything else falls through to Dawn's default checkbox markup. The enclosing `<ul>` carries `visual_layout_class`, assigned per-filter just above the loop.

That structure is what makes this change small: the size grid is a third branch in a place that already has one, plus a class on the list. See proposal.md for motivation and the measurements that shaped the scope.

## Goals / Non-Goals

**Goals:**
- Re-skin the size facet without touching the controls Dawn's AJAX filtering reads.
- Keep the branch consistent with how the colour facet is already detected, so the file has one pattern rather than two.
- Keep all styling in CSS driven by state classes, so no JS is added.

**Non-Goals:**
- The mobile drawer's rendering (superseded later by `plp-mobile-filter-bar`, unported).
- Any theme-side ordering, `ob-option-meta` involvement, or facet splitting — each ruled out in the proposal with the measurement behind it.

## Decisions

**Detect by `param_name`, not by label or presentation.**
`filter.param_name contains 'available_erp_sizes'` mirrors the existing `filtercolors` branch exactly. Alternatives rejected: matching the visible label `"Maat"` breaks under translation and is forbidden by `akeneo-option-handling`; setting the facet's *presentation* in the admin isn't available for metafield filters and would move a code-visible decision into shop config that a theme copy wouldn't carry.

**Reuse Dawn's `<label for>` + `<input type="checkbox">`, restyled — don't build a new control.**
The box is the `<label>`; the checkbox is visually hidden but remains the focusable, form-submitting element. Selected/disabled state comes from the `label_class` the loop already computes (`active`, `disabled`), so no new state plumbing. This is what keeps "native filtering preserved" true by construction rather than by testing. Alternative rejected: rendering `<button>`s and syncing them to hidden inputs, which is what SB's colour-family merge does — it needs JS and exists there only because SB has to merge values, which OB doesn't (playbook D3).

**Grid via a modifier class on the existing `<ul>`, not a new wrapper.**
Add a size-specific class alongside `visual_layout_class` and let CSS do `grid-template-columns: repeat(4, 1fr)`. Keeps the show-more logic — which counts `<li>` children by `forloop.index` — working untouched.

**Raise the show-more threshold to 12 for this facet only.**
Dawn uses 10 for text facets; 10 boxes in 4 columns leaves a 2-item final row that reads as broken rather than truncated. 12 is the nearest multiple of 4 and gives 3 clean rows. With the current 20 values, 8 stay behind "show more". Alternatives: 8 (too aggressive — hides all letter sizes on a mixed collection, since numerics alone fill 13 slots); 20+ (no truncation at all, which makes the facet dominate the sidebar and diverges from every other facet's behaviour).

**Fixed 4 columns rather than `auto-fill`.**
Size tokens are short and uniform, so an auto-fill grid would reflow to a different column count between collections — footwear-only vs mixed — making the sidebar feel unstable. A fixed count is also what the spec's whole-row truncation requirement depends on.

## Risks / Trade-offs

- **Longest token overflows a narrow box** — `XXL` is the widest current value, but a future `XXXL` or a EU half-size like `40.5` is plausible → size the box from a min-width with centred text and let it grow in height rather than clip; verify with the widest value present.
- **The 4-column grid is specified in two places** (CSS `repeat(4, …)` and the threshold `12`) and they must stay consistent, or truncation stops landing on a row boundary → keep both in the same CSS/Liquid neighbourhood with a comment tying them together; the spec states the invariant so a later editor sees why.
- **Shopify's facet ordering is relied on, not enforced** — if it ever changed, sizes would render in whatever order arrives, with nothing in the theme to catch it. Accepted deliberately: reproducing the sort would mean maintaining a size vocabulary for a multi-brand catalogue whose real assortment isn't loaded yet. → Re-verify the ordering when the live assortment lands; the spec records the assumption explicitly so the check has something to test against.
- **Only 7 test products back this** — one collection, one mixed facet. Layout at other value counts (a 3-value facet, a 40-value facet) is unverified → check both truncation states during implementation rather than only the current 20-value case.

## Migration Plan

Push `snippets/facets.liquid` and the stylesheet with `shopify theme push --theme=148245381229 --allow-live --only <files>`. Rollback is a `git revert` plus the same push — no data, admin, or Search & Discovery change is involved, so nothing else has to be undone.
