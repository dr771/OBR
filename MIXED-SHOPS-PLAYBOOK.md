# Original Brands — decisions

The architecture and scoping calls that still hold, each with its reason. Read before changing anything they cover; record a new decision here (AGENTS.md). Behavior contracts are in `openspec/specs/`, traps in GOTCHAS.md, design values in CI-STYLE-TOKENS.md. Reuse source: SweatyBetty (`../SweatyBetty`), same Dawn/Akeneo/OpenSpec stack; take its shipped patterns, not its brand-specific values.

## Data model

- **One Shopify product per model, colour × size as variants (SB style), decided 2026-08-04.** Not on Plus, so no Combined Listings; colour-level products would mean thousands of near-duplicate PDPs and a hand-built PLP grouping layer. Max two option axes (agreed with Nick), few colours per model, and SB's swatch/filter UX is built on this model. Accepted trade-off: no colourway-level merchandising (tags, collections and channels are product-level, so one colour can't be "New In" or "Sale" on its own).
- **Akeneo naming is Nick's, follow it.** Stable keys `custom.itemid` (model), `custom.colorid`, `custom.sizeid`; option names are bracket keys (`[color]`, `[shoe_size_eu]`, `[tops_size]`, `[bottoms_size]`, …) read only through `ob-option-meta`, never a visible label. Treat a key not yet seen on synced data as tentative.
- **Dutch is the primary locale (2026-09-20).** The storefront filter index is per locale and doesn't fall back to the primary for plain-text metafields: with English primary, the Dutch Category facet covered 16 of 565 products. Flipping the primary fixed it instantly. Moving category/gender onto metaobjects was rejected: a connector change plus more exposure to the `label_nl` orphaning trap (POST-SYNC-CHECK.md §2). Revisit only if a category must carry more than its name.
- **Native Search & Discovery, no Boost.** SB measured native ~40–50% better on LCP. Brand and Gender facets needed zero theme code: Dawn renders any enabled list filter.

## Colour and size

- **Card image follows the first available variant (D1),** not `featured_media`, so grid and PDP always open on the same colour once colour 1 sells out.
- **Swatches use the variant's own photo,** cropped square, on PDP and cards: no hand-curated colour-crop map (SB's middle tier doesn't scale to ~30 brands with their own colour words). On cards a theme setting can switch to flat colour swatches from `filtercolors` hex; image chips are the rollback.
- **The colour *filter* uses flat hex chips from `filtercolors`, not photos:** a filter value is an abstract group ("Rood" spans many products), which no single photo represents. It is a native variant-metafield filter; SB's client-side colour-family merge was not ported, because Nick's metaobject already delivers families. A variant filter also narrows `selected_or_first_available_variant`, so cards show the filtered colour by themselves.
- **One Maat facet for all size systems** (`akeneo.available_erp_sizes`). Shopify already orders it numbers-then-letters, so there is no theme sorter on the facet; the PDP sorts its own options (`pdp-size-picker-order`). The stored metafield is only lexically sorted, so never read it as a sorted source.
- **The PDP gallery shows only the selected colour's media,** matched by the Akeneo colour code in the filename (codes can span segments, SKU hyphens become underscores). Dawn's "hide other variants' media" stays off.
- **Colours with no stock in any size are hidden** from card rails, the PDP picker and wishlist items (`ob-offered-colors`), never via Dawn's size-dependent `value.available`.

## Listing pages

- 4 columns desktop / 2 mobile, native "Toon meer" load-more instead of numbered pagination (SB tested and dropped pagination), vertical filter layout (Dawn's show-more truncation only works there).
- Four collection sort choices (PLP-SORTING.md); search keeps Shopify's own.
- Mobile: an open filter bar above the grid instead of Dawn's drawer; the panel starts closed on every load.
- Sold-out products are hidden by forcing Shopify's availability filter on collection pages (`plp-hide-sold-out`), not by skipping cards in Liquid, so counts and pagination stay right.
- Per-brand photo correction rides on the vendor: a card class plus CSS variables, as percentages so the same inset lands on the chips.
- Mixed studio/lifestyle photography in product grids is fine (owner); keep photography consistent only in curated occasion and brand-story sections.

## Collections and navigation

- **Needs collections are vendor-based (2026-09-03),** mutually exclusive by construction. Activity/category rules overlapped: one Odlo base layer carried five activities across two pillars. Brands without a needs home stay reachable through Schoenen/Kleding/Accessoires and Merken.
- **Two-level menu, no mega menu (2026-09-18).** Only Schoenen has depth, and only along the type axis, so mega columns would be mostly empty. No Dames/Heren/Kinderen top level: at ~80% women it gives three near-identical trees; gender is the first filter. Every brand is reachable under Merken. Reconsider a mega menu only when a real second dimension appears (e.g. men's work boots in volume).
- **FitFlop sub-collections carry the old Drupal slugs** (~19,600 search clicks), because a filtered URL is canonicalised to its parent and loses its ranking. Other brands' old sub-pages had too few clicks and redirect to the brand.
- **Breadcrumb by rank** (`custom.breadcrumb_rank`), since Liquid's `product.collections` order is undocumented (COLLECTIONS.md).
- **Collection copy:** the native description is the short hero intro; buying guidance lives in the separate `custom.bottom_description` below the grid.

## Campaigns and prices

- **Campaigns go through the ERP as compare-at prices by default (2026-10-25):** only then do card and PDP show the real price. A Shopify automatic discount on an `actie-*` collection is the fallback for hand-run campaigns and for types the ERP can't express (2+1); the PDP then says the discount is applied in the cart. Theme-computed campaign prices were rejected: a second value to keep in sync, and a mismatch shows a wrong price. Process: DISCOUNTS.md.
- Promo bar and trust bar are independent; the team shows or hides them by hand (PROMOBAR.md).

## Design direction

- **Reference:** the approved Bolt prototype (`original-brands.bolt.host`) for PLP, PDP and homepage. Match it by measuring the named element, never with an automated audit (CLAUDE.md). A reference's interaction patterns and colours are weighed against what the theme already has; the owner decides where they diverge (the announcement bar keeps Dawn's scroller: 1 message on mobile, 2 on tablet, all on desktop).
- **Proto claims are checked against the real policy before shipping:** "30 dagen gratis retour" was false (returns cost €5.95) and became "Voor 12u besteld, …".
- **A reference's photo treatment is re-derived from the real assets:** Akeneo images are 1:1 with their own whitespace, so the PDP frame is square with no inset.
- **Containers follow the theme's page width** (1600px, 50px inset at the header logo edge), not the proto's 1280px PDP cap. Dawn's Media width and Original/Fill settings stay in charge.
- **Brand:** primary/CTA `#38B6FF`; red only for sale price and accents. Type: Fraunces for true headings, Inter for all dense commerce UI; no third typeface, no italics in body copy, white backgrounds (not beige/cream), the real logo SVG. No positive letter-spacing except section eyebrows (`storefront-letter-spacing`). Known and accepted: white text on `#38B6FF` is 2.26:1, below WCAG AA.

## Wishlist

- **Theme-native, guest-only (localStorage), since 2026-11-06.** Wishlist King caused more bugs than everything else (its option parser broke on Akeneo bracket keys, it dropped changes during saves) and charged per session. Cross-device sync for logged-in customers only if someone asks (it needs a customer metafield written by an app).
