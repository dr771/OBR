# Migration to the live shop — checklist

**Context.** Per Nick's Akeneo setup there are **two separate Shopify shops**: this dev shop (`original-brands-dev.myshopify.com`, never public under the real domain) and a live shop stood up at launch. Launch is therefore a **store-to-store migration**, not a theme publish.

**How to use this file.** Append to it *as things are discovered*, not at launch. Whenever work here depends on something that lives in the shop rather than in this repo — an app config, a metafield definition, a metaobject entry, an admin setting — add a line. The point is that nothing is reconstructed from memory under launch pressure.

Status legend: `[ ]` todo · `[x]` done · `[~]` in progress/partially known

---

## 1. Catalog data — Nick / Akeneo

- [ ] Point the Akeneo sync at the live shop and run a full product push (products, variants, media, metafields).
- [ ] **Metaobject entries must be `ACTIVE`, not `DRAFT` — check every type, not just colours.** DRAFT entries are invisible to the storefront, which silently removes the *entire* colour filter and empties the PDP icon row, while still looking perfect in the admin. This bit us on dev twice: `filtercolors` and then `activities` (see playbook D3 / `NICK.md` #1). **Cause is a Shopify default, not the sync:** a definition with the `publishable` capability enabled creates new API-made entries as DRAFT unless the request sets `status: ACTIVE`. So a fresh live shop is exposed to it again regardless of who runs the sync — check it on the live shop even though it's "already fixed" on dev. Verify after the first sync, per type:
  ```graphql
  { metaobjects(type: "filtercolors", first: 50) { edges { node {
    handle capabilities { publishable { status } } } } } }
  ```
- [ ] Confirm the outstanding `NICK.md` data fixes landed on live (colour tagging, hexcodes, Dutch labels) rather than only on dev.

## 2. Custom data definitions

These do **not** travel with a theme export, and bare auto-created metafields are not enough.

- [ ] **Metafield definitions** exist with `access.storefront: PUBLIC_READ` — without it Liquid cannot read the value at all, so swatches and filters break silently: `custom.filtercolors`, `custom.colorid`, `custom.sizeid`, `custom.itemid`, `custom.genderid`, `custom.activities`, `custom.shopify_originalbrands_category`, `akeneo.available_erp_sizes`.
- [ ] **Enable “Use as a condition in collections” on the matching live Product metafield definitions.** On dev, verified 2026-08-21 via `useAsCollectionCondition` in Admin GraphQL: `custom.shopify_originalbrands_category`, `custom.activities`, `custom.bestseller`, and `custom.genderid` are ON; all current Product Variant definitions are OFF. This smart-collection-condition capability is stored on each definition rather than in theme code or metafield values. Without it, the corresponding automatic collection rules cannot be created on live.
- [ ] **Metaobject definitions** `filtercolors` and `activities` exist with `access.storefront: PUBLIC_READ`.
- [ ] `filtercolors` metaobject **display name is the `label` field** (Dutch), not `code` — otherwise the storefront filter lists "brown"/"black" instead of "bruin"/"zwart" (`NICK.md` #4).
- [ ] Metaobject **GIDs will differ** on the live shop — this is fine, the theme resolves by key name and hardcodes no GIDs (verified 2026-08-11). Nothing to do; noted so nobody "fixes" it.

## 3. Apps & admin config

- [ ] **Recreate the category-first `Main menu` and its collection targets.** On dev, the menu has eight top-level links, in this exact order: Sport & Training, Outdoor & Werk, Dagelijks Comfort, Schoenen, Kleding, Accessoires, Merken, Solden. **Merken** points to the published Shopify page `/pages/merken`, which uses `templates/page.merken.json` to show only the current vendor smart collections (each has a `Vendor equals …` rule); create that page, the equivalent smart collections, and set its template suffix to `merken` after the live catalog sync. Navigation and collections are shop data, so neither travels with a theme push.
- [ ] **Recreate the three special automatic collections from `Collections.md`.** `Sport & Training`, `Outdoor & Werk`, and `Dagelijks Comfort` each use an OR rule set over Product `custom.activities` and `custom.shopify_originalbrands_category`; recreate their approved mapping after the live catalog sync, using the live metafield and metaobject IDs rather than dev IDs. Publish each collection to Online Store.
- [ ] **Recreate the automatic gender collections from `Collections.md`.** `Dames` uses `custom.genderid = Women OR Unisex`; `Heren` uses `Men OR Unisex`; and `Kinderen` uses `Unisex`. They are not currently in the Main menu, but remain collection targets for merchandising and direct links.
- [ ] **Search & Discovery filters recreated by hand** — these are app config, *not* part of any Akeneo sync, and will not exist on a fresh shop. Currently on dev: **Kleur** (`filtercolors`, variant metafield), **Maat** (`akeneo.available_erp_sizes`, product metafield), **Merk** (`vendor`), **Gender** (`custom.genderid`, product metafield), **Producttype**, **Prijs**. Match labels and order.
- [ ] **Set "filter values with no results" to hidden** in Search & Discovery, matching dev (set by the owner 2026-08-11). Not cosmetic: with it shown, every facet gains greyed-out zero-count values, so the size grid and colour chips render a different, denser list than anything verified on dev. The theme is correct either way — this is about the live shop matching what was signed off.
- [ ] **Recreate the three footer navigation menus and their 6 placeholder pages.** On dev: `footer-klantenservice` (Contact, Verzending & retour, Maattabellen, Veelgestelde vragen), `footer-over-ons` (Ons verhaal, Onze merken, Duurzaamheid, Werken bij), `footer-handige-links` (Mijn account → `/account`, Bestelling volgen → `/account`, Outlet → `/collections/solden`). Six of those pages (`verzending-en-retour`, `maattabellen`, `veelgestelde-vragen`, `ons-verhaal`, `duurzaamheid`, `werken-bij`) are placeholder content created 2026-08-24 pending real copy — `Contact` and `merken` already existed. `sections/footer-group.json` wires the 3 menus into the footer's `link_list` blocks by handle, so the live shop's menu handles must match exactly or those columns render empty.
- [ ] **Set the footer's `brand_image` theme setting** (Theme settings → Brand information) to the live shop's own logo file — it does not travel with a theme push (protected `settings_data.json`). On dev this reuses the same file as the header logo (`settings.logo`). "Cadeaubonnen" (gift cards) was deliberately left out of the footer's `Handige links` column — add it once gift cards are actually wanted, don't treat its absence as an oversight.
- [ ] Any other apps installed on dev are installed and configured on live.
- [ ] **Wishlist King (Swish) app embeds must be enabled in the live shop's theme editor.** The app and all 5 Swish embeds were enabled and live-verified on dev on 2026-08-12 (`wishlist_mode: PRODUCT`), but embed block IDs/config are shop-generated and do not migrate reliably with this repo. Repeat the Theme editor → App embeds setup on the separate live shop; without it, the fail-open theme code leaves the header badge/PDP toggle/cart cross-sell in their pre-boot/empty states.
- [ ] **Set Swish → Wishlist Page → Page width to `1600px` in the live theme editor.** Dev was corrected from Swish's `1200px` value to `1600px` on 2026-08-25 so `/apps/wishlist` shares the PLP/theme container width. This is an app-embed setting stored in protected theme state, not theme CSS or the global Dawn page-width control.
- [ ] **A shipping zone must exist that covers the shop's actual configured Market(s).** Discovered 2026-08-11 while testing `cart-drawer-line-item-layout`: dev launched with Shopify's default "Domestic" zone (US only) while the only configured Market is "EU" (BE/NL/DE/FR/LU) — no zone covered any country a real buyer could select, so **every shippable product on the entire storefront read as sold out** (`available: false`, `/cart/add.js` 422), regardless of stock or inventory settings. Fixed on dev by adding a real "EU" zone with a flat rate to the default delivery profile. Check this on the live shop explicitly — it's a Shopify default a fresh shop can silently start with again, and it looks identical to a data/stock problem until you check Settings → Shipping and delivery. See project memory `ob-dev-store-nothing-addable-to-cart` for the diagnosis and the exact `deliveryProfileUpdate` gotcha if it needs redoing via API (`locationGroupsToUpdate`, not `profileLocationGroups`).

## 4. Theme

- [ ] `git clone` this repo and push the theme code to the live shop. `.shopifyignore` deliberately excludes `config/settings_data.json`; migrate settings separately after backing up and diffing the target theme's live file.
- [ ] Push code with `--only <files>` if pushing onto an existing configured theme. The settings file is independently blocked by `.shopifyignore`; pull/diff merchant-editable JSON templates immediately before intentionally pushing any of them.
- [ ] In Theme settings → Product cards, set **PLP color control style** to the final approved presentation. The schema default is `Color swatches`; `Image chips` restores the previous rendering. This merchant choice lives in protected `settings_data.json` and does not follow an ordinary theme-code push.
- [ ] In Theme settings → Typography, set **Headings to Fraunces** and **Body to Inter**, matching the dev shop's confirmed global type system. These merchant settings populate Dawn's `--font-heading-family` / `--font-body-family` variables and are excluded from ordinary theme pushes with protected `settings_data.json`.
- [ ] In Theme settings, confirm **Color filter selection**. The schema default is `One color`; `Multiple colors` restores the previous checkbox behavior. This is independent of Search & Discovery's OR/AND operator and persists in protected `settings_data.json`.
- [ ] **Confirm "Show vendor" is enabled on every product-grid section** (`templates/collection.json`, `search.json`, `index.json`, `product.json`). The PLP card's brand label — the line above the product name, per `plp-card-meta` — is deliberately gated by that per-section setting so merchants keep control, which means a live shop with it off renders cards with no brand at all. It lives in merchant-editable JSON templates, not in protected `settings_data.json`, so it can differ per surface.
- [ ] Re-run the swatch/facet verification on live: PLP chips + tooltips + hover swap, PDP chips, colour filter chips render real hex, filtering swaps card images. **Check the hover swap on every grid, not just the collection/PLP page** — homepage, PDP related-products, and search results each have their own `show_secondary_image` setting per template (`templates/index.json`, `product.json`, `search.json`), and it's easy for that per-template value to end up different on the live shop than on dev. Per `plp-card-swatches` (fixed 2026-08-12), the color-matched second shot now wins either way, but it's worth eyeballing all four surfaces once live since that per-section setting is exactly what caused the divergence originally.

- [ ] **Create the `custom.bestseller` product metafield definition** (boolean, owner Product, storefront access **public read**). The PDP bestseller badge — both the gallery-frame pill and the one beside the price, per `pdp-product-badges` — reads only this field and renders nothing when it is absent, so on a shop without the definition no product can ever show the badge and nothing visibly errors. Created on dev 2026-08-21; definitions do not travel with the theme. Then set it on whichever products should carry the badge.
- [ ] **Configure the two PDP trust statements** (`usp` blocks on the `main-product` section, per `pdp-usp-strip`). Dev ships `Gratis levering vanaf € 70 in BE & NL` (truck icon) and `Voor 12u besteld, volgende werkdag geleverd` (clock icon), both taken verbatim from originalbrands.nl's own USP bar. They live in the merchant-editable `templates/product.json`, not in protected `settings_data.json`, so confirm them on the live shop. **Do not reintroduce the proto's "30 dagen gratis retour"** — the published returns policy withholds €5.95 in return costs, so that claim is false.

- [ ] **Confirm the `label_nl` field exists on the live `filtercolors` and `activities` definitions and actually renders on the live storefront.** Type `single_line_text_field`; the Akeneo sync writes the Dutch text into it (Nick switched the mapping 2026-08-31) and `snippets/ob-facet-value-label.liquid` reads it. Without it the facets fall back to Shopify's filter-index label, i.e. English colour and activity names on a Dutch storefront. **Verify by looking at the rendered storefront, never at the Admin API** — the API happily returns the correct value for a field the storefront cannot read. If the facets render English: the field has been orphaned in Shopify's storefront index by a connector definition rewrite (symptom: Liquid returns the entry's *handle*; empty would mean the field is missing entirely). Fix is to delete the field, re-create it and re-write all values — instant, no reindex; exact mutations in NICK.md item 4. Expect to need this after the first live sync, and after any later Akeneo mapping change.
- [ ] **Map the Search & Discovery filters to the `label` field, not `code`.** Both **Kleur** (`filtercolors`) and **Activities** were mapped to `code` on dev, which is what put English text in the facets in the first place. Set via *Search & Discovery → the filter → Manage values → Label*. Note this alone does **not** fix the storefront (the storefront filter index kept serving the old text indefinitely, and could not be forced to re-derive) — it is the theme snippet above that actually renders the Dutch label. Do both anyway, so the app's own Values screen and any native filter agree with the storefront.
- [ ] **Decide how the Categorie filter is sourced.** On dev it is built on Shopify's standard taxonomy `category`, which the sync populates on only 1 of 26 products, so the facet shows a single value. The real data (9 values) is in the `custom.shopify_originalbrands_category` metafield. Either have the sync fill the taxonomy field or repoint the filter at the metafield — see NICK.md item 6.

- [ ] **Create the `custom.breadcrumb_rank` collection metafield definition and set its values.** Integer, owner **Collection**, storefront access **public read**. Per `pdp-breadcrumb`, when a product sits in several collections the PDP breadcrumb picks the lowest rank; unset sorts last. This is what stops the breadcrumb naming the broadest collection on every product — on dev, `Dagelijks Comfort` (18 of 26 products) won every trail before this existed, because Liquid's `product.collections` order is neither documented nor configurable. Created on dev 2026-08-26 with this banding, which is merchant data and re-editable in Admin without a deploy:
  - **10** — product-type: `schoenen`, `kleding`, `accessoires`
  - **20** — occasion: `dagelijks-comfort`, `sport-training`, `outdoor-werk`
  - **30** — audience: `dames`, `heren`, `kinderen`
  - **40** — brand: `fitflop`, `hi-tec`, `holster`, `irasuto-studios`, `juicy-couture`, `loewenweiss`, `nike-swim`, `odlo`, `pas-de-monaco`, `sneaker-lab`, `sweaty-betty`
  - **left unset deliberately** — `solden`, `merken`, `frontpage`, so a sale or landing collection never captions a trail.

  Without the definition nothing errors: every collection reads as unset and the breadcrumb silently degrades to Shopify's arbitrary order, i.e. the original bug.

## 5. URLs & SEO

- [ ] **Later phase — redirect map from the legacy Drupal-ish site.** Important before launch, but deliberately deferred until the catalog and destination URLs are mature. The old site gives each colour/size combo its own URL, which consolidate into one Shopify product; this needs a strategy, not just a file.
- [ ] Canonical/domain settings, sitemap, robots.

## 6. Go-live

- [ ] Remove the storefront password on the live shop.
- [ ] Domain pointed at the live shop.
- [ ] Analytics / consent banner / newsletter wired up.

---

## Known to be non-transferable (summary)

The recurring theme: **a theme copy carries only the theme.** Everything below lives in the shop and must be recreated or re-synced:

| Thing | Travels with theme? | Who |
|---|---|---|
| Liquid, CSS, JS, spec docs | ✅ (git) | us |
| Products, variants, media, metafield *values* | ❌ | Nick / Akeneo |
| Metafield & metaobject *definitions* (+ storefront access) | ❌ | Nick / Akeneo |
| Metaobject entry ACTIVE/DRAFT status | ❌ | Nick / Akeneo |
| Search & Discovery filter config | ❌ | by hand in admin |
| Shipping zones/rates | ❌ | by hand in admin |
| Theme settings (`settings_data.json`) | ⚠️ only if pushed | us |
