// Desktop vertical filter panel: the "FILTER" heading collapses and reopens
// every facet section at once. It toggles each <details>'s own `open` state, so
// the facet headings stay visible and each section remains individually
// operable afterwards — it does not hide the panel.
//
// Document-level delegation because Dawn's facets.js rewrites facet markup on
// every AJAX filter update (see renderFilters in facets.js), which would drop a
// directly-bound listener. That same code path only replaces each <details>'s
// innerHTML, never the element itself, so a collapsed section stays collapsed
// across filtering.
document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.ob-filter-panel-toggle');
  if (!toggle) return;

  const listId = toggle.getAttribute('aria-controls');
  const list = listId && document.getElementById(listId);
  if (!list) return;

  const sections = list.querySelectorAll('details.facets__disclosure-vertical');
  if (!sections.length) return;

  // Read the live DOM rather than the button's own state: the shopper may have
  // collapsed sections individually since the last press.
  const shouldOpen = !Array.from(sections).some((section) => section.open);
  sections.forEach((section) => {
    section.open = shouldOpen;
  });
  toggle.setAttribute('aria-expanded', String(shouldOpen));
});
