# Dividend01.com — 标题与 Meta Description 优化提案（CTR）

> 生成时间：2026-08-27。对应计划第九节（第三批）。
> **应用前提**：需先从 GSC 导出最近 28 天「查询 / 页面」数据，按「展示高、平均排名 5–20、CTR<1%、已收录」筛选目标页，再按本提案改写。
> **节奏**：每轮只改 3–5 个页面，改后观察 14–28 天，不频繁连改（计划明确要求）。本提案为待应用草稿，未写入源代码。

## 改写规则（来自计划第九节）

- 标题优先表达：标的名称 + 当前年份 + 股息/收益率/历史 + 用户将获得的具体信息。
- Meta description 说明：当前派息金额、数据更新时间、是否含历史记录、是否含除息日、是否分析风险。
- 标题长度 ≤ 60 字符（英文），描述 110–160 字符，避免堆砌。

## 内容目标页标题/描述提案

| 页面 | 当前标题 | 提案标题 | 提案 Meta Description |
|------|----------|----------|----------------------|
| high-dividend-stocks | High Dividend Stocks: 4%–8% Yield and Risk Guide | **High Dividend Stocks 2026: 4%–8% Yields, Payout Safety & Top Picks** | High dividend stocks paying 4%–8% in 2026: compare yield, payout coverage and sector risk for VZ, MO, O, ET and more. Data as of Aug 2026, with FAQ. |
| msty-dividend-income | MSTY Dividend: How Much Does It Pay and Can You Live Off It? | **MSTY Dividend Income 2026: Monthly Payouts, Yield & Risks** | MSTY paid ~$0.14–$4.42/share historically. See 2026 monthly distribution ranges, yield math, NAV erosion risk and whether you can live off the income. |
| ulty-dividend | ULTY Dividend: Yield, Total Return and Key Risks | **ULTY Dividend 2026: Yield, Weekly Payment Dates & Distribution History** | ULTY pays weekly distributions via a covered-call strategy. See 2026 yield, payment dates, distribution history and total-return risks. Data as of Aug 2026. |
| dividend-calculator-guide | Dividend Calculator: How to Project Your Dividend Income | **Dividend Calculator Guide 2026: Project Income, DRIP & Yield** | Learn to project dividend income with our calculator: model DRIP compounding, yield on cost and monthly payouts. Step-by-step with examples. |
| tariff-dividend* | Tariff Dividend: Proposal, Funding and Payment Status | **Tariff Dividend Check 2026: Is the Trump Tariff 'Dividend' Real?** | No official tariff dividend or DOGE dividend check exists as of 2026. Here is what the proposal says, who would qualify, and why it has not been funded. |
| tariff-dividend-check* | Tariff Dividend Check: Status and Eligibility | （合并到 tariff-dividend，301） | 见上，不单独保留 |
| best-dividend-stocks-2025** | Best Dividend Stocks 2025: Year-in-Review and Picks | **Best Dividend Stocks 2026: Top Picks by Yield, Growth & Safety**（若迁移） | Top dividend stocks for 2026 ranked by yield, dividend growth and payout safety, with Aristocrats and high-yield picks. Updated Aug 2026. |

\* tariff-dividend 与 tariff-dividend-check、trump-tariff-dividend、trump-2000-dividend 存在内耗，提案假设保留 `tariff-dividend` 为唯一落地页，其余 301（见 `SEO-KEYWORD-MAP.md` 治理项 1）。** 取决于「2025 年份决策」（见下）。

## 待你决策的依赖项

1. **Tariff 集群合并**：确认保留 `tariff-dividend` 为唯一 URL，其余三页 301（需新建 Cloudflare 规则，属线上变更，需确认）。
2. **best-dividend-stocks-2025 年份走向**：
   - 若持续更新 → 改 2026 或迁移常青 URL（如 `/articles/best-dividend-stocks/`），旧 URL 301；
   - 若为历史档案 → 标题保留 2025 但正文明确标注「2025 历史回顾」并链接至 2026 页，不暗示当前建议。

## 应用流程（确认后）

1. 导出 GSC 最近 28 天数据，确认上述页面符合「展示高/排名 5–20/CTR<1%」。
2. 每轮选 3–5 页，用 Edit 修改 `src/content/articles/<id>.md` 的 `title` 与 `description`。
3. 重新构建（`npm run build`）确认校验通过。
4. 记录修改前展示/点击/CTR/排名，14–28 天后复盘。
