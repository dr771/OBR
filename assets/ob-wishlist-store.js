/*
 * Native wishlist (wishlist-integration, theme setting ob_wishlist_native):
 * the list itself, kept in this browser, plus the small surfaces that only
 * read or toggle it (header badge, product-card hearts, PDP button). The
 * favorites page and the cart cross-sell live in ob-wishlist-items.js.
 * Loaded after ob-size-memory.js (obWishlistStartVariant), only while the
 * switch is on; Wishlist King's ob-wishlist.js is not loaded then.
 */
(function () {
  'use strict';

  if (window.obWishlist) return;

  // [{ handle, variantId, addedAt }], newest first, one entry per product.
  // variantId is null only when a heart could not load its product; the
  // first wishlist surface that renders the entry fills it in.
  var STORAGE_KEY = 'ob-wishlist';
  var items = read();
  var listeners = [];

  function clean(list) {
    if (!Array.isArray(list)) return [];
    var seen = {};
    return list.filter(function (item) {
      if (!item || typeof item.handle !== 'string' || !item.handle || seen[item.handle]) return false;
      seen[item.handle] = true;
      item.variantId = Number(item.variantId) || null;
      return true;
    });
  }

  function read() {
    try {
      return clean(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch (e) {
      return [];
    }
  }

  function write() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // fail open: the change lives until the page unloads
    }
    notify();
  }

  function notify() {
    var snapshot = items.slice();
    listeners.forEach(function (fn) {
      try {
        fn(snapshot);
      } catch (e) {
        // one broken surface must not stop the others
      }
    });
  }

  function indexOf(handle) {
    for (var i = 0; i < items.length; i += 1) {
      if (items[i].handle === handle) return i;
    }
    return -1;
  }

  window.addEventListener('storage', function (evt) {
    if (evt.key !== STORAGE_KEY && evt.key !== null) return;
    items = read();
    notify();
  });

  window.obWishlist = {
    items: function () {
      return items.slice();
    },
    has: function (handle) {
      return indexOf(handle) !== -1;
    },
    get: function (handle) {
      var index = indexOf(handle);
      return index === -1 ? null : items[index];
    },
    // Saving a product that is already listed replaces its variant and moves
    // it to the top, as a fresh save would.
    add: function (handle, variantId) {
      if (!handle) return;
      var index = indexOf(handle);
      if (index !== -1) items.splice(index, 1);
      items.unshift({ handle: handle, variantId: Number(variantId) || null, addedAt: Date.now() });
      write();
    },
    // An option change on a wishlist surface: keeps the entry's place.
    update: function (handle, variantId) {
      var index = indexOf(handle);
      if (index === -1 || items[index].variantId === Number(variantId)) return;
      items[index] = { handle: handle, variantId: Number(variantId) || null, addedAt: items[index].addedAt };
      write();
    },
    remove: function (handle) {
      var index = indexOf(handle);
      if (index === -1) return;
      items.splice(index, 1);
      write();
    },
    // fn(items) on every change, from this tab or another one.
    subscribe: function (fn) {
      listeners.push(fn);
      return function () {
        listeners = listeners.filter(function (listener) {
          return listener !== fn;
        });
      };
    },
  };

  function shopUrl(path) {
    var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
    return root.replace(/\/$/, '') + path;
  }
  window.obWishlistUrl = shopUrl;

  // Product JSON per handle, for the start variant of a heart click.
  var productRequests = {};
  function fetchProduct(handle) {
    if (!productRequests[handle]) {
      productRequests[handle] = fetch(shopUrl('/products/' + encodeURIComponent(handle) + '.js'))
        .then(function (res) {
          if (!res.ok) throw new Error('product fetch failed');
          return res.json();
        })
        .catch(function () {
          delete productRequests[handle];
          return null;
        });
    }
    return productRequests[handle];
  }

  // Header badge, hidden by Dawn's :empty rule at 0.
  function renderBadge(list) {
    document.querySelectorAll('.ob-wishlist-bubble').forEach(function (badge) {
      var count = list.length;
      var text = count > 0 ? (count < 100 ? String(count) : '99+') : '';
      if (badge.textContent !== text) badge.textContent = text;
    });
  }

  // Hearts and the PDP button carry data-product-handle; their pressed state
  // follows the list. Cards are replaced wholesale by facet filtering and
  // load-more, and Dawn re-renders the PDP buttons on variant change, so new
  // ones are synced as they arrive.
  var TOGGLE_SELECTOR = '[data-ob-wishlist-toggle][data-product-handle]';

  function syncToggle(button) {
    var saved = window.obWishlist.has(button.dataset.productHandle);
    var pressed = saved ? 'true' : 'false';
    if (button.getAttribute('aria-pressed') !== pressed) button.setAttribute('aria-pressed', pressed);
    button.classList.toggle('ob-wishlist-btn--selected', saved);
    var label = saved ? button.dataset.labelRemove : button.dataset.labelAdd;
    if (label && button.getAttribute('aria-label') !== label) button.setAttribute('aria-label', label);
  }

  function syncToggles(root) {
    (root || document).querySelectorAll(TOGGLE_SELECTOR).forEach(syncToggle);
  }

  // Card heart: the colour the card shows (its active chip) in its start
  // size. Without product data the entry is saved without a variant and
  // gets its start variant when a wishlist surface first renders it.
  function addFromCard(button, handle) {
    var card = button.closest('.card-wrapper');
    var chip = card && card.querySelector('.ob-card-swatch--active[data-ob-swatch-name]');
    var colorValue = chip ? chip.dataset.obSwatchName : '';
    button.setAttribute('aria-busy', 'true');
    return fetchProduct(handle).then(function (product) {
      button.removeAttribute('aria-busy');
      var variant = product && window.obWishlistStartVariant ? window.obWishlistStartVariant(product, colorValue) : null;
      if (!window.obWishlist.has(handle)) window.obWishlist.add(handle, variant ? variant.id : null);
    });
  }

  // PDP: the variant selected in the product form.
  function selectedVariantId(button) {
    var productForm = button.closest('product-form');
    var form = button.closest('form') || (productForm && productForm.querySelector('form'));
    var input = form && form.querySelector('input[name="id"]');
    return input ? Number(input.value) || null : null;
  }

  document.addEventListener('click', function (evt) {
    var button = evt.target.closest && evt.target.closest(TOGGLE_SELECTOR);
    if (!button) return;
    evt.preventDefault();
    evt.stopPropagation();
    var handle = button.dataset.productHandle;
    if (button.getAttribute('aria-busy') === 'true') return;
    try {
      if (window.obWishlist.has(handle)) {
        window.obWishlist.remove(handle);
      } else if (button.hasAttribute('data-ob-wishlist-card')) {
        // Fill straight away; the entry follows once the product is loaded.
        button.classList.add('ob-wishlist-btn--selected');
        button.setAttribute('aria-pressed', 'true');
        addFromCard(button, handle);
      } else {
        window.obWishlist.add(handle, selectedVariantId(button));
      }
    } catch (e) {
      // fail open: click is a no-op
    }
  });

  function init() {
    renderBadge(items);
    syncToggles();
    window.obWishlist.subscribe(function (list) {
      renderBadge(list);
      syncToggles();
    });

    var scheduled = false;
    new MutationObserver(function (mutations) {
      if (scheduled) return;
      var added = mutations.some(function (mutation) {
        return mutation.addedNodes.length > 0;
      });
      if (!added) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        syncToggles();
        renderBadge(items);
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
