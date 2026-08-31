# storefront-badge-treatment Specification

## Purpose
Defines the shared casing and sale-specific typography for theme-owned badge primitives across storefront surfaces.

## Requirements
### Requirement: Theme-owned badge labels render uppercase
Every badge rendered through Dawn's shared `.badge` primitive or Original Brands' `.ob-badge` primitive SHALL display its label in uppercase on every storefront surface.

#### Scenario: Text badge renders
- **WHEN** a sale, sold-out, bestseller, or other theme-owned text badge is visible
- **THEN** its computed `text-transform` is `uppercase`

### Requirement: Sale badges use their own typography
Sale badges SHALL render in the body font at `1.1rem`, weight `500`, `1.4rem` line-height, and zero letter-spacing. This treatment SHALL NOT change bestseller or sold-out badge typography.

#### Scenario: Sale and bestseller badges render on one page
- **WHEN** the storefront shows both badge types
- **THEN** the sale badge uses `1.1rem / 500 / 1.4rem / 0` while the bestseller retains its established typography
