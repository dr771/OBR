## 1. Code

- [x] 1.1 Add the brand blocks, marquee markup, stylesheet and script to `sections/ob-home-hero.liquid`
- [x] 1.2 Move hero padding to CSS variables and add the below-750px order in `assets/component-ob-home-hero.css`
- [x] 1.3 Add fixed band padding to `assets/component-ob-home-marquee.css`
- [x] 1.4 Reconcile live-only settings into `templates/index.json`, move the brand blocks to `hero`, drop `brand-marquee`
- [x] 1.5 Delete `sections/ob-home-brand-marquee.liquid`
- [x] 1.6 Run `shopify theme check` and grep it for the touched files

## 2. DEV

- [x] 2.1 Push code and DEV's own restructured template to DEV
- [x] 2.2 Verify on DEV at 390×664 and desktop: one marquee, order, full-width band, motion
- [x] 2.3 Delete the old section from the DEV theme

## 3. Pre-live

- [x] 3.1 Commit and push to git
- [x] 3.2 Push the same files to theme `209721262417` through `scripts/theme-push.sh`
- [x] 3.3 Verify on the pre-live storefront at 390×664 and desktop, including the Trusted Shops badge reveal
- [x] 3.4 Delete the old section from theme `209721262417`

## 4. Docs

- [x] 4.1 Add the change to `STATUS-LOG.md` and fix the spec's section count wording
