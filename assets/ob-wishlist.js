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

    function escapeRe(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function optionKey(select) {
      var match = select && typeof select.name === 'string' && select.name.match(/^options\[\[?(.*?)\]?\]$/);
      return match ? match[1] : '';
    }

    function replaceIn(el, re, label) {
      if (!el) return;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walker.nextNode())) {
        var text = node.nodeValue;
        if (!text) continue;
        var trimmed = text.trim();
        var next = text.replace(re, function (full) {
          return trimmed === full.trim() ? label : label.toLowerCase();
        });
        if (next !== text) node.nodeValue = next;
      }
    }

    // Collapse an element's text to one value, leaving lit's comment markers.
    function setOnlyText(el, value) {
      if (!el) return;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      var node;
      while ((node = walker.nextNode())) nodes.push(node);
      var first = null;
      nodes.forEach(function (candidate) {
        if (!first && candidate.nodeValue.trim()) first = candidate;
      });
      if (!first) return;
      nodes.forEach(function (candidate) {
        if (candidate === first) {
          if (candidate.nodeValue !== value) candidate.nodeValue = value;
        } else if (candidate.nodeValue.trim()) {
          candidate.nodeValue = '';
        }
      });
    }

    /* Bracketless raw keys. Translate & Adapt strips the Akeneo brackets before
       the storefront sees them (confirmed live: select names arrive as
       `options[shoe_size_eu]`), so the bracket rewriter above never fires on the
       three places WK prints the key verbatim: the picker's own label, its
       "Selecteer <name>" placeholder (both the <option> and the visible
       .wk-text), and — for an item added from a PLP card, where no variant is
       chosen yet — the disabled CTA's label. Each key is read from its select's
       name and substituted only inside those elements; walking the whole card
       would risk mangling a product title that happens to contain "color". */
    function rewriteRawKeys(root) {
      root.querySelectorAll('wk-option-select').forEach(function (picker) {
        var select = picker.querySelector('select[name^="options["]');
        var key = optionKey(select);
        var label = key && labelFor(key);
        if (!label || label === key) return;
        var re = new RegExp('\\[?' + escapeRe(key) + '\\]?', 'gi');
        replaceIn(picker.querySelector('.wk-label'), re, label);
        replaceIn(picker.querySelector('.wk-text'), re, label);
        picker.querySelectorAll('option').forEach(function (option) {
          replaceIn(option, re, label);
        });

        /* An item added from a PLP card has no variant yet, so both pickers
           show WK's "Selecteer <name>" placeholder. Two of those side by side
           in a drawer-width row both ellipsize to "Selecte…"; the bare option
           name reads as the prompt and fits. The CTA keeps the full sentence
           for screen readers. */
        var placeholder = select && select.querySelector('option[disabled]');
        if (!placeholder) return;
        setOnlyText(placeholder, label);
        if (select.options[select.selectedIndex] === placeholder) {
          setOnlyText(picker.querySelector('.wk-text'), label);
        }
      });

      root.querySelectorAll('.wk-cta-label').forEach(function (el) {
        var form = el.closest('form');
        if (!form) return;
        form.querySelectorAll('select[name^="options["]').forEach(function (select) {
          var key = optionKey(select);
          var label = key && labelFor(key);
          if (!label || label === key) return;
          replaceIn(el, new RegExp('\\[?' + escapeRe(key) + '\\]?', 'gi'), label);
        });
      });
    }

    /* Off-screen ruler rather than canvas measureText: the visible text layer
       carries letter-spacing, which measureText ignores — it came out ~3px
       short per label, just enough to ellipsize "Maat" to "M…". */
    function measureText(value, textEl) {
      var ruler = measureText.el;
      if (!ruler) {
        ruler = measureText.el = document.createElement('span');
        ruler.setAttribute('aria-hidden', 'true');
        ruler.style.cssText =
          'position:absolute;left:-9999px;top:-9999px;white-space:pre;visibility:hidden;pointer-events:none;';
        document.body.appendChild(ruler);
      }
      var style = getComputedStyle(textEl);
      ruler.style.font = style.font;
      ruler.style.letterSpacing = style.letterSpacing;
      ruler.style.textTransform = style.textTransform;
      ruler.style.fontWeight = style.fontWeight;
      ruler.textContent = value;
      return ruler.getBoundingClientRect().width;
    }

    function measureOptionWidths() {
      document.querySelectorAll('.ob-wishlist-cross-sell .wk-variants > wk-option-select').forEach(function (picker) {
        var select = picker.querySelector('select');
        var text = picker.querySelector('.wk-text');
        var content = picker.querySelector('.wk-content');
        var icon = picker.querySelector('.wk-icon');
        var control = picker.querySelector('.wk-control');
        if (!select || !text || !content || !control) return;

        /* While nothing is chosen the picker only ever shows its own name, so
           it should claim no more than that — sizing an unchosen colour picker
           to "Cherry Blossom" would squeeze the size picker next to it down to
           "M…". Once a value is chosen, size to the widest selectable value so
           the control stops resizing as the shopper cycles through them. */
        var placeholderShowing = !!(select.options[select.selectedIndex] || {}).disabled;
        var longest = measureText(text.textContent.trim(), text);
        if (!placeholderShowing) {
          Array.prototype.forEach.call(select.options, function (option) {
            if (option.disabled) return;
            longest = Math.max(longest, measureText(option.textContent.trim(), text));
          });
        }

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

        picker.style.setProperty('--ob-wk-option-width', Math.ceil(longest + chrome) + 1 + 'px');
      });
    }

    function overlayAll() {
      document.querySelectorAll('wishlist-page, .ob-wishlist-cross-sell').forEach(function (root) {
        overlayContainer(root);
        rewriteRawKeys(root);
      });
      measureOptionWidths();
    }

    obWkReady(function () {
      var observed = new WeakSet();
      var scheduled = false;

      /* Content observer: lit rewrites the option text in place, so
         characterData matters as much as childList. Every rewrite here is
         idempotent, so the pass it triggers on itself simply finds nothing. */
      var contentObserver = new MutationObserver(function () {
        schedule();
      });

      function attach() {
        document.querySelectorAll('wishlist-page, .ob-wishlist-cross-sell').forEach(function (el) {
          if (observed.has(el)) return;
          observed.add(el);
          contentObserver.observe(el, { childList: true, subtree: true, characterData: true });
        });
      }

      function schedule() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
          scheduled = false;
          attach();
          overlayAll();
        });
      }

      /* The cart drawer replaces <cart-drawer-items> wholesale on every cart
         mutation, which throws away the cross-sell node the content observer
         was watching — so watch the document for its replacement too. */
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });

      attach();
      overlayAll();
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
    function fadeInCartItem(cart, variantId) {
      if (!cart || !variantId) return;
      var item = Array.prototype.find.call(
        cart.querySelectorAll('.cart-item'),
        function (candidate) {
          var input = candidate.querySelector('[data-quantity-variant-id]');
          return input && String(input.dataset.quantityVariantId) === String(variantId);
        }
      );
      if (!item) return;

      item.classList.add('ob-cart-item--wishlist-enter');
      window.setTimeout(function () {
        item.classList.remove('ob-cart-item--wishlist-enter');
      }, 400);
    }

    // WK renders asynchronously, so immediately after Dawn has replaced the
    // drawer it can briefly render the just-moved wishlist card again. Keep
    // that stale card hidden until its matching wishlist item actually leaves
    // the DOM. The long timeout is only a fail-open escape hatch if WK's
    // removal call fails; it must not race WK's normal delayed re-render.
    function hideStaleWishlistCard(cart, wishlistItemId) {
      if (!cart || !wishlistItemId) return;

      var observer;
      var failOpenTimer;
      var sawMatchingCard = false;

      function matchingCards() {
        var cards = [];
        cart.querySelectorAll('.ob-wishlist-cross-sell [data-wishlist-item-id]').forEach(function (element) {
          if (element.dataset.wishlistItemId !== wishlistItemId) return;
          var card = element.closest('.wk-product-card');
          if (card && cards.indexOf(card) === -1) cards.push(card);
        });
        return cards;
      }

      function stopWatching() {
        observer?.disconnect();
        window.clearTimeout(failOpenTimer);
      }

      function reconcile() {
        var cards = matchingCards();
        if (cards.length) {
          sawMatchingCard = true;
          cards.forEach(function (card) {
            card.classList.add('ob-wishlist-card--awaiting-removal');
          });
        } else if (sawMatchingCard) {
          stopWatching();
        }
      }

      observer = new MutationObserver(reconcile);
      observer.observe(cart, { childList: true, subtree: true });
      reconcile();

      failOpenTimer = window.setTimeout(function () {
        stopWatching();
        matchingCards().forEach(function (card) {
          card.classList.remove('ob-wishlist-card--awaiting-removal');
        });
      }, 5000);
    }

    document.addEventListener(
      'submit',
      function (evt) {
        var form = evt.target;
        if (!form.closest || !form.closest('.ob-wishlist-cross-sell')) return;
        if (!form.action || form.action.indexOf('/cart/add') === -1) return;
        if (form.dataset.obMoveToCartPending === 'true') return;

        evt.preventDefault();
        evt.stopPropagation();

        var cart = document.querySelector('cart-drawer');
        var formData = new FormData(form);
        var wishlistCard = form.closest('.wk-product-card');
        var wishlistSection = form.closest('.ob-wishlist-cross-sell');
        var isLastWishlistCard =
          wishlistSection && wishlistCard && wishlistSection.querySelectorAll('.wk-product-card').length === 1;
        var wishlistItemId = form.closest('[data-wishlist-item-id]')
          ? form.closest('[data-wishlist-item-id]').dataset.wishlistItemId
          : null;

        form.dataset.obMoveToCartPending = 'true';
        if (wishlistCard) {
          wishlistCard.classList.add('ob-wishlist-card--moving-to-cart');
          wishlistCard.setAttribute('aria-busy', 'true');
        }
        if (isLastWishlistCard) wishlistSection.classList.add('ob-wishlist-cross-sell--moving-last');

        function resetMove() {
          delete form.dataset.obMoveToCartPending;
          wishlistCard?.classList.remove('ob-wishlist-card--moving-to-cart');
          wishlistCard?.removeAttribute('aria-busy');
          wishlistSection?.classList.remove('ob-wishlist-cross-sell--moving-last');
        }

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
            if (response.status) {
              resetMove();
              return;
            }

            try {
              if (wishlistItemId) wk.removeWishlistItem({ wishlistItemId: wishlistItemId });
            } catch (e) {
              // fail open: item stays on the wishlist, cart add still succeeded
            }

            if (cart) {
              cart.renderContents(response);
              fadeInCartItem(cart, response.id);
              hideStaleWishlistCard(cart, wishlistItemId);
            } else {
              window.location = routes.cart_url;
            }
          })
          .catch(function () {
            resetMove();
            // fail open: no drawer refresh, WK's own state is untouched
          });
      },
      true
    );
  });

  // Cart drawer / cart page cross-sell: per-row remove-from-wishlist button.
  // WK's own <remove-button> is a floating, JS-transform-positioned control
  // built for a card corner (like the PLP collection-card heart) — fighting
  // that positioning to sit it inline next to the CTA was more fragile than
  // driving WK's real removeWishlistItem() API from a plain button we own,
  // cloned from the <template> in ob-wishlist-cross-sell.liquid. Removing the
  // item lets WK's own reactive render drop the card from wishlist-page,
  // which in turn re-hides the whole cross-sell via the
  // :has(.wk-product-card) CSS rule once the wishlist is empty again — no
  // separate "remove from the drawer" step needed.
  (function () {
    function injectButtons() {
      var template = document.querySelector('.ob-wishlist-cross-sell__remove-template');
      if (!template || !template.content) return;

      document.querySelectorAll('.ob-wishlist-cross-sell .wk-form').forEach(function (form) {
        if (form.querySelector('.ob-wishlist-cross-sell__remove')) return;
        var wishlistItemId = form.dataset.wishlistItemId;
        if (!wishlistItemId) return;

        var button = template.content.firstElementChild.cloneNode(true);
        button.addEventListener('click', function () {
          try {
            if (window.WishlistKing && typeof window.WishlistKing.removeWishlistItem === 'function') {
              window.WishlistKing.removeWishlistItem({ wishlistItemId: wishlistItemId });
            }
          } catch (e) {
            // fail open: click is a no-op
          }
        });
        form.appendChild(button);
      });
    }

    new MutationObserver(injectButtons).observe(document.body, { childList: true, subtree: true });
    injectButtons();
  })();
})();
