## MODIFIED Requirements

### Requirement: Brand copy (collection, eyebrow, description) is merchant-editable per block
Each brand's collection link, eyebrow, and description SHALL be merchant-editable without a code
change. The collection link and the long description SHALL remain block-level settings in the theme
editor. The eyebrow (the brand's one-line tagline, shared with the homepage featured-brands grid)
SHALL be resolved from the brand collection's `custom.brand_tagline` metafield, with the block's own
eyebrow setting used only as a fallback when that metafield is blank or the brand has no collection.
The long description SHALL stay page-specific and SHALL NOT be moved into the metafield.

#### Scenario: Editing a block's description updates the storefront
- **WHEN** a merchant edits a brand block's "Korte omschrijving" setting in the theme editor
- **THEN** the corresponding tile's description SHALL update on the storefront without any Liquid/CSS change.

#### Scenario: Editing the tagline updates both pages at once
- **WHEN** a merchant edits `custom.brand_tagline` on a brand's collection in Admin
- **THEN** that brand's tile eyebrow on `/pages/merken` and its card tagline on the homepage SHALL
  both update, without a theme-editor edit on either page.

#### Scenario: Tile layout is unchanged by the new source
- **WHEN** the eyebrow is rendered from the metafield instead of the block setting
- **THEN** the tile SHALL render with the same markup, typography, accent ink, and spacing as before —
  this change moves where the text comes from, not how it looks.
