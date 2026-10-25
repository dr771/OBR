## ADDED Requirements

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
