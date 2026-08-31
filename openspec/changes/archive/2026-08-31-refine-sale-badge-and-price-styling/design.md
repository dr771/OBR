## Context

Original Brands uses Dawn's `.badge` primitive for native sale/sold-out badges and an `.ob-badge` primitive for bestseller and PDP gallery badges. Product cards currently colour bestseller blue and native sale black; the requested hierarchy reverses those roles. Sale prices are rendered through the shared Dawn price markup, so the current and compare-at amounts already have stable semantic classes.

## Goals / Non-Goals

**Goals:**

- Make badge casing consistent across every theme-owned surface.
- Style only sale badges with the requested type values without affecting sold-out or bestseller typography.
- Promote the PDP's established `#38B6FF` accent to a global `--ob-accent` token and reuse it for sale badges and current sale amounts.
- Keep compare-at prices grey and subordinate.

**Non-Goals:**

- Change percentage calculation, price order, sale eligibility, badge placement, or card/PDP geometry.
- Restyle app-owned badges whose markup is outside the theme's badge primitives.
- Change regular non-sale prices.

## Decisions

- Add semantic `badge--sale` / `ob-badge--sale` modifiers in Liquid rather than infer sale state from colour-scheme classes or ID prefixes. This keeps sold-out badges unaffected and makes the CSS portable across section instances.
- Add `text-transform: uppercase` to both shared badge primitives. Product-card bestseller already resolves uppercase, but the shared rule also covers PDP bestseller and native badges elsewhere.
- Keep the existing per-surface padding and radius declarations. The new sale line-height is allowed to determine the text box while the pill geometry remains driven by its existing padding/border treatment.
- Set the current PLP sale amount to semibold at full opacity so the resolved colour is the actual brand accent; the compare-at amount retains its current weight, grey opacity, and strike-through.

## Risks / Trade-offs

- **Native sold-out badge accidentally inherits sale type** -> target the new sale modifier and `.price__badge-sale`, not `.badge` typography globally.
- **Colour-scheme class overrides PLP sale blue** -> use the card-scoped semantic modifier after the generic card badge rule.
- **PDP and PLP price rules leak elsewhere** -> scope them to `.ob-pdp` and `.product-card-wrapper` respectively.
