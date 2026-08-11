## Context

See `proposal.md` for motivation. OB already uses Dawn's native facet forms, native Search & Discovery parameters, an OB-specific color-family chip, a desktop size grid, AJAX skeleton feedback, and scroll clamping. The collection layout is vertical; search can remain horizontal on desktop. The sibling SB implementation supplies the reference interaction, but its theme-specific helper names and merged-color logic do not belong in OB.

## Goals / Non-Goals

**Goals:**

- Keep one native filtering pipeline and one canonical parameter set across desktop and mobile.
- Preserve OB's Akeneo/metaobject interpretation in centralized `ob-*` snippets.
- Make the responsive surfaces structurally separate so an AJAX row refresh cannot reset the bar shell's state.

**Non-Goals:**

- Reintroducing SB's theme-side color-family merge; OB receives family values directly.
- Adding icons to Producttype values or exposing Merk, Gender, or price as mobile rows.
- Changing Search & Discovery configuration or product data.

## Decisions

1. Render an OB-specific mobile-bar snippet in place of Dawn's drawer for vertical/horizontal layouts. It owns `FacetFiltersFormMobile`, so Dawn's serialization and URL behavior remain unchanged. The old drawer remains available only for Dawn's explicit `drawer` mode.
2. Identify row kinds from stable filter parameter names (`product_type`, `available_erp_sizes`, `filtercolors`), not translated labels. Type/size reuse native checkbox markup; color reuses `ob-facet-swatch-input`.
3. Keep the bar shell outside `.js-filter`; only its three row groups and sort group are AJAX-replaced. A pre-paint inline storage read applies the saved closed state, while delegated PLP JavaScript handles later toggle clicks.
4. Use native `<details>/<summary>` for desktop facet disclosures. CSS replaces the visible caret, while Liquid sets all vertical disclosures open and supplies translated labels/reset markup.
5. Implement the summon control with observers and inline absolute parking within the sidebar. After a grid replacement, re-clamp the parked panel before calling the existing scroll-bound correction; direct product appends do not trigger it.
6. Use flexbox plus `overflow-x: auto`, `overscroll-behavior-inline: contain`, and native scrollbars for each mobile row. This follows the mandatory modern-web guidance and makes independent overflow discoverable without a JavaScript carousel.

## Risks / Trade-offs

- [Omitted mobile facets reduce direct access to Merk/Gender/price] → Preserve already-active values as hidden inputs and their pills; the scope intentionally follows the approved SB three-row contract.
- [Facet AJAX code assumes the mobile form lives inside a menu drawer] → Guard the drawer-only rebind when the form has no drawer ancestor.
- [A parked desktop form can outlive a shorter result grid] → Observe only direct grid-container replacements, re-clamp the form, then re-apply the document scroll bound.
- [Local storage can be blocked] → Fail open using the server-rendered default.

## Migration Plan

Deploy only the changed snippets/assets/locales to theme `148245381229`. Verify desktop and a true 390px touch viewport through Chrome DevTools, including native request/URL behavior, then stop for owner review. Rollback is a targeted push of the previous committed file versions.
