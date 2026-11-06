## Purpose

Keeps sold-out products out of the storefront's product listings — collection pages and the homepage product rail — without the shopper seeing or being able to undo the filter that does it, while product pages themselves stay reachable.

## ADDED Requirements

### Requirement: Collection listings show only in-stock products
While the theme setting to hide sold-out products is on and the shop's Availability filter is enabled, every collection page SHALL list only products Shopify reports as in stock, and its product count SHALL count only those products. This SHALL hold on the first page load whatever URL the shopper arrived by, and after every listing update: applying or removing a filter value, removing a chip, clearing all filters, changing the sort order, browser back/forward, and loading more products.

#### Scenario: Arriving by a plain collection URL
- **WHEN** a shopper opens a collection URL without an availability parameter
- **THEN** the page they end on lists only in-stock products, and its product count matches that list

#### Scenario: Clearing all filters
- **WHEN** a shopper with active filters uses "clear all"
- **THEN** the remaining listing still contains only in-stock products

#### Scenario: Loading more
- **WHEN** a shopper loads the next page of products
- **THEN** no appended card is sold out

#### Scenario: Back after filtering
- **WHEN** a shopper applies a filter and then uses the browser's back button
- **THEN** the restored listing contains only in-stock products

### Requirement: The forced filter is invisible to the shopper
While collection listings are restricted to in-stock products, the collection filter UI on desktop and mobile SHALL NOT show an availability filter group, SHALL NOT show an active-filter chip for availability, and SHALL NOT count availability as an active filter (so "clear all" and active-filter counts appear only for filters the shopper chose).

#### Scenario: No filters chosen
- **WHEN** a shopper opens a collection and chooses no filters
- **THEN** no active-filter chip and no "clear all" link are shown

### Requirement: Disabled or unavailable means unchanged behavior
When the setting is off, or when the shop's Availability filter is not enabled, collection pages SHALL behave as without this capability: no redirect, sold-out products listed, and the availability facet shown if the shop enables it. A collection page SHALL never redirect more than once for this purpose.

#### Scenario: Availability filter not enabled in the shop
- **WHEN** the setting is on but the shop's filter configuration has no Availability filter
- **THEN** the collection page loads once, without redirect, and lists sold-out products as before

### Requirement: Homepage product rail skips sold-out products
While the setting is on, a featured-collection product rail SHALL omit sold-out products and SHALL still show up to its configured number of products when the collection has that many in-stock products among the first products it draws from.

#### Scenario: Collection with sold-out products near the top
- **WHEN** the rail is set to 8 products and 3 of the collection's first 8 products are sold out
- **THEN** the rail shows 8 in-stock products

### Requirement: Search and product pages are outside this capability
The theme SHALL NOT change which products search or predictive search return; that follows the shop's own out-of-stock search setting. Product pages of sold-out products SHALL remain reachable by URL.

#### Scenario: Direct link to a sold-out product
- **WHEN** a shopper opens a sold-out product's URL from a wishlist, cart or external link
- **THEN** the product page loads and shows the product as sold out
