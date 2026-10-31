import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const en = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const zh = readFileSync(new URL('../dist/zh/index.html', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const robots = readFileSync(new URL('../dist/robots.txt', import.meta.url), 'utf8');
const cname = readFileSync(new URL('../dist/CNAME', import.meta.url), 'utf8');
const concepts = readFileSync(new URL('../dist/concepts/index.html', import.meta.url), 'utf8');

for (const [language, html, canonical] of [
  ['en', en, 'https://fynxlab.com/'],
  ['zh-CN', zh, 'https://fynxlab.com/zh/'],
]) {
  test(`${language} page has indexable, localized SEO metadata`, () => {
    assert.match(html, new RegExp(`<html lang="${language}"`));
    assert.match(html, /<title>fynxlab — /);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
    for (const [hreflang, href] of [
      ['en', 'https://fynxlab.com/'],
      ['zh-CN', 'https://fynxlab.com/zh/'],
      ['x-default', 'https://fynxlab.com/'],
    ]) {
      assert.ok(html.includes(`hreflang="${hreflang}" href="${href}"`));
    }
    assert.match(html, /href="https:\/\/kyna\.fynxlab\.com\/"/);
    assert.match(html, /href="https:\/\/pinlaunch\.fynxlab\.com\/"/);
    assert.match(html, /src="\/images\/pinlaunch-screenshot\.png"/);
    assert.doesNotMatch(html, /class="pin-desktop"/);
    assert.match(html, /href="mailto:admin@fynxlab\.com"/);
    assert.doesNotMatch(html, /class="project-text-link"/);
    assert.equal((html.match(/class="round-link"/g) ?? []).length, 2);
  });
}

test('language versions have different titles and copy', () => {
  assert.match(en, /Engineered/);
  assert.match(zh, /认真构筑/);
  assert.notEqual(en.match(/<title>(.*?)<\/title>/)?.[1], zh.match(/<title>(.*?)<\/title>/)?.[1]);
});

test('sitemap and robots expose both language routes', () => {
  assert.match(sitemap, /<loc>https:\/\/fynxlab\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/fynxlab\.com\/zh\/<\/loc>/);
  assert.match(sitemap, /hreflang="zh-CN"/);
  assert.match(robots, /Sitemap: https:\/\/fynxlab\.com\/sitemap\.xml/);
  assert.equal(cname.trim(), 'fynxlab.com');
  assert.doesNotMatch(sitemap, /\/concepts\//);
});

test('concept gallery is a non-indexable preview', () => {
  assert.match(concepts, /<meta name="robots" content="noindex, nofollow"/);
  for (const id of ['direction-a', 'direction-b', 'direction-c', 'direction-d']) {
    assert.ok(concepts.includes(`id="${id}"`));
  }
});
