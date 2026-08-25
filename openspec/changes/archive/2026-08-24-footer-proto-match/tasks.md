## 1. Shopify content (Admin)

- [x] 1.1 Create 6 placeholder Pages: Verzending & retour, Maattabellen, Veelgestelde vragen, Ons verhaal, Duurzaamheid, Werken bij.
- [x] 1.2 Create menu `footer-klantenservice` (Contact, Verzending & retour, Maattabellen, Veelgestelde vragen).
- [x] 1.3 Create menu `footer-over-ons` (Ons verhaal, Onze merken, Duurzaamheid, Werken bij).
- [x] 1.4 Create menu `footer-handige-links` (Mijn account, Bestelling volgen, Outlet).
- [x] 1.5 Set the footer's `brand_image` theme setting to the site's existing logo file; set the brand description to the tagline.

## 2. Section wiring

- [x] 2.1 Wire `brand_information` + 3× `link_list` blocks into `sections/footer-group.json`, each `link_list` pointing at its menu handle.
- [x] 2.2 Disable the newsletter block (`newsletter_enable: false`).
- [x] 2.3 Adjust section `padding_top`/`padding_bottom` to match the proto's footer spacing.

## 3. Pixel-matched CSS

- [x] 3.1 Measure the Bolt proto footer's computed styles (background, grid, typography, colors, hover states) at desktop/tablet/mobile via `getComputedStyle`.
- [x] 3.2 Dump Dawn's own unmodified footer computed styles as the override baseline.
- [x] 3.3 Write `assets/component-ob-footer.css` scoped to `.ob-footer`; add the marker class and stylesheet include to `sections/footer.liquid`.
- [x] 3.4 Fix the `.grid__item` percentage-width collision from converting `.footer__blocks-wrapper` to real CSS Grid.
- [x] 3.5 Fix phantom-whitespace `<li>` height and stray `letter-spacing` inheritance found during verification.
- [x] 3.6 Fix the container padding breakpoint (proto's `sm:` = 640px, not 1024px).
- [x] 3.7 Fix oversized vertical gaps between footer blocks on mobile — Dawn's own `@media (max-width:749px) { .footer-block.grid__item { margin: 4rem 0; } }` (written for its stacked mobile layout) was never neutralized, so it stacked on top of the grid's own row gap. Caught via user screenshot after initial ship; fixed by resetting `margin: 0` on `.footer-block` within `.ob-footer`.
- [x] 3.8 Re-measure the implementation and diff field-by-field against the proto at desktop, tablet (768px), and mobile (390px).

## 4. Process

- [x] 4.1 Push all changed files to the live theme (148245381229) with `--only`.
- [x] 4.2 Append the new menus/pages/`brand_image` setting as shop-side dependencies to `MIGRATION-TO-LIVE.md`.
- [x] 4.3 Verify live: all 11 footer links resolve, grid/typography match the proto at all 3 breakpoints.
