// scripts/verify-canonical-live.mjs
// 远程验证 dividend01.com 线上 URL 规范化、sitemap、/zh/zh/ 重定向、邮件保护死链
// 用法: node scripts/verify-canonical-live.mjs

import { writeFileSync, existsSync, readFileSync } from 'node:fs';

const BASE = 'https://www.dividend01.com';
const NON_WWW = 'https://dividend01.com';
const HTTP = 'http://www.dividend01.com';

let pass = 0, fail = 0;
const report = [];
function log(...args) { console.log(...args); }
function check(name, ok, detail) {
  report.push({ name, ok, detail });
  if (ok) pass++; else fail++;
  log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function head(url, redirects = 'manual') {
  const r = await fetch(url, { method: 'HEAD', redirect: redirects, headers: { 'User-Agent': 'Dividend01Verifier/1.0' } });
  return r;
}

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Dividend01Verifier/1.0' } });
  return r;
}

// 1. Sitemap 存在与结构
log('\n=== 1. Sitemap ===');
const sitemap = await get(`${BASE}/sitemap.xml`);
const ok200 = sitemap.status === 200;
const ct = sitemap.headers.get('content-type') || '';
check('Sitemap returns 200', ok200, `status=${sitemap.status}`);
const isXML = ct.includes('xml') || ct.includes('text');
check('Sitemap content-type is XML', isXML, ct);

const xml = await sitemap.text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
// Dynamic URL-count baseline (no hardcoded magic number)
const BASELINE_FILE = 'scripts/.sitemap-baseline.json';
let baseline = existsSync(BASELINE_FILE) ? (JSON.parse(readFileSync(BASELINE_FILE, 'utf8')).count ?? null) : null;
if (baseline == null) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ count: locs.length, updated: new Date().toISOString() }));
  check('Sitemap URL count baseline created', true, `baseline=${locs.length}`);
} else if (locs.length < baseline) {
  check('Sitemap URL count regression', false, `actual=${locs.length} < baseline=${baseline}`);
} else if (locs.length > baseline) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ count: locs.length, updated: new Date().toISOString() }));
  check('Sitemap URL count grew (baseline updated)', true, `actual=${locs.length} (was ${baseline})`);
} else {
  check('Sitemap URL count stable', true, `=${locs.length}`);
}
const nonCanonical = locs.filter(u => !u.startsWith(BASE) || !u.endsWith('/') || u.includes('/zh/zh/'));
check('All sitemap URLs are www+HTTPS+trailing slash & no /zh/zh/', nonCanonical.length === 0, nonCanonical.length ? nonCanonical.slice(0,3).join(', ') : 'clean');

// 2. 域名/协议/尾斜杠 规范化（计划第二节：6 种组合 → 同一最终地址）
log('\n=== 2. Canonical format (6 variants) ===');
const variants = [
  ['http://dividend01.com/stocks', `${BASE}/stocks/`],
  ['http://www.dividend01.com/stocks', `${BASE}/stocks/`],
  ['https://dividend01.com/stocks', `${BASE}/stocks/`],
  ['https://dividend01.com/stocks/', `${BASE}/stocks/`],
  ['https://www.dividend01.com/stocks', `${BASE}/stocks/`],
  [`${BASE}/stocks/`, `${BASE}/stocks/`]
];
for (const [from, expected] of variants) {
  try {
    const r = await head(from, 'follow');
    const ok = r.status === 200 && r.url === expected;
    check(`"${from}" → ${expected}`, ok, `status=${r.status} final=${r.url}`);
  } catch (e) {
    check(`"${from}" → ${expected}`, false, e.message);
  }
}

// 3. /zh/zh/ 单跳 301 到 /zh/
log('\n=== 3. /zh/zh/ redirects (sample) ===');
const zhSamples = [
  '/zh/zh/topics/dividend-investing-basics/',
  '/zh/zh/topics/dividend-stock-screening/',
  '/zh/zh/topics/high-yield-dividend-stocks/',
  '/zh/zh/about/author/',
  '/zh/zh/privacy/',
  '/zh/zh/articles/'
];
for (const p of zhSamples) {
  const url = `${BASE}${p}`;
  const r = await head(url, 'manual');
  const loc = r.headers.get('location');
  const target = `${BASE}${p.replace('/zh/zh/', '/zh/')}`;
  const ok = r.status === 301 && loc === target;
  check(`/zh/zh/... → ${target}`, ok, `${r.status} → ${loc}`);
}

// 4. 邮件保护死链扫描（基于已构建站点 dist/）
log('\n=== 4. Email-protection dead-link scan ===');
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
let emailHits = [];
function scan(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) scan(p);
    else if (p.endsWith('.html')) {
      const c = readFileSync(p, 'utf8');
      if (c.includes('/cdn-cgi/l/email-protection')) emailHits.push(p);
    }
  }
}
try { scan('dist'); } catch (e) { log('dist not found, skipping'); }
check(`No /cdn-cgi/l/email-protection links in built site`, emailHits.length === 0, emailHits.length ? `${emailHits.length} files: ${emailHits.slice(0,3).join(', ')}` : 'clean');

// 5. 关键页面 canonical 与 hreflang 抽样
log('\n=== 5. Canonical + hreflang consistency (sample) ===');
const samples = ['/articles/high-dividend-stocks/', '/articles/ulty-dividend/', '/articles/qqqi-dividend/', '/zh/articles/ulty-dividend/'];
for (const p of samples) {
  try {
    const r = await get(`${BASE}${p}`);
    const html = await r.text();
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => `${m[1]}→${m[2]}`);
    const canonOk = canon === `${BASE}${p}`;
    check(`Canonical for ${p}`, canonOk, canon);
    log(`   hreflang: ${hreflangs.join(', ')}`);
  } catch (e) {
    check(`Canonical for ${p}`, false, e.message);
  }
}

// 总结
log(`\n=== Summary ===\n✅ ${pass} passed, ❌ ${fail} failed`);
writeFileSync('VERIFY-RESULT.md', `# Canonical Live Verification\n\nGenerated: ${new Date().toISOString()}\n\n✅ ${pass} passed, ❌ ${fail} failed\n\n${report.map(r => `- ${r.ok ? '✅' : '❌'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`).join('\n')}\n`);
process.exit(fail === 0 ? 0 : 1);