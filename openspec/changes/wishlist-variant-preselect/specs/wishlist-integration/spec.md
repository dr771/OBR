## ADDED Requirements

### Requirement: Wishlist entries start on a whole variant
Because WK stores only whole variants, a wishlist entry SHALL start on the colour the shopper saw with that colour's first available size in storefront size order (the PDP's order); when no variant of that colour is available, its first size in that order. A product without a colour option SHALL start on its first available size; one without a size option on the colour's first available variant.

A product card's wishlist heart (collection, search and any other shared product-card surface where WK injects it) SHALL add the item this way, using the colour the card currently shows, instead of WK's variant-less add. Removing through a filled heart SHALL remain WK's own behaviour. If the product data cannot be loaded, the heart SHALL fall back to WK's variant-less add.

On the standalone wishlist page, picking a colour on an item with no chosen size (an entry saved before hearts saved variants) SHALL also pick that colour's start size the same way, so the photo, price, badge and add-to-cart follow the colour without a further click. An already chosen size SHALL NOT be changed by a colour pick. The page's size options SHALL render in storefront size order.

#### Scenario: Heart on a card showing a non-default colour
- **WHEN** a shopper selects the Sugar Swizzle chip on a card and clicks its empty heart
- **THEN** the wishlist entry is Sugar Swizzle in its smallest available size, not the product's first colour

#### Scenario: Colour picked on an entry without a size
- **WHEN** a wishlist entry shows the Kleur/Maat placeholders and the shopper picks Bright Pink
- **THEN** Bright Pink's smallest available size is selected and the card shows Bright Pink's photo, price and an enabled add-to-cart

#### Scenario: Colour picked with a size already chosen
- **WHEN** the entry already has size M and the shopper picks another colour
- **THEN** the size stays M

#### Scenario: Scrambled sizes on the wishlist page
- **WHEN** a product's sizes arrive as `XXXXL XS S L XXXL XXL XXS XL M`
- **THEN** the size grid shows `XXS XS S M L XL XXL XXXL XXXXL`
