## 1. Contracts and shared metadata

- [x] 1.1 Add and strictly validate the desktop-panel, mobile-bar, and modified color-filter contracts.
- [x] 1.2 Extend centralized filter-kind/label metadata and translations for the new surfaces.

## 2. Desktop filter panel

- [x] 2.1 Implement open accordions, prefixed headings, reset controls, value-only pills, carets, and compact sidebar styling.
- [x] 2.2 Implement the desktop-only summon control with sidebar-bound parking and post-facet re-clamping.

## 3. Mobile filter bar

- [x] 3.1 Replace the vertical/horizontal mobile drawer with the Type/Maat/Kleur bar while retaining native form parameters and accessibility status.
- [x] 3.2 Implement horizontal box/swatch rows, toolbar chrome, persistent toggle state, and safe drawer-code compatibility.

## 4. Verification and handoff

- [x] 4.1 Run theme/static checks and strict OpenSpec validation.
- [x] 4.2 Deploy only changed theme files to theme `148245381229`.
- [x] 4.3 Verify desktop and 390px mobile behavior through Chrome DevTools, including AJAX, URL, state persistence, scrolling, focus, and no JavaScript or network errors.
- [x] 4.4 Stop before archive for owner review.
