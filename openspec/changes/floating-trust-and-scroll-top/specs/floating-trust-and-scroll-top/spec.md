## Purpose

Show the shop's Trusted Shops trustbadge and a scroll-to-top control on every storefront page. Neither may obstruct the purchase controls, the overlays or each other.

## ADDED Requirements

### Requirement: Trustbadge stacks above the scroll-to-top control
The storefront SHALL show the Trusted Shops trustbadge for the shop's Trusted Shops ID. The scroll-to-top control SHALL be anchored to the bottom-right corner, and the trustbadge SHALL sit at the right edge above it, with the right edges of both aligned. A bottom-left badge covered the left edge of the page content. The two boxes SHALL NOT intersect at any viewport width. The trustbadge SHALL NOT be injected while the page is rendered inside the theme editor.

#### Scenario: Shopper views any page after scrolling
- **WHEN** a storefront page has loaded and the shopper has scrolled further than about one viewport height
- **THEN** the scroll-to-top control is in the bottom-right corner, the trustbadge is above it at the same right edge, and their boxes do not intersect

### Requirement: Mobile trustbadge waits for the scroll-to-top control
On viewports where the trustbadge uses its mobile layout, the trustbadge SHALL be hidden while the scroll-to-top control is hidden, so it does not cover the first viewport (where the home hero already shows the Trusted Shops logo). The widget's own mobile fadeout SHALL stay disabled, because it hides the badge once the page scrolls.

#### Scenario: Mobile shopper on the first viewport
- **WHEN** a shopper on a narrow viewport has scrolled less than about one viewport height
- **THEN** neither the trustbadge nor the scroll-to-top control is visible

#### Scenario: Mobile shopper scrolls down
- **WHEN** the shopper scrolls further than about one viewport height
- **THEN** the scroll-to-top control and the trustbadge above it both appear and stay visible while scrolling

### Requirement: Floating elements stay clear of fixed bottom bars
On viewports where the PDP mobile purchase bar or the stuck cart-page checkout dock is shown, the trustbadge and the scroll-to-top control SHALL both sit above that bar, so neither covers its buttons.

#### Scenario: Mobile product page
- **WHEN** a shopper scrolls a product page on a narrow viewport while the purchase bar is fixed at the bottom
- **THEN** the trustbadge and the scroll-to-top control are positioned above the bar and do not intersect it

#### Scenario: Tablet width with a fixed bar
- **WHEN** the viewport is wide enough for the trustbadge's desktop layout but the PDP purchase bar or the stuck cart dock is still fixed at the bottom
- **THEN** the trustbadge is hidden rather than overlapping the bar or the lifted scroll-to-top control

#### Scenario: Mobile cart page with stuck checkout dock
- **WHEN** the cart-page checkout dock is fixed at the bottom on a narrow viewport
- **THEN** the scroll-to-top control is positioned above the dock and does not intersect it

### Requirement: Floating elements never cover overlays
While the cart drawer, the mobile menu drawer or the predictive search is open, the scroll-to-top control SHALL be hidden. The trustbadge SHALL NOT be visible on top of the open overlay.

#### Scenario: Cart drawer opens
- **WHEN** the shopper opens the cart drawer
- **THEN** neither the scroll-to-top control nor the trustbadge is visible above the drawer

#### Scenario: Mobile menu opens
- **WHEN** the shopper opens the mobile menu drawer
- **THEN** neither floating element is visible above the menu

### Requirement: Scroll-to-top control behaviour
The scroll-to-top control SHALL be a native button with the accessible name "Naar boven". It SHALL be hidden while the page is scrolled near the top and SHALL appear once the shopper has scrolled further than roughly one viewport height. Activating it SHALL return the page to the top and move keyboard focus to the start of the page. The scroll SHALL be instant when the shopper prefers reduced motion.

#### Scenario: Shopper at top of page
- **WHEN** the page is scrolled less than about one viewport height
- **THEN** the scroll-to-top control is not shown and is not reachable by keyboard

#### Scenario: Keyboard activation
- **WHEN** a keyboard user activates the visible scroll-to-top control
- **THEN** the page scrolls to the top and focus moves to the start of the page instead of staying on the now-hidden control

#### Scenario: Reduced motion
- **WHEN** the shopper has `prefers-reduced-motion: reduce` and activates the control
- **THEN** the page jumps to the top without smooth-scroll animation
