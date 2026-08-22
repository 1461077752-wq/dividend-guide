import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const cacheDir = path.join(root, 'src', 'content', 'translations', 'zh');
const cacheFile = path.join(cacheDir, 'site.json');
const baseUrl = 'https://www.dividend01.com';
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

if (!apiKey) console.warn('OPENAI_API_KEY not set; using native Astro locale pages and skipping API-generated fallback pages.');

const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const walk = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== 'zh') files.push(...await walk(absolute));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
};

const stripProtected = html => html.replace(/<(script|style|pre|code)\b[^>]*>[\s\S]*?<\/\1>|<!--[\s\S]*?-->/gi, match => `<!--ZH_PROTECTED_${Buffer.from(match).toString('base64')}-->`);
const restoreProtected = html => html.replace(/<!--ZH_PROTECTED_([^>]+?)-->/g, (_, encoded) => Buffer.from(encoded, 'base64').toString('utf8'));
const isTranslatable = text => /[A-Za-z]{2,}/.test(text) && !/^\s*[\d$%+.,:/#?=&()\-]+\s*$/.test(text);
const keyFor = text => hash(text.trim());
const keepWhitespace = (original, translated) => original.replace(original.trim(), translated.trim());

const localizeInternalUrl = value => {
  if (!value || !value.startsWith('https://www.dividend01.com/')) return value;
  const parsed = new URL(value);
  if (parsed.pathname === '/' || parsed.pathname.startsWith('/zh/')) {
    if (parsed.pathname.startsWith('/zh/')) return value;
    parsed.pathname = `/zh${parsed.pathname}`;
    return parsed.toString();
  }
  parsed.pathname = `/zh${parsed.pathname}`;
  return parsed.toString();
};

const rewriteJsonLd = html => html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, (match, json) => {
  try {
    const value = JSON.parse(json);
    const visit = item => {
      if (Array.isArray(item)) return item.map(visit);
      if (!item || typeof item !== 'object') return typeof item === 'string' ? localizeInternalUrl(item) : item;
      return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, key === 'url' || key === '@id' || key === 'item' || key === 'mainEntityOfPage' ? visit(child) : visit(child)]));
    };
    const localized = visit(value);
    return `<script type="application/ld+json">${JSON.stringify(localized)}</script>`;
  } catch (error) {
    throw new Error(`Unable to parse JSON-LD while localizing ${error.message}`);
  }
});

const rewriteLocalizedMetadata = (html, relative) => {
  const englishPath = `/${relative.replace(/\\/g, '/').replace(/index\.html$/, '')}`.replace(/\/+/g, '/');
  const englishUrl = `https://www.dividend01.com${englishPath === '//' ? '/' : englishPath}`;
  const chineseUrl = localizeInternalUrl(englishUrl);
  let localized = html
    .replace(/<html\s+lang="[^"]*"/i, '<html lang="zh-CN"')
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]+/i, `$1${chineseUrl}`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]+/i, `$1${chineseUrl}`)
    .replace(/(<meta\s+property="og:locale"\s+content=")[^"]+/i, '$1zh_CN')
    .replace(/(<meta\s+property="og:locale:alternate"\s+content=")[^"]+/i, '$1en_US');
  localized = rewriteJsonLd(localized);
  return localized;
};

const translateBatch = async (items) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Translate website content from English to Simplified Chinese. Return JSON in the form {"translations":[{"id":"...","text":"..."}]}. Preserve numbers, tickers, company names, links, formulas, and financial terminology. Do not add commentary.' },
        { role: 'user', content: JSON.stringify({ translations: items.map(item => ({ id: item.id, text: item.text })) }) }
      ]
    })
  });
  if (!response.ok) throw new Error(`Translation API ${response.status}: ${await response.text()}`);
  const body = await response.json();
  return JSON.parse(body.choices[0].message.content).translations;
};

const existingCache = await fs.readFile(cacheFile, 'utf8').then(JSON.parse).catch(() => ({}));
const htmlFiles = await walk(distDir);
const sourcePages = [];
const required = new Map();
for (const file of htmlFiles) {
  const relative = path.relative(distDir, file);
  if (relative.startsWith(`zh${path.sep}`)) continue;
  const html = await fs.readFile(file, 'utf8');
  const protectedHtml = stripProtected(html);
  const segments = [...protectedHtml.matchAll(/>([^<>]+)</g)].map(match => match[1]).filter(isTranslatable);
  segments.forEach(text => required.set(keyFor(text), text.trim()));
  sourcePages.push({ file, relative, html });
}

const missing = [...required.entries()].filter(([id]) => !existingCache[id]);
if (apiKey) {
  for (let index = 0; index < missing.length; index += 60) {
    const batch = missing.slice(index, index + 60).map(([id, text]) => ({ id, text }));
    const translated = await translateBatch(batch);
    for (const item of translated) existingCache[item.id] = item.text;
    console.log(`Translated ${Math.min(index + batch.length, missing.length)}/${missing.length} text segments`);
  }
}
await fs.mkdir(cacheDir, { recursive: true });
await fs.writeFile(cacheFile, JSON.stringify(existingCache, null, 2) + '\n', 'utf8');

for (const page of sourcePages) {
  const relativeDir = path.dirname(page.relative);
  const output = path.join(distDir, 'zh', relativeDir, path.basename(page.relative));
  if (!apiKey || await fs.access(output).then(() => true).catch(() => false)) continue;
  let localized = stripProtected(page.html).replace(/>([^<>]+)</g, (match, text) => {
    if (!isTranslatable(text)) return match;
    const translated = existingCache[keyFor(text)];
    return translated ? `>${keepWhitespace(text, translated)}<` : match;
  });
  localized = restoreProtected(localized);
  localized = rewriteLocalizedMetadata(localized, page.relative);
  localized = localized.replace(/href="\/(?!zh\/|\/|#|mailto:)/g, 'href="/zh/');
  localized = localized.replace(/href="\/"/g, 'href="/zh/"');
  const englishPath = `/${page.relative.replace(/\\/g, '/').replace(/index\.html$/, '')}`;
  const englishUrl = `${baseUrl}${englishPath}`;
  localized = localized.replace(/class="nav-language" href="[^"]*"/g, `class="nav-language" href="${englishUrl}"`);
  localized = localized.replace(/class="language-switcher" href="[^"]*"/g, `class="language-switcher" href="${englishUrl}"`);
  localized = localized.replace(/(<a class="language-switcher"[^>]*>)[^<]*(<\/a>)/g, '$1EN$2');
  localized = localized.replace(/class="article-language-switcher" href="[^"]*"/g, `class="article-language-switcher" href="${englishUrl}"`);
  localized = localized.replace(/(<a class="article-language-switcher"[^>]*>)[^<]*(<\/a>)/g, '$1EN$2');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, localized, 'utf8');
}

console.log(`Created ${sourcePages.length} Chinese pages under dist/zh/`);
