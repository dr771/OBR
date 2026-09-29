## RENAMED Requirements

- FROM: `### Requirement: PDP renders a breadcrumb trail above the product section`
- TO: `### Requirement: PDP renders a single back link above the product section`

- FROM: `### Requirement: Breadcrumb names the collection the shopper actually browsed`
- TO: `### Requirement: Back link returns to the listing the shopper actually browsed`

## MODIFIED Requirements

### Requirement: PDP renders a single back link above the product section
The PDP SHALL render, above the product section, a navigation landmark containing exactly one visible link that returns the shopper to a listing, labelled "Terug naar <listing name>" in the storefront language, with a leading directional arrow that is hidden from assistive technology. The PDP SHALL NOT render a multi-entry visible trail or a visible entry for the current product. When no listing can be resolved, the link SHALL return to the shop home instead of rendering empty.

#### Scenario: Shopper arrives from a collection

- **WHEN** a shopper browses a collection and opens a product from it
- **THEN** the PDP shows one link reading "Terug naar <that collection's title>", and no other breadcrumb entries are visible

#### Scenario: Product belongs to no collection

- **WHEN** a product that belongs to no collection is opened with no remembered listing
- **THEN** the back link returns to the shop home, with no empty label and no dangling arrow

#### Scenario: Assistive technology reads the back link

- **WHEN** a screen reader encounters the back link
- **THEN** it is exposed inside a navigation landmark with a localized label, the arrow is not announced, and the link text names its destination

#### Scenario: Long collection name on a narrow viewport

- **WHEN** the resolved listing has a long name on a narrow viewport
- **THEN** the link stays within the page without introducing horizontal page overflow

### Requirement: Back link returns to the listing the shopper actually browsed
The back link's destination SHALL be resolved from the following sources, in descending priority: the collection the storefront's own routing supplies for the request when one is present; otherwise the listing the shopper most recently left for a product page during the current session, as described below; otherwise the highest-ranked collection the product belongs to.

A remembered listing SHALL be either a collection or a search-results page, and SHALL carry the listing's full address including its active filter, sort, and query parameters, captured at the moment the shopper leaves it. A remembered collection SHALL be used only when the current product belongs to it. A remembered search SHALL be used regardless of collection membership and SHALL be labelled as search results rather than by its query. Opening any storefront page that is neither a listing nor a product page SHALL clear the remembered listing, so it can never label a product reached by another route. The remembered value SHALL be treated as untrusted: only its collection identity and its query parameters SHALL be used, and the link's path SHALL always come from server-rendered data.

The ranking used for the final fallback SHALL be declared per collection and SHALL NOT be derived from per-product data or from the PIM feed. A product-type collection SHALL outrank an occasion collection, and an occasion collection SHALL outrank a brand collection.

Resolution SHALL NOT depend on the shape of the product URL: product URLs SHALL remain free of collection path segments.

#### Scenario: Remembered collection contains the product

- **WHEN** a shopper filters a collection (for example by size and colour), then opens a product that belongs to that collection
- **THEN** the back link names that collection and links to it with the same filter parameters applied

#### Scenario: Remembered collection does not contain the product

- **WHEN** the collection remembered from the session does not contain the product being viewed
- **THEN** that collection is not used, and the back link falls back to the highest-ranked collection the product does belong to

#### Scenario: Shopper arrives from search results

- **WHEN** a shopper runs a search, optionally filters the results, and opens a product from them
- **THEN** the back link reads "Terug naar zoekresultaten" and links to the same query with the same filters

#### Scenario: Shopper arrives from a non-listing page

- **WHEN** a shopper browses a collection, then visits the homepage, and opens a product from a homepage section
- **THEN** the remembered collection is not used and the back link names the product's highest-ranked collection

#### Scenario: Shopper moves between product pages

- **WHEN** a shopper opens a product from a listing and then opens another product from the first product's page
- **THEN** the back link on the second product still returns to the same listing, subject to the membership rule for collections

#### Scenario: Direct entry with no browsing context

- **WHEN** a product is opened with no routing collection and no remembered listing
- **THEN** the back link names the highest-ranked collection the product belongs to, so a product-type collection is preferred over a broader occasion collection that also contains the product

#### Scenario: Scripting is unavailable

- **WHEN** the page is rendered without client-side scripting, such as for a crawler
- **THEN** the back link still renders a valid destination using the ranked collection

#### Scenario: Resolved destination settles without flicker

- **WHEN** a PDP loads and the resolved listing differs from the one rendered by the server
- **THEN** the shopper does not see the link's label visibly change from one name to another

#### Scenario: Product URLs stay free of collection segments

- **WHEN** a shopper opens a product from a collection listing
- **THEN** the resulting product URL contains no collection path segment

## ADDED Requirements

### Requirement: Returning to the listing restores the shopper's place
When the page the shopper navigated from is the same listing, at the same address, that the back link points to, activating the back link SHALL return through the browser's history rather than loading the listing again, so the browser can restore the shopper's scroll position and any page state it preserves. In every other case the back link SHALL navigate normally to its destination. Modified activations (opening in a new tab or window) SHALL always behave as a normal link.

#### Scenario: Shopper came straight from the listing

- **WHEN** a shopper scrolls down a filtered collection, opens a product, and activates the back link
- **THEN** the browser returns to the previous history entry, showing the filtered collection at the shopper's previous scroll position

#### Scenario: Shopper reached the product some other way

- **WHEN** the shopper reached the current product from another product page and activates the back link
- **THEN** the listing loads as a normal navigation, with the remembered filters applied

#### Scenario: Shopper opens the back link in a new tab

- **WHEN** the shopper activates the back link with a new-tab modifier
- **THEN** the listing opens in a new tab and the current tab's history is untouched

### Requirement: PDP exposes the full path as structured data
The PDP SHALL emit `BreadcrumbList` structured data describing the full path from the shop home through the server-resolved collection's navigation ancestors (as resolved for the collection hero) and the collection itself to the current product. This data SHALL be server-rendered and SHALL NOT depend on the shopper's remembered listing. When no collection is resolved, the list SHALL contain the shop home and the product only.

#### Scenario: Crawler reads a product in a nested category

- **WHEN** a crawler fetches a product whose highest-ranked collection sits under a parent in the main navigation
- **THEN** the page's structured data lists the home, that parent, the collection, and the product, in order and with positions

#### Scenario: Shopper context does not leak into structured data

- **WHEN** a shopper with a remembered search opens a product
- **THEN** the structured data still describes the server-resolved collection path, not the search

## REMOVED Requirements

### Requirement: Breadcrumb presentation follows the approved reference
**Reason**: It pinned measured appearance values (font size, line height, gaps) for a multi-entry trail that no longer exists. Per the project's altitude rule, appearance is recorded in CI-STYLE-TOKENS.md and not specified. The behavioral parts (arrow hidden from assistive technology, no horizontal overflow) moved into "PDP renders a single back link above the product section".
**Migration**: None. The styling lives in `assets/component-ob-pdp.css`.
