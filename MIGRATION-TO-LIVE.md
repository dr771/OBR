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
- [ ] **Metaobject definitions** `filtercolors` and `activities` exist with `access.storefront: PUBLIC_READ`.
- [ ] `filtercolors` metaobject **display name is the `label` field** (Dutch), not `code` — otherwise the storefront filter lists "brown"/"black" instead of "bruin"/"zwart" (`NICK.md` #4).
- [ ] Metaobject **GIDs will differ** on the live shop — this is fine, the theme resolves by key name and hardcodes no GIDs (verified 2026-08-11). Nothing to do; noted so nobody "fixes" it.

## 3. Apps & admin config

- [ ] **Search & Discovery filters recreated by hand** — these are app config, *not* part of any Akeneo sync, and will not exist on a fresh shop. Currently on dev: **Kleur** (`filtercolors`, variant metafield), **Maat** (`akeneo.available_erp_sizes`, product metafield), **Merk** (`vendor`), **Gender** (`custom.genderid`, product metafield), **Producttype**, **Prijs**. Match labels and order.
- [ ] **Set "filter values with no results" to hidden** in Search & Discovery, matching dev (set by the owner 2026-08-11). Not cosmetic: with it shown, every facet gains greyed-out zero-count values, so the size grid and colour chips render a different, denser list than anything verified on dev. The theme is correct either way — this is about the live shop matching what was signed off.
- [ ] Any other apps installed on dev are installed and configured on live.
- [ ] **Wishlist King (Swish) app embeds must be enabled in the live shop's theme editor.** The app and all 5 Swish embeds were enabled and live-verified on dev on 2026-08-12 (`wishlist_mode: PRODUCT`), but embed block IDs/config are shop-generated and do not migrate reliably with this repo. Repeat the Theme editor → App embeds setup on the separate live shop; without it, the fail-open theme code leaves the header badge/PDP toggle/cart cross-sell in their pre-boot/empty states.
- [ ] **A shipping zone must exist that covers the shop's actual configured Market(s).** Discovered 2026-08-11 while testing `cart-drawer-line-item-layout`: dev launched with Shopify's default "Domestic" zone (US only) while the only configured Market is "EU" (BE/NL/DE/FR/LU) — no zone covered any country a real buyer could select, so **every shippable product on the entire storefront read as sold out** (`available: false`, `/cart/add.js` 422), regardless of stock or inventory settings. Fixed on dev by adding a real "EU" zone with a flat rate to the default delivery profile. Check this on the live shop explicitly — it's a Shopify default a fresh shop can silently start with again, and it looks identical to a data/stock problem until you check Settings → Shipping and delivery. See project memory `ob-dev-store-nothing-addable-to-cart` for the diagnosis and the exact `deliveryProfileUpdate` gotcha if it needs redoing via API (`locationGroupsToUpdate`, not `profileLocationGroups`).

## 4. Theme

- [ ] `git clone` this repo and push the theme code to the live shop. `.shopifyignore` deliberately excludes `config/settings_data.json`; migrate settings separately after backing up and diffing the target theme's live file.
- [ ] Push code with `--only <files>` if pushing onto an existing configured theme. The settings file is independently blocked by `.shopifyignore`; pull/diff merchant-editable JSON templates immediately before intentionally pushing any of them.
- [ ] In Theme settings → Product cards, set **PLP color control style** to the final approved presentation. The schema default is `Color swatches`; `Image chips` restores the previous rendering. This merchant choice lives in protected `settings_data.json` and does not follow an ordinary theme-code push.
- [ ] In Theme settings → Typography, set **Headings to Fraunces** and **Body to Inter**, matching the dev shop's confirmed global type system. These merchant settings populate Dawn's `--font-heading-family` / `--font-body-family` variables and are excluded from ordinary theme pushes with protected `settings_data.json`.
- [ ] In Theme settings, confirm **Color filter selection**. The schema default is `One color`; `Multiple colors` restores the previous checkbox behavior. This is independent of Search & Discovery's OR/AND operator and persists in protected `settings_data.json`.
- [ ] **Confirm "Show vendor" is enabled on every product-grid section** (`templates/collection.json`, `search.json`, `index.json`, `product.json`). The PLP card's brand label — the line above the product name, per `plp-card-meta` — is deliberately gated by that per-section setting so merchants keep control, which means a live shop with it off renders cards with no brand at all. It lives in merchant-editable JSON templates, not in protected `settings_data.json`, so it can differ per surface.
- [ ] Re-run the swatch/facet verification on live: PLP chips + tooltips + hover swap, PDP chips, colour filter chips render real hex, filtering swaps card images. **Check the hover swap on every grid, not just the collection/PLP page** — homepage, PDP related-products, and search results each have their own `show_secondary_image` setting per template (`templates/index.json`, `product.json`, `search.json`), and it's easy for that per-template value to end up different on the live shop than on dev. Per `plp-card-swatches` (fixed 2026-08-12), the color-matched second shot now wins either way, but it's worth eyeballing all four surfaces once live since that per-section setting is exactly what caused the divergence originally.

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
