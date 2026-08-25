## Why

The eight-item desktop navigation currently wraps an isolated final link at common large-desktop widths. Dawn's existing customer-avatar setting does not control the account icon, so the header cannot reclaim that space without a code change.

## What Changes

- Keep all top-level navigation paths and give the configured middle-left header an intentional two-row desktop layout when its one-row layout no longer fits.
- Compact only the desktop header's current-language trigger to its locale code while preserving full language names everywhere else.
- Add a merchant setting that controls the customer-account icon separately from Dawn's signed-in avatar choice.
- Update the wishlist-header contract so the heart remains immediately before the cart whether or not the optional account icon is shown.

## Capabilities

### New Capabilities

- `header-navigation`: responsive top-level navigation, compact desktop localization, and optional account access in the header.

### Modified Capabilities

- `wishlist-integration`: make the account-adjacent header-heart position conditional on the optional account icon.

## Impact

- `sections/header.liquid` and `snippets/header-drawer.liquid`: header setting and account-access markup.
- `snippets/language-localization.liquid`: opt-in compact trigger label for the desktop header.
- `sections/header.liquid`: scoped responsive navigation CSS; footer files and behavior remain unchanged.
