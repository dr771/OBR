## MODIFIED Requirements

### Requirement: Favorites page
A page using the theme's favorites template (`/pages/favorieten`) SHALL list every wishlist entry as a product card, newest first, in a responsive multi-column grid. Each card SHALL be rendered by the theme from the product's own current data and SHALL show the entry's variant: its photo, a photo badge, vendor, title linking to the product page for that variant, price (with the compare-at price struck through when reduced), the colour options as image chips and the size options as a box grid in storefront size order, an add-to-cart button and a remove control. Option names SHALL never show raw Akeneo keys.

Adding a card to the cart SHALL be a move-to-cart, as in the cart cross-sell: the card's variant is added to the Shopify cart, the cart drawer refreshes and opens, and the entry leaves the wishlist (the card disappears from the page). If the cart rejects the add, the entry SHALL stay and the card SHALL become usable again.

Changing colour or size SHALL update the card's photo, price, badge, link and add-to-cart immediately, without a server request, and SHALL save the new variant to the entry. When the shopper clicks several options quickly, the last click SHALL be the one the card shows and saves. A product that no longer exists or is no longer published SHALL be dropped from the list without an error. While the entries are loading the page SHALL show placeholders; with no entries it SHALL show an empty state that links back into the shop.

#### Scenario: Several sizes clicked quickly
- **WHEN** a shopper clicks sizes 37, 38 and 36 within a second
- **THEN** the 36 box is selected, the card's price, badge and add-to-cart are those of 36, and the saved entry is 36

#### Scenario: Deleted product
- **WHEN** an entry's product has been deleted or unpublished
- **THEN** the page renders the other entries and the deleted one disappears from the list

#### Scenario: Empty wishlist
- **WHEN** the list is empty
- **THEN** the page shows the empty-state message and a link into the shop, and no grid

#### Scenario: Old wishlist URL
- **WHEN** a shopper opens `/apps/wishlist`, the former Wishlist King page
- **THEN** the shop redirects to `/pages/favorieten`

#### Scenario: Add to cart from the favorites page
- **WHEN** a shopper clicks a card's add-to-cart button on the favorites page
- **THEN** the variant is added to the cart, the cart drawer opens with the new line, and the card is gone from the favorites page and from the drawer's wishlist rows
