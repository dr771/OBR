# pdp-breadcrumb Specification

## Purpose
Defines the breadcrumb trail above the product section, giving shoppers their position in the catalogue and a one-click route back to the collection they arrived from.
## Requirements
### Requirement: PDP renders a breadcrumb trail above the product section
The PDP SHALL render a breadcrumb navigation landmark above the product section, ending with the current product's own entry. Every entry before the last SHALL be a link; the last SHALL be plain text marked as the current page.

#### Scenario: Shopper arrives from a collection

- **WHEN** a shopper opens a product from a collection
- **THEN** the breadcrumb names that collection as a link before the current product's entry

#### Scenario: Shopper opens a product directly

- **WHEN** a product is opened without a referring collection
- **THEN** the breadcrumb still renders a valid trail beginning at the shop home without an empty or broken entry

#### Scenario: Assistive technology reads the trail

- **WHEN** a screen reader encounters the breadcrumb
- **THEN** it is exposed as a navigation landmark with a localized label, and the final entry is announced as the current page

### Requirement: Breadcrumb presentation follows the approved reference
Breadcrumb entries SHALL render at 1.2rem on a 1.6rem line with 0.8rem between items, links in muted ink and the current entry in full ink, separated by directional chevron glyphs that are hidden from assistive technology.

#### Scenario: Breadcrumb renders on desktop

- **WHEN** the breadcrumb renders above the product section
- **THEN** its entries, separators, colours and spacing match the reference, and the separators are not announced as content

#### Scenario: Trail is longer than the available width

- **WHEN** a deep trail exceeds the available width on a narrow viewport
- **THEN** the trail stays within the page without introducing horizontal page overflow
