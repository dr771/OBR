## ADDED Requirements

### Requirement: Free-shipping threshold is a theme setting
The free-shipping threshold SHALL come from a theme setting in euros. When the setting is blank or 0, no free-shipping progress message SHALL render in the cart drawer or on the cart page. The theme SHALL NOT attempt to derive the threshold from shipping rates or discounts.

#### Scenario: Threshold not set
- **WHEN** the threshold setting is blank
- **THEN** neither the cart drawer nor the cart page shows a free-shipping message, and no space is reserved for it

#### Scenario: Threshold set
- **WHEN** the threshold setting is 70
- **THEN** the cart drawer and the cart page show the free-shipping message for a non-empty cart

### Requirement: Progress is computed against the cart total after discounts
The message SHALL state the amount still missing as the threshold minus the cart total after all line and cart discounts, excluding shipping. At or above the threshold it SHALL state that shipping is free instead. An empty cart SHALL show no message.

#### Scenario: Cart below the threshold
- **WHEN** the threshold is EUR 70 and the cart total after discounts is EUR 52.50
- **THEN** the message states that EUR 17.50 more is needed for free shipping

#### Scenario: Discount pushes the cart below the threshold
- **WHEN** a cart of EUR 75 receives a discount bringing its total to EUR 67.50
- **THEN** the message states that EUR 2.50 more is needed

#### Scenario: Cart reaches the threshold
- **WHEN** the cart total after discounts is at or above EUR 70
- **THEN** the message states that shipping is free

### Requirement: Progress can be limited to shipping countries
An optional theme setting SHALL list the country codes the threshold applies to. When the list is set, the message SHALL render only when the shopper's storefront country is in it. When it is blank, the message SHALL render for every country.

#### Scenario: Shopper outside the listed countries
- **WHEN** the countries setting is `BE,NL` and the shopper's storefront country is DE
- **THEN** no free-shipping message renders

#### Scenario: Shopper inside the listed countries
- **WHEN** the countries setting is `BE,NL` and the shopper's storefront country is BE
- **THEN** the free-shipping message renders

### Requirement: Progress follows cart changes without a reload
The message in the cart drawer and on the cart page SHALL reflect the current cart after every add-to-cart, quantity change, line removal and discount-code change, without a page reload.

#### Scenario: Quantity change in the drawer
- **WHEN** the shopper raises a line's quantity in the cart drawer so the total crosses the threshold
- **THEN** the drawer's message changes from the missing amount to free shipping without a reload

#### Scenario: Add to cart from the PDP
- **WHEN** the shopper adds a product and the cart drawer opens
- **THEN** the message reflects the cart including the new line

#### Scenario: Line removed on the cart page
- **WHEN** the shopper removes a line on `/cart` so the total drops below the threshold
- **THEN** the cart page's message states the new missing amount without a reload
