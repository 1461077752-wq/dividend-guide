#!/bin/bash
# scripts/verify-canonical-live.sh
# 远程验证 dividend01.com 线上规范化、sitemap、/zh/zh/ 重定向、邮件保护死链
# 用法: bash scripts/verify-canonical-live.sh

BASE="https://www.dividend01.com"
pass=0; fail=0

check() {
  local name="$1" cond="$2" detail="$3"
  if [ "$cond" = "1" ]; then
    echo "✅ $name${detail:+ — $detail}"
    pass=$((pass+1))
  else
    echo "❌ $name${detail:+ — $detail}"
    fail=$((fail+1))
  fi
}

UA="Mozilla/5.0 (Dividend01Verifier/1.0)"

echo "=== 1. Sitemap ==="
status=$(curl -sI -o /dev/null -w "%{http_code}" -A "$UA" "$BASE/sitemap.xml")
[ "$status" = "200" ] && c=1 || c=0
check "Sitemap returns 200" $c "status=$status"

ct=$(curl -sI -A "$UA" "$BASE/sitemap.xml" | grep -i "^content-type:" | tr -d '\r' | head -1)
echo "$ct" | grep -qi "xml" && c=1 || c=0
check "Sitemap content-type is XML" $c "$ct"

count=$(curl -s -A "$UA" "$BASE/sitemap.xml" | grep -c "<loc>")
[ "$count" = "118" ] && c=1 || c=0
check "Sitemap has 118 URLs" $c "actual=$count"

non_canonical=$(curl -s -A "$UA" "$BASE/sitemap.xml" | grep -oE "<loc>[^<]+</loc>" | sed 's|.*<loc>||;s|</loc>||' | grep -vE "^${BASE}/" )
[ -z "$non_canonical" ] && c=1 || c=0
check "All sitemap URLs start with $BASE" $c "$non_canonical"

no_slash=$(curl -s -A "$UA" "$BASE/sitemap.xml" | grep -oE "<loc>[^<]+</loc>" | sed 's|.*<loc>||;s|</loc>||' | grep -v "/$")
[ -z "$no_slash" ] && c=1 || c=0
check "All sitemap URLs end with /" $c "$no_slash"

no_zhzh=$(curl -s -A "$UA" "$BASE/sitemap.xml" | grep -c "/zh/zh/")
[ "$no_zhzh" = "0" ] && c=1 || c=0
check "Sitemap contains no /zh/zh/ URLs" $c "count=$no_zhzh"

echo ""
echo "=== 2. Canonical format (5 variants → /stocks/) ==="
for from in \
  "http://dividend01.com/stocks" \
  "http://www.dividend01.com/stocks" \
  "https://dividend01.com/stocks" \
  "https://dividend01.com/stocks/" \
  "https://www.dividend01.com/stocks" \
  ; do
  final=$(curl -sIL -o /dev/null -w "%{url_effective}" -A "$UA" "$from")
  [ "$final" = "${BASE}/stocks/" ] && c=1 || c=0
  check "\"$from\" → ${BASE}/stocks/" $c "final=$final"
done

echo ""
echo "=== 3. /zh/zh/ redirects (sample, no follow, single 301) ==="
for p in \
  "/zh/zh/topics/dividend-investing-basics/" \
  "/zh/zh/topics/dividend-stock-screening/" \
  "/zh/zh/topics/high-yield-dividend-stocks/" \
  "/zh/zh/about/author/" \
  "/zh/zh/privacy/" \
  "/zh/zh/articles/" \
  ; do
  expected="${BASE}$(echo "$p" | sed 's|/zh/zh/|/zh/|')"
  hdr=$(curl -sI -o /dev/null -A "$UA" -w "%{http_code}|%{redirect_url}" "$BASE$p")
  status="${hdr%%|*}"
  location="${hdr#*|}"
  if [ "$status" = "301" ] && [ "$location" = "$expected" ]; then c=1; else c=0; fi
  check "${p} → ${expected}" $c "status=$status loc=$location"
done

echo ""
echo "=== 4. Email-protection dead-link scan (dist/) ==="
hits=$(grep -rl "/cdn-cgi/l/email-protection" dist/ --include="*.html" 2>/dev/null | head -3 || true)
n=$(grep -rl "/cdn-cgi/l/email-protection" dist/ --include="*.html" 2>/dev/null | wc -l | tr -d ' ')
[ "$n" = "0" ] && c=1 || c=0
check "No /cdn-cgi/l/email-protection links in built site" $c "files=$n"

echo ""
echo "=== 5. Canonical & hreflang on key pages (sample) ==="
for p in "/articles/high-dividend-stocks/" "/articles/ulty-dividend/" "/articles/qqqi-dividend/" "/zh/articles/ulty-dividend/"; do
  canon=$(curl -s -A "$UA" "$BASE$p" | grep -oE '<link rel="canonical" href="[^"]+"' | head -1 | sed 's|.*href="||;s|"$||')
  expected="${BASE}${p}"
  [ "$canon" = "$expected" ] && c=1 || c=0
  check "Canonical self-referential for $p" $c "canon=$canon"
done

echo ""
echo "=== Summary ==="
echo "✅ $pass passed, ❌ $fail failed"
exit $fail