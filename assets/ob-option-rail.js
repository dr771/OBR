/*
  Shared single-row rail navigation: overflow detection, edge-cue state, and
  chevron scrolling. Used by the PDP colour/size option rails
  (component-ob-option-rail.css) and by the PLP card colour chips
  (component-ob-swatches.css).

  A rail is `[data-ob-option-rail]` inside a `[data-ob-option-rail-shell]`; the
  shell carries the `is-overflowing` / `is-at-start` / `is-at-end` classes each
  surface styles its own fades and chevrons from.
*/
(function () {
  'use strict';

  if (window.obOptionRail) return;
  window.obOptionRail = true;

  var edgeTolerance = 2;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function updateRail(rail) {
    var shell = rail.closest('[data-ob-option-rail-shell]');
    if (!shell) return;

    var overflow = rail.scrollWidth - rail.clientWidth > edgeTolerance;
    var atStart = rail.scrollLeft <= edgeTolerance;
    var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - edgeTolerance;

    shell.classList.toggle('is-overflowing', overflow);
    shell.classList.toggle('is-at-start', !overflow || atStart);
    shell.classList.toggle('is-at-end', !overflow || atEnd);
  }

  /*
    Horizontal-only reveal. `scrollIntoView` would also scroll the *page* to a
    rail that sits below the fold, which is fine for the single PDP rail but
    would yank the viewport around on a grid initialising 18 card rails at once.
  */
  function revealSelected(rail, behavior) {
    var selected =
      rail.querySelector('input[type="radio"]:checked + label') || rail.querySelector('.ob-card-swatch--active');
    if (!selected) return;

    var railBox = rail.getBoundingClientRect();
    var itemBox = selected.getBoundingClientRect();
    var delta = 0;

    if (itemBox.left < railBox.left) {
      delta = itemBox.left - railBox.left;
    } else if (itemBox.right > railBox.right) {
      delta = itemBox.right - railBox.right;
    }

    if (!delta) return;
    rail.scrollBy({ left: delta, behavior: prefersReducedMotion() ? 'auto' : behavior });
  }

  function scrollRail(rail, direction) {
    var firstItem = rail.querySelector('.ob-swatch-input-wrapper, .ob-card-swatch, label');
    var styles = window.getComputedStyle(rail);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var itemStep = firstItem ? firstItem.getBoundingClientRect().width + gap : 0;
    /*
      `step="item"` advances one choice at a time. On a card that is the point:
      a page-sized jump replaces the whole chip row between glances and the
      shopper loses their place. Rails without the attribute keep the
      near-full-width jump.
    */
    var distance =
      rail.dataset.obOptionRailStep === 'item' ? itemStep : Math.max(itemStep, rail.clientWidth - itemStep);

    rail.scrollBy({
      left: direction * distance,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  function setupRail(rail) {
    if (rail.dataset.obRailReady) return;
    rail.dataset.obRailReady = 'true';

    rail.addEventListener(
      'scroll',
      function () {
        updateRail(rail);
      },
      { passive: true }
    );

    rail.addEventListener('change', function () {
      requestAnimationFrame(function () {
        revealSelected(rail, 'smooth');
        updateRail(rail);
      });
    });

    var shell = rail.closest('[data-ob-option-rail-shell]');
    var previousButton = shell && shell.querySelector('[data-ob-option-rail-previous]');
    var nextButton = shell && shell.querySelector('[data-ob-option-rail-next]');

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        scrollRail(rail, -1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        scrollRail(rail, 1);
      });
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        updateRail(rail);
      }).observe(rail);
    }

    revealSelected(rail, 'auto');
    updateRail(rail);
  }

  function setupAll(root) {
    if (root.matches && root.matches('[data-ob-option-rail]')) setupRail(root);
    if (root.querySelectorAll) root.querySelectorAll('[data-ob-option-rail]').forEach(setupRail);
  }

  setupAll(document);

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) setupAll(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
