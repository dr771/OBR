## MODIFIED Requirements

### Requirement: Gallery merchandising badges share one reference treatment
The sale and bestseller gallery badges SHALL share the measured 22px top-left inset, fully rounded accent pill, 0.6rem by 1.2rem padding, and white text. Every label SHALL render uppercase. The bestseller SHALL retain semibold 1.2rem text on a 1.6rem line, while the sale badge SHALL use the storefront sale-badge typography at 1.1rem, weight 500, 1.4rem line-height, and zero letter-spacing. When both states apply, both badges SHALL remain visible in a top-left vertical stack without overlap.

#### Scenario: Sale product is not a bestseller
- **WHEN** only the selected variant's sale status applies
- **THEN** its gallery pill keeps the bestseller badge's geometry, colour, and inset while using the sale-specific uppercase typography

#### Scenario: Sale product is also a bestseller
- **WHEN** the product is marked as a bestseller and the selected variant is on sale
- **THEN** both matching pills remain aligned at the gallery's top-left and are separated without overlap, with each badge retaining its own typography
