---
name: dividend-content-v1
description: >-
  为 Dividend Guide 网站创建符合 Google E-E-A-T 标准的 SEO 科普文章，
  并在写作完成后自动执行 5 轮自迭代审核复写。每次处理一个关键词，输出英文文章。
  涵盖选题判断、文章结构模板、EEAT 硬约束、内部/外部链接策略、封面图处理、
  自动多轮审核、构建验证。当用户要求"根据关键词写文章"、"针对XX写一篇科普"、
  "write an article for keyword XX"时触发。在 Dividend Guide 项目目录下工作时使用。
version: 1.0.0
author: Dividend Guide Operations Team
license: Proprietary (Dividend Guide)
metadata:
  hermes:
    tags: [dividend, content, eeat, seo, article, finance, iterative]
    related_skills:
      - seo-content
      - seo-content-iterative
      - seo-image-gen
---

# Dividend Guide 科普文章写作 + 自动迭代复写 Skill

## 触发条件

以下任一场景触发本 skill：

- 用户给出关键词，要求"写一篇科普文章"或"write an article"
- 用户说"根据关键词XX写一篇符合谷歌eeat的文章"
- 用户要求"针对XX写一篇文章"
- 需要在 Dividend Guide 项目中新增 SEO 内容文章

本 skill **不适用**的场景（不要触发）：
- 用户只问"XX的搜索量多少"而不要求写文章
- 用户要求修改/更新已有文章（此时不调用本 skill，直接对文件执行审核）
- 用户要求批量写入多篇不同关键词的文章（分批调用此 skill）

## 工作流程

本 skill 的核心差异点：写完草稿后**自动进入 5 轮自迭代审核复写**（Step 9），
无需用户手动触发。其余步骤沿用 Dividend Guide 的完整流水线。

### Step 1：理解输入

从用户消息中提取：
- **关键词**（必填）——如 "what are dividends"、"best dividend stocks 2026"
- **搜索量**（可选）——如 "12.1k"
- **难度**（可选）——如 "29%"
- **额外要求**（可选）——如侧重哪个行业、强调哪种策略

如果用户只给了关键词没有其他信息，直接进入写作阶段，不需要追问。

### Step 2：确定路由

slug = 关键词转 kebab-case，例如：
- "what are dividends" → `what-are-dividends`
- "best dividend stocks 2026" → `best-dividend-stocks-2026`

文章文件路径：
- `src/content/articles/{slug}.md` → 路由 `/articles/{slug}/`

### Step 3：检查现有内容

在写之前，先检查是否已有同名文件：
```
src/content/articles/{slug}.md
```

如果存在且 `draft: false`，**不要覆盖**，上报给用户。

同时检查 `src/content/articles/` 下是否有内容相近的文章（同 category 或同标签）。如有，内部链接时引用它们。

### Step 4：文章 schema 要求

articles collection 的 frontmatter schema（`src/content.config.ts`）：

```yaml
---
title: string                  # 必填
description: string            # 必填，meta description，建议 120-160 字
pubDate: date                  # 必填，格式 YYYY-MM-DD
modDate: date                  # 可选，更新日期
category: string               # 默认 "General"
tags: string[]                 # 可选
image: string                  # 可选，封面图路径
draft: boolean                 # 默认 false
---
```

**注意：**
1. 即使 schema 不含 `reviewedBy` 字段，建议在文章首段底部或文末加上审核说明以增强 Expertise 信号，如：
```
*Reviewed by the Dividend Guide Content Review Board. Our editorial process ensures all data points are verified against SEC filings and company investor relations materials.*
```
2. 封面图 `image` 仅提供路径，**图片 alt 文本需要在正文中处理**。建议在文章首段附近用 HTML 注释或可见文本补充图片描述（SEO + 无障碍），如：
```
<!-- Cover image: A chart showing dividend growth over 10 years for KO and JNJ -->
```
3. **FAQ 的 JSON-LD 结构化数据：** 当前 `ArticleLayout.astro` 只生成 Article schema，不会自动提取 FAQ。写作时 FAQ 段仅用于读者阅读，不产生 FAQPage 结构化数据。如需增强 SERP 富媒体展现，可在 `ArticleLayout.astro` 中自行添加 FAQPage 解析逻辑（从正文 `### Q...` 格式提取）。

**文章分类建议：**
为确保站点结构一致性和 E-A-T 主题权威，建议使用以下标准化分类（category 字段）：

| Category | 使用场景 |
|----------|---------|
| Basics | 股息入门概念、术语解释 |
| Strategy | 投资策略、方法对比 |
| Stock Analysis | 个股/ETF 分析、股息贵族 |
| Tax & Legal | 税务规则、合规话题 |
| Market News | 市场趋势、数据更新 |

### Step 5：文章结构模板

所有文章遵循以下结构（按顺序）：

```
# H1: 包含目标关键词，面向用户意图

第一段（lead）：直接回答核心问题，给出关键数字，引发继续阅读

--- (可选分隔线)

## H2 分层详解

每个H2下设2-4个H3子节。

**不再固定 H2 模板。** 以下为推荐包含的内容要素，不要求顺序，也不要求全部出现。根据关键词意图和文章类型自由组合：

- 核心数据/对比表（如适用，顶部放最有冲击力的数字）
- 概念解释（按需，非每篇必需）
- 关键维度分析（股息率、派息率、增长率等）
- 适用人群分析
- 行业/板块分析
- 常见问题解答（5-8个）
- 总结与建议

**必须有表格，数据化结构。** 用数据支撑论点，避免泛泛而谈。

**H2 标题避免使用工厂式标签。** 用自然语言替代固定模板名：

| 避免 | 推荐 |
|------|------|
| `## 真实案例` | `## 不同行业股息率对比` / `## 10年派息历史回顾` |
| `## FAQ` | `## 常见问题解答` / `## 你可能还想了解` |
| `## 总结/结语` | `## 如何开始你的股息投资` / `## 下一步该做什么` |
```

## 文章数据要求

每个数据点必须有据可查：
- 引用具体公司名称、股票代码
- 引用具体年份和数字
- 对比分析时使用统一时间基准
- **必须在数据附近标注来源**，例如："据 KO 2025 年 SEC 10-K 年报"、"据 S&P Dow Jones Indices 2026 年 1 月数据"
- 不要使用泛泛的"研究表明"、"据数据显示"——必须指明具体报告或机构名称

## 投资者经验/示例要求

这是 Experience 维度的核心信号。每篇文章至少包含 **1-2 个具体投资者的持仓示例或情景演算**，覆盖不同策略：

每个示例必须包含：
- **初始本金**（如 "$10,000"）
- **具体股票/ETF 代码**（如 "KO"、"SCHD"、"JNJ"）
- **买入年份**（如 "2015 年"）
- **期间股息率变化**
- **累计分红收入演算**（使用表格呈现）
- **当前持仓价值对比**
- **投资者直接引语**（至少一句，使用投资者口吻，包含**操作细节 + 情绪反应**。如："我每个月定投 $500 到 SCHD，前两年看着只有几十块分红觉得没意思，但到第 5 年光分红就够交一个月电费了"比"长期持有很重要"更具体，Experience 信号更强）
- **具体困难或弯路**（如"2008 年金融危机时差点全卖了"、"某公司突然砍股息，才意识到 payout ratio 的重要性"）

示例应为写实场景，覆盖不同策略路径（如：股息增长 vs 高股息收益、DRIP 复利 vs 现金分红、定投 vs 一次性投入）。

### AI 内容检测避免（重要）

Google 的 Sept 2025 QRG 正式要求评估内容是否看起来像 AI 生成的。以下特征会触发低质量判定：

| 要避免的特征 | 解决办法 |
|-------------|---------|
| 泛泛而谈、缺乏具体性 | 每段都加入具体数字、公司代码、年份、金额 |
| 没有原创见解 | 加入投资者经验、多策略对比分析、个人视角 |
| 页面间结构重复 | 每篇文章采用不同的 H2 层级结构，投资者示例写不同的策略和情景 |
| 无作者署名 | 使用机构署名，文末加审核声明 |
| 事实错误 | 所有数据标注来源，不编造精确数字 |

**必须在写作过程中嵌入这些细节，不要在后处理阶段添加。**

## 结尾要求

- 重申核心答案
- 给出可操作建议
- 自然嵌入 CTA（链接到 `/calculator`、`/stocks` 或 `/strategy`）
- H2 标题用自然收束，不使用"总结/结语"（推荐：`## 如何开始你的股息投资之旅` / `## 下一步该做什么`）
- **必须添加免责声明**（YMYL 文章必备）：
  ```markdown
  *This article is for informational purposes only and does not constitute financial advice. Past dividend performance does not guarantee future results. Always consult a financial advisor before making investment decisions.*
  ```

### Step 6：EEAT 硬约束

#### Who（署名与审核）
- frontmatter 中：
  ```yaml
  author: "Dividend Guide Research Team"
  ```
- **不允许使用虚构的个人作者名**
- 文末可加机构说明或审核声明，增强 Expertise：
  ```markdown
  *Reviewed by the Dividend Guide Content Review Board. Our editorial process verifies all data against SEC filings, company investor relations materials, and S&P Dow Jones Indices data before publication.*
  ```
- 不写个人 bio

#### How（方法与数据源透明度）

这是 Trustworthiness 的核心。每篇文章必须遵循：

**数据源标注规则：**
- 每个具体数字（股息率、派息率、增长率、股价）旁边必须标注来源
- 可接受的来源格式：
  - "据 [公司] [年份] SEC 10-K 年报"
  - "据 S&P Dow Jones Indices [年份] [月份] 数据"
  - "据 NASDAQ.com [股票代码] 股息历史页面"
  - "据 [公司] Investor Relations 页面"
- **严禁无来源的数字**。如果找不到确切来源，用估算表述（"约 3%"，"据行业数据估算"）并注明"此为估算值"
- **不要编造来源**。如果不确定，用"据公司财报"或"据行业数据"

**外链与数据交叉验证：**
- 优先链接到可公开验证的源页面（SEC EDGAR、公司 IR 页面）
- 至少 2-3 个外链必须直接指向数据源（不只是术语解释页面）

#### Why（目的要真实）
- 文章目的必须是帮助用户做知情投资决策，不是为了排名
- 不要堆砌关键词，不要写成营销软文
- 利益和风险要平衡说明（如高股息率可能不可持续）
- 不承诺任何收益，不暗示"买入这只股票"——保持教育性中立立场

#### 外链要求
每篇文章至少包含 **2-3 个外部超链接**（markdown 格式 `[text](url)`），链接到可信权威源：

| 机构 | URL | 何时使用 |
|------|-----|---------|
| SEC | https://www.sec.gov | 股息政策、上市公司财报、投资者教育 |
| IRS | https://www.irs.gov | 股息税务规则（qualified dividends） |
| FINRA | https://www.finra.org | 经纪商资质、投资者保护 |
| NYSE | https://www.nyse.com | 上市规则、股息日历 |
| NASDAQ | https://www.nasdaq.com | 股票数据、股息历史记录 |
| S&P Dow Jones Indices | https://www.spglobal.com/spdji | Dividend Aristocrats 官方名单 |
| Federal Reserve | https://www.federalreserve.gov | 利率数据、经济研究 |
| BLS | https://www.bls.gov | 通胀数据（CPI） |
| Investopedia | https://www.investopedia.com | 术语解释、概念定义 |
| Morningstar | https://www.morningstar.com | 基金评级、股息数据 |
| Vanguard Research | https://investor.vanguard.com | 指数基金研究、DRIP 策略 |

**外链优先顺序：**
1. SEC/IRS — 涉及税务、合规话题时必链
2. S&P Dow Jones — 涉及 Dividend Aristocrats 时必链
3. NASDAQ — 引用具体股票数据时必链
4. Investopedia — 解释术语时作为补充

#### 内链要求
每篇文章至少包含 **3 个内部链接**（使用相对路径），在正文上下文中自然嵌入：

| 页面 | 路径 | 锚文本建议 |
|------|------|-----------|
| 首页 | `/` | Dividend Guide, home |
| 文章列表 | `/articles/` | Articles, all guides |
| 股票列表 | `/stocks` | Best Dividend Stocks, stock picks |
| 计算器 | `/calculator` | Dividend Calculator, yield calculator |
| 策略 | `/strategy` | Dividend Strategies, investment strategies |
| 关于 | `/about` | About us |
| 联系 | `/contact` | Contact, get in touch |
| 其他文章 | `/articles/{slug}/` | 交叉链接相关内容 |

**内链前提检查（必须执行）：**
1. 链接到 `/articles/{slug}/` 前，必须先确认 `src/content/articles/{slug}.md` 存在
2. 链接到 `/stocks`、`/calculator`、`/strategy` 前，确认对应页面已发布

使用 `Test-Path` 检查文件存在，不要假设。

**内链策略优先级：**
- `/calculator` — 涉及计算、收益预测时必链
- `/stocks` — 提及具体股票或选股时必链
- `/articles/{slug}/` — 交叉链接其他文章
- `/strategy` — 涉及投资方法时链

#### 日期与更新
- `pubDate: "2026-06-30"`（当天日期）
- `modDate: "2026-06-30"`（首次发布与 pubDate 相同；后续修订时更新此值）
- 文末加免责声明和最后更新日期：
  ```markdown
  *Last updated: YYYY-MM-DD. This article is for informational purposes only and does not constitute financial advice. ... Always consult a financial advisor before making investment decisions.*
  ```

**数据时效策略（YMYL 重要）：**
股息类数据随时间快速贬值，必须建立更新机制：

| 数据类型 | 最大可接受时效 | 超期处理 |
|---------|-------------|---------|
| 股息率/股息金额 | 6 个月 | 更新 modDate 并核验数据 |
| 派息率（payout ratio） | 12 个月 | 核对最新年报 |
| 公司派息历史 | 12 个月 | 核对最新数据 |
| Dividend Aristocrats 名单 | 每年 1 月 | 同步 S&P 官方更新 |
| 税务规则 | 税务年度 | 确认无法律变更 |
- 如果超过上述时效且无法核实，在数据旁标注"据 [年份] 数据"或"此为历史数据仅供参考"
- 大幅修改时同步更新 `modDate` 和文末免责声明日期

#### SEO meta description
- `description` 字段建议 120-160 字
- 包含目标关键词、用户意图和文章核心价值
- 不要单纯重复标题，要补充标题未覆盖的信息

### Step 7：封面图

文章 frontmatter 中 `image` 指向：
```yaml
image: "../../../assets/images/articles/{slug}.webp"
```

### 封面图硬性要求

封面图是**必选项**，不允许缺失。如果所有途径均失败，使用 `seo-image-gen` skill 生成一张（调用 Gemini 出图），再无法生成才允许记录为缺失。

封面图来源处理流程（按优先级）：

1. **用户提供 URL**：先用 `Invoke-WebRequest -Uri <url> -OutFile "src/assets/images/articles/{slug}.jpg"` 下载
2. **用户提供本地文件**：复制到 `src/assets/images/articles/{slug}.jpg`
3. **用户无提供，主动从免费图库获取**（按此顺序逐个尝试，一个成功即停止）：

   **3a. Unsplash：** 在搜索引擎搜索 `unsplash <关键词> photo` 或 `site:unsplash.com <关键词>` 找到 CC0 图片页面。使用 `webfetch` 打开图片页，从中提取图片直链（通常是 `images.unsplash.com` 域名），再用 `Invoke-WebRequest` 下载。

   **3b. Pexels：** 搜索 `site:pexels.com <关键词>` 找到免费图片页，`webfetch` 打开后提取图片直链（`images.pexels.com` 域名），用 `Invoke-WebRequest` 下载。

   **3c. Pixabay：** 同上模式，搜索 `site:pixabay.com <关键词>`，找到直链（`pixabay.com/get/`）后下载。

   **3d. StockSnap：** 搜索 `site:stocksnap.io <关键词>`，找到免费图片页，提取图片直链后下载。

   **3e. CC0.cn：** 搜索 `site:cc0.cn <关键词>`，找到免费图片页，提取图片直链后下载。

   **3f. 通用搜索：** 搜索 `<关键词> free stock photo`，在结果中找到可用的 CC0 图片 URL。

   下载后裁剪为 1200×630 比例，转码为 webp（quality: 85）。

4. **前三步均失败**：调用 `seo-image-gen` skill（使用 `skill` 工具加载 `seo-image-gen`），用 Gemini 根据文章主题生成封面图，输出到 `src/assets/images/articles/{slug}.webp`。prompt 示例：`"A professional, clean stock photo style image about [关键词], suitable for a finance article cover, 1200x630 aspect ratio"`。

5. **全部失败**（极少数情况）：保留路径引用但记录缺失，在自检清单中勾选"封面图缺失"。

下载/复制后统一转码（仅对非 webp 源文件执行）：
1. 用 `sharp` 将 JPG/PNG 转为 WebP：
   ```powershell
   node -e "const sharp = require('sharp'); sharp('src/assets/images/articles/{slug}.jpg').resize(1200, 630).webp({ quality: 85 }).toFile('src/assets/images/articles/{slug}.webp').then(() => console.log('OK'))"
   ```
2. 删除原始格式文件（保留 webp）
3. 确认 frontmatter 中的 `image` 路径已正确引用

### Step 8：构建前外链验证

提交构建前，验证所有外部链接可访问：

```powershell
$links = Select-String -Path "src/content/articles/{slug}.md" -Pattern 'https?://[^\s\)"]+' | ForEach-Object { $_.Matches.Value } | Sort-Object -Unique
foreach ($url in $links) {
  if ($url -notmatch 'dividend01\.com') {
    try { $r = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10; Write-Host "$url → $($r.StatusCode)" }
    catch { Write-Warning "$url → BROKEN ($($_.Exception.Message))" }
  }
}
```

如果出现非 200 状态码，查找替代的可访问 URL 后再继续。

### Step 9：自动 5 轮迭代审核复写（嵌入 seo-content-iterative）

**这是本 skill 的关键差异步骤。** 内容草稿完成后**自动执行**，无需用户手动触发。
顺序不可颠倒：必须先完成 Step 9，再走 Step 10 / Step 11 与质量自检清单。

执行完整的 5 轮"审计 → 定位问题 → 修改 → 再审计"循环，直接改文件并记录变更日志。

#### 9.1 不可变字段（跳过，不修改）

以下字段在审核中视为"已锁定"，发现任何问题都不要尝试修改：

| 字段 | 原因 |
|------|------|
| `author` | dividend-article-writer 硬约束，固定机构署名 |
| `image` | 封面图路径指向已存在的资源文件 |
| `draft` | 发布状态由用户控制 |
| `pubDate` / `modDate` | 日期由创建/修改时间决定，不改 |

不要在审核报告/变更日志中提及这些字段的问题——它们是已确认的设计约定。

**额外硬规则：** 所有数据点（股息率、派息率、增长率、股价、公司代码、年份、金额、投资者案例的核心数据）**不得被修改或删除**。迭代只改进表达、结构、链接与信号，不编造新数据。

#### 9.2 审核框架

**Google Who / How / Why 测试**

| 问题 | 检查内容 |
|------|---------|
| **Who** 创建的？ | 文末有机构署名说明（Dividend Guide Research Team / Content Review Board），来源可追溯 |
| **How** 创建的？ | 声明数据来源（SEC 10-K、S&P Dow Jones、NASDAQ、公司 IR 等），有外链引用 |
| **Why** 存在？ | 帮助用户做知情投资决策，不是营销导向。文章是否客观平衡，收益与风险都写？ |

**E-E-A-T 四维度**

- **Experience（经验）**：投资者示例是否包含初始本金 + 股票代码 + 买入年份 + 累计分红表格 + 当前价值 + 投资者引语（含操作细节与情绪反应）+ 具体困难/弯路？
- **Expertise（专业）**：股息/税务术语准确，数据有来源标注，股息率/派息率是合理范围而非编造的精确数字
- **Authoritativeness（权威）**：外链是否指向权威源（SEC、IRS、S&P Dow Jones、NASDAQ）？内链是否指向站内相关内容？
- **Trustworthiness（可信）**：有免责声明，有机构审核声明，有数据来源标注，有最后更新日期，风险与收益平衡

**AI 内容检测规避**

| 标志 | 检查方式 |
|------|---------|
| 泛泛而谈、缺乏具体性 | 每段都有具体数字/年份/金额/公司代码 |
| 没有原创见解 | 投资者视角、多策略对比分析、独特洞察 |
| 结构模板化 | H2 标题不用工厂式标签（避免"真实案例""FAQ""总结/结语"） |
| 投资者经验空洞 | 必须有引语 + 具体困难 + 具体数字 |

**内容结构指标**

- H1 包含目标关键词
- H2→H3 层级合理，无跳级
- 段落 2-4 句，句子 15-25 词（英文版）
- 列表/表格用于对比类数据（**必须有表格**）
- 内链 3+ 条，外链 2-3+ 条（指向权威源）
- FAQ 5-8 个，使用用户搜索习惯的表述
- 结尾有可操作步骤 + CTA + 免责声明 + 最后更新日期

**AI Citation Readiness（GEO 信号）**

- 有统计/数据点的可引用段落
- 问答格式清晰（`### Qxxx`）
- 比较性数据用表格
- 定义式和步骤式内容明确

#### 9.3 迭代执行

**Round i / 5：**

1. **读取当前文件** — 用 Read 工具获取文件最新内容。
2. **全面审计** — 对照上述框架逐项评估，输出：
   - 当前评分（定性：优秀/良好/需改进/差）
   - 发现的问题列表（按 Critical / Major / Minor 分级）
   - 每轮只处理 **top 3-5 个问题**（优先 Critical/Major）
3. **修改文件** — 对选中的问题，用 Edit 工具直接改文件。修改原则：
   - 每处修改独立调用 Edit（不要一次性大段替换）
   - 修改粒度：一个 Edit 解决一个问题
   - 修改后立即 Read 确认改动正确
   - **跳过不可变字段**（见 9.1）
4. **记录变更** — 在本轮末尾追加变更日志结构（见 9.4）

#### 9.4 变更日志格式

在文件末尾（最后一行之后）追加变更日志，用 HTML 注释包裹以免影响渲染：

```markdown

<!-- dividend-content-v1 change log
Round 1/5:
  - Fixed: ...
  - Fixed: ...
Round 2/5:
  - Fixed: ...
  - Fixed: ...
-->
```

变更日志仅在审核过程中存在。5 轮完成后**必须移除**变更日志（去掉所有 `<!-- change log -->` 注释块），确保交付的文件不含审计残留痕迹。

#### 9.5 完成后输出最终摘要

5 轮复写完成后，在回复中输出最终摘要：

```markdown
## 迭代复写完成

**文件：** src/content/articles/{slug}.md
**轮数：** 5
**最终状态：** {通过 / 需手动检查 / 有遗留问题}

### 变更摘要

| 轮次 | 改动内容 | 类型 |
|------|---------|------|
| 1 | ... | Critical/Major/Minor |
| ... | ... | ... |

### 遗留问题（如有）

- 未解决的问题及原因

### 文件位置

src/content/articles/{slug}.md
```

#### 9.6 与质量自检清单的关系

Step 9 是**前置检查**，质量自检清单是**后置确认**。先过 Step 9 迭代到满意，再过质量自检清单逐项打勾。不要跳过 Step 9 直接打勾。

### Step 10：更新 sitemap 与 llms.txt

文章定稿后，同步更新站点文件：

**sitemap.xml（`public/sitemap.xml`）：**
为新增文章添加 `<url>` 条目：
```xml
<url><loc>https://dividend01.com/articles/{slug}/</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

**llms.txt（`public/llms.txt`）：**
在 `## Core Pages` 下新增一行：
```
- [{title}](/articles/{slug}/): {description}
```

### Step 11：本地构建验证

全部内容就绪后，本地构建确认无 error：

```powershell
cd "D:\Workspace\web\Dividend Guide"
npm run build
```

构建输出到 `dist/` 目录。确认 `npm run build` 成功（0 errors）。

构建失败时排查：
- frontmatter schema 字段是否写错
- 是否有引用不存在的文件（如 image 路径错误）
- 修复后重新运行构建

**注意：本 skill 只负责写入本地文件 + 本地构建验证，不自动部署。** 部署由用户手动执行：
```powershell
npm run build ; npx wrangler pages deploy dist --project-name=dividend-guide
```

## 质量自检清单

写作完成后逐项勾选：

- [ ] 文章文件写入 `src/content/articles/{slug}.md`
- [ ] frontmatter 字段完整且拼写正确
- [ ] `draft: false` 已设置
- [ ] `modDate` 字段存在且日期正确
- [ ] author 使用机构署名（非虚构个人）
- [ ] 文末或首段包含审核声明（Dividend Guide Content Review Board）
- [ ] `description` 长度 120-160 字
- [ ] 至少 2-3 个外链，且逐个验证返回 HTTP 200
- [ ] 至少 3 个内链，在上下文中自然嵌入，且链接目标文件确认存在
- [ ] 第一段直接回答核心问题
- [ ] 包含至少一个数据表格
- [ ] **每个数据点标注了具体来源**（SEC、S&P、NASDAQ、公司 IR 等），无"研究表明"式模糊引用
- [ ] 包含至少 1 个投资者持仓示例/情景演算（含初始本金、股票代码、时间线、累计收益表格）
- [ ] 投资者示例包含直接引语和具体困难/弯路描述（Experience 信号）
- [ ] 常见问题解答 5-8 个，使用用户真实搜索表述
- [ ] H2 标题不使用"真实案例""FAQ""总结/结语"等工厂式标签
- [ ] 封面图已存在且路径正确（`Test-Path src/assets/images/articles/{slug}.webp` 返回 True）
- [ ] 若全部途径失败，封面图仍缺失（需标注说明）
- [ ] 文末有免责声明和最后更新日期
- [ ] `npm run build` 通过（0 errors）
- [ ] `npm run build` 本地构建通过（如需要部署：`npx wrangler pages deploy dist --project-name=dividend-guide`）
- [ ] `public/sitemap.xml` 已同步更新新增文章的 URL
- [ ] `public/llms.txt` 已同步更新新增文章的条目
- [ ] 数据时效策略已核对：无超过 6 个月的未更新股息率数据
- [ ] 虚构的个人作者名已移除
- [ ] **5 轮自迭代审核复写完成**：变更日志已移除，无遗留 Critical/Major 问题，数据点未被修改或删除
- [ ] 迭代复写最终摘要已输出

## 常见错误避免

1. **不要虚构作者**。一律用机构署名。
2. **不要加个人 bio**。文末只写机构说明。
3. **不要加 AI 生成声明**。不允许标注 AI 辅助。
4. **不要写虚构的数据点**。公司名称、股息率、派息历史必须可验证。
5. **不要覆盖已有文章**。检查文件是否存在。
6. **不要追求完美数据**。股息率给合理范围即可，不要编造精确数字。
7. **不要忽略 description 长度**。SEO 最佳实践 120-160 字，过短会损失搜索展现。
8. **不要忽略封面图**。封面图必须有且路径正确。
9. **不要使用"投资建议"口吻**。文章是教育性内容，不是投资建议。
10. **不要遗漏免责声明**。金融类内容是 YMYL，必须有免责声明。
11. **不要依赖外链曾经正确**。SEC、NASDAQ 等站点会改版导致 URL 失效，每次写文章都必须运行外链验证脚本确认所有外链返回 200，发现失效链接需查找替代 URL。
12. **不要写无来源的数据**。每个股息率、派息率、增长率数字旁边必须标注来源（SEC 10-K、S&P、NASDAQ 等），Google 对 YMYL 话题的数据准确性要求极高。
13. **不要遗漏审核声明**。Expertise 信号需要显示内容有专业人员把关，哪怕是简短的一句机构声明。
14. **不要写空泛的投资者经验**。每个示例必须包含具体股票代码、买入金额、时间跨度、累计收益数字和直接引语——这些是 Experience 维度的核心信号。
15. **不要跳过 5 轮迭代复写**。Step 9 是硬性流程，草稿完成后必须自动执行，不得直接进入构建。
16. **不要在迭代中修改数据点**。迭代只改进表达、结构、链接与信号，所有股息数据、投资者案例核心数字保持原样。
17. **不要在迭代中修改不可变字段**。author、image、draft、pubDate、modDate 一律跳过不碰。
18. **不要遗留变更日志**。5 轮完成后必须移除所有 `<!-- change log -->` 注释块，交付文件不含审计残留。
19. **不要对单次 Edit 做大段替换**。一个 Edit 解决一个问题，修改后立即 Read 确认。
20. **不要改动 FAQ/数据来源的可追溯性**。FAQ 使用用户真实搜索表述，来源标注保持精确。
