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
