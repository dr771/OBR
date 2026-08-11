# plp-gender-facet Specification

## Purpose
Exposes gender ("Geslacht") as a PLP facet, driven by the confirmed `custom.genderid` product metafield. Part of the confirmed facet superset (`MIXED-SHOPS-PLAYBOOK.md` "Confirmed facts") the reuse-source project doesn't need. No SB precedent exists for this facet.

## Requirements

### Requirement: Gender facet lists genderid values with counts
The PLP filter panel SHALL include a "Geslacht" facet, checkbox/multi-select, listing each distinct `custom.genderid` value present in the current collection with its product count, using the same accordion chrome as the other facets (`plp-filter-panel-chrome`).

#### Scenario: Shopper opens the gender facet
- **WHEN** a shopper views the "Geslacht" facet on a collection
- **THEN** each distinct value seen so far (e.g. "Women", "Unisex") appears as a checkbox option with its product count

#### Scenario: Shopper filters by gender
- **WHEN** a shopper checks a gender value
- **THEN** the grid narrows accordingly, consistent with every other facet's filtering behavior

### Requirement: Gender facet degrades gracefully for products missing the metafield
A product without a `custom.genderid` metafield SHALL simply be excluded from every gender facet value (never shown as a false "unisex" default, never causing a facet error).

#### Scenario: A synced product has no genderid metafield yet
- **WHEN** a product from a brand where `genderid` hasn't been populated yet is viewed
- **THEN** it's excluded from all gender facet counts, and the page renders normally otherwise
