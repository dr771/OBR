## 1. Remove positive tracking at the source

- [x] 1.1 Set `layout/theme.liquid` body `letter-spacing` to `normal`
- [x] 1.2 Replace every positive `letter-spacing` value in `assets/base.css` with `normal`
- [x] 1.3 Replace every positive `letter-spacing` value in the Dawn component/template stylesheets with `normal` (cart items, cart drawer, card, article card, facets, localization form, price, pickup availability, variant picker, volume pricing, customer, gift card, password, main product, quick order list, quantity popover), leaving `component-rating.css` untouched
- [x] 1.4 Replace every positive `letter-spacing` value in `assets/component-ob-*.css` with `normal`, including the `.ob-lt-*` wordmark rules and `.ob-logotype small`
- [x] 1.5 Grep confirms the only remaining positive values are in `component-rating.css`
- [x] 1.6 Restore section-eyebrow tracking after owner review: homepage brands/bestsellers/occasions/newsletter `0.336rem`, `/cart` header/summary `0.24rem`

## 2. Deploy and verify

- [x] 2.1 Run `shopify theme check` on `layout/theme.liquid`
- [x] 2.2 Push all changed files to theme `148245381229` with an explicit `--only` list
- [x] 2.3 Live-sample computed `letter-spacing` on the homepage, a collection page, a PDP, and `/cart` (drawer markup included) and confirm no theme text element is positive
- [x] 2.4 Confirm negative heading tracking still applies and the rating star row is unchanged

## 3. Docs

- [ ] 3.1 Update CI-STYLE-TOKENS.md wherever it records eyebrow/label tracking values
