# Original Brands — Shopify Theme

Liquid theme for Original Brands (www.originalbrands.nl), based on [Dawn](https://github.com/Shopify/dawn). Live on `original-brands-live.myshopify.com`, theme `209721262417`; `original-brands-dev.myshopify.com` is the test shop. Deploy rules: CLAUDE.md → Shopify CLI.

See `MIXED-SHOPS-PLAYBOOK.md` for the decisions and `SHOP-SETUP.md` for what the theme needs from the shop. The pre-Shopify static homepage mockup lives in `mockup/` for reference.

## Deploy

```
scripts/theme-push.sh --dev <file> [<file> ...]   # DEV first
scripts/theme-push.sh <file> [<file> ...]         # then the live theme, committed files only. Never a raw `shopify theme push` (CLAUDE.md)
```

`shopify theme dev` and preview themes are not the verification loop here (CLAUDE.md).
