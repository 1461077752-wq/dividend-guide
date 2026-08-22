import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseUrl = 'https://www.dividend01.com';
const errors = [];
const warnings = [];

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
const routeForFile = file => {
  const relative = path.relative(distDir, file).replace(/\\/g, '/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/\/index\.html$/, '/').replace(/\.html$/, '/')}`;
};
const normalizeInternalRoute = href => {
  const pathname = href.split('#')[0].split('?')[0];
  if (!pathname || pathname === '/') return '/';
  if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};
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
  if (!relative.startsWith('zh/') && title?.length > 65) warnings.push(`${relative}: title is ${title.length} characters`);
  if (!relative.startsWith('zh/') && description && (description.length < 110 || description.length > 165)) warnings.push(`${relative}: description is ${description.length} characters`);
  if (h1Count !== 1) errors.push(`${relative}: expected one H1, found ${h1Count}`);
  let canonicalUrl;
  try { canonicalUrl = new URL(canonical); } catch {}
  if (!canonicalUrl || canonicalUrl.origin !== baseUrl || canonicalUrl.pathname.includes('//') || !canonicalUrl.pathname.endsWith('/') || canonicalUrl.search || canonicalUrl.hash) {
    errors.push(`${relative}: canonical must use ${baseUrl} and end with /`);
  }
  if (/(pages\.dev|localhost)/i.test(head)) errors.push(`${relative}: preview hostname leaked into metadata`);
  if (/(Content Review Board|reader survey|reader panel)/i.test(html)) errors.push(`${relative}: unverified editorial or testimonial claim`);
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
  for (const link of alternateLinks) {
    let alternateUrl;
    try { alternateUrl = new URL(link.href); } catch {}
    if (!alternateUrl || alternateUrl.origin !== baseUrl || !alternateUrl.pathname.endsWith('/')) {
      errors.push(`${relative}: hreflang must use ${baseUrl} and end with /: ${link.href}`);
    }
  }
  pages.push({ file, relative, route: routeForFile(file), html, title, canonical, alternateLinks });
}

const duplicateValues = (field, label) => {
  const grouped = new Map();
  for (const page of pages) grouped.set(page[field], [...(grouped.get(page[field]) || []), page.relative]);
  for (const [value, matches] of grouped) {
    if (value && matches.length > 1) errors.push(`duplicate ${label}: ${value} (${matches.join(', ')})`);
  }
};
duplicateValues('canonical', 'canonical');
duplicateValues('title', 'title');

const routes = new Set(pages.map(page => page.route));
for (const page of pages) {
  for (const match of page.html.matchAll(/\shref="([^"]+)"/gi)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const internalPath = href.split('#')[0].split('?')[0];
    if (internalPath !== '/' && !/\.[a-z0-9]+$/i.test(internalPath) && !internalPath.endsWith('/')) {
      errors.push(`${page.relative}: internal page link must end with /: ${href}`);
    }
    const route = normalizeInternalRoute(href);
    if (/\.[a-z0-9]+$/i.test(route)) {
      const asset = path.join(distDir, route.replace(/^\//, ''));
      try { await fs.access(asset); } catch { errors.push(`${page.relative}: missing linked asset ${route}`); }
    } else if (!routes.has(route) && route !== '/404/') {
      errors.push(`${page.relative}: broken internal link ${route}`);
    }
  }
  for (const match of page.html.matchAll(/(?:src|content)="(https:\/\/dividend01\.com)?(\/images\/[^"]+)"/gi)) {
    const asset = path.join(distDir, match[2].replace(/^\//, ''));
    try { await fs.access(asset); } catch { errors.push(`${page.relative}: missing image ${match[2]}`); }
  }
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
if (warnings.length) {
  console.warn(`SEO validation passed with ${warnings.length} recommendation(s):`);
  for (const warning of warnings.slice(0, 20)) console.warn(`- ${warning}`);
  if (warnings.length > 20) console.warn(`- …and ${warnings.length - 20} more`);
}
console.log(`SEO validation passed for ${pages.length} indexable HTML pages.`);
