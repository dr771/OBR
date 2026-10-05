# GOTCHAS.md

Non-obvious traps and working techniques for this repo, shared by Claude Code and Codex. Read the relevant section before debugging. When you find a new one, add it here (the rule first, then a short why), never to a tool's private memory — see AGENTS.md. Hard rules live in CLAUDE.md, decisions in MIXED-SHOPS-PLAYBOOK.md, dated build history in STATUS-LOG.md.

## Dawn CSS overrides

- **Know the value you override.** Before overriding a property on a selector you didn't create, grep its current value. Dawn's `.card__media` is already `position: absolute`; forcing `relative` made it a flex item of `.card__inner` and split every product-card image in half sitewide. If the property affects layout (`position`, `display`, `width`/`height`, `flex*`, `grid*`, `margin`, `float`, `overflow`) on a selector you don't own, measure `getBoundingClientRect()` on two or three untouched neighbours after pushing. Colour, font or radius changes, or anything on a fresh `.ob-*` selector, need nothing extra. On a regression report, first `git stash` + re-push + re-measure to prove or disprove your own diff. Selector reach, not diff size, decides the blast radius.
- **Colour tokens are comma lists** (`--color-foreground: 18,18,18`), so `rgb(var(--token) / .08)` is invalid at computed-value time and the whole declaration drops, although `CSS.supports()` says true. Write `rgba(var(--token), .08)`.
- `visibility: hidden` hides the element's own background too; skeleton text placeholders need `color: transparent` or `opacity: 0`.
- **Font weights need loaded faces.** `layout/theme.liquid` loads body 500/600 via `font_modify`; any weight without a face renders at the nearest loaded one while `getComputedStyle` reports the declared value. Check `[...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.status)`. The heading font (`type_header_font | font_face`) loads only its configured weight.
- Dawn's `base.css` has `div:empty { display: none }`: an empty decorative div (a scrim) needs a two-class selector plus an explicit `display: block`.
- **PDP rules that silently win or survive a restyle** (find them with a winning-rule dump, not by eye):
  - `.product--medium:not(.product--no-media) .product__media-wrapper` is 0,3,0 because `:not()` counts as a class. Use `.ob-pdp .product:not(.product--no-media) .product__media-wrapper`.
  - `.product-media-container .media` sizes by a `padding-top` ratio hack, and `aspect-ratio` doesn't remove it. Zero `padding-top` explicitly.
  - `.thumbnail-list` has an explicit `grid-template-columns: repeat(5, 1fr)`; `grid-auto-columns` only sizes implicit tracks, so set `grid-template-columns: none` first. `.thumbnail-list.slider--tablet-up .thumbnail-list__item.slider__slide` (0,4,0) also pins a percentage item width.
  - `media-gallery.product__column-sticky` is `position: sticky; z-index: 2`; a sibling badge needs `z-index: 3`. Desktop only, since the column isn't sticky on mobile.
  - `.price__container` has a 5px bottom margin, and `align-items: center` centres by the margin box.
  - Don't widen `.product__media-wrapper` with a negative margin: the image, thumbnails/counter and recommendations share grid edges and split apart.
  - Keep Dawn's admin media width by mapping `.product--small/--medium/--large` on the grid container, not a fixed column split.
  - Don't set `object-fit` on the main PDP image; it masks Dawn's Original/Fill admin setting (`media-fit-contain`/`media-fit-cover`). Thumbnails may stay `contain`.
- **The PDP thumbnail rail and counter don't follow a colour change in stock Dawn**: `updateMedia()` diffs only the first `<ul>`. `updateGalleryChrome(html)` in `assets/product-info.js` replaces the thumbnail `slider-component` and copies the counter total, and `MediaGallery.bindThumbnails()` re-binds the clicks. Any new PDP surface filtered per colour needs its own sync there. A stale-looking gallery can also mean a thrown error that stopped price/SKU updates, so check the console.
- Shopify's related-products JSON marks sparse-data results with `pr_prod_strat=collection_fallback`. OB's deterministic PDP rail instead scans `product.collections` in ascending public-read `custom.breadcrumb_rank`, fills only unoccupied positions from broader ranks, and filters every candidate by exact `custom.genderid`.
- `hide_variants` can render the gallery count as `-Infinity` with duplicate `variant_images`; the per-colour media filter owns `media_count`, so keep that setting off.
- Dawn's `swatch-input__input` isn't visually hidden globally; custom facet swatches must position the native input over the chip at zero opacity on every surface, including the mobile drawer fallback.
- Dawn excludes the facet row that triggered an AJAX change from its `innerHTML` replacement; derive selected styling from the input's live `:checked`, not a server-rendered `.active`.
- `enable_customer_avatar` only switches between avatar and generic icon; hiding account access needs a separate gated header setting.
- `CartDrawer.renderContents()` doesn't update the outer `cart-drawer.is-empty`; custom AJAX adds from an empty drawer must toggle it from `parsedState.item_count`.
- The cart drawer's markup is in every page's DOM, including `/cart`, and shares class names with it (`cart__empty-text`, `cart__login-title`, `cart__login-paragraph`). Scope verification queries to `main …` or `.cart-drawer …`.
- Touch keeps `:hover` on a tapped chip. Suppress hover-only tooltips and rings under `@media (hover: none)` and keep `:focus-visible` for keyboards.
- **Android overlay scrollbars** draw inside a row's bottom padding and take no layout space, so spacing keyed on `offsetHeight - clientHeight` is 0 there. Key it on overflow (`scrollWidth > clientWidth`). Dawn's `.active-facets` has `margin: 0 -1.2rem -1.2rem` at ≤989px, which pulls the grid up 12px once any filter is active. Scripted `el.click()` doesn't set `:hover`; use real clicks in `mobile,touch` emulation.
- To preview CSS on the live storefront through DevTools, append the `<style>` to `document.body`: section inline styles later in `<body>` beat the same specificity injected into `<head>`.

## Liquid

- Never name a `render` parameter `handle`: the global `handle` (the current page's) leaks in when the caller omits it, so `| default:` never falls back. Use `brand_handle`, `item_handle`. The same applies to `collection` (hence `trail_collection`).
- `render` doesn't accept filters on parameter values (`title: x | default: y` is a syntax error); precompute into a variable.
- `section.blocks | where: 'settings.x'` returns empty on Shopify's Block drop; loop and test instead.
- `card_product.url` can already contain `variant` plus `_pos`/`_fid`/`_ss`; retarget with `URL.searchParams.set('variant', id)`.
- `variant=` in a card's `product.url` means Shopify narrowed the variant, by a variant-level filter **or** a search query that matched a variant (`q=redaur` adds none; a SKU or colour name adds that variant). Card logic that picks its own variant must yield whenever it is present. Detecting only `filter.v.*` made a search for a full-price colour show the reduced one. A plain-name search that stays on a non-sale variant is Shopify's match, not a bug.
- Loewenweiss SKUs use hyphens inside multi-part colour codes (`192-953`), media filenames use underscores (`192_953`); normalise before matching.
- **Metaobjects read from Liquid fail silently:**
  1. `shop.metaobjects[variable]` is nil; name the type statically.
  2. `.values` is a lazy drop: `.size` works, `.first` is nil, and assigning it before iterating gives an empty loop. Iterate it directly.
  3. Entries have no `.id`. `entry.system.id` is the bare number while a filter's `value.value` is the full GID, so re-add `gid://shopify/Metaobject/` before comparing.
  4. A key that returns the entry's **handle** means the field is orphaned (the Akeneo connector rewrote the definition); a key that returns **empty** means it's absent. Fix an orphaned field by deleting it from the definition, re-creating it and re-writing the values. Field keys are immutable, and `displayNameKey` must not point at the field while you delete it.
  5. The display name is unreachable from Liquid.

  Debug with an entry whose handle, `code` and value all differ (`pink`/`roze`, never `beige`/`beige`). To settle whether a key is read at all, write a distinctive sentinel value via the Admin API and look for it in the render. GraphQL showing the value proves nothing about the storefront.
- Verify a theme deploy with a temporary HTML comment read in the browser; `curl` against the password-protected storefront serves cached HTML.

## Shopify admin and data

- **API-made metaobject entries arrive `DRAFT`** when the definition has the `publishable` capability, and drafts are invisible to the storefront (filters vanish, rows render empty) while the admin looks complete. Check `capabilities.publishable.status` before debugging anything metaobject-backed. This is Shopify behaviour, not a sync bug; the launch step is in MIGRATION-TO-LIVE.md.
- **The storefront filter index refreshes only when the product is saved**, not when a metafield is written via the API. A bulk tag add from the product list rebuilds it within ~15 s; a single-product admin save also writes `Uncategorized` over a pending taxonomy suggestion. Re-creating the definition or the Search & Discovery filter doesn't help. Don't test with a prefix pair (`Slipper` → `Slippers`); use one like `boots` → `Laarzen`.
- The index is built per locale and doesn't fall back to the primary locale for plain-text metafields, which is why Dutch is primary (playbook D20). It can also lag a sync by days and serve labels that match neither the field nor the code. Verify values on the product's metafield (admin or GraphQL), never off the facet; smart-collection rules read the stored value and are unaffected.
- Count facet values with `input[name^="filter."]`: the colour facet renders radios, so `input[type=checkbox]` reports it as empty.
- A variant-level filter narrows `selected_or_first_available_variant` and `featured_media`, so a colour filter swaps the card photo natively (playbook D3).
- The Akeneo sync writes compare-at `0.00`, not null, on non-reduced variants, so read sale state per variant (NICK.md #13). The collection rule `Compare-at price is set` matches only when all variants have a value (0 included); `is not set` matches when any is blank. Neither proves a discount.
- `menuUpdate` replaces the whole tree: read it and resend every unchanged item with its `id`. Use item type `COLLECTIONS` for the all-collections page.
- **Page editor survival (TinyMCE):** `aside`, `ul/li/span`, classes, ids, `details/summary`, `nav` and inline SVG survive a Save (`viewBox` is lowercased but renders); `aria-*` attributes are dropped. `dl/dt/dd` was never tested. The stale-body revert after an API write is the Apollo cache, handled by the CLAUDE.md rule; "Show HTML" can't be toggled through DevTools MCP clicks, so write bodies with `pageUpdate`.
- `collectionCreate` through raw GraphQL can leave the collection unpublished on Online Store; verify and call `publishablePublish` if needed.
- **Bulk customer import goes through Admin → Customers → Import** (CSV upload via chrome-devtools `upload_file`): the Shopify connector refuses `bulkOperationRunMutation` by policy, and the block only shows after the JSONL is staged. Diff the CSV header against the dialog's current sample template (it gained `Accepts WhatsApp Marketing`). ~9k rows take ~12 min, with the dialog at "0% uploaded" for the first minutes; poll `job(id:) { done }` (id in the `CustomerImportSubmit` response), not `wait_for` (it returns the whole 50-row page). To change an imported batch, re-import with "Overwrite existing customers" ticked; a handful of fixes fit one aliased `customerUpdate`. `customersCount(query:)` silently ignores its filter; verify with `customers(first:, query:)`. `get_network_request` dumps Admin session cookies, so pass `responseFilePath`. Check Messaging → Automations first so no welcome automation fires on the batch.
- `deliveryProfileUpdate`: new zones go in `profile.locationGroupsToUpdate`; `profileLocationGroups` silently no-ops.
- The Shopify connector caps the wrapper-level `first` argument at 50.
- The claude.ai Shopify connector is one connection for whichever store it was last connected to. If `get-shop-info` errors with "re-authorization" or names another shop, reconnect it to the target store in claude.ai → Settings → Connectors; retrying doesn't help. The store-identity gate is in CLAUDE.md.
- Akeneo field names are Nick's (playbook, Product-model decision). Treat any key not yet seen on synced data as tentative and correct docs and code to his naming.

## Wishlist King (Swish)

- Cart items added from a PLP card carry no variant and hit WK's placeholder path. Dawn's `cart-drawer-items` `change` listener (`assets/cart.js`) treated WK's selects as quantity inputs and called `setCustomValidity` on them, so the form never dispatched `submit`; `onChange` now guards with `event.target.matches('.quantity__input')`. Symptom: the click fires and no request follows — check `form.checkValidity()`.
- `.wk-cta-button[disabled]` outspecifies descendant selectors; CTA sizing declarations need `!important`.
- Use `minmax(0, 1fr)` tracks in the drawer; a nowrap option row otherwise widens the card past the drawer.
- The drawer replaces `<cart-drawer-items>` on every cart mutation; observe `document.body` and re-attach observers.
- Translate & Adapt strips the Akeneo brackets, so select names arrive as `options[shoe_size_eu]`; read the raw key from `select.name`.
- Dropdown layout is controlled by the `<wk-option-select>` flex items and their `.wk-control` wrappers, not the inner `<select>`.
- WK can re-render a just-removed cross-sell card after Dawn replaces the drawer. Suppress it by `data-wishlist-item-id` until that card leaves the DOM, and hide stale cards with `display: none` (opacity leaves `:has(.wk-product-card)` true and the heading visible). When moving the last card, fade the whole section at submit time, and keep the JS cleanup timeout longer than the CSS duration.
- WK's page-width setting sets `.wk-page` max-width but its inner padding is hardcoded (~16px); scope header-edge fixes to `#MainContent > wishlist-page > .wk-page`.
- The drawer remove button ships `transition: all`; override it with an explicit `background-color` transition.
- `<wishlist-page>` always renders its own `.wk-header` chrome; it is hidden via CSS because no attribute suppresses it.

## Shopify CLI and pushing

- A silent `theme push` hang is an expired session with an invisible device-code prompt. Redirect output to a log (`> push.log 2>&1`) instead of piping to `tail`, and have the user open the link. Always pass `--store=original-brands-dev.myshopify.com`.
- Commands that ask for confirmation (`theme publish`, `duplicate`, `delete`) hang non-interactively; pass `--force` (and `--json` on `duplicate`).
- `theme dev` on the password-protected store needs `--store-password=original`; newer CLIs reject that flag, so omit it on an authenticated session (`--password` is for a Theme Access token). Use `theme dev` only when the owner asks for a separate preview (CLAUDE.md).
- The CLI can report a push error and still exit 0. When a JSON setting only becomes valid after a schema change, push the section first and the template second.
- The CLI is theme-only; collections, navigation and other shop data go through the Admin API.
- **Pushing only your own hunks** when another session (Codex, a second Claude) has uncommitted edits in the same file: `theme push --only` pushes the whole working-tree file. Filter `git diff -U0` to your hunks, `git apply --cached --unidiff-zero` them, export the index with `git checkout-index --prefix=<scratch>/theme/ -- <files>` (create empty `config/`, `layout/`… dirs), push with `--path <scratch>/theme --only …`, and commit the index. In Perl use `\s*+`, since `\s*(?!-)` backtracks. On Windows `git apply -R` rewrites files to CRLF; if `git diff --ignore-cr-at-eol` is empty, `git checkout --` them.
- After any push, re-pull the touched templates and compare: another session can overwrite a file minutes after you pushed it.

## Browser and machines

- **Start Chrome with no debugging flags** (`open -a "Google Chrome"`). On the default profile, `--remote-debugging-port` stops the consent-based debug server from starting (Chrome 152+). The `chrome://inspect/#remote-debugging` toggle is persisted in `Local State` and takes effect at browser start. `curl :9222/json/list` returns 404 by design; MCP `--autoConnect` (which reads `DevToolsActivePort`) is the only way in. Never start a scratch `--user-data-dir` instance with a debugging port: it squats 9222 without sessions. When `list_pages` fails, check in order: `lsof -nP -iTCP:9222 -sTCP:LISTEN` (squatter?), `lsof -nP -iTCP -sTCP:LISTEN | grep ^Google`, the mtime of `DevToolsActivePort`, `Local State`, and `ps` for a leftover flag.
- A viewport override applies to the active tab only; set it again after switching tabs and confirm `window.innerWidth`.
- Verify mobile surfaces in DevTools `mobile,touch` emulation with real clicks; the touch and hover traps don't show in a narrow desktop window.
- A full-page screenshot taken without scrolling first misses content behind Dawn's `scroll-trigger` reveal.
- Freeing port 9292: `lsof -ti:9292 | xargs kill -9` on macOS; on Windows `Get-NetTCPConnection -LocalPort 9292` → `Stop-Process -Force`, after checking the holder's `--theme` via `Get-CimInstance Win32_Process`.
- Windows: run `npx` through PowerShell (Git Bash breaks on the space in `C:\Program Files`). Chrome is at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`. When MCP can't connect and the user is away, take screenshots with a headless instance on a scratch profile and no debugging port (`--headless=new --user-data-dir=<scratch> --screenshot=…`) instead of killing their Chrome.
- macOS: if `npx` fails with EPERM on `~/.npm/_cacache`, point it at a writable cache (`npm_config_cache=/private/tmp/npm-cache`).

## mockup/ (reference only)

- `Home-v2.png` was rendered at a ~1321px viewport: 1 draft px = 1.4171 CSS px. Render at 1320px and downscale to 932px to overlay.
- The OB logo SVG's ink fills only the top 56% of its authored viewBox; use `viewBox="5 0 1387 204"`, and `viewBox="631 0 209 204"` for the footer flower mark. Check `getBBox()` against the viewBox on both axes.
- Seamless marquee: space items with `margin-inline-end`, not flex `gap`, so `translateX(-50%)` lands exactly. To fit text wordmarks in one row use `zoom` (changes layout width), not `transform: scale()`. Class selectors don't reach `<use>` shadow trees, so set the fill on the outer `<svg>`.
