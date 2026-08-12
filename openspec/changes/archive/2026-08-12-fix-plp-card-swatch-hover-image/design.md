## Context

See proposal.md - Why/What Changes for the bug and root cause. This design covers only `ensureHoverImage()` in `assets/ob-card-swatches.js`, called from two places: `selectSwatch()` (click/focus/hover on a chip) and the document-level `mousemove` handler (pointer entering `.card__media`).

Current structure inside the media wrapper (`.card__media .media`) is always one of:
- primary `<img>` only, or
- primary `<img>` + Dawn's server-rendered secondary `<img>` (when the section's `show_secondary_image` setting is on), or
- primary `<img>` + our own synthetic `.ob-card-img2` (created client-side, only when no Dawn secondary image exists).

The existing CSS reveal rules in `assets/component-ob-swatches.css` target "the second `<img>` in the media wrapper" structurally (`img + img` / `img:first-child:not(:only-child)`), not by class — so they already work no matter which of the two second-image sources is present.

## Goals / Non-Goals

**Goals:**
- Make the color-matched second shot win whenever the active swatch has one, on every grid, regardless of the section's `show_secondary_image` setting.
- Preserve today's fallback (Dawn's original default second image) for colors with no second shot of their own, so single-shot colors don't regress to no-secondary-image.
- No new DOM nodes, no CSS changes.

**Non-Goals:**
- Not touching the primary-image swap path (`selectSwatch()`'s `img` src update) — already color-aware and unaffected by this bug.
- Not changing which sections have `show_secondary_image` on — that's merchant-owned theme-editor state, out of scope for a code fix.

## Decisions

**Reuse Dawn's existing secondary `<img>` element instead of creating `.ob-card-img2` alongside it.** Two second `<img>` elements in the same media wrapper would each match the structural `img + img` CSS rule ambiguously and double the request count. Retargeting the element Dawn already rendered keeps exactly one second-image element per card, matching the CSS's structural assumption.

**Capture the element's original `src`/`srcset` once, in a `data-ob-orig-src(set)` pair, on first encounter.** This is what lets a later color selection with no second shot restore Dawn's default image instead of leaving a stale color's second shot behind. Alternative considered: re-reading `img.currentSrc`/`srcset` fresh each time — rejected because after the first retarget the live attributes no longer hold the original value, so the only correct source is a one-time capture.

**Do not gate retargeting Dawn's reused element by `allowCreate`/`hoverMediaQuery` the way `.ob-card-img2` creation is gated.** The `allowCreate` and `(hover: hover) and (pointer: fine)` gates exist specifically to stop touch devices from *fetching a new image they'd never see*. Dawn's own secondary `<img>` is already unconditionally server-rendered and fetched by the browser whenever `show_secondary_image` is on, independent of touch capability — that fetch already happens today, before this fix, as plain Dawn behavior. Retargeting its `src` on a touch tap changes *which* image loads but doesn't introduce a new class of fetch that didn't already exist. Gating it the same way as `.ob-card-img2` would reintroduce the bug (touch users tapping a chip would see Dawn's stale default instead of the tapped color, with no way to ever load the correct one on a touch-only device).

## Risks / Trade-offs

- [Repeated color switching across many chips on a card with `show_secondary_image` on triggers one image fetch per switch, same as the existing `.ob-card-img2` path already does] → Accepted; this already happens for products in `data-ob-card-swatches` grids without a section-level secondary image, so it's not a new class of behavior, just extended to one more surface.
- [Touch-tap now fetches a color-specific image where before it left Dawn's default in place] → Acceptable per the Decisions section above: the element and its fetch already existed on that section; this only changes which color it shows for, which is required for the fix to have any effect on touch/hybrid devices.
