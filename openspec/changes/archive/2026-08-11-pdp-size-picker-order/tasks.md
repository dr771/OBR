## 1. Centralized Option Metadata

- [x] 1.1 Extend `ob-option-meta` with field-based kind, size-family, and storefront-label output while preserving existing default kind callers
- [x] 1.2 Add a centralized helper that returns original ProductOptionValue indexes in EU numeric or apparel semantic order, with lossless source-order fallback

## 2. Variant Picker Integration

- [x] 2.1 Use centralized display labels in all product variant-picker presentations while retaining raw option names in form controls
- [x] 2.2 Pass option kind/family metadata into the shared option renderer and iterate values in the helper-provided order without changing Dawn control semantics

## 3. Verification and Handoff

- [x] 3.1 Run OpenSpec validation, Shopify Theme Check, and targeted static checks for numeric, letter, subset, and fallback ordering
- [x] 3.2 Push only changed theme snippets to main theme `148245381229`
- [x] 3.3 Verify footwear and apparel PDP labels, ordering, selection, availability, desktop layout, and mobile layout on the live dev storefront
- [x] 3.4 Update the reuse ledger/current-status docs to mark the capability implemented
