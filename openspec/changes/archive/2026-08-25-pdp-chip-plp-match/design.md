## Context

See proposal.md - Why. The current PDP chip rules live in `assets/component-ob-pdp.css` (`.ob-pdp .ob-swatch-input__chip` and related hover/checked/focus rules), scoped under `.ob-pdp` specifically so they win over the shared base chip rule in `assets/component-ob-swatches.css` (used by both PLP and PDP) without touching that shared file. The same file also holds the PDP's main-image frame (`.ob-pdp .product__media-wrapper .product__media`/`.media`) and thumbnail rail (`.ob-pdp .thumbnail`) rules, styled to the Bolt reference (white surface, always-visible hairline, ink border + ring on selection) by the earlier `match-pdp-to-proto` change. The PLP's blended-surface treatment lives in the shared file, scoped under `.card-wrapper.product-card-wrapper .ob-card-swatch` and `.card-wrapper.product-card-wrapper .card__inner .card__media`, and depends on a `--ob-product-photo-surface` custom property set on the card wrapper.

## Goals / Non-Goals

**Goals:**
- All three PDP gallery surfaces — color chips, main image, thumbnail rail — visually match the PLP's blended-surface treatment: same blended background formula, same borderless-at-rest + hairline-on-interaction border, same image blend mode.
- Keep the change scoped to `.ob-pdp`-prefixed rules in `component-ob-pdp.css` — no edits to the shared `component-ob-swatches.css`, so PLP is untouched and the file's existing "shared base, per-surface override" pattern continues.

**Non-Goals:**
- Making PDP chip size formula-driven like the PLP rail (explicitly rejected in favor of a fixed rem value — the PDP rail's container width isn't a product card and porting the calc would produce an unrelated number).
- Changing rail behavior, chevrons, scrollbar, overflow cues, or the picker-scoped rollback switch — untouched.
- Changing the size-picker boxes, main image/thumbnail radii, or the counter row — untouched, different requirements.

## Decisions

- **New `--ob-pdp-photo-surface` token, not a reuse of `--ob-product-photo-surface` or `--ob-pdp-surface`**: a first pass tried reusing `--ob-pdp-surface`, which is pure white — `color-mix` against white with itself produces zero visible tint, so the blend was invisible until this was caught in live review. The fix is a new PDP-scoped token holding the same `#f1f5f9` value the PLP's `--ob-product-photo-surface` uses. It's a distinct variable rather than a shared one because the two surfaces are independent design contexts that happen to want the same *formula*, not a coupled *value* — a future PLP surface-color change shouldn't silently retint the PDP.
- **Keep `0.8rem` chip radius instead of porting PLP's `0.5rem`**: the difference is minor at this chip size and avoids re-deriving a new value; nothing else about the reference-driven radius depends on the old padding box now that the padding is removed. Main image (`3.2rem`) and thumbnail (`1.2rem`) radii are untouched — only their border/background treatment changes.
- **Focus-visible outline stays** on the chip and thumbnail: the PLP already draws an outline ring on `.ob-card-swatch:focus-visible` — keeping the equivalent on PDP surfaces is full parity, not a deviation.
- **`:checked` / `[aria-current]` rules are replaced, not weakened**: rather than reducing the ink border's weight, the chip's `:checked` rule and the thumbnail's `[aria-current]` rule are folded into the same selector group as `:hover`/`:focus-visible`, so all interaction states share one declaration block (mirrors how the PLP groups `--active`, `:hover`, `:focus-visible` in one rule).
- **Every Dawn box-shadow variant has to be named explicitly on the thumbnail**: Dawn's active-thumbnail styling is spread across four selectors of identical specificity to this change's override (`[aria-current]`, `[aria-current]:focus`, `[aria-current]:focus-visible`, `[aria-current]:focus:not(:focus-visible)`), so a partial override only wins some of them depending on stylesheet load order — the click case (`:focus:not(:focus-visible)`, which matches on every mouse click since buttons don't get `:focus-visible` from a click) is easy to miss and was the one that surfaced in live testing. All four are matched explicitly with `box-shadow: none` rather than relying on a shorter selector list.
- **Chip `border-width` reset needed alongside `border-color`**: the shared `component-ob-swatches.css` `:checked` rule sets `border-width: 0.2rem` in addition to `border-color`. This change's higher-specificity override only touched `border-color`, so the old width survived untouched (CSS cascades per-property, not per-rule) until `border-width: 0.1rem` was added explicitly to the override.

## Risks / Trade-offs

- [Selected chip/active thumbnail loses a distinct "committed choice" signal, relying only on surface lightness] → Accepted per explicit owner sign-off; this is the intended visual parity with PLP, not an oversight.
- [`mix-blend-mode: multiply` can wash out very light product photography differently across three surfaces of different sizes (5.0rem chip, full-width main image, quarter-width thumbnail)] → Low risk, verified live against both light-colored (Hi-Tec Silver Shadow, off-white) and saturated (Loewenweiss Hygge, multiple bold colors) products across chips, main image, and thumbnails.
- [Dawn's base CSS re-introduces one of the overridden box-shadow/opacity rules on a future Dawn upgrade or an unrelated Dawn-file edit] → Mitigated by the explicit, commented overrides in `component-ob-pdp.css` rather than relying on source-order luck; a future regression would need a new Dawn selector, not just a reordering.
