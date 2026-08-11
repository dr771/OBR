## 1. Collection grid and sorting

- [x] 1.1 Render 18 products per page, add the native “Toon meer” control and product count, and remove numbered pagination
- [x] 1.2 Add the delegated load-more runtime with disabled/busy state, failure recovery, and appended-card normalization
- [x] 1.3 Centralize the four approved collection sort options with a hidden current-value fallback across desktop, horizontal, and mobile controls while preserving native search sorting
- [x] 1.4 Add the collection sorting editor guide

## 2. Facet response behavior

- [x] 2.1 Implement same-tick skeleton/busy feedback with a short discrete-control debounce and the existing longer price debounce
- [x] 2.2 Add geometry-stable skeleton styling with reduced-motion support
- [x] 2.3 Add corrective-only scroll clamping after filter, sort, pill-removal, and history-driven grid replacements

## 3. Verification and handoff

- [x] 3.1 Strictly validate the OpenSpec change and run local syntax/theme checks
- [x] 3.2 Deploy only the changed theme files to the live main theme
- [x] 3.3 Verify desktop sorting, timing, skeleton, scroll clamp, synthetic load-more success/failure, and facet refresh behavior in Chrome DevTools
- [x] 3.4 Verify the 390 px mobile layout, controls, loading feedback, and network/console health in Chrome DevTools
- [x] 3.5 Update CLAUDE.md, MIXED-SHOPS-PLAYBOOK.md, and the editor guide, then stop before archive for explicit review
