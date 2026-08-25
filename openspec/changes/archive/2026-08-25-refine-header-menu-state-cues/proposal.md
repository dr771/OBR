## Why

The desktop main menu currently uses Dawn's default text-decoration underline. It does not match the Original Brands prototype, and the current page state lacks the same clear visual cue.

## What Changes

- Match the prototype's desktop main-menu hover: darken the link text and animate a 2px primary-blue underline from zero to the text width over 300ms.
- Render the same primary-blue underline on the current/active top-level menu item.
- Preserve the existing focus treatment and leave mobile drawer and submenu links unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `header-navigation`: define desktop top-level navigation hover, active, and focus state cues.

## Impact

- `sections/header.liquid`: scoped desktop main-menu presentation styles only.
- No changes to menu data, navigation URLs, footer, drawer, or submenu behavior.
