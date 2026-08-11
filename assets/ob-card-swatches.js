/*
  PLP card color swatches — hover-persist image swap (plp-card-swatches).

  Hovering or focusing a chip swaps the card's primary image to that color and
  marks the chip active; the swap persists after the pointer leaves (so a
  shopper can sweep the row to compare colorways).

  Progressive enhancement only: the chips are real <a> links to their variant,
  so with JS off they still navigate. Document-level delegation is used
  deliberately — Dawn's facets JS replaces #ProductGridContainer wholesale on
  every filter/sort change, which would detach any per-element listeners.

  Uses `mouseover` rather than `mouseenter` because only the former bubbles,
  which delegation depends on.
*/
(function () {
  'use strict';

  /*
    Materialize the active color's SECOND shot as an extra <img> after the
    primary one. Dawn's own `.card-wrapper:hover .media--hover-effect > img + img`
    rule then reveals it on card hover — no CSS of our own needed.

    Client-side only, on first hover: a touch device never fires hover, so it
    never downloads the extra image.
  */
  function ensureHoverImage(card) {
    var media = card.querySelector('.card__media .media');
    if (!media) return;

    // A second <img> we didn't create means the section's own
    // `show_secondary_image` setting is on. That one isn't color-aware, but
    // it's the merchant's explicit choice — leave it alone.
    if (media.querySelectorAll('img:not(.ob-card-img2)').length > 1) return;

    var active = card.querySelector('.ob-card-swatch--active');
    var img2 = media.querySelector('.ob-card-img2');
    var src = active && active.dataset.obSwap2Src;

    if (!src) {
      if (img2) img2.remove();
      return;
    }

    if (!img2) {
      var img1 = media.querySelector('img');
      if (!img1) return;
      img2 = document.createElement('img');
      img2.className = 'ob-card-img2 motion-reduce';
      img2.alt = '';
      img2.setAttribute('aria-hidden', 'true');
      ['width', 'height', 'sizes'].forEach(function (attr) {
        if (img1.getAttribute(attr)) img2.setAttribute(attr, img1.getAttribute(attr));
      });
      img1.insertAdjacentElement('afterend', img2);
    }

    if (img2.dataset.obFor !== src) {
      img2.src = src;
      img2.srcset = active.dataset.obSwap2Srcset || '';
      img2.dataset.obFor = src;
    }
  }

  function selectSwatch(swatch) {
    var card = swatch.closest('.card-wrapper');
    if (!card) return;

    var src = swatch.dataset.obSwapSrc;
    if (src) {
      var img = card.querySelector('.card__media img');
      if (img && img.getAttribute('src') !== src) {
        img.setAttribute('src', src);
        img.setAttribute('srcset', swatch.dataset.obSwapSrcset || '');
      }
    }

    card.querySelectorAll('.ob-card-swatch').forEach(function (el) {
      el.classList.toggle('ob-card-swatch--active', el === swatch);
    });

    ensureHoverImage(card);
  }

  document.addEventListener('mouseover', function (event) {
    if (!event.target.closest) return;
    var swatch = event.target.closest('.ob-card-swatch');
    if (swatch) {
      selectSwatch(swatch);
      return;
    }
    // Hovering anywhere else in a card: lazily put the current color's pair in
    // place. Cheap to repeat — the dataset.obFor guard makes it a no-op once set.
    var card = event.target.closest('.card-wrapper');
    if (card && card.querySelector('.ob-card-swatches')) ensureHoverImage(card);
  });

  document.addEventListener(
    'focusin',
    function (event) {
      if (!event.target.closest) return;
      var swatch = event.target.closest('.ob-card-swatch');
      if (swatch) selectSwatch(swatch);
    },
    true
  );
})();
