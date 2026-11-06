## ADDED Requirements

### Requirement: Wishlist actions are published as analytics events
The wishlist SHALL publish an event on Shopify's customer-events bus for every shopper action on it: `add_to_wishlist` (a product saved), `remove_from_wishlist` (an entry removed), `wishlist_variant_change` (colour or size changed on an entry), `wishlist_add_to_cart` (an entry added to the cart from the favorites page or the cart cross-sell) and `wishlist_view` (the favorites page opened). Each product event SHALL carry the product handle, product id, variant id, SKU, product title, variant title, price as a decimal in the shop currency, the currency, the place the action happened (`source`) and the number of wishlist entries after the action (`list_size`); `wishlist_view` SHALL carry `list_size`. A card heart's source SHALL name the page the card was on (`plp`, `search`, `home`, `pdp_cards`, otherwise `other`), the PDP button's source SHALL be `pdp`, and actions on the wishlist surfaces SHALL use `favorites` or `cart`. Product fields that are not known at the time of the action MAY be null; the event SHALL still be published.

No event SHALL be published from the theme editor, from a preview of an unpublished theme, or from a browser opted out with `?ob_notrack=1` (until `?ob_notrack=0`). Publishing MUST never break or delay the wishlist action itself.

#### Scenario: Heart on a collection page
- **WHEN** a shopper hearts a product on a collection page
- **THEN** an `add_to_wishlist` event with source `plp`, the saved variant and the new list size is published

#### Scenario: Move to cart from the drawer
- **WHEN** a shopper adds a cross-sell row to the cart
- **THEN** a `wishlist_add_to_cart` event with source `cart` is published, followed by `remove_from_wishlist` with source `cart`

#### Scenario: Team browser
- **WHEN** a team member opened the shop once with `?ob_notrack=1` and later hearts a product
- **THEN** no event is published, and the product is still saved

#### Scenario: Theme editor
- **WHEN** a product is hearted inside the theme editor preview
- **THEN** no event is published

### Requirement: Cart lines from the wishlist record their origin
A cart line added from the favorites page or the cart cross-sell SHALL carry the line-item property `_wishlist` whose value is the place the entry was saved from (`plp`, `search`, `home`, `pdp_cards`, `pdp`, `other`, or `unknown` for an entry saved before origins were kept), so the resulting order shows the sale came through the wishlist. The property SHALL NOT be shown to the shopper in the cart drawer, on the cart page or in checkout.

#### Scenario: Entry saved from the PDP and bought from the favorites page
- **WHEN** a shopper saves a product with the PDP button and later adds it to the cart from the favorites page
- **THEN** the cart line carries `_wishlist: pdp`, and the drawer shows no such line
