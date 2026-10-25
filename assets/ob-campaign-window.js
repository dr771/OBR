/*
  OB: client-side run-time check for campaign badges (spec: campaign-badges).

  ob-campaign-badge.liquid renders every not-yet-ended campaign of a product
  into one [data-ob-campaign-badges] group, best first, each with its
  data-ob-window-start / -end (unix seconds). Liquid's own choice is only as
  fresh as Shopify's page cache, so this repeats it on the shopper's clock:
  show the first badge inside its window, hide the rest.

  Cards also arrive after load (facet grid swaps, load-more, recommendations,
  predictive search, the cart drawer cross-sell), so new subtrees are scanned
  as they are inserted.
*/
(() => {
  const GROUP = '[data-ob-campaign-badges]';

  const inWindow = (badge, now) => {
    const start = badge.dataset.obWindowStart;
    const end = badge.dataset.obWindowEnd;
    return (!start || now >= Number(start)) && (!end || now < Number(end));
  };

  const apply = (group) => {
    const now = Date.now() / 1000;
    let shown = false;
    for (const badge of group.children) {
      const visible = !shown && inWindow(badge, now);
      badge.hidden = !visible;
      if (visible) shown = true;
    }
  };

  const scan = (root) => {
    if (root.matches && root.matches(GROUP)) apply(root);
    root.querySelectorAll(GROUP).forEach(apply);
  };

  scan(document);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

  // A tab left open across a campaign boundary catches up when it is shown again.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scan(document);
  });
})();
