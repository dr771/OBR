/*
  PDP gallery counter ("Afbeelding 3 van 7").

  Dawn's own .slider-counter is driven by SliderComponent and reports *pages*,
  not images — for a 4-up thumbnail rail of 7 images it reads "1 of 4". The
  reference shows the selected image's position out of the total, so the count
  is derived here from the active thumbnail instead.

  media-gallery.js already maintains aria-current on exactly one thumbnail
  button, on both the click path and the slideChanged path, so observing that
  attribute is all that's needed. One document-level observer covers every
  gallery on the page and survives the colour-filtered rail being replaced
  wholesale (product-info.js re-renders it on every colour change).

  Fails open: with no counter element, or no thumbnails, nothing happens.
*/
(function () {
  'use strict';

  var COUNTER = '[data-ob-gallery-count]';
  var queued = false;

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

  function updateAll() {
    queued = false;
    var counters = document.querySelectorAll(COUNTER);
    for (var i = 0; i < counters.length; i++) updateOne(counters[i]);
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
