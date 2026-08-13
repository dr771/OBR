## 1. Theme Configuration

- [x] 1.1 Add a global PLP card swatch-style select with color as the schema default and image as the rollback option.

## 2. Color Resolution and Rendering

- [x] 2.1 Add a centralized variant filter-color resolver that validates hex values and emits solid or equal-segment fills.
- [x] 2.2 Update the PLP card swatch renderer to select color or image visuals while preserving the existing image-data and interaction contract.
- [x] 2.3 Add scoped styling for flat and segmented PLP swatches without changing PDP chips.

## 3. Verification and Documentation

- [x] 3.1 Validate the OpenSpec change and run Shopify Theme Check.
- [x] 3.2 Verify color mode, multi-color segmentation, image fallback, selection, image swap, variant links, and responsive layout on the storefront.
- [x] 3.3 Verify the image-chip rollback mode on the storefront.
- [x] 3.4 Record the reversible experiment and theme-setting dependency in shared project documentation; leave the change unarchived for review.
