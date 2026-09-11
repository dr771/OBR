## MODIFIED Requirements

### Requirement: Information-column typography follows the approved reference
The brand line, product title, and price SHALL render at the approved reference's measured scale: the brand line uppercase at 1.1rem with normal letter-spacing and semibold weight in the muted ink, the title at 4.8rem on a 4.8rem line in the heading family at semibold weight with -0.48px tracking, and the price at 2rem on a 2.8rem line at semibold weight. The reference's 2.75px brand-line tracking is deliberately not carried, per the storefront-wide no-positive-tracking rule.

#### Scenario: Product information renders

- **WHEN** a product with a vendor renders its title and price
- **THEN** the brand line sits above the title, and brand, title, and price each match the reference's size, weight, line height, and colour, with the brand line at normal letter-spacing and the title at its -0.48px tracking

#### Scenario: Heading weight has a loaded face

- **WHEN** the title declares a semibold weight in the heading family
- **THEN** a matching semibold face is loaded, so the title does not silently fall back to a lighter rendered weight
