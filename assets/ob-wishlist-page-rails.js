/*
 * Standalone /apps/wishlist page: replaces WK's native <select> option
 * pickers with PLP/PDP-style rails (colour image chips, size boxes), reusing
 * the shared assets/ob-option-rail.js chrome and assets/ob-swatch-tooltip.js
 * tooltip untouched — this file only builds markup with the same class names
 * those already handle (.product-form__option-rail-shell/-rail/-button,
 * .ob-swatch-input-wrapper/__radio/__label/__chip, .product-form__input--size-grid).
 *
 * The underlying <select> elements are kept in the DOM (hidden, not removed)
 * and driven programmatically: a rail click sets the select's value and
 * dispatches a real 'change' event, which is what WK's own reactive state,
 * price/image updates, add-to-cart resolution, and server-side persistence
 * all key off already — confirmed live, so this file never reimplements any
 * of that, only proxies into it.
 *
 * WK renders each item's card asynchronously (and re-renders parts of it on
 * every selection), so rail building/availability-syncing follows the same
 * idempotent MutationObserver + requestAnimationFrame pattern already used
 * elsewhere in ob-wishlist.js. Every per-card step is try/catch guarded and
 * fails open to WK's native dropdown for that one card.
 *
 * The same pass also keeps the PLP card's photo badge (sale percentage or
 * sold out) on each card, from the product JSON the rails already fetch.
 */
(function () {
  'use strict';

  var CARET_SVG =
    '<svg class="icon icon-caret" viewBox="0 0 10 6"><path fill="currentColor" fill-rule="evenodd" d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708" clip-rule="evenodd"/></svg>';

  var productCache = {};

  function optionKeyFromSelect(select) {
    var match = select && typeof select.name === 'string' && select.name.match(/^options\[\[?(.*?)\]?\]$/);
    return match ? match[1] : '';
  }

  function optionKind(key) {
    var lower = (key || '').toLowerCase();
    if (lower.indexOf('size') !== -1 || lower.indexOf('maat') !== -1) return 'size';
    if (lower.indexOf('color') !== -1 || lower.indexOf('colour') !== -1 || lower.indexOf('kleur') !== -1) {
      return 'color';
    }
    return 'other';
  }

  function handleFromCard(card) {
    var link = card.querySelector('.wk-image-link, .wk-product-title a');
    if (!link || !link.getAttribute) return null;
    var match = link.getAttribute('href').match(/\/products\/([^/?#]+)/);
    return match ? match[1] : null;
  }

  function fetchProduct(handle) {
    if (productCache[handle]) return productCache[handle];
    productCache[handle] = fetch('/products/' + handle + '.js')
      .then(function (res) {
        if (!res.ok) throw new Error('product fetch failed');
        return res.json();
      })
      .catch(function () {
        delete productCache[handle];
        return null;
      });
    return productCache[handle];
  }

  function resizedSrc(src, size) {
    if (!src) return null;
    return src + (src.indexOf('?') === -1 ? '?' : '&') + 'width=' + size + '&height=' + size + '&crop=center';
  }

  function variantImageFor(product, position, value) {
    if (!product || !product.variants) return null;
    var prop = 'option' + position;
    var trimmed = (value || '').trim();
    var variant = product.variants.filter(function (v) {
      return (v[prop] || '').trim() === trimmed;
    })[0];
    var img = variant && variant.featured_image;
    return (img && img.src) || null;
  }

  function railButtons(previousLabel, nextLabel) {
    var wrap = document.createDocumentFragment();
    ['previous', 'next'].forEach(function (dir) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'product-form__option-rail-button product-form__option-rail-button--' + dir;
      btn.setAttribute('data-ob-option-rail-' + dir, '');
      btn.setAttribute('aria-label', dir === 'previous' ? previousLabel : nextLabel);
      btn.innerHTML = CARET_SVG;
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function buildColorRail(select, product, position, namePrefix) {
    var shell = document.createElement('div');
    shell.className = 'product-form__option-rail-shell';
    shell.setAttribute('data-ob-option-rail-shell', '');

    var rail = document.createElement('div');
    rail.className = 'product-form__option-rail product-form__option-rail--color';
    rail.setAttribute('data-ob-option-rail', '');
    rail.setAttribute('role', 'radiogroup');

    var index = 0;
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.disabled) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'ob-swatch-input-wrapper';

      var id = namePrefix + '-' + index;
      index += 1;
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.id = id;
      radio.name = namePrefix;
      radio.value = option.value;
      radio.className = 'ob-swatch-input__radio';
      if (option.value === select.value) radio.checked = true;

      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.className = 'ob-swatch-input__label';
      var name = option.textContent.trim();
      label.setAttribute('data-ob-swatch-name', name);

      var chip = document.createElement('span');
      chip.className = 'ob-swatch-input__chip';
      var src = variantImageFor(product, position, option.value);
      if (src) {
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = name;
        img.src = resizedSrc(src, 100);
        img.srcset = resizedSrc(src, 64) + ' 64w, ' + resizedSrc(src, 100) + ' 100w, ' + resizedSrc(src, 150) + ' 150w';
        img.sizes = '64px';
        chip.appendChild(img);
      } else {
        chip.classList.add('ob-swatch-input__chip--unavailable');
      }

      label.appendChild(chip);
      var hidden = document.createElement('span');
      hidden.className = 'visually-hidden';
      hidden.textContent = name;
      label.appendChild(hidden);

      wrapper.appendChild(radio);
      wrapper.appendChild(label);
      rail.appendChild(wrapper);
    });

    shell.appendChild(rail);
    shell.appendChild(railButtons(window.obWishlistRailLabels.previous, window.obWishlistRailLabels.next));
    return shell;
  }

  // Simple wrapping grid, not a rail: no scroll, no chevrons, every value
  // visible at once. Sizes don't need PLP's colour-swatch treatment — a small
  // box grid reads cleaner than a horizontally-scrolling row for this many values.
  function buildSizeGrid(select, namePrefix) {
    var grid = document.createElement('div');
    grid.className = 'product-form__input--size-grid';
    grid.setAttribute('role', 'radiogroup');

    var index = 0;
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.disabled) return;

      var id = namePrefix + '-' + index;
      index += 1;
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.id = id;
      radio.name = namePrefix;
      radio.value = option.value;
      radio.className = 'visually-hidden';
      if (option.value === select.value) radio.checked = true;

      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = option.textContent.trim();

      grid.appendChild(radio);
      grid.appendChild(label);
    });

    return grid;
  }

  function wireRail(shell, select) {
    shell.addEventListener('change', function (evt) {
      var radio = evt.target;
      if (!radio || radio.type !== 'radio') return;
      try {
        select.value = radio.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {
        // fail open: rail selection simply doesn't propagate this time
      }
    });
  }

  function syncRailAvailability(shell, select) {
    var radios = shell.querySelectorAll('input[type="radio"]');
    var byValue = {};
    Array.prototype.forEach.call(select.options, function (option) {
      byValue[option.value] = option;
    });
    radios.forEach(function (radio) {
      var option = byValue[radio.value];
      var disabled = !option || option.disabled;
      radio.disabled = disabled;
      radio.classList.toggle('disabled', disabled);
      if (option && option.value === select.value && !radio.checked) radio.checked = true;
    });
  }

  function buildRailsForForm(card, form, product) {
    var variantsEl = form.querySelector('.wk-variants');
    var imageLink = card.querySelector('.wk-image-link');
    if (!variantsEl || !imageLink || form.querySelector(':scope > .ob-wishlist-rails') || card.querySelector(':scope > .ob-wishlist-color-rail')) {
      return;
    }

    var wishlistItemId = form.dataset.wishlistItemId || Math.random().toString(36).slice(2);
    var pickers = Array.prototype.slice.call(variantsEl.querySelectorAll('wk-option-select'));
    if (!pickers.length) return;

    // Colour rail sits directly under the main photo (PLP layout); every
    // other option (size, etc.) stays with the form, above the CTA row.
    var colorContainer = document.createElement('div');
    colorContainer.className = 'ob-wishlist-color-rail';
    var otherContainer = document.createElement('div');
    otherContainer.className = 'ob-wishlist-rails';

    pickers.forEach(function (picker, index) {
      if (picker.classList.contains('wk-single-option')) return;
      var select = picker.querySelector('select');
      if (!select) return;

      var position = index + 1;
      var key = optionKeyFromSelect(select);
      var kind = optionKind(key);
      var namePrefix = 'ob-wishlist-rail-' + wishlistItemId + '-' + position;

      try {
        var isColor = kind === 'color';
        var shell = isColor
          ? buildColorRail(select, product, position, namePrefix)
          : buildSizeGrid(select, namePrefix);
        wireRail(shell, select);
        (isColor ? colorContainer : otherContainer).appendChild(shell);
      } catch (e) {
        // fail open: this option keeps its native dropdown, nothing else built
      }
    });

    if (colorContainer.children.length) {
      imageLink.insertAdjacentElement('afterend', colorContainer);
    }
    if (otherContainer.children.length) {
      variantsEl.insertAdjacentElement('afterend', otherContainer);
    }
    if (colorContainer.children.length || otherContainer.children.length) {
      variantsEl.classList.add('ob-wishlist-variants--railed');
    }
  }

  function syncForm(card, form) {
    var variantsEl = form.querySelector('.wk-variants');
    if (!variantsEl) return;
    var otherContainer = form.querySelector(':scope > .ob-wishlist-rails');
    var colorContainer = card.querySelector(':scope > .ob-wishlist-color-rail');
    var colorShells = colorContainer ? colorContainer.querySelectorAll(':scope > [data-ob-option-rail-shell]') : [];
    var otherShells = otherContainer ? otherContainer.children : [];
    var pickers = Array.prototype.slice.call(variantsEl.querySelectorAll('wk-option-select'));

    var colorIndex = 0;
    var otherIndex = 0;
    pickers.forEach(function (picker) {
      if (picker.classList.contains('wk-single-option')) return;
      var select = picker.querySelector('select');
      if (!select) return;
      var kind = optionKind(optionKeyFromSelect(select));
      var shell = kind === 'color' ? colorShells[colorIndex++] : otherShells[otherIndex++];
      if (!shell) return;
      try {
        syncRailAvailability(shell, select);
      } catch (e) {
        // fail open: availability just stays as last synced
      }
    });
  }

  // Sale percentage of one variant, as ob-sale-label computes it: rounded
  // down, and 0 when the compare-at price is unset, 0 or not above the price.
  function salePercent(variant) {
    var compare = variant.compare_at_price || 0;
    return compare > variant.price ? Math.floor(((compare - variant.price) * 100) / compare) : 0;
  }

  // What the photo badge says, mirroring the PLP card: sold out when nothing
  // is available, else the sale percentage of what the card shows. Once WK
  // has resolved a variant (its hidden id input, the variant whose price the
  // card displays and that add-to-cart posts) that is the one; before that,
  // the available variants matching the options chosen so far, as an "up to"
  // value when they differ (a full-price variant counts as 0). The id wins
  // over the selects because WK can lag a fast rail change by a render.
  function badgeState(form, product) {
    if (!product || !product.variants) return null;
    if (!product.available) return { soldOut: true };

    var idInput = form.querySelector('input[name="id"]');
    var resolvedId = idInput ? Number(idInput.value) : 0;
    var resolved = resolvedId
      ? product.variants.filter(function (variant) {
          return variant.id === resolvedId;
        })
      : [];
    if (resolved.length) {
      var percent = salePercent(resolved[0]);
      return percent > 0 ? { percent: percent, range: false } : null;
    }

    // An item saved without a variant (PLP heart) selects WK's placeholder,
    // whose value is the option label ("Kleur"), so only real values count.
    var chosen = [];
    form.querySelectorAll('.wk-variants wk-option-select').forEach(function (picker, index) {
      var select = picker.querySelector('select');
      var value = select ? (select.value || '').trim() : '';
      var option = product.options && product.options[index];
      var values = (option && option.values) || [];
      var isReal = values.some(function (v) {
        return (v || '').trim() === value;
      });
      if (value && isReal) chosen.push({ prop: 'option' + (index + 1), value: value });
    });

    var matching = product.variants.filter(function (variant) {
      return chosen.every(function (option) {
        return (variant[option.prop] || '').trim() === option.value;
      });
    });
    var scope =
      matching.length === 1
        ? matching
        : matching.filter(function (variant) {
            return variant.available;
          });

    var min = -1;
    var max = 0;
    scope.forEach(function (variant) {
      var percent = salePercent(variant);
      if (min === -1 || percent < min) min = percent;
      if (percent > max) max = percent;
    });
    return max > 0 ? { percent: max, range: min !== max } : null;
  }

  // The badge lives inside the photo link, so it overlays the image at the
  // PLP card's spot. Rewritten only when its state changes: the body
  // MutationObserver below would otherwise re-trigger itself.
  function syncBadge(card, form, product) {
    var link = card.querySelector('.wk-image-link');
    if (!link) return;
    var state = badgeState(form, product);
    var badge = link.querySelector(':scope > .ob-wishlist-badge');
    var key = !state ? '' : state.soldOut ? 'sold-out' : (state.range ? '~' : '') + state.percent;

    if (!badge) {
      if (!key) return;
      badge = document.createElement('span');
      link.appendChild(badge);
    }
    if (badge.dataset.obBadge === key) return;
    badge.dataset.obBadge = key;
    badge.hidden = !key;
    if (!key) return;

    var labels = window.obWishlistBadges || {};
    badge.className =
      'ob-wishlist-badge badge ' +
      (state.soldOut ? 'ob-wishlist-badge--sold-out ' + (labels.soldOutScheme || '') : 'badge--sale ' + (labels.saleScheme || ''));
    badge.textContent = '';
    if (state.soldOut) {
      badge.textContent = labels.soldOut || '';
      return;
    }
    if (state.range && labels.upTo) {
      var prefix = document.createElement('span');
      prefix.className = 'ob-sale-badge__prefix';
      prefix.textContent = labels.upTo;
      badge.appendChild(prefix);
      badge.appendChild(document.createTextNode(' '));
    }
    var value = document.createElement('span');
    value.className = 'ob-sale-badge__value';
    value.textContent = '-' + state.percent + '%';
    badge.appendChild(value);
  }

  function scanCards(root) {
    var forms = root.querySelectorAll('.wk-product-card .wk-form');
    forms.forEach(function (form) {
      var card = form.closest('.wk-product-card');
      if (!card) return;

      var built = !!(form.querySelector(':scope > .ob-wishlist-rails') || card.querySelector(':scope > .ob-wishlist-color-rail'));
      if (built) syncForm(card, form);

      var handle = handleFromCard(card);
      if (!handle) return;

      fetchProduct(handle).then(function (product) {
        if (!built) {
          try {
            buildRailsForForm(card, form, product);
          } catch (e) {
            // fail open: card keeps its native dropdowns
          }
        }
        try {
          syncBadge(card, form, product);
        } catch (e) {
          // fail open: card shows no badge
        }
      });
    });
  }

  window.obWkReady(function () {
    var isEnglish = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
    window.obWishlistRailLabels = isEnglish ? { previous: 'Previous', next: 'Next' } : { previous: 'Vorige', next: 'Volgende' };

    var scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        var root = document.querySelector('#MainContent > wishlist-page');
        if (root) scanCards(root);
      });
    }

    // characterData: a size change can leave every attribute alone, WK only
    // rewrites the price text, and the badge has to follow it.
    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    document.addEventListener('change', schedule);
    schedule();
  });
})();
