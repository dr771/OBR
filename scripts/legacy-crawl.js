#!/usr/bin/env node
// Crawls the legacy Drupal site's listing/CMS/blog pages (not the 9k product pages) and records,
// per old path: status, SEO title/description, h1 and the article ids it lists. Listing pages carry
// each colour's photohost image path (…/product/<pid>/color/<article id>/image/<item>_<colour> (01)/…),
// which is the only place the Akeneo item/colour code is exposed — see MIGRATION-TO-LIVE.md §5.
// Resumable: re-run to continue. The old site answers 429 to parallel requests, so one at a time.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'redirects', 'legacy-pages.json');
const BASE = 'https://www.originalbrands.nl/nl';
const DELAY_MS = 2500;
const MAX_PAGES = 20;
const PRIORITY = /^\/(fitflop|odlo|juicy|hi-tec)/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const text = (html, re) => (html.match(re) || [])[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || '';

const aliases = fs
  .readFileSync(path.join(ROOT, 'drupal_url_aliases.csv'), 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean)
  .map((line) => line.split(';'))
  .filter(([, target]) => /^\/(node|taxonomy)\//.test(target))
  .map(([alias]) => alias)
  // Brands that get sub-collections first, so their data is usable before the full run ends.
  .sort((a, b) => PRIORITY.test(b) - PRIORITY.test(a));

const state = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { pages: {}, articles: {} };

async function get(url) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (OB redirect-map crawl)' } });
      if (response.status === 429) {
        await sleep(45000 * (attempt + 1));
        continue;
      }
      return { status: response.status, location: response.headers.get('location'), html: response.status === 200 ? await response.text() : '' };
    } catch (error) {
      await sleep(10000);
    }
  }
  return { status: 429, html: '' };
}

function articlesIn(html) {
  const ids = new Set();
  for (const match of html.replaceAll('\\/', '/').matchAll(/files\/product\/(\d+)\/color\/(\d+)\/image\/([^\/"]+)\//g)) {
    const code = decodeURIComponent(match[3]).replace(/\s*\(?\d+\)?$/, '').trim();
    ids.add(match[2]);
    state.articles[match[2]] = state.articles[match[2]] || { product: match[1], code };
  }
  return ids;
}

(async () => {
  for (const alias of aliases) {
    if (state.pages[alias] && state.pages[alias].status !== 429) continue;
    const first = await get(BASE + encodeURI(alias));
    const page = { status: first.status, location: first.location || undefined };
    if (first.status === 200) {
      page.title = text(first.html, /<title>([\s\S]*?)<\/title>/);
      page.description = (first.html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
      page.h1 = text(first.html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
      page.canonical = (first.html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
      const ids = articlesIn(first.html);
      let html = first.html;
      for (let p = 2; p <= MAX_PAGES && html.includes(`?p=${p}"`); p++) {
        await sleep(DELAY_MS);
        const next = await get(`${BASE}${encodeURI(alias)}?p=${p}`);
        if (next.status !== 200) break;
        html = next.html;
        const before = ids.size;
        articlesIn(html).forEach((id) => ids.add(id));
        if (ids.size === before) break;
      }
      page.articles = [...ids];
    }
    state.pages[alias] = page;
    fs.writeFileSync(OUT, JSON.stringify(state, null, 1));
    await sleep(DELAY_MS);
  }
  const done = Object.values(state.pages);
  console.log(`pages ${done.length}/${aliases.length}, 200: ${done.filter((p) => p.status === 200).length}, articles with code: ${Object.keys(state.articles).length}`);
})();
