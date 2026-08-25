## Context

See proposal.md - Why. Single Dawn theme, no build step; the payment row already
existed as a `shop.enabled_payment_types` loop in `sections/footer.liquid`'s bottom bar
— this change relocates and restyles it, it does not introduce new plumbing.

## Goals / Non-Goals

**Goals:**
- Match the proto's payment badge chrome exactly (measured, not eyeballed).
- Keep the badge set wired to real `shop.enabled_payment_types` so nothing further is
  needed once a gateway goes live on this shop.

**Non-Goals:**
- Removing the temporary preview fallback array now — it self-disables the moment
  `shop.enabled_payment_types` is non-empty, so leaving it in place until an actual
  gateway is configured (a manual admin step, not a code change) is intentional.
- Reproducing Shopify's colorful brand-icon SVGs — the proto's own badges are flat text,
  and that's what was explicitly requested.

## Decisions

- **Text badges over `payment_type_svg_tag` icons**: the proto's reference badges are
  plain text pills, not brand artwork. A `case`/`when` map from Shopify's known type
  keys to short display text (`visa`→VISA, etc.) reproduces that look while staying
  driven by real data. Alternative considered: keep the colorful SVGs inside a bordered
  box — rejected because it doesn't match the proto and wasn't what was asked for.
- **Brand column, not bottom bar**: the proto's own bottom bar has no equivalent slot at
  this shop's scale (see footer-proto-chrome's localization requirement — bottom bar
  stays native), and the brand column already has an unused slot immediately below the
  tagline for exactly this kind of icon row (it's where `social-icons` renders when
  social links are configured). Two earlier placements (bottom bar with a visible label,
  bottom bar centered) were tried live and rejected in favor of this one.
- **Cap at 5**: explicit owner instruction, matches the proto's own badge count (4) with
  one badge of headroom.

## Risks / Trade-offs

- [Preview fallback array silently never gets removed] → Low risk: it is inert the
  moment a real gateway is configured, and the code comment above it explains why it
  exists and when to delete it.
- [Unmapped payment type renders an awkward fallback label] → The `case`/`when` falls
  back to `type | replace: '_', ' ' | capitalize`, which degrades gracefully for any
  Shopify type not explicitly mapped (e.g. `unionpay` → "Unionpay").
