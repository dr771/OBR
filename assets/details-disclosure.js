class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.summary = this.mainDetailsToggle.querySelector('summary');
    this.hoverQuery = window.matchMedia('(min-width: 990px) and (hover: hover) and (pointer: fine)');
    this.hoverCloseTimeout = null;

    this.addEventListener('pointerenter', this.onPointerEnter.bind(this));
    this.addEventListener('pointerleave', this.onPointerLeave.bind(this));
    this.summary.addEventListener('click', this.onSummaryClick.bind(this));
  }

  onPointerEnter(event) {
    if (!this.hoverQuery.matches || event.pointerType === 'touch') return;

    window.clearTimeout(this.hoverCloseTimeout);
    this.header
      ?.querySelectorAll('header-menu')
      .forEach((menu) => menu !== this && menu.close());
    this.mainDetailsToggle.setAttribute('open', '');
    this.summary.setAttribute('aria-expanded', true);
  }

  onPointerLeave(event) {
    if (!this.hoverQuery.matches || event.pointerType === 'touch') return;

    window.clearTimeout(this.hoverCloseTimeout);
    this.hoverCloseTimeout = window.setTimeout(() => this.close(), 120);
  }

  onSummaryClick(event) {
    if (this.hoverQuery.matches && event.detail > 0) event.preventDefault();
  }

  onToggle() {
    this.summary.setAttribute('aria-expanded', this.mainDetailsToggle.open);

    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
