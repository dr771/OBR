/*
  PDP color-chip tooltip. A CSS ::before/::after tooltip (the pattern used by
  the PLP card swatches) gets clipped when the chip sits inside the option
  rail's horizontally-scrolling track, which sets overflow-y: hidden so only
  one row is ever visible (see component-ob-option-rail.css). This positions
  one shared tooltip node with `position: fixed`, which escapes that clip,
  and works the same whether or not the rail variation is enabled.
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

  document.addEventListener('mouseover', (event) => {
    const label = event.target.closest('.ob-swatch-input__label[data-ob-swatch-name]');
    if (label) show(label);
  });

  document.addEventListener('mouseout', (event) => {
    const label = event.target.closest('.ob-swatch-input__label[data-ob-swatch-name]');
    if (label && !label.contains(event.relatedTarget)) hide();
  });

  document.addEventListener(
    'focusin',
    (event) => {
      const radio = event.target.closest('.ob-swatch-input__radio');
      const label = radio?.nextElementSibling?.matches('.ob-swatch-input__label[data-ob-swatch-name]')
        ? radio.nextElementSibling
        : null;
      if (label) show(label);
    },
    true
  );

  document.addEventListener(
    'focusout',
    (event) => {
      const radio = event.target.closest('.ob-swatch-input__radio');
      if (radio) hide();
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
