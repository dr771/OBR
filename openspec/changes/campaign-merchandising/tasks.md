## 1. Shop-side setup (dev, store-identity gate before each mutation)

- [x] 1.1 Create collection metafield definitions `custom.campaign_badge`, `custom.campaign_starts_at`, `custom.campaign_ends_at`, `custom.campaign_priority` (pinned)
- [x] 1.2 Split BE/NL out of the EU shipping zone: EUR 4.95 below EUR 70, EUR 0.00 from EUR 70; DE/FR/LU keep EUR 4.95
- [x] 1.3 Create automated collection `volle-prijs` (price reduced is not set), retarget WELCOME27 to it
- [x] 1.4 Deactivate automatic discount "Test Broek 10%"
- [x] 1.5 Create test campaign `actie-test` (published to Online Store, badge `-15%`, run time) + matching 15 % automatic discount
- [x] 1.6 Record every shop-side item in MIGRATION-TO-LIVE.md

## 2. Campaign badges

- [x] 2.1 `snippets/ob-campaign-badge.liquid`: collect not-ended `actie-*` collections with badge text, sort by precedence, render group with window data attributes
- [x] 2.2 `card-product.liquid`: top-left badge stack holding bestseller + campaign badge in the card media (the no-media branch has no bestseller badge either and is left as is)
- [x] 2.3 `main-product.liquid`: campaign badge in `.ob-pdp__gallery-badges`
- [x] 2.4 `assets/ob-campaign-window.js` (load + MutationObserver), loaded in `layout/theme.liquid`
- [x] 2.5 CSS for card stack and campaign pill (card + PDP)

## 3. Promo bar

- [x] 3.1 `announcement-bar.liquid`: `campaign` collection setting per block; filter ended blocks; window attributes on rendered blocks
- [x] 3.2 Inline pre-slider script: hide out-of-window messages, hide controls at ≤1, hide section at 0
- [x] 3.3 Locale strings for the new setting

## 4. Free-shipping progress

- [x] 4.1 Settings `ob_free_shipping_threshold` + `ob_free_shipping_countries` in the Cart group (+ schema locales)
- [x] 4.2 `snippets/ob-free-shipping-progress.liquid` + storefront locale strings (nl, en)
- [x] 4.3 Render in `.cart-drawer__footer` and in main-cart-footer's subtotal `.js-contents`
- [x] 4.4 CSS

## 5. Verify and document

- [x] 5.1 `shopify theme check` on touched Liquid; push with `--only`; header-group.json not pushed
- [ ] 5.2 Live verification in Chrome: card badge on PLP/search/PDP, precedence, cached-window behaviour (simulated clock), drawer + /cart progress through add/qty/remove, threshold blank = off
- [ ] 5.3 Set the threshold settings in Admin theme editor (owner/agent) and record in MIGRATION-TO-LIVE.md
- [x] 5.4 CI-STYLE-TOKENS.md (badge/progress visuals), GOTCHAS.md (new traps), STATUS-LOG.md
- [x] 5.5 `CAMPAIGNS.md` (NL) marketing checklist + link from CLAUDE.md project docs
