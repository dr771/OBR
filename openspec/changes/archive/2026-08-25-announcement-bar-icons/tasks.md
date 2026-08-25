## 1. Icon set

- [x] 1.1 Add a `refresh-cw` case to `snippets/ob-icon.liquid` using the path data captured from the proto (`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8` / `M21 3v5h-5` / `M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16` / `M8 16H3v5`), updating the snippet's doc comment's icon list.

## 2. Block schema

- [x] 2.1 Add an `icon` select field to the `announcement` block schema in `sections/announcement-bar.liquid`, options: none (default) + every value `ob-icon.liquid` supports (`truck`, `clock`, `shield-check`, `check`, `ruler`, `refresh-cw`). Used plain literal labels (not `t:` keys), matching the existing `pdp-usp-strip` icon field convention in `sections/main-product.liquid`.

## 3. Markup

- [x] 3.1 In the single-block branch, render the icon via `{% render 'ob-icon', icon: ..., class: 'announcement-bar__icon' %}` before the message span when an icon is set; render nothing extra when unset (byte-identical to current output).
- [x] 3.2 In the multi-block branch, apply the same icon render inside each `.slideshow__slide`'s message markup.
- [x] 3.3 Confirmed by code review: the single-block branch's icon render is gated identically (`icon != blank and icon != 'none'`) and nothing else in that branch changed. Live content had already moved past the placeholder single-block config (see 5.2) so this couldn't be re-verified live without disrupting merchant content, but the logic is unchanged from the always-safe default.

## 4. Responsive layout CSS

- [x] 4.1 Create `assets/component-ob-announcement-bar.css`, scoped to `.announcement-bar-slider .slider`, and load it from `sections/announcement-bar.liquid`.
- [x] 4.2 Tablet (750–989px): set each `.slideshow__slide` to 50% width (minus half the 3.2rem gap) so exactly 2 are visible per view; button scroll math is generic (`SliderComponent`), unmodified.
- [x] 4.3 Desktop (≥990px): set `.announcement-bar-slider .grid--1-col.slider--everywhere` to `overflow: visible; scroll-snap-type: none;` and lay out slides as a centered `nowrap` flex row; hide `.slider-button` prev/next at this breakpoint. Also overrode base.css's `.announcement-bar-slider { width: 60% }` (≥990px) to 100%, needed for 3 items to fit.
- [x] 4.4 Mobile (<750px): confirmed no CSS change needed — existing 1-visible behavior untouched (no rules below 750px in the new stylesheet).
- [x] 4.5 Icon sized at 1.4rem (14px) against `.announcement-bar__message`'s `h5` class, which resolves to `1.2rem` (12px) at default heading scale — the same ratio as the proto's 14px icon / 12px text, so the literal proto value happens to already fit Dawn's own type scale here. `.announcement-bar__message` changed to a flex row (`align-items:center`) so icon/text/arrow line up on one baseline. Final call pending live screenshot (task 5.3).

## 5. Verification

- [x] 5.1 Pushed `sections/announcement-bar.liquid`, `snippets/ob-icon.liquid`, `assets/component-ob-announcement-bar.css` to theme `148245381229`.
- [x] 5.2 The live theme already had 3 real announcement blocks configured (not the placeholder in the stale local repo copy) — "Gratis verzending vanaf 70€" (truck), "Voor 12u besteld, morgen in huis" (clock), "Alleen originele topmerken" (shield-check), already on `scheme-3` (dark) with `auto_rotate: true`. None repeat the false "30 dagen gratis retour" return claim, so no copy substitution was needed. Pulled `sections/header-group.json` fresh first (per project convention — it's merchant-editable state), merged in the 3 `icon` settings, pushed, and copied the reviewed live file back into the repo so it stays in sync. Owner instruction mid-task: keep the existing dark scheme (`scheme-3`) rather than adding a new proto-matched color scheme — left untouched.
- [x] 5.3 Verified live at mobile (390px: 1 message, truck icon, arrows), tablet (800px: 2 messages, arrows), and desktop (1440px: all 3 messages, no arrows, no scroll, centered) — matches spec exactly.
- [x] 5.6 (found during review) Two proto-fidelity bugs caught after initial ship, both fixed in `assets/component-ob-announcement-bar.css`: (1) `.announcement-bar__message` inherits the `h5` class's heading font (Fraunces serif) — proto uses the body sans font at weight 500; added an explicit `font-family: var(--font-body-family); font-weight: 500;` override. (2) At desktop, `auto_rotate: true` (live setting) still fires its JS timer even though nothing scrolls; the fade-transition classes it applies (`announcement-bar-slider--fade-in-next` etc., from `assets/global.js`) default a non-"current" slide's message to `opacity: 0`, which never resolves back to 1 without an actual scroll — silently hiding the middle message. Added a higher-specificity desktop-only override forcing `opacity: 1; animation: none;` on all four fade-class variants. Verified this holds through a full autoplay cycle (6s wait, `change_slides_speed: 5`).
- [x] 5.4 N/A — live content moved past the single-block placeholder before this change (see 5.2); single-block markup path verified by code review instead (see 3.3).
- [x] 5.5 Verified: tab to the tablet next button, Enter advances exactly one message, focus and visible focus ring retained on the button. No related console errors (checked `list_console_messages`).

## 6. Docs

- [x] 6.1 Owner decision: skip matching the proto's exact navy — use the theme's own existing dark color scheme (`scheme-4`, #121212/#ffffff, already the section schema's own default) instead. No new color scheme needed; set the section's `color_scheme` setting to `scheme-4` when configuring the live blocks (task 5.2).
