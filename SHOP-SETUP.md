# Shop setup the theme depends on

What lives in the live shop (`original-brands-live.myshopify.com`, ID `109574717777`, www.originalbrands.nl) rather than in this repo, and breaks the theme **silently** when it is missing or changed. Nothing travels with a theme push except theme code. When a feature you build depends on something set in the Admin, add a line here when you set it.

DEV (`original-brands-dev.myshopify.com`) has its own, older copy of most of this and is not kept in sync. **DEV holds ~8.9k real, subscribed customer addresses from the Drupal import: never send a campaign or switch on a marketing automation there.**

## Metafield and metaobject definitions

**Akeneo connector's schema** (Nick's; don't create, rename or delete these yourself):

| Definition | Notes |
|---|---|
| Variant `custom.filtercolors`, `custom.colorid`, `custom.sizeid` | storefront `PUBLIC_READ`; colour filter, swatches, media matching |
| Product `custom.itemid`, `custom.genderid`, `custom.activities` (`list.metaobject_reference`), `custom.bestseller`, `custom.materials_maintenance` | `genderid` and `activities` need *Use as a condition in collections* |
| Product `akeneo.shopify_originalbrands_cate__1` | the category (Dutch labels). *Use as a condition in collections* and storefront `PUBLIC_READ` were switched on by us (Nick's OK, 2026-11-06). Recheck both after a connector schema change |
| Product `akeneo.available_erp_sizes` | Maat filter. Storefront `NONE` is fine: Search & Discovery doesn't read through Liquid |
| Metaobjects `filtercolors`, `activities` | `PUBLIC_READ`, display name `label_nl`, `publishable` capability **off** (POST-SYNC-CHECK.md §2, §3) |

**Ours** (Collection definitions the theme reads; all fail open, so a missing one looks fine and is wrong):

| Definition | Read by |
|---|---|
| `custom.breadcrumb_rank` (integer, `PUBLIC_READ`) | PDP breadcrumb fallback and related products; bands in COLLECTIONS.md |
| `custom.brand_tagline` (single line) | homepage featured brands and Merken tiles. Storefront `NONE` is deliberate: Liquid reads any defined metafield |
| `custom.bottom_description` (rich text "Collectie ondertekst", `PUBLIC_READ`) | `ob-collection-bottom-description` below the grid. Source copy in `content/collections/` |
| `custom.campaign_badge`, `campaign_starts_at`, `campaign_ends_at`, `campaign_priority` | campaign badges and the promo bar schedule (DISCOUNTS.md) |

## Search & Discovery

- **Filters, in this order:** Gender (`custom.genderid`, manual value list), Maat (`akeneo.available_erp_sizes`, OR, manual order: numeric incl. ranges, W-sizes, letters, OneSize, kids 104–164), Kleur (`filtercolors`, OR, label `label_nl`, swatch from `image_asset`), Activities (OR, label `label_nl`, *Include visual* off), Merk (vendor), Category (`cate__1`), Producttype, Beschikbaarheid (Availability, last).
- **The Availability filter must exist.** Collection pages force `filter.v.availability=1` only while it does, and the theme hides it from the panel (`plp-hide-sold-out`). Without it, sold-out products come back with no error. Theme setting *Hide sold-out products* is the off switch.
- Settings: filter values with no results **hidden** (otherwise size grid and colour chips render a different, denser list); out-of-stock products in search **Not at all**; search also covers pages and blog posts.
- Multiple colours in Kleur needs two settings: theme setting *Color filter selection* = `Multiple colors`, and Kleur logic = OR in the app.

## Theme settings and templates

Changed in the theme editor only; `config/settings_data.json` is protected (CLAUDE.md, Hard Rules).

- Typography: headings Fraunces, body Inter.
- Cart → *Free-shipping progress*: `70`, countries `BE,NL,LU`. Must match the shipping rate; the theme can't read rates.
- *Hide sold-out products* on; *Color filter selection* `Multiple colors`; *PLP color control style* as approved; footer `brand_image` = the logo.
- Merchant-editable templates: *Show vendor* on in every product grid (`collection`, `search`, `index`, `product` JSON), otherwise cards have no brand line. `show_secondary_image` is set per grid template. PDP USP blocks: never "30 dagen gratis retour" (returns cost €5.95).
- Header: desktop menu type *Dropdown*. Promo bar `announcement_bar_WRGrTQ` is hidden and still holds the three expired demo messages; replace them before showing it (PROMOBAR.md).

## Navigation, pages, redirects

- `main-menu` must keep its handle and nesting: it is breadcrumb data and drives the collection hero pills. Each parent's first child is its "Alle …" self-link. Structure in COLLECTIONS.md.
- Footer menus `footer-klantenservice`, `footer-over-ons`, `footer-handige-links` are wired by handle in `sections/footer-group.json`.
- Pages `merken` (template `page.merken`) and `favorieten` (template `page.favorieten`); redirect `/apps/wishlist` → `/pages/favorieten`. Content pages use the `ob-content` classes (CI-STYLE-TOKENS.md).
- Blog `inspiratie` and the 3,180 legacy redirects: SEO-REDIRECTS.md.

## Shipping, checkout, accounts

- Market **België & Nederland** (BE, NL, LU): *Standard* €5.95 below €70, free from €70, 1–4 business days, set in Markets → Shipping. It overrides the general delivery profile, and `deliveryProfiles` doesn't show it (GOTCHAS.md). A market country with no rate makes every product read as sold out.
- The PDP/cart tax caption shows only for country DE (PAngV). Check it once when a DE market goes live.
- Checkout editor: accent `#0D80C4`, order summary `#F1F5F9` (the API needs Plus).
- New customer accounts: imported Drupal customers sign in with an emailed code.
- Domain at Combell: apex `A 23.227.38.65`, `www CNAME shops.myshopify.com`, **www is primary**. Mail stays Microsoft 365 (MX, SPF, DMARC `p=quarantine`); Shopify's DKIM CNAMEs are in place. Registration expires 06/01/2027.

## Apps and tracking

- Shopify Forms newsletter popup (WELCOME27) with its theme app embed on; styled by `assets/ob-newsletter-popup.js`.
- Messaging: abandoned cart and welcome-new-subscribers active. Check it before any customer import.
- The theme publishes wishlist events on the customer-events bus (`wishlist-integration`), but nothing stores them until a GA4 custom pixel forwards them. Team browsers opt out with `?ob_notrack=1`.
- The Trusted Shops badge is still the theme snippet `ob-trustbadge` (display only: no review invites).

## Open after launch

- [ ] **Trusted Shops app:** install, connect the existing account (TSID `XEF6A9A6375D0B95B950D0A48C758ABA3`), set its shop URL to `www.originalbrands.nl`, then remove `{% render 'ob-trustbadge' %}` from `layout/theme.liquid`. Keep the placement `floating-trust-and-scroll-top` specifies.
- [ ] **Search Console 404 report** (`sc-domain:originalbrands.nl`): check around 2026-12-08 and 2026-12-22, add a redirect for every old URL with traffic.
- [ ] **Brand pages** (asked the OB team 2026-11-24): Briko has products but no collection (old URLs → `/search?q=briko`); Sneaker Lab is linked from home, Merken and the menu with 0 products; Hi-Tec and Magnum have none (old URLs → `/pages/merken`). On their answer: create the collection, update `BRANDS` in `scripts/build-redirects.js`, edit the existing redirects in Admin.
- [ ] **Remove connector apps** no longer needed (Shopify CLI Connector App, ChatGPT MCP App); keep the Claude connector while agents work on the shop.
- [ ] **Only on request:** GA4 property + custom pixel for the wishlist events; the relaunch greeting mail to customers tagged `drupal-import` (neutral salutation, expect bounces).

## Open with Nick

Shop-owner and Akeneo items, state 2026-11-24.

- [ ] **Payments test mode off.** Every order up to #1024 was a test transaction; only Nick's account sees the switch. iDEAL is "not eligible" for the Belgian account, so NL shoppers have cards, Bancontact and wallets.
- [ ] **Location address** is "Maasstraat" without a house number.
- [ ] **Gender in Dutch:** live still has `Women` and `Mannen`. After his re-sync to `Dames`/`Heren`: drop `Women`/`Men`/`Mannen` from `dames`, `heren`, `fitflop-dames`, `fitflop-heren`, update the S&D Gender value list and the mapping in `snippets/ob-facet-value-label.liquid`.
- [ ] **Category typo `Handsschoenen`**: `handschoenen`, `accessoires` and `kleding` match both spellings until it's fixed.
- [ ] **Five Odlo socks typed `Shoe`**: `schoenen` keeps them out with *title does not contain Socks*.
- [x] **Connector sets `inventoryItem.tracked: true` at variant creation:** Nick implemented it 2026-11-13; 0 untracked variants on active products on 2026-11-24. Keep the POST-SYNC-CHECK.md §5 count anyway.
- [x] **Connector `productUpdate` after metafield writes:** Nick said on 2026-10-26 the connector has no option for it and suggested Shopify Flow. Not to be asked again; ours to solve (Flow or the re-save in POST-SYNC-CHECK.md §1).
- [ ] **Photos whose colour code differs from the SKU's** (the PDP falls back to Dawn's gallery): `holster-solace` (NATM, SAM), `holster-coastal` (SI), `lowenweiss-trama-bicolor-slipper` (552-41, 903-988, 955-903), `hi-tec-fuse-trail-mid-wp-womens` (042), `sweaty-betty-power-6-inch-biker-shorts` (1001).
- [ ] Activity `work` has `label_nl` = `work` (should be `Werk`).
