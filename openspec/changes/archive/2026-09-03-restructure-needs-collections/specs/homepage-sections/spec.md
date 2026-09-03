## RENAMED Requirements

- FROM: `### Requirement: Occasion grid links to the real metafield-based collections`
- TO: `### Requirement: Occasion grid links to the real vendor-conditioned collections`

## MODIFIED Requirements

### Requirement: Occasion grid links to the real vendor-conditioned collections
The "Shop per behoefte" grid SHALL render one card per occasion block, each
linking to its real collection (`sport-training`, `outdoor-werk`,
`fashion-lifestyle`) with a photo resolved via
`snippets/ob-occasion-image.liquid`, a numbered eyebrow, the collection's own
title as the card heading, and a scrim ensuring the overlaid text stays
legible against any photo. Each collection's product membership SHALL be
determined by vendor-based OR conditions (see `COLLECTIONS.md`), not by
activity/category metafields, so the three collections stay mutually
exclusive regardless of how a product's own activity tags are set.

#### Scenario: Curated occasion photography
- **WHEN** an occasion card is for one of the three known collection handles
- **THEN** its image SHALL be the theme's curated asset for that occasion
  (not a generic placeholder), falling back to the collection's own
  `featured_image` for any other handle.

#### Scenario: Collections are mutually exclusive by vendor
- **WHEN** a product carries activity or category metafield values that
  would have matched more than one occasion collection under the previous
  activity/category rule type
- **THEN** the product SHALL still appear in exactly one occasion
  collection, determined solely by its vendor, never by its activity tags.
