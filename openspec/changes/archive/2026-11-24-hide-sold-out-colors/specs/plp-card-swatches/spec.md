## ADDED Requirements

### Requirement: Card chip rail offers only colors that can be bought
When a product has at least one available variant, its card chip rail SHALL omit every color that has no available variant in any size, except the color the card currently shows, which SHALL stay as the active chip. When fewer than two colors remain, the card SHALL render no chip row, as for a single-color product. A product with no available variant SHALL keep every color chip. Every card surface that uses the shared product card SHALL behave the same way.

#### Scenario: One color is sold out in every size
- **WHEN** a card renders a product whose Lime color has no available variant and whose Black and Anthracite colors each have one
- **THEN** the chip rail shows Black and Anthracite only

#### Scenario: The card shows a sold-out color
- **WHEN** a listing filter narrows the card to a variant of a color that has no available variant
- **THEN** that color still renders as the active chip, and the other sold-out colors are omitted

#### Scenario: Only one color can be bought
- **WHEN** every color but one has no available variant and the card shows that one
- **THEN** the card renders no chip row

#### Scenario: Whole product is sold out
- **WHEN** a card renders a product with no available variant
- **THEN** every color chip renders as before
