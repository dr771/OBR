## RENAMED Requirements

- FROM: `### Requirement: Breadcrumb is a simple two-level "Home / {title}" trail`
- TO: `### Requirement: Breadcrumb shows the collection's path in the main navigation`

## MODIFIED Requirements

### Requirement: Breadcrumb shows the collection's path in the main navigation
The hero's breadcrumb SHALL show "Home" (linking to `routes.root_url`), then, when the page is a collection, each ancestor under which that collection is nested in the `main-menu` navigation (outermost first, each linking to its menu destination), then the current page or collection title as the current entry. Ancestors SHALL come from the navigation menu alone, not from per-product data or the PIM feed. When a collection appears in the menu more than once, the first occurrence in menu order SHALL determine its ancestors. A menu item that links to its own parent's destination (an "All …" entry) SHALL NOT count as an occurrence. A collection that is absent from the menu, or that is itself a top-level menu item, SHALL render "Home" followed by its title only. Callers that are not a collection (such as the Merken page) SHALL render "Home" followed by their title.

#### Scenario: Category nested under a parent
- **WHEN** a visitor views `/collections/ballerinas`, which the main menu nests under "Schoenen"
- **THEN** the breadcrumb SHALL read "Home / Schoenen / Ballerina's", with "Home" and "Schoenen" as links and "Ballerina's" as the current page

#### Scenario: Top-level collection
- **WHEN** a visitor views `/collections/schoenen`, a top-level menu item
- **THEN** the breadcrumb SHALL read "Home / Schoenen"

#### Scenario: Collection listed under two parents
- **WHEN** a collection is nested under two different top-level menu items
- **THEN** the breadcrumb SHALL use the parent that comes first in menu order

#### Scenario: Collection not in the menu
- **WHEN** a visitor views a collection the main menu does not contain
- **THEN** the breadcrumb SHALL read "Home / <collection title>" with no empty or placeholder entry

#### Scenario: Assistive technology reads the trail
- **WHEN** a screen reader encounters the hero breadcrumb
- **THEN** it is exposed as a navigation landmark with a localized label, separators are not announced, and the final entry is announced as the current page
