## Context

See proposal.md. Pre-live runs only Shopify's built-in pixels; the storefront is password-protected, so every event before launch is a team click.

## Decisions

**Shopify's customer-events bus, not a direct GA call.** `Shopify.analytics.publish(name, data)` reaches every custom pixel under the shopper's consent, so the theme stays destination-neutral and GDPR handling stays with Shopify. Alternative, gtag in the theme: ties the theme to one tool and bypasses Shopify's consent gate.

**Event names follow GA4 where GA4 has one** (`add_to_wishlist`), so a future forwarding pixel needs no mapping for the main event; the rest use a `wishlist_` prefix.

**Payload:** `handle`, `product_id`, `variant_id`, `sku`, `title`, `variant_title`, `price` (decimal, shop currency), `currency`, `source`, `list_size` (after the action). Sources: where a card heart was clicked (`plp`, `search`, `home`, `pdp_cards`, `other`, from `ShopifyAnalytics.meta.page.pageType`), `pdp` for the PDP button, `favorites` / `cart` for the wishlist surfaces.

**Opt-out per browser.** `?ob_notrack=1` stores `ob-notrack` in localStorage (`?ob_notrack=0` clears it); the theme editor (`Shopify.designMode`) and unpublished-theme previews (`Shopify.theme.role !== 'main'`) never publish. IP filters don't fit a team that works from home and phones.

**Entry origin for the cart property.** Wishlist entries now keep the `source` they were saved from; `_wishlist` carries it (`unknown` for entries saved before this change). Underscore properties are hidden in Dawn's cart and in checkout.

## Risks / Trade-offs

- [Nothing is stored until a pixel forwards the events] → Pre-live has no real shoppers; the GA4 + pixel step is in MIGRATION-TO-LIVE.md for launch.
- [Separate cart lines for the same variant with and without `_wishlist`] → Rare and harmless; quantities still add up at checkout.
