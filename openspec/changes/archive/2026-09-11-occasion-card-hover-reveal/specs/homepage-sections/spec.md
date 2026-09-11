## MODIFIED Requirements

### Requirement: Occasion grid links to the real vendor-conditioned collections
The "Shop per behoefte" grid SHALL render one card per occasion block, each
linking to its real collection (`sport-training`, `outdoor-werk`,
`fashion-lifestyle`) with a photo resolved via
`snippets/ob-occasion-image.liquid` unless the block has its own
merchant-uploaded image, a numbered eyebrow, the collection's own title as
the card heading, and a permanently visible scrim ensuring the overlaid text
stays legible against any photo at rest, not only on hover. Each card MAY
carry a merchant-editable short description that reveals on hover/focus.
Each collection's product membership SHALL be determined by vendor-based OR
conditions (see `COLLECTIONS.md`), not by activity/category metafields, so
the three collections stay mutually exclusive regardless of how a product's
own activity tags are set.

#### Scenario: Curated occasion photography by default
- **WHEN** an occasion block has no merchant-uploaded image
- **AND** the card is for one of the three known collection handles
- **THEN** its image SHALL be the theme's curated asset for that occasion
  (not a generic placeholder), falling back to the collection's own
  `featured_image` for any other handle.

#### Scenario: Merchant can override the occasion photo from the theme editor
- **WHEN** a merchant uploads an image via the block's `image` (image_picker)
  setting in the theme editor
- **THEN** that image SHALL render in place of the curated/fallback image,
  with its own `alt` text taking priority over the collection title.

#### Scenario: Collections are mutually exclusive by vendor
- **WHEN** a product carries activity or category metafield values that
  would have matched more than one occasion collection under the previous
  activity/category rule type
- **THEN** the product SHALL still appear in exactly one occasion
  collection, determined solely by its vendor, never by its activity tags.

#### Scenario: Short description reveals on hover or focus
- **WHEN** an occasion block has a non-blank `short_desc` setting and a
  shopper hovers or keyboard-focuses that card
- **THEN** the description SHALL transition from zero height and zero
  opacity to visible, matching bolt.host's own reveal pattern, and SHALL
  return to hidden when the card is no longer hovered or focused.

#### Scenario: No dead reveal space when the description is blank
- **WHEN** an occasion block's `short_desc` setting is blank
- **THEN** no empty description node SHALL render, and hovering or focusing
  the card SHALL reveal nothing extra.

#### Scenario: Scrim keeps every text layer legible at rest
- **WHEN** an occasion card renders against any photo, hovered or not
- **THEN** the scrim gradient SHALL already be at full strength at rest (not
  a hover-only effect), so the number-eyebrow, title, CTA, and — once
  revealed — the short description all read clearly without requiring
  interaction first.

#### Scenario: Grid gap matches the proto
- **WHEN** the occasion grid renders at any viewport width
- **THEN** the gap between cards SHALL be 1.25rem (20px), matching bolt's
  measured `gap-5` value, with no wider gap introduced at a larger
  breakpoint.

#### Scenario: Square cards on mobile, a deliberate departure from the proto
- **WHEN** the occasion grid renders below 750px
- **THEN** each card SHALL use a 1:1 aspect ratio rather than the 3:4 ratio
  used at 750px and up — the proto itself stays 3:4 at every width, so this
  is an OB-specific mobile departure, not a ported value.

#### Scenario: CTA hover moves only the icon, matching bolt exactly
- **WHEN** a shopper hovers or keyboard-focuses an occasion card
- **THEN** the "Ontdek collectie" label SHALL stay fixed in place, only its
  arrow icon (Lucide `arrow-up-right`, matching bolt's own icon) SHALL
  translate, and the card photo SHALL zoom on a slow-settling ease-out curve
  rather than a linear one — all matching bolt's measured computed-style
  values exactly, not approximated.
