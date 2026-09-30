/*
  Scroll-spy for .ob-content__nav (see component-ob-content-page.css).
  Marks the link of the section currently under the top of the viewport with
  aria-current="true". No-op on pages without the nav.
*/
(function () {
  var links = document.querySelectorAll('.ob-content__nav a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  var sections = [];
  links.forEach(function (link) {
    var id = decodeURIComponent(link.getAttribute('href').slice(1));
    var section = document.getElementById(id);
    if (section) {
      byId[id] = link;
      sections.push(section);
    }
  });
  if (!sections.length) return;

  var visible = {};
  function setCurrent() {
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (visible[sections[i].id]) {
        current = sections[i].id;
        break;
      }
    }
    if (!current) return; /* between sections / page end: keep the last one */
    Object.keys(byId).forEach(function (id) {
      if (id === current) byId[id].setAttribute('aria-current', 'true');
      else byId[id].removeAttribute('aria-current');
    });
  }

  /* Band = a strip near the top of the viewport; the first section (in
     document order) intersecting it is the current one. */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      setCurrent();
    },
    { rootMargin: '-10% 0px -60% 0px' }
  );
  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
