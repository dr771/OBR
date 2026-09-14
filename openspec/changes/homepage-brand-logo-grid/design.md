## Context

`sections/ob-home-brands.liquid` renders the homepage "Uitgelichte merken" grid: bordered white cards on the `#f1f5f9` band, 6 + 5 flex rows, each card a `style: 'text'` wordmark from `ob-brand-logotype.liquid` plus a one-line description. The same snippet's default mode renders real logo files, each carrying a per-logo `--ob-logo-scale` (equal-visual-weight sizing from the trimmed ink box's aspect ratio and ink density — formula documented in the snippet). The marquee and Merken chips apply that scale to their own base height.

## Goals / Non-Goals

**Goals:**
- A self-contained section for the logo grid (own file, own stylesheet, own class namespace) so neither grid's CSS can bend the other.
- Logos in the grid read at the same optical weight as in the marquee.
- The text grid stays restorable without git archaeology.

**Non-Goals:**
- Changing the logo assets, the scale values, or the marquee/Merken rows.
- Adding RH+ to the grid roster (it has no collection yet); the block schema supports it via `brand_handle`, but the configured roster stays the existing 11.

## Decisions

- **New section instead of a `style` toggle on the old one.** The owner asked for its own component; a toggle would also leave one section carrying two sets of card rules. The card chrome (border, radius, hover shadow, 6 + 5 flex basis) is copied into the new namespace (`.ob-home-brand-logos__*`) rather than shared, so the archived section is frozen as-is.
- **Archive = `"disabled": true` in `templates/index.json`.** Keeps the old instance with its blocks and copy in the template; the theme editor shows it as a hidden section that can be re-enabled. Deleting the instance would lose the configured copy; keeping only the file would need re-adding 11 blocks by hand.
- **Fixed-height logo slot.** Each card gets a mark slot of fixed height (`5.2rem` desktop, `4.4rem` below 990px) with the logo centered in it, so descriptions line up across a row no matter how tall a logo is. Logo height = `base × --ob-logo-scale` (`2.2rem` desktop, `1.8rem` below) — a notch under the marquee's `2.4rem` so the tallest mark (Odlo, 2.15×) fits the slot; `max-width: 100%` + `object-fit: contain` guard the narrowest cards.
- **Same rest/hover filter as the marquee** (`grayscale(1) brightness(0.5) contrast(1.15)` at 90% opacity → none/100% on card hover/focus), and a section-scoped invert rule for `ob-brand-logo--invert` (RH+), because the marquee's invert rule is scoped to marquee items.
- **Sneaker Lab keeps its text fallback**, which needs `.ob-logotype` / `.ob-lt-sneakerlab` from `component-ob-merken.css`; the section loads that stylesheet exactly as the old one did. All logo sizing selectors are scoped under `.ob-home-brand-logos`, so merken's own `.ob-merken-chip .ob-brand-logo` rule doesn't apply.

## Risks / Trade-offs

- [Live `templates/index.json` may have Admin edits not in git] → push only through `scripts/theme-push.sh`, which aborts on drift; merge live first if it does.
- [Card chrome now exists in two stylesheets] → accepted; the old one is frozen and only loads if the archived section is re-enabled.

## Migration Plan

Push section + CSS, then `templates/index.json` via `scripts/theme-push.sh`. Rollback: in the theme editor, hide the logo section and un-hide "OB Uitgelichte merken".
