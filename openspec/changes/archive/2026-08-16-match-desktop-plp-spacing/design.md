## Context

At 1440px the Bolt PLP uses a 24px page inset, a 230px filter column, a 48px filter-to-grid gap, and a four-column 1099px product grid with 24px by 36px gaps. Dawn currently resolves the same region to a 50px inset, a 200px filter form with 20px padding, and 8px product-grid gaps.

## Goals / Non-Goals

**Goals:**

- Reproduce the measured desktop shell and grid geometry exactly at the reference viewport.
- Keep the override local to vertical collection PLPs.

**Non-Goals:**

- Mobile layout, card internals, typography, filter chrome, sorting behavior, and non-collection grids.

## Decisions

- Apply the values at Dawn's existing 990px desktop breakpoint. The requested scope is desktop-only and this avoids changing tablet/mobile behavior.
- Override the vertical PLP page inset and sidebar content-box geometry together. This reproduces the reference tracks while retaining Dawn's existing flex layout and AJAX replacement contracts.
- Set row and column gaps directly on `#product-grid` and recalculate four-column item widths from the same 24px horizontal gap. This avoids changing global grid-spacing settings used elsewhere.

## Risks / Trade-offs

- [The fixed reference measurements are optimized for the approved desktop composition] → Retain Dawn's 1600px maximum page width and flexible product-grid track so wider/narrower desktop viewports remain stable.
- [A global grid-token change would affect other sections] → Use selectors scoped to `.facets-vertical` and `#product-grid`.
