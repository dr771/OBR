## Context

See proposal.md – Why. `ob-media-color-code` parses a filename left to right as `{sha1}_{item}_{color…}__{shot}`, assuming the item code is one segment. The PDP compares that output with the SKU color code from `ob-variant-color-code`. PLP card swatches compare filename codes only with other filename codes, so they are internally consistent even when the parse is off.

Catalog measurement on pre-live (2117 products, all with a color option): 112 colors currently match zero media. With the `_{code}__` rule, 8 remain, all of them data mismatches. No product has one color code that is an underscore-suffix of another, and no filename matches two of its product's color codes.

## Goals / Non-Goals

**Goals:** the PDP shows the selected color's photos for hyphenated item codes; no PDP ever renders an empty gallery because of a filename/SKU mismatch.

**Non-Goals:** changing the PLP card swatch logic; fixing the 8 data mismatches (that is Nick's Akeneo data).

## Decisions

- **Match by "filename carries `_{code}__`", not by stripping the item code.** Filename item codes don't reliably equal the SKU item (`HST378-P36-41` → `HST378`; `MSD-55W` → `MSD_55W__CVRT__01`), so a right-anchored search for the known code is the only robust rule. Alternative considered: pass the SKU item code into the parser and skip its segments — fails on both examples above.
- **Keep the matching inside `ob-media-color-code`** via an optional `color` argument: when the filename carries it, the snippet echoes that code, otherwise the left-parsed code as before. Callers keep their existing `code == blank or code == current` comparison, and the PLP (which passes no `color`) is untouched.
- **Fail-open on zero matches** in both gallery and modal by counting matches first and switching the color filter off when the count is 0, before any other gallery state (single-media, `hide_variants`) is derived.

## Risks / Trade-offs

- [A color code that is an underscore-suffix of another on the same product, e.g. `953` and `192_953`] → would show both colors' photos for `953`. Not present in today's catalog; the left-parsed exact match still wins for the longer code.
- [Fail-open shows other colors' photos for a mismatched color] → better than an empty gallery; the mismatch stays visible for data cleanup.
