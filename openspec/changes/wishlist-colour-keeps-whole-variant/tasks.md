## 1. Shared logic (`assets/ob-wishlist.js`)

- [ ] 1.1 Shared product cache (`window.obWishlistProduct`) and a helper that returns the size a colour pick must switch to (none when the colour offers the chosen size)
- [ ] 1.2 Mark size options the chosen colour lacks as disabled on every wishlist card, re-run on WK's re-renders, never the selected option
- [ ] 1.3 Cross-sell: a colour change to a colour without the chosen size also selects its start size

## 2. Standalone page (`assets/ob-wishlist-page-rails.js`)

- [ ] 2.1 Size grid keeps marked sizes as disabled chips; product fetch goes through the shared cache
- [ ] 2.2 A colour chip replaces a size the colour lacks with its start size (queued like any chip change)

## 3. Verify and ship

- [ ] 3.1 Push to DEV and check nothing regresses on a product whose colours share all sizes
- [ ] 3.2 Commit, push to pre-live, verify on Hi-Tec Blackout Mid Wp Jr: Beige from 37 lands on Beige/28 with photo and price; sizes Black lacks are disabled; same on `/apps/wishlist` chips
