## 1. Restore

- [x] 1.1 Split load-more into `fetchPage` / `appendPage`; record each loaded page URL in `history.state.obLoadMore`, preserving Dawn's `searchParams`
- [x] 1.2 Record scroll offset on `pagehide`; clear the record on in-page popstate
- [x] 1.3 On load, re-fetch recorded pages in parallel, append in order, restore scroll (manual scroll restoration while restoring); clear on mismatch or failure
- [x] 1.4 Verify live on /collections/schoenen: two loads → PDP → back shows 60 cards and the clicked card in view
