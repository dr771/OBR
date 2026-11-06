## 1. Events

- [ ] 1.1 `ob-wishlist-store.js`: `obWishlistTrack` (publish, opt-out, editor/preview guard), page source, entry `source`, events for card hearts and the PDP button
- [ ] 1.2 `ob-wishlist-item.liquid`: product id/title, numeric price, SKU and variant title in the JSON
- [ ] 1.3 `ob-wishlist-items.js`: `wishlist_view`, `wishlist_variant_change`, `remove_from_wishlist`, `wishlist_add_to_cart`

## 2. Cart property

- [ ] 2.1 `properties[_wishlist]` = entry source on wishlist cart adds; hidden in drawer, cart page and checkout

## 3. Ship

- [ ] 3.1 DEV: verify events (subscribed in the console) and opt-out; cart line carries `_wishlist`, not shown
- [ ] 3.2 Commit, pre-live push and check; MIGRATION-TO-LIVE.md (GA4 + pixel), STATUS-LOG.md
