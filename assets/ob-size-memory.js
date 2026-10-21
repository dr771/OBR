/*
 * Shopper size memory and size ordering, shared by the PDP and the wishlist
 * surfaces (ob-wishlist.js, ob-wishlist-page-rails.js). Loaded on every page,
 * before ob-wishlist.js.
 */
(function () {
  'use strict';

  // Size values in storefront order, the JS twin of ob-option-value-order:
  // all-numeric values (EU shoe sizes) ascending, letter sizes in semantic
  // order (XXXL reads as 3XL), anything unrecognised appended in source order.
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
    var numeric =
      values.length > 0 &&
      values.every(function (value) {
        return /^\d+([.,]\d+)?$/.test(String(value).trim());
      });
    function rank(value) {
      if (numeric) return parseFloat(String(value).trim().replace(',', '.'));
      var index = LETTER_SIZES.indexOf(normalizeLetterSize(value));
      return index === -1 ? Infinity : index;
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

  // PDP: open on the shopper's remembered size. Runs once on load for the
  // main product picker, on the colour the page opened with (?variant= or
  // Dawn's default). Without a remembered size, or when this colour doesn't
  // offer it available, Dawn's own start variant stays. The click is
  // untrusted, so it is not recorded as a choice itself.
  function preselectPdpSize() {
    var picker = document.querySelector('product-info[id^="MainProduct-"] variant-selects');
    if (!picker) return;
    var inputs = Array.prototype.filter.call(picker.querySelectorAll('input[type="radio"][data-option-name]'), function (input) {
      return optionKind(input.dataset.optionName) === 'size';
    });
    if (!inputs.length) return;
    var offered = inputs
      .filter(function (input) {
        return !input.disabled && !input.classList.contains('disabled');
      })
      .map(function (input) {
        return input.value;
      });
    var size = rememberedSize(inputs[0].dataset.optionName, offered);
    var target = size
      ? inputs.filter(function (input) {
          return input.value === size;
        })[0]
      : null;
    if (target && !target.checked) target.click();
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
