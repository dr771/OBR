# Promo bar (blue) and trust bar (black)

How to run the blue **Acties** bar at the top of the shop, and what happens behind the scenes. For the owner and the team.

## The two bars

| | Trust bar | Promo bar |
|---|---|---|
| Colour | black | blue |
| Theme editor name | *Announcement bar* | *Acties Announcement bar* |
| Content | always-on USPs (free shipping from €70, ordered before 12:00 → tomorrow at home, …) | campaign messages (FitFlop 2nd pair -50%, …) |
| Shows | always | each message only while its campaign runs |

Both are the same kind of section (*Announcement bar*), just two copies in the header. Where: **Online Store → Themes → Customize → Header** (top of the page).

**The bars never touch each other.** There is no automatic "promo replaces trust bar". If both are on, both show, one under the other. You decide by hand with the eye icon.

## How to

### Show only the blue bar (hide the black one)
1. Theme editor → Header → hover **Announcement bar** (black) → click the **eye icon** (it turns into a crossed-out eye).
2. Save.

### Back to the black bar only
1. Click the eye on the blue **Acties Announcement bar** so it is crossed out.
2. Click the eye on the black **Announcement bar** so it is open.
3. Save.

### Show both
Both eyes open. They stack: blue on top, black below.

### Add a campaign message
1. In the *Acties Announcement bar* click **Add announcement**.
2. Fill in the text and the link (e.g. the category or the campaign collection).
3. Under **Actiecollectie** pick the `actie-…` collection of the campaign. Then the message shows by itself from the collection's start to its end (metafields *Actie: start* / *Actie: einde*).
4. Save.

Full campaign setup (collection, discount, badge): [DISCOUNTS.md](DISCOUNTS.md).

### Message that should always show
Leave **Actiecollectie** empty. It then shows until you delete or hide it.

## How NOT to

- **Don't expect the black bar to disappear by itself.** It stays until you click its eye. Starting a campaign never hides it.
- **Don't expect it to come back by itself either.** When a campaign is over the blue bar disappears (see below), but if you hid the black bar with the eye, it stays hidden. Click its eye open again.
- **Don't leave "Actiecollectie" pointing at a collection without dates.** A collection without start/end counts as always running, so the message never ends.
- **Don't delete the `actie-` collection while its message is still in the bar.** The link is then empty and the message shows permanently. Delete the message first.
- **Don't use the eye to end a campaign on time.** The scheduling does that for you. Use the eye only to hide a bar completely, on purpose.
- **Don't edit the bar's colours in the code.** Change the colour under *Color scheme* of the section.

## What happens behind the scenes

1. **The page is built on the server.** For every message with an *Actiecollectie* the theme reads the collection's start and end. Messages whose campaign **already ended** are left out completely.
2. **Messages that have not started yet** are put on the page but hidden.
3. **The browser double-checks.** A tiny script on the page compares start/end with the visitor's own clock and shows or hides each message. This matters because Shopify caches pages: a page built during the campaign can still be served after it ended (or before it started). Without the script the message would show too long or too late.
4. **Nothing left to show → no bar.** If every message of the blue bar is outside its dates, the whole blue bar disappears: no empty blue strip and no line. The same page needs no new deployment.
5. **How many messages are visible.** Phone: one at a time, with arrows. Tablet: two. Desktop: all in one row. Messages outside their dates do not count. One remaining message is shown alone without arrows.
6. **The hide/show of whole bars is Shopify's own eye icon.** A hidden section is not put on the page at all. So the theme does nothing special for it, and it stays hidden until you click the eye again.

## Quick checks if something looks wrong

| Problem | Likely cause |
|---|---|
| Blue bar is not there | All messages are outside their dates, or the section is hidden with the eye, or the *Actiecollectie* start is in the future |
| Message stays after the campaign | *Actiecollectie* is empty, or the collection has no end date |
| Two bars show and you only want one | Hide the other with its eye |
| Black bar is gone and you want it | Click its eye open, save |
| Changed something but the shop still shows the old state | Reload with Ctrl+F5; cached pages can lag a short moment |

## For developers

- Section: `sections/announcement-bar.liquid` (both bars are instances of it, in `sections/header-group.json`). Styles: `assets/component-ob-announcement-bar.css`.
- Run time of a message: snippet `ob-campaign-window` (reads `custom.campaign_starts_at` / `custom.campaign_ends_at` of the linked collection).
- Spec: `openspec/changes/campaign-merchandising/specs/header-announcement-bar/spec.md` (still unarchived).
- History: until 2026-10-29 there was a checkbox "Promo bar: replaces other announcement bars" that hid the trust bar automatically. It was removed because it overlapped with the eye icon and confused the team.
