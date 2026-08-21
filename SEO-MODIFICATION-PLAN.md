# Dividend01.com SEO 修改方案

基于：[SEO-REVIEW-REPORT.md](./SEO-REVIEW-REPORT.md)  
目标：在不继续无差别增加文章的前提下，先修复索引、金融可信度和关键词内耗，再建立可持续的内容与外链增长。

## 0. 修改原则

1. 先处理 Crawlability / Indexation，再处理内容扩张。
2. 金融内容只展示可验证的作者、审核、来源和数据日期，不虚构机构、经历或案例。
3. 每个页面只负责一个主要搜索意图，避免多个页面争夺同一关键词。
4. 所有实时或时效性数字都必须有 `dataAsOf`、来源和更新策略。
5. 本阶段只做 SEO 相关修改，不改变计算器的金融计算逻辑，除非另行审计公式。

### 用户视角的核心判断

用户来到这个网站，不是为了阅读一堆“股息”关键词，而是为了完成一个具体任务：

| 用户任务 | 用户最先想知道什么 | 页面必须先给什么 | 主要 SEO 机会 |
|---|---|---|---|
| 初学者理解股息 | 股息是什么、何时支付、会不会亏 | 直接定义、关键日期、风险 | `what are dividends`、PAA、定义型摘要 |
| 查询某只 ETF | 当前分配多少、历史如何、风险是什么 | 数据日期、历史表、分配来源、总回报 | 实体词、数据新鲜度、官方来源 |
| 寻找高收益 | 高收益是否能持续 | 覆盖率、行业指标、减派息风险 | 商业调查词、比较表、原创筛选方法 |
| 计算收入 | 投入多少钱能得到多少现金 | 输入、公式、假设、税前/税后边界 | 工具页、长尾问题、可引用计算结果 |
| 中文用户阅读 | 中文内容是否完整可信 | 独立中文 URL、完整翻译、来源和日期 | `/zh/` 索引、hreflang、本地化内容 |

每次修改都要回答两个问题：

1. 用户能否比现在更快得到决定所需的信息？
2. 搜索引擎能否更准确地判断这页解决了哪个问题、适合哪类人？

如果一个修改只增加关键词，却没有改善这两个问题，就不应列为优先工作。

## 一、P0：上线前必须完成

### P0-1：修复中文页面的索引架构

当前项目已经通过 `scripts/build-zh-site.mjs` 生成 `dist/zh/`，因此优先改造现有生成流程，不另建一套重复的文章页面。

涉及文件：

- `scripts/build-zh-site.mjs`
- `src/layouts/BaseLayout.astro`
- `src/layouts/ArticleLayout.astro`
- `src/pages/articles/[...slug].astro`
- `public/sitemap.xml` 或新增 Sitemap 生成脚本

实施内容：

1. 中文文章输出到 `/zh/articles/{slug}/`，每个 URL 返回完整中文主体内容。
2. 中文页面的 `<html lang>` 设为 `zh-CN`。
3. 中文页面 canonical 指向自身，例如：`https://www.dividend01.com/zh/articles/schd-dividend/`。
4. 英文与中文页面互相输出 hreflang：

   - 英文：`en`、`zh-CN`、`x-default`
   - 中文：`en`、`zh-CN`、`x-default`

5. 同步改写中文页面的 `og:url`、`og:locale`、JSON-LD 中的 `url`、`mainEntityOfPage` 和 Breadcrumb URL，不能只翻译可见文字。
6. Sitemap 改为构建时生成，纳入全部英文和中文 canonical URL；不再手工维护固定 URL 清单。
7. 对没有中文翻译的页面，不生成中文 URL，也不输出对应 hreflang。
8. 语言切换链接必须指向对应语言的真实 URL，而不是当前 URL 加前端状态切换。

验收标准：

- `dist/zh/articles/` 下存在与英文文章一一对应的 HTML。
- 每个中文 HTML 只有一个 self-canonical。
- 英文/中文页面都包含完整、对称的 hreflang 集合。
- Sitemap 中中文 URL 数量与实际生成页面数量一致。
- Google Rich Results Test 能识别 Article 和 Breadcrumb。
- 不出现英文 canonical 指向中文页、中文 canonical 指向英文页、hreflang 单向链接或 404 目标。

### P0-2：统一金融文章的作者、审核和数据字段

涉及文件：

- `src/content.config.ts`
- `src/layouts/ArticleLayout.astro`
- `src/pages/about/author.astro`
- `src/pages/editorial-standards.astro`
- `src/content/articles/*.md`

建议把 schema 从“有默认值即可”改成“金融文章关键字段必须明确”：

```ts
author: z.string(),
authorRole: z.string(),
reviewer: z.string(),
reviewerRole: z.string(),
reviewDate: z.coerce.date(),
dataAsOf: z.string(),
methodology: z.string(),
sources: z.array(...).min(1),
```

迁移规则：

1. 只有 Henry Zhou 一人完成研究和核验，统一写“Written and fact-checked by Henry Zhou”，不要使用无法验证的 `Content Review Board`。
2. 如果确有第二位审核人，增加姓名、角色和独立作者页。
3. `reviewDate` 表示事实核验日期，`modDate` 表示页面内容修改日期，两者不要混用。
4. `dataAsOf` 要显示在文章首屏和研究说明区。
5. `sources` 至少包含一个第一方来源：发行人、基金管理公司、SEC、IRS、指数编制方或政府机构。
6. 二级数据站可以用于交叉核验，但不能在关键事实中替代主要来源。

验收标准：

- 38 篇英文文章全部通过内容 schema 校验。
- 每篇金融文章首屏可见作者、角色、更新时间、数据截止日期。
- 每篇文章的来源区可追溯到具体 URL 和访问日期。
- 作者页能解释研究范围、数据流程、利益冲突和联系方式。

### P0-3：处理第一人称故事和“审阅委员会”表达

涉及文件：

- `src/content/articles/*.md`
- `src/content/translations/zh/articles/*.md`
- `src/layouts/BaseLayout.astro`
- `src/layouts/ArticleLayout.astro`

实施内容：

1. 搜索并建立清单：`I've held`、`I got into`、`my position`、`real investor story`、`Content Review Board`。
2. 真实案例：补充案例来源、授权状态、时间范围和是否为作者本人经历。
3. 假设案例：改为 `Illustrative scenario` / `假设情景`，删除引号和“真实投资者”措辞。
4. 无法验证的案例：删除，改用公开数据和可复算示例。
5. 全站把“Content Review Board”替换为真实、准确的审核表述。

验收标准：金融读者不会把假设情景误认为作者本人持仓或第三方证言。

### P0-4：统一 GA4 与隐私政策

涉及文件：

- `src/layouts/BaseLayout.astro`
- `src/layouts/ArticleLayout.astro`
- `src/pages/privacy.astro`

当前页面直接加载 Google Analytics，但隐私政策写的是不使用跟踪 Cookie。二者需要统一：

- 方案 A：增加合规的分析同意机制，未同意前不加载 GA4。
- 方案 B：采用不依赖 Cookie 的匿名统计，并在隐私政策中准确说明。
- 方案 C：如果暂时不需要统计，移除 GA4。

验收标准：隐私政策、实际请求、Cookie 行为和站点部署环境描述一致。

## 二、P1：首轮排名优化

### P1-0：先改用户路径，再改关键词

首页、文章页和工具页应形成清晰的三段式路径：

```text
搜索问题
  ↓
首屏直接答案 + 数据日期 + 风险边界
  ↓
证据 / 计算 / 方法
  ↓
一个明确的下一步：计算、筛选或阅读相关深度文章
```

首屏统一规范：

- 标题下方先放一句可独立引用的答案，不先放品牌口号。
- 对实时数据先显示“数据截至”日期，而不是只显示“Updated”。
- 对金融结论先写适用条件和不适用人群。
- 对计算器先显示输入项、计算公式和“不包含什么”。
- 对表格在移动端提供卡片或横向滚动，并固定关键字段：ticker、数据日期、收益率、覆盖指标、主要风险。
- 页面末尾只保留一个主 CTA，避免用户在“股票列表 / 计算器 / 策略 / 文章”之间失去方向。

SEO 对应关系：首屏直接答案有利于摘要和 AI 引用；数据日期和来源增强时效性与 E-E-A-T；清晰 CTA 和相关正文链接改善用户继续浏览路径；移动端可读性减少返回搜索结果的概率。

### P1-1：明确关键词地图，消除页面内耗

新增文件：

- `docs/keyword-map.md`

建议页面职责：

| 页面 | 唯一主意图 | 目标词 | 不再争夺 |
|---|---|---|---|
| `/topics/dividend-investing-basics/` | 总入口/学习路线 | dividend investing guide | best dividend stocks |
| `/articles/what-are-dividends/` | 定义解释 | what are dividends | dividend investing |
| `/articles/dividend-yield/` | 公式与风险 | dividend yield formula | high dividend stocks |
| `/articles/dividend-dividend-stocks/` | 筛选方法 | how to screen dividend stocks | best dividend stocks |
| `/articles/high-dividend-stocks/` | 高收益与风险 | high dividend stocks | highest dividend stocks |
| `/articles/highest-dividend-stocks/` | 当前清单/数据 | highest-yield dividend stocks | high dividend stocks |
| `/articles/best-dividend-stocks-for-beginners/` | 初学者选择框架 | best dividend stocks for beginners | general best stocks |
| `/stocks/` | 工具/精选列表 | dividend stock screener | editorial articles |

每个页面在 frontmatter 增加 `primaryKeyword`、`searchIntent`、`canonicalHub`，方便后续自动检查。

验收标准：任意两个页面不会拥有完全相同的主关键词、H1 和搜索意图；相近页面在首屏明确“本页解决什么问题”。

### P1-2：更新 `high-dividend-stocks`

涉及文件：

- `src/content/articles/high-dividend-stocks.md`
- `src/content/translations/zh/articles/high-dividend-stocks.md`

修改顺序：

1. 首段加入“高收益不等于高回报”的直接结论。
2. 新增 `Dividend Yield vs. Total Return`。
3. 新增 `Coverage Metrics by Sector`，区分普通公司、REIT、BDC、MLP。
4. 新增 `Distribution Rate, SEC Yield, and Trailing Yield`。
5. 新增 `How Taxes Change High-Yield Income`，先限定美国税务语境。
6. 增加数据表列：数据日期、数据来源、覆盖指标、主要风险。
7. 将“真实投资者故事”改成经验证案例或假设情景。
8. 只保留一个主要 CTA：进入筛选工具或计算器。

用户角度的页面顺序应调整为：

1. 先回答“高股息大约是多少，但为什么不能只看数字”。
2. 再给可扫描的比较表。
3. 再解释普通公司、REIT、BDC、MLP 为什么不能用同一把尺子。
4. 再解释税后收入和总回报。
5. 最后才给股票/ETF 示例，并明确示例不是推荐。

不要把文章做成更长的股票清单。用户真正需要的是“如何判断”，而不是更多 ticker。

建议 SEO 元数据：

- Title：`High Dividend Stocks: 4%–8% Yield and Risk Guide`
- Description：`Compare high dividend stocks by yield, payout coverage, sector risk, and dividend-cut history—so you can avoid yield traps.`

验收标准：页面覆盖收益率、覆盖率、行业分母、税务、总回报和风险，且每个数字可追溯。

### P1-3：更新初学者页面

涉及文件：

- `src/content/articles/best-dividend-stocks-for-beginners.md`
- `src/content/translations/zh/articles/best-dividend-stocks-for-beginners.md`

修改内容：

- 将“只买 SCHD”改为有适用条件的研究结论。
- 把“最适合低维护 / 最适合股息增长 / 最适合学习单只股票”拆成不同类别。
- 候选表增加费用、分散度、收益来源、税务和最大风险。
- $5,000 案例展示本金、价格、分配、再投资、税前/税后假设。
- 增加“不适合谁”小节，避免金融内容的无条件推荐语气。

用户完成页面后应该能回答：

- 我是要现金收入，还是长期总回报？
- 我能承受单只股票减派息吗？
- ETF 的分配来源和税务是否适合我？
- 我应该先用计算器，还是先学会筛选？

如果页面仍然只能给出“买哪个 ticker”，就没有真正解决初学者任务，也不符合金融 YMYL 内容需要的谨慎程度。

### P1-4：重新分工三个 SCHD 页面

涉及文件：

- `src/content/articles/schd-dividend.md`
- `src/content/articles/schd-dividend-history.md`
- `src/content/articles/schd-dividend-yield.md`
- 对应中文翻译文件

页面职责：

- `schd-dividend`：基金机制、适合谁、与 VIG/VYM/SPYD 的比较。
- `schd-dividend-history`：年度/季度分配历史、拆分调整、历史时间线。
- `schd-dividend-yield`：收益率公式、当前值变化、价格与分配的关系。

每页增加一个首屏提示：`Compare this page with SCHD history / yield analysis`，并使用描述性锚文本互链。

### P1-5：优化定义页 Featured Snippet

涉及文件：

- `src/content/articles/what-are-dividends.md`
- 对应中文翻译文件

修改内容：

- H2 改为 `What Are Dividends?`。
- H2 后紧接 40–60 词独立答案块。
- 添加 `When do dividends get paid?`、`What is the ex-dividend date?`、`Are dividends guaranteed?`。
- 首段链接 Investor.gov，后文再链接收益率、筛选和 DRIP 深入文章。

验收标准：用户只读 H2 和第一段即可得到完整定义；页面可自然回答 PAA 问题。

这里的目标不是单纯抢摘要，而是让摘要点击后的页面仍然有价值。定义后必须紧接“关键日期、风险、下一步学习”，不能用 40–60 词的答案把用户引入一篇没有新增信息的薄页面。

### P1-6：新增税务内容

新增文件：

- `src/content/articles/dividend-tax-calculator.md`
- `src/content/translations/zh/articles/dividend-tax-calculator.md`

建议结构：

1. How the Dividend Tax Calculator Works
2. Qualified vs. Ordinary Dividends
3. Taxable Brokerage Account vs. IRA
4. 1099-DIV
5. Return of Capital
6. $10,000 annual distribution example
7. What the calculator cannot estimate

必须限定：美国联邦税务示例；非美国居民、州税、基金具体税务分类需要单独说明。来源优先 IRS、Investor.gov 和基金发行人文件。

## 三、P2：主题权威与外部增长

### P2-1：建立 Dividend Investing Hub

涉及文件：

- `src/pages/topics/dividend-investing-basics.astro`
- `src/content/articles/*.md`

Hub 负责总览，不在每个子主题展开全部细节。首轮链接到：股息定义、收益率、筛选、DRIP、税务、除息日、总回报、高股息风险、ETF 分配来源、REIT/BDC 指标。

互链规则：

- 每个 spoke 在正文前 30% 链回 hub。
- Hub 链到所有已发布 spoke。
- 相关 spoke 之间只做 2–3 个自然互链。
- 不再让每篇文章同时链接 `/stocks/`、`/calculator/`、`/strategy/` 和多个无关文章。

### P2-2：建立原创数据资产

建议新增：

- SCHD 2011–2026 分配历史、拆分调整和收益率区间数据表。
- 高收益 ETF 的 trailing yield / SEC yield / distribution rate / total return 对照表。
- 可下载 CSV 或 HTML 表格，并写明数据日期和计算方法。

目标：让其他金融教育网站有理由引用，而不是只推广文章链接。

### P2-3：自然链接建设

初期只做相关性强的链接：

- 金融教育网站。
- ETF 与退休规划内容网站。
- 数据分析、个人理财和投资工具资源页。
- 共同研究、数据引用、专家访谈和播客节目页。

避免：购买链接、PBN、批量目录、过度精确匹配锚文本、短期大量外链。

### P2-4：以用户问题组织内容，而不是以关键词组织内容

内容集群的发布顺序应由用户旅程决定：

1. 先发布定义和基础风险：股息、收益率、除息日、总回报。
2. 再发布行动工具：筛选方法、计算器、税务计算器。
3. 再发布实体研究：SCHD、JEPQ、QQQI、SPYI 等 ETF。
4. 最后发布高收益、政策热点和短期数据页面，并明确更新时间和失效条件。

这样做的好处是：新用户有学习路径，搜索引擎能看到主题之间的上下位关系，旧文章也能自然把用户带到工具和方法页。

## 四、实施顺序与交付物

### Sprint 1：索引修复

交付物：

- 中文页面 canonical/hreflang 修复。
- 动态 Sitemap。
- 语言切换 URL 修复。
- 英文/中文页面 HTML 验证脚本。

### Sprint 2：金融可信度

交付物：

- 新内容 schema。
- 38 篇文章 frontmatter 补齐。
- 作者页和编辑标准页改写。
- 第一人称故事清理表。
- GA4/隐私政策一致性修复。

### Sprint 3：重点页面

交付物：

- `high-dividend-stocks` 更新。
- `best-dividend-stocks-for-beginners` 更新。
- 三个 SCHD 页面重新分工。
- `what-are-dividends` snippet 优化。

### Sprint 4：新增内容与集群

交付物：

- `dividend-tax-calculator`。
- `qualified-vs-ordinary-dividends` 或并入税务文章。
- `dividend-investing-basics` hub 与内部链接图。

### Sprint 5：验证与增长

交付物：

- Sitemap、robots、canonical、hreflang、Schema 检查结果。
- Google Search Console 提交和覆盖率基线。
- PageSpeed / Core Web Vitals 基线。
- 原创数据资产。
- 外链目标清单。

## 五、验收清单

### 技术验收

- [ ] 英文页面均为 200、可索引、self-canonical。
- [ ] 中文页面均为 200、可索引、self-canonical。
- [ ] 英文/中文 hreflang 双向返回。
- [ ] Sitemap 只包含 canonical、indexable、200 URL。
- [ ] Sitemap 中没有重复 URL、错误 trailing slash 或 `pages.dev` URL。
- [ ] JSON-LD 中 Article、Breadcrumb、author、dateModified 和 URL 一致。
- [ ] 移动端无横向滚动，图片有尺寸和合适的 alt。
- [ ] GA4 与隐私政策一致。

### 金融内容验收

- [ ] 每篇文章有真实作者和审核信息。
- [ ] 每个时效数字有 `dataAsOf` 和来源。
- [ ] 不把假设情景写成真实经历。
- [ ] 不把收益率写成保证回报。
- [ ] 不把 `distribution rate` 写成 `total return`。
- [ ] REIT、BDC、MLP 使用合适的行业指标。
- [ ] 税务内容标注适用地区和假设。

### SEO 验收

- [ ] 每个页面有唯一主关键词和搜索意图。
- [ ] 相近页面有明确的 canonical hub 和互链关系。
- [ ] 标题长度与 SERP 点击意图匹配。
- [ ] 重要 H2 后有直接答案或结构化表格。
- [ ] Hub 和 spoke 之间形成可爬取的正文链接图。
- [ ] 首轮修改后等待 2–4 周，再用 Search Console 评估 CTR、展示和排名变化。

### 用户体验验收

- [ ] 用户在手机上打开页面后，首屏 5 秒内能知道这页回答什么问题。
- [ ] 用户能看到数据截至日期、来源和关键风险，而不是只看到收益率。
- [ ] 表格在手机上可读，核心字段不需要反复横向寻找。
- [ ] 用户能从定义页进入公式页，从公式页进入计算器，从计算器进入风险/策略页。
- [ ] 每个页面都有明确的“不适合谁”或“不能据此得出的结论”。
- [ ] 中文用户看到的是完整翻译，不是仅把导航翻译后仍保留英文主体。
- [ ] 任何“best / safe / reliable / should you buy”结论都能追溯到条件、数据和方法。
- [ ] 文章没有用虚构的第一人称故事制造信任。

### 不建议做的 SEO 修改

- 不为了密度重复 `dividend`、`yield`、`stocks`。
- 不把所有文章都改成“Best X in 2026”。
- 不用 FAQ Schema 代替真正的 FAQ 内容。
- 不用 `lastmod` 伪装新鲜度；只有实质修改才更新日期。
- 不把二级数据站的数字包装成官方数据。
- 不把投资教育内容写成个性化买卖建议。
- 不在没有真实经验时增加“我持有”“我的投资结果”等叙述。

## 六、建议的执行判断

第一阶段不要直接大规模改写 38 篇文章，也不要先做外链。先完成 P0-1、P0-2、P0-3，然后再按照用户任务改 4 个重点页面。每个页面修改都要同时完成三件事：首屏更快回答问题、证据更容易核验、下一步更明确。这样既改善真实用户体验，也让 canonical、作者、数据日期、来源、中文 URL 和内部链接一次性进入正确模板，避免重复返工。
