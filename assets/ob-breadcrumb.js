/**
 * OB: remembers which listing (collection or search) the shopper left for a
 * product page, so the PDP back link can return them to it — filters included.
 * Product URLs stay clean, so this context cannot travel in the URL.
 *
 * Loaded on every page (layout/theme.liquid), because a page's role decides
 * what happens to the record:
 * - a listing (marked [data-ob-listing-context]) records itself, and again at
 *   the moment a product link is clicked, so the stored query string carries
 *   whatever filters Dawn's facets have pushState'd since load;
 * - a PDP ([data-ob-breadcrumb]) leaves it alone, so product-to-product hops
 *   keep pointing back at the same listing;
 * - any other page clears it, so a product opened from, e.g., homepage
 *   bestsellers never gets captioned with a stale listing.
 *
 * Only the recorder and the click behaviour live here. The PDP label is
 * resolved by an inline synchronous script in snippets/ob-breadcrumb.liquid,
 * because doing it from a deferred asset races first paint and flickers — see
 * the comment there before moving it.
 */
(function () {
  var KEY = 'ob:breadcrumb-collection';

  var listing = document.querySelector('[data-ob-listing-context]');
  var isProduct = !!document.querySelector('[data-ob-breadcrumb]');

  function record() {
    try {
      sessionStorage.setItem(
        KEY,
        JSON.stringify({
          kind: listing.getAttribute('data-ob-listing-kind') || 'collection',
          handle: listing.getAttribute('data-ob-listing-handle') || '',
          title: listing.getAttribute('data-ob-listing-title') || '',
          path: window.location.pathname,
          search: window.location.search,
        })
      );
    } catch (e) {
      // Blocked site data or a full quota. The PDP falls back to its
      // server-rendered ranked collection, which is always a valid link.
    }
  }

  if (listing) {
    record();
    // Capture phase, so it runs before any card script that might navigate.
    document.addEventListener(
      'click',
      function (event) {
        var link = event.target.closest && event.target.closest('a[href*="/products/"]');
        if (link) record();
      },
      true
    );
  } else if (!isProduct) {
    try {
      sessionStorage.removeItem(KEY);
    } catch (e) {
      // Nothing to clear if storage is unavailable.
    }
  }

  // Back link: when the shopper came straight from the listing it points to,
  // step back through history instead, so the browser restores their scroll
  // position (and the whole page, when it's served from bfcache).
  document.addEventListener('click', function (event) {
    var back = event.target.closest && event.target.closest('[data-ob-breadcrumb-back]');
    if (!back) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.referrer || window.history.length < 2) return;

    try {
      var from = new URL(document.referrer);
      var to = new URL(back.href);
      if (from.origin === to.origin && from.pathname === to.pathname && from.search === to.search) {
        event.preventDefault();
        window.history.back();
      }
    } catch (e) {
      // Unparseable referrer: let the link navigate normally.
    }
  });
})();
