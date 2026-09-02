# CI Style Tokens — reference

Reusable reference for the design conventions already shipped across PDP,
footer, PLP swatches, announcement bar, and (as of 2026-09-01) the cart
drawer. Compiled while matching the empty cart-drawer to house style so the
next component doesn't need a fresh multi-agent audit to re-derive the same
values. Not a spec (no SHALL/MUST requirements) — a lookup table. If a value
here and the live theme disagree, the theme wins; re-verify via
`getComputedStyle` before trusting an old entry (see CLAUDE.md's memory
provenance rule — same caveat applies to this file).

## Font stack

- Body: **Inter**. Headings: **Fraunces** (serif) — **authoritative rule is
  MIXED-SHOPS-PLAYBOOK.md:300-302, read that first**: "Dense commerce
  UI... uses the Inter/body variable... Fraunces reserved for true
  headings." In practice this cashes out by *surface*, not by tag or size:
  **only PLP and PDP headings get Fraunces. Every other surface — cart
  (drawer and full page), footer, announcement bar, predictive search,
  wishlist, account/utility pages — is Inter, full stop**, regardless of
  whether the element is a big `<h1>` or a small label. (An earlier version
  of this doc guessed "genuine display heading vs. dense UI" as the
  dividing line and wrongly kept the `/cart` page's h1s in Fraunces because
  they looked page-level-prominent — corrected 2026-09-01 per the owner:
  the surface is what matters, not how big the text renders.) Explicit
  forces already in place: `component-ob-footer.css:109`,
  `component-ob-announcement-bar.css:21`,
  `component-ob-swatches.css:450/524/532/554/569`, `component-ob-pdp.css:640`
  (dense elements *within* the PDP surface, e.g. its accordion labels — the
  PDP product `<h1>` itself stays Fraunces since PDP is one of the two
  Fraunces-approved surfaces), `component-ob-cart-page.css` (`/cart` page
  h1s + login h2).
- **The entire cart drawer is force-Inter site-wide**:
  `.cart-drawer, .cart-drawer * { font-family: var(--font-body-family) !important; }`
  (`component-cart-drawer.css:527-530`). If a drawer heading looks wrong,
  it's never font-family — check weight/tracking/size.
- Dawn ships Inter 400/700 only. `theme.liquid` loads 500/600 explicitly
  (`layout/theme.liquid:82-100`) — a declared 500/600 with no loaded face
  silently remaps to 400/700, invisible to `getComputedStyle` diffing.
- `--font-heading-scale` / `--font-body-scale` are theme-setting driven (both
  `1.0` on live as of 2026-09-01) — `calc(var(--font-heading-scale) * Xrem)`
  patterns scale with the merchant's own type-scale setting, so prefer them
  over a bare `Xrem` when matching an existing heading.

## Color tokens

- `--ob-accent: #38b6ff` (`base.css:7`) — the one global CTA/brand-blue
  token. **Too light for AA text contrast** (~2.3:1 on white) — never use as
  link/label text color directly.
- `--ob-pdp-accent-ink: #0d80c4` (`component-ob-pdp.css:36`) — the readable,
  AA-safe darker sibling, used wherever accent color must sit on top of body
  text (hover ink, PDP accent copy). **Reuse this literal hex (`#0d80c4`)
  outside PDP scope** — component-scoped tokens (`--ob-pdp-*`) are not meant
  to be referenced cross-component in this codebase; duplicate the value, not
  the variable name. Shipped example: `component-cart-drawer.css` login link.
- `--ob-pdp-accent-icon: #1e9fe6` — accent for icons/hover-*background*
  (not text). Same value as `--ob-button-background-hover`.
- Ink scale (PDP-scoped, `component-ob-pdp.css:15-41`): `--ob-pdp-ink:
  #0f172a` (near-black, also `--ob-button-background`), `--ob-pdp-ink-light:
  #334155`, `--ob-pdp-ink-muted: #64748b`, `--ob-pdp-line: #e2e8f0`.
- Surface tint (reused across PDP/PLP/swatches): `#f1f5f9`
  (`--ob-pdp-photo-surface`, `--ob-product-photo-surface`) — a light tint
  used as the photo backdrop that images `mix-blend-mode: multiply` onto.
- Global page foreground: `rgb(18, 18, 18)` (`--color-foreground`, measured
  live) — near-black, not pure black.

## Buttons

`assets/component-ob-buttons.css` — two layers, apply both together:

1. **`.button`** (base, applies everywhere via `:not(.button--tertiary,
   .button-close, .slider-button, .share-button__button, .button-show-more,
   .button-show-less)`): pill shape (`border-radius: 999.9rem`), dark-ink
   fill (`#0f172a`), white text, hover fills `#1e9fe6`. This alone still
   carries **Dawn's raw label typography** (400 weight, ~1px letter-spacing)
   — color/shape only.
2. **`.ob-button--cta`** — the actual default CTA-label refinement on top of
   `.button`: `min-width: 20.5rem; min-height: 4.4rem; padding: 1.2rem
   2.8rem; font-size: 1.4rem; font-weight: 600; letter-spacing: normal;
   text-transform: none;`. Originally scoped to `.collection__view-all
   .ob-button--cta` (PLP/homepage "Alles bekijken" only) — **unscoped to a
   bare class 2026-09-01** so it's reusable. **Always pair `class="button
   ob-button--cta"` for any new primary CTA** rather than hand-tuning
   `.button` label typography per-component.
   - Reference/live examples: `sections/featured-collection.liquid:228`
     ("Alles bekijken"), `snippets/cart-drawer.liquid` empty-state "Continue
     shopping", `sections/main-cart-items.liquid` `/cart` empty-state
     "Continue shopping", `sections/main-cart-footer.liquid` `/cart` checkout
     button (`.cart__ctas button { width: 100% }` already makes it
     full-width — `.ob-button--cta`'s `min-width` doesn't fight that, only
     the label typography and `min-height` apply).
   - Note: PLP "Toon meer" (load more) is deliberately **not** a filled
     button — it's `class="button-show-more link underlined-link"`, styled
     as a plain text link (`component-show-more.css`), excluded from the
     `.button` fill rule above.

3. **`.ob-button--outline`** — paired secondary action: same pill radius,
   `1px` border `#d9dee5`, background-colour fill, near-black text, and a
   subtle `#f8fafc` hover surface with near-black border. Use together with
   `class="button ob-button--outline"`; the shared discount-code Apply button
   uses this treatment on both cart surfaces.
4. **Checkout labels** — `.cart__checkout-button` is uppercase on cart and
   drawer checkout CTAs; the subtotal dot and amount retain their normal case.

## Links (inline text, not buttons)

Consistent pattern across the codebase: muted/ink at rest → accent or full
ink on hover, mostly no default browser underline unless the link is a
"trigger" affordance inside running text.

- Breadcrumbs (`component-ob-pdp.css:126-135`): `color:
  var(--ob-pdp-ink-muted); text-decoration: none;` → hover
  `var(--ob-pdp-ink)`.
- Size-guide trigger (`component-ob-pdp.css:522-543`): muted ink,
  `text-decoration: underline; text-underline-offset: 0.4rem;` → hover full
  ink. This is the closest analog for an inline sentence link.
- Footer link list (`component-ob-footer.css:133-145`): `rgb(100,116,139)`
  (≈ `--ob-pdp-ink-muted`) → hover `rgb(30,159,230)` (`#1e9fe6`).
- Cart-drawer login link (`component-cart-drawer.css`, 2026-09-01): accent
  ink `#0d80c4` at rest (not muted — it's the section's one CTA),
  `text-decoration: underline; text-underline-offset: 0.2rem;` → hover full
  ink `#0f172a`.

## Headings — the real rule

Not "dense UI vs. display heading" (an early miscall in this doc's first
draft) — the actual signal is **CI-matched vs. still-raw-Dawn**. Every
heading this project has touched, whether serif display copy (PDP `<h1>`
product title) or a compact Inter UI label (`.drawer__heading`), ends up at
the same two values. Untouched Dawn headings are the odd ones out.
- `font-weight: 600` (not the raw `--font-heading-weight` setting, which is
  `400` live — Dawn's h1-h5 default weight is regular, not bold).
- `letter-spacing: normal`/slightly negative (`-0.01em`-ish) — never Dawn's
  raw `calc(var(--font-heading-scale) * 0.06rem)` positive tracking (h1-h5
  default), which reads as loose/dated next to anything already fixed.
- Font-family is a **separate decision from weight/tracking, but not an
  independent judgment call** — see "Font stack" above: Fraunces only on
  PLP/PDP, Inter everywhere else, by surface. Don't reason it out per
  element (a mistake this doc made once already, on `/cart`'s h1s).
- `component-ob-typography.css` already applies weight 600 / `-0.01em`
  globally to **bare, unclassed `h2`/`h3`** tags site-wide (its `:not(.h0,
  .h1, .h2, .h3, .h4, .h5, ...)` exclusion list only skips elements carrying
  those utility classes) — but it does **not** touch font-family, so a
  non-PLP/PDP surface's bare h2/h3 gets the weight/tracking fix for free
  and still needs its own font-family override (this is exactly what bit
  `/cart`'s `.cart__login-title` h2). **There is no equivalent sitewide
  `h1` rule at all** — every plain `<h1>` site-wide (customer
  account/login/addresses, 404, blog title, collection banner, `/cart`'s
  two h1s) was still on raw Dawn weight/tracking as of 2026-09-01 unless a
  surface added its own override (PDP via `.ob-pdp h1`; `/cart` now does
  too). Don't add a blanket global `h1:not(...)` rule without deciding to
  touch all of those pages at once — fix per-surface instead, scoped like
  the examples below.
- Match size to the *nearest sibling in the same block*, not just to a
  component elsewhere — a label at 14px next to a sentence still at 16px
  reads as inverted hierarchy even if each is individually "correct" against
  some other reference. (Caught by eye on the cart-drawer login block; a
  computed-style diff per-element alone didn't flag it.)
- Reference implementations, all Inter/600/tight: `.drawer__heading`,
  `.cart-item__name`, `.footer-block__heading`, PDP eyebrow label,
  `/cart`'s `.cart__empty-text`/`.title--primary`/`.cart__login-title`
  (`component-ob-cart-page.css`). Fraunces/600/tight: PDP `<h1>` only.

## A querySelector gotcha when verifying cart surfaces live

The cart **drawer** (header, sitewide) and the full **`/cart` page** render
overlapping class names (`cart__empty-text`, `cart__login-title`,
`cart__login-paragraph`) for their own, separately-styled empty states — and
the drawer's markup is present in the DOM on *every* page, including `/cart`
itself, rendered before `<main>`. A bare `document.querySelector('.cart__empty-text')`
on the `/cart` page silently returns the **drawer's** (hidden) element, not
the page's own — its computed style will look "already fixed" even when the
page's own heading isn't touched yet. Always scope the query: `main
.cart__empty-text` for the page, `.cart-drawer .cart__empty-text` for the
drawer's own CSS scoping mirrors this: `.cart-drawer .foo` for the drawer,
`cart-items .foo` for the page (its own wrapper custom element, distinct
from `<cart-drawer>`) — see `component-ob-cart-page.css`.

## Where this doesn't apply

- The full `/cart` page's own line-item table/layout (product rows, quantity
  controls, totals block) has **not** been matched to CI beyond the heading/
  button/login fixes above (2026-09-01) — TODO.md's "messy layout, take from
  Holster" item is a separate, larger task, not done by this pass.
- Bolt-reference-matched surfaces (PDP, PLP, footer, announcement bar) have
  their own component CSS files (`component-ob-pdp.css` etc.) with
  measured-to-the-pixel values from the approved Bolt prototype — those
  files are the source of truth for their surfaces; this doc only extracts
  the *reusable cross-component conventions*, not every measured value.
