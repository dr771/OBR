/*
  PDP size-guide dialog open/close.

  Document-level delegation, because product-info.js re-renders the variant
  picker (and with it the trigger) on every variant change — a direct listener
  bound at load would be lost on the first colour switch.

  Uses the native <dialog> so Esc-to-close and focus trapping come for free;
  `closedby="any"` handles light-dismiss where supported, and the backdrop
  click below is the fallback for browsers that don't.
*/
(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-ob-size-chart-open]');
    if (opener) {
      var dialog = document.getElementById(opener.getAttribute('data-ob-size-chart-open'));
      if (dialog && typeof dialog.showModal === 'function') {
        event.preventDefault();
        dialog.showModal();
      }
      return;
    }

    if (event.target.closest('[data-ob-size-chart-close]')) {
      var owner = event.target.closest('dialog');
      if (owner) owner.close();
      return;
    }

    // Backdrop click: the event target is the <dialog> itself only when the
    // click landed outside its content box.
    if (event.target.tagName === 'DIALOG' && event.target.classList.contains('ob-size-chart')) {
      var rect = event.target.getBoundingClientRect();
      var inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) event.target.close();
    }
  });
})();
