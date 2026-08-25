## Context

See proposal.md - Why. Stock Dawn's footer section (`sections/footer-group.json`) had `"blocks": {}` — no menus wired, no brand column configured. Dawn's footer template renders each link column as a `link_list` block bound to exactly one flat Shopify navigation menu (`block.settings.menu.links`, no nesting rendered even if the menu has nested items), so matching the proto's 3 link columns requires 3 separate real menus, not one nested one.

## Goals / Non-Goals

**Goals:**
- Every footer link resolves to a real destination — no dead `#` links.
- Visual output matches the Bolt proto's measured computed styles (not eyeballed) across desktop/tablet/mobile.
- Reuse existing site content/assets (the Contact and Merken pages, the existing logo file) instead of duplicating them.

**Non-Goals:**
- Replicating the proto's static payment badges or lack of localization selectors — Dawn's native equivalents are kept (see proposal.md's scope boundaries).
- Gift card / order-tracking features — out of scope until those features are separately built.
- Sitewide logo changes beyond reusing the existing file for the footer's brand column.

## Decisions

**Three separate flat Shopify menus, not one nested menu.** Dawn's `link_list` block only renders `menu.links` (top level), so a single nested menu would silently drop everything below depth 1. Three menus (`footer-klantenservice`, `footer-over-ons`, `footer-handige-links`) match the block-per-menu model exactly.

**Reference resources (PAGE/COLLECTION types) over raw HTTP URLs where possible.** Menu items for existing Pages and the Solden collection use Shopify's typed menu item references (`type: PAGE`/`COLLECTION` + `resourceId`) rather than hardcoded relative URLs, so they stay valid if a handle is ever renamed. `Mijn account`/`Bestelling volgen` use `type: HTTP` with `/account` since there's no dedicated resource for the native account route.

**Placeholder Pages for missing content now, not deferred links.** Six of the proto's link targets (Verzending & retour, Maattabellen, Veelgestelde vragen, Ons verhaal, Duurzaamheid, Werken bij) had no real content yet. Creating minimal placeholder Pages now (rather than omitting the links) keeps the footer fully clickable immediately, following the same precedent as the PDP's previously-shipped `pdp-description-tabs` capability, which shipped structure ahead of real merchant copy. Real copy is a content task, not a code task.

**CSS override approach: scoped `.ob-footer` marker class, not a full section rewrite.** Follows the existing `.ob-pdp` convention. Values were measured directly from the proto via `getComputedStyle`/`getBoundingClientRect` (background, grid track widths at each breakpoint, typography, hover colors) rather than estimated from Tailwind class names, per the project's pixel-perfect-conversion methodology already used for `match-pdp-to-proto`.

**Neutralizing Dawn's flex-based `.grid__item` width calc.** Dawn's `.grid__item` sets an explicit `width: calc(25% - ...)` designed for its own flex-wrap `.grid` layout. Converting `.footer__blocks-wrapper` to real CSS Grid (needed to reproduce the proto's exact 2/4/5-column responsive breakpoints) exposed a collision: that percentage-width calc, once the item is a grid child instead of a flex child, resolves against the item's own grid-area track rather than the row — collapsing each column to a sliver. Fixed by explicitly resetting `width`/`max-width`/`flex` to `auto`/`none`/`none` on `.footer-block` within `.ob-footer`, letting CSS Grid's default `stretch` behavior take over.

**Image sizing via CSS height, not the `brand_image_width` theme setting.** The proto's logo is measured by rendered height (`h-11` = 44px, width auto), but Dawn's `brand_image_width` setting is width-driven. Rather than back-calculating a width value from the real logo's aspect ratio (which would silently break again if the logo file is ever replaced with a different aspect ratio), the CSS sets `height: 4.4rem; width: auto` directly on the image and neutralizes the inline `max-width` style Dawn generates from the setting.

## Risks / Trade-offs

**[Risk] Placeholder pages ship with no real copy.** → Mitigation: each page's body text is explicitly marked "in ontwikkeling" (in development) in Dutch, so it reads as intentionally unfinished rather than broken; not silently blank.

**[Risk] Shop-side resources (menus, pages, brand_image setting) don't travel with a theme push.** → Mitigation: logged in `MIGRATION-TO-LIVE.md` at the time of creation, per the project's Hard Rule for shop-side dependencies.

**[Risk] Social icon styling is unverified with real content.** → Mitigation: no social URLs are configured yet, so Dawn's own `has_social_icons` check hides the row entirely rather than rendering broken icons; the CSS is written and measured against the proto but only visually confirmed once real URLs are added.

## Migration Plan

Already implemented and pushed live to the main Dawn theme (148245381229) this session. This propose/apply/archive cycle documents it retroactively, per the project's OpenSpec Hard Rule for spec-covered changes. No rollback beyond a normal git revert of the touched files plus deleting the 3 menus/6 pages via Admin if ever needed.
