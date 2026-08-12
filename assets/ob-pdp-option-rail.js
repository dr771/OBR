/* PDP single-row option rail navigation. */
(function () {
  'use strict';

  if (window.obPdpOptionRail) return;
  window.obPdpOptionRail = true;

  var edgeTolerance = 2;

  function updateRail(rail) {
    var shell = rail.closest('.product-form__option-rail-shell');
    if (!shell) return;

    var overflow = rail.scrollWidth - rail.clientWidth > edgeTolerance;
    var atStart = rail.scrollLeft <= edgeTolerance;
    var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - edgeTolerance;

    shell.classList.toggle('is-overflowing', overflow);
    shell.classList.toggle('is-at-start', !overflow || atStart);
    shell.classList.toggle('is-at-end', !overflow || atEnd);
  }

  function revealSelected(rail, behavior) {
    var selected = rail.querySelector('input[type="radio"]:checked + label');
    if (!selected) return;
    selected.scrollIntoView({ behavior: behavior, block: 'nearest', inline: 'nearest' });
  }

  function scrollRail(rail, direction) {
    var firstItem = rail.querySelector('.ob-swatch-input-wrapper, label');
    var styles = window.getComputedStyle(rail);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var itemStep = firstItem ? firstItem.getBoundingClientRect().width + gap : 0;
    var distance = Math.max(itemStep, rail.clientWidth - itemStep);
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    rail.scrollBy({
      left: direction * distance,
      behavior: reduceMotion ? 'auto' : 'smooth',
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

    var shell = rail.closest('.product-form__option-rail-shell');
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
