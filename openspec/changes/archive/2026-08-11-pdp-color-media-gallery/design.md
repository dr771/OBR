## Context

See `proposal.md` for motivation. SB ships a server-rendered per-color main gallery using the variant SKU color segment and media filename code. OB shares that data contract but its live Loewenweiss data uses a hyphenated SKU code (`192-953`) against an underscored media filename code (`192_953`), which SB never handled. Dawn already fetches fresh section HTML on option changes and diffs gallery `<li data-media-id>` elements in `product-info.js`.

The product template's Dawn `hide_variants` setting was switched off through the Theme Editor after implementation and mirrored locally. The custom filter still supersedes that behavior and owns the final media count, so it remains correct if the setting is accidentally re-enabled later.

## Goals / Non-Goals

**Goals:**

- Keep the initial selected color's featured image as the sole eager/LCP candidate and preserve Dawn's lazy loading for later images.
- Keep the main list, thumbnail rail, mobile counter, and expanded modal on the same filtered media set.
- Use only existing Dawn section refresh and gallery diff behavior for color changes.

**Non-Goals:**

- Editorially choosing a model's default/hero color.
- Inferring a media color from alt text or visible color names.
- Repairing incorrect Akeneo SKU/media assignments; unmatched data degrades safely.
- Adding transitions, new gallery navigation, or a bespoke client-side image manager.

## Decisions

1. **Add `ob-variant-color-code` as the SKU boundary.** It confirms the product has a color option through `ob-option-meta`, extracts the segment between the first two `__` delimiters in `{item}__{color_code}__{size}`, then normalizes internal hyphens to the media filename's underscore convention. This keeps SKU interpretation and OB's live cross-format normalization out of gallery templates.

2. **Filter server-side on every media surface.** `product-media-gallery` computes selected-color state and filtered count once, then applies the same inclusion rule to the featured item, main list, and thumbnails. `product-media-modal` applies the identical rule. Alternative rejected: hide nonmatching nodes with CSS/JS, which still downloads unrelated imagery and duplicates Dawn's variant refresh machinery.

3. **Color-neutral media is shared.** A media item for which `ob-media-color-code` returns blank remains in every color gallery. This preserves videos, 3D models, and manually uploaded generic shots that do not follow the Akeneo filename convention.

4. **Fail open when product/SKU identity is unavailable.** If there is no detected color option or no parseable selected-variant color code, all media render in source order. A data anomaly must not empty the PDP.

5. **The custom count supersedes Dawn's variant count.** Once a selected color code is available, `media_count` is rebuilt from included media instead of subtracting `variant_images.size`; filtering loops also bypass Dawn's broad variant-image exclusion. This prevents negative/`-Infinity` counters and makes the result independent of duplicate variant image references.

## Risks / Trade-offs

- [A media filename carries the wrong color code] → It appears under the coded color; data remains the source of truth and can be corrected in Akeneo.
- [Selected variant featured media is mismatched] → Exclude the mismatched media and activate the first matching/shared item so counts and visible content remain consistent.
- [Dawn changes its gallery diff contract] → Theme Check plus live color-switch verification covers `data-media-id` add/remove/reorder behavior on this pinned Dawn version.
- [The Theme Editor setting is accidentally re-enabled later] → The custom color-filter branch bypasses Dawn's variant-image exclusion and owns the count, so storefront behavior remains correct.

## Migration Plan

Deploy only the changed snippets to main theme `148245381229`, switch the standard product template's “Hide other variants' media” setting off through the Theme Editor, mirror that one setting locally, then verify single-segment and multi-segment color products on desktop and 390px mobile. Rollback is an inverse targeted snippet push; the implementation does not depend on the setting for correctness.
