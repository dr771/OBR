## 1. Implementation

- [x] 1.1 In `snippets/product-variant-picker.liquid`, narrow the color swatch fieldset condition (around line 73, currently `{%- if picker_type == 'swatch' -%}`) to also require `option.values.size > 1`, so a single-value color option renders nothing (no fieldset, no legend, no rail shell).
- [x] 1.2 Confirm size options and multi-value color options are untouched by reading through the updated conditional logic.

## 2. Verification

- [x] 2.1 Push `snippets/product-variant-picker.liquid` to theme `148245381229` and verify live: a single-color product (e.g. `/products/pas-de-monaco-otis-shirt`) shows no color fieldset/rail, only the size picker.
- [x] 2.2 Verify live: a multi-color product still renders its color rail exactly as before (chips, chevrons, tooltip all unaffected).
- [x] 2.3 Verify live: the same single-color product's PLP card swatch and its cart drawer line-item (add it to cart) still display the single color exactly as before — unchanged.
