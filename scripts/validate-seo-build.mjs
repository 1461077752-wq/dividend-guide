import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseUrl = 'https://dividend01.com';
const errors = [];

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

const attr = (html, tag, name) => html.match(new RegExp(`<${tag}[^>]*\\s${name}="([^"]+)"`, 'i'))?.[1];
const links = html => [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)].map(match => ({ lang: match[1], href: match[2] }));
const files = await walk(distDir);
const pages = [];

for (const file of files) {
  const html = await fs.readFile(file, 'utf8');
  const relative = path.relative(distDir, file).replace(/\\/g, '/');
  const head = html.match(/<head>[\s\S]*?<\/head>/i)?.[0] || html;
  const canonical = head.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  const title = head.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = head.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const noindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  if (noindex) continue;
  if (!title) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing meta description`);
  if (h1Count !== 1) errors.push(`${relative}: expected one H1, found ${h1Count}`);
  if (!canonical || !canonical.startsWith(baseUrl) || canonical.includes('pages.dev')) errors.push(`${relative}: invalid canonical`);
  if (/(pages\.dev|localhost)/i.test(head)) errors.push(`${relative}: preview hostname leaked into metadata`);
  for (const script of head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(script[1]); } catch { errors.push(`${relative}: invalid JSON-LD`); }
  }
  if (relative.startsWith('zh/')) {
    if (!/<html\s+lang="zh-CN"/i.test(html)) errors.push(`${relative}: missing zh-CN lang`);
    if (!canonical.startsWith(`${baseUrl}/zh/`)) errors.push(`${relative}: Chinese page is not self-canonical`);
  }
  const alternateLinks = links(html);
  for (const required of ['en', 'zh-CN', 'x-default']) {
    if (!alternateLinks.some(link => link.lang === required)) errors.push(`${relative}: missing hreflang ${required}`);
  }
  pages.push({ relative, canonical, alternateLinks });
}

const sitemap = await fs.readFile(path.join(distDir, 'sitemap.xml'), 'utf8').catch(() => '');
if (!sitemap) errors.push('dist/sitemap.xml: missing');
for (const page of pages) {
  if (!sitemap.includes(`<loc>${page.canonical}</loc>`)) errors.push(`${page.relative}: canonical missing from sitemap`);
  for (const link of page.alternateLinks) {
    if (!sitemap.includes(`href="${link.href}"`)) errors.push(`${page.relative}: hreflang target missing from sitemap: ${link.href}`);
  }
}

if (errors.length) {
  console.error(`SEO validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`SEO validation passed for ${pages.length} indexable HTML pages.`);
