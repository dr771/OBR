## 1. Theme code

- [x] 1.1 Render the sale label and campaign badge per product in `sections/predictive-search.liquid`, inside the result link, after the price
- [x] 1.2 Style the `search` placement in `assets/component-ob-search.css`: over the thumbnail at ≥750px, under the price below 750px

## 2. Verify and ship

- [x] 2.1 Run `shopify theme check`, grep for the touched files
- [x] 2.2 Push to DEV, verify desktop and mobile: reduced product shows `-N%`, ranged product shows `tot -N%`, full-price product shows no badge, campaign product shows its pill
- [x] 2.3 Commit and push to git
- [x] 2.4 Push the same files to pre-live and verify there
