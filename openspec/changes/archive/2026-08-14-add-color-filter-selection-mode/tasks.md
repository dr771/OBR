## 1. Theme Configuration

- [x] 1.1 Add the global `Color filter selection` setting with One color as the default and Multiple colors as the alternative.

## 2. Semantic Control Rendering

- [x] 2.1 Make the shared color-facet input renderer support native checkbox and radio types without changing labels, disabled state, focus, or swatch visuals.
- [x] 2.2 Apply the selected control type consistently in desktop facets and Dawn's fallback mobile drawer.
- [x] 2.3 Apply the same selection mode to the custom mobile Kleur row while leaving Type and Maat as checkboxes.

## 3. Single-Mode State Handling

- [x] 3.1 Add delegated single-mode normalization that keeps only the first value from an incoming multi-color URL and refreshes through the native facet pipeline without loops.
- [x] 3.2 Preserve facet reset, active-pill removal, sort/search parameters, loading feedback, and section-replacement behavior in both modes.

## 4. Verification and Documentation

- [x] 4.1 Validate OpenSpec and run Shopify Theme Check.
- [x] 4.2 Verify desktop collection/search behavior in Multiple and One color modes, including keyboard and accessible control semantics.
- [x] 4.3 Verify both modes in the 390px mobile bar and Dawn fallback drawer, including instant updates and no overflow.
- [x] 4.4 Verify direct multi-color URLs normalize in single mode and remain untouched in multiple mode.
- [x] 4.5 Record the reversible setting and live-shop migration dependency in shared project documentation; leave the change unarchived for review.
