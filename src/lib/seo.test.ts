import test from 'node:test';
import assert from 'node:assert/strict';
import { getPageMetadata, VIEW_METADATA_MAP, BRAND_NAME, CREATOR_CREDIT } from './seo.ts';

test('getPageMetadata returns home metadata for root or home view', () => {
  const meta = getPageMetadata('home');
  assert.match(meta.title, /AUTO CRAFT 3D/);
  assert.match(meta.title, /Ahad Ali Nisar/);
  assert.match(meta.description, /Precision diagnostics/);
  assert.equal(meta.ogType, 'website');
  assert.ok(meta.jsonLd);
});

test('getPageMetadata provides tailored titles for all views', () => {
  const views = ['services', 'estimator', 'booking', 'gallery', 'reviews', 'about', 'contact', 'dashboard', 'admin'];
  for (const view of views) {
    const meta = getPageMetadata(view);
    assert.ok(meta.title.includes(BRAND_NAME), `View ${view} title should include brand name`);
    assert.ok(meta.description.length > 50, `View ${view} description should be descriptive`);
  }
});

test('getPageMetadata gracefully falls back to home for unknown view', () => {
  const fallback = getPageMetadata('non-existent-view');
  assert.equal(fallback.title, VIEW_METADATA_MAP.home.title);
  assert.equal(fallback.description, VIEW_METADATA_MAP.home.description);
});

test('CREATOR_CREDIT matches required exact phrase', () => {
  assert.equal(CREATOR_CREDIT, 'Developed & Designed by Ahad Ali Nisar');
});
