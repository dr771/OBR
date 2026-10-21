(() => {
  const selector = 'shopify-forms-embed[id^="app-embed-container-"]';
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    :host {
      position: relative;
      z-index: 8;
    }

    [data-current-step="tease"][data-position="bottom-right"] {
      right: 70px !important;
      bottom: calc(var(--ob-scroll-top-bottom, 1.5rem) + 2.2rem) !important;
      transform: translateY(50%) !important;
      padding-block: 0 !important;
      max-width: calc(100vw - 70px);
      box-sizing: border-box;
    }

    button[data-testid="form-teaser"] {
      padding: 5px 14px;
      border: 1px solid #38b6ff47;
    }

    [data-testid="form-teaser"] h3 {
      font-family: var(--font-body-family, Inter, sans-serif);
      font-size-adjust: from-font;
      font-size: calc(var(--heading-font-size) * 0.55);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
      color: #0d80c4;
    }
  `);

  const styleEmbed = (embed) => {
    const root = embed.shadowRoot;
    if (root && !root.adoptedStyleSheets.includes(sheet)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    }
  };

  customElements.whenDefined('shopify-forms-embed').then(() => {
    document.querySelectorAll(selector).forEach(styleEmbed);
    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(selector)) styleEmbed(node);
          node.querySelectorAll(selector).forEach(styleEmbed);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
