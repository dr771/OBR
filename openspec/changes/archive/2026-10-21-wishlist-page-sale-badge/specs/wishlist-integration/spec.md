## ADDED Requirements

### Requirement: Standalone wishlist cards carry the product-card photo badge
Each card on the standalone `/apps/wishlist` page SHALL show the shared product card's photo badge over its image: a sold-out badge when the product has no available variant, otherwise a sale badge when what the card shows is reduced. Percentages SHALL follow the product-card rule, `floor((compare_at_price - price) * 100 / compare_at_price)` per variant, with a variant whose compare-at price is unset, 0 or not above its price counting as 0. The scope SHALL be the variant WK has resolved for the card (the one whose price it displays and add-to-cart posts); before WK resolves one, it SHALL be the available variants matching the options chosen so far, ignoring WK's placeholder value. One percentage across the scope SHALL display as `-N%`; differing percentages SHALL display the largest behind the translatable "up to" prefix. The badge SHALL be hidden when the scope has no reduction and SHALL follow every option change on the card. It SHALL be derived from the product's own data and MUST NOT change WK's selection, price or add-to-cart behaviour; when the product data cannot be loaded the card SHALL render without a badge.

#### Scenario: Saved variant is reduced
- **WHEN** a card's resolved variant costs EUR 63 with a compare-at price of EUR 90
- **THEN** the card's photo shows `-30%`

#### Scenario: Item saved without a variant
- **WHEN** a product saved from a PLP heart has one colour reduced by 30% and another at full price, and no option is chosen yet
- **THEN** the card shows `tot -30%`

#### Scenario: Shopper picks a full-price size
- **WHEN** a shopper selects a size whose variant is not reduced on a card showing a sale badge
- **THEN** the badge hides once WK shows that variant's price, and returns when a reduced size is selected again

#### Scenario: Product is not on sale
- **WHEN** no variant in the card's scope is reduced
- **THEN** no badge renders

### Requirement: Standalone wishlist option changes are never dropped
On the standalone `/apps/wishlist` page, WK ignores an option change, add-to-cart or remove that arrives while it is still saving a previous one. The page SHALL therefore hand rail changes and the themed remove action to WK one at a time, each only once WK has finished the previous save, and a newer chip click on the same option SHALL replace a queued one, so the last chip the shopper clicked is the selection WK ends up with. A clicked chip SHALL stay selected while its change waits. While a card's change is pending, its price and badge SHALL read as updating. An add-to-cart submitted while any change is pending or being saved SHALL wait, with a visible loading state on its button, and SHALL then post the variant WK resolved from the final selection. If WK's requests never go quiet the queue SHALL proceed after a bounded wait rather than block the page.

#### Scenario: Shopper clicks several sizes quickly
- **WHEN** a shopper clicks sizes 37, 38 and 36 within a second
- **THEN** the 36 chip stays selected, and WK's price, badge and variant id end on 36

#### Scenario: Add to cart during a save
- **WHEN** the shopper clicks add-to-cart while the last size change is still being saved
- **THEN** the button shows a spinner and the cart receives the variant of the last clicked size

#### Scenario: Remove during a save
- **WHEN** the shopper removes an item while a change on any card is still being saved
- **THEN** the item is removed once that save has finished
