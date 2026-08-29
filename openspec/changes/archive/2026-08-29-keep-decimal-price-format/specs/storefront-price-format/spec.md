## ADDED Requirements

### Requirement: Euro prices retain two decimal digits
Every product price SHALL retain Shopify's standard two-digit cent fraction, including `,00` for whole-euro amounts and the actual cent digits for non-zero-cent amounts.

#### Scenario: Whole-euro price renders
- **WHEN** a shopper-facing product amount is `€25,00`
- **THEN** it remains displayed as `€25,00`

#### Scenario: Non-zero-cent price renders
- **WHEN** a shopper-facing product amount is `€7,99`
- **THEN** it remains displayed as `€7,99`

## MODIFIED Requirements

### Requirement: Euro prices omit the redundant currency code
Every shopper-facing euro product amount SHALL retain the `€` symbol and SHALL omit a trailing `EUR` code. Currency codes shown as localization choices SHALL remain unchanged because they identify the selected market rather than repeat a price currency.

#### Scenario: Price includes a currency code
- **WHEN** the shared product-price renderer would otherwise output `€25,00 EUR`
- **THEN** the shopper sees `€25,00`

#### Scenario: Localization control identifies its currency
- **WHEN** the country selector renders `België | EUR €`
- **THEN** the `EUR` currency identifier remains visible

### Requirement: Shared product-price surfaces keep the same format
Every surface rendered through `snippets/price.liquid` SHALL use the same symbol-only, two-decimal formatting, including collection cards, PDP prices, featured products, and predictive-search results. Section re-renders SHALL therefore arrive from Shopify already formatted rather than depending on a DOM text-rewrite pass.

#### Scenario: Product price arrives through a section response
- **WHEN** Dawn replaces a product card or predictive-search result with server-rendered markup
- **THEN** its whole-euro product price is already formatted as `€50,00`

## REMOVED Requirements

### Requirement: Whole-euro prices use the Dutch dash convention
**Reason**: The owner has withdrawn the `,-` presentation and confirmed that Shopify's original `,00` fraction must remain.

**Migration**: Remove the modulo-based `,00` to `,-` replacement and rely on Shopify's symbol-only `money` output.
