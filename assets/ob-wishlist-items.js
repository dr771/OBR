/*
 * Native wishlist entries (wishlist-integration): the favorites page grid and
 * the cart drawer / /cart cross-sell rows. Each entry is rendered by the theme
 * (snippets/ob-wishlist-item.liquid, fetched through the Section Rendering
 * API) and carries every variant as JSON, so a colour or size pick is applied
 * here, at once, and saved straight to the list (ob-wishlist-store.js). There
 * is no remote save, so the last click is always the one that sticks.
 */
(function () {
  'use strict';

  if (!window.obWishlist || customElements.get('ob-wishlist-item')) return;

  var store = window.obWishlist;

  function shopUrl(path) {
    return typeof window.obWishlistUrl === 'function' ? window.obWishlistUrl(path) : path;
  }

  // Analytics (ob-wishlist-store.js); a no-op when that isn't loaded.
  function track(name, data) {
    if (typeof window.obWishlistTrack === 'function') window.obWishlistTrack(name, data);
  }

  // One entry. Option controls (colour chips, size boxes, compact selects)
  // carry data-ob-wl-option="<option index>".
  class ObWishlistItem extends HTMLElement {
    connectedCallback() {
      if (this.data) return;
      try {
        this.data = JSON.parse(this.querySelector('[data-ob-wl-data]').textContent);
      } catch (e) {
        return;
      }
      var id = Number(this.dataset.variantId);
      this.variant = this.variantById(id) || this.data.variants[0];
      this.addEventListener('change', this.onOptionChange.bind(this));
      this.addEventListener('click', this.onClick.bind(this));
      this.render();
    }

    get handle() {
      return this.dataset.handle;
    }

    // Where this entry is shown, for analytics: the favorites page or the cart.
    get surface() {
      return this.classList.contains('ob-wl-item--compact') ? 'cart' : 'favorites';
    }

    eventFields(variant) {
      return {
        handle: this.handle,
        product_id: this.data.id || null,
        variant_id: variant.id,
        sku: variant.sku || null,
        title: this.data.title || null,
        variant_title: variant.title || null,
        price: typeof variant.amount === 'number' ? variant.amount / 100 : null,
        source: this.surface,
      };
    }

    variantById(id) {
      for (var i = 0; i < this.data.variants.length; i += 1) {
        if (this.data.variants[i].id === id) return this.data.variants[i];
      }
      return null;
    }

    // The store's variant for this entry, shown without saving again. An
    // entry without a usable variant (heart without product data, variant
    // since deleted) starts on the colour shown in its start size.
    showVariant(id) {
      var variant = this.variantById(Number(id));
      if (!variant) {
        var colorIndex = this.data.colorIndex;
        variant = this.startVariant(colorIndex === -1 ? '' : this.variant.options[colorIndex]) || this.variant;
        store.update(this.handle, variant.id);
      }
      if (variant === this.variant) return;
      this.variant = variant;
      this.render();
    }

    startVariant(colorValue) {
      if (typeof window.obWishlistStartVariant !== 'function') return null;
      var start = window.obWishlistStartVariant(this.data, colorValue);
      return start ? this.variantById(start.id) : null;
    }

    // The variant a pick lands on. A colour keeps the chosen size when it
    // comes in it, otherwise it moves to that colour's start size; other
    // options only offer values that exist with the current colour.
    variantFor(index, value) {
      var wanted = this.variant.options.slice();
      wanted[index] = value;
      var exact = this.data.variants.filter(function (variant) {
        return variant.options.every(function (option, i) {
          return option === wanted[i];
        });
      })[0];
      if (exact) return exact;
      if (index === this.data.colorIndex) return this.startVariant(value);

      var colorIndex = this.data.colorIndex;
      var color = colorIndex === -1 ? null : this.variant.options[colorIndex];
      var matching = this.data.variants.filter(function (variant) {
        return variant.options[index] === value && (color === null || variant.options[colorIndex] === color);
      });
      return (
        matching.filter(function (variant) {
          return variant.available;
        })[0] ||
        matching[0] ||
        null
      );
    }

    onOptionChange(evt) {
      var control = evt.target.closest('[data-ob-wl-option]');
      if (!control || (control.type === 'radio' && !control.checked)) return;
      var variant = this.variantFor(Number(control.dataset.obWlOption), control.value);
      if (!variant) {
        this.render();
        return;
      }
      this.variant = variant;
      this.render();
      store.update(this.handle, variant.id);
      track('wishlist_variant_change', this.eventFields(variant));
    }

    onClick(evt) {
      if (evt.target.closest('[data-ob-wl-remove]')) {
        evt.preventDefault();
        store.remove(this.handle);
        track('remove_from_wishlist', this.eventFields(this.variant));
      } else if (evt.target.closest('[data-ob-wl-add]')) {
        evt.preventDefault();
        this.addToCart(evt.target.closest('[data-ob-wl-add]'));
      }
    }

    // Values of an option that exist with the current colour; colours
    // themselves stay selectable.
    offered(index) {
      var colorIndex = this.data.colorIndex;
      var color = colorIndex === -1 ? null : this.variant.options[colorIndex];
      var values = {};
      this.data.variants.forEach(function (variant) {
        if (index === colorIndex || color === null || variant.options[colorIndex] === color) {
          values[variant.options[index]] = true;
        }
      });
      return values;
    }

    render() {
      var variant = this.variant;
      var self = this;
      this.dataset.variantId = variant.id;
      this.classList.toggle('ob-wl-item--sold-out', !variant.available);

      this.querySelectorAll('[data-ob-wl-option]').forEach(function (control) {
        var index = Number(control.dataset.obWlOption);
        var current = variant.options[index];
        var offered = self.offered(index);
        if (control.tagName === 'SELECT') {
          Array.prototype.forEach.call(control.options, function (option) {
            option.disabled = !offered[option.value];
          });
          if (control.value !== current) control.value = current;
        } else {
          var missing = !offered[control.value];
          control.disabled = missing;
          control.classList.toggle('disabled', missing);
          control.checked = control.value === current;
        }
      });

      var image = this.querySelector('[data-ob-wl-image]');
      if (image && variant.image && image.getAttribute('src') !== variant.image) {
        if (variant.srcset) image.setAttribute('srcset', variant.srcset);
        image.setAttribute('src', variant.image);
      }
      this.querySelectorAll('[data-ob-wl-link]').forEach(function (link) {
        link.setAttribute('href', variant.url);
      });

      var current = this.querySelector('[data-ob-wl-current]');
      var compare = this.querySelector('[data-ob-wl-compare]');
      var reduced = variant.percent > 0;
      if (current) {
        current.textContent = variant.price;
        current.classList.toggle('ob-wl-item__current--sale', reduced);
      }
      if (compare) {
        compare.textContent = reduced ? variant.compare : '';
        compare.hidden = !reduced;
      }

      var sale = this.querySelector('[data-ob-wl-sale]');
      var saleValue = this.querySelector('[data-ob-wl-sale-value]');
      var soldOut = this.querySelector('[data-ob-wl-sold-out]');
      if (sale) sale.hidden = !(variant.available && reduced);
      if (saleValue) saleValue.textContent = '-' + variant.percent + '%';
      if (soldOut) soldOut.hidden = variant.available;

      var add = this.querySelector('[data-ob-wl-add]');
      if (add) {
        var label = variant.available ? add.dataset.labelAdd : add.dataset.labelSoldOut;
        add.disabled = !variant.available;
        add.setAttribute('aria-label', label);
        var addLabel = add.querySelector('[data-ob-wl-add-label]');
        if (addLabel) addLabel.textContent = label;
      }
      this.showError('');
    }

    showError(message) {
      var error = this.querySelector('[data-ob-wl-error]');
      if (!error) return;
      error.textContent = message;
      error.hidden = !message;
    }

    setBusy(button, busy) {
      button.classList.toggle('is-loading', busy);
      button.toggleAttribute('aria-busy', busy);
      var spinner = button.querySelector('.loading__spinner');
      if (spinner) spinner.classList.toggle('hidden', !busy);
      this.classList.toggle('ob-wl-item--busy', busy);
    }

    // Theme cart add with the drawer's sections, as product-form.js does.
    // Every add is a move-to-cart, from the favorites page and the cart
    // cross-sell alike: the entry leaves the wishlist once the cart has the
    // variant. On the /cart page the page itself reloads instead of opening
    // the drawer over it.
    addToCart(button) {
      if (button.disabled || button.classList.contains('is-loading')) return;
      var self = this;
      var variant = this.variant;
      var cart = document.querySelector('cart-drawer');
      var onCartPage = !!document.querySelector('#MainContent cart-items');

      // The order keeps where the entry was saved (hidden: underscore property).
      var entry = store.get(this.handle);
      var body = new FormData();
      body.append('id', variant.id);
      body.append('quantity', 1);
      body.append('properties[_wishlist]', (entry && entry.source) || 'unknown');
      if (cart && typeof cart.getSectionsToRender === 'function' && !onCartPage) {
        body.append(
          'sections',
          cart.getSectionsToRender().map(function (section) {
            return section.id;
          })
        );
        body.append('sections_url', window.location.pathname);
      }

      var config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      config.body = body;

      this.setBusy(button, true);
      this.classList.add('ob-wl-item--moving');

      fetch(routes.cart_add_url, config)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          if (response.status) {
            self.classList.remove('ob-wl-item--moving');
            self.setBusy(button, false);
            self.showError(response.description || response.message || '');
            return;
          }
          track('wishlist_add_to_cart', self.eventFields(variant));
          store.remove(self.handle);
          track('remove_from_wishlist', self.eventFields(variant));
          if (onCartPage || !cart) {
            window.location = routes.cart_url;
            return;
          }
          self.setBusy(button, false);
          cart.renderContents(response);
          fadeInCartItem(cart, variant.id);
        })
        .catch(function () {
          self.classList.remove('ob-wl-item--moving');
          self.setBusy(button, false);
        });
    }
  }

  function fadeInCartItem(cart, variantId) {
    var item = Array.prototype.find.call(cart.querySelectorAll('.cart-item'), function (candidate) {
      var input = candidate.querySelector('[data-quantity-variant-id]');
      return input && String(input.dataset.quantityVariantId) === String(variantId);
    });
    if (!item) return;
    item.classList.add('ob-cart-item--wishlist-enter');
    window.setTimeout(function () {
      item.classList.remove('ob-cart-item--wishlist-enter');
    }, 400);
  }

  // Rendered entries per layout and handle. The cart drawer replaces its
  // contents on every cart mutation, which recreates the cross-sell list;
  // the cache lets it render again without a request. The HTML is the
  // product as first fetched; the store's variant is applied on top.
  var cache = {};

  function fetchItem(layout, item) {
    var key = layout + ':' + item.handle;
    if (!cache[key]) {
      var section = layout === 'compact' ? 'ob-wishlist-item-compact' : 'ob-wishlist-item';
      var url =
        shopUrl('/products/' + encodeURIComponent(item.handle)) +
        '?section_id=' +
        section +
        (item.variantId ? '&variant=' + item.variantId : '');
      cache[key] = fetch(url)
        .then(function (res) {
          if (res.status === 404) return { gone: true };
          if (!res.ok) throw new Error('wishlist item fetch failed');
          return res.text().then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var element = doc.querySelector('ob-wishlist-item');
            return element ? { html: element.outerHTML } : { gone: true };
          });
        })
        .catch(function () {
          delete cache[key];
          return { failed: true };
        });
    }
    return cache[key];
  }

  function itemFromHtml(html, handle) {
    var template = document.createElement('template');
    template.innerHTML = html;
    var element = template.content.firstElementChild;
    // A renamed product answers under its new handle; the entry keeps the
    // handle it is stored under.
    element.dataset.handle = handle;
    return element;
  }

  // The list of entries for one surface, in the store's order. It renders
  // placeholders while entries load, drops products that no longer exist,
  // and follows every store change (this tab or another). data-count is the
  // number of entries, for the empty state and the cross-sell's visibility.
  class ObWishlistList extends HTMLElement {
    connectedCallback() {
      var self = this;
      this.layout = this.dataset.layout === 'compact' ? 'compact' : 'card';
      if (this.layout === 'card' && !ObWishlistList.viewTracked) {
        ObWishlistList.viewTracked = true;
        track('wishlist_view', {});
      }
      // The cart drawer is on every page but rarely opened: its rows load
      // when it first opens, not on every page view.
      var drawer = this.closest('cart-drawer');
      if (drawer && !drawer.classList.contains('active') && !this.hasCachedItems()) {
        this.drawerObserver = new MutationObserver(function () {
          if (!drawer.classList.contains('active')) return;
          self.drawerObserver.disconnect();
          self.drawerObserver = null;
          self.start();
        });
        this.drawerObserver.observe(drawer, { attributes: true, attributeFilter: ['class'] });
        return;
      }
      this.start();
    }

    start() {
      var self = this;
      this.unsubscribe = store.subscribe(function (items) {
        self.render(items);
      });
      this.render(store.items());
    }

    hasCachedItems() {
      var layout = this.layout;
      return store.items().some(function (item) {
        return !!cache[layout + ':' + item.handle];
      });
    }

    disconnectedCallback() {
      if (this.drawerObserver) this.drawerObserver.disconnect();
      if (this.unsubscribe) this.unsubscribe();
    }

    entry(handle) {
      return Array.prototype.find.call(this.children, function (child) {
        return child.dataset && child.dataset.handle === handle && !child.classList.contains('ob-wl-item--leaving');
      });
    }

    render(items) {
      var self = this;
      var handles = items.map(function (item) {
        return item.handle;
      });

      Array.prototype.slice.call(this.children).forEach(function (child) {
        if (!child.dataset || !child.dataset.handle) {
          child.remove();
        } else if (handles.indexOf(child.dataset.handle) === -1 && !child.classList.contains('ob-wl-item--leaving')) {
          self.leave(child);
        }
      });

      var previous = null;
      items.forEach(function (item) {
        var element = self.entry(item.handle);
        if (!element) {
          element = document.createElement('div');
          element.className = 'ob-wl-item ob-wl-item--' + self.layout + ' ob-wl-item--placeholder';
          element.dataset.handle = item.handle;
          element.setAttribute('aria-hidden', 'true');
          self.load(element, item);
        } else if (element.tagName === 'OB-WISHLIST-ITEM' && Number(element.dataset.variantId) !== item.variantId) {
          element.showVariant(item.variantId);
        }
        var target = previous ? previous.nextElementSibling : self.firstElementChild;
        if (element !== target) self.insertBefore(element, target);
        previous = element;
      });

      this.dataset.count = String(items.length);
      this.toggleAttribute('aria-busy', !!this.querySelector('.ob-wl-item--placeholder'));
    }

    load(placeholder, item) {
      var self = this;
      fetchItem(this.layout, item).then(function (result) {
        if (!placeholder.isConnected) return;
        if (result.gone) {
          placeholder.remove();
          store.remove(item.handle);
          return;
        }
        if (result.failed) {
          placeholder.remove();
          return;
        }
        var element = itemFromHtml(result.html, item.handle);
        placeholder.replaceWith(element);
        var stored = store.get(item.handle);
        if (stored) element.showVariant(stored.variantId);
        self.toggleAttribute('aria-busy', !!self.querySelector('.ob-wl-item--placeholder'));
      });
    }

    // A removed entry fades out before it leaves the DOM; the list's count
    // (and so the cross-sell's visibility) already reflects the removal.
    leave(element) {
      if (element.classList.contains('ob-wl-item--placeholder') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.remove();
        return;
      }
      element.classList.add('ob-wl-item--leaving');
      window.setTimeout(function () {
        element.remove();
      }, 200);
    }
  }

  customElements.define('ob-wishlist-item', ObWishlistItem);
  customElements.define('ob-wishlist-list', ObWishlistList);
})();
