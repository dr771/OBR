## Context

The discount policy (2026-10-25) splits promotions in two: price reductions arrive from ERP/Akeneo as compare-at prices and are already covered by the sale label (`ob-sale-label`, `plp-sale-badges`, `pdp-product-badges`); campaigns (Black Friday, "2+1", brand weeks) run as Shopify discounts. Shopify discounts are invisible to Liquid before the cart: a product page cannot ask "which automatic discount applies to me". Liquid also cannot read shipping-rate conditions or a free-shipping discount's minimum.

Measured on dev (2026-10-25): 58 collections in the shop; a product belongs to 6–9 of them. The EU shipping zone (BE/NL/DE/FR/LU) had a flat EUR 4.95 rate and no free threshold although the storefront promises free delivery from EUR 70 in BE & NL.

The bestseller badge (`ob-product-badge`) sits absolutely at the top-left of the card media; the sale badge sits in Dawn's `.card__badge` at the bottom-left; on the PDP both stack in `.ob-pdp__gallery-badges`.

## Goals / Non-Goals

**Goals:**
- Marketing starts and ends a campaign entirely in Admin (collection, metafields, discount, theme editor) — no deployment.
- One product list for badge and discount: the campaign collection.
- Run times hold even on cached pages.
- Free-shipping progress in drawer and `/cart`, switchable off.

**Non-Goals:**
- Showing the discounted price on cards/PDP before the cart (Shopify only computes automatic discounts in the cart/checkout).
- Verifying that a discount actually targets the badge's collection — impossible from Liquid; covered by the `CAMPAIGNS.md` checklist.
- Changing the sale label or its Solden collection.
- A countdown timer, a popup, or any overlay.

## Decisions

**D1 — Campaign = collection with handle prefix `actie-` + `custom.campaign_badge` text.** The prefix is a string test on data already loaded with `product.collections`, so non-campaign collections never trigger a metafield read. Alternative "badge metafield set = campaign" is more forgiving (nothing to forget in the handle) but reads a metafield on every collection of every card. `promo-` was considered and rejected: "promo" already names the promo bar, and a `promo-*` collection reads as "the collection that drives the bar". The prefix lives in one place (`ob-campaign-badge.liquid`).

**D2 — Metafields on the collection, not a metaobject.** `custom.campaign_badge` (single line text), `custom.campaign_starts_at` / `custom.campaign_ends_at` (date_time), `custom.campaign_priority` (integer). They sit on the collection page in Admin with native date pickers, next to the product list the discount also targets. A `campaign` metaobject referencing a collection would add a second place to keep in sync for no extra capability.

**D3 — Render server-side, re-check client-side.** Liquid collects the product's campaign collections that have not ended at render time, sorts them by precedence (priority desc, end asc with open-ended last, handle asc — encoded as one sortable string key), and renders each as a badge element carrying `data-ob-window-start` / `data-ob-window-end` (unix seconds). The first one inside its run time at render time is visible, the rest `hidden`. `assets/ob-campaign-window.js` repeats the same choice against `Date.now()`: per `[data-ob-campaign-badges]` group, show the first in-window child, hide the others. It runs on load and on inserted nodes (a `MutationObserver` on `document.body`), because Dawn replaces grids on facet changes, load-more appends, and recommendations/search insert cards asynchronously. Rendering future-start candidates is what lets a page cached before the start show the badge on time.

Alternative "Liquid only": rejected — Shopify serves cached storefront HTML, so a `now` comparison is only as fresh as the cache entry. Alternative "JS only (render all hidden)": rejected — badges would pop in after load and be missing without JS.

**D4b — Sale wins over campaign.** Owner decision 2026-10-25: Solden is excluded from campaigns and no card or PDP shows two percentage badges. Campaign collections exclude reduced products by their own conditions (`CAMPAIGNS.md`); the theme adds a CSS-only guard (`:has()` on the visible sale badge) that hides the campaign badge, so it follows Dawn's in-card colour switch and the PDP variant switch without JS. Alternative "hide in Liquid" rejected: the sale badge toggles client-side per colour/variant.

**D4 — Card badge stack.** The bestseller badge and the campaign badge share one absolutely positioned top-left container in `.card__media` (flex column), so they stack instead of overlapping. The sale badge stays in `.card__badge`. On the PDP the campaign badge joins `.ob-pdp__gallery-badges`. Visual values go to CI-STYLE-TOKENS.md.

**D5 — Promo bar = a second instance of Dawn's announcement-bar section.** No new section type. Each announcement block gets a `campaign` collection setting; the block borrows that collection's start/end. Theme settings have no date type, and borrowing the dates keeps one time source per campaign. The section filters blocks that have ended at render time, renders not-yet-started ones `hidden` with their window, and an inline script directly after the markup applies the client-side check **before** Dawn's deferred `slideshow-component` initialises — Dawn's slider counts only slides with a width, so hidden slides drop out of paging and autoplay. When ≤1 message remains the controls are hidden; when none remain the whole section is hidden. The script is inline (not the deferred shared asset) precisely because it has to run before the slider initialises.

**D6 — Free-shipping progress: theme settings + Dawn's section re-rendering.** Settings `ob_free_shipping_threshold` (number, euros; blank = off) and `ob_free_shipping_countries` (comma-separated ISO codes; blank = all) in the Cart settings group. The snippet `ob-free-shipping-progress` compares `cart.total_price` (after line and cart discounts, before shipping) with the threshold and checks `localization.country.iso_code`. It is rendered inside `.cart-drawer__footer` and inside main-cart-footer's subtotal `.js-contents` — both regions Dawn already re-renders on every cart change (`cart.js` updates `cart-drawer-items` + `.cart-drawer__footer`; `cart-drawer.js` replaces `#CartDrawer` on add-to-cart). No own JS.

The threshold is deliberately maintained twice (shipping rate condition in Admin + theme setting); `CAMPAIGNS.md` and MIGRATION-TO-LIVE.md say so.

**D7 — Shop-side setup on dev.** BE/NL split out of the EU zone into its own zone with EUR 4.95 below and EUR 0.00 from EUR 70; DE/FR/LU keep EUR 4.95. WELCOME27 retargeted from `all` to a new automated `volle-prijs` collection (*price reduced is not set*), unpublished from the storefront. Test campaign `actie-test` + a 15 % automatic discount on the same collection for verification, deactivated after review.

## Risks / Trade-offs

- [Marketing forgets the `actie-` prefix or the Online Store publication] → badge silently missing; `CAMPAIGNS.md` checklist, and a missing badge is the safe failure (never a badge without a discount from this cause).
- [Partly reduced product in a campaign collection] → its reduced sizes still get the campaign discount at checkout although the storefront shows only the sale badge for them. Accepted; avoided by building campaign collections on *compare-at price = 0*.
- [Badge without a matching discount, or different dates] → misleading claim. The theme cannot detect it → checklist step "same collection, same dates".
- [Shopper's clock is wrong] → badge may show/hide at the wrong moment client-side. Liquid's render-time filter still drops campaigns ended before the cached render, bounding the error.
- [Mixed products: some variants reduced, some not] → such a product can sit in both Solden and `volle-prijs`; a collection-targeted code then also discounts its reduced variants. Accepted for now (policy says "simple first"); listed in NICK.md-style follow-up in STATUS-LOG.
- [MutationObserver cost] → callback only scans added element subtrees for `[data-ob-campaign-badges]`; negligible next to Dawn's own grid swap.
- [`sections/header-group.json` is merchant-editable live state] → pull live and reconcile before any push; the promo-bar instance itself is added by marketing in the editor, not by a push.

## Migration Plan

Theme files ship with the normal `--only` push. Shop-side items (four metafield definitions, BE/NL zone + free rate, `volle-prijs` collection + WELCOME27 target, Online Store publication of each `actie-*` collection, the two theme settings) are listed in MIGRATION-TO-LIVE.md. Rollback: blank threshold disables the cart message; removing `custom.campaign_badge` or unpublishing a collection removes its badge; deleting the promo-bar section instance removes the bar.

## Open Questions

- Whether live Black Friday comes from the ERP (then it is a compare-at reduction and only the promo bar is used) or from a Shopify discount (then all three).
- Exact free-shipping countries for live (BE/NL assumed from current copy).
