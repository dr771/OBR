/*
 * Shopper size memory and size ordering, shared by the PDP and the wishlist
 * surfaces (ob-wishlist.js, ob-wishlist-page-rails.js). Loaded on every page,
 * before ob-wishlist.js.
 */
(function () {
  'use strict';

  // Size values in storefront order, the JS twin of ob-option-value-order
  // (XXXL reads as 3XL, W32 as 32).
  var LETTER_SIZES = ['3XS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];

  function normalizeLetterSize(value) {
    return String(value || '')
      .trim()
      .toUpperCase()
      .replace(/^X{3,}(S|L)$/, function (match, end) {
        return match.length - 1 + 'X' + end;
      });
  }

  function sortSizeValues(values) {
    // Letter sizes first, then numbered ones (EU shoe 38, waist W32,
    // clothing 36) ascending, then anything else in source order.
    function rank(value) {
      var index = LETTER_SIZES.indexOf(normalizeLetterSize(value));
      if (index !== -1) return index;
      var number = String(value).trim().match(/^W?(\d+(?:[.,]\d+)?)$/i);
      return number ? 1000 + parseFloat(number[1].replace(',', '.')) : Infinity;
    }
    return values
      .map(function (value, index) {
        return { value: value, index: index, rank: rank(value) };
      })
      .sort(function (a, b) {
        return a.rank - b.rank || a.index - b.index;
      })
      .map(function (entry) {
        return entry.value;
      });
  }

  function optionKind(name) {
    var lower = String(name || '').toLowerCase();
    if (lower.indexOf('size') !== -1 || lower.indexOf('maat') !== -1) return 'size';
    if (lower.indexOf('color') !== -1 || lower.indexOf('colour') !== -1 || lower.indexOf('kleur') !== -1) return 'color';
    return 'other';
  }

  // The shopper's own size choices, per size system (the raw Akeneo key, e.g.
  // `shoe_size_eu`, `tops_size`), most recent wins. Only trusted clicks on a
  // size option count (PDP picker, wishlist size grid), never a value the
  // theme preselected. Kept in this browser only; storage failures just mean
  // nothing is remembered.
  var SIZE_MEMORY_KEY = 'ob-size-memory';

  function readSizeMemory() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(SIZE_MEMORY_KEY) || '{}');
      return stored && typeof stored === 'object' ? stored : {};
    } catch (e) {
      return {};
    }
  }

  document.addEventListener('change', function (evt) {
    var input = evt.target;
    if (!evt.isTrusted || !input || input.type !== 'radio' || !input.checked) return;
    var key = input.dataset && input.dataset.optionName;
    if (!key || optionKind(key) !== 'size') return;
    try {
      var memory = readSizeMemory();
      memory[key] = { value: input.value, time: Date.now() };
      window.localStorage.setItem(SIZE_MEMORY_KEY, JSON.stringify(memory));
    } catch (e) {
      // fail open: this choice is just not remembered
    }
  });

  function isLetterSize(value) {
    return LETTER_SIZES.indexOf(normalizeLetterSize(value)) !== -1;
  }

  // A remembered size this product offers: the same size system first, then
  // (for letter sizes) the latest letter size from another system, since tops
  // and bottoms usually share it. Numeric sizes never cross systems: shoe 40
  // says nothing about a numeric clothing size 40.
  function rememberedSize(sizeKey, sizes) {
    var memory = readSizeMemory();
    function offered(value) {
      var normalized = normalizeLetterSize(value);
      return sizes.filter(function (size) {
        return normalizeLetterSize(size) === normalized;
      })[0];
    }
    var own = memory[sizeKey] && offered(memory[sizeKey].value);
    if (own) return own;
    if (!sizes.every(isLetterSize)) return null;
    var others = Object.keys(memory)
      .filter(function (key) {
        return key !== sizeKey && memory[key] && isLetterSize(memory[key].value);
      })
      .sort(function (a, b) {
        return (memory[b].time || 0) - (memory[a].time || 0);
      });
    for (var i = 0; i < others.length; i += 1) {
      var match = offered(memory[others[i]].value);
      if (match) return match;
    }
    return null;
  }

  // A product link in the cart or a wishlist names a size the shopper chose
  // or saved, so the PDP it opens must keep it. The click marks that variant
  // for a minute (localStorage, so a link opened in a new tab counts too).
  var KEEP_VARIANT_KEY = 'ob-pdp-keep-variant';
  var KEEP_LINK_SELECTOR =
    'cart-drawer a[href*="/products/"], cart-items a[href*="/products/"], wishlist-page a[href*="/products/"]';

  function markKeptVariant(evt) {
    var link = evt.target.closest && evt.target.closest(KEEP_LINK_SELECTOR);
    var match = link && link.getAttribute('href').match(/[?&]variant=(\d+)/);
    if (!match) return;
    try {
      window.localStorage.setItem(KEEP_VARIANT_KEY, JSON.stringify({ id: match[1], time: Date.now() }));
    } catch (e) {
      // fail open: the PDP may preselect a size on this visit
    }
  }
  document.addEventListener('click', markKeptVariant, true);
  document.addEventListener('auxclick', markKeptVariant, true);

  function isKeptVariant(variantId) {
    try {
      var kept = JSON.parse(window.localStorage.getItem(KEEP_VARIANT_KEY) || 'null');
      if (!kept || kept.id !== variantId || Date.now() - kept.time > 60000) return false;
      window.localStorage.removeItem(KEEP_VARIANT_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Dawn focuses the changed option after re-rendering the product
  // (product-info.js), which after a preselect nobody clicked shows a
  // keyboard focus ring and can scroll the picker into view. Swallow that
  // one focus call; anything else focuses as usual.
  function skipNextFocusOf(id) {
    var original = HTMLElement.prototype.focus;
    function restore() {
      if (HTMLElement.prototype.focus === guarded) HTMLElement.prototype.focus = original;
    }
    function guarded() {
      if (this.id === id) {
        restore();
        return;
      }
      return original.apply(this, arguments);
    }
    HTMLElement.prototype.focus = guarded;
    window.setTimeout(restore, 5000);
  }

  // Sizes the listing the shopper came from was filtered to (Dawn keeps the
  // facet state in the URL, so a same-origin referrer carries it).
  function filteredSizesFromReferrer() {
    try {
      var referrer = new URL(document.referrer);
      if (referrer.origin !== window.location.origin) return [];
      var sizes = [];
      referrer.searchParams.forEach(function (value, key) {
        if (key.indexOf('available_erp_sizes') !== -1) sizes.push(value);
      });
      return sizes;
    } catch (e) {
      return [];
    }
  }

  // PDP: the size the page opens on, for the colour it opened with.
  // 1. A variant linked from the cart or a wishlist stays as it is.
  // 2. A size the shopper filtered the listing to, when this colour offers
  //    it (the current, explicit intent).
  // 3. The shopper's remembered size, when this colour offers it.
  // 4. Otherwise the middle available size, not Dawn's first available
  //    variant, which follows Akeneo's scrambled order (often XXXXL).
  // The preselect fires an untrusted change, so it is not recorded as a choice.
  function preselectPdpSize() {
    var picker = document.querySelector('product-info[id^="MainProduct-"] variant-selects');
    if (!picker) return;
    var inputs = Array.prototype.filter.call(picker.querySelectorAll('input[type="radio"][data-option-name]'), function (input) {
      return optionKind(input.dataset.optionName) === 'size';
    });
    if (!inputs.length) return;

    var urlVariant = new URLSearchParams(window.location.search).get('variant');
    if (urlVariant && isKeptVariant(urlVariant)) return;

    var offered = sortSizeValues(
      inputs
        .filter(function (input) {
          return !input.disabled && !input.classList.contains('disabled');
        })
        .map(function (input) {
          return input.value;
        })
    );
    if (!offered.length) return;
    var filtered = filteredSizesFromReferrer();
    var offeredFiltered = offered.filter(function (value) {
      return filtered.indexOf(value) !== -1;
    });
    var checked = inputs.filter(function (input) {
      return input.checked;
    })[0];
    if (offeredFiltered.length && checked && offeredFiltered.indexOf(checked.value) !== -1) return;
    var size =
      offeredFiltered[0] ||
      rememberedSize(inputs[0].dataset.optionName, offered) ||
      offered[Math.floor((offered.length - 1) / 2)];

    var target = inputs.filter(function (input) {
      return input.value === size;
    })[0];
    if (!target || target.checked) return;
    skipNextFocusOf(target.id);
    // Not target.click(): the change event a click's activation fires is
    // trusted even when the click was scripted, and would be remembered as
    // the shopper's own choice. Dawn's variant-selects listens for change.
    target.checked = true;
    target.dispatchEvent(new Event('change', { bubbles: true }));
  }

  window.obOptionKind = optionKind;
  window.obSortSizeValues = sortSizeValues;
  window.obRememberedSize = rememberedSize;

  try {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preselectPdpSize);
    else preselectPdpSize();
  } catch (e) {
    // fail open: the PDP keeps Dawn's start variant
  }
})();
