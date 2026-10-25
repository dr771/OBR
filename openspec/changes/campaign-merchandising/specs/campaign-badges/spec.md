## ADDED Requirements

### Requirement: Campaign badges come from published campaign collections
A product SHALL show a campaign badge only through membership of a campaign collection: a collection whose handle starts with `actie-` and whose `custom.campaign_badge` metafield holds non-blank text. The badge SHALL display that text verbatim. Membership SHALL be read from the product's collections as the Online Store channel sees them, so a campaign collection that is not published to the Online Store SHALL produce no badge. No theme code, product tag or product metafield SHALL be able to add a campaign badge by other means.

#### Scenario: Product is in a published campaign collection
- **WHEN** a product belongs to the published collection `actie-black-friday` whose badge text is `-20%`
- **THEN** the product shows a campaign badge reading `-20%`

#### Scenario: Collection has the prefix but no badge text
- **WHEN** a product belongs to `actie-black-friday` and that collection's badge text is blank
- **THEN** no campaign badge renders for it

#### Scenario: Collection carries badge text without the prefix
- **WHEN** a product belongs to a collection whose handle does not start with `actie-`, even if that collection has badge text
- **THEN** that collection contributes no campaign badge

#### Scenario: Campaign collection is not published to the Online Store
- **WHEN** the campaign collection exists in Admin but is not available on the Online Store channel
- **THEN** no campaign badge renders for its products

#### Scenario: Discount code restricted to a customer group
- **WHEN** a newsletter or staff discount code applies to a product but no campaign collection contains it
- **THEN** the product shows no campaign badge

#### Scenario: Metafield definitions are absent from the shop
- **WHEN** the campaign metafields are not defined in the shop at all
- **THEN** every product surface renders normally, with no campaign badge and no error

### Requirement: A campaign badge shows only inside its run time
A campaign collection's optional `custom.campaign_starts_at` and `custom.campaign_ends_at` date-times SHALL bound when its badge is visible: an unset start means already started, an unset end means open-ended. The run time SHALL be evaluated when the page is rendered and again against the shopper's clock once the page is in the browser, so that a page served from cache shows the badge from its start and hides it from its end without waiting for the cache to refresh.

#### Scenario: Campaign has not started yet
- **WHEN** the current time is before the campaign's start
- **THEN** its badge is not visible

#### Scenario: Campaign has ended
- **WHEN** the current time is at or after the campaign's end
- **THEN** its badge is not visible

#### Scenario: Cached page outlives the campaign end
- **WHEN** a page rendered while the campaign was running is served after its end
- **THEN** the badge is hidden in the browser

#### Scenario: Cached page was rendered before the campaign start
- **WHEN** a page rendered before the campaign's start is served after the start, and the campaign has not ended
- **THEN** the badge is shown in the browser

#### Scenario: No dates set
- **WHEN** neither start nor end is set
- **THEN** the badge is visible for as long as the product is in the collection

### Requirement: One campaign badge per product with a deterministic precedence
A product SHALL show at most one campaign badge. When several of its campaign collections are inside their run time, the badge SHALL come from the one with the highest `custom.campaign_priority` (unset counts as 0); on equal priority from the one that ends first (open-ended counts as last); on a further tie from the handle that sorts first. Precedence SHALL be decided among the campaigns inside their run time at the moment of evaluation, so a higher-priority campaign that has not started or has ended SHALL NOT suppress a running one.

#### Scenario: Two running campaigns with different priority
- **WHEN** a product is in running campaigns with priorities 10 and 0
- **THEN** only the priority-10 badge shows

#### Scenario: Equal priority, different end
- **WHEN** a product is in two running campaigns of equal priority, one ending 30 November and one open-ended
- **THEN** only the badge of the campaign ending 30 November shows

#### Scenario: Higher-priority campaign has ended
- **WHEN** the higher-priority campaign has ended and a lower-priority one is still running
- **THEN** the lower-priority campaign's badge shows

### Requirement: Campaign badges render on every product surface
The campaign badge SHALL follow the same rule on every shared product card surface (collection grid, search, featured collections, recommendations, wishlist, and cards inserted after page load by filtering, load-more or recommendations) and on the PDP gallery. On cards inserted after page load the run-time check SHALL apply as on the initial page.

#### Scenario: Card renders outside a collection grid
- **WHEN** a campaign product appears as a card in search results or related products
- **THEN** it shows the same campaign badge as on the collection grid

#### Scenario: Grid is replaced by a filter change
- **WHEN** the shopper changes a filter and Dawn replaces the product grid
- **THEN** the new cards show campaign badges according to the run time and precedence rules

#### Scenario: PDP of a campaign product
- **WHEN** a campaign product's PDP renders
- **THEN** the campaign badge appears over the gallery

### Requirement: A visible sale badge suppresses the campaign badge
Reduced prices (compare-at from ERP/Akeneo) and campaigns SHALL never be advertised together: wherever the sale badge is visible — for the colour a card currently shows, or for the PDP's selected variant — the campaign badge SHALL NOT be visible. When the shopper switches to a colour or variant without a visible sale badge, the campaign badge SHALL reappear if its campaign is inside its run time, without a page reload. The campaign badge SHALL NOT change whether the sale or bestseller badges render or what the sale badge states. Campaign collections are expected to exclude reduced products (`DISCOUNTS.md`); this rule is the storefront's guarantee for products that are partly reduced or were added by hand.

#### Scenario: Reduced colour in a running campaign
- **WHEN** a card shows a reduced colour of a product that is in a running campaign
- **THEN** the sale badge with its percentage is visible and the campaign badge is not

#### Scenario: Shopper switches the card to a full-price colour
- **WHEN** the shopper selects a full-price colour chip on that card
- **THEN** the sale badge hides and the campaign badge appears

#### Scenario: PDP variant changes between reduced and full price
- **WHEN** the shopper selects a reduced variant on the PDP of a campaign product, then a full-price one
- **THEN** the gallery shows only the sale badge for the reduced variant and only the campaign badge for the full-price one

#### Scenario: Bestseller in a running campaign
- **WHEN** a bestseller product is in a running campaign
- **THEN** the bestseller and campaign badges are both visible without overlap

### Requirement: The PDP says where the campaign discount is applied
Because Shopify applies automatic discounts only in the cart, the PDP price stays at the full price while a campaign runs. Wherever the PDP gallery shows a campaign badge, the PDP SHALL also show, next to the price, a translatable note that names the badge text and states that the discount is applied in the cart. The note SHALL follow the badge's run time, precedence and sale suppression exactly, so the note and the gallery badge are always visible together or not at all.

#### Scenario: Full-price variant in a running campaign
- **WHEN** the PDP of a running-campaign product shows a variant without a sale badge
- **THEN** the gallery shows the campaign badge and the price is followed by a note such as `-15%: korting wordt verrekend in je winkelwagen`

#### Scenario: Shopper selects a reduced variant
- **WHEN** the shopper switches to a variant whose sale badge is visible
- **THEN** both the campaign badge and the note disappear

#### Scenario: Campaign not running
- **WHEN** no campaign of the product is inside its run time
- **THEN** no note renders
