## ADDED Requirements

### Requirement: Desktop main navigation communicates hover and current-page state
At viewport widths of 990px and above, each top-level desktop navigation label SHALL darken on hover and reveal a 2px primary-blue underline that animates from zero to the label width over 300ms. The current page's top-level menu label, including a parent with an active child page, SHALL retain that same full-width primary-blue underline without relying on default text decoration. Keyboard focus SHALL receive the same visual underline while retaining the theme's existing focus treatment. Drawer and submenu navigation SHALL retain their existing behavior.

#### Scenario: Hovering a desktop top-level link
- **WHEN** a visitor hovers a top-level desktop navigation link
- **THEN** its label darkens and a 2px primary-blue underline expands from its leading edge to its label width over 300ms

#### Scenario: Current desktop navigation item
- **WHEN** the current page belongs to a top-level desktop navigation item
- **THEN** that item's label displays the same full-width primary-blue underline without default text decoration

#### Scenario: Keyboard focus
- **WHEN** keyboard focus reaches a top-level desktop navigation item
- **THEN** the item retains the existing focus treatment and displays the same underline cue

#### Scenario: Mobile and submenu navigation
- **WHEN** the navigation renders in the drawer or a desktop submenu
- **THEN** this desktop main-menu state styling does not change its existing behavior
