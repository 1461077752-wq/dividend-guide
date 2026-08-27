# Dividend01.com — 用户详细执行手册

> 制定日期：2026-08-27  
> 负责人：用户  
> 项目目录：/Users/qiuzijun/work space/dividend01.com  
> 范围：代码、内容、翻译、部署、Cloudflare、数据资产和外链。GSC 由 Codex 负责。

---

## 0. 总原则和执行顺序

### 0.1 URL 规范

- 页面统一使用 https://www.dividend01.com/.../。
- 非 www 永久 301 到 www。
- HTTP 永久 301 到 HTTPS。
- 页面路径末尾必须带 /。
- CSS、JavaScript、图片、字体、PDF、robots.txt 和 sitemap.xml 不强制增加 /。
- 历史 /zh/zh/.../ 永久 301 到相同内容的 /zh/.../。
- 不把无关 404 批量重定向到首页。

### 0.2 优先级

| 阶段 | 工作 | 是否阻塞 GSC |
|---|---|---|
| P0 | 整理 Git、同步中英文、构建、推送、确认部署 | 是 |
| P1 | Tariff 差异化、2025 历史归档、ETF 数据复核 | 对应页面请求收录前完成 |
| P2 | Email Protection、SSL、HSTS | Email Protection 可能阻塞 404 验证 |
| P3 | ETF 数据资产、外链、CTR 测试 | 否 |

完成 P0 后即可通知 Codex 提交 sitemap，不必等待数据资产和外链工作。

---

## 1. P0：整理当前仓库

### U1.1 查看全部改动

在项目目录执行：

    git status --short
    git diff --stat

逐个查看本轮 SEO 核心文件：

    git diff -- public/_redirects
    git diff -- scripts/build-zh-site.mjs
    git diff -- scripts/validate-seo-build.mjs
    git diff -- src/layouts/ArticleLayout.astro
    git diff -- 'src/pages/articles/[...slug].astro'
    git diff -- 'src/pages/zh/articles/[...slug].astro'

重点生产文件：

- public/_redirects
- public/robots.txt
- scripts/build-zh-site.mjs
- scripts/generate-sitemap.mjs
- scripts/validate-seo-build.mjs
- src/layouts/ArticleLayout.astro
- src/pages/articles/[...slug].astro
- src/pages/zh/articles/[...slug].astro
- src/content/articles/*.md
- src/content/translations/zh/articles/*.md
- src/pages/topics/*.astro

除非明确确认用途，否则不要加入生产提交：

- preview_*.html
- finance_article_*.html
- finance_article_*.md
- .workbuddy/
- dividend-article-writer/
- 临时截图、导出文件和个人草稿

验收：

- 能说明每一个准备提交的文件为什么改变。
- 没有覆盖来源不明的用户文件。
- 没有密钥、Token、Cookie、账号信息或本地隐私数据。

### U1.2 分批暂存

按实际完成的文件逐个暂存：

    git add public/_redirects
    git add scripts/build-zh-site.mjs scripts/validate-seo-build.mjs
    git add src/layouts/ArticleLayout.astro

文章文件也逐个加入，不使用 git add .。

暂存后检查：

    git diff --cached --stat
    git diff --cached

验收：

- 暂存区只包含本轮生产改动。
- 个人草稿和临时预览仍保持未暂存。

---

## 2. P1：Tariff 两页差异化

### U2.1 修改文件和 URL

修改：

- src/content/articles/tariff-dividend.md
- src/content/articles/tariff-dividend-check.md
- src/content/translations/zh/articles/tariff-dividend.md
- src/content/translations/zh/articles/tariff-dividend-check.md

保留：

- /articles/tariff-dividend/
- /articles/tariff-dividend-check/

不要合并、不要新增 301，不要让其中一篇 canonical 到另一篇。

### U2.2 tariff-dividend 页面

定位：政策解释页。

推荐结构：

1. 用 40–70 字直接回答 tariff dividend 是什么。
2. 说明当前属于提案、法案还是已实施计划。
3. 解释关税收入如何进入财政体系。
4. 说明是否需要国会立法和拨款。
5. 解释公开金额如何估算，哪些只是提案。
6. 讨论对消费者价格、财政和贸易的影响。
7. 对比政府支付、公司股息和刺激支票。
8. 用简短状态摘要链接到 check 页面。

该页不要大篇幅展开：

- 如何查询支票；
- 直接存款日期；
- 资格细节；
- 诈骗和领取步骤。

推荐内链锚文本：

    For the latest payment and eligibility status, see our
    [tariff dividend check tracker](/articles/tariff-dividend-check/).

### U2.3 tariff-dividend-check 页面

定位：支付状态与官方核验页。

推荐结构：

1. 首屏回答是否成为法律、是否已经发放。
2. 显示 Status checked on YYYY-MM-DD。
3. 核实是否存在法案、行政命令或机构公告。
4. 金额表逐项标注“提案”“报道”或“已确认”。
5. 资格尚未公布时写“未公布”，不自行推断。
6. 列出未来应使用的政府核验渠道。
7. 解释常见诈骗特征。
8. 简短说明政策背景并链接回 explanation 页面。

推荐内链锚文本：

    Read the tariff dividend proposal and funding explanation at
    /articles/tariff-dividend/ for the policy background.

### U2.4 事实来源

优先级：

1. Congress.gov 法案和状态；
2. IRS Newsroom；
3. U.S. Treasury；
4. White House；
5. USTR 或 CBP；
6. AP、Reuters 只作二级补充。

每个高时效结论记录来源名称、具体 URL、访问日期，以及它属于确认事实还是提案。

### U2.5 验收

- 两页 title、description、首段、H2 和 FAQ 不同。
- 完整时间线、金额表、法律流程和诈骗清单不在两页重复。
- 两页分别自 canonical。
- 每页至少一条上下文内链指向另一页。
- 英文和中文的法律状态、金额和日期一致。
- 不使用无法由官方材料证明的 confirmed payment 等措辞。

---

## 3. P1：2025 文章历史归档

### U3.1 文件与 URL

修改：

- src/content/articles/best-dividend-stocks-2025.md
- src/content/translations/zh/articles/best-dividend-stocks-2025.md

保留 URL：

- /articles/best-dividend-stocks-2025/

不要改 URL、不要 301 到 2026 页面、不要把标题年份直接替换成 2026。

### U3.2 标题和描述

推荐方向：

    title: "Best Dividend Stocks of 2025: Historical Review"
    description: "A historical review of 2025 dividend stock performance,
    payout increases and year-end fundamentals. This is not a current
    2026 recommendation."

实际文案可以调整，但必须表达：

- 2025；
- Historical Review 或 Year-in-Review；
- 不是当前 2026 推荐榜单。

### U3.3 正文动作

1. 首段明确这是 2025 年历史复盘。
2. 写明统计截止日期，例如 2025-12-31。
3. 将 current yield 改成 yield as of 指定日期。
4. 将 best stocks now 改成 reviewed for their 2025 record。
5. 核对每只股票的 2025 total return。
6. 说明 total return 是否包含分红再投资。
7. 核实连续增长年数的统计时点。
8. 删除暗示现在应买入的表达。
9. 增加当前常青策略页链接。

### U3.4 验收

- 所有全年数据采用一致口径。
- 不混用 2025 年末收益率和 2026 当前收益率。
- 表格脚注明确数据日期。
- dataAsOf 是实际数据截止日，不只是编辑日。
- H1 和首段明确历史属性。
- 保留 best dividend stocks 2025 的历史搜索意图。

---

## 4. P1：高时效 ETF 数据复核

### U4.1 第一批文件

- ulty-dividend.md
- ulty-dividend-history.md
- qqqi-dividend.md
- qqqi-dividend-history.md
- msty-dividend-income.md
- msty-dividend-history.md
- bito-dividend.md
- jepi-dividend.md
- jepq-dividend.md

英文目录：src/content/articles/  
中文目录：src/content/translations/zh/articles/

### U4.2 每篇逐项核对

1. 基金正式名称和 ticker。
2. 发行日期和策略变更日期。
3. 当前分配频率。
4. 最近 ex-date、record date、payment date。
5. 最近一次每股分配金额。
6. distribution rate。
7. 30-day SEC yield。
8. trailing 12-month distribution yield。
9. 最近 19a-1 通知中的预估 ROC。
10. expense ratio。
11. 拆股或反向拆股历史。
12. total return 的起止日期、复权方法和口径。

### U4.3 指标口径

| 字段 | 正确含义 | 不能表述为 |
|---|---|---|
| Distribution rate | 最近分配金额年化后除以 NAV 或市价 | 保证年收益率 |
| 30-day SEC yield | 标准化净投资收入指标 | 实际现金分配率 |
| Trailing distribution yield | 过去 12 个月分配除以当前价格 | 下一年预测收益率 |
| ROC | 资本返还分类，19a-1 通常是估算 | 最终税务分类 |

### U4.4 来源

优先使用：

- 发行商基金页；
- prospectus 或 fact sheet；
- 官方 distribution history；
- SEC EDGAR；
- 19a-1 notice；
- 年终税务分类文件。

第三方行情页只用于交叉检查，不作为关键事实的唯一来源。

### U4.5 Front matter

每篇确认：

    dataAsOf: "YYYY-MM-DD"
    modDate: YYYY-MM-DD
    methodology: "说明计算口径、时间范围和限制"
    sources:
      - name: "来源名称"
        url: "https://..."
        accessed: YYYY-MM-DD

### U4.6 验收

- 摘要、正文、表格和 FAQ 使用同一组数字。
- 同一指标不出现两个不一致数值。
- 数字旁或表格脚注能判断数据日期。
- 不使用 safe、guaranteed、stable income 等绝对承诺。
- 拆股后的历史价格和分配明确是否复权。
- 英文改动已同步到中文正文。

---

## 5. P0：同步中文页面

### U5.1 当前机制

- 英文正文：src/content/articles/*.md
- 中文正文：src/content/translations/zh/articles/*.md
- 中文模板：src/pages/zh/articles/[...slug].astro
- 后备脚本：scripts/build-zh-site.mjs

中文模板会读取英文部分元数据，但正文仍来自独立中文 Markdown。设置 OPENAI_API_KEY 并构建，不保证已有中文正文自动更新。

### U5.2 同步步骤

1. 并排打开英文和中文 Markdown。
2. 对照 title、description、首段、数字、日期、表格和 FAQ。
3. 中文可以自然改写，但 ticker、金额、百分比和日期必须一致。
4. 英文新增或删除内链时同步中文链接。
5. 中文内部 URL 使用 /zh/ 前缀并以 / 结尾。
6. 外部官方链接保持原地址。

重点抽查：

- ULTY
- BITO
- QQQI
- high-dividend-stocks
- MSTY
- tariff-dividend
- tariff-dividend-check
- best-dividend-stocks-2025

### U5.3 验收

- 中文正文没有大段英文残留。
- 数据日期、金额和百分比与英文一致。
- 英文删除的错误结论，中文也已删除。
- 中文内链不含 /zh/zh/。
- 中文 canonical 指向自己的 /zh/.../。
- 英文和中文 hreflang 互相返回。

构建成功只能证明结构正确，不能证明内容事实一致，必须人工抽查。

---

## 6. P0：构建和 SEO 验证

### U6.1 Node.js

项目要求 Node.js >= 22.12.0。

    node --version
    npm --version

版本不足时先切换 Node，再构建。

### U6.2 完整构建

    npm run build

该命令依次执行：

1. Astro 构建；
2. 中文站点处理；
3. sitemap 生成；
4. SEO 构建验证。

单独复查：

    npm run seo:validate

若确认脚本可用：

    node scripts/audit-jsonld.mjs

### U6.3 必须通过

- 构建退出码为 0。
- 中文页面正常生成。
- sitemap 成功生成。
- SEO 验证无错误。
- sitemap 没有非 www URL。
- sitemap 页面 URL 全部以 / 结尾。
- robots.txt 指向 https://www.dividend01.com/sitemap.xml。
- 不存在 /zh/zh/ canonical 或内部链接。
- canonical 不指向 HTTP、非 www 或重定向 URL。

### U6.4 抽查构建产物

- dist/articles/tariff-dividend/index.html
- dist/articles/tariff-dividend-check/index.html
- dist/articles/best-dividend-stocks-2025/index.html
- dist/articles/ulty-dividend/index.html
- dist/zh/articles/ulty-dividend/index.html
- dist/zh/articles/tariff-dividend/index.html
- dist/sitemap.xml
- dist/robots.txt

检查 title、description、canonical、hreflang、H1、dataAsOf、内部链接和 JSON-LD URL。

结构化数据必须检查渲染后的 script[type="application/ld+json"]，不能只依据普通文本抓取。

---

## 7. P0：提交、推送和部署

### U7.1 提交前

    git status --short
    git diff --cached --stat
    git diff --cached

确认：

- 只有计划内文件已暂存。
- 没有密钥、账号、Cookie 或 Token。
- 没有临时预览和用户草稿。
- 完整构建已通过。

### U7.2 提交和推送

示例提交：

    git commit -m "feat: refine SEO content and canonical validation"

提交信息必须与实际改动一致。

推送：

    git push origin main

如果当前不在 main，先确认部署分支。

### U7.3 线上抽查

- https://www.dividend01.com/
- https://www.dividend01.com/sitemap.xml
- https://www.dividend01.com/robots.txt
- https://www.dividend01.com/articles/tariff-dividend/
- https://www.dividend01.com/articles/tariff-dividend-check/
- https://www.dividend01.com/articles/best-dividend-stocks-2025/
- https://www.dividend01.com/articles/ulty-dividend/
- https://www.dividend01.com/zh/articles/ulty-dividend/

若验证脚本已确认可用：

    node scripts/verify-canonical-live.mjs

线上验收：

- 规范页面返回 200。
- HTTP 和非 www 为 301。
- /zh/zh/ 单次 301 到正确中文页。
- www sitemap 返回 200 和 XML。
- canonical 与最终地址一致。
- 线上正文包含本轮修改。

### U7.4 通知 Codex

提供：

- Git commit ID；
- 部署完成时间；
- sitemap 实际 URL 数量；
- 修改的英文页面；
- 同步的中文页面；
- 未解决的线上错误。

收到后 Codex 开始执行 GSC。

---

## 8. P2：Cloudflare

### U8.1 Email Address Obfuscation

目标：判断 /cdn-cgi/l/email-protection 是历史报告还是当前仍会生成。

步骤：

1. 在源码中搜索明文邮箱和 mailto:。
2. 打开含邮箱的线上页面。
3. 检查渲染后链接是否变成 /cdn-cgi/l/email-protection。
4. 记录触发页面，不能只检查本地 dist/。
5. 查看 Cloudflare Email Address Obfuscation 状态。

决策：

- 线上不再产生：保持不变，等待 GSC 更新。
- 仍产生且可使用联系表单：调整联系方式。
- 仍产生且功能无价值：关闭 Email Address Obfuscation。

禁止把 /cdn-cgi/l/email-protection 重定向到首页。

将检查结果告诉 Codex，由 Codex 决定何时启动 404 验证。

### U8.2 SSL

Cloudflare → dividend01.com → SSL/TLS → Overview。

- 首选 Full (strict)。
- 不使用 Flexible。
- 源站证书有效并覆盖主机名。

验收：

- HTTPS 正常。
- HTTP 301 到 HTTPS。
- 没有循环或 525/526。

### U8.3 HSTS

HSTS 是安全增强，不是收录修复。所有使用中的子域均支持 HTTPS 后再启用。

第一阶段：

- max-age=86400；
- 不开启 includeSubDomains；
- 不开启 preload。

观察至少一天，再逐步增加到一周、一个月或六个月。includeSubDomains 和 preload 必须单独评估。

### U8.4 Redirect Rules

保持：

1. /zh/zh/ 直接修正到 www 的 /zh/。
2. 非 www 规范到 www。
3. 页面缺尾斜杠时增加 /。
4. 静态资源不错误增加尾斜杠。

修改前检查多跳、循环、查询参数丢失和资源路径错误。没有新问题时不要频繁调整。

---

## 9. P3：ETF 数据资产

### U9.1 第一版范围

先选 5–10 个已有内容和明确需求的 ticker，例如 ULTY、QQQI、SPYI、JEPI、JEPQ、MSTY、BITO。最终名单以数据可得性和 GSC 查询为准。

候选路径：/data/dividend-calendar/

字段：

- ticker、基金名、发行商；
- 分配频率；
- ex-date、record date、payment date；
- 最近分配金额；
- distribution rate；
- 30-day SEC yield；
- 19a-1 预估 ROC；
- expense ratio；
- 官方来源和核验日期。

### U9.2 方法说明

页面必须说明：

- 日期时区；
- 金额是否拆股复权；
- distribution rate 使用 NAV 还是市价；
- ROC 是估算还是最终分类；
- 更新频率；
- 缺失数据处理；
- 用户纠错方式。

### U9.3 验收

- 每条数据至少一个官方来源。
- 所有字段有核验日期。
- 过期数据明确标记。
- 移动端表格可用。
- 有独特方法说明，不是复制发行商表格。
- JSON-LD 与可见内容一致。
- CSV/JSON 与页面一致。
- Dataset schema 不作为排名保证。

---

## 10. P3：外链 outreach

准备：

- 数据页 URL；
- 方法说明；
- CSV；
- 可引用图表；
- 最后更新时间；
- 推荐署名方式。

目标表记录网站、作者、相关页面、联系方式、数据缺口、可提供价值、联系日期、回复和获得链接。

优先：

1. 独立 ETF 博客和 Substack；
2. 研究社区和开源金融项目；
3. 财经数据工具目录；
4. 有引用需求的记者与分析师。

原则：

- 针对具体文章联系。
- 提供可直接引用的数据。
- 写明来源和更新时间。
- 不购买不透明链接。
- 不做站群交换。
- 不批量使用相同锚文本。

月度记录发送、送达、回复、链接数量、链接质量和引荐流量。外链不作为页面上线硬性验收。

---

## 11. 配合 CTR 测试

Codex 导出 GSC 数据后，每轮选择 3–5 页。

修改前记录：

- 原 title 和 description；
- 修改日期；
- 主要查询；
- 最近 28 天展示、点击、CTR、排名；
- 修改理由。

规则：

- 标题匹配真实意图。
- 关键词自然靠前。
- 不使用无法证明的 best、safe、guaranteed。
- 不用年份制造虚假时效。
- 不同时批量修改正文、URL、标题和 canonical。

观察 14–28 天，同时看 CTR、排名、展示量、查询构成和索引状态。

---

## 12. 最终检查表

### 可以通知 Codex 执行 GSC

- [ ] 已确认生产文件范围。
- [ ] 准备请求收录的页面已完成内容修改。
- [ ] 高时效英文数据已核实。
- [ ] 中文正文已同步。
- [ ] npm run build 成功。
- [ ] SEO 验证成功。
- [ ] Git 提交和推送完成。
- [ ] 线上部署完成。
- [ ] www sitemap 返回 200。
- [ ] 重点规范页面返回 200。
- [ ] 已提供 commit ID、部署时间和页面清单。

### 不阻塞 sitemap 提交的长期工作

- [ ] HSTS 长期观察。
- [ ] ETF 派息日历。
- [ ] ETF 历史数据库。
- [ ] 外链 outreach。
- [ ] CTR 后续测试。

### 完成通知模板

    站点修改已完成并部署：
    - Git commit：
    - 部署完成时间：
    - sitemap URL 数量：
    - 已修改英文页面：
    - 已同步中文页面：
    - Email Protection 检查结果：
    - 当前未解决的问题：

    请按 SEO-GSC-CODEX-EXECUTION.md 开始执行 GSC。
