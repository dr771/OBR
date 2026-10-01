#!/usr/bin/env node
// Builds the legacy-URL redirect map (MIGRATION-TO-LIVE.md §5) from:
//   drupal_url_aliases.csv          the old site's alias export
//   redirects/legacy-pages.json     scripts/legacy-crawl.js output (article id -> Akeneo item/colour code)
//   redirects/gsc-clicks.json       Search Console clicks per old path, for the review order
//   redirects/overrides.csv         alias;target — hand decisions, win over every rule below
//   redirects/catalog-<shop>.json   that shop's products ([{h: handle, v: vendor, vs: [[variantId, sku], …]}])
// Writes redirects/redirects-<shop>.csv (Shopify import format) and redirects/review-<shop>.csv.
// Variant ids differ per shop, so the product rows are only valid for the shop the catalog came from.
// Usage: node scripts/build-redirects.js [shop]      (default: dev)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'redirects');
const SHOP = process.argv[2] || 'dev';
const BLOG = '/blogs/inspiratie';

const readJson = (file, fallback) => (fs.existsSync(path.join(DIR, file)) ? JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')) : fallback);
const csvCell = (value) => (/[",\n]/.test(value) ? `"${String(value).replace(/"/g, '""')}"` : value);

const aliases = fs
  .readFileSync(path.join(ROOT, 'drupal_url_aliases.csv'), 'utf8')
  .replace(/^﻿/, '')
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean)
  .map((line) => line.split(';'))
  .map(([alias, target, language]) => ({ alias, target, language }));

const legacy = readJson('legacy-pages.json', { pages: {}, articles: {} });
const clicks = readJson('gsc-clicks.json', {});
const catalog = readJson(`catalog-${SHOP}.json`, []);
const overrides = new Map(
  fs.existsSync(path.join(DIR, 'overrides.csv'))
    ? fs
        .readFileSync(path.join(DIR, 'overrides.csv'), 'utf8')
        .split(/\r?\n/)
        .slice(1)
        .filter(Boolean)
        .map((line) => line.split(';').slice(0, 2))
    : []
);

// Old brand slug prefix -> brand collection. A brand without an entry (dropped, or not synced yet)
// lands on the brand directory, never on the homepage.
const BRANDS = [
  ['juicy-couture', 'juicy-couture'],
  ['sweaty-betty', 'sweaty-betty'],
  ['swetty-betty', 'sweaty-betty'],
  ['holster', 'holster'],
  ['sneakerlab', 'sneaker-lab'],
  ['loewenweiss', 'loewenweiss'],
  ['lowenweiss', 'loewenweiss'],
  ['l-wenweiss', 'loewenweiss'],
  ['fitflop', 'fitflop'],
  ['hi-tec', 'hi-tec'],
  ['odlo', 'odlo'],
];
// Brand x type pages that got a real collection under the old slug. See COLLECTIONS.md.
const SUB_COLLECTIONS = new Set([
  'fitflop-slippers',
  'fitflop-slides',
  'fitflop-sandalen',
  'fitflop-sneakers',
  'fitflop-enkellaarzen',
  'fitflop-pantoffels',
  'fitflop-ballerinas',
  'fitflop-dames',
  'fitflop-heren',
  'fitflop-outlet',
  'juicy-couture-pants',
  'juicy-couture-hoodies',
  'juicy-couture-shorts',
  'odlo-running',
  'odlo-cycling',
  'odlo-wintersport',
  'odlo-outdoor',
]);
const EXACT = {
  '/klantenservice': '/pages/klantenservice',
  '/levering': '/pages/levering',
  '/retourneren-naar-original-brands': '/pages/verzending-en-retour',
  '/veelgestelde-vragen': '/pages/veelgestelde-vragen',
  '/veel-gestelde-vragen': '/pages/veelgestelde-vragen',
  '/wie-we-zijn': '/pages/ons-verhaal',
  '/contact': '/pages/contact',
  '/al-onze-merken': '/pages/merken',
  '/merken': '/pages/merken',
  '/algemene-voorwaarden': '/policies/terms-of-service',
  '/privacy-statement': '/policies/privacy-policy',
  '/cookiebeleid': '/policies/privacy-policy',
  '/zoeken': '/search',
  '/schoenen': '/collections/schoenen',
  '/heren': '/collections/heren',
  '/kinderen': '/collections/kinderen',
  '/shop-all': '/collections/all',
  '/homepage': '/',
  '/blog': BLOG,
};
// Blog-like pages that lived outside /blog/ on the old site.
const POSTS_OUTSIDE_BLOG = new Set(['/fitflops-6-redenen-waarom-jij-ze-eens-moet-passen', '/microwobbleboard']);

function brandOf(slug) {
  const leading = BRANDS.find(([prefix]) => slug === prefix || slug.startsWith(`${prefix}-`) || slug.startsWith(`${prefix}/`));
  // Campaign pages name the brand last (`promo-fitflop`, `solden-januari-2025-odlo-uyn`).
  const hit = leading || BRANDS.find(([prefix]) => slug.includes(`-${prefix}`));
  return hit ? hit[1] : null;
}

function pageTarget(alias) {
  const lower = alias.toLowerCase();
  if (overrides.has(alias)) return [overrides.get(alias), 'override'];
  if (EXACT[lower]) return [EXACT[lower], 'exact'];
  if (POSTS_OUTSIDE_BLOG.has(lower)) return [`${BLOG}${lower}`, 'blog-post'];
  if (lower.startsWith('/veelgestelde-vragen/')) return ['/pages/veelgestelde-vragen', 'faq'];

  const blog = lower.match(/^\/blog\/([^/]+)(?:\/([^/]+))?$/);
  if (blog) return blog[2] ? [`${BLOG}/${blog[2]}`, 'blog-post'] : [`${BLOG}/tagged/${blog[1]}`, 'blog-tag'];

  const slug = lower.replace(/^\/(merken\/|over-)?/, '').replace(/-\d+$/, '');
  if (SUB_COLLECTIONS.has(slug)) return [`/collections/${slug}`, 'sub-collection'];
  const brand = brandOf(slug);
  if (brand) {
    if (/outlet|solden/.test(slug) && SUB_COLLECTIONS.has(`${brand}-outlet`)) return [`/collections/${brand}-outlet`, 'brand-outlet'];
    return [`/collections/${brand}`, 'brand'];
  }
  if (/outlet|solden|black-friday|cyber-week|sales-/.test(slug)) return ['/collections/solden', 'sale'];
  return ['/pages/merken', 'fallback'];
}

// "<item>__<colour>" SKU prefix -> product URL with that colour's first variant preselected.
const squash = (code) => code.toUpperCase().replace(/[-_ ]/g, '');
const byColour = new Map();
const byItem = new Map();
for (const product of catalog) {
  for (const [variantId, sku] of product.vs) {
    if (!sku) continue;
    const [item, colour] = sku.split('__');
    if (!byColour.has(squash(item + colour))) byColour.set(squash(item + colour), `/products/${product.h}?variant=${variantId}`);
    if (!byItem.has(item.toUpperCase())) byItem.set(item.toUpperCase(), `/products/${product.h}`);
  }
}

function articleTarget(id, alias) {
  const article = legacy.articles[id];
  if (!article) return null; // not listed on any live old page: already a 404 there, so no redirect
  const colour = byColour.get(squash(article.code));
  if (colour) return [colour, 'product-colour'];
  const parts = article.code.split('_');
  for (let n = parts.length - 1; n >= 1; n--) {
    const item = byItem.get(parts.slice(0, n).join('_').toUpperCase());
    if (item) return [item, 'product-item'];
  }
  const brand = brandOf(alias.replace(/^\/artikel\//, '').toLowerCase());
  return brand ? [`/collections/${brand}`, 'product-brand'] : null;
}

const rows = new Map();
const review = [];
const stats = {};
// Shopify matches redirect paths case-insensitively, so one row per lower-cased path.
const add = (from, to) => {
  if (from !== to && !rows.has(from.toLowerCase())) rows.set(from.toLowerCase(), [from, to]);
};

for (const { alias, target, language } of aliases) {
  let result = null;
  if (/^\/(node|taxonomy|search)/.test(target)) {
    result = pageTarget(alias);
  } else if (target.startsWith('/article/')) {
    if (language !== 'Dutch') continue; // the /en site answers 403 and has no search traffic
    result = articleTarget(target.split('/')[2], alias);
    if (result) {
      add(target, result[0]);
      add(`/nl${target}`, result[0]);
    }
  }
  if (!result) continue;
  const [to, rule] = result;
  // The old site answers both with and without /nl, and Shopify does not treat them as one path.
  add(`/nl${alias}`, to);
  add(alias, to);
  stats[rule] = (stats[rule] || 0) + 1;
  if (!target.startsWith('/article/')) review.push({ alias, to, rule, clicks: clicks[alias.toLowerCase()] || 0 });
}

fs.writeFileSync(
  path.join(DIR, `redirects-${SHOP}.csv`),
  ['Redirect from,Redirect to', ...[...rows.values()].map(([from, to]) => `${csvCell(from)},${csvCell(to)}`)].join('\n') + '\n'
);
review.sort((a, b) => b.clicks - a.clicks || a.alias.localeCompare(b.alias));
fs.writeFileSync(
  path.join(DIR, `review-${SHOP}.csv`),
  ['clicks_16m;old_path;target;rule', ...review.map((r) => `${r.clicks};${r.alias};${r.to};${r.rule}`)].join('\n') + '\n'
);
console.log(`${rows.size} redirect rows`, stats);
