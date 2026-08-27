# Dividend01.com — 用户执行计划书

> 生成时间：2026-08-27。本文件汇总**本机/沙箱环境无法替你完成**的所有动作，按重要性排序。
> 你按这份清单逐项处理即可；所有线上改动执行前我会再与你确认。

---

## A. Google Search Console 操作（5 步，约 2 分钟）

**前提**：你的 GSC 已验证 `https://www.dividend01.com` 属性。

| 步骤 | 操作 | 验收 |
|------|------|------|
| A1 | GSC → 索引 → Sitemaps → 提交 `https://www.dividend01.com/sitemap.xml` | 状态「成功」、发现 118 页 |
| A2 | 成功后删除旧非 www / 重复 sitemap 记录 | 仅保留 www 一条 |
| A3 | GSC → URL 检查 → 提交规范页收录：`/articles/ulty-dividend/`、`/articles/qqqi-dividend/`、`/articles/high-dividend-stocks/`、`/articles/msty-dividend-income/`、`/articles/dividend-calculator-guide/` | 「请求编入索引」 |
| A4 | GSC → 网页索引 → 未找到 (404) → 「验证修复」 | 启动验证；15 个 `/zh/zh/` 404 预计随 Cloudflare 规则逐步下降 |
| A5 | GSC → 效果 → 日期「最近 28 天」→ 导出 页面×查询×展示×点击×CTR×排名 | 把 CSV/截图贴给我，我据此应用 CTR 第二轮标题 |

详细逐步点按说明见 `SEO-GSC-ACTIONS.md` 附录 A–E。

---

## B. Cloudflare 设置（一次性，5 分钟）

| 项 | 当前状态 | 决策点 | 建议 |
|----|---------|--------|------|
| Email Address Obfuscation | 不确定 | 是否产生 `/cdn-cgi/l/email-protection` 抓取错误？本机 grep 已确认 **dist/ 中0 个**此类链接，说明页面里已没有邮箱触发该功能，可保持开启或关闭（安全关闭）。 | 安全做法：关闭该功能（Cloudflare 控制台 → 速度 → 优化 → Email Address Obfuscation → Off） |
| HSTS | 未启用 | 是否启用 HTTP Strict Transport Security？新域建议启用。 | 若所有子域都已支持 HTTPS，建议启用：`Cloudflare → SSL/TLS → 边缘证书 → HSTS → 启用 max-age=6 个月` |
| Always Use HTTPS | 已开 | 确认（只读） | — |
| SSL 模式 | Full / Full (strict) | 确认（只读） | — |

> Cloudflare 现有 3+1 条 Redirect Rules（含 `/zh/zh/*` → `/zh/*`）**保持不变**，上轮已验证。

---

## C. 中文镜像页同步（需 `OPENAI_API_KEY`，可选）

**背景**：CI 无 `OPENAI_API_KEY` 时 `scripts/build-zh-site.mjs` 不会重新翻译中文页，ULTY/BITO 数据修正后中文页可能仍含旧数字。

**步骤**：
1. 本地或 CI 注入 `OPENAI_API_KEY=<your-key>`
2. 跑 `npm run build`，让 `build-zh-site.mjs` 重新生成受影响的中文页
3. 抽样验证 5 篇：`/zh/articles/ulty-dividend/`、`/zh/articles/bito-dividend/`、`/zh/articles/qqqi-dividend/`、`/zh/articles/high-dividend-stocks/`、`/zh/articles/msty-dividend-income/`
4. 验收：`dataAsOf` 显示「数据截至 2026-08-27」、distribution rate 等关键值与英文一致

**不做也行**：若你的中文流量极低、英文页已收录且足够，中文页暂不重生成也不影响 SEO 主体。

---

## D. 原创数据资产（需数据源，2–8 小时起步）

**优先 1 个：ETF 月度派息日历**（最高 ROI，最可被外链引用）

**结构**：
- 静态 HTML 表格 + JSON-LD `Dataset` schema
- 覆盖 NEOS 全家族（QQQI、SPYI、IWMI、NIHI、BTCI、NEHI、IYRI、IAUI、MLPI 等）+ JPMorgan JEPI/JEPQ + YieldMax ULTY 等高频被引用 ETF
- 列：基金名、ticker、分红频率、最近一次 ex-date、最近一次派息金额、SEC 30-day yield、distribution rate、ROC %
- 数据源：NEOS 官网每基金页、YieldMax 19a-1、JPMorgan ETF 页面
- 模板化路径：`/data/dividend-calendar/`

**第二个资产：ETF 股息历史数据库**
- 每个基金的月度/季度派息时间序列页面
- JSON 可下载（CSV / JSON-LD Dataset）
- 长期看是最高质量的 linkbait

**执行建议**：先做日历（1 周内），再做数据库（2 周内）。每个完成后立即在 GSC 请求收录并启动 2–3 个外链 outreach。

---

## E. 外链 outreach（持续，每月 2–4 小时）

**目标类型**（按价值）：
1. ETF/dividendend 投资博客：SeekingAlpha、ETF.com、ETF Trends、YieldMax-focused Substack
2. 个人理财网站：BiggerPockets 风格的稳健投资社区
3. 数据工具目录：awesome-etfs、ProductHunt「Finance Tools」、类似 launch directory
4. 金融教育：Investopedia user contributions、Khan Academy Finance community

**外链落点优先级**：
1. ETF 月度派息日历（做出来后）
2. 4 个 Hub 页（已充实）
3. 数据驱动长文（ULTY/BITO/QQQI 等）

**节奏**：每月发 20–30 封 outreach，价值交换（提供数据/图表/原始 CSV），跟踪 `SEO-CTR-PROPOSAL.md` 中的"backlink growth"指标。

---

## F. 历史年度累计核对（年度节奏，1 月或财年结束后）

针对 `SEO-DATA-CROSSCHECK.md` 中的「仍需人工核对项」：
- BITO 2024 $14.03 / 2025 $9.52
- ULTY 自 launch 累计 ~$28/股
- QQQI/JEPI 历史月度分配

**来源**：发行商年度税务汇总（1099-DIV / 年度 distribution summary）。可从发行商官网「Tax Documents」「Year-End Distribution」页面获取。

**步骤**：每年 1 月或财年结束后一次性核对，更新 `dataAsOf` 与「Last 12 months」段落。

---

## G. CTR 第二轮（需 GSC 28 天数据，待 A5 完成后）

按 `SEO-CTR-PROPOSAL.md` 中剩余的页面，应用第二轮标题。每轮 3–5 页，改后观察 14–28 天。

---

## 优先级建议

| 紧急 | 中期 | 持续 |
|------|------|------|
| A1–A5 GSC（今天） | B Cloudflare 一次性（本周） | D 数据资产（按月） |
| — | C 中文同步（如有 OPENAI_KEY） | E 外链 outreach |
| — | — | G CTR 第二轮 |

---

## 验收对照

| 任务 | 验收方式 |
|------|---------|
| A GSC | GSC 截图显示 sitemap 成功 + 收录状态 |
| B Cloudflare | Cloudflare 控制台截图 + 线上 curl 复测 |
| C 中文同步 | `dist/zh/articles/*` HTML 中 `dataAsOf` 显示 2026-08-27 |
| D 数据资产 | 页面有 JSON-LD Dataset + 至少 1 条外链 |
| E 外链 | GSC「外部链接」报告月度增长 |
| F 历史核对 | `SEO-DATA-CROSSCHECK.md` 中标注完成 |
| G CTR | 14–28 天后 GSC「效果」对比 |