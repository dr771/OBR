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
      max-width: calc(100vw - 70px);
      box-sizing: border-box;
    }

    [data-testid="form-teaser"] h3 {
      font-family: var(--font-body-family, Inter, sans-serif);
      font-size-adjust: from-font;
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
