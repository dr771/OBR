# plp-sort-options Specification

## Purpose
Defines the concise native collection sorting menu and the editor workflow behind Shopify's manual Featured order.
## Requirements
### Requirement: Collection PLP exposes four approved sort choices in fixed order
Collection product-listing controls SHALL offer only Shopify's native Best selling, Price low-to-high, Price high-to-low, and manual Featured choices, in that order when available. Desktop, horizontal, and mobile collection controls SHALL use the same option source. Search-result sorting SHALL retain Shopify's native option set.

#### Scenario: Shopper opens a collection sort control
- **WHEN** Shopify supplies the four approved native values
- **THEN** the selectable choices are Bestsellers, price low-to-high, price high-to-low, and Featured in that exact order

#### Scenario: Shopper opens search sorting
- **WHEN** the current results object is a search page
- **THEN** all native search sort options remain available and unchanged

### Requirement: Unsupported current sort remains truthful but is not reselectable
If Shopify server-renders a collection with a current/default sort value outside the four-choice whitelist, the control SHALL display that current native label as its selected value without exposing it as a selectable approved choice after the shopper changes sorting.

#### Scenario: Built-in all-products collection defaults to A-Z
- **WHEN** `/collections/all` renders with native `title-ascending` as its current default
- **THEN** the control truthfully displays “Alfabetisch: A-Z” until the shopper selects an approved choice

#### Scenario: Shopper selects an approved choice from the fallback state
- **WHEN** the shopper changes from the unsupported current fallback to Bestsellers
- **THEN** the request submits `sort_by=best-selling` and the unsupported fallback is no longer offered for reselection

### Requirement: Best selling uses the approved Dutch label
On the Dutch storefront, Shopify's native `best-selling` option SHALL display as “Bestsellers” while retaining the native submitted value and ordering behavior.

#### Scenario: Dutch collection sorting renders
- **WHEN** the collection supplies `best-selling`
- **THEN** the option label is “Bestsellers” and its submitted value remains `best-selling`

### Requirement: Featured preserves Shopify manual collection ordering
The Featured option SHALL submit Shopify's native `manual` value and display the manually curated sequence stored for the current collection.

#### Scenario: Shopper selects Featured
- **WHEN** the shopper activates Featured
- **THEN** the native facet pipeline requests `sort_by=manual`

### Requirement: Editors have a Featured-order guide
The project SHALL document the Shopify Admin path, permissions, save/reorder steps, and distinction between collection membership, manual Featured ordering, and the collection's saved default sort.

#### Scenario: Editor needs to curate Featured
- **WHEN** an editor reads the PLP sorting guide
- **THEN** they can configure and maintain the manual order without reading theme code

