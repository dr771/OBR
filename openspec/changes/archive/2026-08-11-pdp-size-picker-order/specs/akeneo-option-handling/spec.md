## ADDED Requirements

### Requirement: Storefront option metadata is derived centrally from stable keys
Storefront display labels and recognized size-family metadata SHALL be derived from the raw Akeneo option key through the centralized `ob-option-meta` boundary, never by branching on a visible or translated label in a page-specific template.

#### Scenario: PDP requests metadata for a footwear size option
- **WHEN** the variant picker requests metadata for `[shoe_size_eu]`
- **THEN** the centralized option metadata identifies it as kind `size`, family `shoe-eu`, and Dutch storefront label `Maat`

#### Scenario: PDP requests metadata for apparel sizes
- **WHEN** the variant picker requests metadata for `[tops_size]` or `[bottoms_size]`
- **THEN** the centralized option metadata identifies the matching `tops` or `bottoms` family and supplies the storefront label `Maat`
