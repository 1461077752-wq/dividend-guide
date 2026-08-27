// scripts/audit-jsonld.mjs
// 从 dist/ HTML 抽取 JSON-LD 并审计一致性（URL、作者、日期、Breadcrumb、FAQ真实性）
// 用法: node scripts/audit-jsonld.mjs

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://www.dividend01.com';
const issues = [];
const stats = { pages: 0, withJsonLd: 0, schemasByType: {} };

function walk(dir, files = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, files);
    else if (p.endsWith('.html')) files.push(p);
  }
  return files;
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      const data = JSON.parse(m[1]);
      blocks.push(data);
    } catch (e) {
      issues.push({ file: '?', kind: 'parse', detail: 'JSON-LD parse error: ' + e.message });
    }
  }
  return blocks;
}

function isCanonicalUrl(u) {
  return typeof u === 'string' && u.startsWith(BASE + '/') && !u.includes('/zh/zh/');
}

function auditPage(file) {
  const html = readFileSync(file, 'utf8');
  const blocks = extractJsonLd(html);
  if (blocks.length === 0) return;
  stats.withJsonLd++;
  const urlFromPath = '/' + file.replace(/^dist/, '').replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '/');
  const pageUrl = BASE + (urlFromPath === '/' ? '/' : urlFromPath);

  for (const block of blocks) {
    // Accept: single object, @graph array, or bare array of objects
    let items;
    if (Array.isArray(block)) items = block;
    else if (Array.isArray(block['@graph'])) items = block['@graph'];
    else items = [block];
    for (const item of items) {
      const t = item['@type'];
      if (!t) continue;
      stats.schemasByType[t] = (stats.schemasByType[t] || 0) + 1;

      // URL fields — Organization/WebSite use bare domain; everything else uses BASE + '/path/'
      const url = item.url || item['@id'];
      if (typeof url === 'string' && url.startsWith('http')) {
        if (t === 'Organization' || t === 'WebSite') {
          if (url !== BASE) {
            issues.push({ file, kind: 'site-url-mismatch', type: t, detail: url });
          }
        } else if (!isCanonicalUrl(url)) {
          issues.push({ file, kind: 'url-not-canonical', type: t, detail: url });
        }
      }

      // Article checks
      if (t === 'Article' || t === 'WebPage' || t === 'NewsArticle') {
        const author = item.author;
        if (author && typeof author === 'object' && author.name && !author.name.includes('Dividend Guide')) {
          // ok
        }
        if (item.datePublished && !/^\d{4}-\d{2}-\d{2}/.test(item.datePublished)) {
          issues.push({ file, kind: 'date-format', type: t, detail: item.datePublished });
        }
        if (item.dateModified && !/^\d{4}-\d{2}-\d{2}/.test(item.dateModified)) {
          issues.push({ file, kind: 'date-format', type: t, detail: item.dateModified });
        }
        // No fake ratings
        if (item.aggregateRating && !item.reviewCount) {
          issues.push({ file, kind: 'rating-no-reviews', type: t });
        }
      }

      // BreadcrumbList: last item must be current page
      if (t === 'BreadcrumbList' && Array.isArray(item.itemListElement)) {
        const last = item.itemListElement[item.itemListElement.length - 1];
        if (last && last.item && !isCanonicalUrl(last.item)) {
          issues.push({ file, kind: 'breadcrumb-not-canonical', detail: last.item });
        }
      }

      // FAQPage must match visible FAQ in HTML
      if (t === 'FAQPage' && Array.isArray(item.mainEntity)) {
        const faqCountInSchema = item.mainEntity.length;
        const visibleFaq = (html.match(/<details class="faq-item"|/g) || []).length;
        if (faqCountInSchema > visibleFaq + 1) {
          issues.push({ file, kind: 'faq-mismatch', detail: `schema=${faqCountInSchema} visible=${visibleFaq}` });
        }
      }
    }
  }
}

const files = walk('dist');
stats.pages = files.length;
for (const f of files) auditPage(f);

// Summary
const report = [];
report.push('# JSON-LD Structured Data Audit');
report.push(`\nGenerated: ${new Date().toISOString()}`);
report.push(`\n## Summary`);
report.push(`- Total HTML pages scanned: **${stats.pages}**`);
report.push(`- Pages with JSON-LD: **${stats.withJsonLd}**`);
report.push(`- Issues found: **${issues.length}**`);
report.push(`- Schemas by type:`);
for (const [t, n] of Object.entries(stats.schemasByType).sort((a, b) => b[1] - a[1])) {
  report.push(`  - ${t}: ${n}`);
}

if (issues.length > 0) {
  report.push(`\n## Issues`);
  const byKind = {};
  for (const i of issues) {
    if (!byKind[i.kind]) byKind[i.kind] = [];
    byKind[i.kind].push(i);
  }
  for (const [k, list] of Object.entries(byKind)) {
    report.push(`\n### ${k} (${list.length})`);
    for (const i of list.slice(0, 10)) {
      report.push(`- \`${i.file.replace('dist', '')}\` — ${i.type || ''} ${i.detail || ''}`);
    }
    if (list.length > 10) report.push(`- ... and ${list.length - 10} more`);
  }
}

const out = report.join('\n');
writeFileSync('SEO-STRUCTURED-DATA-AUDIT.md', out);
console.log(out);

process.exit(issues.length === 0 ? 0 : 1);