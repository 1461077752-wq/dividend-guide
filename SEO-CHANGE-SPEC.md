# Dividend01.com SEO 修改实施文档

版本：1.0  
状态：待实施  
依据：[SEO 审阅报告](./SEO-REVIEW-REPORT.md)与[SEO 修改方案](./SEO-MODIFICATION-PLAN.md)  
适用范围：Dividend01.com 英文站、`/zh/` 中文站、文章模板、内容数据与构建流程

## 1. 修改目标

本轮修改不以“增加更多关键词”为目标，而是让用户和搜索引擎都能更快确认：

1. 当前页面解决什么问题；
2. 数据截至何时、来自哪里；
3. 内容由谁撰写和核验；
4. 英文页与中文页分别对应哪个规范 URL；
5. 用户看完后应执行哪个下一步。

核心结果指标：

- 中文页面可被独立发现、抓取和索引；
- 金融文章的作者、日期、来源与方法可核验；
- 同主题页面不再争夺同一个搜索意图；
- 核心页面首屏能够直接回答用户问题；
- 网站声明、统计脚本和实际 Cookie 行为一致。

## 2. 范围与非目标

### 本次修改范围

- 多语言 canonical、hreflang、Open Graph 和结构化数据；
- 自动生成 Sitemap 及构建后 SEO 校验；
- 金融文章 frontmatter、作者信息、来源与审核说明；
- 核心文章的信息架构、首屏答案、表格与 CTA；
- 首页、文章页、专题页、计算器之间的用户路径；
- GA4 同意机制和隐私政策一致性。

### 本次不包含

- 不修改股息计算器的金融公式；公式应另做专项审计；
- 不虚构审核人员、投资经历、持仓、用户证言或实时行情；
- 不批量生成低差异城市页、股票页或关键词变体页；
- 不把 Schema 标记当作排名保证；
- 不在缺少可靠数据源时展示“实时”收益率。

## 3. 实施优先级

| 顺序 | 修改项 | 级别 | 阻塞关系 |
|---|---|---:|---|
| 1 | SEO-001 多语言 URL 与元数据 | P0 | 阻塞 Sitemap 与中文收录 |
| 2 | SEO-002 自动 Sitemap 与构建校验 | P0 | 依赖 SEO-001 |
| 3 | SEO-003 金融内容字段与文章模板 | P0 | 阻塞内容批量迁移 |
| 4 | SEO-004 可信度与案例清理 | P0 | 依赖 SEO-003 的展示规则 |
| 5 | SEO-005 分析脚本与隐私一致性 | P0 | 可并行 |
| 6 | SEO-006 关键词地图与页面职责 | P1 | 阻塞核心文章重写 |
| 7 | SEO-007 核心页面内容重构 | P1 | 依赖 SEO-006 |
| 8 | SEO-008 内链与用户下一步 | P1 | 依赖 SEO-006、007 |
| 9 | SEO-009 主题集群与原创数据资产 | P2 | P0/P1 稳定后开始 |

---

## 4. SEO-001：多语言 URL 与元数据

### 用户结果

中文用户打开中文链接后，看到完整中文正文，切换语言时到达同一内容的英文版本，而不是仅在浏览器里替换少量文字。

### SEO 结果

每种语言有独立、自指的 canonical；英文与中文页面通过对称 hreflang 建立一一对应关系。

### 涉及文件

- `scripts/build-zh-site.mjs`
- `src/layouts/BaseLayout.astro`
- `src/layouts/ArticleLayout.astro`
- `src/pages/articles/[...slug].astro`

### URL 规则

对于英文路径 `/{path}/`：

```text
英文 URL：https://www.dividend01.com/{path}/
中文 URL：https://www.dividend01.com/zh/{path}/
x-default：https://www.dividend01.com/{path}/
```

首页对应关系：

```text
英文：https://www.dividend01.com/
中文：https://www.dividend01.com/zh/
```

规则：

1. 英文页面 canonical 指向英文自身；中文页面 canonical 指向中文自身。
2. 页面只有存在完整中文版本时，才输出 `zh-CN` alternate。
3. 英文和中文页面必须同时输出 `en`、`zh-CN`、`x-default`，并互相指向。
4. URL 统一保留尾斜杠，元数据、Sitemap 和站内链接不得混用两种格式。
5. 不使用跨语言 canonical。

### 模板接口

为 `BaseLayout.astro` 和 `ArticleLayout.astro` 增加统一的语言参数：

```ts
interface LocaleAlternate {
  hreflang: 'en' | 'zh-CN' | 'x-default';
  href: string;
}

interface SeoLocaleProps {
  locale: 'en' | 'zh-CN';
  canonicalUrl: string;
  alternates?: LocaleAlternate[];
}
```

页面 `<head>` 输出示例：

```html
<link rel="canonical" href="https://www.dividend01.com/zh/articles/what-are-dividends/">
<link rel="alternate" hreflang="en" href="https://www.dividend01.com/articles/what-are-dividends/">
<link rel="alternate" hreflang="zh-CN" href="https://www.dividend01.com/zh/articles/what-are-dividends/">
<link rel="alternate" hreflang="x-default" href="https://www.dividend01.com/articles/what-are-dividends/">
```

### 中文构建脚本修改

`scripts/build-zh-site.mjs` 在生成每个中文 HTML 时必须同步修改：

- `<html lang="zh-CN">`；
- canonical；
- hreflang 集合；
- `og:url`；
- `og:locale` 为 `zh_CN`，并加入 `og:locale:alternate` 为 `en_US`；
- JSON-LD 的 `url`、`@id`、`mainEntityOfPage`、Breadcrumb `item`；
- JSON-LD 的 `inLanguage` 为 `zh-CN`；
- 语言切换链接；
- 所有可对应的站内链接改为 `/zh/` 目标。

JSON-LD 应解析为对象后递归更新 URL，再序列化输出；不要只靠针对单个字段的字符串替换。无法解析的 JSON-LD 必须让构建失败并显示文件路径。

### 验收标准

- 任取 5 组英文/中文页面，canonical 均为自指。
- 每组 hreflang 完整、对称，并且所有目标返回 200。
- 中文页面源码中不残留英文 canonical 或英文 `mainEntityOfPage`。
- 语言切换在禁用 JavaScript 后仍可正常使用。
- 未翻译页面不生成空壳中文 URL。

---

## 5. SEO-002：自动 Sitemap 与构建后校验

### 涉及文件

- 新增 `scripts/generate-sitemap.mjs`
- 新增 `scripts/validate-seo-build.mjs`
- 修改 `package.json`
- 停止手工维护 `public/sitemap.xml`

### 构建流程

```text
astro build
  → build-zh-site.mjs
  → generate-sitemap.mjs
  → validate-seo-build.mjs
```

建议脚本：

```json
{
  "scripts": {
    "build": "astro build && node scripts/build-zh-site.mjs && node scripts/generate-sitemap.mjs && node scripts/validate-seo-build.mjs",
    "seo:validate": "node scripts/validate-seo-build.mjs"
  }
}
```

### Sitemap 生成规则

1. 从 `dist/**/*.html` 发现实际页面，不从手工 URL 数组生成。
2. 排除 404、带 `noindex`、重定向目标错误和非规范副本。
3. 每个 `<url>` 使用页面 self-canonical 作为 `<loc>`。
4. 有翻译的页面写入英文、中文及 `x-default` alternate。
5. `lastmod` 来自文章 `modDate`；非文章页使用构建日期或可追溯的内容更新时间。
6. 输出到 `dist/sitemap.xml`，确保部署的是最终版本。

### 自动校验项目

`validate-seo-build.mjs` 发现以下问题时返回非零退出码：

- HTML 缺少 title、description、H1 或 canonical；
- 一个页面存在多个 canonical 或 H1；
- canonical 不是正式域名或不是 self-canonical；
- hreflang 不对称、指向不存在文件或缺少 self reference；
- JSON-LD 无法解析；
- 中文页 `lang`、`inLanguage` 或 canonical 仍为英文；
- Sitemap URL 与 HTML canonical 不一致；
- metadata 中出现预览域名、`pages.dev` 或 localhost；
- title、description 或 `primaryKeyword` 在多个核心页面完全重复。

### 验收标准

- 完整构建结束后才生成最终 Sitemap。
- Sitemap URL 数量等于所有可索引 canonical 页面数量。
- 删除或新增页面后无需手改 Sitemap。
- 任一严重 SEO 回归都会使 CI/构建失败。

---

## 6. SEO-003：金融内容字段与文章模板

### 用户结果

用户在首屏就能判断文章是否新鲜、谁负责内容、结论基于什么数据，以及内容是否适用于自己的情形。

### 涉及文件

- `src/content.config.ts`
- `src/layouts/ArticleLayout.astro`
- `src/content/articles/*.md`
- `src/content/translations/zh/articles/*.md`
- `src/pages/about/author.astro`
- `src/pages/editorial-standards.astro`

### 内容字段

所有金融文章必须显式填写：

```ts
author: z.string(),
authorRole: z.string(),
publishDate: z.coerce.date(),
modDate: z.coerce.date(),
reviewDate: z.coerce.date(),
dataAsOf: z.string(),
methodology: z.string().min(40),
sources: z.array(sourceSchema).min(1),
primaryKeyword: z.string(),
searchIntent: z.enum(['informational', 'comparison', 'tool', 'transactional']),
canonicalHub: z.string().optional(),
experienceType: z.enum(['author-experience', 'reader-case', 'illustrative', 'none']).default('none')
```

可选字段仅在信息真实时填写：

```ts
reviewer: z.string().optional(),
reviewerRole: z.string().optional(),
reviewerUrl: z.string().url().optional()
```

约束：只要存在 `reviewer`，其角色和可验证个人页面必须同时存在；没有独立审核人时显示 “Written and fact-checked by Henry Zhou”，不得自动填入 `Content Review Board`。

建议来源结构：

```ts
{
  title: string;
  publisher: string;
  url: string;
  accessedAt: string;
  sourceType: 'issuer' | 'regulator' | 'index-provider' | 'government' | 'secondary';
}
```

### 文章首屏组件顺序

```text
H1
一句直接答案 / 结论
适用对象与风险边界
作者 + 角色
Updated + Data as of + Fact-checked date
主 CTA（仅一个）
正文目录
```

### 文章末尾顺序

```text
方法说明
来源清单
利益冲突 / 非个性化投资建议声明
作者简介
一个下一步链接
```

### 结构化数据

Article JSON-LD 至少包含：

- `headline`、`description`、`datePublished`、`dateModified`；
- `author` 为 `Person`，并关联真实作者页；
- `publisher`；
- `mainEntityOfPage`；
- `inLanguage`；
- 只有存在真实审核人时才输出 `reviewedBy`。

不要把免责声明、评分或 FAQ 标记成页面没有真实展示的内容。

### 验收标准

- 38 篇英文文章和对应中文翻译通过 schema 校验。
- 每篇文章首屏可见作者、更新时间、数据截止日期。
- 每篇文章至少有一个第一方来源；关键金融数字能追溯到具体来源。
- 来源链接不是主页泛链，而是对应报告、基金页面、监管文件或方法说明。
- 页面中不存在无法验证的审核组织。

---

## 7. SEO-004：可信度与案例清理

### 清理对象

全站检索：

```text
I've held
I got into
my position
real investor story
Content Review Board
真实投资者
我的持仓
```

### 修改规则

| 原内容类型 | 处理方式 | 必须补充 |
|---|---|---|
| 作者真实经历 | 可保留 | 时间范围、事实边界、是否当前持有、利益冲突 |
| 读者真实案例 | 获授权后保留 | 匿名规则、授权状态、不可独立验证的说明 |
| 演示计算 | 改为假设情景 | 明确输入、公式、假设、结果不代表收益承诺 |
| 来源不明的故事 | 删除 | 用公开数据或可复算示例替代 |

中文翻译必须与英文事实类型一致，不能把 `illustrative scenario` 翻译为“真实案例”。

### 验收标准

- 搜索词清单中的每一处都有处理记录。
- 假设案例在标题、正文和图注中均被明确标注。
- 作者页包含研究范围、数据流程、利益冲突和联系方式。
- 编辑标准页说明更新频率、纠错机制及来源优先级。

---

## 8. SEO-005：GA4 与隐私一致性

### 采用方案

保留 GA4，但默认不加载。用户明确同意 Analytics 后再注入 GA4；拒绝或未选择时不写入分析 Cookie、不发送 GA4 请求。

### 涉及文件

- `src/layouts/BaseLayout.astro`
- `src/layouts/ArticleLayout.astro`
- `src/pages/privacy.astro`
- 可新增 `src/components/AnalyticsConsent.astro`

### 实施要求

1. 两个 Layout 共用同一同意组件，避免一类页面绕过同意。
2. 首次访问显示简洁选择：Accept analytics / Decline。
3. 拒绝按钮与接受按钮同等可见，不使用诱导式设计。
4. 用户可以在隐私页撤回或更改选择。
5. 隐私页写明工具、用途、保存期限、Cookie 类型和撤回方法。
6. 同意状态只保存必要偏好，不把偏好 Cookie 描述为分析 Cookie。

### 验收标准

- 全新浏览器会话在同意前没有 GA4 请求。
- 拒绝后刷新页面仍不加载 GA4。
- 接受后才加载一次，不重复注入。
- 隐私政策与浏览器实际 Cookie/网络请求一致。

---

## 9. SEO-006：关键词地图与页面职责

### 新增文件

- `docs/keyword-map.md`

每个索引页面记录：URL、页面类型、用户任务、primary keyword、search intent、canonical hub、避免争夺的词、主要 CTA、更新频率。

### 首批页面职责

| URL | 用户任务 | 唯一主意图 | 主 CTA |
|---|---|---|---|
| `/topics/dividend-investing-basics/` | 建立学习路径 | 股息投资总入口 | 开始基础课程 |
| `/articles/what-are-dividends/` | 理解定义 | 股息是什么 | 查看收益率公式 |
| `/articles/dividend-yield/` | 计算并理解收益率 | 股息收益率公式与风险 | 使用计算器 |
| `/articles/dividend-dividend-stocks/` | 学习筛选 | 如何筛选股息股 | 打开筛选页 |
| `/articles/high-dividend-stocks/` | 判断高收益是否可持续 | 高收益风险与分析框架 | 打开筛选工具 |
| `/articles/highest-dividend-stocks/` | 查看有日期的当前清单 | 当前高收益清单 | 查看筛选方法 |
| `/articles/best-dividend-stocks-for-beginners/` | 初学者做第一步选择 | 初学者选择框架 | 阅读学习路线 |
| `/stocks/` | 使用工具比较 | 股息股筛选工具 | 开始筛选 |

### 验收标准

- 核心页面不存在完全相同的 `primaryKeyword`、H1 和搜索意图。
- 相近页面首屏明确说明“本页解决什么”和“另一个页面解决什么”。
- 工具页与文章页相互补充，不使用相同标题伪装为两个答案页。

---

## 10. SEO-007：核心页面内容重构

### 10.1 `high-dividend-stocks`

目标：从“高收益名单”改为“判断高收益能否持续的决策页面”。

内容顺序：

1. 40–60 字直接结论：高收益不等于高总回报；
2. 带数据日期和来源的比较表；
3. Dividend Yield vs. Total Return；
4. 普通公司、REIT、BDC、MLP 的覆盖指标差异；
5. Distribution Rate、SEC Yield、Trailing Yield 的区别；
6. 美国税务语境下的税后收入影响；
7. 减派息、资本损失、杠杆和行业集中风险；
8. 示例，不构成推荐；
9. 单一 CTA：进入筛选工具。

移动端表格至少保留 ticker、数据日期、收益率、覆盖指标、主要风险；其余列允许横向滚动或切换到卡片。

### 10.2 `best-dividend-stocks-for-beginners`

目标：解决“初学者如何开始”，不再与通用最佳股票清单竞争。

内容必须包含：

- 开始前的三个问题：目标、时间、风险承受能力；
- 个股与 ETF 的选择树；
- 5 项初筛框架，而不是只给 ticker；
- 常见错误：追高收益、忽略总回报、集中持仓、忽略税务；
- 一个可执行的首月清单；
- 单一 CTA：进入基础学习路线。

### 10.3 SCHD 相关页面

页面职责拆分：

| 页面 | 保留职责 |
|---|---|
| SCHD dividend | 当前分配、历史和数据日期 |
| SCHD holdings | 持仓结构、指数方法和集中风险 |
| SCHD vs VYM | 比较决策、适合谁及不适合谁 |

三页互链，但不得复用大段相同介绍、同一 H1 或相同首屏答案。实时数据优先引用基金发行人和指数提供方。

### 10.4 `what-are-dividends`

首段写成可独立引用的 40–60 字定义，随后立即解释：

- 股息不是保证收益；
- ex-dividend date、record date、payment date；
- 收到股息不等于创造了额外总回报；
- 新手下一步应学习收益率和 payout ratio。

### 10.5 税务内容

税务页面必须在首屏限定国家/地区、纳税人类型和年份。无法覆盖个体情况时清楚说明边界，并优先引用 IRS 或对应政府来源。所有税率示例都必须带适用年度。

### 通用内容验收

- 标题后 150 字内出现直接答案、适用边界和数据日期。
- 每页只有一个主要任务和一个主要 CTA。
- 所有数字表格显示 `Data as of` 和来源。
- 不用“最佳”“安全”“稳定收入”等措辞暗示收益保证。
- 中文版不是标题翻译加英文正文，而是完整对应内容。

---

## 11. SEO-008：内链与用户下一步

### 页面路径

```text
定义文章 → 指标文章 → 筛选方法 → 工具页
ETF 数据页 → 持仓分析 → 对比决策页
高收益文章 → 风险判断 → 筛选工具
计算器 → 公式解释 → 税务边界
```

### 规则

1. 正文内链放在解释关系的位置，不集中堆在文末。
2. 锚文本描述目标页任务，如“如何计算股息收益率”，不用连续重复精确匹配关键词。
3. 每页 2–5 个上下文内链；文末只保留一个主 CTA。
4. 新文章发布前必须指定一个 hub，并从 hub 获得入口。
5. 中文页只链接中文目标；目标没有翻译时可链接英文，但必须标注 English。

### 验收标准

- 所有索引文章从首页或专题页不超过 3 次点击可达。
- 不存在孤立文章。
- 链接目标与锚文本承诺一致。
- 用户完成当前任务后只有一个清晰的推荐下一步。

---

## 12. SEO-009：P2 增长内容

P0/P1 验收完成后再执行：

1. 建立 Dividend Investing Basics hub 与学习顺序；
2. 建立 ETF、收益率风险、税务、计算工具四个主题集群；
3. 发布可被引用的原创资产：带版本日期的数据表、筛选方法、可复算案例；
4. 为重要表格提供来源、更新时间和 CSV 下载（仅在数据许可范围内）；
5. 用 Search Console 查询和真实用户问题更新 FAQ，不批量生成空泛问答。

---

## 13. 开发任务拆分

| 任务 | 负责人类型 | 预估 | 前置 |
|---|---|---:|---|
| 多语言 metadata helper 与 Layout 接口 | 前端 | 1 天 | 无 |
| 中文构建脚本 URL/JSON-LD 改写 | 前端/Node | 1–2 天 | 接口确认 |
| Sitemap 生成器与 SEO validator | 前端/Node | 1–2 天 | 中文生成完成 |
| 内容 schema 与文章模板 | 前端 | 1 天 | 字段定义确认 |
| 38 篇文章字段迁移 | 编辑 | 2–4 天 | schema 完成 |
| 案例和审核表述清理 | 编辑/合规 | 1–2 天 | 清单完成 |
| GA4 consent 与隐私页 | 前端/法务复核 | 1 天 | 无 |
| 关键词地图 | SEO/编辑 | 0.5–1 天 | 无 |
| 5 组核心页面重构 | SEO/编辑 | 3–5 天 | 关键词地图 |
| 内链迁移与 QA | SEO/编辑 | 1 天 | 页面重构 |

预估为单人有效工作量，用于排序，不作为交付承诺。

## 14. 上线批次

### 批次 A：技术与可信度

- SEO-001 至 SEO-005；
- 先在预览环境完成全量构建；
- 对英文、中文、文章、非文章页各抽样至少 5 个 URL；
- 确认没有 canonical、hreflang、JSON-LD 和分析脚本回归后上线。

### 批次 B：页面职责与核心内容

- SEO-006 至 SEO-008；
- 每次上线一组相关页面，避免一次性改动全部核心页后无法归因；
- 保持 URL 不变；确需改 URL 时增加单跳 301，并同步站内链接、canonical 和 Sitemap。

### 批次 C：增长内容

- SEO-009；
- 依据 Search Console 的曝光、查询和页面表现决定内容顺序。

## 15. 发布验收清单

### 技术

- [ ] `npm run build` 完成且 SEO validator 为 0 error
- [ ] 英文和中文页面 self-canonical 正确
- [ ] hreflang 对称且目标全部存在
- [ ] Sitemap 与实际 canonical 数量一致
- [ ] robots.txt 未阻止需要索引的资源和页面
- [ ] JSON-LD 可解析且内容与可见页面一致
- [ ] 正式 metadata 不含预览域名或 localhost
- [ ] 404 页面不进入 Sitemap

### 内容与用户体验

- [ ] 每个核心页首屏直接回答用户问题
- [ ] 作者、更新时间、数据日期、方法和来源可见
- [ ] 所有实时数字有日期和主要来源
- [ ] 不存在虚构审核人、无法验证故事或收益承诺
- [ ] 移动端表格可读，主要字段不被隐藏
- [ ] 每页只有一个主要 CTA
- [ ] 中文正文、导航、元数据和免责声明完整对应

### 隐私

- [ ] 同意前不加载 GA4
- [ ] 拒绝后不产生 GA4 请求
- [ ] 用户可撤回选择
- [ ] 隐私政策与实际行为一致

## 16. 上线后观察

上线后不要用短期排名波动判断成败。按以下节奏记录：

- 第 1–3 天：检查抓取、服务器错误、重定向、canonical 和 Sitemap 读取；
- 第 2 周：检查中文 URL 发现与索引、hreflang 错误、核心页曝光变化；
- 第 4–8 周：比较查询意图、CTR、平均排名和非品牌自然流量；
- 第 8–12 周：判断页面内耗是否下降、主题 hub 是否获得更多长尾曝光。

建议按页面组而不是全站平均值观察：基础知识、高收益、ETF、工具、中文页分别统计。

## 17. 完成定义

本项目只有同时满足以下条件才算完成：

1. 技术构建能够自动防止 canonical、hreflang、Sitemap 和 JSON-LD 回归；
2. 全部现有金融文章具备真实、可见、可追溯的作者与数据字段；
3. 核心主题页面各自服务唯一用户任务和搜索意图；
4. 中文站具备完整内容和独立索引资格；
5. 用户从搜索进入后，能在首屏判断答案、日期、风险和下一步；
6. 分析脚本、Cookie 行为和隐私政策完全一致。

如果某项改动只增加关键词密度，却没有让答案更清楚、证据更可信或导航更直接，应拒绝合并。
