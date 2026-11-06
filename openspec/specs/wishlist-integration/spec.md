# wishlist-integration Specification

## Purpose
Owns the theme's own wishlist on Original Brands (Wishlist King replaced 2026-11-06): the list kept in the shopper's browser as whole variants, the product-card hearts, the PDP button beside add-to-cart, the header heart with its count badge, the favorites page `/pages/favorieten`, and the cart drawer / `/cart` cross-sell with move-to-cart, plus the start-size and colour/size rules every wishlist surface shares.
## Requirements
### Requirement: Header wishlist heart with count badge
The header SHALL render a heart icon link in the icon row immediately before the cart icon, on all viewports, styled like Dawn's `header__icon` controls, with a localized accessible label. When the optional account icon is rendered, the heart SHALL follow it and remain before cart. The link SHALL lead to the favorites page (`/pages/favorieten`). A count badge (visually consistent with Dawn's cart bubble) SHALL show the number of wishlist entries, follow every change without a reload, and be hidden entirely at count 0 or while the count is unknown.

#### Scenario: Badge reflects wishlist count
- **WHEN** the wishlist contains 3 items
- **THEN** the header heart shows a badge with "3", and adding/removing an item updates the badge without a page reload

#### Scenario: Count unavailable
- **WHEN** the count cannot be read (browser storage unavailable)
- **THEN** the heart link still renders and navigates to the favorites page, with no badge shown

#### Scenario: Optional account icon is absent
- **WHEN** the customer-account icon is disabled
- **THEN** the heart remains immediately before the cart icon without an empty account-control gap

### Requirement: PDP wishlist button beside add-to-cart
The PDP buy-buttons block SHALL render a square heart toggle button beside the add-to-cart button, carrying the product handle. Clicking it when the product is not on the wishlist SHALL save the product with the variant currently selected on the PDP; clicking it when the product is on the wishlist SHALL remove it. The saved state is per product, not per variant, and SHALL derive from the wishlist itself, so it MUST survive Dawn's `product-info.js` re-render on variant change and follow changes made on other surfaces or tabs. If the wishlist is unavailable the button SHALL still render and a click SHALL do nothing.

#### Scenario: Add from PDP
- **WHEN** a shopper on a product page with Bright Pink M selected clicks the empty heart next to add-to-cart
- **THEN** the product is saved as Bright Pink M, the heart fills, and the header badge count increments

#### Scenario: Variant change re-render
- **WHEN** the shopper switches color/size after the heart was filled
- **THEN** the re-rendered heart still shows the saved state

#### Scenario: Remove from PDP
- **WHEN** the product is already in the wishlist and the shopper clicks the filled heart
- **THEN** the wishlist item is removed and the heart returns to the empty outline state

### Requirement: Cart drawer and cart page wishlist cross-sell
The cart drawer (filled and empty-cart states) and the `/cart` page SHALL render a wishlist cross-sell section: a localized title linking to the favorites page, a short heading, and one compact row per wishlist entry (photo with the photo badge, title, price, a dropdown per option with more than one value, an add-to-cart button and a remove control), visually matching the cart drawer's own line items. The section MUST hide itself entirely, title and heading included, while the wishlist is empty. The `/cart` page section SHALL be a standalone section wired into `templates/cart.json` (no edit to Dawn's `main-cart-items`).

Adding from a row SHALL add that row's variant to the Shopify cart, then refresh and open the full cart drawer (never a single-row patch) showing the new line item and totals, and remove the entry from the wishlist (move-to-cart). If the cart rejects the add, the entry SHALL stay on the wishlist and the row SHALL become usable again. The remove control SHALL remove the entry from the wishlist itself, not just from the drawer; removing the last entry hides the whole section.

The rows MUST keep working after the cart drawer replaces its own contents on a cart mutation, and the row layout MUST NOT widen past the drawer: option controls shrink and truncate instead. Theme cart code MUST NOT apply its own form-control validation to the row's option controls.

#### Scenario: Drawer cross-sell visible
- **WHEN** the cart drawer opens while the wishlist holds items
- **THEN** the cross-sell section renders at the bottom of the drawer body with compact rows styled like the rest of the OB cart drawer

#### Scenario: Empty wishlist
- **WHEN** the wishlist holds no items
- **THEN** no cross-sell section (including title/heading) is visible in the drawer or on `/cart`

#### Scenario: Move to cart from drawer
- **WHEN** the shopper clicks a row's add-to-cart button
- **THEN** the row's variant is added to the Shopify cart, removed from the wishlist, and the full cart drawer refreshes and opens showing the new line item and updated totals

#### Scenario: Item saved from a PLP card
- **WHEN** the drawer's cross-sell renders an item saved from a PLP card heart, whose product has a long colour name and many sizes
- **THEN** its dropdowns and buttons sit on one row inside the drawer's width with no horizontal overflow, and the row's add-to-cart is enabled for its saved variant

#### Scenario: Move to cart after a previous cart mutation
- **WHEN** the shopper moves one item to the cart, the drawer re-renders, and the shopper then works with a second row
- **THEN** that row's options and its own move-to-cart still work in the drawer without a page navigation

#### Scenario: Shopper clicks the cross-sell title
- **WHEN** a shopper clicks the "Uw wenslijst" / "Your favorites" title above the rows
- **THEN** the browser navigates to the favorites page

#### Scenario: Shopper removes a cross-sell item
- **WHEN** a shopper clicks a row's remove control
- **THEN** the row disappears from the drawer and the item is gone from the favorites page as well

#### Scenario: Removing the last cross-sell item
- **WHEN** a shopper removes the only remaining item via a row's remove control
- **THEN** the whole cross-sell section (including title/heading) hides itself

### Requirement: Wishlist entries start on a whole variant
Every wishlist entry SHALL name a whole variant. An entry created without a chosen size SHALL start on the colour the shopper saw with a start size chosen from that colour's available sizes (all of its sizes when none is available): the size the shopper last chose for the same size system (the raw size option key, e.g. `shoe_size_eu`, compared without brackets) when the colour offers it; otherwise, when every offered size is a letter size, the most recent letter size the shopper chose in another size system that the colour offers; otherwise the middle of the offered sizes in storefront size order (the PDP's order), the lower middle for an even count. Numeric sizes SHALL NOT carry across size systems. A product without a colour option SHALL use all its variants; one without a size option SHALL start on the colour's first available variant.

Only the shopper's own size choices SHALL count: a size picked on the PDP picker or the favorites page's size grid by a real user interaction, never a size the theme preselected. They SHALL be kept per browser only, and unavailable storage SHALL simply mean the middle-size fallback.

The PDP SHALL choose the size it opens on among the available sizes of the colour it opens with, keeping that colour and updating the selected variant as a shopper's pick would: (1) a variant linked from the cart or a wishlist SHALL stay unchanged; (2) otherwise a size the listing the shopper came from was filtered to, when offered; (3) otherwise the remembered size as above; (4) otherwise the middle available size in storefront order, not the first variant in source order. A size the PDP preselects SHALL NOT count as a shopper choice, and SHALL NOT move keyboard focus to the picker.

A product card's wishlist heart (collection, search and any other shared product-card surface) SHALL add the item this way, using the colour the card currently shows. A filled heart SHALL remove the product. If the product data cannot be loaded, the heart SHALL still save the product, and the entry SHALL get its start variant (colour as shown on the card when known) the first time a wishlist surface renders it.

On both wishlist surfaces (the favorites page and the cart drawer / `/cart` cross-sell), a colour pick SHALL always land on an existing variant. Picking a colour that doesn't come in the chosen size SHALL also pick that colour's start size the same way, so the photo, price, badge and add-to-cart follow the colour without a further click. A chosen size the colour does offer SHALL NOT be changed by a colour pick. Sizes the chosen colour doesn't come in SHALL be unavailable for selection (a disabled dropdown option, a disabled size box); colours SHALL stay selectable. Size options SHALL render in storefront size order on both surfaces.

Size systems SHALL be compared by their key with or without its Akeneo brackets (`[shoe_size_eu]` and `shoe_size_eu` are one size system).

#### Scenario: Heart on a card showing a non-default colour
- **WHEN** a shopper selects the Sugar Swizzle chip on a card and clicks its empty heart
- **THEN** the wishlist entry is Sugar Swizzle in its start size, not the product's first colour

#### Scenario: Colour picked on an entry without a size
- **WHEN** an entry was saved without a variant (its product data couldn't load when the heart was clicked) and a wishlist surface renders it
- **THEN** it shows the colour the card showed in that colour's start size, with photo, price and an enabled add-to-cart, and the entry is saved with that variant

#### Scenario: Filled heart
- **WHEN** a shopper clicks a card's filled heart
- **THEN** the product is removed from the wishlist and the heart empties

#### Scenario: Colour picked with a size already chosen
- **WHEN** the entry already has size M and the shopper picks another colour that comes in M
- **THEN** the size stays M

#### Scenario: Colour that doesn't come in the chosen size
- **WHEN** a wishlist entry is in size 37 and the shopper picks Beige, which only comes in 28, from the cross-sell dropdown or the page's colour chips
- **THEN** the entry switches to Beige in 28, and the card shows Beige's photo, price and an enabled add-to-cart

#### Scenario: Sizes the chosen colour lacks
- **WHEN** an entry is Black, which comes in 29 to 38 but not 28, 33 or 39
- **THEN** 28, 33 and 39 are disabled in the cross-sell size dropdown and in the page's size grid, and become available again when a colour that has them is picked

#### Scenario: Scrambled sizes on the wishlist page
- **WHEN** a product's sizes arrive as `XXXXL XS S L XXXL XXL XXS XL M`
- **THEN** the size grid shows `XXS XS S M L XL XXL XXXL XXXXL`

#### Scenario: Shopper chose a size before
- **WHEN** the shopper picked M on a trousers PDP (`bottoms_size`) and later hearts a hoodie (`tops_size`) offering XS to XL
- **THEN** the hoodie entry starts on M

#### Scenario: No size chosen yet
- **WHEN** a shopper with no remembered shoe size hearts a shoe offered in 40 to 47
- **THEN** the entry starts on 43

#### Scenario: PDP opens with a remembered size
- **WHEN** the shopper picked M on one trousers PDP and opens another trousers PDP linked to its Bright Pink XXXXL variant
- **THEN** the PDP shows Bright Pink in M, and add-to-cart posts the Bright Pink M variant

#### Scenario: PDP without a remembered size for its size system
- **WHEN** only a letter size is remembered and the shopper opens a shoe PDP offering 35 to 43
- **THEN** the PDP opens on 39

#### Scenario: PDP opened from a size-filtered listing
- **WHEN** L is remembered and the shopper opens a trousers PDP from a listing filtered to M
- **THEN** the PDP opens on M and L stays remembered

#### Scenario: PDP opened from the cart
- **WHEN** the shopper opens a cart line's product link for size XXL
- **THEN** the PDP stays on XXL

### Requirement: Wishlist is stored in the shopper's browser
The wishlist SHALL be kept in the shopper's own browser, per browser and not per customer account: a list of entries, newest first, each naming one product (by handle) and one of its variants, at most one entry per product. Saving a product that is already on the list SHALL replace that entry's variant rather than add a second entry. Every surface (card hearts, PDP button, header badge, favorites page, cart cross-sell) SHALL read and write this one list, and no third-party wishlist app SHALL be involved, and a change made on any surface SHALL show on every other surface of the same page without a reload, and on the shopper's other open tabs of the shop. When the browser refuses storage (private mode, blocked site data) the wishlist SHALL simply be empty and the page SHALL work as usual, with no errors.

#### Scenario: Saving the same product twice
- **WHEN** a product is on the list in black 38 and the shopper saves it again from the PDP in black 40
- **THEN** the list still holds one entry for that product, now black 40

#### Scenario: Another tab
- **WHEN** the shopper adds a product in one tab while a second tab of the shop is open
- **THEN** the second tab's header badge and that product's hearts update without a reload

#### Scenario: Storage blocked
- **WHEN** the browser blocks storage for the shop
- **THEN** the header badge shows nothing, the favorites page shows its empty state, and no script error is raised

### Requirement: Favorites page
A page using the theme's favorites template (`/pages/favorieten`) SHALL list every wishlist entry as a product card, newest first, in a responsive multi-column grid. Each card SHALL be rendered by the theme from the product's own current data and SHALL show the entry's variant: its photo, a photo badge, vendor, title linking to the product page for that variant, price (with the compare-at price struck through when reduced), the colour options as image chips and the size options as a box grid in storefront size order, an add-to-cart button and a remove control. Option names SHALL never show raw Akeneo keys.

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

### Requirement: Favorites cards carry the product-card photo badge
Each favorites card SHALL show over its photo a sold-out badge when the card's variant is unavailable, otherwise a sale badge with that variant's reduction, `floor((compare_at_price - price) * 100 / compare_at_price)`, where an unset, zero or not-higher compare-at price counts as no reduction. The badge SHALL be hidden when there is no reduction and SHALL follow every option change.

#### Scenario: Reduced variant
- **WHEN** a card's variant costs EUR 63 with a compare-at price of EUR 90
- **THEN** the card's photo shows `-30%`

#### Scenario: Full-price size picked
- **WHEN** the shopper selects a size whose variant is not reduced on a card showing a sale badge
- **THEN** the badge hides, and returns when a reduced size is selected again

#### Scenario: Sold-out variant
- **WHEN** the card's variant is sold out
- **THEN** the photo shows the sold-out badge and add-to-cart is disabled

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

