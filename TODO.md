- redirects URL's from ob.nl 
-- waiting for drupal export
============

===
PLP
-

PDP 
- add besorgin & retour accordeon

===

Desktop Filter: categories
- use for separate horizontal filter? - not now

============
SOLDEN page

============
 
Redesign-/UX-Audit-Anleitung - used by codex

===
Ein offener Punkt für dich (20 Sekunden): sections/ob-home-brands.liquid und assets/component-ob-home-brands.css liegen noch auf dem Live-Theme. Der Shopify-Connector verweigert themeFilesDelete auf einem Live-Theme, und theme push --only löscht grundsätzlich keine Remote-Dateien. Ein voller theme push würde sie löschen — aber auch jedes templates/*.json aus einer womöglich veralteten lokalen Kopie überschreiben, also genau der cdc6c7c-Unfall. Lösch sie unter Admin → Themes → Edit code. Bis dahin sind sie wirkungslos: nichts rendert oder verlinkt sie.
