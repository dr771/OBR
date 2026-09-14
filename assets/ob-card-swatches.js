/*
  PLP card color swatches — hover-persist image swap (plp-card-swatches).

  Hovering, focusing, or clicking a chip selects that color in place: the
  primary image and pressed state change, and the card's normal PDP link is
  retargeted to the matching variant. Chips themselves never navigate.

  Document-level delegation is deliberate — Dawn's facets JS replaces
  #ProductGridContainer wholesale on every filter/sort change, which would
  detach per-element listeners.

  Uses `mouseover` rather than `mouseenter` because only the former bubbles,
  which delegation depends on.
*/
(function () {
  'use strict';

  var hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  /*
    Materialize the active color's SECOND shot as an extra <img> after the
    primary one. Dawn's own `.card-wrapper:hover .media--hover-effect > img + img`
    rule then reveals it on card hover — no CSS of our own needed.

    Client-side only, on first hover: a touch device never fires hover, so it
    never downloads the extra image.
  */
  function ensureHoverImage(card, allowCreate) {
    var media = card.querySelector('.card__media .media');
    if (!media) return;

    var active = card.querySelector('.ob-card-swatch--active');
    var src = active && active.dataset.obSwap2Src;
    var srcset = active && active.dataset.obSwap2Srcset;

    // No active chip means the product has no color swatches at all (single
    // color or none) — fall back to the card's own default second shot,
    // rendered by ob-card-swatches.liquid regardless of the swatch row.
    if (!src) {
      var fallback = card.querySelector('[data-ob-card-default-swap2]');
      if (fallback) {
        src = fallback.dataset.obSwap2Src;
        srcset = fallback.dataset.obSwap2Srcset;
      }
    }

    var others = media.querySelectorAll('img:not(.ob-card-img2)');
    var img1 = others[0];
    var dawnImg2 = others[1];

    // A second <img> we didn't create means the section's own
    // `show_secondary_image` setting is on. It isn't color-aware by default,
    // so reuse it as the swap target instead of leaving it (or duplicating
    // it) — the color-matched shot should win everywhere the same way.
    // Capture its original src/srcset once so colors with no second shot of
    // their own can still fall back to it.
    if (dawnImg2) {
      if (dawnImg2.dataset.obOrigSrc === undefined) {
        dawnImg2.dataset.obOrigSrc = dawnImg2.getAttribute('src') || '';
        dawnImg2.dataset.obOrigSrcset = dawnImg2.getAttribute('srcset') || '';
      }
      var target = src || dawnImg2.dataset.obOrigSrc;
      if (dawnImg2.dataset.obFor !== target) {
        dawnImg2.setAttribute('src', target);
        dawnImg2.setAttribute('srcset', src ? srcset || '' : dawnImg2.dataset.obOrigSrcset);
        dawnImg2.dataset.obFor = target;
      }
      return;
    }

    var img2 = media.querySelector('.ob-card-img2');

    if (!src) {
      if (img2) img2.remove();
      return;
    }

    if (!img2) {
      if (!allowCreate || !hoverMediaQuery.matches) return;
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
      img2.srcset = srcset || '';
      img2.dataset.obFor = src;
    }
  }

  function selectSwatch(swatch) {
    var card = swatch.closest('.card-wrapper');
    if (!card) return;

    var src = swatch.dataset.obSwapSrc;
    if (src) {
      var img = card.querySelector('.card__media img:not(.ob-card-img2)');
      if (img && img.getAttribute('src') !== src) {
        img.setAttribute('src', src);
        img.setAttribute('srcset', swatch.dataset.obSwapSrcset || '');
      }
    }

    card.querySelectorAll('.ob-card-swatch').forEach(function (el) {
      var active = el === swatch;
      el.classList.toggle('ob-card-swatch--active', active);
      el.setAttribute('aria-pressed', String(active));
    });

    if (swatch.dataset.obVariantId) {
      card.querySelectorAll('.card__heading a').forEach(function (link) {
        var url = new URL(link.href, document.baseURI);
        url.searchParams.set('variant', swatch.dataset.obVariantId);
        link.href = url.href;
      });
    }

    // Selection updates a pair that was already created by desktop image
    // hover, but never creates one on touch-only input.
    ensureHoverImage(card, false);
  }

  document.addEventListener('mouseover', function (event) {
    if (!event.target.closest) return;
    var swatch = event.target.closest('.ob-card-swatch');
    if (swatch) {
      selectSwatch(swatch);
      return;
    }

    // Warm the hover image as soon as the pointer enters ANY part of the
    // card (bubbling mouseover fires well before it reaches the photo
    // itself), instead of waiting for the geometric mousemove check below
    // to confirm the cursor is over the media — that check fires only once
    // the user is already basically hovering the image, leaving no lead
    // time for the fetch. Cheap to call repeatedly: guarded by dataset.obFor.
    if (!hoverMediaQuery.matches) return;
    var card = event.target.closest('.card-wrapper');
    if (card) ensureHoverImage(card, true);
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

  // Dawn's stretched heading link owns hit testing over the card image, so
  // `.card__media:hover` is unreliable. Mirror geometric image-area hover as
  // a wrapper class, matching the shipped SB behavior.
  var mediaHoverCard = null;

  function clearMediaHover() {
    if (mediaHoverCard) {
      mediaHoverCard.classList.remove('ob-media-hover');
      mediaHoverCard = null;
    }
  }

  document.addEventListener('mousemove', function (event) {
    if (!hoverMediaQuery.matches) {
      clearMediaHover();
      return;
    }

    // The .ob-media-hover class this sets is what actually reveals img2 (see
    // component-ob-swatches.css) — so it must fire whenever the card has ANY
    // hover-image source, not only when it has a color-swatch row. A
    // single/no-color card carries no [data-ob-card-swatches] but still gets
    // a [data-ob-card-default-swap2] holder from ob-card-swatches.liquid;
    // gating on the swatch row alone left those cards' img2 permanently at
    // opacity 0 even after it was correctly created.
    var card = event.target.closest && event.target.closest('.card-wrapper');
    if (
      !card ||
      !(card.querySelector('[data-ob-card-swatches]') || card.querySelector('[data-ob-card-default-swap2]'))
    ) {
      clearMediaHover();
      return;
    }

    var media = card.querySelector('.card__media');
    if (!media) {
      clearMediaHover();
      return;
    }

    var rect = media.getBoundingClientRect();
    var inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      if (mediaHoverCard === card) clearMediaHover();
      return;
    }

    if (mediaHoverCard === card) return;
    clearMediaHover();
    ensureHoverImage(card, true);
    card.classList.add('ob-media-hover');
    mediaHoverCard = card;
  });

  document.addEventListener('mouseleave', clearMediaHover);

  document.addEventListener('click', function (event) {
    if (!event.target.closest) return;
    var swatch = event.target.closest('.ob-card-swatch');
    if (swatch) selectSwatch(swatch);
  });
})();
