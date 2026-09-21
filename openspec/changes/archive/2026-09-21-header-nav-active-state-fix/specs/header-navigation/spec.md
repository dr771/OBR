## MODIFIED Requirements

### Requirement: Desktop main navigation communicates hover and current-page state
At viewport widths of 990px and above, each top-level desktop navigation label SHALL darken on hover and reveal a 2px primary-blue underline that animates from zero to the label width over 300ms. The current page's top-level menu label, including a parent with an active child page, SHALL retain that same full-width primary-blue underline without relying on default text decoration. Keyboard focus SHALL receive the same visual underline while retaining the theme's existing focus treatment. Desktop submenu (dropdown) links SHALL receive the equivalent hover and current-item underline treatment as top-level links, replacing the theme's default text-decoration underline for the active submenu item. Drawer navigation SHALL retain its existing behavior.

#### Scenario: Hovering a desktop top-level link
- **WHEN** a visitor hovers a top-level desktop navigation link
- **THEN** its label darkens and a 2px primary-blue underline expands from its leading edge to its label width over 300ms

#### Scenario: Current desktop navigation item
- **WHEN** the current page belongs to a top-level desktop navigation item
- **THEN** that item's label displays the same full-width primary-blue underline without default text decoration

#### Scenario: Keyboard focus
- **WHEN** keyboard focus reaches a top-level desktop navigation item
- **THEN** the item retains the existing focus treatment and displays the same underline cue

#### Scenario: Desktop submenu current item
- **WHEN** a desktop submenu (dropdown) link is the current page
- **THEN** that link displays the same 2px primary-blue underline, color, thickness, and offset as a current top-level item, instead of the theme's default text-decoration underline

#### Scenario: Mobile navigation
- **WHEN** the navigation renders in the drawer
- **THEN** this desktop main-menu state styling does not change its existing behavior

## ADDED Requirements

### Requirement: Exactly one top-level navigation item is active at a time
When a collection or page is linked from more than one top-level desktop navigation branch simultaneously, exactly one of those branches SHALL display the active/current-item state defined above; the others SHALL NOT. When the Merken brand-directory item is one of the conflicting branches, Merken SHALL NOT be the branch marked active — another matching top-level item SHALL win instead. Merken SHALL still display the active state when it is the only matching top-level item, including when it is itself the current page.

#### Scenario: Brand collection reachable via a needs-collection and Merken
- **WHEN** the current page is a brand collection linked both from a needs-collection top-level item (e.g. Fashion & Lifestyle, Outdoor & Werk) and from the Merken directory
- **THEN** the needs-collection top-level item displays the active state and Merken does not

#### Scenario: Merken page itself
- **WHEN** the current page is the Merken directory page and no other top-level item's children match the current page
- **THEN** the Merken top-level item displays the active state
