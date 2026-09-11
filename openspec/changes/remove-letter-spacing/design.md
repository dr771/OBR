## Context

Letter-spacing inherits, and Dawn seeds it at the root: `layout/theme.liquid`'s inline `body { letter-spacing: 0.06rem }`. Dawn then adds larger values on its own classes (`.button` 0.1rem, `.badge` 0.1rem, `.field__label` 0.1rem, headings `calc(var(--font-heading-scale) * 0.06rem)`, `.caption-with-letter-spacing` 0.13–0.18rem, subtitles, price, select). Every `ob-*` component that was measured against a reference set its own value — usually `normal`/`0` for body text, and wide tracking (0.12–0.34rem) for uppercase eyebrows and labels. The result is a patchwork: rebuilt components are tight, untouched Dawn surfaces are loose, and eyebrows are very loose.

## Goals / Non-Goals

**Goals:**
- Zero positive tracking on theme-rendered text, everywhere, in one pass.
- Keep every negative heading-tightening value exactly as it is.
- Leave no specificity or inheritance path through which a positive value can still reach text.

**Non-Goals:**
- Changing font size, weight, case, or line-height of anything, including the eyebrows.
- Styling third-party app markup (Wishlist King, Trusted Shops) beyond the theme's existing overrides.

## Decisions

**Replace each positive value with `normal`, rather than deleting the declaration.** Letter-spacing inherits as a computed absolute length. Deleting a declaration makes the element inherit from its parent, which in a few places is a heading with negative `em` tracking (e.g. a hero eyebrow nested in a negatively tracked block), so the text would silently pick up the heading's tightening. Writing `normal` pins it to zero regardless of ancestry and keeps the diff a one-token change per line in stock Dawn files, which makes future Dawn diffs easy to read. Alternative considered: a single global `* { letter-spacing: normal !important }` — rejected because it would also flatten the negative heading values and the star-rating geometry, and `!important` would beat every future component override.

**Edit the source declarations, not a late override sheet.** An override stylesheet would have to out-specify every Dawn and `ob-*` selector individually (and track new ones), whereas Dawn's classes are the source. The repo already carries edited Dawn stylesheets.

**One exception.** `component-rating.css` uses `letter-spacing` on the star glyph string and feeds the same variable into the row's `width` calculation — changing it would break the star layout, and it is not text tracking. The brand wordmarks (`.ob-lt-*`, `.ob-logotype small`) were first kept as logo imitations, but live sampling showed the homepage "Uitgelichte merken" grid renders every brand as a text wordmark (only the marquee and Merken chips use logo files), so their tracking is visible UI text and goes too.

## Risks / Trade-offs

- [Uppercase eyebrows at 10–12px read denser without tracking] → Accepted owner decision; size/weight unchanged so the hierarchy still comes from case, weight, and colour.
- [Specs recorded measured reference tracking] → The three affected requirements (`plp-card-meta`, `pdp-layout-chrome`, `cart-drawer-line-item-layout`) are modified in this change to record the deliberate departure.
- [A selector missed by the sweep still sets positive tracking] → Verified live by sampling computed `letter-spacing` of every element on the homepage, a collection page, a PDP, and `/cart`, and listing any positive value with its selector source.
- [Width-measuring JS (`ob-wishlist.js` option ruler) depends on tracking] → It measures rendered text with an off-screen ruler that inherits the live styles, so it adapts automatically.

## Migration Plan

Push the changed CSS files and `layout/theme.liquid` to theme `148245381229` with an explicit `--only` list (no `templates/*.json` involved). Rollback is reverting the commit and re-pushing the same file list.
