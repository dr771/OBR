# plp-grid-config Specification

## Purpose
Defines the collection grid's initial result count and progressive native load-more flow without numbered pagination.
## Requirements
### Requirement: Initial collection page size is 18
The collection product grid SHALL render at most 18 matching products on its initial response before further shopper interaction.

#### Scenario: Collection contains more than 18 products
- **WHEN** a shopper opens a collection containing more than 18 matching products
- **THEN** exactly 18 product cards render initially and a load-more control is available

#### Scenario: Collection contains 18 or fewer products
- **WHEN** a shopper opens a collection containing no more than 18 matching products
- **THEN** every matching product renders and no load-more control appears

### Requirement: Load more appends the next native result page
When another result page exists, the grid SHALL expose a “Toon meer” button that fetches the next Shopify section page, appends its product cards in order without replacing existing cards or moving the shopper's scroll position, updates the shown/total count, and advances to the following page until exhausted.

#### Scenario: Shopper loads another page
- **WHEN** the shopper activates “Toon meer” while a next page exists
- **THEN** the button becomes busy/disabled, the next page's cards append after the existing cards, and the next-page control/count are refreshed

#### Scenario: Shopper reaches the last page
- **WHEN** the appended section response has no subsequent page
- **THEN** the load-more control is removed and every loaded card remains in the grid

#### Scenario: Load-more request fails
- **WHEN** the section request fails or does not return a usable product grid
- **THEN** existing cards remain unchanged and the button becomes operable again with its original label

#### Scenario: Facet or sort replaces the grid after products were appended
- **WHEN** a shopper changes a facet or sort after using load more
- **THEN** Dawn replaces the grid with the first page of the new state and its matching fresh load-more control

### Requirement: Numbered pagination does not render on collection grids
The collection product grid SHALL NOT render Dawn's numbered pagination component on the first, middle, or last result page.

#### Scenario: More result pages exist
- **WHEN** a collection contains more products than the initial page size
- **THEN** “Toon meer” is the only visible pagination mechanism

#### Scenario: Last result page is reached
- **WHEN** the shopper has loaded all available collection products
- **THEN** no numbered pagination appears in place of the removed load-more control

### Requirement: Desktop collection grid follows approved spacing
At desktop widths, a vertical-filter collection PLP SHALL use a 5rem outer page inset aligned with the header logo edge, a 2.4rem horizontal product-card gap, and a 3.6rem vertical product-card gap.

#### Scenario: Four-column collection grid renders on desktop
- **WHEN** the vertical-filter collection PLP renders at 1440px viewport width
- **THEN** its filter and grid shell begins 50px from each page edge, aligned with the header logo edge, adjacent product cards are separated by 24px horizontally, and successive product rows are separated by 36px vertically

### Requirement: Loaded pages survive back navigation
Pages appended through “Toon meer” SHALL be recorded in the current browser history entry, together with the scroll offset when the shopper leaves the page. When that same history entry loads again without the browser's page cache (back from a PDP, reload), the grid SHALL re-append the recorded pages in their original order, refresh the load-more control and count to match, and restore the recorded scroll offset. A fresh visit to the collection through a link SHALL start on the first page. The record SHALL be dropped when the facet/sort state shown no longer matches it (in-page facet history, a first recorded page that differs from the rendered next page) or when re-fetching fails, leaving the first page and a working load-more control. Recording SHALL NOT remove the `searchParams` Dawn's facet history relies on.

#### Scenario: Back from a PDP after loading more
- **WHEN** a shopper loads two extra pages on a collection, opens a product from the third page and returns with the browser back button
- **THEN** all three pages' cards are shown, the count reads the matching shown/total, and the viewport is back at the opened product

#### Scenario: Fresh visit through a link
- **WHEN** the shopper later opens the same collection from the menu
- **THEN** only the first page renders

#### Scenario: Restoring fails
- **WHEN** a recorded page cannot be fetched during restore
- **THEN** the first page stays, the load-more control is operable, and the record is cleared

