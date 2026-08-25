## 1. CSS: shared token

- [x] 1.1 Add `--ob-pdp-photo-surface: #f1f5f9` to the `.ob-pdp` token block in `assets/component-ob-pdp.css` (same tint as the PLP's `--ob-product-photo-surface`, kept as a distinct variable rather than shared since `--ob-pdp-surface` is pure white and mixing it with white produced no visible blend).

## 2. CSS: color chip geometry and surface

- [x] 2.1 Update `.ob-pdp .ob-swatch-input__chip`: `width`/`height: 5rem`, remove `padding`, keep `border-radius: 0.8rem`, `border: 0.1rem solid transparent`, `background-color: color-mix(in srgb, var(--ob-pdp-photo-surface) 40%, #fff)`, `transition: background-color var(--duration-short) ease`.
- [x] 2.2 Remove the obsolete inset-radius rule on the chip image now that the padding box is gone.
- [x] 2.3 Add `.ob-pdp .ob-swatch-input__chip img { mix-blend-mode: multiply; }`.

## 3. CSS: chip interaction states

- [x] 3.1 Group hover/`:checked`/focus-visible into one selector setting `background-color: var(--ob-pdp-photo-surface)` and `border-color: #66666612`.
- [x] 3.2 Explicitly reset `border-width: 0.1rem` in that grouped rule — the shared `component-ob-swatches.css` `:checked` rule sets `border-width: 0.2rem`, which survives untouched if only `border-color` is overridden.
- [x] 3.3 Remove the old ink `border-color` + `box-shadow` ring from `:checked`; keep an inset outline ring on focus-visible.

## 4. CSS: main gallery image

- [x] 4.1 Update `.ob-pdp .product__media-wrapper .product__media`/`.media`: `border: 0.1rem solid transparent`, `background: var(--ob-pdp-photo-surface)`, add `transition: border-color var(--duration-short) ease`.
- [x] 4.2 Add `.ob-pdp .product__media-wrapper .product__media img`/`.media img { mix-blend-mode: multiply; }`.
- [x] 4.3 Add a hover/focus-within rule on `.product__modal-opener` (the zoom-trigger wrapper) setting `border-color: #66666612` on the frame.

## 5. CSS: thumbnail rail

- [x] 5.1 Update `.ob-pdp .thumbnail`: `border: 0.1rem solid transparent`, `background: color-mix(in srgb, var(--ob-pdp-photo-surface) 40%, #fff)`, `box-shadow: none`, transition on both `background-color` and `border-color`.
- [x] 5.2 Add `.ob-pdp .thumbnail img { mix-blend-mode: multiply; }`.
- [x] 5.3 Explicitly name every Dawn active/focus pseudo-state combination (`[aria-current='true']`, `[aria-current='true']:focus`, `[aria-current='true']:focus-visible`, `[aria-current='true']:focus:not(:focus-visible)`, `:hover`) with `background-color: var(--ob-pdp-photo-surface)`, `border-color: #66666612`, and `box-shadow: none` — a shorter selector list ties Dawn's own rules on specificity and loses on source order for whichever pseudo-state isn't named.
- [x] 5.4 Add `opacity: 1` to the same grouped rule to cancel Dawn's base `.thumbnail:hover { opacity: 0.7 }`.
- [x] 5.5 Give `:focus-visible` its own rule with the same background/border plus an inset outline ring, and its own `box-shadow: none`.

## 6. Verify (completed live on the dev theme)

- [x] 6.1 Confirmed on multiple products (Hi-Tec Silver Shadow, Loewenweiss Hygge, Pas de Monaco Vesper) that resting chips/thumbnails/main image show the muted color-mixed background, and hover/focus/selected all show the same lighter surface + hairline border with no ink ring.
- [x] 6.2 Confirmed the PLP card swatches (collection grid) are visually unchanged after the CSS refactor to the shared token — no shared-file edits were made.
- [x] 6.3 Checked a light-colored product photo and a dark/saturated product photo (Silver Shadow vs. Hygge) — `mix-blend-mode: multiply` reads acceptably on both.
- [x] 6.4 Verified keyboard-focus and mouse-click paths separately on the thumbnail rail (`:focus-visible` vs. `:focus:not(:focus-visible)`) — both show only the hairline cue, no leftover Dawn box-shadow ring.

## 7. Docs

- [x] 7.1 Archive this change (syncs both delta specs — `pdp-option-rails` and `pdp-gallery-chrome` — into their main spec files automatically).
- [x] 7.2 Add a one-line status note to CLAUDE.md's Current Status section recording the PDP gallery/chip surface treatment alongside the existing `match-pdp-to-proto` entry.
