## 1. Shared logic (`assets/ob-wishlist.js`)

- [x] 1.1 Shared product cache (`window.obWishlistProduct`) and a helper that returns the size a colour pick must switch to (none when the colour offers the chosen size)
- [x] 1.2 Mark size options the chosen colour lacks as disabled on every wishlist card, re-run on WK's re-renders, never the selected option
- [x] 1.3 Cross-sell: a colour change to a colour without the chosen size also selects its start size
- [x] 1.4 Hand WK a size it doesn't list yet through a stand-in input (`window.obWishlistChangeOption`): WK lists only the saved colour's sizes, and setting a missing value deselects the select
- [x] 1.5 The label overlay's placeholder detection skips missing-size options

## 2. Standalone page (`assets/ob-wishlist-page-rails.js`)

- [x] 2.1 Size grid keeps marked sizes as disabled chips; product fetch goes through the shared cache
- [x] 2.2 A colour chip replaces a size the colour lacks with its start size (queued like any chip change, stand-in input when the size isn't listed)
- [x] 2.3 Rebuild the size grid when WK's size list changes, once no chip change is pending

## 3. Verify and ship

- [x] 3.1 Push to DEV (no storefront check: DEV's catalog has no colour with a partial size set, and its wishlist is separate)
- [x] 3.2 Pre-live, Hi-Tec Blackout Mid Wp Jr. Cross-sell with real keyboard selection: Black/38 → Asphalt/28 → Beige keeps 28 → Black moves to the remembered 34 (new variant id, photo, enabled add-to-cart each time). `/apps/wishlist` chips: Black/37 → Asphalt shows a single 28 chip → Black restores Black's chips → 36 resolves Black/36.
