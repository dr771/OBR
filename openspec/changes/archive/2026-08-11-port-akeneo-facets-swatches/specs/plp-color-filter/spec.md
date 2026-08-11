# plp-color-filter Delta

## ADDED Requirements

### Requirement: Color facet chip renders from the filtercolors metaobject, not an image
The color filter facet SHALL render each active color family as a flat chip colored from the `filtercolors` metaobject's `hexcode` field, falling back to the metaobject's `image_asset` only if `hexcode` is absent. This is deliberately not an image-swatch (unlike the PLP card and PDP chips) — a filter value represents a color family spanning many products, and no single product photo can represent that group accurately, whereas a flat color chip communicates the family without implying one specific product's exact shade or print.

#### Scenario: Filter family has a hex code
- **WHEN** a `filtercolors` metaobject entry has a `hexcode` value (e.g. `#000000` for `black`/`zwart`)
- **THEN** the facet chip renders as a flat color swatch using that hex value

#### Scenario: Filter family lacks a hex code but has an image
- **WHEN** a `filtercolors` entry has no `hexcode` but does have an `image_asset`
- **THEN** the facet chip falls back to rendering that image

### Requirement: Color families are grouped by the filtercolors reference, not by name-matching
The color facet SHALL group product colors by their `filtercolors` metaobject reference (via the variant's `custom.filtercolors` list field) rather than by word-matching color-name text into families. Nick's Akeneo sync owns the family grouping; the theme SHALL NOT reimplement or duplicate that grouping logic.

#### Scenario: Two differently-named colors share a family
- **WHEN** two color option values both reference the same `filtercolors` metaobject entry (e.g. both map to `code: black`)
- **THEN** they are grouped under a single facet chip, with no theme-side name-matching involved

#### Scenario: A variant has no filtercolors reference
- **WHEN** a variant's `custom.filtercolors` field is empty or absent
- **THEN** that variant is excluded from the color facet rather than causing a facet error or an ungrouped stray chip
