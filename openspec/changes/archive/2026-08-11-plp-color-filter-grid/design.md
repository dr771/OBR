## Context

See `proposal.md` for motivation. OB’s `custom.filtercolors` native metafield facet already produces one value per Akeneo-managed color family, and `ob-facet-swatch-input` already renders each value as a native checkbox plus a flat metaobject-backed chip. The missing behavior is presentation, not grouping or filtering logic. The current mobile experience is Dawn’s nested drawer; `plp-mobile-filter-bar` remains a separate reuse-ledger capability.

## Goals / Non-Goals

**Goals:**

- Reuse the existing native filter checkbox and section-rendering path unchanged.
- Match the shipped SB desktop proportions: five fixed 2.8rem columns with 1.2rem gaps.
- Give desktop and the current mobile drawer the same scannable chip-grid treatment.
- Preserve keyboard, screen-reader, disabled, checked, and focus-visible behavior.

**Non-Goals:**

- No client-side color-family merging; Akeneo’s `filtercolors` reference remains authoritative.
- No image swatches for abstract filter families.
- No mobile filter bar, filter-panel chrome, accordion-policy, or filter-order changes.
- No JavaScript tooltip or custom checkbox state management.

## Decisions

1. **Specialize existing facet markup rather than introduce another renderer.** Detect `filtercolors` once in each desktop/mobile filter loop, add a color-grid class to the existing list, and keep the current native inputs. This avoids duplicating Dawn’s active/disabled/submission behavior.
2. **Put the accessible name inside the actual `<label>`.** The current visible count text is a sibling of the input label, so removing it visually would leave an ambiguously named checkbox. A visually hidden label/count inside `ob-facet-swatch-input` keeps the native association valid without ARIA-only reconstruction.
3. **Use CSS pseudo-elements only for the visual tooltip.** The tooltip string is copied into a data attribute for presentation while the authoritative accessible text remains in the DOM. Hover and `:has(:focus-visible)` reveal it without layout changes or script.
4. **Use fixed columns rather than auto-fit.** Five 2.8rem chips plus four 1.2rem gaps matches the reference and prevents the narrow desktop sidebar from reflowing unpredictably. The 2.8rem target exceeds WCAG 2.5.8’s 24px minimum.
5. **Adapt the SB mobile requirement to the current drawer.** A horizontally scrolling row belongs to the deferred `plp-mobile-filter-bar`; this change uses a compact five-column grid in the drawer so it does not silently pull that larger capability into scope.

## Risks / Trade-offs

- **[Tooltip near a drawer or sidebar edge can be clipped]** → Keep the tooltip anchored above the chip, test first/last columns on desktop and mobile, and adjust alignment only if live geometry shows clipping.
- **[Light colors can disappear against white]** → Retain the existing chip border and checked outline.
- **[Generated tooltip text is not assistive content]** → Keep the same label/count as visually hidden DOM text inside the native label.
- **[More than ten values invokes Dawn show-more on desktop]** → Keep the threshold at ten so truncation lands after two complete five-chip rows; mobile continues showing the full set inside its drawer.

## Migration Plan

Deploy only the three affected theme files to the main dev-store theme. Rollback is the inverse targeted push of their prior Git versions. No shop data or admin configuration changes are required.
