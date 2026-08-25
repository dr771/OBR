## Why

This dev shop cannot yet enable a real payment gateway (Akeneo/checkout data isn't
complete), so the footer's payment row — gated on `shop.enabled_payment_types.size > 0`
— has never once rendered, and there was no way to design or review it. The owner asked
to preview what payment badges will look like once a gateway is live, using the approved
Bolt proto as the reference for both position and visual treatment, and to keep the
result live rather than reverting it.

## What Changes

- Move the payment badge row out of the bottom copyright bar and into the brand column,
  directly below the tagline, in the same slot `social-icons` renders into
  (`footer-block__brand-info`).
- Restyle the badges from Shopify's colorful `payment_type_svg_tag` icons to flat text
  pill badges pixel-matched to the Bolt proto's own payment badges (white background,
  `1px solid rgb(203,213,225)` border, `0.6rem` radius, `10px/600` text, `rgb(51,65,85)`
  color, `0.6rem` gap) — measured directly from the proto, not approximated.
- Drop the visible label; a `visually-hidden` span carries the same copy for
  accessibility instead (a visible "Veilig betalen met" / "Secure payment with" label in
  the bottom bar was tried and rejected in favor of this icon-only treatment).
- Cap the row at 5 badges.
- Keep the badge **set** dynamically sourced from `shop.enabled_payment_types`, mapping
  known Shopify type keys to short display text (`visa`→VISA, `master`→MC, `ideal`→iDEAL,
  `paypal`→PayPal, `american_express`→AMEX, `maestro`→Maestro, `shopify_pay`→Shop Pay,
  `apple_pay`→Apple Pay, `google_pay`→Google Pay; unmapped keys fall back to a
  capitalized, space-separated version of the key).
- Until a real gateway is enabled on this dev shop, fall back to a hardcoded NL-market
  preview set (`ideal, visa, master, paypal`) so the row has something to render and
  review. This fallback is explicitly temporary: the moment `shop.enabled_payment_types`
  is non-empty, it takes over automatically and the hardcoded array becomes dead code
  (left in place, harmless, until removed in a later cleanup).

## Capabilities

### Modified Capabilities
- `footer-proto-chrome`: supersedes the existing "Native Dawn bottom-bar content is not
  proto-matched" requirement's payment-icon scenario. Previously: payment icons stay in
  the bottom bar, render via `shop.enabled_payment_types` only (empty when no gateway is
  configured), and must never replicate the proto's static payment badges. Now: payment
  badges live in the brand column, are deliberately proto-matched (position, size,
  border/radius/typography), and render as text rather than brand SVG icons — while the
  badge *set* itself still reflects `shop.enabled_payment_types` when real gateways are
  enabled, with a temporary hardcoded fallback for this dev shop's current no-gateway
  state.

## Impact

- `sections/footer.liquid`: payment badge markup moved from the bottom
  `.footer__content-bottom-wrapper` into `footer-block__brand-info`; badge content
  switched from `payment_type_svg_tag` to a `case`/`when` label map; capped via
  `slice: 0, 5`.
- `assets/component-ob-footer.css`: new `.list-payment--badge` /
  `.list-payment__item--badge` rules (proto-matched chrome); `.footer__payment--brand`
  spacing; halved the vertical gaps above/below this row (blocks-wrapper
  `padding-bottom` 5.6rem→2.8rem; bottom-wrapper-only `padding-bottom` 2.8rem→1.4rem;
  `.footer__copyright` `margin-top` 1.5rem→0.75rem) per live review.
- Already implemented, pushed to theme `148245381229`, and live-verified (computed-style
  diff against the proto matched on every sampled property).
