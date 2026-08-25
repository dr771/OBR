## Why

The theme's footer shipped as stock Dawn with zero configured blocks (`sections/footer-group.json` had `"blocks": {}`) — no menus, no brand column, nothing a customer could click. The only footer-handle Shopify menu that existed (`footer`, 2 items: Search, Your Privacy Choices) was Dawn's out-of-the-box default and wasn't wired into the section at all. With PLP and PDP already matched to the approved Bolt proto reference (`match-desktop-plp-spacing`, `match-pdp-to-proto`), the footer was the last major storefront surface left unbuilt and unstyled.

## What Changes

- Wire three new Shopify navigation menus (`footer-klantenservice`, `footer-over-ons`, `footer-handige-links`) into the footer section as `link_list` blocks, plus a `brand_information` block for the logo/tagline/social column.
- Create 6 placeholder Shopify Pages for footer link targets that didn't exist yet (Contact and the Merken page already existed and are reused as-is).
- Point the footer's `brand_image` theme setting at the site's existing logo file so the brand column matches the header instead of rendering empty.
- Pixel-match the footer's visual design to the Bolt proto (`https://original-brands.bolt.host/#product/hygge` footer) via a new `assets/component-ob-footer.css`, scoped to an `.ob-footer` marker class: background, responsive column grid (2/4/5 cols with the brand column always spanning 2), heading/link typography, link hover color, circular social-icon buttons with hover invert, logo sizing, and bottom-bar typography — verified across desktop, tablet, and 390px mobile.
- Disable the newsletter block (`newsletter_enable: false`) to match the proto's footer, which has none.

**Deliberate scope boundaries** (not gaps to fix later without reason):
- "Cadeaubonnen" (gift cards) omitted from the Handige links column — add once gift cards are actually wanted.
- Dawn's native automatic payment icons (`shop.enabled_payment_types`) kept instead of the proto's 4 static badges — accurate to what the shop actually accepts.
- Dawn's country/language selectors and policy links in the bottom bar kept as native Dawn behavior — the proto's footer has no equivalent content to match against.

## Capabilities

### New Capabilities
- `footer-navigation`: the three real Shopify menus wired into the footer's link columns, their content-page targets, and the brand column's logo/tagline source.
- `footer-proto-chrome`: the pixel-matched visual design of the footer (grid, typography, spacing, colors, hover states) sourced from the Bolt proto reference.

### Modified Capabilities
(none — this is new footer behavior, not a change to an existing documented requirement)

## Impact

- `sections/footer.liquid` — added `.ob-footer` marker class and a new stylesheet include.
- `sections/footer-group.json` — wired `brand_information` + 3× `link_list` blocks, disabled newsletter, adjusted section padding to match the proto.
- New `assets/component-ob-footer.css`.
- Shopify Admin (shop data, not theme code): 3 new navigation menus, 6 new Pages, footer `brand_image` theme setting — all shop-side, so they must be recreated on the separate live shop at migration time (tracked in `MIGRATION-TO-LIVE.md`).
