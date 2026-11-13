## Context

`ob-recently-viewed.js` fetches each history handle through the section's own `section_id` render and clones the card from its `<template>`. History holds up to 12 handles; the section shows 4.

## Decisions

- **Availability is read from the rendered section**, not from `/products/{handle}.js`: the template gets `data-available="{{ product.available }}"` on its `<li>`, so one request per product still answers both "render" and "available". No second endpoint, no duplicate fetch.
- **Backfill in batches of four**, newest first, until four available cards are collected or history is exhausted. A history of mostly available products costs the same four requests as today; only sold-out entries cause more (max 11).
- **History is not pruned**: stock changes, the product should come back.

## Risks / Trade-offs

- [More requests when much of history is sold out] → bounded by the 12-entry history; batches run in parallel.
