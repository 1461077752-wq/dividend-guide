# Dividend01.com — SEO 剩余任务完整计划书

> 生成时间：2026-08-27。本文是「已完成项 → 剩余项 → 执行顺序 → 验收标准」的完整工作文档。
> 前置：计划原文 `SEO-CHANGE-SPEC.md` / 已落地项见 `SEO-KEYWORD-MAP.md`、`SEO-DATA-CROSSCHECK.md`、`SEO-CTR-PROPOSAL.md`、`SEO-GSC-ACTIONS.md`。

---

## 〇、已完成（不再重复）

| 类别 | 已完成 |
|------|--------|
| 技术清理（计划第一、二节） | URL 规范化（22/22 线上验证）、/zh/zh/ 单跳 301、www sitemap 200/XML/118、canonical/hreflang、Cloudflare Redirect Rules 3+1 条 |
| 404 与重定向（计划第四、五节） | /zh/zh/ 抽样 6/6 单跳；Email Protection 死链 0；非 www 旧地址 301 |
| 未收录内容（计划第七节） | 14 目标页 primaryKeyword 全站去重；39 篇 FAQPage JSON-LD；36 篇英文「More in <Hub>」回链；5 篇 CTR 标题已应用 |
| 数据交叉验证（计划第十节） | ULTY（−86%→0%、ROC71%→100%、distribution rate →60%）、BITO（46%→75%）、QQQI/月派息收窄；8 篇补 dataAsOf；详见 `SEO-DATA-CROSSCHECK.md` |
| 关键词治理（计划第八节） | 全站关键词地图（44 篇文章）+ 治理项决策记录 |
| GSC 平台动作 | 需用户手动执行；Runbook 见 `SEO-GSC-ACTIONS.md` 附录 A–E；本机已完成 22/22 技术验证作为前置保证 |

---

## 一、当前状态快照（2026-08-27 recon）

| 项 | 当前 | 影响 |
|----|------|------|
| **专题 Hub 页** | 4 个 `.astro` 文件，平均 **15–27 行**；仅含一个段落 + 链接列表 | P0：Hub 页厚度严重不足，搜索引擎对 Hub 评级低，专题集群权重难以聚集 |
| **首屏图片** | `public/images/dividend-hero.jpg`（**JPG**）；`articles/` 下 39 张 WebP（平均 72KB/张，最大 240KB） | P0：JPG 可转 WebP/AVIF；hero 无多分辨率/响应式 |
| **`<img>` 属性** | 文章封面 `<img loading="eager" class="article-cover">` **无 width/height** | **P0 严重 CLS 风险**：图片加载时布局会跳变 |
| **`<img>` lazy** | 全部 `eager`（缺懒加载） | P0：除首屏 hero 外应 `loading="lazy"` + `decoding="async"` |
| **fetchpriority** | 未设置 | P0：LCP 图（hero/封面）应 `fetchpriority="high"` |
| **响应式 srcset** | 未使用 | P1：可加 1x/2x WebP 适配 |
| **JSON-LD 在线验证** | 未用 Google Rich Results Test 抽样 | P1：需要官方验证 |
| **中文页同步** | ULTY/BITO 数据修正后，CI 无 `OPENAI_API_KEY` 时中文镜像页**不会重新生成** | P1：需带 key 重跑构建并验证 |
| **原创数据资产** | 0 个（计划第十六节列出的7 项均未制作） | P2：长期 SEO 增长核心 |
| **外链** | 极少（计划第十六节） | P2：长线建设 |

---

## 二、P0 任务（立即可执行，高 ROI）

### P0-1 专题 Hub 内容充实（计划第十二节）

**现状（4 个 Hub 页平均 15–27 行）：**
- `dividend-etf-history.astro`、`dividend-investing-basics.astro`、`dividend-stock-screening.astro`、`high-yield-dividend-stocks.astro`

**目标结构（每个 Hub 页目标 ≥ 300 行 / ≥ 2000 字）：**

```
1. H1 主题 + 一句话定义
2. 1 段「主题价值声明」(为什么这个主题重要，谁该读)
3. 关键概念/术语表（5–8 条，链接到相关文章）
4. 阅读路径（按投资经验分 3 档：入门 / 进阶 / 专家）
5. 子主题分组（每组 2–4 篇，附简短导读）
6. 核心对比表（如 ETF vs 股票、Aristocrats vs High Yield）
7. 常见问题（FAQ，3–5 条，可加 FAQPage schema）
8. 风险与误区（每主题 3–5 条）
9. 数据来源与方法（E-E-A-T）
10. 最近更新时间（modDate）与下次更新计划
11. 相关 Hub 交叉链接（4 个 Hub 互链）
```

**每个 Hub 的具体内容方向：**

| Hub | 子主题分组 | 重点对比表 | 风险点 |
|-----|-----------|-----------|--------|
| **dividend-etf-history** | YieldMax 系列 / NEOS 系列 / JPMorgan / ProShares / 其他 | distribution rate vs 真实收益型 yield vs SEC 30-day；weekly vs monthly | ROC 比例、NAV 侵蚀、capped upside |
| **dividend-investing-basics** | 概念入门 / 股息类型 / 收益率计算 / DRIP / 税务 / 策略 | 普通股息 vs 分红 vs ROC 税务对照；DRIP 复利 vs 现金收入 | 追逐高收益、税务误区 |
| **dividend-stock-screening** | 筛选指标 / 数据源 / Aristocrats/Kings/ACH / 工具对比 | 5 项核心指标对照（payout ratio、FCF coverage、history、yield sanity、moat） | 数据源差异、回测偏差 |
| **high-yield-dividend-stocks** | 传统高收益 / REITs / BDCs / covered-call ETF | yield 与 total return 分层表；适合/不适合投资者矩阵 | yield trap、cut risk、capped upside |

**执行步骤：**
1. 先写模板组件（`src/components/TopicHub.astro` 或内联结构），确保 4 个 Hub 共用同结构但内容独立
2. 按上述方向逐个充实内容（每个 Hub 预计 1500–2500 字）
3. 4 个 Hub 互相交叉链接（foot 区域）
4. 在文章页底「More in <Hub>」回链基础上，确保 Hub 页能完整反向指向所有子页
5. 添加最近更新日期与下次更新计划（提升 E-E-A-T）
6. `npm run build` + `seo:validate` 通过
7. Hub 页 JSON-LD 加 `Article`（含 author/dateModified）确保搜索可见

**验收：**
- 4 个 Hub 页每个 ≥ 2000 字、≥ 5 个子主题分组、≥ 1 个对比表、≥ 3 条 FAQ、≥ 1 个内部死链为 0
- 文章 → Hub → 子文章 三级内链路径在每个 Hub 都成立
- 构建校验 0 错误；sitemap 仍为 118（Hub 页已存在）

**预计工时：** 2–3 小时。

---

### P0-2 图片性能与 CLS 修复（计划第十四节）

**问题清单（来自 recon）：**

1. ❌ `public/images/dividend-hero.jpg` 是 JPG
2. ❌ 文章封面 `<img>` 无 `width`/`height`（CLS 高风险）
3. ❌ `<img loading="eager">` 全站统一（应仅首屏 hero 用 eager）
4. ❌ 无 `fetchpriority="high"`（LCP 图）
5. ❌ 无 `decoding="async"`（解码阻塞）
6. ❌ 无 `srcset`/响应式多分辨率

**修复方案：**

#### A. 转换 hero 为 WebP/AVIF
```bash
# 推荐：保留 JPG 作 fallback，主用 WebP + AVIF
cwebp -q 80 public/images/dividend-hero.jpg -o public/images/dividend-hero.webp
# AVIF（更小，~30% 优于 WebP）
avifenc --min 30 --max 60 public/images/dividend-hero.jpg public/images/dividend-hero.avif
```
然后更新首页引用，使用 `<picture>` 标签做多格式 fallback：
```astro
<picture>
 <source srcset="/images/dividend-hero.avif" type="image/avif">
 <source srcset="/images/dividend-hero.webp" type="image/webp">
 <img src="/images/dividend-hero.jpg" alt="..." width="1200" height="630" fetchpriority="high" decoding="async">
 </picture>
```

#### B. 修复 `<img>` 属性（`src/layouts/ArticleLayout.astro`）
当前：
```astro
<img src={article.data.image} alt={article.data.title} class="article-cover" loading="eager">
```
改为：
```astro
<img
 src={article.data.image}
 alt={article.data.title}
 class="article-cover"
 width="1200" height="675"          <!--  防止  CLS -->
 loading="eager"                    <!--  封面图首屏保留 eager -->
 fetchpriority="high"
 decoding="async"
>
```

**更彻底**：在文章 frontmatter 中为每个 `image` 加 `width`/`height` 字段，构建时自动注入。或者在构建期用 `sharp` 读取图片真实尺寸，写入 manifest，模板读取。

#### C. 全站懒加载与解码（除 LCP）
- 首页 hero：`eager` + `fetchpriority="high"`
- 文章页封面：`eager` + `fetchpriority="high"`（首屏可见）
- 其他图（文中内嵌、related articles）：`loading="lazy" decoding="async"`

#### D. 响应式多分辨率
为 `articles/*.webp` 生成 `*-480.webp`、`*-960.webp`、`*-1200.webp`，使用 `srcset` 与 `sizes`：
```astro
<img
 src={article.data.image}
 srcset={`${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1200.webp 1200w`}
 sizes="(max-width: 768px) 100vw, 1200px"
 ...>
```

**执行步骤：**
1. 安装并运行 `sharp`（已是 Astro 依赖的一部分）写一个 `scripts/optimize-images.mjs`：
   - 扫描 `public/images/articles/*.webp`，读取尺寸生成 `.json` manifest
   - 扫描 `public/images/dividend-hero.*`，转换 JPG → WebP + AVIF
2. 修改 `src/layouts/ArticleLayout.astro` 注入 `width`/`height`/`fetchpriority`/`decoding`
3. 修改首页 hero 使用 `<picture>` + 多格式 + `fetchpriority="high"`
4. 修改文章页 `<img>` 加 `srcset`/`sizes`（若 manifest 就绪）
5. 构建验证 + 检查渲染 HTML
6. **CWV 验证**：因 GSC 流量不足无法直接看 CrUX，但可用 Lighthouse 本地跑 5–10 个关键页核查 LCP/CLS/INP

**验收：**
- 所有 `<img>` 有 `width`/`height`
- 首屏图 `fetchpriority="high"`，其他 `loading="lazy" decoding="async"`
- hero 有 WebP + AVIF fallback
- Lighthouse 移动端 LCP ≤ 2.5s、CLS ≤ 0.1、INP ≤ 200ms（5 个关键页抽样）

**预计工时：** 1.5–2 小时。

---

### P0-3 JSON-LD 在线验证（计划第十三节）

**现状：** JSON-LD 已生成（Organization、WebSite、Article、Breadcrumb、FAQ），但未用 Google Rich Results Test 抽验。

**执行步骤：**
1. 写一个 `scripts/extract-jsonld.mjs`：从 dist/HTML 抽取所有 JSON-LD 块
2. 对 5–10 个关键页（首页、3 篇文章、2 个中文页、1 个 Hub）用 Google Rich Results Test API 或人工核验
4. 检查项：
   - [ ] URL 全部为 www+HTTPS+尾斜杠
   - [ ] Breadcrumb 末项为当前页
   - [ ] 中文页 Breadcrumb name 为中文
   - [ ] Article author 与 frontmatter 一致
   - [ ] datePublished/dateModified 合理
   - [ ] FAQPage 只在有可见 FAQ 时出现
   - [ ] 无虚构评分/评论
5. 修复发现的问题
6. 写 `SEO-STRUCTURED-DATA-AUDIT.md` 记录抽样结果

**验收：**
- 5 个关键页 100% 通过 Rich Results Test 关键检查（URL/作者/日期/Breadcrumb）
- 不存在「schema 内容与页面不符」的情况

**预计工时：** 0.5–1 小时。

---

## 三、P1 任务（中等 ROI）

### P1-1 中文页数据同步抽检

**背景：** ULTY/BITO 等英文页数据修正后，中文镜像页（`dist/zh/`）需重新生成（机器翻译）。

**步骤：**
1. 带 `OPENAI_API_KEY` 跑 `npm run build`，让 `build-zh-site.mjs` 重新翻译受影响页
2. 抽样验证 5 篇中文页（建议：`ulty-dividend`、`bito-dividend`、`qqqi-dividend`、`high-dividend-stocks`、`msty-dividend-income`）：
   - `dataAsOf` 中文是否翻译为「数据截止 2026-08-27」之类
   - distribution rate、ROC 等关键值是否与英文页同步
   - 中文是否符合金融语境（如「return of capital」应译为「本金返还」）
3. 若机器翻译质量不佳，标注需人工精修的页（首批 5–10 篇）

**验收：**
- 5 篇中文页数值与英文一致
- 中文字段（标题、描述、表格）无明显机翻痕迹
- hreflang `zh-CN`/`x-default`/`en` 双向正确

**预计工时：** 0.5–1 小时（若 CI 已带 key 则更快）。

---

### P1-2 结构化数据二次精修

**可能的问题与处理：**
- FAQPage 在中文页已过滤——确认过滤逻辑无遗漏
- Article JSON-LD 的 author 是固定"Henry Zhou"——核对实际作者身份
- 检查 `publisher` 字段是否一致
- 检查 Hub 页是否缺 JSON-LD（应至少有 WebPage）

**验收：** 所有上述检查通过，输出审计报告。

**预计工时：** 0.5 小时。

---

## 四、P2 任务（长期，高 ROI）

### P2-1 原创数据资产（计划第十六节）

这是**长期 SEO 增长的核心**——可被外链引用的「值得链」的内容。

| 资产 | 形式 | 数据源 | 优先级 |
|------|------|--------|--------|
| ETF 月度派息日历 | HTML 表格 + JSON-LD Dataset | NEOS/YieldMax/JPMorgan distribution pages | P0 |
| ETF 股息历史数据库 | 多个 JSON/CSV + 可视化页面 | 各基金官网 distribution history | P0 |
| 除息日查询页 | 交互式表格 + 筛选 | NEOS/YieldMax 公告 | P1 |
| 高收益 ETF 风险对比表 | 静态表格（含 ROC%/NAV erosion/expense ratio） | 各基金数据 + 247wallst/Yahoo Finance | P1 |
| 年度股息变化图 | SVG/Chart.js 可视化 | 同上 | P1 |
| DRIP 复利计算器 | JS 计算器 | — | P1 |
| ETF 分配率 vs 真实收益率解释页 | 长文 + 例子 | ProShares/YieldMax official | P2 |

**执行建议：**
- 先做 ETF 月度派息日历（最高频需求 + 链接引力最强）
- 模板化所有数据资产为 `/data/<topic>.astro` 静态生成
- 每个资产页加完整 JSON-LD（Dataset 或 Article）
- 完成后每个资产独立提交 GSC 请求收录

**预计工时：** 每个资产 1–3 小时。整体 1–2 天。

---

### P2-2 外链建设（计划第十六节）

**目标外链类型（按价值）：**
1. **指向 Hub 与原创数据页**（高价值）
2. **指向数据驱动长文**（中价值）
3. **品牌提及**（辅助）

**外链目标站点（首批清单）：**
- ETF/dividend 投资博客：SeekingAlpha、ETF.com、ETF Trends
- 个人理财网站：BiggerPockets、Mr. Money Mustache 类型
- 数据工具目录：Awesome ETFs、ProductHunt
- 金融教育网站：Investopedia（user contribution）、Khan Academy Finance
- 相关财经作者：Twitter/Substack dividend 领域作者

**执行步骤：**
1. 准备 outreach 模板（3 句话介绍 + 资产链接 + 价值交换）
2. 制作「Share Kit」：每个原创资产页生成可分享的图表/数据片段 URL（`?utm=...`）
3. 月度节奏：每月联系 20–30 个潜在外链源
4. 跟踪外链增长（GSC「外部链接」报告）

**预计工时：** 持续性工作，每月 2–4 小时。

---

### P2-3 历史年度累计核对

针对 `SEO-DATA-CROSSCHECK.md` 中的「仍需人工/后续核对项」：
- BITO 2024 $14.03 / 2025 $9.52
- ULTY 自 launch 累计 ~$28/股
- QQQI/JEPI 历史月度分配

**来源：** 发行商年度税务汇总（1099-DIV / Form 1099）、fund 官方年度 distribution summary。

**步骤：** 每年 1 月或财年结束后一次性核对，更新 `dataAsOf` 与「Last 12 months」段落。

---

## 五、阻塞项（需用户提供数据）

| 项 | 需要什么 | 时机 |
|----|---------|------|
| CTR 第二轮标题 | GSC「效果」最近 28 天数据（CSV 或截图） | 用户在 GSC 操作后 |
| 历史年度累计额 | 发行商官方年度税务汇总 | 每年 1 月或财年结束后 |
| Cloudflare Email Obfuscation 决策 | 用户确认是否关闭 | 一次性 |
| HSTS 启用 | 用户确认 | 一次性 |
| 中文页翻译质量精修 | OPENAI_API_KEY + 人工抽检 | 持续 |

---

## 六、执行顺序（建议）

**立即（今天）**：P0-1（Hub 充实）+ P0-2（图片修复）+ P0-3（JSON-LD 验证）
**短期（1 周内）**：P1-1（中文同步）+ P1-2（结构化精修）
**中期（2–4 周）**：P2-1 第一个资产（月度派息日历）
**长期（持续）**：P2-2 外链建设；P2-3 历史核对（年度节奏）

---

## 七、验收标准汇总

| 任务 | 核心验收 |
|------|---------|
| P0-1 Hub 充实 | 4 个 Hub 各 ≥ 2000 字、≥ 5 子主题、≥ 1 对比表、≥ 3 FAQ、内链为 0 |
| P0-2 图片性能 | 所有 `<img>` 有 w/h；首屏 fetchpriority=high；hero 有 WebP+AVIF；Lighthouse LCP≤2.5s, CLS≤0.1 |
| P0-3 JSON-LD | 5 关键页 100% 通过 Rich Results Test |
| P1-1 中文同步 | 5 篇中文数值与英文一致，无明显机翻 |
| P1-2 结构化精修 | 所有 schema 与页面内容一致 |
| P2-1 数据资产 | 至少 1 个可被外链引用的资产上线 + 收录 |
| P2-2 外链 | 月度 5+ 新外部链接建立 |
| P2-3 历史核对 | 年度数据更新到页 |

---

## 八、风险登记

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| Hub 充实后被搜索引擎判为 thin content | 低 | 中 | 保证 2000+ 字 + 实质内容（非堆砌）+ 内部链接 |
| 图片修复引发新 CLS | 低 | 中 | 验证 w/h 与实际尺寸一致；Lighthouse 回归 |
| 中文页机翻被搜索引擎识别为低质 | 中 | 中 | 关键页人工精修；加中文 FAQ |
| 数据资产未被外链引用 | 中 | 中 | 主动 outreach；Share Kit 设计 |
| 外链 outreach 失败率高 | 高 | 低 | 价值交换（提供数据/图表）；持续优化模板 |