/**
 * OB: records which collection the shopper is browsing, so the PDP breadcrumb
 * can name the collection they actually walked through rather than an arbitrary
 * one. Product URLs stay clean, so this context cannot travel in the URL.
 *
 * Only the recorder lives here. The PDP side is an inline synchronous script in
 * snippets/ob-breadcrumb.liquid, because resolving the label from a deferred
 * asset is a race that shows the wrong collection on a cold cache — see the
 * comment there before moving it.
 *
 * Runs once per page load. Dawn's AJAX facet updates replace the grid without a
 * reload, which does not change which collection the shopper is in, so there is
 * nothing to re-record.
 */
(function () {
  var context = document.querySelector('[data-ob-collection-context]');
  if (!context) return;

  var handle = context.getAttribute('data-ob-collection-handle');
  if (!handle) return;

  try {
    sessionStorage.setItem(
      'ob:breadcrumb-collection',
      JSON.stringify({
        handle: handle,
        title: context.getAttribute('data-ob-collection-title') || '',
        url: context.getAttribute('data-ob-collection-url') || '',
      })
    );
  } catch (e) {
    // Blocked site data or a full quota. The PDP falls back to its
    // server-rendered ranked collection, which is always a valid trail.
  }
})();
