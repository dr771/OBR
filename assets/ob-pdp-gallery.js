/*
  PDP gallery counter ("Afbeelding 3 van 7") and chevron-overflow correction.

  Dawn's own .slider-counter is driven by SliderComponent and reports *pages*,
  not images — for a 4-up thumbnail rail of 7 images it reads "1 of 4". The
  reference shows the selected image's position out of the total, so the count
  is derived here from the active thumbnail instead.

  media-gallery.js already maintains aria-current on exactly one thumbnail
  button, on both the click path and the slideChanged path, so observing that
  attribute is all that's needed. One document-level observer covers every
  gallery on the page and survives the colour-filtered rail being replaced
  wholesale (product-info.js re-renders it on every colour change).

  component-ob-pdp.css hides the chevrons once SliderComponent has disabled
  both prev/next — but SliderComponent's own isSlideVisible() sums each
  thumbnail's offsetLeft + clientWidth (both rounded) and compares against the
  rail's clientWidth, so an exactly-filling rail (e.g. 4 images on the 4-up
  desktop rail) can land 1px over due to subpixel rounding and never get
  marked disabled — chevrons that navigate nowhere reappear. Recheck the real
  scrollWidth vs. clientWidth with a tolerance and force both buttons disabled
  when there's nothing to scroll; genuine overflow is left to SliderComponent.

  Fails open: with no counter element, or no thumbnails, nothing happens.
*/
(function () {
  'use strict';

  var COUNTER = '[data-ob-gallery-count]';
  var CHEVRON_OVERFLOW_TOLERANCE = 1;
  var queued = false;
  var chevronResizeObserver = null;

  /*
    The server-rendered string is the format source, so the phrasing stays in
    the locale files rather than being rebuilt here. Cache it per element on
    first read — the rendered index is the first number in the string.
  */
  function template(el) {
    if (!el.dataset.obGalleryTemplate) {
      el.dataset.obGalleryTemplate = (el.textContent || '').trim().replace(/\d+/, '{index}');
    }
    return el.dataset.obGalleryTemplate;
  }

  function updateOne(counter) {
    var shell = counter.closest('[id^="GalleryThumbnails"]');
    if (!shell) return;

    var items = shell.querySelectorAll('.thumbnail-list__item');
    if (!items.length) return;

    var index = 1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].querySelector('button[aria-current="true"]')) {
        index = i + 1;
        break;
      }
    }

    var next = template(counter).replace('{index}', index);
    if (counter.textContent !== next) counter.textContent = next;
  }

  function updateChevronsOne(shell) {
    var slider = shell.querySelector('[id^="Slider-"]');
    var prev = shell.querySelector('.ob-pdp__gallery-chevrons .slider-button--prev');
    var next = shell.querySelector('.ob-pdp__gallery-chevrons .slider-button--next');
    if (!slider || !prev || !next) return;

    var overflowing = slider.scrollWidth - slider.clientWidth > CHEVRON_OVERFLOW_TOLERANCE;
    if (!overflowing) {
      prev.setAttribute('disabled', 'disabled');
      next.setAttribute('disabled', 'disabled');
    }
  }

  function updateChevronsAll() {
    var shells = document.querySelectorAll('.thumbnail-slider');
    for (var i = 0; i < shells.length; i++) updateChevronsOne(shells[i]);
  }

  function observeChevronResize() {
    if (!('ResizeObserver' in window)) return;
    if (!chevronResizeObserver) chevronResizeObserver = new ResizeObserver(schedule);

    var sliders = document.querySelectorAll('.thumbnail-slider [id^="Slider-"]');
    for (var i = 0; i < sliders.length; i++) chevronResizeObserver.observe(sliders[i]);
  }

  function updateAll() {
    queued = false;
    var counters = document.querySelectorAll(COUNTER);
    for (var i = 0; i < counters.length; i++) updateOne(counters[i]);
    updateChevronsAll();
    observeChevronResize();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(updateAll);
  }

  function start() {
    updateAll();

    /*
      attributeFilter keeps this cheap: it fires on aria-current flips, not on
      every DOM change. childList is needed too, because a replaced rail
      arrives with aria-current already set server-side and so produces no
      attribute mutation of its own. Both are coalesced into one rAF.
    */
    new MutationObserver(schedule).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-current'],
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
