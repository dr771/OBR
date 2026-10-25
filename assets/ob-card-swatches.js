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

  if (window.obCardSwatchesReady) return;
  window.obCardSwatchesReady = true;

  var hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  /*
    Point a hover image at a new source and re-arm its reveal gate: the
    image only counts as ready (data-ob-ready, which component-ob-swatches.css
    requires before it hides the primary) once it has loaded AND decoded.
    Without the gate the primary vanished at once and the bare tile showed
    for the whole fetch + decode (~0.7 s measured on the PLP).
  */
  function setHoverSource(img, key, src, srcset) {
    img.removeAttribute('data-ob-ready');
    img.dataset.obFor = key;
    img.setAttribute('srcset', srcset);
    img.setAttribute('src', src);
    if (!img.decode) {
      img.setAttribute('data-ob-ready', '');
      return;
    }
    // A rejection (failed load, or src changed mid-decode) leaves the gate
    // closed; the primary simply stays visible.
    img.decode().then(
      function () {
        if (img.dataset.obFor === key) img.setAttribute('data-ob-ready', '');
      },
      function () {}
    );
  }

  /*
    Materialize the active color's SECOND shot as an extra <img> after the
    primary one; .ob-media-hover (below) reveals it once it is ready.

    Client-side only and only on hover-capable input — warmed ahead as a
    lazy image by warmCards(), or on first hover — so a touch-only device
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
        setHoverSource(dawnImg2, target, target, src ? srcset || '' : dawnImg2.dataset.obOrigSrcset);
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
      // Lazy: a card warmed while still below the fold fetches its second
      // shot only as it nears the viewport. An on-screen card loads at once.
      img2.loading = 'lazy';
      ['width', 'height', 'sizes'].forEach(function (attr) {
        if (img1.getAttribute(attr)) img2.setAttribute(attr, img1.getAttribute(attr));
      });
      img1.insertAdjacentElement('afterend', img2);
    }

    if (img2.dataset.obFor !== src) {
      setHoverSource(img2, src, src, srcset || '');
    }
  }

  /*
    Warm every card's hover image before the first hover, so it is already
    decoded when the pointer reaches the photo. The image is created lazy, so
    the browser fetches it only as the card nears the viewport. Runs only on
    hover-capable input, and only after `load` plus an idle slot, so it never
    competes with the page's own first images. A MutationObserver rescans
    because facets, load-more and recommendations insert cards later. It
    watches childList only, so the marker attribute set here doesn't
    retrigger it.
  */
  var warmTimer = null;

  function warmCards() {
    warmTimer = null;
    if (!hoverMediaQuery.matches) return;
    document.querySelectorAll('.card-wrapper:not([data-ob-hover-warm])').forEach(function (card) {
      card.setAttribute('data-ob-hover-warm', '');
      ensureHoverImage(card, true);
    });
  }

  function startWarming() {
    new MutationObserver(function () {
      if (!warmTimer) warmTimer = setTimeout(warmCards, 150);
    }).observe(document.documentElement, { childList: true, subtree: true });
    warmCards();
  }

  function whenIdle(fn) {
    if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 200);
  }

  if (document.readyState === 'complete') {
    whenIdle(startWarming);
  } else {
    window.addEventListener(
      'load',
      function () {
        whenIdle(startWarming);
      },
      { once: true }
    );
  }

  /*
    Fetch every other color's primary shot as soon as the pointer enters a
    card, so a chip swap comes from the browser's image cache instead of
    waiting on the network for each color. It uses the card image's own
    `sizes`, so the browser picks the same srcset candidate the swap will
    request. Triggered by pointer intent only: nothing is fetched on page load
    or on touch-only input.
  */
  function warmSwatchImages(card) {
    if (card.hasAttribute('data-ob-chips-warm')) return;
    card.setAttribute('data-ob-chips-warm', '');
    var img1 = card.querySelector('.card__media img:not(.ob-card-img2)');
    var sizes = img1 && img1.getAttribute('sizes');
    card.querySelectorAll('.ob-card-swatch[data-ob-swap-src]:not(.ob-card-swatch--active)').forEach(function (swatch) {
      var img = new Image();
      if (sizes) img.sizes = sizes;
      img.srcset = swatch.dataset.obSwapSrcset || '';
      img.src = swatch.dataset.obSwapSrc;
    });
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

    // The sale badge belongs to the shown color: a product reduced in only
    // some colors renders it (possibly hidden) and each reduced chip carries
    // its own label. Cards with no reduction have no such badge — a no-op.
    // The translated "up to" prefix rides on the badge as a data attribute and
    // is only written for a color whose sizes are reduced by different
    // amounts. A hidden badge is emptied, not just hidden: the product link
    // names it via aria-labelledby, which reads hidden text too.
    var saleLabel = swatch.dataset.obSaleLabel || '';
    var saleRange = !!saleLabel && swatch.hasAttribute('data-ob-sale-range');
    card.querySelectorAll('.card__badge .badge--sale').forEach(function (badge) {
      badge.hidden = !saleLabel;
      var value = badge.querySelector('.ob-sale-badge__value');
      var prefix = badge.querySelector('.ob-sale-badge__prefix');
      if (value) value.textContent = saleLabel;
      if (prefix) {
        prefix.hidden = !saleRange;
        prefix.textContent = saleRange ? badge.dataset.obSalePrefix || '' : '';
      }
    });

    // Selection updates a pair that was already created by desktop image
    // hover, but never creates one on touch-only input.
    ensureHoverImage(card, false);
  }

  document.addEventListener('mouseover', function (event) {
    if (!event.target.closest) return;
    var swatch = event.target.closest('.ob-card-swatch');
    // Select first, so the hover image warmed below is already the new
    // color's rather than the old one's.
    if (swatch) selectSwatch(swatch);

    // Warm the hover image and the other colors' shots as soon as the
    // pointer enters ANY part of the card (bubbling mouseover fires well
    // before it reaches the photo itself), instead of waiting for the
    // geometric mousemove check below to confirm the cursor is over the
    // media — that check fires only once the user is already basically
    // hovering the image, leaving no lead time for the fetch. Cheap to call
    // repeatedly: guarded by dataset.obFor and data-ob-chips-warm.
    if (!hoverMediaQuery.matches) return;
    var card = event.target.closest('.card-wrapper');
    if (!card) return;
    warmSwatchImages(card);
    ensureHoverImage(card, true);
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
