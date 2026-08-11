## Purpose

Provides immediate, stable product-grid feedback while native facet and sort requests are being prepared and fetched.

## ADDED Requirements

### Requirement: Facet and sort input immediately enters a skeleton state
The collection/search product grid SHALL enter a busy skeleton state within the same input event tick when a facet checkbox, radio, select, active-filter removal, or sort control changes, before any request debounce elapses. The replacement section markup SHALL clear that state automatically.

#### Scenario: Shopper toggles a discrete facet
- **WHEN** a shopper changes a checkbox, radio, or select facet value
- **THEN** every existing card immediately displays the skeleton treatment and the grid exposes a busy state before the fetch begins

#### Scenario: Shopper changes sorting
- **WHEN** a shopper selects a different sort value
- **THEN** the same immediate skeleton treatment appears

#### Scenario: New results replace the grid
- **WHEN** the fetched section markup replaces the old product-grid contents
- **THEN** the skeleton and busy states disappear because the new markup does not carry them

### Requirement: Skeleton preserves existing card geometry
The skeleton SHALL reuse the existing card DOM, count, columns, media ratio, and text-line geometry rather than injecting a separate placeholder grid, so entering and leaving the state introduces no product-grid reflow.

#### Scenario: Grid enters loading state
- **WHEN** skeleton feedback is applied
- **THEN** card count, column count, card widths, and media-box heights remain unchanged

#### Scenario: Reduced motion is requested
- **WHEN** the shopper prefers reduced motion
- **THEN** skeleton placeholders remain visible without a shimmer animation

### Requirement: Discrete controls use a short coalescing debounce
Facet checkboxes, radios, selects, active-filter removals, and sort selects SHALL dispatch their result request no later than 300ms after the last rapid discrete input, while coalescing successive changes inside that window.

#### Scenario: Shopper toggles one checkbox
- **WHEN** no further discrete input follows
- **THEN** the result request begins within 300ms

#### Scenario: Shopper rapidly toggles several checkboxes
- **WHEN** the inputs occur within the debounce window
- **THEN** one request is sent for the final combined state

### Requirement: Free-text price inputs retain a longer debounce
Price-range text/number inputs SHALL wait at least 800ms after the last keystroke before dispatching a result request.

#### Scenario: Shopper types a price
- **WHEN** the shopper enters several digits without pausing for 800ms
- **THEN** no intermediate request is dispatched for each keystroke

