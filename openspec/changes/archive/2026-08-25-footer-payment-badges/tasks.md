## 1. Markup

- [x] 1.1 Remove the payment badge block from the bottom `.footer__content-bottom-wrapper` (copyright row)
- [x] 1.2 Add the payment badge block to `footer-block__brand-info`, immediately after the `social-icons` conditional
- [x] 1.3 Swap `payment_type_svg_tag` icon output for a `case`/`when` text-label map (visa→VISA, master→MC, ideal→iDEAL, paypal→PayPal, american_express→AMEX, maestro→Maestro, shopify_pay→Shop Pay, apple_pay→Apple Pay, google_pay→Google Pay, fallback→capitalized key)
- [x] 1.4 Cap the badge list at 5 with `slice: 0, 5`
- [x] 1.5 Drop the visible label span; keep a `visually-hidden` span for accessibility
- [x] 1.6 Update the hardcoded preview fallback array to the NL-market set (`ideal, visa, master, paypal`)

## 2. Styling

- [x] 2.1 Add `.list-payment--badge` / `.list-payment__item--badge` rules matching the proto's measured badge chrome (border, radius, padding, background, typography, gap)
- [x] 2.2 Add `.footer__payment--brand` spacing (left-aligned, margin-top matching the social-icons row rhythm)
- [x] 2.3 Remove the now-unused bottom-bar payment styles (`--legal` modifier, `.footer__payment-label`) from the earlier bottom-bar placement
- [x] 2.4 Halve the vertical gap between the badge row and the column-grid divider (`.footer__blocks-wrapper` padding-bottom 5.6rem → 2.8rem)
- [x] 2.5 Halve the vertical gap between the localization row and the copyright row (bottom-wrapper `padding-bottom` 2.8rem → 1.4rem, scoped to the first wrapper only; `.footer__copyright` `margin-top` 1.5rem → 0.75rem)

## 3. Verification

- [x] 3.1 Push `sections/footer.liquid` and `assets/component-ob-footer.css` to theme `148245381229`
- [x] 3.2 Diff computed styles of the live badges against the proto's measured values (border, radius, padding, background, font-size/weight/line-height, color, height, gap) — confirm exact match
- [x] 3.3 Confirm the badge row renders in both `nl` and `en` locales
- [x] 3.4 Confirm the two halved gaps visually and via `getBoundingClientRect()` measurement
