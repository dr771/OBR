## 1. Variant-picker structure

- [x] 1.1 Force recognized size axes onto the existing radio-button renderer while leaving color and generic axes unchanged.
- [x] 1.2 Add a size-specific fieldset hook without changing option values, IDs, names, availability classes, or selected state.

## 2. Size-grid presentation

- [x] 2.1 Add the responsive equal-width grid (four narrow-column tracks; eight desktop tracks) and keep the legend as the full-width fieldset heading.
- [x] 2.2 Specialize size labels as 5.6rem narrow-column / 4.8rem desktop boxes using theme color variables and preserve hover, selected, unavailable, focus, and forced-colors states.

## 3. Verification and documentation

- [x] 3.1 Run OpenSpec strict validation and Shopify theme checks.
- [x] 3.2 Deploy only the changed theme files to main theme `148245381229`.
- [x] 3.3 Verify numeric footwear and letter-size apparel behavior plus desktop, tablet, 390px mobile, keyboard focus, unavailable state, no horizontal page overflow, and the rail-off grid fallback.
- [x] 3.4 Record the shipped capability and verification result in shared project documentation.
