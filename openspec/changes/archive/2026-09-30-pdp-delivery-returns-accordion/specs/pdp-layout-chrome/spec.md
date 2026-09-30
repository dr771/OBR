## MODIFIED Requirements

### Requirement: Configured collapsible detail panels use the reference treatment

PDP detail accordions SHALL render as a consistent stack in the information column. Each trigger SHALL carry a chevron that reflects its panel's state. A product-specific panel with no source content SHALL be omitted without an empty panel or stray divider, while the shop-wide delivery and returns panel remains available.

Note: the reference shows four named panels. `Productdetails` and `Materiaal & onderhoud` use Akeneo-synced product content, `Bezorging & retour` uses shared merchant-managed template content, and `Pasvorm & maatadvies` remains unconfigured until its product data exists.

#### Scenario: Product has description and materials content

- **WHEN** a PDP renders its product-specific accordions and the shared delivery and returns panel
- **THEN** they form one visually consistent stack whose triggers and chevrons respond to toggling

#### Scenario: A product-specific field is blank

- **WHEN** a PDP lacks description or materials content
- **THEN** that product-specific panel is omitted without an orphaned divider, while the delivery and returns panel still renders

#### Scenario: Keyboard user operates a panel

- **WHEN** a keyboard user focuses and activates a panel trigger
- **THEN** the panel toggles, the trigger exposes its expanded state to assistive technology, and focus remains on the trigger
