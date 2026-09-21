## 1. Submenu active-state underline

- [x] 1.1 Wrap submenu child and grandchild link titles in a conditionally-classed `<span>` in `snippets/header-dropdown-menu.liquid`, matching the top-level link structure
- [x] 1.2 Add mirrored `.header__submenu .header__menu-item` active-underline CSS in `sections/header.liquid` (color, thickness, offset, transition identical to the top-level rule)
- [x] 1.3 Verify live on a submenu child page that the active submenu link shows the blue underline and no default text-decoration underline remains

## 2. Merken tie-break

- [x] 2.1 Compute `non_merken_link_active` once per render in `snippets/header-dropdown-menu.liquid` by looping `section.settings.menu.links`
- [x] 2.2 Suppress Merken's active state when `non_merken_link_active` is true; keep it active otherwise (including on `/pages/merken` itself)
- [x] 2.3 Run `shopify theme check` and fix the Liquid syntax errors it caught (no parenthesized boolean grouping, no boolean expression in `assign`)
- [x] 2.4 Push both files to theme `148245381229` and verify live: `/collections/juicy-couture` (Fashion & Lifestyle only), `/collections/hi-tec` (Outdoor & Werk only), `/pages/merken` (Merken active)
