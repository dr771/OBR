## Purpose

Presents the header's predictive product search results as a scannable, image-forward grid on desktop, keeps the same result set usable on mobile, and ensures the open search surface never gets visually trapped beneath other floating UI on the page.

## ADDED Requirements

### Requirement: Responsive predictive product layout
The header predictive-search surface SHALL present no more than eight product matches in a two-column grid at desktop widths of 750px and above, and SHALL retain a single-column result flow below 750px.

#### Scenario: Desktop product matches
- **WHEN** predictive search returns product matches at a viewport width of at least 750px
- **THEN** up to eight product matches are displayed in two columns while retaining their source order

#### Scenario: Mobile product matches
- **WHEN** predictive search returns product matches at a viewport width below 750px
- **THEN** up to eight product matches remain in a single-column list

#### Scenario: More than eight product matches
- **WHEN** Shopify returns more than eight predictive product matches
- **THEN** the widget renders only the first eight product cards

### Requirement: Prominent responsive product imagery
Desktop predictive product cards SHALL display product imagery at 115px by 140px using an appropriate higher-resolution source candidate, while mobile cards SHALL retain the compact 50px presentation.

#### Scenario: Desktop high-density display
- **WHEN** a desktop predictive product image is rendered on a high-density display
- **THEN** the browser can select an image candidate of at least 230px source width for the 115px display width

#### Scenario: Mobile compact image
- **WHEN** a predictive product image is rendered below 750px
- **THEN** its displayed width remains 50px

### Requirement: Product text and configured price
Each predictive product card SHALL retain the product title and SHALL display the product price whenever the merchant's predictive-search price setting is enabled.

#### Scenario: Price setting enabled
- **WHEN** predictive-search prices are enabled and a product match is rendered
- **THEN** the card displays the product title and its formatted price

### Requirement: Translatable suggested-products heading
The predictive product group SHALL use a merchant-translatable "Suggested products" label, rendered in uppercase with greater visual emphasis than Dawn's default generic product heading, and every other predictive result-group heading (suggestions, pages) SHALL share that same visual treatment.

#### Scenario: Product suggestions are displayed
- **WHEN** predictive search returns one or more product matches
- **THEN** the product group is introduced by the localized "Suggested products" label in a larger bold uppercase treatment

#### Scenario: Non-product groups are displayed
- **WHEN** predictive search renders a suggestions or pages group heading
- **THEN** that heading uses the same size, weight, and uppercase treatment as the "Suggested products" heading

### Requirement: Product-card hover treatment
Predictive product cards SHALL remain visually unfilled on pointer hover while retaining the native selected-result feedback used for keyboard navigation.

#### Scenario: Pointer hovers a product suggestion
- **WHEN** a shopper points at a predictive product card
- **THEN** the card background remains transparent

#### Scenario: Keyboard selects a predictive result
- **WHEN** keyboard navigation marks a predictive result as selected
- **THEN** the native selected-result background remains visible

### Requirement: Native predictive-search interaction preservation
The layout SHALL preserve Shopify's existing predictive-search listbox semantics, keyboard result order, loading state, result links, and full-search submission behavior while adapting the bottom action to the visible product set.

#### Scenario: Keyboard traversal
- **WHEN** a shopper navigates predictive results with the keyboard
- **THEN** focus selection follows the original DOM result order regardless of the two-column visual layout

#### Scenario: Results exceed available height
- **WHEN** the predictive results are taller than the available search surface
- **THEN** the existing predictive-search container remains scrollable

#### Scenario: Returned product set exceeds visible limit
- **WHEN** Shopify returns more than eight predictive product matches
- **THEN** a translatable "See all results" action submits the current search term to the full search page

#### Scenario: One to eight product matches
- **WHEN** Shopify returns between one and eight predictive product matches
- **THEN** no redundant full-results action is displayed below the cards

#### Scenario: No product matches
- **WHEN** Shopify returns no predictive product matches
- **THEN** the native localized "Search for …" action remains available

### Requirement: Search surface stacking precedence
While the header search disclosure is open, the header search surface SHALL stack above Wishlist King collection-card controls. Closing search SHALL restore the normal page stacking and wishlist interaction behavior. The cart drawer's own stacking precedence SHALL remain above the header search layer at all times.

#### Scenario: Search opened over product cards
- **WHEN** header predictive search is open above a product grid containing Wishlist King hearts
- **THEN** no collection-card heart is visible or clickable above the search surface or its backdrop

#### Scenario: Search closed
- **WHEN** header predictive search is closed
- **THEN** Wishlist King hearts retain their normal card position and interaction behavior

#### Scenario: Cart drawer precedence
- **WHEN** a top-level cart drawer is opened while header search is also open
- **THEN** the cart drawer remains above the header search layer
