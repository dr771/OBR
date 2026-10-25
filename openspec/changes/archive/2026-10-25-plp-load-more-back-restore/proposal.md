## Why

After "Toon meer" a shopper who opens a PDP and goes back lands on the first result page (20 van 402) at the top, because the browser reloads the collection when the bfcache misses and the appended pages only existed in the DOM. Continuing to browse means clicking "Toon meer" again and scrolling back down.

## What Changes

- Each load-more records the fetched page URL in the current history entry's state; leaving the page records the scroll offset.
- On a fresh load of that same history entry (back from a PDP, reload) the recorded pages are re-fetched in parallel, appended in order, and the scroll offset restored.
- In-page facet history (popstate) and stale state (first recorded page no longer matches the rendered next page) clear the record; facet/sort changes already push a new entry without it.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `plp-grid-config`: loaded pages and scroll position survive back navigation.

## Impact

- `assets/ob-plp.js`: load-more refactored into fetch/append helpers, history-state record and restore. Keeps Dawn's `searchParams` in the shared history state for its facets popstate handler.
