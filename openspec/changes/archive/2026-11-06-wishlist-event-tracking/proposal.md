## Why

The owner wants to know later how shoppers use the wishlist (what they save, from where, and whether it turns into sales) without losing data in the meantime. Pre-live has no GA4 or other analytics destination yet, and Shopify's own reports cannot store custom events. So the theme should emit the events now and record the one fact Shopify can keep by itself: that a cart line came from the wishlist.

## What Changes

- The wishlist publishes analytics events on Shopify's customer-events bus (`Shopify.analytics.publish`): `add_to_wishlist`, `remove_from_wishlist`, `wishlist_variant_change`, `wishlist_add_to_cart`, `wishlist_view`, each with product, variant, price, source and list size. A custom pixel can forward them once a destination exists (GA4 at launch, a shop-side step).
- No events from the theme editor, unpublished-theme previews or browsers opted out with `?ob_notrack=1` (team browsers).
- Cart lines added from the favorites page or the cart cross-sell carry a hidden line-item property `_wishlist` with the place the entry was saved from, so orders show which sales came through the wishlist, inside Shopify, without any analytics tool.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wishlist-integration`: adds the analytics events and the `_wishlist` cart-line property.

## Impact

- `assets/ob-wishlist-store.js` (event helper, opt-out, sources, entry origin), `assets/ob-wishlist-items.js` (events, cart property), `snippets/ob-wishlist-item.liquid` (product id/title, numeric price and SKU in the variant JSON).
- Shop-side (MIGRATION-TO-LIVE.md): GA4 property and a custom pixel that forwards the events; until then nothing is stored. No consent change: Shopify only delivers events to pixels the shopper's consent allows.
- A product added from the wishlist and also from the PDP shows as two cart lines (different properties). Accepted.
