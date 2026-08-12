/*
 * Wishlist King (Swish) storefront integration — wishlist-integration.
 * Every WK-dependent consumer here (parser patch, label overlay, header
 * badge, PDP heart, cart cross-sell) goes through obWkReady and stays
 * fail-open: if WK is absent, not yet booted, or its internals change
 * shape, this file degrades to a no-op instead of throwing.
 */

(function () {
  function obWkReady(cb) {
    if (window.WishlistKing) {
      cb(window.WishlistKing);
      return;
    }
    var attempts = 0;
    var maxAttempts = 300; // ~30s at 100ms
    var timer = setInterval(function () {
      attempts += 1;
      if (window.WishlistKing) {
        clearInterval(timer);
        cb(window.WishlistKing);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 100);
  }
  window.obWkReady = obWkReady;

  // Anchored bracket-key option parser patch. Fixes WK's getInputOption/
  // getFormOptions when a Shopify option name itself contains brackets
  // (Akeneo keys like "[color]"), which produce input names such as
  // "options[[color]]" that WK's own lazy regex can't parse. Confirmed via
  // Admin API that every synced product's raw option.name is bracketed;
  // whether this reaches the storefront depends on Translate & Adapt
  // coverage for the active locale, so this stays in as defense-in-depth
  // rather than a directly-reproduced bug.
  obWkReady(function (wk) {
    try {
      var product = wk.utils && wk.utils.product;
      if (!product || product.__obOptionParseFixed) return;

      var proto = Object.getPrototypeOf(product);
      var originalGetInputOption = proto.getInputOption;
      var originalGetFormOptions = proto.getFormOptions;
      if (typeof originalGetInputOption !== 'function' || typeof originalGetFormOptions !== 'function') return;

      var ANCHORED = /^options\[(.*)\]$/;

      proto.getInputOption = function (input) {
        try {
          var name = input && input.name;
          var match = typeof name === 'string' && name.match(ANCHORED);
          if (!match) return originalGetInputOption.apply(this, arguments);
          return match[1];
        } catch (e) {
          return originalGetInputOption.apply(this, arguments);
        }
      };

      proto.getFormOptions = function () {
        try {
          return originalGetFormOptions.apply(this, arguments);
        } catch (e) {
          return {};
        }
      };

      product.__obOptionParseFixed = true;
    } catch (e) {
      // fail open: WK behaves exactly as unpatched
    }
  });

  // Label overlay: rewrites raw Akeneo bracket keys WK renders on
  // /apps/wishlist and in the cart cross-sell into display labels, matching
  // ob-option-meta's color/size kind detection (color/colour/kleur -> Kleur,
  // size/maat -> Maat, else humanized key).
  (function () {
    var TOKEN = /\[([a-z0-9_]+)\]/gi;

    function labelFor(key) {
      var lower = key.toLowerCase();
      if (lower.indexOf('size') !== -1 || lower.indexOf('maat') !== -1) return 'Maat';
      if (lower.indexOf('color') !== -1 || lower.indexOf('colour') !== -1 || lower.indexOf('kleur') !== -1) {
        return 'Kleur';
      }
      return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, function (c) {
          return c.toUpperCase();
        });
    }

    function rewriteTextNode(node) {
      var text = node.nodeValue;
      if (!text || text.indexOf('[') === -1) return;
      var isStandalone = text.trim().match(/^\[[a-z0-9_]+\]$/i);
      var next = text.replace(TOKEN, function (full, key) {
        var label = labelFor(key);
        return isStandalone ? label : label.toLowerCase();
      });
      if (next !== text) node.nodeValue = next;
    }

    function overlayContainer(root) {
      if (!root) return;
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walker.nextNode())) {
        rewriteTextNode(node);
      }
    }

    function sizeColorDropdowns() {
      document.querySelectorAll('.ob-wishlist-cross-sell .wk-variants > wk-option-select').forEach(function (picker) {
        var select = picker.querySelector('select[name*="color" i], select[name*="colour" i], select[name*="kleur" i]');
        var text = picker.querySelector('.wk-text');
        var content = picker.querySelector('.wk-content');
        var icon = picker.querySelector('.wk-icon');
        var control = picker.querySelector('.wk-control');
        if (!select || !text || !content || !control) return;

        var canvas = sizeColorDropdowns.canvas || (sizeColorDropdowns.canvas = document.createElement('canvas'));
        var context = canvas.getContext('2d');
        if (!context) return;

        var textStyle = getComputedStyle(text);
        context.font = textStyle.font || [textStyle.fontWeight, textStyle.fontSize, textStyle.fontFamily].join(' ');

        var longest = 0;
        Array.prototype.forEach.call(select.options, function (option) {
          longest = Math.max(longest, context.measureText(option.textContent.trim()).width);
        });

        var contentStyle = getComputedStyle(content);
        var controlStyle = getComputedStyle(control);
        var iconWidth = icon ? icon.getBoundingClientRect().width : 0;
        var gap = parseFloat(contentStyle.columnGap) || 0;
        var chrome =
          (parseFloat(contentStyle.paddingLeft) || 0) +
          (parseFloat(contentStyle.paddingRight) || 0) +
          gap +
          iconWidth +
          (parseFloat(controlStyle.borderLeftWidth) || 0) +
          (parseFloat(controlStyle.borderRightWidth) || 0);

        picker.style.setProperty('--ob-wk-option-width', Math.ceil(longest + chrome) + 'px');
      });
    }

    function overlayAll() {
      document.querySelectorAll('wishlist-page, .ob-wishlist-cross-sell').forEach(overlayContainer);
      sizeColorDropdowns();
    }

    obWkReady(function () {
      overlayAll();
      var observer = new MutationObserver(function () {
        overlayAll();
      });
      document.querySelectorAll('wishlist-page, .ob-wishlist-cross-sell').forEach(function (el) {
        observer.observe(el, { childList: true, subtree: true, characterData: true });
      });
    });
  })();

  // Header wishlist badge.
  obWkReady(function (wk) {
    try {
      var badge = document.querySelector('.ob-wishlist-bubble');
      if (!badge || !wk._state || typeof wk._state.observeWishlist !== 'function') return;
      wk._state.observeWishlist({ wishlistId: 'mine' }).subscribe(function (state) {
        try {
          var count = state && typeof state.numItems === 'number' ? state.numItems : 0;
          badge.textContent = count > 0 ? (count < 100 ? String(count) : '99+') : '';
        } catch (e) {
          // fail open: badge stays empty, Dawn's :empty rule keeps it hidden
        }
      });
    } catch (e) {
      // fail open: no badge, heart link still works
    }
  });

  // PDP wishlist toggle beside add-to-cart.
  obWkReady(function (wk) {
    try {
      if (!wk._state || typeof wk._state.observeProductInfo !== 'function') return;

      function applyState(handle, inWishlist, wishlistItemId) {
        document.querySelectorAll('.ob-wishlist-btn[data-product-handle="' + handle + '"]').forEach(function (btn) {
          btn.classList.toggle('ob-wishlist-btn--selected', !!inWishlist);
          btn.setAttribute('aria-pressed', inWishlist ? 'true' : 'false');
          btn.setAttribute('aria-label', inWishlist ? btn.dataset.labelRemove : btn.dataset.labelAdd);
          btn.dataset.wishlistItemId = wishlistItemId || '';
        });
      }

      function subscribeProduct(handle) {
        if (!handle) return;
        wk._state.observeProductInfo({ productHandle: handle }).subscribe(function (state) {
          try {
            applyState(handle, state && state.inWishlist, state && state.wishlistItemId);
          } catch (e) {
            // fail open
          }
        });
      }

      var subscribed = {};
      function subscribeAllVisible() {
        document.querySelectorAll('.ob-wishlist-btn').forEach(function (btn) {
          var handle = btn.dataset.productHandle;
          if (handle && !subscribed[handle]) {
            subscribed[handle] = true;
            subscribeProduct(handle);
          }
        });
      }

      subscribeAllVisible();
      var observer = new MutationObserver(subscribeAllVisible);
      observer.observe(document.body, { childList: true, subtree: true });

      document.addEventListener('click', function (evt) {
        var btn = evt.target.closest && evt.target.closest('.ob-wishlist-btn');
        if (!btn) return;
        evt.preventDefault();

        var handle = btn.dataset.productHandle;
        var form = btn.closest('form') || (btn.closest('product-form') && btn.closest('product-form').querySelector('form'));
        var variantInput = form && form.querySelector('input[name="id"]');
        var variantId = variantInput ? parseInt(variantInput.value, 10) : null;
        var selected = btn.classList.contains('ob-wishlist-btn--selected');

        try {
          if (selected) {
            var wishlistItemId = btn.dataset.wishlistItemId;
            if (wishlistItemId) wk.removeWishlistItem({ wishlistItemId: wishlistItemId });
          } else if (handle && variantId) {
            wk.addWishlistItem({ productHandle: handle, variantId: variantId });
          }
        } catch (e) {
          // fail open: click is a no-op
        }
      });
    } catch (e) {
      // fail open: button renders, click is a no-op
    }
  });

  // Cart drawer / cart page cross-sell: move-to-cart intercept. WK's own
  // wishlist-page CTA submits a plain POST /cart/add form (confirmed live —
  // clicking it navigates the whole page to /cart), so this captures the
  // submit, adds via the theme's standard cart/add.js + sectionsToRender
  // pattern (matching assets/product-form.js), removes the item from the
  // wishlist, and refreshes/opens the cart drawer instead of navigating.
  obWkReady(function (wk) {
    document.addEventListener(
      'submit',
      function (evt) {
        var form = evt.target;
        if (!form.closest || !form.closest('.ob-wishlist-cross-sell')) return;
        if (!form.action || form.action.indexOf('/cart/add') === -1) return;

        evt.preventDefault();
        evt.stopPropagation();

        var cart = document.querySelector('cart-drawer');
        var formData = new FormData(form);
        var wishlistItemId = form.closest('[data-wishlist-item-id]')
          ? form.closest('[data-wishlist-item-id]').dataset.wishlistItemId
          : null;

        if (cart && typeof cart.getSectionsToRender === 'function') {
          formData.append(
            'sections',
            cart.getSectionsToRender().map(function (section) {
              return section.id;
            })
          );
          formData.append('sections_url', window.location.pathname);
        }

        var config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];
        config.body = formData;

        fetch(routes.cart_add_url, config)
          .then(function (response) {
            return response.json();
          })
          .then(function (response) {
            if (response.status) return;

            try {
              if (wishlistItemId) wk.removeWishlistItem({ wishlistItemId: wishlistItemId });
            } catch (e) {
              // fail open: item stays on the wishlist, cart add still succeeded
            }

            if (cart) {
              cart.renderContents(response);
            } else {
              window.location = routes.cart_url;
            }
          })
          .catch(function () {
            // fail open: no drawer refresh, WK's own state is untouched
          });
      },
      true
    );
  });
})();
