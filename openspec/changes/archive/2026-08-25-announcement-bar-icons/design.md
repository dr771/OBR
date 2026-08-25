## Context

`sections/announcement-bar.liquid` renders two shapes today: a single block (plain `<div>`, no slider) and 2+ blocks (a `slideshow-component` wrapping a `.slider` of `.slideshow__slide` items plus `.slider-buttons` prev/next arrows). `slideshow-component` (assets/global.js) extends the theme's generic `SliderComponent`: button clicks scroll the container by one slide's measured width (`sliderItemOffset`), recomputed on resize via `ResizeObserver`, and prev/next disabled-state is derived from actual slide geometry — none of this is hardcoded to "one slide per view." Optional autoplay is driven by `data-autoplay`/`data-speed` on the slider element and a `setInterval`-based `play()`/`pause()`, which is not viewport-aware.

Dawn already uses the "N slides visible per breakpoint" idea elsewhere (`grid--2-col-tablet` + `slider--tablet` in `sections/featured-blog.liquid`, `sections/multicolumn.liquid`), but those are generic card-grid utility classes used broadly across the theme. See proposal.md for why this change exists and specs/header-announcement-bar/spec.md for the exact behavior contract.

## Goals / Non-Goals

**Goals:**
- Per-block optional icon, drawn from the theme's existing curated icon set (`snippets/ob-icon.liquid`).
- Mobile 1-visible / tablet 2-visible / desktop all-visible-static, using Dawn's existing breakpoints (749px, 989px) and the existing slider JS unmodified.
- No changes to shared `assets/global.js` or to the generic grid utility classes other sections depend on.

**Non-Goals:**
- Image-upload icon override (decided: curated select only).
- Defining the proto's exact bar color as a new theme color scheme (owner's admin action, not this change).
- Making the proto's own two-state (1/all) responsive behavior — desktop diverges from the proto by owner's explicit choice (see proposal.md).

## Decisions

**Scoped CSS instead of reusing `grid--2-col-tablet`/`slider--tablet` literally.** Those classes are shared, broadly-used utilities (card grids, blog post grids). Reusing the literal classes on the announcement bar would couple this section's layout to any future change to those shared rules, and their existing `:after` spacer / `contains-card` variants carry assumptions (card padding, shadow padding) that don't apply to a text+icon bar. Instead, new rules are added scoped to `.announcement-bar-slider .slider` in `assets/component-ob-announcement-bar.css` (new file, following this project's `component-ob-*.css` per-capability convention) that reproduce the same *effect* — 100% slide width under 750px (Dawn default, untouched), 50% width 750–989px, and a static no-scroll flex row at ≥990px — without touching the shared classes.

**Desktop "no scrolling" achieved via CSS, not by disabling the JS.** At ≥990px, `.announcement-bar-slider .slider` gets `overflow: visible` and `scroll-snap-type: none`, and `.slider-buttons .slider-button` (prev/next) get `display: none`, with the slide list laid out as a centered `flex` row. The slideshow's autoplay `setInterval` (if a merchant enables `auto_rotate`, which the live section does) keeps running in the background at desktop width. Its `scrollTo` call is a harmless no-op (no scrolling box to move), but `applyAnimationToAnnouncementBar()` — called on every autoplay tick — also adds one of four `announcement-bar-slider--fade-in/out-next/previous` classes to slides, and those classes default a message's `opacity` to `0` in `assets/base.css`. That opacity never resolves back to `1` without a real scroll happening, so autoplay was silently hiding the non-"current" message at desktop (caught live, not anticipated in the original design pass). Fixed by adding a desktop-only override that forces `opacity: 1; animation: none;` on all four fade-class/`.announcement-bar__message` combinations, at higher specificity than the base rule. This still satisfies "does not rotate or scroll" without editing `assets/global.js`.

**Icon field reuses the full existing `ob-icon.liquid` set, not just the proto's three.** The select offers every icon already defined there (`truck`, `clock`, `shield-check`, `check`, `ruler`, plus the new `refresh-cw`) rather than a bespoke three-option list, so a merchant configuring a 4th or 5th message later isn't blocked. Default is unset/none, so the current single "Welcome to our store" block renders byte-identical text-only output until a merchant opts in.

**`refresh-cw` path copied verbatim from the live proto**, not redrawn, to guarantee stroke geometry matches `truck`/`shield-check` (both already ported the same way) exactly.

**Icon size is tuned during implementation, not spec-locked to the proto's literal 14px.** The proto's message text is 12px; Dawn's `.announcement-bar__message` uses the `h5` type-scale class, which is larger. Copying 14px verbatim would look undersized next to Dawn's own type scale. The implementation picks a size proportional to the existing message text and confirms visually against a live screenshot (this project's normal verification step), rather than the spec dictating a fixed px that would fight the theme's real typography.

## Risks / Trade-offs

- [Risk] Background `setInterval` autoplay still runs at desktop width — the scroll itself is a no-op, but the fade-transition classes it applies are not (see Decisions) → Mitigation: desktop-only CSS override forcing full opacity on all fade-class variants; verified stable through a full autoplay cycle rather than forking shared slideshow JS for one section.
- [Risk] Tablet's 2-up width change could interact with the existing `ResizeObserver`-driven `initPages()` in unexpected ways at the 749/990px boundaries → Mitigation: this recalculation path already exists and is exercised by every other slider in the theme; verify live at both boundary widths during implementation.
- [Risk] New per-breakpoint CSS could accidentally affect the single-block (no-slider) case → Mitigation: all new rules are scoped under `.announcement-bar-slider .slider`, a class that only exists in the 2+-block markup branch.
