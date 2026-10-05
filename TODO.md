BUG - same border on reduced chips: active vs hover

BUG - back from PDP/wishlist after show more: same position!

BUG - wishlist shows no reduced badge!

BUG - warum https://original-brands-dev.myshopify.com/products/fitflop-lulu-leather-toepost?variant=45841872846957 is NOT under blue in filter??
-- es ist, aber zeigt another blue...

===
FEAT - redirects URL's from ob.nl 
- wait for full catalog
============

===
Schrijf je nu in op onze nieuwsbrief en ontvang 10% korting op jouw eerste bestelling.
===
Trusted Shops badge
===
to top arrow
===
BLOG!!!

PDP 
- vert abstand after header

============
Crawl: stopped for good. Only FitFlop product URLs map to products (532 of 587 match exactly); other brands' product URLs go to the brand collection, and the old SEO titles are not captured.
=============
 
Redesign-/UX-Audit-Anleitung - used by codex

===
Ein offener Punkt für dich (20 Sekunden): sections/ob-home-brands.liquid und assets/component-ob-home-brands.css liegen noch auf dem Live-Theme. Der Shopify-Connector verweigert themeFilesDelete auf einem Live-Theme, und theme push --only löscht grundsätzlich keine Remote-Dateien. Ein voller theme push würde sie löschen — aber auch jedes templates/*.json aus einer womöglich veralteten lokalen Kopie überschreiben, also genau der cdc6c7c-Unfall. Lösch sie unter Admin → Themes → Edit code. Bis dahin sind sie wirkungslos: nichts rendert oder verlinkt sie.
