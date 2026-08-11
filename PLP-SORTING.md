# PLP sorting

Collection pages intentionally expose four customer-facing sort choices, in this order:

1. **Bestsellers** (`best-selling`)
2. **Prijs: laag naar hoog** (`price-ascending`)
3. **Prijs: hoog naar laag** (`price-descending`)
4. **Uitgelicht** (`manual`)

Search pages retain Shopify's native search sort choices. The restriction applies only to collection PLPs.

## Curating “Uitgelicht”

“Uitgelicht” uses Shopify's manual collection order. In Shopify Admin:

1. Open **Products → Collections**.
2. Open the collection you want to curate.
3. In the Products list, set **Sort** to **Manually**.
4. Drag products into the desired order and save.

Manual ordering requires permission to edit products and collections. It does not change the collection's default storefront sort by itself; the shopper must choose “Uitgelicht” unless that collection's default sort is also set to manual.

## Existing unsupported defaults

Some collections, including `/collections/all`, can initially use a Shopify sort value outside the four approved choices (for example A–Z). The PLP keeps that active value as a hidden selected option so the native select remains truthful. Once a shopper chooses an approved choice, the unsupported fallback is no longer offered.

## Implementation

The shared option markup lives in `snippets/ob-plp-sort-options.liquid` and is rendered by the desktop, horizontal, and mobile collection controls. Keep the approved values and their order centralized there. Do not apply the collection whitelist to search results.
