# Mixed-Shops Playbook — Original Brands (Only Brands killed)

**Status:** Only Brands is killed (confirmed 2026-08-10) — Original Brands is now the sole active project this doc serves. Original Brands has its own repo as of 2026-08-10 (`C:\Users\rezni\SHOPIFY\OriginalBrands`, Dawn theme scaffolded, connected to `original-brands-dev.myshopify.com`); this doc stays at its root as the architecture/decision reference, no longer a not-a-spec brainstorm doc. SB work remains paused. Same stack as SB: Shopify + Akeneo.

The Only Brands content below (live-site audit, per-shop notes, some open questions) is kept as **historical context, not an active workstream** — it documents comparative reasoning that shaped several Original Brands decisions (e.g. the Brand/Gender facet gap, several "take it / skip it" frontend calls). Don't scope new Only Brands work off it.

Sites: [originalbrands.nl](https://www.originalbrands.nl/) · ~~[onlybrands.nl](https://www.onlybrands.nl/)~~ (killed)

## Confirmed facts (from live-site audit, 2026-07-14)

- **Both current sites are migrations, not "existing Shopify to copy."** Original Brands runs a custom Drupal-ish CMS (`itr_theme`, `photohost.be` image CDN); Only Brands runs Magento (`/customer/account/login`, `/checkout/cart`, classic layered-nav filters). Same situation SB was in vs. WooCommerce: content/UX parity target, not code to port. Expect the same per-variant-URL → single-Shopify-product consolidation + redirect-mapping work SB needed.
- **Not marketplaces** — single-operator, multi-brand retailers. Product structure matches SB: 1 item + color/size variants. Confirmed directly on an Original Brands PDP (color links + size dropdown, one SKU per color/size combo).
- **Brand is a first-class dimension on both**, but expressed differently: Original Brands exposes it as a real PLP facet ("Merk", with counts) *and* top-nav brand links; Only Brands expresses it mostly as URL/category structure (`/fitflop.html`, `/teva.html`, brand landing pages) rather than a checkbox facet within a mixed listing. Either way: Dawn's stock `vendor` field is the natural home for it — unlike SB, where it sat unused and got repurposed for "material."
- **Facet set is a superset of SB's shipped facets.** Original Brands PLP: Merk / Geslacht / Kleur / Maat / Materiaal / Prijs, all open-by-default accordions (same UX pattern SB already ships). Only Brands (Magento layer nav): Category-type / Gender / Schoenmaat (EU shoe sizing) / Materiaal / Kleur, all with counts.
  - **Gap vs. SB today: no Brand facet, no Gender facet.** Everything else (color, size, material, price) SB already has a working pattern for.
- **Card pattern on both** = swatch/color links + inline size availability + sale-% badge — functionally what `plp-card-swatches` / `plp-size-facet-grid` already do.
- **Both already show a wishlist icon in the header** on their current sites — the Wishlist King header/PDP/cart-drawer integration (`wishlist-integration` spec) is a straight port, not new discovery work.
- **Only Brands adds a Trustpilot review carousel** on-site (homepage + likely PDP) — genuinely new, SB has no reviews capability yet (explicitly out of scope for SB's Milestone 1).
- Both have standard trust-badge / newsletter-signup patterns (delivery cutoff, return window, discount-on-signup) — content parity items, not architecture.

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

**Insurance regardless:** have Akeneo emit stable keys as metafields from day one — `model_code` on the product, `color_code` + `size_code` on the variant. Costs nothing now, turns a future color-level split from archaeology into a data migration.

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
| `plp-color-filter` + `plp-card-swatches` | **Reuse as-is** | Color-family merge, swatch chips, hover-pair swap — matches both sites' card pattern |
| `plp-size-facet-grid` | **Reuse, adapt** | Box-grid pattern holds; Only Brands' EU shoe sizing (36–46) needs its own ordering, not SB's XS–XXL/bra-size logic |
| `plp-filter-panel-chrome` | **Reuse as-is** | Open-by-default accordions, "Shop by ..." labels — both target sites already use open-by-default accordions natively |
| `plp-mobile-filter-bar` | **Reuse as-is** | Nothing brand-specific in the mechanism |
| `plp-grid-config`, `plp-loading-feedback`, `plp-scroll-clamp`, `plp-sort-options` | **Reuse as-is** | Pure UX/perf plumbing, no brand coupling |
| `pdp-color-swatches` | **Reuse as-is** | Same variant-swatch-via-metaobject approach applies |
| `pdp-feature-icons` | **Reuse, verify data** | Depends on whether Akeneo feeds for these catalogs carry an equivalent icon/attribute metaobject — confirm before assuming |
| `predictive-search-overlay` | **Reuse as-is** | Generic search UX |
| `cart-drawer-line-item-layout` | **Reuse as-is** | Generic |
| `wishlist-integration` | **Reuse as-is** | Both sites already have wishlist icons today — validates this is wanted, not a guess |
| `header-animated-logo` | **Retire (SB-specific)** | Built to match sweatybetty.com's exact wordmark/monogram SVG — not applicable unless a brand asks for the same treatment |
| `link-underline-style`, `branded-dropdown-controls` | **Reuse pattern, not values** | The *mechanism* (sitewide override) is reusable; the actual style call is per-brand |
| Boost (archived) | **Retired, don't reopen** | Only real "didn't work" data point so far: native beat Boost by ~40–50% LCP for SB (`archive/NO-BOOST-TEST.md`) — treat native-first as the default starting point for both new shops too, skip re-litigating Boost vs. native from scratch |

**New capabilities to design (not covered by any SB spec):**
- **Brand facet** — checkbox/multi-select filter + vendor-driven PLP/PDP display. Straightforward Dawn `vendor` usage, no Akeneo bracket-key trick needed.
- **Gender facet** — likely another Akeneo attribute key, same pattern as size/color detection in `akeneo-option-handling`.
- **Reviews** (Only Brands, Trustpilot) — new; check whether Original Brands wants the same before building twice.

## Frontend feature audit — actual visual review (2026-07-14)

The reuse ledger above is about *architecture*. This is about *design/UX quality* — screenshotted homepage/PLP/PDP on both sites and judged each feature on its own merits: worth adopting, or skip as dated.

**✅ Take it — genuinely good, worth building:**
- **Inline Trustpilot widget on PDP** (Only Brands): TrustScore + review count sits cleanly in the buy-box flow, not floating over content. Much better than Original Brands' floating Kiyoh rating badge, which overlaps the gallery awkwardly.
- **Real product reviews with pros/cons** (Only Brands PDP): star rating up top near the title (immediate social proof above the fold), full reviews with "Pluspunten/Minpunten" + a structured submission form. This is the one capability neither SB nor the current ledger has at all — genuinely worth scoping in, not just a nice-to-have.
- **Per-brand fit-guide accordion** ("Hoe vallen FitFlop damesschoenen?") + short "Over [Brand]" blurb on PDP: real answer to a real multi-brand problem (sizing isn't consistent brand-to-brand) that SB never needed as a single-brand store. Worth a generic `sb-brand-fit-guide`-style snippet, Akeneo/metaobject-driven per brand.
- **Structured specifications table** (Only Brands PDP: Merk/Model/Kleur/Materiaal/Voering/Zool/Technologie/Pasvorm as clean label:value rows): a good complement to marketing copy once Akeneo attribute sets are richer than SB's, surfaces attributes a shopper actually filters/decides on.
- **Brand watermark on the PDP gallery image** (Original Brands: small brand logo tag overlaid on the product photo): cheap, clear brand attribution in a multi-brand catalog — SB never needed this (single brand) but it matters here.
- **Circular brand-shortcut row + clean logo trust bar on homepage** (Only Brands): "shop by brand" as photo circles right under the hero, plus a minimal black-and-white logo strip further down — both communicate "curated multi-brand" at a glance, better than Original Brands' plain text nav for the same job.
- **Homepage "Aanbevolen voor u" carousel with a real CTA per card** (Only Brands): clean, well-spaced, works. Reasonable homepage personalization pattern to keep.
- Size box-grid picker on PDP (Only Brands, 36–43 as boxes) — already matches what SB built for PLP (`plp-size-facet-grid`); validates extending the same box-grid pattern to PDP everywhere, not just PLP.

**❌ Skip it — dated or actively bad UX, don't replicate:**
- **Stacked/simultaneous popups** (Original Brands PDP and PLP): cookie-consent banner *and* a birthday-newsletter modal both fire at once, overlapping each other and the product gallery/thumbnails. Don't replicate the "interrupt immediately on load" pattern — if a newsletter popup ships at all, it should be delayed/exit-intent and never stack with the cookie banner.
- **Floating rating badge overlapping content** (Original Brands): the Kiyoh trust badge floats mid-page over the gallery — same trust signal Only Brands does far better inline. Use the inline pattern, not this one.
- **Wall-of-SEO-text below the PLP grid** (Original Brands: one long unbroken paragraph block "Sweaty Betty: Dé keuze voor actieve vrouwen..."): keep the *intent* (organic-search copy) but not the execution — Only Brands' footer version (short, per-brand columns) reads far better than one undifferentiated wall of text.
- **Numbered pagination ("Pagina 1 van 7")** (Original Brands PLP): SB already tested and deliberately dropped numbered pagination for load-more (`plp-grid-config` spec, 2026-07-05) — don't regress on this for the new shops either.
- **Broken/unstyled "recently viewed" widget** (Only Brands homepage): a product row with tiny unstyled icon-sized images and no card treatment — reads as neglected, not a design choice to carry forward. Also spotted a stray unstyled debug string ("29.00000 4.00000 dames heren") bleeding into the page footer on both the Only Brands homepage and PDP — a live bug, not a pattern.
- **Plain `<select>` size dropdown on PDP** (Original Brands, for the one PDP checked): worse than SB's existing button-based size picker and worse than Only Brands' own box-grid — no reason to regress to a dropdown.
- **No size-chart / fit-guide link near the size selector** (Original Brands): SB's `sb-size-chart` "Maattabel" dialog is already a better answer to the exact same question — carry that forward as-is.

## Homepage redesign direction — Original Brands (approved 2026-07-14)

Original Brands' current homepage is a generic "SOLDEN tot 40% korting" clearance banner + a 3×3 brand-tile grid with wildly inconsistent photography (a Magnum tactical-boot close-up next to a Sweaty Betty yoga shot next to a Juicy Couture street-style photo, all behind an identical gray CTA button) — it reads as "logos we happen to sell," not a considered destination. The problem is real: the brand mix (Sweaty Betty, Odlo, Magnum, Mechanix, Hi-Tec, Holster Australië, Juicy Couture, RH+, Löwenweiss, FitFlop) doesn't share one lifestyle aesthetic, so forcing them into one flat grid/mood is what breaks visual coherence.

**Positioning: "The right specialist for the job — not a wall of logos."** Original Brands isn't a lifestyle boutique; it's an expert curator — for every part of a customer's life (training, outdoors/work, everyday comfort) it stocks the one trusted specialist brand for that need, not everything. This is also literally what the name says: *Original* Brands — authentic specialists, not a random assortment.

**Structural implication:** organize the homepage (and eventually nav) around **occasions, not a flat brand grid** — e.g. "Move & Train" (Sweaty Betty, Odlo), "Outdoor & On Duty" (Hi-Tec, Magnum, Mechanix, RH+), "Everyday Comfort" (Holster, FitFlop, Juicy Couture, Löwenweiss). Each section gets its own consistent photography mood instead of one grid trying to hold all of them at once — the eclecticism becomes the point ("we've done the research across categories") rather than the problem.

**Tone:** confident and trustworthy, still deal-friendly for the price-conscious Benelux shopper (don't drop discounting entirely), but framed as "smart pick," not clearance-outlet.

(Was also planned to apply, adapted, to Only Brands' homepage — moot now that Only Brands is killed; left here only as the original comparative note.)

**First mockup round (2026-07-14) was rejected on execution, not the idea.** The structure (occasion sections, hero staging all three) landed; the *aesthetic* didn't — it read as "an obviously Claude-made artifact" rather than a real fashion-ecommerce homepage for this specific client. Corrections that matter for any future Original Brands mockup:
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

## Per-shop notes

**Original Brands** — apparel + footwear, sale-heavy merchandising (visible strikethrough pricing, "Solden" nav item), birthday-field newsletter popup. Carries Sweaty Betty itself as one of its brands, alongside FitFlop, Odlo, Juicy Couture, Mechanix, Holster Australië, RH+, others.

**Only Brands (killed)** — footwear-only (FitFlop, Teva, Xsensible, Timberland, Sorel, Moon Boot, Birkenstock), Magento layer-nav filters were richer (11 shoe-type values, 11 shoe sizes, 11 material values, ~15+ color values with counts) — kept as a reference point for how far SB's facet UI patterns can stress-test to a wider attribute set, since Original Brands' own facet set may still grow toward that.

## Open questions before scoping Original Brands for real

1. Akeneo attribute set — does it mirror SB's schema (`[color]`, `[bottoms_size]` style keys), or is Original Brands' Akeneo instance/catalog structured differently? Don't assume; check the actual export.
2. Redirect/URL-consolidation strategy for legacy per-variant product pages (the current Drupal-ish site gives each color/size combo its own URL) — same class of problem SB solved, but the URL scheme differs (Drupal-ish slugs, not Magento `.html`).
3. Brand identity scope, per client note: likely just a logo + maybe a primary color for Original Brands — confirm before any `header-animated-logo`-style bespoke work is considered (and per the ledger above, probably don't build that here either).
4. ~~Whether reviews (Trustpilot) become a shared spec across both shops~~ — moot, Only Brands is killed; if Original Brands wants reviews, scope it standalone.
