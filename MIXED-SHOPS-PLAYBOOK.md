# Original Brands — Playbook

Shopify + Akeneo migration for Original Brands (originalbrands.nl), multi-brand apparel + footwear retailer replacing a custom Drupal-ish CMS. Repo: `C:\Users\rezni\SHOPIFY\OriginalBrands` — Dawn theme, connected to `original-brands-dev.myshopify.com`. Reuse source: SweatyBetty (`C:\Users\rezni\SHOPIFY\SweatyBetty`), same stack, further along — check the reuse ledger below before re-deriving architecture.

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

### Still open (to work through one by one)

2. **Image filename convention** — the whole per-color gallery + card-swatch mechanism depends on Akeneo delivering `{sha1}_{product_code}_{color_code}__{shot}` filenames (`sb-media-color-code.liquid`). Does that hold for *all* OB brands? Biggest single reuse risk.
3. **Option-key sprawl across ~30 brands** — SB has a fixed, known set of Akeneo bracket keys (`[color]`, `[bottoms_size]`); a multi-brand catalog likely does not.
4. **Footwear specifics** — widths, half sizes, and a much larger color vocabulary than `sb-color-family`'s current map.

## Reuse ledger (SB's shipped `openspec/specs/`)

| Capability (spec) | Verdict | Note |
|---|---|---|
| `akeneo-option-handling` | **Reuse as-is** | Bracket-key detection (`[color]`, `[size]`) is Akeneo-universal, not SB-specific |
| `plp-color-filter` + `plp-card-swatches` | **Reuse as-is** | Color-family merge, swatch chips, hover-pair swap — matches this site's card pattern |
| `plp-size-facet-grid` | **Reuse, adapt** | Box-grid pattern holds; footwear brands (FitFlop, Hi-Tec, Magnum, etc.) need EU shoe-size ordering (36–46), not SB's XS–XXL/bra-size logic |
| `plp-filter-panel-chrome` | **Reuse as-is** | Open-by-default accordions, "Shop by ..." labels — matches the site's native pattern |
| `plp-mobile-filter-bar` | **Reuse as-is** | Nothing brand-specific in the mechanism |
| `plp-grid-config`, `plp-loading-feedback`, `plp-scroll-clamp`, `plp-sort-options` | **Reuse as-is** | Pure UX/perf plumbing, no brand coupling |
| `pdp-color-swatches` | **Reuse as-is** | Same variant-swatch-via-metaobject approach applies |
| `pdp-feature-icons` | **Reuse, verify data** | Depends on whether the Akeneo feed carries an equivalent icon/attribute metaobject — confirm before assuming |
| `predictive-search-overlay` | **Reuse as-is** | Generic search UX |
| `cart-drawer-line-item-layout` | **Reuse as-is** | Generic |
| `wishlist-integration` | **Reuse as-is** | Site already has a wishlist icon today — validates this is wanted, not a guess |
| `header-animated-logo` | **Retire (SB-specific)** | Built to match sweatybetty.com's exact wordmark/monogram SVG — not applicable unless a brand asks for the same treatment |
| `link-underline-style`, `branded-dropdown-controls` | **Reuse pattern, not values** | The *mechanism* (sitewide override) is reusable; the actual style call is per-brand |
| Boost (archived) | **Retired, don't reopen** | Only real "didn't work" data point so far: native beat Boost by ~40–50% LCP for SB (`archive/NO-BOOST-TEST.md`) — treat native-first as the default starting point here too, skip re-litigating Boost vs. native from scratch |

**New capabilities to design (not covered by any SB spec):**
- **Brand facet** — checkbox/multi-select filter + vendor-driven PLP/PDP display. Straightforward Dawn `vendor` usage, no Akeneo bracket-key trick needed.
- **Gender facet** — likely another Akeneo attribute key, same pattern as size/color detection in `akeneo-option-handling`.
- **Reviews** (Trustpilot-style) — new capability, not covered by any SB spec; see Frontend Feature Audit below for the UX shape worth building.

## Frontend feature audit — design/UX judgment calls (2026-07-14)

The reuse ledger above is about *architecture*. This is about *design/UX quality* from a visual review of the current site — worth adopting, or skip as dated.

**✅ Take it — genuinely good, worth building:**
- **Inline Trustpilot-style widget on PDP:** TrustScore + review count sits cleanly in the buy-box flow, not floating over content — replaces the site's current floating Kiyoh rating badge, which overlaps the gallery awkwardly.
- **Real product reviews with pros/cons:** star rating up top near the title (immediate social proof above the fold), full reviews with "Pluspunten/Minpunten" + a structured submission form. A capability neither SB nor the current ledger has at all — genuinely worth scoping in, not just a nice-to-have.
- **Per-brand fit-guide accordion** ("Hoe vallen FitFlop damesschoenen?") + short "Over [Brand]" blurb on PDP: real answer to a real multi-brand problem (sizing isn't consistent brand-to-brand) that SB never needed as a single-brand store. Worth a generic `sb-brand-fit-guide`-style snippet, Akeneo/metaobject-driven per brand.
- **Structured specifications table** (Merk/Model/Kleur/Materiaal/Voering/Zool/Technologie/Pasvorm as clean label:value rows): a good complement to marketing copy once Akeneo attribute sets are richer than SB's, surfaces attributes a shopper actually filters/decides on.
- **Brand watermark on the PDP gallery image**: small brand logo tag overlaid on the product photo — cheap, clear brand attribution in a multi-brand catalog. SB never needed this (single brand) but it matters here.
- **Circular brand-shortcut row + clean logo trust bar on homepage:** "shop by brand" as photo circles right under the hero, plus a minimal black-and-white logo strip further down — communicates "curated multi-brand" at a glance, better than a plain text nav for the same job.
- **Homepage "Aanbevolen voor u" carousel with a real CTA per card:** clean, well-spaced homepage personalization pattern worth keeping.
- **Size box-grid picker on PDP** (boxes, not a dropdown) — extends the same box-grid pattern SB built for PLP (`plp-size-facet-grid`) to PDP too.

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

## Brand roster

Apparel + footwear, sale-heavy merchandising (visible strikethrough pricing, "Solden" nav item), birthday-field newsletter popup. Carries Sweaty Betty itself as one of its brands, alongside FitFlop, Odlo, Juicy Couture, Mechanix, Holster Australië, RH+, others.

## Open questions before scoping for real

1. Akeneo attribute set — does it mirror SB's schema (`[color]`, `[bottoms_size]` style keys), or is Original Brands' Akeneo instance/catalog structured differently? Don't assume; check the actual export.
2. Redirect/URL-consolidation strategy for legacy per-variant product pages (the current Drupal-ish site gives each color/size combo its own URL) — same class of problem SB solved, but the URL scheme differs (Drupal-ish slugs, not Magento `.html`).
3. Brand identity scope, per client note: likely just a logo + maybe a primary color — confirm before any `header-animated-logo`-style bespoke work is considered (and per the ledger above, probably don't build that here either).
