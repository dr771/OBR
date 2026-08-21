## Context

See proposal.md - Why. Single-property CSS change in one existing rule block in `assets/component-ob-swatches.css`; no cross-cutting architecture, new dependency, or migration complexity.

## Goals / Non-Goals

**Goals:**
- Add the hairline border on active/hover/focus-visible PLP card chips without disturbing the existing surface-lightness cue or rail geometry.

**Non-Goals:**
- No change to resting-state chips, PDP chips (`ob-swatch-input`), unavailable-chip styling, or rail overflow/chevron behavior.

## Decisions

- Add the border only to the existing `#ProductGridContainer .product-card-wrapper .ob-card-swatch--active, :hover, :focus-visible` rule (component-ob-swatches.css:452-456) rather than touching the base `.ob-card-swatch` (unscoped) rule at line 150-153, which is a different, less-specific rule not used on the PLP grid. Keeps the change scoped to the PLP surface the request targeted.
- Leave the resting-state transparent border (`border: 0.1rem solid transparent` on the base `.ob-card-swatch` rule, line 438-446) untouched — it must stay transparent at rest so chips don't gain a border cue when nothing is selected/hovered/focused, and its width must keep matching the interactive border's width (`0.1rem`) so no state shifts chip geometry.
- Update the stale rationale comment above the rule block (lines 421-433, "Selection is a difference in *surface* lightness, not a drawn edge") since it will no longer be accurate once a border is drawn on interactive states.

## Risks / Trade-offs

- [Comment at component-ob-swatches.css:150-153 documents an older, differently-scoped `.ob-card-swatch--active`/`:focus-visible` rule with the same "no border" framing] → out of scope for this change (not on the PLP grid path); leave as-is unless a future change targets that surface too.
