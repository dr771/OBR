## Purpose

Defines what the footer's three link columns and brand column point to — the real Shopify menus, pages, and logo asset that make the footer's links functional rather than placeholder stubs.

## ADDED Requirements

### Requirement: Footer link columns resolve to real navigation menus
The footer section SHALL render three `link_list` blocks, each bound to a distinct Shopify navigation menu (`footer-klantenservice`, `footer-over-ons`, `footer-handige-links`), and every link in those menus SHALL resolve to a real, non-404 destination (an existing Shopify Page, native route, or collection).

#### Scenario: Klantenservice column
- **WHEN** a visitor views the footer's "Klantenservice" column
- **THEN** it SHALL list Contact, Verzending & retour, Maattabellen, and Veelgestelde vragen, each linking to a real page.

#### Scenario: Over ons column
- **WHEN** a visitor views the footer's "Over ons" column
- **THEN** it SHALL list Ons verhaal, Onze merken, Duurzaamheid, and Werken bij, each linking to a real page.

#### Scenario: Handige links column
- **WHEN** a visitor views the footer's "Handige links" column
- **THEN** it SHALL list Mijn account and Bestelling volgen (both routing to the native account page) and Outlet (routing to the Solden collection).

### Requirement: Footer brand column shows the site's real logo and tagline
The footer's `brand_information` block SHALL display the shop's actual logo image (not a blank/empty slot) and a short tagline describing the multi-brand positioning.

#### Scenario: Brand column renders
- **WHEN** a visitor views the footer's brand column
- **THEN** it SHALL show the site logo image and the tagline "Sterke specialisten voor elk moment van je dag. Tien topmerken, slim samengebracht."

### Requirement: Gift cards are intentionally omitted
The footer's Handige links column SHALL NOT include a gift card ("Cadeaubonnen") link until gift cards are deliberately enabled for the shop.

#### Scenario: No gift card link present
- **WHEN** a visitor views the Handige links column
- **THEN** no "Cadeaubonnen" or gift-card link SHALL appear.
