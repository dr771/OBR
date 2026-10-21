## ADDED Requirements

### Requirement: Wishlist entries start on a whole variant
Because WK stores only whole variants, a wishlist entry SHALL start on the colour the shopper saw with a start size chosen from that colour's available sizes (all of its sizes when none is available): the size the shopper last chose for the same size system (the raw size option key, e.g. `shoe_size_eu`) when the colour offers it; otherwise, when every offered size is a letter size, the most recent letter size the shopper chose in another size system that the colour offers; otherwise the middle of the offered sizes in storefront size order (the PDP's order), the lower middle for an even count. Numeric sizes SHALL NOT carry across size systems. A product without a colour option SHALL use all its variants; one without a size option SHALL start on the colour's first available variant.

Only the shopper's own size choices SHALL count: a size picked on the PDP picker or the standalone wishlist page's size grid by a real user interaction, never a size the theme preselected. They SHALL be kept per browser only, and unavailable storage SHALL simply mean the middle-size fallback.

A product card's wishlist heart (collection, search and any other shared product-card surface where WK injects it) SHALL add the item this way, using the colour the card currently shows, instead of WK's variant-less add. Removing through a filled heart SHALL remain WK's own behaviour. If the product data cannot be loaded, the heart SHALL fall back to WK's variant-less add.

On the standalone wishlist page, picking a colour on an item with no chosen size (an entry saved before hearts saved variants) SHALL also pick that colour's start size the same way, so the photo, price, badge and add-to-cart follow the colour without a further click. An already chosen size SHALL NOT be changed by a colour pick. The page's size options SHALL render in storefront size order.

#### Scenario: Heart on a card showing a non-default colour
- **WHEN** a shopper selects the Sugar Swizzle chip on a card and clicks its empty heart
- **THEN** the wishlist entry is Sugar Swizzle in its start size, not the product's first colour

#### Scenario: Colour picked on an entry without a size
- **WHEN** a wishlist entry shows the Kleur/Maat placeholders and the shopper picks Bright Pink
- **THEN** Bright Pink's start size is selected and the card shows Bright Pink's photo, price and an enabled add-to-cart

#### Scenario: Colour picked with a size already chosen
- **WHEN** the entry already has size M and the shopper picks another colour
- **THEN** the size stays M

#### Scenario: Scrambled sizes on the wishlist page
- **WHEN** a product's sizes arrive as `XXXXL XS S L XXXL XXL XXS XL M`
- **THEN** the size grid shows `XXS XS S M L XL XXL XXXL XXXXL`

#### Scenario: Shopper chose a size before
- **WHEN** the shopper picked M on a trousers PDP (`bottoms_size`) and later hearts a hoodie (`tops_size`) offering XS to XL
- **THEN** the hoodie entry starts on M

#### Scenario: No size chosen yet
- **WHEN** a shopper with no remembered shoe size hearts a shoe offered in 40 to 47
- **THEN** the entry starts on 43
