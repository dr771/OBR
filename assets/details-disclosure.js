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
    this.submenus = Array.from(this.mainDetailsToggle.querySelectorAll('details'));
    this.submenuCloseTimeouts = new Map();

    this.submenus.forEach((details) => {
      const summary = details.querySelector('summary');
      // The row's link sits beside the details, so hover is tracked on their shared wrapper.
      const hoverTarget = details.closest('.header__submenu-parent') || details;
      hoverTarget.addEventListener('pointerenter', (event) => {
        if (!this.hoverQuery.matches || event.pointerType === 'touch') return;
        window.clearTimeout(this.submenuCloseTimeouts.get(details));
        this.submenus.forEach((other) => other !== details && this.closeSubmenu(other));
        details.open = true;
        this.fitFlyout(details);
        summary.setAttribute('aria-expanded', true);
      });
      hoverTarget.addEventListener('pointerleave', (event) => {
        if (!this.hoverQuery.matches || event.pointerType === 'touch') return;
        window.clearTimeout(this.submenuCloseTimeouts.get(details));
        this.submenuCloseTimeouts.set(details, window.setTimeout(() => this.closeSubmenu(details), 120));
      });
      details.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', details.open);
        if (details.open) this.fitFlyout(details);
      });
      details.addEventListener('focusout', () => {
        window.setTimeout(() => {
          if (!details.contains(document.activeElement) && !hoverTarget.matches(':hover')) this.closeSubmenu(details);
        });
      });
      summary.addEventListener('click', (event) => {
        if (this.hoverQuery.matches && event.detail > 0) {
          event.preventDefault();
          summary.setAttribute('aria-expanded', details.open);
        }
      });
    });
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
    if (this.hoverQuery.matches && event.detail > 0) {
      event.preventDefault();
      this.summary.setAttribute('aria-expanded', this.mainDetailsToggle.open);
    }
  }

  closeSubmenu(details) {
    window.clearTimeout(this.submenuCloseTimeouts.get(details));
    this.submenuCloseTimeouts.delete(details);
    details.open = false;
    details.querySelector('summary').setAttribute('aria-expanded', false);
  }

  fitFlyout(details) {
    if (!this.matches('.header__dropdown-menu') || !window.matchMedia('(min-width: 990px)').matches) return;
    details.removeAttribute('data-opens-left');
    const flyout = details.querySelector('ul');
    details.toggleAttribute('data-opens-left', flyout.getBoundingClientRect().right > document.documentElement.clientWidth);
  }

  close() {
    window.clearTimeout(this.hoverCloseTimeout);
    this.submenus.forEach((details) => this.closeSubmenu(details));
    super.close();
  }

  onToggle() {
    this.summary.setAttribute('aria-expanded', this.mainDetailsToggle.open);
    if (this.mainDetailsToggle.open) this.submenus.forEach((details) => this.fitFlyout(details));
    if (!this.mainDetailsToggle.open) this.submenus.forEach((details) => this.closeSubmenu(details));

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
