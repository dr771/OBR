- redirects URL's from ob.nl 
-- waiting for drupal export
============
Content pages from ob.nl?
- Over Original Brands
Artikelen retourneren
Klantenservice
Levering
Veelgestelde vragen
Wie we zijn
===
Schrijf je nu in op onze nieuwsbrief en ontvang 10% korting op jouw eerste bestelling.
===
Trusted Shops badge
===
to top arrow
===
Blog?

PDP 
- add besorgin & retour accordeon




============
SOLDEN page

============
 
Redesign-/UX-Audit-Anleitung - used by codex

===
Ein offener Punkt für dich (20 Sekunden): sections/ob-home-brands.liquid und assets/component-ob-home-brands.css liegen noch auf dem Live-Theme. Der Shopify-Connector verweigert themeFilesDelete auf einem Live-Theme, und theme push --only löscht grundsätzlich keine Remote-Dateien. Ein voller theme push würde sie löschen — aber auch jedes templates/*.json aus einer womöglich veralteten lokalen Kopie überschreiben, also genau der cdc6c7c-Unfall. Lösch sie unter Admin → Themes → Edit code. Bis dahin sind sie wirkungslos: nichts rendert oder verlinkt sie.
