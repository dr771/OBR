## 1. Centralized Color Identity

- [x] 1.1 Add a centralized selected-variant SKU color-code helper with color-option detection and single/multi-segment coverage

## 2. PDP Media Filtering

- [x] 2.1 Filter featured/main gallery media and compute a finite selected-color media count with color-neutral fallback
- [x] 2.2 Apply the identical selected-color filter to thumbnail and expanded-modal media
- [x] 2.3 Preserve Dawn's native eager featured image, lazy subsequent images, variant refresh, active-media, and fail-open behavior

## 3. Verification and Handoff

- [x] 3.1 Run strict OpenSpec validation, Theme Check, and targeted static checks
- [x] 3.2 Confirm “Hide other variants' media” is OFF remotely and mirror only that boolean locally without overwriting unrelated remote template settings
- [x] 3.3 Push only changed snippets to main theme `148245381229`
- [x] 3.4 Verify single-segment and multi-segment color gallery filtering, counters, modal parity, color switching, desktop layout, 390px mobile layout, and console state live
- [x] 3.5 Update shared docs and stop before OpenSpec archive for user review
