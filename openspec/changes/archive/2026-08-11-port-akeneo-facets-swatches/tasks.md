# Tasks: port-akeneo-facets-swatches

> Verification target: `original-brands-dev.myshopify.com` (storefront password `original`) via `shopify theme dev`, against the 4 real synced brands (Sweaty Betty, FitFlop, Holster, Loewenweiss — 7 products, confirmed 2026-08-11). No `sb-*`-equivalent centralized snippets exist yet in this theme (fresh Dawn clone, no history) — this batch establishes the `ob-*` naming convention for them, mirroring SB's `sb-*` pattern.

## 1. Centralized option-kind detection

- [x] 1.1 Create `snippets/ob-option-meta.liquid`: substring-match kind detection (bracket-key: `[color]`/`[colour]`/`[kleur]` → color; `size`/`maat`/`shoe_size_eu` substring → size; else → generic), size-detection precedence over color so size keys keep resolving correctly
- [x] 1.2 Verified against live theme (Development #148994719853): `[shoe_size_eu]` on Holster Soleseeker slipper renders size radios (not swatches); `[color]` on the same product renders swatch chips

## 2. Grid swatch chip + card image (D1, D2)

- [x] 2.1 Created `snippets/ob-card-swatches.liquid`: for each color value, locates its first matching variant (by option position), renders that variant's own `featured_image` cropped square (64×64) as the chip — single tier, no metaobject-image/curated-map fallback (neither exists in OB's feed)
- [x] 2.2 D1: `snippets/card-product.liquid` now derives `card_media` from `card_product.selected_or_first_available_variant.featured_media` (falling back to `featured_media` only if the variant has none), replacing the old `featured_media`-only logic throughout the card markup
- [x] 2.3 Verified live on `/collections/all` (preview_theme_id=148994719853): all 7 products (FitFlop ×2, Holster, Loewenweiss ×2, Sweaty Betty ×2) show correct per-color swatch chips below price, one real cropped photo per color, counts matching each product's actual color count (2–9 colors)

## 3. PDP swatch chip (D2)

- [x] 3.1 Created `snippets/ob-swatch-input.liquid` + wired `snippets/product-variant-picker.liquid` (forces `picker_type = 'swatch'` for color-kind options regardless of native Shopify swatch linking, since this feed doesn't use it) and `snippets/product-variant-options.liquid` (routes color options to `ob-swatch-input` instead of Dawn's native `swatch-input`)
- [x] 3.2 Verified live on FitFlop Lulu Glitter PDP: all 8 color chips render correct per-color cropped photos (100×100), selected state and radio wiring intact, size options unaffected (still plain radios)

## 4. Color filter facet (hex chips)

- [x] 4.1 Created `snippets/ob-facet-color-chip.liquid` + `snippets/ob-facet-swatch-input.liquid`: renders a flat hex-color chip from a `filtercolors` metaobject entry's `hexcode` field (fallback `image_asset`), matched against the filter value by GID then by label
- [x] 4.2 Wired into `snippets/facets.liquid` (both desktop and mobile filter blocks): filters whose `param_name` contains `filtercolors` route to the ob-facet chip instead of Dawn's native `swatch-input` — confirmed `filtercolors`' `hexcode` field is plain text (not Shopify's native Color field type, checked via `metaobjectDefinitions`), so native swatch auto-detection would not have worked; no SB-style word-matching family merge needed, Nick's metaobject already groups by family
- [x] 4.3 **Root cause was not indexing** — all 12 `filtercolors` metaobject entries were `publishable.status: DRAFT`, invisible to the storefront, so the filter had zero values and Shopify omitted it. Set to ACTIVE via `metaobjectUpdate`; Kleur now renders with correct hex chips (verified: beige #F5F5DC, black #000000, blue #0000FF...). See D3 in the playbook. **Nick's sync must stop emitting DRAFT or this regresses on every re-sync.**

## 4b. Card swatch interactions (hover swap + tooltip)

- [x] 4b.1 Fixed swatch chip links: `value.product_url` is empty on cards (only populated on a product's own page), producing dead links to the current page. Now builds `card_product.url` + `?`/`&` + `variant=<id>`, picking the separator so URLs that already carry query params (e.g. `pr_*` recommendation tracking) stay valid.
- [x] 4b.2 Swatch row given `position: relative; z-index: 2` — Dawn's `.card__heading a::after` stretches over the whole card and was swallowing every pointer event aimed at a chip.
- [x] 4b.3 Created `assets/ob-card-swatches.js`: hover/focus on a chip swaps the card's primary image to that color and moves the active state (hover-persist). Document-level delegation (Dawn replaces `#ProductGridContainer` wholesale on every facet change); `mouseover` not `mouseenter` since only the former bubbles. Progressive enhancement — chips remain real `<a>` links with JS off.
- [x] 4b.4 CSS-only chip tooltip (`::before`/`::after` pill + arrow) from `data-ob-swatch-name`, fixed 2.4rem height so wrapped swatch rows don't jitter.
- [x] 4b.5 Verified live: hovering FitFlop Lulu's 3rd chip swapped the card image Platino → Midnight Navy, moved the active ring, and rendered the "Midnight Navy" tooltip (24px height, 12px font); tooltips confirmed across all 7 cards including wrapped rows.

## 4c. Hover-pair second image

- [x] 4c.1 Created `snippets/ob-media-color-code.liquid`: parses a media/image filename's Akeneo color code, terminating at the `__` shot marker. **Deviates from SB's `sb-media-color-code` deliberately** — SB assumes the code is exactly one segment (`parts[2]`, guarded by `parts[3] == blank`), which silently yields *nothing* for OB's two-segment Loewenweiss codes (`192_953`, `54_352`). This version scans for the empty part and joins everything between product code and shot marker.
- [x] 4c.2 `ob-card-swatches.liquid`: per color, finds the *second* media whose filename code matches that color's own first image, emitted as `data-ob-swap2-*`. Media codes are parsed **once per card** into an index-aligned array (blank → `-` sentinel so `split` can't collapse and misalign); resolving per-color × per-media would be ~400 render calls on the 44-media / 8-color FitFlop Lulu.
- [x] 4c.3 `assets/ob-card-swatches.js`: `ensureHoverImage()` materializes the active color's second shot as an `.ob-card-img2` after the primary image on first card hover, updates it when the active color changes, and removes it for colors with no pair. Dawn's existing `.card-wrapper:hover .media--hover-effect > img + img` rule does the reveal — no new CSS. Bails out if a foreign second `<img>` exists (section's own `show_secondary_image` setting).
- [x] 4c.4 Verified live: pairs resolve on 5 of 7 products (Lulu 8/8, Diva 4/4, Hygge 9/9 incl. two-segment `192_953`, SB Sweatshirt 5/6, SB Leggings 2/2). The two products with 0 pairs are **correct** — confirmed via Admin API that FitFlop Gracie has 3 media/3 colors and Holster 9 media/9 colors, i.e. exactly one shot per color, so no pair exists. Hovering a chip updates both images together (verified: Ochre-Hazelnut → `2800BC_54_352__01` + `__05`); `img2` carries `aria-hidden="true"`.

> **Playbook open question #1 answered:** the `{sha1}_{product_code}_{color_code}__{shot}` filename convention holds across all 4 synced brands — including multi-segment color codes, which is the one place a naive port of SB's parser breaks. Worth recording in MIXED-SHOPS-PLAYBOOK.md at docs-sync time (task 7.1).

## 5. Brand facet

- [x] 5.1 Added by owner in Search & Discovery (source `vendor`). Confirmed **zero theme code needed** — `snippets/facets.liquid` renders any enabled `list`-type filter generically via the existing accordion chrome.
- [x] 5.2 Verified live: "Merk" facet renders in the filter row on `/collections/all`

## 6. Gender facet

- [x] 6.1 Added by owner in Search & Discovery (source `custom.genderid`). No theme code needed, same generic rendering as Merk.
- [x] 6.2 Verified live: "Gender" facet renders and filters (`filter.p.m.custom.genderid=Unisex` returns a narrowed grid)

## 7. Docs

- [x] 7.1 `MIXED-SHOPS-PLAYBOOK.md`: open-question #1 moved to a new "Answered" section (convention holds across all 4 brands, with the multi-segment color-code trap called out); added **D3** (native metaobject color filter + the DRAFT-metaobject gotcha); ledger rows for the four capabilities marked **Seeded**; brand/gender struck from "new capabilities to design"; recorded that the dev catalog is test data (SB items are apparel examples, per owner)
- [x] 7.2 CLAUDE.md: added the `ob-*` centralized snippet list
- [x] 7.3 Reviewed and approved by owner 2026-08-11 — proceeding to spec sync + archive

## 8. Spec sync (only after explicit approval)

- [x] 8.1 Hand-applied (no `openspec` CLI on this machine, see proposal Impact): 6 capabilities seeded into `openspec/specs/` — `akeneo-option-handling`, `plp-card-swatches`, `pdp-color-swatches`, `plp-color-filter`, `plp-brand-facet`, `plp-gender-facet` (18 requirements). Deltas converted to standalone specs with a `## Purpose` each.
- [x] 8.2 Archived under `openspec/changes/archive/2026-08-11-port-akeneo-facets-swatches/`
