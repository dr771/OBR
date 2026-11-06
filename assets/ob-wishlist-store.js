/*
 * Wishlist (wishlist-integration): the list itself, kept in this browser,
 * plus the small surfaces that only read or toggle it (header badge,
 * product-card hearts, PDP button). The favorites page and the cart
 * cross-sell live in ob-wishlist-items.js. Loaded after ob-size-memory.js
 * (obWishlistStartVariant).
 */
(function () {
  'use strict';

  if (window.obWishlist) return;

  // [{ handle, variantId, addedAt, source }], newest first, one entry per
  // product. variantId is null only when a heart could not load its product;
  // the first wishlist surface that renders the entry fills it in. source is
  // where it was saved (see pageSource), carried into the cart as _wishlist.
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
    add: function (handle, variantId, source) {
      if (!handle) return;
      var index = indexOf(handle);
      if (index !== -1) items.splice(index, 1);
      items.unshift({ handle: handle, variantId: Number(variantId) || null, addedAt: Date.now(), source: source || null });
      write();
    },
    // An option change on a wishlist surface: keeps the entry's place.
    update: function (handle, variantId) {
      var index = indexOf(handle);
      if (index === -1 || items[index].variantId === Number(variantId)) return;
      items[index] = {
        handle: handle,
        variantId: Number(variantId) || null,
        addedAt: items[index].addedAt,
        source: items[index].source || null,
      };
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

  // Analytics events on Shopify's customer-events bus; a custom pixel can
  // forward them (none stores them yet). Never from the theme editor or an
  // unpublished-theme preview; team browsers opt out once with
  // ?ob_notrack=1 (?ob_notrack=0 undoes it). Publishing never blocks the
  // wishlist action itself.
  var NOTRACK_KEY = 'ob-notrack';
  try {
    var notrack = new URLSearchParams(window.location.search).get('ob_notrack');
    if (notrack === '1') window.localStorage.setItem(NOTRACK_KEY, '1');
    else if (notrack === '0') window.localStorage.removeItem(NOTRACK_KEY);
  } catch (e) {
    // fail open: the opt-out just isn't stored
  }

  function trackingOff() {
    var shopify = window.Shopify || {};
    if (shopify.designMode || (shopify.theme && shopify.theme.role && shopify.theme.role !== 'main')) return true;
    try {
      return window.localStorage.getItem(NOTRACK_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  // name, { handle, product_id, variant_id, sku, title, variant_title, price, source }
  window.obWishlistTrack = function (name, data) {
    try {
      var analytics = window.Shopify && window.Shopify.analytics;
      if (trackingOff() || !analytics || typeof analytics.publish !== 'function') return;
      var payload = {
        list_size: items.length,
        currency: (window.Shopify.currency && window.Shopify.currency.active) || null,
      };
      Object.keys(data || {}).forEach(function (key) {
        payload[key] = data[key] === undefined ? null : data[key];
      });
      analytics.publish(name, payload);
    } catch (e) {
      // analytics must never break the wishlist
    }
  };

  // Where a card heart was clicked, from Shopify's own page type.
  function pageSource() {
    var meta = window.ShopifyAnalytics && window.ShopifyAnalytics.meta;
    var type = meta && meta.page && meta.page.pageType;
    var sources = { collection: 'plp', searchresults: 'search', search: 'search', home: 'home', product: 'pdp_cards' };
    return sources[type] || 'other';
  }

  // Event fields from /products/<handle>.js data (prices in cents).
  function productFields(product, variant) {
    return {
      handle: product.handle,
      product_id: product.id,
      variant_id: variant ? variant.id : null,
      sku: variant ? variant.sku || null : null,
      title: product.title,
      variant_title: variant ? variant.title : null,
      price: variant ? variant.price / 100 : null,
    };
  }

  // The PDP's own product data (ShopifyAnalytics), when it has this variant.
  function pdpFields(handle, variantId) {
    var meta = window.ShopifyAnalytics && window.ShopifyAnalytics.meta;
    var product = meta && meta.product;
    var fields = { handle: handle, variant_id: variantId };
    if (!product) return fields;
    var variant = (product.variants || []).filter(function (v) {
      return v.id === variantId;
    })[0];
    fields.product_id = product.id;
    if (variant) {
      fields.sku = variant.sku || null;
      fields.title = variant.name ? String(variant.name).split(' - ')[0] : null;
      fields.variant_title = variant.public_title || null;
      fields.price = variant.price / 100;
    }
    return fields;
  }

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
      if (window.obWishlist.has(handle)) return;
      var source = pageSource();
      window.obWishlist.add(handle, variant ? variant.id : null, source);
      var fields = product ? productFields(product, variant) : { handle: handle };
      fields.source = source;
      window.obWishlistTrack('add_to_wishlist', fields);
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
      var isCard = button.hasAttribute('data-ob-wishlist-card');
      if (window.obWishlist.has(handle)) {
        var entry = window.obWishlist.get(handle);
        window.obWishlist.remove(handle);
        window.obWishlistTrack('remove_from_wishlist', {
          handle: handle,
          variant_id: entry.variantId,
          source: isCard ? pageSource() : 'pdp',
        });
      } else if (button.hasAttribute('data-ob-wishlist-card')) {
        // Fill straight away; the entry follows once the product is loaded.
        button.classList.add('ob-wishlist-btn--selected');
        button.setAttribute('aria-pressed', 'true');
        addFromCard(button, handle);
      } else {
        var variantId = selectedVariantId(button);
        window.obWishlist.add(handle, variantId, 'pdp');
        var fields = pdpFields(handle, variantId);
        fields.source = 'pdp';
        window.obWishlistTrack('add_to_wishlist', fields);
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
