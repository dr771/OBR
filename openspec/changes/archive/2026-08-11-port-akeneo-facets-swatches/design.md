# Design: port-akeneo-facets-swatches

## Context

OB's Akeneo sync (Nick) has delivered 7 real products so far (Sweaty Betty, FitFlop, Holster, Loewenweiss), confirmed live via Admin GraphQL before this design was written:

```
product
 ├─ metafield custom.itemid            (model code, e.g. "A3Z")
 ├─ metafield custom.genderid          single_line_text_field, e.g. "Women"
 ├─ metafield custom.activities        metaobject_reference → type "activities" (code/label/image_asset) — out of scope here, see pdp-feature-icons
 ├─ options: "[color]" (values: Beige, Black, ...), "[shoe_size_eu]" (values: "36".."46")
 └─ vendor                              already correct per brand (FitFlop, Holster, Loewenweiss, Sweaty Betty)

variant
 ├─ metafield custom.colorid           (e.g. "FF_090")
 ├─ metafield custom.sizeid            (e.g. "36")
 └─ metafield custom.filtercolors      list.metaobject_reference → type "filtercolors"
      └─ fields: code (machine key), label (NL display), hexcode (#000000), image_asset (file_reference)
```

Unlike SB, OB's feed has **no per-color curated swatch-image metaobject** (SB's `custom.colorswatch_image`) and **no curated CSV/Amplience color-crop map**. The only color-family/swatch-adjacent metaobject is `filtercolors`, and it's purpose-built for the filter facet (confirmed with Nick 2026-08-11) — reusing it as a grid/PDP swatch source was explicitly rejected (a filter value spans many products; a grid/PDP chip represents one purchasable variant, so it should show that variant's real photo, print and all).

Media filenames follow the same `{sha1}_{product_code}_{color_code}__{shot}` convention SB relies on — confirmed across all 4 currently-synced brands, including Loewenweiss's two-part color code (`2800BC__192-953__47` → filename segment `192_953`).

## Goals / Non-Goals

**Goals:**
- Port `akeneo-option-handling`'s bracket-key detection unchanged — it's already proven correct against a real OB footwear product (`[shoe_size_eu]`).
- Grid + PDP swatch chips: single-tier, variant's own photo cropped square, no metaobject-image or curated-map tiers (OB's feed has neither).
- Color *filter* facet: flat hex chips from `filtercolors`, independent of the grid/PDP swatch logic — different data source, different visual, by design.
- D1: card image tracks the first *available* variant, not `featured_media`, so PLP and PDP never disagree once a color sells out.
- Brand facet (vendor) and gender facet (`genderid`) as new, OB-only capabilities.

**Non-Goals:**
- SB's word-matching color-family merge (`sb-color-family.liquid`) — `filtercolors` already supplies the grouping, reimplementing family-matching on top would duplicate what Nick built.
- Hover-pair second-image swap on PLP cards — ledger marks it "reuse as-is, unchanged" but it isn't part of this batch; a separate on-touch change once the swatch/card-image groundwork here is verified.
- `pdp-feature-icons` — data confirmed ready (`custom.activities`) during scoping, but tracked as its own change, not bundled here.
- Footwear width/half-size handling — no data for it in the current sync.
- Any color/typography values gated on the pending red-vs-blue CTA decision.

## Decisions

1. **Option-kind detection: port `sb-option-meta`'s substring-match approach verbatim, add `shoe_size_eu` to the size-key substring rule.** Already proven: the live Holster product's `[shoe_size_eu]` key matches the existing `size`/`maat` substring rule with no change needed, so this is closer to "confirm and port" than "adapt." Centralize in one snippet per `akeneo-option-handling`'s existing cross-cutting rule — don't reimplement bracket-key parsing per-template.

2. **Grid/PDP swatch chip: single source, no fallback chain.** Both `plp-card-swatches` and `pdp-color-swatches` render the color's first variant's own product photo, cropped square, unconditionally — no metaobject-image tier (doesn't exist in OB's feed) and no curated-map tier (D2, explicitly rejected as non-scalable across ~30 brands). This is simpler than SB's 3-tier chain, not a subset of it — there's nothing to fall back *from*. Terminal case (color has no resolvable image at all) still degrades to a neutral/unavailable chip, same as SB's chain's own terminal case.

3. **D1: card image resolves from `product.selected_or_first_available_variant`'s color, not `featured_media`.** Matches PDP's own hero-color logic exactly, so the two pages can never disagree. This changes today's SB-ported assumption (`plp-card-swatches`' "Card renders with a specific color's image already shown" scenario currently keys off `featured_media`) — the OB delta supersedes that scenario. Theme-side only; no Akeneo change. (SB has the same latent bug — out of scope to fix there in this change, tracked in `SweatyBetty/todo.txt` per the playbook.)

4. **Color filter facet: hex chip from `filtercolors.hexcode`, not an image.** Matches the owner-confirmed reasoning in the playbook (a filter value is an abstract group, a real photo would misrepresent it) and needs no OB-side family→hex map — Nick's metaobject already carries hex per code. `image_asset` is present on the metaobject and noted as a future fallback if the design ever wants a photo-swatch facet, but not used in this change.

5. **Brand and gender facets: reuse `plp-filter-panel-chrome`'s existing accordion chrome, plumb new facet params.** No new UI pattern — vendor and `genderid` just need to become filterable/faceted alongside the existing color/size/material/price facets already scoped in the confirmed facet set (`MIXED-SHOPS-PLAYBOOK.md` "Confirmed facts"). Brand needs no Akeneo-side detection at all (native `vendor`); gender reuses the same bracket-key-adjacent metafield-presence check as size/color.

## Risks / Trade-offs

- [Only 4 of ~30 brands synced] → option-key coverage (`[color]`/`[shoe_size_eu]`) and metafield shapes are verified only for Sweaty Betty, FitFlop, Holster, Loewenweiss. Mitigation: keep every lookup nil-safe (per SB's existing pattern — absent metafield/option degrades to a fallback chip or is excluded from a facet, never a Liquid error), so an unverified brand's product still renders, just without that brand's swatch/facet data until confirmed.
- [`filtercolors` coverage per variant is unverified at scale] → confirmed present on one FitFlop variant; not yet confirmed on all variants of all 4 synced brands. If some variants lack it, the color facet simply excludes that variant rather than breaking the page.
- [D1 changes today's card-image scenario, which was itself ported from SB and never OB-specific] → low risk: this is a documented bug being fixed at the same time it's first built for OB, not a regression of shipped OB behavior.
- [Two-part Loewenweiss color codes (`192-953` in SKU vs `192_953` in filename)] → confirms the filename-parsing convention holds, but the underscore/dash difference between SKU and filename representations should be handled by parsing each independently (per `akeneo-option-handling`'s existing rule: derive codes from SKU *or* filename, never cross-translate one into the other's separator convention).

## Migration Plan

Implement snippets/section changes → `shopify theme dev` locally against `original-brands-dev.myshopify.com` → verify against the 4 real synced brands (color swatches render as variant photos, size facet shows EU sizes for footwear, brand/gender facets filter correctly, PDP/PLP hero color agree for a product with a sold-out first color if one exists, or is spot-checked logically otherwise) → stop for review (per project autopilot rule) → user corrects as needed → only then sync `openspec/specs/` and archive.

## Open Questions

- None blocking. `filtercolors` coverage across all variants of all 4 brands should be spot-checked during implementation rather than assumed from the single confirmed FitFlop variant.
