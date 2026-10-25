## Why

Marketing has to be able to start a campaign (Black Friday, a "2+1" action, a brand week) without a developer. The discount itself is a Shopify discount, but the storefront currently has no way to show that a product is part of one, no scheduled promo message, and no "add €X for free shipping" cue in the cart. The team's discount policy (2026-10-25) defines what goes where: price reductions from ERP/Akeneo keep the existing sale label; campaigns run as Shopify discounts plus a badge and a promo bar; customer-restricted codes (newsletter, staff) get no badge.

## What Changes

- New campaign badge on every product surface (shared product card, PDP gallery). Its source is a **campaign collection**: a collection whose handle starts with `actie-` and that carries a badge text in a collection metafield. The Shopify discount targets the same collection, so badge and discount share one product list. Optional start/end metafields bound the badge in time; a priority metafield settles products in several campaigns. The run time is checked against the shopper's clock as well as at render time, so a cached page cannot keep showing an ended campaign.
- Dawn's announcement bar gains a per-message campaign link: a message pointing at a campaign collection shows only inside that campaign's run time. Marketing adds a second announcement-bar section (its own colour scheme) above the trust bar as the promo bar. A bar with no message currently in its run time renders nothing.
- Free-shipping progress message in the cart drawer and on `/cart`, driven by a theme setting (threshold in euros, optional country list). Off when the threshold is blank. Re-rendered by Dawn's existing cart section updates.
- The existing sale label (compare-at from ERP/Akeneo) is unchanged.

## Capabilities

### New Capabilities
- `campaign-badges`: which products show a campaign badge, where the badge text and run time come from, the precedence rule when a product is in several campaigns, and how the badge relates to the sale and bestseller badges.
- `cart-free-shipping-progress`: when the free-shipping progress message renders in the cart drawer and on the cart page, what it computes against, and that it follows cart changes without a reload.

### Modified Capabilities
- `header-announcement-bar`: messages can be scheduled by linking them to a campaign collection; a bar with no message in its run time renders nothing; the per-breakpoint visibility rules count only messages currently in their run time.

## Impact

- Snippets: new `ob-campaign-badge.liquid`, new `ob-free-shipping-progress.liquid`; `card-product.liquid` (badge stack in the card media), `main-product.liquid` (gallery badge stack), `announcement-bar.liquid` (schedule setting + gating), `cart-drawer.liquid`, `main-cart-footer.liquid`.
- Assets: new `ob-campaign-window.js` (client-side run-time check for badges and promo messages); CSS in `component-ob-swatches.css`, `component-ob-pdp.css`, `component-ob-announcement-bar.css`, cart CSS.
- `config/settings_schema.json` (cart: threshold + countries), `locales/*.json`.
- Shop-side (dev now, live at migration): four collection metafield definitions (`custom.campaign_badge`, `custom.campaign_starts_at`, `custom.campaign_ends_at`, `custom.campaign_priority`); the BE/NL free-shipping rate; test campaign `actie-test` + its automatic discount; WELCOME27 retargeted to non-reduced products via a new `volle-prijs` collection.
- New marketing doc `CAMPAIGNS.md` (Dutch): the "start a campaign" checklist, since the theme cannot verify that badge, discount and threshold agree.
