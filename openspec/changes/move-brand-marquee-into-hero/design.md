## Context

The hero (`ob-home-hero`) and marquee (`ob-home-brand-marquee`) are sibling sections. The hero's copy and image live in `.ob-home-hero__inner.page-width`. The requested mobile order puts the marquee between those two children, which CSS cannot do across section boundaries.

## Goals / Non-Goals

**Goals:**
- One marquee in the DOM and one brand list in the theme editor.
- Mobile order: copy, marquee, image, with the band full width.
- Desktop and tablet look unchanged.

**Non-Goals:**
- Fitting the marquee on phones with about 553px visible height (would need hiding the subheading).
- Any change to marquee motion, logos or the JS.

## Decisions

**Marquee markup and blocks move into the hero section.** Alternatives: two instances toggled by breakpoint (double DOM, and `ob-home-marquee.js` only drives the first); moving the node with JS (layout shift on load); `display: contents` across section wrappers (hijacks Dawn's section structure and padding).

**The marquee is a sibling of `__inner`, inside `.ob-home-hero`.** At 750px and up that gives a full-width band under the hero with no `100vw` overflow risk. Below 750px, `__inner` gets `display: contents` and `.ob-home-hero` becomes a flex column, so `order` sorts copy, marquee and media as one list.

**Hero padding moves from the outer wrapper to CSS variables.** The section's padding has to stop before the marquee at 750px and up, and it has to land on copy and media below 750px. The section's style block sets `--ob-hero-pad-top` and `--ob-hero-pad-bottom`; the component CSS applies them. Mobile top padding is capped with `min()` to win back the room the marquee needs.

**Marquee padding becomes fixed CSS.** The old section's two range settings go away with it, keeping the values in use (12px mobile, 16px from 750px).

**The tablet range (750–1023px) keeps the marquee under the image.** The request was for mobile only.

## Risks / Trade-offs

- [Pushing `templates/index.json` could revert live-only Admin edits] → Reconcile live settings into the local file first and push through `scripts/theme-push.sh`.
- [`templates/index.json` is per shop, so one file must not overwrite DEV's own settings] → Apply the same structural move to DEV's own pulled template.
- [The removed section file stays on the shops, because `--only` pushes don't delete] → Delete it from both themes once the template no longer references it.
- [The Trusted Shops badge reveal moves earlier on mobile] → It still waits for the scroll-top arrow; verify on the storefront.
