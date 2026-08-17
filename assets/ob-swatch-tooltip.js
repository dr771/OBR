/*
  Shared color-chip tooltip for both surfaces: the PDP option chips
  (.ob-swatch-input__label) and the PLP card chips (.ob-card-swatch).

  A chip-anchored CSS ::before/::after tooltip gets clipped on both, because
  each chip row is a horizontally-scrolling rail and a scroll track's
  overflow-y is never visible. This positions one shared tooltip node with
  `position: fixed`, which escapes that clip, and works the same whether or not
  the PDP rail variation is enabled.
*/
document.addEventListener('DOMContentLoaded', () => {
  let tooltip = null;
  let activeLabel = null;

  function getTooltip() {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'ob-swatch-tooltip';
      tooltip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function show(label) {
    const name = label.dataset.obSwatchName;
    if (!name) return;
    activeLabel = label;
    const el = getTooltip();
    el.textContent = name;
    position(label);
    el.classList.add('ob-swatch-tooltip--visible');
  }

  function position(label) {
    if (!tooltip) return;
    const rect = label.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 8}px`;
  }

  function hide() {
    activeLabel = null;
    if (tooltip) tooltip.classList.remove('ob-swatch-tooltip--visible');
  }

  // PDP chip: a label next to a hidden radio. PLP card chip: a button that is
  // itself the anchor and the focus target.
  const anchorSelector = '.ob-swatch-input__label[data-ob-swatch-name], .ob-card-swatch[data-ob-swatch-name]';

  function anchorFrom(target) {
    if (!target || !target.closest) return null;
    const anchor = target.closest(anchorSelector);
    if (anchor) return anchor;

    const radio = target.closest('.ob-swatch-input__radio');
    const label = radio?.nextElementSibling;
    return label?.matches('.ob-swatch-input__label[data-ob-swatch-name]') ? label : null;
  }

  document.addEventListener('mouseover', (event) => {
    const anchor = anchorFrom(event.target);
    if (anchor) show(anchor);
  });

  document.addEventListener('mouseout', (event) => {
    const anchor = anchorFrom(event.target);
    if (anchor && !anchor.contains(event.relatedTarget)) hide();
  });

  document.addEventListener(
    'focusin',
    (event) => {
      const anchor = anchorFrom(event.target);
      if (anchor) show(anchor);
    },
    true
  );

  document.addEventListener(
    'focusout',
    (event) => {
      if (anchorFrom(event.target)) hide();
    },
    true
  );

  window.addEventListener(
    'scroll',
    () => {
      if (activeLabel) position(activeLabel);
    },
    true
  );
});
