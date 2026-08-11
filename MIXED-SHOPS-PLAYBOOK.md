# Original Brands — Playbook

Shopify + Akeneo migration for Original Brands (originalbrands.nl), multi-brand apparel + footwear retailer replacing a custom Drupal-ish CMS. Dawn theme, connected to `original-brands-dev.myshopify.com`. Reuse source: SweatyBetty (sibling directory, `../SweatyBetty`), same stack, further along — check the reuse ledger below before re-deriving architecture.

## Confirmed facts (site audit, 2026-07-14)

- **Current site is a migration, not "existing Shopify to copy."** Original Brands runs a custom Drupal-ish CMS (`itr_theme`, `photohost.be` image CDN) — content/UX parity target, not code to port. Expect the same per-variant-URL → single-Shopify-product consolidation + redirect-mapping work SB needed.
- **Not a marketplace** — single-operator, multi-brand retailer. Product structure matches SB: 1 item + color/size variants. Confirmed directly on a PDP (color links + size dropdown, one SKU per color/size combo).
- **Brand is a first-class dimension**, exposed as a real PLP facet ("Merk", with counts) *and* top-nav brand links. Dawn's stock `vendor` field is the natural home for it — unlike SB, where it sat unused and got repurposed for "material."
- **Facet set is a superset of SB's shipped facets:** Merk / Geslacht / Kleur / Maat / Materiaal / Prijs, all open-by-default accordions (same UX pattern SB already ships).
  - **Gap vs. SB today: no Brand facet, no Gender facet.** Everything else (color, size, material, price) SB already has a working pattern for.
- **Card pattern** = swatch/color links + inline size availability + sale-% badge — functionally what `plp-card-swatches` / `plp-size-facet-grid` already do.
- **Already shows a wishlist icon in the header** — the Wishlist King header/PDP/cart-drawer integration (`wishlist-integration` spec) is a straight port, not new discovery work.
- Standard trust-badge / newsletter-signup patterns (delivery cutoff, return window, discount-on-signup) — content parity items, not architecture.

## Product-model decision (Akeneo → Shopify) — decided 2026-08-04

Nick (Akeneo side) asked which mapping to build the first OB sync on:

- **Holster style** — one Shopify product per *model + color*, sizes as variants (color-level PDPs, like Nike/Zalando).
- **SB style** — one Shopify product per *model*, color × size as variants.

**Decided: SB style — reuse the SB setup 1:1.** What settled it:

- **Not on Shopify Plus** → no Combined Listings. Color-level products would mean thousands of near-duplicate PDPs with no canonical mechanism, and the PLP grouping layer would have to be hand-built.
- **Boost is out** (native filter & search) — so grouping color-level products on the PLP has no app to lean on either.
- **Max 2 option axes agreed with Nick** → color + size fits; the "no room for a 3rd axis" objection is moot.
- **Few colors per model** → no variant-count problem.
- **SB's PLP swatch/hover/filter UX already exists** and is built on this model — rebuilding it as a grouping layer would be a pure regression.

**Accepted trade-off:** colorway-level merchandising is impossible on Shopify — tags, collections and channel publishing are product-level, so you cannot put only the black colorway in "New In", cannot tag one color "Sale", and a new colorway added to an existing product will not surface in New-Arrivals sorts (product `created_at` stays old). Owner confirmed 2026-08-04 that marketing per color is not needed.

**Insurance regardless:** have Akeneo emit stable keys as metafields from day one. Costs nothing now, turns a future color-level split from archaeology into a data migration.

**Dev-store catalog is test data, not the live assortment (owner, 2026-08-11).** The 7 products synced so far are Akeneo pipeline tests. In particular the two **Sweaty Betty items are apparel examples** (chosen to exercise the non-footwear path) and probably won't be in the live shop — so don't read the dev catalog as evidence about the final brand mix or assortment. It *is* valid evidence for data-shape questions (option keys, metafield naming, filename conventions), which is what the 2026-08-11 verification work relied on.

**Confirmed against the first 3 synced products (2026-08-10):** Nick's Akeneo naming, not the placeholder names originally sketched above — follow his convention, don't rename on the theme side. Actual keys landing in Shopify:
- Product: `custom.itemid` (model code, e.g. `A3Z`, `HST480`)
- Variant: `custom.colorid` (e.g. `FF_090`, `HLR_BE`), `custom.sizeid` (e.g. `36`)
- Variant option names arrive as `[color]` / `[shoe_size_eu]` (footwear) — same bracket-key pattern `akeneo-option-handling` already expects, new key for the EU shoe-size axis.
- Also present: `custom.filtercolors` (metaobject reference(s) on the variant, for color-family/swatch filtering), `custom.genderid` (Women/Unisex seen so far), `custom.shopify_originalbrands_category`, `custom.activities`, `custom.materials_maintenance`, `global.harmonized_system_code` on variants.

### D1 — Card image must follow `first_available`, not `featured_media`

There is no "main color" setting in the SB build; the hero color falls out of two *different* Shopify defaults that can disagree:

- **PDP** uses `product.selected_or_first_available_variant` → the first color that still has *any* size in stock.
- **PLP card** uses `card_product.featured_media` → simply the product's first image (`sb-card-swatches` then pre-selects the chip whose filename color code matches it).

So once color 1 sells out, the grid tile still shows color 1 while the click lands on color 2. Also: both orders come from Akeneo (option-value order + image upload order), so nobody has editorial control over which color represents the model.

**Decision:** derive the card image from the first *available* variant's color code instead of `featured_media`, so PLP and PDP are always in sync. Theme-side fix, no Akeneo change needed. Applies to SB too (same bug there — see `SweatyBetty/todo.txt`). A *chooseable* hero color would need an Akeneo field — not scoped.

### D2 — Color swatches: img-swatches on PLP grid + PDP, no curated swatch-color map — decided with Nick 2026-08-11

SB's swatch chain tries three tiers in order, per color: a per-color swatch metaobject image → a curated Amplience PSWATCH crop map (`sb-color-swatch-url`, ~130 hand-maintained `color name → CDN url` entries, regenerated from a CSV) → the variant's own product photo, cropped (the one tier that needs no curation, since every variant already has an image).

**Decided:** OB skips the curated-map tier entirely on both `plp-card-swatches` (grid) and `pdp-color-swatches` (PDP) — swatches are always the variant's own product photo, cropped square ("img-swatches"), same as SB's fallback tier. Reason: there's no Amplience-style curated color-crop asset in the OB Akeneo feed, and hand-maintaining a color-name → crop-URL map the way SB does doesn't scale to a ~30-brand catalog with brand-specific color vocabularies.

**Filter facet stays separate from D2 — confirmed with owner 2026-08-11:** grid/PDP swatches represent one specific purchasable variant, so a real photo is accurate (a leopard-print "Brown" shows the print). A filter *value* represents an abstract group spanning many products ("Rood" catches every red-ish item in the catalog) — no single product photo can correctly represent that group, so the facet uses flat color-family chips instead of img-swatches. `custom.filtercolors` (the metaobject reference already landing on variants, see naming confirmation above) is confirmed as the source for this — Nick built it specifically for color-family/swatch filtering, don't reimplement SB's word-matching `sb-color-family.liquid` approach on top of it.

**`filtercolors` metaobject fields — confirmed 2026-08-11** (queried live via GraphQL against a synced variant, e.g. `SB1059478__001__S` → `Black Grey`): the metaobject type `filtercolors` carries `code` (machine key, e.g. `black`), `label` (Dutch display label, e.g. `zwart`), `hexcode` (literal hex, e.g. `#000000`), and `image_asset` (a `file_reference` swatch image). **Chip design decided:** render the facet chip from `hexcode` directly (fallback to `image_asset` if a future design wants a photo swatch instead of a flat color chip) — no OB-side family→hex map needed, since the metaobject already supplies hex per color code.

### D3 — Color filtering: native variant-metafield filter, no family-merge port — confirmed live 2026-08-11

SB merges ~30 raw `[color]` option values into families client-side (`sb-facet-color-merge.liquid`: a visible master checkbox carrying no `name`, wrapping hidden per-value `filter.v.option.[color]` checkboxes, synced by JS). **OB does not need any of that.** Nick's `custom.filtercolors` metaobject already delivers pre-grouped families, so a single native Search & Discovery filter on that variant metafield does the same job with no JS.

**Verified live:** with `filter.v.m.custom.filtercolors` active, Shopify narrows `selected_or_first_available_variant` to a *matching* variant, so each PLP card automatically shows the filtered color's photo — the "filter blue → see blue products" behavior SB gets from `filter.v.option`. Confirmed on FitFlop (→Midnight Navy), Loewenweiss Diva (→Blue), Hygge (→Blue-Fluo Green), each with the right swatch chip marked active. D1's card-image logic is compatible with this, not in conflict — the filter narrows what that drop resolves to.

**Gotcha that cost real time — DRAFT metaobjects (fixed 2026-08-11):** a metaobject-backed filter renders **nothing** on the storefront if its entries are `publishable.status: DRAFT`, because the storefront can't read drafts, so the filter has zero visible values and Shopify omits it entirely. The admin shows it fully configured *with* values and swatches (admin sees drafts), so it looks like an indexing delay or a theme bug. All 12 `filtercolors` entries were DRAFT (and later both `activities` entries); set to ACTIVE via `metaobjectUpdate`. **Cause — corrected 2026-08-11 per Nick, who hit this on SweatyBetty first:** it is a *Shopify platform default*, not an Akeneo sync defect. A metaobject definition with the `publishable` capability enabled creates new API-made entries as DRAFT unless the creating request explicitly sets `capabilities.publishable.status: ACTIVE`. Both OB definitions have that capability enabled. Consequence: **a fresh shop is exposed to this again regardless of who runs the sync**, so it's a migration checklist item, not a Nick item — and the lesson is to check the sibling project's notes before writing something up as a partner's bug. Unrelated red herring: `adminFilterable.eligible: false` on a metafield definition governs the *admin* product-list filter, not storefront filters.

### D6 — Size facet: three coexisting size systems, so SB's letter logic is extended, not replaced — measured 2026-08-11

Read off all 7 synced products. The catalog uses **three** Akeneo size option keys at once, and a single "Maat" facet has to cope with all of them:

| Option key | Values seen | Products |
|---|---|---|
| `[shoe_size_eu]` | `35`–`47` (numeric) | 5 — FitFlop ×2, Holster, Loewenweiss ×2 |
| `[tops_size]` | `XXS XS S M L XL XXL` | 1 — SB sweatshirt |
| `[bottoms_size]` | `S M L XL` | 1 — SB leggings |

Consequences for the port:

- **SB's letter-size ordering is reusable as-is** for `[tops_size]`/`[bottoms_size]`, and a numeric-ascending branch is *added* for `[shoe_size_eu]`. The earlier note ("EU ordering 36–46 **instead of** SB's XS–XXL logic") was wrong on both counts — OB is apparel *and* footwear, so it needs both.
- **The EU range is 35–47, not 36–46.** Loewenweiss Hygge alone spans 35–47 and Holster reaches 46. Don't hardcode a 36–46 grid.
- **Ordering is already correct on the facet — don't build a sorter.** Measured on the live storefront: the "Maat" facet renders `35 36 … 47` then `XXS XS S M L XL XXL`. That is neither the raw option order (`36 37 40 39 42 …`) nor alphabetical (which would give `L M S XL XXL XS XXS`) — Shopify applies its own size-aware sort to the metafield facet values. Verify it still holds when the real assortment lands, but do not port a theme-side ordering pass on spec. **Shipped code now depends on this** (`plp-size-facet-grid`, 2026-08-11) — the size grid renders values in the supplied order with no fallback, so if the ordering ever changes the facet silently renders wrong rather than failing loudly. That re-verification has teeth now.
- **Empty filter values are hidden — that's an admin setting, not platform behaviour.** Search & Discovery is configured to hide filter values with no matching products (set by the owner). So narrowing by another facet *shrinks* the size list instead of greying values out — verified live (`Merk=Holster` → 11 values, no disabled boxes anywhere on the page). Consequences: Dawn's disabled-value styling never renders today, so don't design around a "greyed-out unavailable sizes" state; and because this is shop config it does **not** travel with the theme — it's in [MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md). Flipping it back is a legitimate merchandising choice, so theme code must stay correct under both settings rather than assuming values are never empty.
- **The collection page uses the *vertical* filter layout** (`templates/collection.json` → `filter_type: vertical`, corrected 2026-08-11 — it had been `horizontal`). This matters beyond looks: Dawn applies show-more truncation **only** in the vertical layout, so any facet work relying on truncation silently does nothing under `horizontal`.
- **The facet is metafield-backed, not option-backed:** `filter.p.m.akeneo.available_erp_sizes`. So `ob-option-meta` does **not** apply here — it keys off a bracketed *option* name (`[shoe_size_eu]`), which the filter object doesn't carry. Detect it the way the colour facet already is detected in `facets.liquid`, by `filter.param_name contains '…'`. `ob-option-meta` remains correct for PDP/PLP *option* rendering; facets are a separate path.
- **Both size systems already share one "Maat" facet**, and read acceptably (numbers, then letters). Keeping one facet is the status quo, requires no S&D change, and is what the measurement supports. Revisit only if the real assortment makes the mixed list unwieldy.
- Raw *option* values (`[shoe_size_eu]`) do arrive unsorted, so anything rendering options directly owns its ordering. **This is a live, visible bug on the PDP** — confirmed on screen 2026-08-11, Loewenweiss Diva renders its size picker as `35 36 37 40 39 / 42 38 41`. The facet is sorted by Shopify; the PDP picker is not, and nothing sorts it today. Worth its own small change (`pdp-size-picker-order`), independent of the facet work. Note the PDP label also shows the raw Akeneo key `shoe_size_eu` as its heading — the same screenshot shows `color: Grey` rendering correctly, so it's the size option specifically that needs a display name.
- `akeneo.available_erp_sizes` as a stored metafield is only lexically sorted (`L M S XL` — wrong for letters); don't read it directly as a sorted source.

Aside, noted while measuring: `akeneo.available_erp_sizes` has `access.storefront: NONE`. The Search & Discovery facet works anyway (its filter engine doesn't go through Liquid), but any Liquid that tries to *read* the metafield directly will silently get nothing. MIGRATION-TO-LIVE.md lists it as needing `PUBLIC_READ` — that's only required if a future feature reads it in Liquid.

### Still open (to work through one by one)

1. **Option-key sprawl across ~30 brands** — SB has a fixed, known set of Akeneo bracket keys (`[color]`, `[bottoms_size]`); a multi-brand catalog likely does not. **Partly measured:** 3 keys across 7 products, see D6.
2. **Footwear specifics** — widths, half sizes, and a much larger color vocabulary than `sb-color-family`'s current map.

### Answered

- **Image filename convention** (was the "biggest single reuse risk") — **holds across all 4 synced brands**, confirmed 2026-08-11: `{sha1}_{product_code}_{color_code}__{shot}[_{uuid}]`. **One real trap:** the color code is *not* always a single underscore-delimited segment — Loewenweiss uses two (`192_953`, `54_352`). SB's `sb-media-color-code` hard-codes the single-segment assumption (`parts[2]`, guarded by `parts[3] == blank`) and silently yields *nothing* for those, with no error. OB's `ob-media-color-code` scans for the `__` shot marker instead. Don't port SB's version verbatim.

## Reuse ledger (SB's shipped `openspec/specs/`)

| Capability (spec) | Verdict | Note |
|---|---|---|
| `akeneo-option-handling` | **Seeded** (`openspec/specs/`, 2026-08-11) | Bracket-key detection ported as-is; `[shoe_size_eu]` confirmed live. Added an OB-only requirement: media color codes may span multiple segments (see Answered above) |
| `plp-color-filter` + `plp-card-swatches` | **Seeded** (2026-08-11, see D2/D3) | Card swatch chip drops the curated color-crop map tier (D2); color-family merge **not ported** — native metaobject filter replaces it (D3); hover swap + hover-pair + tooltips ported |
| `plp-size-facet-grid` | **Reuse, adapt** | Box-grid pattern holds; footwear brands (FitFlop, Hi-Tec, Magnum, etc.) need EU shoe-size ordering (36–46), not SB's XS–XXL/bra-size logic |
| `plp-filter-panel-chrome` | **Reuse as-is** | Open-by-default accordions, "Shop by ..." labels — matches the site's native pattern |
| `plp-mobile-filter-bar` | **Reuse as-is** | Nothing brand-specific in the mechanism |
| `plp-grid-config`, `plp-loading-feedback`, `plp-scroll-clamp`, `plp-sort-options` | **Reuse as-is** | Pure UX/perf plumbing, no brand coupling |
| `pdp-color-swatches` | **Seeded** (2026-08-11, see D2) | Same swatch-input markup/behavior; drops the curated color-crop map tier, falls straight to the variant image |
| `pdp-feature-icons` | **Reuse, verify data** | Depends on whether the Akeneo feed carries an equivalent icon/attribute metaobject — confirm before assuming |
| `predictive-search-overlay` | **Reuse as-is** | Generic search UX |
| `cart-drawer-line-item-layout` | **Reuse as-is** | Generic |
| `wishlist-integration` | **Reuse as-is** | Site already has a wishlist icon today — validates this is wanted, not a guess |
| `header-animated-logo` | **Retire (SB-specific)** | Built to match sweatybetty.com's exact wordmark/monogram SVG — not applicable unless a brand asks for the same treatment |
| `link-underline-style`, `branded-dropdown-controls` | **Reuse pattern, not values** | The *mechanism* (sitewide override) is reusable; the actual style call is per-brand |
| Boost (archived) | **Retired, don't reopen** | Only real "didn't work" data point so far: native beat Boost by ~40–50% LCP for SB (`archive/NO-BOOST-TEST.md`) — treat native-first as the default starting point here too, skip re-litigating Boost vs. native from scratch |

**New capabilities to design (not covered by any SB spec):**
- ~~**Brand facet**~~ — **done 2026-08-11** (`plp-brand-facet` seeded). Needed *zero* theme code: Dawn's `facets.liquid` renders any enabled `list`-type filter generically, so it was purely a Search & Discovery config on `vendor`.
- ~~**Gender facet**~~ — **done 2026-08-11** (`plp-gender-facet` seeded). Same story: admin-only config on the `custom.genderid` product metafield.
- **Reviews** (Trustpilot-style) — new capability, not covered by any SB spec; see Frontend Feature Audit below for the UX shape worth building.
- **Newsletter popup + post-signup discount reveal** (suggested by Melissa, marketing analysis 2026-08-10) — show the discount code only *after* signup rather than in the popup itself, to maximize signup conversion and grow the newsletter database; exact %/€ still open (see Open questions). Must not stack with the cookie-consent banner — same instruction already in the Frontend Feature Audit skip-it list below.
- **Promo bar** (suggested by Melissa) — persistent thin banner (typically above/below the header) for running promos, shipping USPs, new collections; independent of the newsletter popup.
- **PDP product video** (suggested by Melissa) — scoped to FitFlop marketing styles only initially, not all brands/models; "shop the look" cross-brand video (multiple brands styled as one outfit) is a later-phase idea once more fashion brands are onboarded.

## Frontend feature audit — design/UX judgment calls (2026-07-14)

The reuse ledger above is about *architecture*. This is about *design/UX quality* from a visual review of the current site — worth adopting, or skip as dated.

**✅ Take it — genuinely good, worth building:**
- **Inline Trustpilot-style widget on PDP:** TrustScore + review count sits cleanly in the buy-box flow, not floating over content — replaces the site's current floating Kiyoh rating badge, which overlaps the gallery awkwardly.
- **Real product reviews with pros/cons:** star rating up top near the title (immediate social proof above the fold), full reviews with "Pluspunten/Minpunten" + a structured submission form. A capability neither SB nor the current ledger has at all — genuinely worth scoping in, not just a nice-to-have.
- **Per-brand fit-guide accordion** ("Hoe vallen FitFlop damesschoenen?") + short "Over [Brand]" blurb on PDP: real answer to a real multi-brand problem (sizing isn't consistent brand-to-brand) that SB never needed as a single-brand store. Worth a generic `sb-brand-fit-guide`-style snippet, Akeneo/metaobject-driven per brand.
- **Structured specifications table** (Merk/Model/Kleur/Materiaal/Voering/Zool/Technologie/Pasvorm as clean label:value rows): a good complement to marketing copy once Akeneo attribute sets are richer than SB's, surfaces attributes a shopper actually filters/decides on.
- **Brand watermark on the PDP gallery image**: small brand logo tag overlaid on the product photo — cheap, clear brand attribution in a multi-brand catalog. SB never needed this (single brand) but it matters here.
- **Circular brand-shortcut row + clean logo trust bar on homepage:** "shop by brand" as photo circles right under the hero, plus a minimal black-and-white logo strip further down — communicates "curated multi-brand" at a glance, better than a plain text nav for the same job. *(Independently suggested by Melissa too, marketing analysis 2026-08-10 — cross-check confirms this.)*
- **Homepage "Aanbevolen voor u" carousel with a real CTA per card:** clean, well-spaced homepage personalization pattern worth keeping.
- **Size box-grid picker on PDP** (boxes, not a dropdown) — extends the same box-grid pattern SB built for PLP (`plp-size-facet-grid`) to PDP too.
- **PDP photo: angled side view + hover-to-detail-shot** (suggested by Melissa) — both competitor benchmarks (Omoda, Etrias/Only Brands) shoot product photos from an angled side view rather than straight-on; Omoda additionally swaps to a foot/detail close-up on hover. Worth adopting for OB's own product photography direction — the hover-swap mechanism can likely reuse the same hover-pair-swap pattern `plp-card-swatches` already has for PLP cards.
- **PDP description visible within 1.5 scrolls max** (suggested by Melissa) — explicit layout budget benchmarked against Omoda's PDP (competitor takes ~3 scrolls to reach the description, flagged as a weakness worth beating, not copying).

**❌ Skip it — dated or actively bad UX, don't replicate:**
- **Stacked/simultaneous popups:** cookie-consent banner *and* a birthday-newsletter modal both fire at once, overlapping each other and the product gallery/thumbnails. If a newsletter popup ships at all, it should be delayed/exit-intent and never stack with the cookie banner.
- **Floating rating badge overlapping content:** the Kiyoh trust badge floats mid-page over the gallery — use the inline pattern from the Take-it list above instead.
- **Wall-of-SEO-text below the PLP grid:** one long unbroken paragraph block ("Sweaty Betty: Dé keuze voor actieve vrouwen..."). Keep the *intent* (organic-search copy) but not the execution — short, per-brand columns in the footer read far better than one undifferentiated wall of text.
- **Numbered pagination ("Pagina 1 van 7"):** SB already tested and deliberately dropped numbered pagination for load-more (`plp-grid-config` spec, 2026-07-05) — don't regress on this here either.
- **Plain `<select>` size dropdown on PDP:** worse than SB's existing button-based size picker — no reason to regress to a dropdown.
- **No size-chart / fit-guide link near the size selector:** SB's `sb-size-chart` "Maattabel" dialog is already a better answer to the exact same question — carry that forward as-is.

## Homepage redesign direction — approved 2026-07-14

Original Brands' current homepage is a generic "SOLDEN tot 40% korting" clearance banner + a 3×3 brand-tile grid with wildly inconsistent photography (a Magnum tactical-boot close-up next to a Sweaty Betty yoga shot next to a Juicy Couture street-style photo, all behind an identical gray CTA button) — it reads as "logos we happen to sell," not a considered destination. The problem is real: the brand mix (Sweaty Betty, Odlo, Magnum, Mechanix, Hi-Tec, Holster Australië, Juicy Couture, RH+, Löwenweiss, FitFlop) doesn't share one lifestyle aesthetic, so forcing them into one flat grid/mood is what breaks visual coherence.

**Positioning: "The right specialist for the job — not a wall of logos."** Original Brands isn't a lifestyle boutique; it's an expert curator — for every part of a customer's life (training, outdoors/work, everyday comfort) it stocks the one trusted specialist brand for that need, not everything. This is also literally what the name says: *Original* Brands — authentic specialists, not a random assortment.

**Structural implication:** organize the homepage (and eventually nav) around **occasions, not a flat brand grid** — e.g. "Move & Train" (Sweaty Betty, Odlo), "Outdoor & On Duty" (Hi-Tec, Magnum, Mechanix, RH+), "Everyday Comfort" (Holster, FitFlop, Juicy Couture, Löwenweiss). Each section gets its own consistent photography mood instead of one grid trying to hold all of them at once — the eclecticism becomes the point ("we've done the research across categories") rather than the problem.

**Tone:** confident and trustworthy, still deal-friendly for the price-conscious Benelux shopper (don't drop discounting entirely), but framed as "smart pick," not clearance-outlet.

**First mockup round (2026-07-14) was rejected on execution, not the idea.** The structure (occasion sections, hero staging all three) landed; the *aesthetic* didn't — it read as "an obviously Claude-made artifact" rather than a real fashion-ecommerce homepage for this specific client. Corrections that matter for any future mockup:
- **White background, not an off-white/stone "paper" tone.** Beige/cream neutrals are exactly the kind of thing that makes AI-generated design instantly recognizable as such — for a real client site, use their actual palette, not an invented neutral.
- **Use the brand's *actual* extracted colors, not invented ones close to them.** Pulled Original Brands' real computed styles via `getComputedStyle` in Chrome DevTools MCP: primary blue is `rgb(143,171,179)` / `#8FABB3` (topbar, help blocks), accent red is `rgb(245,64,45)` / `#F5402D` (matches the flower logomark), ink is `rgb(49,55,50)` / `#313732`. Don't reinvent an adjacent "refined" version of a client's brand color — sample the live site and use the exact value.
- **Use the real logo SVG** (fetched from the live site, embedded inline, not rebuilt from scratch) — a client wants to recognize their own brand mark, not a new one.
- **One typeface family, not three.** The original draft paired a display sans + serif italic + monospace, which read as "editorial tech-demo," not "fashion store." A single system sans stack at varying weights reads as standard ecommerce.
- **No italics for body/subtitle copy** — reads as literary/editorial, not commercial.
- **Every brand needs a real photo, even when the mockup-stage source photo is mediocre or missing** — don't invent a "text-only chip" fallback as an actual design concept; source *something* (own site's other pages, brand's official site, a quick reverse/stock search) so the grid stays uniform. A brand without a photo yet is a content-gap to flag, not a permanent layout variant.
- **A homepage needs real product/bestseller sections**, not just brand-lifestyle storytelling — standard ecommerce homes lead with actual SKUs (image, price, sale badge) in at least one or two sections.
- **Watch the overall tonal balance of which brands lead**, not just structure — Original Brands' mix skews outdoor/tactical (Magnum, Mechanix, Hi-Tec) as much as fashion/comfort (Sweaty Betty, FitFlop, Juicy Couture); if the outdoor imagery dominates the hero/first impression, the whole site reads as "adventure gear," not "fashion." Order fashion-forward brands first.
- **A multi-image hero can be a real interactive carousel** (auto-advance + arrows + dots, all real photos from the brand) instead of a static 3-image collage — more scalable (works for 8+ brands, not capped at 3) and closer to standard ecommerce hero patterns.
- Real assets (product photos, logo) were pulled directly from the live site via `curl` (network access works from Bash in this environment) and embedded as base64 data URIs — the Artifact tool's CSP blocks hotlinked remote `<img src>` at render time, so external images must be inlined, never linked.

**Category-first navigation (suggested by Melissa, marketing analysis 2026-08-10 — not yet approved/reviewed by Carita) — already aligned with the mockup, confirmed independently.** Melissa benchmarked Omoda and Etrias/Only Brands, both of which index their assortment by product category (Schoenen, Mode/lifestyle, Sport, Outdoor/workwear) rather than by brand — customers search "sandalen"/"sneakers", not brand names, and category terms carry more SEO weight. Checked against `mockup/index.html`'s actual nav (`Dames / Heren / Kinderen → Sport & Training / Outdoor & Werk → Schoenen / Kleding / Accessoires → Merken → Solden`, `mockup/index.html:540-552`): this is already category/occasion-led with a single dedicated "Merken" brand-hub link, not per-brand top-nav links. No decision needed here — Melissa's recommendation and the shipped mockup already agree.

**Red as the dominant CTA color — a real decision to make, not a conflict (raised by Melissa, marketing analysis 2026-08-10 — not yet discussed with Carita).** Melissa's competitor analysis independently converges on the same "white background, real extracted brand colors, no invented neutral" direction already locked in above (2026-07-14 corrections), but goes further: questions whether red should stay OB's dominant *action* color, or get rescaled to a smaller accent role, given red's clearance/urgency connotation. Checked against `mockup/index.html`'s actual color tokens (`mockup/index.html:11-49`): red (`--color-secondary`, `#f7391e`) currently drives every CTA button (`--color-cta-bg`), the promo banner's full background, the logo's accent stroke, the "Solden" nav link, and sale-price text — it's the site's primary interactive color in practice, despite being named "secondary" in the tokens. Blue (`--color-primary`, `#8fabb3`) is scoped to smaller utility roles (top bar, icon accents, active-nav underline). So this isn't a wording nitpick — "red as accent only" would mean recoloring every button, the promo banner, and the logo mark. Worth a deliberate yes/no from Carita, not an assumed default either way.

## Next up (as of 2026-08-11)

In rough priority order:

1. **`pdp-size-picker-order` — recommended next; visible defect, nothing blocking it.** Seen live 2026-08-11: the PDP renders its size options in raw Akeneo order (`35 36 37 40 39 42 38 41`) and uses the raw key `shoe_size_eu` as the heading, while `color: Grey` beside it renders correctly. Unlike the facet — which Shopify sorts for us (D6) — nothing sorts the PDP picker, so this is where SB's letter-size logic plus a numeric-EU branch actually earns its place. Cover `[tops_size]`/`[bottoms_size]` too, not just `[shoe_size_eu]`.
2. **Waiting on Nick:** `NICK.md` holds the open data items (Black Grey mis-tagged, brown hexcode, English display labels, and #5 — the `activities` list/placeholder question that blocks item 4). The DRAFT-metaobject item is **withdrawn** — it was a Shopify platform default, not a sync defect; it lives in MIGRATION-TO-LIVE.md now.
3. **Port next from the reuse ledger** — remaining "Reuse as-is" rows: `plp-filter-panel-chrome` and `plp-mobile-filter-bar` (natural pair now that the collection page is on the vertical layout, and the mobile drawer is still stock Dawn), then `plp-grid-config` (incl. load-more instead of numbered pagination), `plp-loading-feedback`, `plp-scroll-clamp`, `plp-sort-options`, `predictive-search-overlay`, `cart-drawer-line-item-layout`, `wishlist-integration`. **Done:** `plp-size-facet-grid` (archived 2026-08-11).
4. **`pdp-feature-icons`** — **blocked on Nick, not ready** (re-checked against the live dev data 2026-08-11; the earlier "data confirmed ready" note was wrong). The entry shape is as expected (`code`/`label`/`image_asset`, same as `filtercolors`) and the DRAFT status is fixed, but two things block the spec: `custom.activities` is a **single** `metaobject_reference`, not a `list.` like SB's `custom.icons` — so a product can hold exactly one activity — and all 7 products currently point at the same value (`lifestyle`), with `running` unreferenced. Until Nick confirms whether it should be a list and whether the values are real, the capability's core shape (one icon vs. a scrolling row of many) is undecided. See `NICK.md` #5.
5. **Launch = a store-to-store migration, not a theme publish** (Nick's setup, confirmed 2026-08-11). There are **two separate Shopify shops**: this dev shop, which never goes public under the real domain, and a separate live shop created at launch. So nothing here is customer-facing and no theme push on this store needs treating as a release — work on whichever theme is convenient (the swatch/facet work is on Dawn `148245381229` as of 2026-08-11).

   **The trap to plan for:** a theme copy carries *only* the theme — not the metaobject/metafield definitions, entry ACTIVE status, or Search & Discovery filter config this build depends on. Tracked as a running checklist in **[MIGRATION-TO-LIVE.md](MIGRATION-TO-LIVE.md)**; append to it whenever you find a new shop-side dependency, rather than reconstructing the list at launch.
6. **Still gated on the client:** homepage (mockup approval + red-vs-blue CTA), reviews, newsletter popup/promo bar. See Open questions.

## Brand roster

Apparel + footwear, sale-heavy merchandising (visible strikethrough pricing, "Solden" nav item), birthday-field newsletter popup. Carries Sweaty Betty itself as one of its brands, alongside FitFlop, Odlo, Juicy Couture, Mechanix, Holster Australië, RH+, others.

## Open questions before scoping for real

1. Akeneo attribute set — does it mirror SB's schema (`[color]`, `[bottoms_size]` style keys), or is Original Brands' Akeneo instance/catalog structured differently? Don't assume; check the actual export.
2. Redirect/URL-consolidation strategy for legacy per-variant product pages (the current Drupal-ish site gives each color/size combo its own URL) — same class of problem SB solved, but the URL scheme differs (Drupal-ish slugs, not Magento `.html`).
3. Brand identity scope, per client note: likely just a logo + maybe a primary color — confirm before any `header-animated-logo`-style bespoke work is considered (and per the ledger above, probably don't build that here either).
4. **Discount amount for newsletter signup** (raised by Melissa, marketing analysis 2026-08-10) — fixed € amount or %? Not yet decided.
5. **Popup trigger/timing** (raised by Melissa) — immediate on entry, exit-intent, or after a scroll/time threshold? Needs deciding alongside the newsletter-popup capability above, and must stay clear of the cookie-consent banner (Frontend Feature Audit skip-it list).
6. **Rebrand scope** (raised by Melissa) — if red gets rescaled from primary to accent, is that limited to color, or does it extend to logo/typography too? Blocks the "Red-as-primary-color question" above.
7. **Future brand roster growth** (raised by Melissa) — does OB expect to onboard more fashion-forward brands over time, and if so, does that pull the look & feel further toward Omoda's "premium fashion" pole rather than Etrias's "neutral multi-category" pole?
