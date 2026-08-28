# storefront-price-format Specification

## Purpose
Formats product prices consistently through the theme's shared server-rendered price snippet, without changing currency labels that are not prices.

## Requirements

### Requirement: Euro prices omit the redundant currency code
Every shopper-facing euro amount SHALL retain the `€` symbol and SHALL omit a trailing `EUR` code. Currency codes shown as localization choices SHALL remain unchanged because they identify the selected market rather than repeat a price currency.

#### Scenario: Price includes a currency code
- **WHEN** theme or app content renders `€25,00 EUR`
- **THEN** the shopper sees `€25,-`

#### Scenario: Localization control identifies its currency
- **WHEN** the country selector renders `België | EUR €`
- **THEN** the `EUR` currency identifier remains visible

### Requirement: Whole-euro prices use the Dutch dash convention
A euro price whose cent value is exactly zero SHALL replace its decimal fraction with `,-`. A price with a non-zero cent value SHALL preserve both cent digits.

#### Scenario: Whole-euro price renders
- **WHEN** a shopper-facing amount is `€25,00`
- **THEN** it is displayed as `€25,-`

#### Scenario: Non-zero cent price renders
- **WHEN** a shopper-facing amount is `€7,99`
- **THEN** it remains `€7,99`

### Requirement: Shared product-price surfaces keep the same format
Every surface rendered through `snippets/price.liquid` SHALL use the same currency-code and zero-cent formatting, including collection cards, PDP prices, featured products, and predictive-search results. Section re-renders SHALL therefore arrive from Shopify already formatted rather than depending on a DOM text-rewrite pass.

#### Scenario: Product price arrives through a section response
- **WHEN** Dawn replaces a product card or predictive-search result with server-rendered markup
- **THEN** its product price is already formatted as `€50,-`
