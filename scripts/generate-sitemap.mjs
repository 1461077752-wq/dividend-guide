import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseUrl = 'https://dividend01.com';

const walk = async directory => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
};

const escapeXml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const urlForFile = file => {
  const relative = path.relative(distDir, file).replace(/\\/g, '/');
  if (relative === 'index.html') return `${baseUrl}/`;
  return `${baseUrl}/${relative.replace(/\/index\.html$/, '').replace(/\.html$/, '')}/`;
};
const canonicalOf = html => html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
const isIndexable = html => !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);

const files = await walk(distDir);
const pages = [];
for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  if (!isIndexable(html)) continue;
  const canonical = canonicalOf(html);
  if (!canonical || !canonical.startsWith(baseUrl)) continue;
  pages.push({ file, url: canonical, html });
}

const pageByUrl = new Map(pages.map(page => [page.url, page]));
const rows = pages.sort((a, b) => a.url.localeCompare(b.url)).map(page => {
  const alternates = [...page.html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)]
    .filter(([, lang, href]) => ['en', 'zh-CN', 'x-default'].includes(lang) && pageByUrl.has(href));
  const alternateXml = alternates.map(([, lang, href]) => `\n    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`).join('');
  return `  <url>\n    <loc>${escapeXml(page.url)}</loc>${alternateXml}\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows}\n</urlset>\n`;
await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated ${pages.length} canonical URLs in dist/sitemap.xml`);
