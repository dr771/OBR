## Purpose

Keeps shoppers within the document after native grid replacements shrink the page, without introducing proactive scrolling.

## ADDED Requirements

### Requirement: Shrinking grid replacements clamp invalid scroll positions
After a collection/search facet, sort, active-filter removal, or browser back/forward action replaces the product grid with a shorter result set, the page SHALL clamp `window.scrollY` to the new maximum valid document offset when and only when the previous position is out of bounds.

#### Scenario: Filtering produces a short result set while scrolled down
- **WHEN** the previous scroll position exceeds the new document's maximum offset after the grid swap
- **THEN** the page instantly moves to `document.documentElement.scrollHeight - window.innerHeight`, bounded at zero

#### Scenario: New document remains tall enough
- **WHEN** the previous scroll position remains valid after the grid swap
- **THEN** the shopper's scroll position remains unchanged

#### Scenario: Browser history restores a shorter filter state
- **WHEN** back/forward navigation renders a shorter cached or fetched grid while the current position is out of bounds
- **THEN** the same maximum-offset clamp applies

#### Scenario: Load more appends products
- **WHEN** the shopper uses “Toon meer”
- **THEN** no clamp runs because the grid grows instead of being replaced by a shorter state

### Requirement: Scroll correction is never proactive or animated
The correction SHALL NOT target the grid, top of page, or another element and SHALL NOT use smooth scrolling; its only possible movement is an instant reduction to the maximum valid offset.

#### Scenario: Current scroll position is valid
- **WHEN** clamp logic runs after a grid replacement and the current offset is within bounds
- **THEN** no scrolling API is invoked

