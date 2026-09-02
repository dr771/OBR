/*
 * Cart discount code box — validate-before-checkout, ported from Holster's
 * cart/drawer pattern. Fetches /discount/{code} then re-reads /cart.js to
 * see whether Shopify actually accepted it (discount_codes[].applicable);
 * a valid code redirects straight to checkout with it applied, an invalid
 * one shows an inline error and never redirects.
 *
 * Document-delegated clicks/keydowns: both the cart page (main-cart-footer)
 * and the cart drawer (cart-drawer__footer) replace this box's markup
 * wholesale on every cart AJAX update, so listeners bound to the box itself
 * would go stale — delegation on document survives that. The applied code
 * itself is prefilled server-side via Liquid (cart.discount_codes) on every
 * render, so there is no separate JS prefill step to keep in sync.
 */
(function () {
  'use strict';

  var SPINNER_SVG =
    '<svg class="cart-discount-box__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="47" stroke-dashoffset="15" opacity="0.8"/></svg>';

  function setMessage(box, text, type) {
    var msg = box.querySelector('.cart-discount-box__msg');
    if (!msg) {
      msg = document.createElement('div');
      box.appendChild(msg);
    }
    msg.textContent = text || '';
    msg.className = 'cart-discount-box__msg' + (type ? ' cart-discount-box__msg--' + type : '');
  }

  function setLoading(box, loading) {
    var input = box.querySelector('.cart-discount-box__input');
    var btn = box.querySelector('.cart-discount-box__btn');
    if (!input || !btn) return;
    input.disabled = loading;
    btn.disabled = loading;
    btn.innerHTML = loading ? SPINNER_SVG : box.dataset.discountApplyLabel;
  }

  function applyDiscount(input) {
    var code = input.value.trim();
    if (!code) return;

    var box = input.closest('.cart-discount-box');
    if (!box) return;
    setLoading(box, true);
    setMessage(box, '');

    fetch('/discount/' + encodeURIComponent(code))
      .then(function () {
        return fetch('/cart.js');
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (cart) {
        var match = (cart.discount_codes || []).find(function (discount) {
          return discount.code.toLowerCase() === code.toLowerCase();
        });
        if (match && match.applicable) {
          setMessage(box, box.dataset.discountSuccess, 'success');
          window.location.href = '/discount/' + encodeURIComponent(code) + '?redirect=/checkout';
        } else {
          setMessage(box, box.dataset.discountErrorInvalid, 'error');
          setLoading(box, false);
        }
      })
      .catch(function () {
        setMessage(box, box.dataset.discountErrorGeneric, 'error');
        setLoading(box, false);
      });
  }

  document.addEventListener('click', function (event) {
    var btn = event.target.closest('.cart-discount-box__btn');
    if (!btn) return;
    var box = btn.closest('.cart-discount-box');
    if (box) applyDiscount(box.querySelector('.cart-discount-box__input'));
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    var input = event.target.closest('.cart-discount-box__input');
    if (input) {
      event.preventDefault();
      applyDiscount(input);
    }
  });
})();
