## MODIFIED Requirements

### Requirement: Collection hero links to the collection's menu group
A collection page's hero SHALL render a navigation landmark of links to the collection's group in the `main-menu` navigation. The collection's position in the menu SHALL be resolved by the same rule as the hero breadcrumb (first occurrence in menu order, matched on the linked collection, "All …" self-links not counting as occurrences), so the links and the breadcrumb always agree.

The group SHALL be the matched menu item itself when it has child items. Otherwise it SHALL be the matched item's parent. The links SHALL be, in menu order: first, when the viewed collection is not the group itself, the group's own "All …" entry (the child whose destination equals the group's, using that child's title), or the group item under its own title when no such child exists; then each other child of the group. When the viewed collection is the group itself, the "All …" entry SHALL be omitted, so no link points at the page being viewed. The link for the page being viewed, when present, SHALL be marked as the current page.

A child SHALL be shown only when it links to a collection that contains at least one product. Children linking to anything else (pages, placeholders, external URLs) SHALL be omitted. When fewer than two links remain, the whole row SHALL be omitted. A collection that is absent from the menu, or that sits at the top level with no children, SHALL render no row.

#### Scenario: Top-level collection
- **WHEN** a visitor views `/collections/schoenen`, a top-level menu item with children
- **THEN** the hero shows only its children that contain products, with no "Alle schoenen" link and no link marked as current

#### Scenario: Sub-collection
- **WHEN** a visitor views `/collections/ballerinas`, which the menu nests under Schoenen
- **THEN** the hero shows the same Schoenen group, with "Alle schoenen" first, linking to `/collections/schoenen`, and "Ballerina's" marked as current

#### Scenario: Group with a single stocked child
- **WHEN** a visitor views a group's own page and only one of its children links to a collection with products
- **THEN** no link row is rendered

#### Scenario: Placeholder and empty entries
- **WHEN** a group contains a menu item that links to `#` or to a collection without products
- **THEN** that item is not shown

#### Scenario: Collection outside the menu
- **WHEN** a visitor views a collection the main menu does not contain
- **THEN** no link row is rendered and the hero is otherwise unchanged

#### Scenario: Non-collection hero
- **WHEN** the hero is rendered by a non-collection caller such as the Merken page
- **THEN** no link row is rendered

#### Scenario: Assistive technology reads the links
- **WHEN** a screen reader encounters the link row
- **THEN** it is exposed as a navigation landmark with a localized label, and a link to the current collection, when present, is announced as the current page
