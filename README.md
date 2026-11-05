# Original Brands — Shopify Theme

Liquid theme for Original Brands, based on [Dawn](https://github.com/Shopify/dawn). Works against the pre-live shop `original-brands-live.myshopify.com` (theme `209721262417`); `original-brands-dev.myshopify.com` is the test shop. Deploy rules: CLAUDE.md → Shopify CLI.

See `MIXED-SHOPS-PLAYBOOK.md` for scoping decisions and reuse notes (shared with the Only Brands project). The pre-Shopify static homepage mockup lives in `mockup/` for reference.

## Local dev

```
scripts/theme-push.sh <file> [<file> ...]   # pre-live; --dev first for DEV. Never a raw `shopify theme push` (CLAUDE.md)
```

`shopify theme dev` and preview themes are not the verification loop here (CLAUDE.md).
