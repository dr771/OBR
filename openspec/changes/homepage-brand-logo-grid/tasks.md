## 1. Logo grid section

- [x] 1.1 Create `sections/ob-home-brand-logos.liquid` (eyebrow/heading/subheading/padding settings, `brand` blocks with collection + `brand_handle` + description), rendering `ob-brand-logotype` in a fixed-height mark slot per card
- [x] 1.2 Create `assets/component-ob-home-brand-logos.css`: band, head, 6 + 5 flex card grid, mark slot, `--ob-logo-scale` sizing, rest/hover filter, scoped invert rule
- [x] 1.3 Mark `sections/ob-home-brands.liquid` as archived in its header comment

## 2. Homepage template

- [x] 2.1 Add a `brand_logos` instance to `templates/index.json` with the old grid's 11 blocks and copy, put it in the `brands` slot of `order`, and set the old `brands` instance to `"disabled": true`

## 3. Deploy and verify

- [x] 3.1 `shopify theme check` the new section
- [x] 3.2 Push the section + CSS, then `templates/index.json` (built on a fresh live pull — live carried Admin-only edits to `brands`, `occasions` and `promo` — pushed raw and re-pulled to confirm live == local, since `scripts/theme-push.sh` aborts on any intended change)
- [x] 3.3 Verify on the live homepage at desktop, tablet and 390px: logos render at their scale, descriptions aligned, 6 + 5 rows, grayscale→color on hover, old section hidden
