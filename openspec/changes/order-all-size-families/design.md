## Context

`ob-option-value-order` returns a PDP option's value indexes in storefront order. It branches on the size family that `ob-option-meta` derives (`shoe-eu`, `tops`, `bottoms`), and every other family returns source order. It ranks by looping candidate labels: the letter list, then the integers 1..100. That loop can't rank `104`, `36.5` or `S_M`. `ob-size-memory.js` already sorts every size option, but with the same narrow value grammar.

Values seen in the pre-live catalog (2026-11-06):
- **Letter sizes:** `XXS`…`XXXXL`, also as `4XL`.
- **Letter ranges:** `S_M`, `M_L`, `L_XL`, `XS_M`.
- **Numbers:** `24`…`164`, `36.5`, `W25`…`W34`.
- **Number ranges:** `116_128`, `152_164`, `23_26`, `2_5`.
- **One-size tokens:** `ONE`, `OS`, `O_S`, `OneSize`.
- **Unknown:** `PP`.

## Goals / Non-Goals

**Goals:** one family-independent ranking of size values, identical in Liquid and JS, that handles ranges, numbers of any magnitude and decimals.

**Non-Goals:**
- No change to how range values are *labeled* (`S_M` stays `S_M`).
- No change to the PLP size facet order.
- No size-chart routing change. `size_kind` stays for `ob-size-chart`.

## Decisions

- **Order every size option, not a list of families.** The bug came from a family that wasn't on the list. A value ranking is safe for any key because unknown values keep source order, so an unknown key degrades to the old behavior on its own. The alternative, adding `accessory`/`socks`/`bra` to `ob-option-meta`, would break again on the next new key.
- **Rank by fixed-width sort keys, not candidate loops.** Each value gets the key `group + primary + secondary + source index`, zero-padded, and the keys are sorted as strings with Liquid `sort`. The parts:
  - **Group:** 1 = letter, 2 = number, 9 = unknown.
  - **Primary:** the letter's position, or the number × 100.
  - **Secondary:** 0 for a single size, or the second part's rank + 1 for a range.

  This is O(n log n) and has no magnitude ceiling. Candidate loops would need an ever larger numeric range and can't express decimals.
- **A range ranks inside its first part's group.** Its two parts must both parse and share a group, otherwise the value counts as unknown. That puts `S` < `S_M` < `M`.
- **One-size tokens stay unknown.** They only ever appear alone, so their position doesn't matter. `O_S` fails the range parse and stays unknown.

## Risks / Trade-offs

- [Risk] Liquid has no regex, so the number check is done by stripping digits and one separator. → It accepts only `W?digits([.,]digits)?`. Anything else becomes unknown, which keeps source order and loses nothing.
- [Risk] The Liquid and JS rankings drift apart. → The JS comment names the Liquid twin, and both get the same grammar in this change.
