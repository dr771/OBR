# pdp-breadcrumb Specification

## Purpose
Defines the breadcrumb trail above the product section, giving shoppers their position in the catalogue and a one-click route back to the collection they arrived from.
## Requirements
### Requirement: PDP renders a breadcrumb trail above the product section
The PDP SHALL render a breadcrumb navigation landmark above the product section, ending with the current product's own entry. Every entry before the last SHALL be a link; the last SHALL be plain text marked as the current page. When a collection entry is resolved for the trail it SHALL appear between the shop home and the product entry; when none is resolved the trail SHALL consist of the shop home and the product alone, without an empty entry or a dangling separator.

#### Scenario: Shopper arrives from a collection

- **WHEN** a shopper browses a collection and opens a product from it
- **THEN** the breadcrumb names the collection the shopper browsed as a link before the current product's entry

#### Scenario: Shopper opens a product directly

- **WHEN** a product is opened without a referring collection
- **THEN** the breadcrumb still renders a valid trail beginning at the shop home without an empty or broken entry

#### Scenario: Product belongs to no collection

- **WHEN** a product that belongs to no collection is opened
- **THEN** the breadcrumb renders the shop home followed by the product entry, with no placeholder entry and no trailing separator

#### Scenario: Assistive technology reads the trail

- **WHEN** a screen reader encounters the breadcrumb
- **THEN** it is exposed as a navigation landmark with a localized label, and the final entry is announced as the current page

### Requirement: Breadcrumb names the collection the shopper actually browsed
The PDP SHALL resolve the breadcrumb's collection entry from the following sources, in descending priority: the collection the storefront's own routing supplies for the request when one is present; otherwise the collection the shopper most recently browsed during the current session, but only when the current product belongs to that collection; otherwise the highest-ranked collection the product belongs to.

The ranking used for that final fallback SHALL be declared per collection and SHALL NOT be derived from per-product data or from the PIM feed. A product-type collection SHALL outrank an occasion collection, and an occasion collection SHALL outrank a brand collection.

Resolution SHALL NOT depend on the shape of the product URL: product URLs SHALL remain free of collection path segments.

#### Scenario: Remembered collection contains the product

- **WHEN** a shopper browses a collection, then opens a product that belongs to that collection
- **THEN** the breadcrumb's collection entry names and links to that collection

#### Scenario: Remembered collection does not contain the product

- **WHEN** the collection remembered from the session does not contain the product being viewed
- **THEN** that collection is not shown, and the breadcrumb falls back to the highest-ranked collection the product does belong to

#### Scenario: Direct entry with no browsing context

- **WHEN** a product is opened with no routing collection and no remembered collection
- **THEN** the breadcrumb names the highest-ranked collection the product belongs to, so a product-type collection is preferred over a broader occasion collection that also contains the product

#### Scenario: Scripting is unavailable

- **WHEN** the page is rendered without client-side scripting, such as for a crawler
- **THEN** the breadcrumb still renders a valid trail using the ranked collection, with no empty or broken entry

#### Scenario: Resolved entry settles without flicker

- **WHEN** a PDP loads and the resolved collection differs from the one rendered by the server
- **THEN** the shopper does not see the collection entry visibly change from one label to another

#### Scenario: Product URLs stay free of collection segments

- **WHEN** a shopper opens a product from a collection listing
- **THEN** the resulting product URL contains no collection path segment

### Requirement: Breadcrumb presentation follows the approved reference
Breadcrumb entries SHALL render at 1.2rem on a 1.6rem line with 0.8rem between items, links in muted ink and the current entry in full ink, separated by directional chevron glyphs that are hidden from assistive technology.

#### Scenario: Breadcrumb renders on desktop

- **WHEN** the breadcrumb renders above the product section
- **THEN** its entries, separators, colours and spacing match the reference, and the separators are not announced as content

#### Scenario: Trail is longer than the available width

- **WHEN** a deep trail exceeds the available width on a narrow viewport
- **THEN** the trail stays within the page without introducing horizontal page overflow
