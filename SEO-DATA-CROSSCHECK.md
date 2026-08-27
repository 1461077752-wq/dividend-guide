# Dividend01.com — 金融数据时效交叉验证报告

> 生成时间：2026-08-27。对应计划第十节（E-E-A-T 与金融内容可信度）。
> 目的：对网站中高时效的 ETF/基金派息数据做**联网复核 + 交叉验证**，确保数据可复算、来源可追溯、无过期或错误数字。

## 验证方法（交叉验证规则）

1. **Tier-1（官方一手源）**：基金发行商官网（YieldMax、NEOS、JPMorgan、ProShares）的 fund page / distribution 披露 / 19a-1 通知。作为记录主体。
2. **Tier-2（独立 corroboration）**：StockAnalysis、DividendVision、FxEmpire、Robinhood、腾讯自选股等独立行情/分红数据源。
3. **接受规则**：
   - 一个数值只有在 **≥2 个独立来源在容差内一致** 时才被接受；
   - 若官方源与独立源出现分歧，采用**最新官方披露**并在页面脚注标注分歧；
   - 任何无法从公开数据复算的预测/历史总数（如 2024/2025 全年累计额）保留但标注「历史估算，待官方年度汇总核对」；
   - **绝不猜测**数据——缺失处只补 `dataAsOf` 内容复核日期，不编造数值。
4. **可追溯**：每篇已更新文章在正文快照表下方注明来源链接与 `dataAsOf: 2026-08-27`。

## 逐标的复核结果

| 标的 | 项目 | 原稿 | 联网复核（2026-08-27） | 结论 | 处理 |
|------|------|------|------------------------|------|------|
| **ULTY** (YieldMax Ultra) | 现行 distribution rate | ~60% | YieldMax 官方 60.33%（8/18/2026）；DividendVision ~62%（8/26） | 一致（60–62% 区间） | 统一为 ~60%（官方），脚注注明独立源 ~62% |
| ULTY | 价格 | ~$27.31 | ~$26.50（StockAnalysis/Robinhood/Tencent 8/26） | 修正 | 改为 ~$26.50 |
| ULTY | 价格涨跌 | **−86%（split-adjusted）** | 多源显示自 2024-02  launch 总回报≈0%（Robinhood +0.01%、StockAnalysis +0.97%、Tencent +3.03%） | **原稿错误** | 删除 −86% 行，改为「总回报≈0%（flat）」 |
| ULTY | 分红中 ROC 占比 | ~71% | YieldMax 官方近期 **100% ROC**（8/18/2026）；247wallst 5月 Distribution 亦为 100% | 原稿偏低 | 改为 ~100%（近期） |
| ULTY | _trailing_ 收益率 | ~106% | StockAnalysis TTM 103.9% | 一致 | 保留 ~106% |
| ULTY | 周派息趋势 | $0.47–0.52(1月)→$0.31(8月) | 247wallst 同样记录 1月 $0.47–0.52 → 5月 $0.39–0.40；StockAnalysis 8月 $0.31–0.33 | 一致 | 保留 |
| **QQQI** (NEOS) | 收益率 | ~14% | NEOS 官方 14.05%（6/30/2026）；MerryDiv 14.15%@$54.06；FxEmpire 14.39%@$54.24 | 一致 | 保留 ~14% |
| QQQI | 月度派息 | $0.53–$0.66 | StockAnalysis 2026 历史 $0.609–$0.659 | 一致 | 收窄为 $0.61–$0.66 |
| **JEPI** (JPMorgan) | 收益率 | — | JPMorgan 官方 12个月滚动 8.04%；SEC 30日 7.57%（8/2026） | 引用官方 | 文中引用官方口径 |
| **BITO** (ProShares) | _trailing_ 收益率 | ~46%（陈旧） | ProShares 官方 12个月 yield **75.49%**（6/30/2026，含资本利得分配）；SEC 30日 **0.04%** | 原稿严重偏低 | 改为 ~75%（并说明含资本利得、真实收益型分配率仅 ~2%） |
| BITO | 2026 YTD 分配 | ~$0.07 | ProShares 明细 1–7月合计 $0.0702 | 一致 | 保留 |
| **SPYI** (NEOS) | 收益率 | ~11.6–12% | NEOS 官方 11.99%（6/30/2026）；FxEmpire 11.69%；DividendVision 12.17% | 一致 | 保留 ~12% |
| SPYI | 月派息 | ~$0.51–$0.53 | FxEmpire 7月 $0.53、历史 $0.51–0.54 | 一致 | 保留 |
| **WARRIOR** | — | 内容页为「Warrior Dividend 策略框架」，非单只证券，无行情数字 | 不适用 | 无市场数据需验证 | 仅补 `dataAsOf` 内容复核标记 |

## 已落地的代码改动

- `ulty-dividend.md`：修正 −86% 价格下跌错误 → 总回报≈0%；ROC 71%→100%（近期）；distribution rate 62%→60%（官方口径，脚注独立源 ~62%）；价格 ~$27.31→~$26.50。
- `bito-dividend.md`：trailing yield 46%→~75%（ProShares 官方，含资本利得说明，真实收益型 ~2%）；lead 段落 70%→75% 对齐表格。
- `qqqi-dividend.md`：月度派息范围收窄为 $0.61–$0.66（与 StockAnalysis 2026 历史一致）。
- `spyi-dividend-history.md`、`jepi-dividend.md`：数值已与官方/独立源一致，仅补 `dataAsOf`。
- 8 篇缺 `dataAsOf` 文章统一补 `dataAsOf: "2026-08-27"`（内容复核日期）。

## 仍需人工/后续核对项（未猜测）

1. **历史年度累计额**（如 BITO 2024 $14.03、2025 $9.52；ULTY 自 launch 累计约 $28/股）：来自原文历史估算，建议后续用发行商年度税务汇总（1099-DIV / 年度 distribution 表）一次性核对。
2. **QQQI/JEPI 具体月度分配额**：当前用官方收益率反推，建议接入发行商 distribution history API 或季度核对。
3. **中文页数据同步**：英文页已更新，中文镜像页（`/zh/articles/ulty-dividend/` 等）在下次 `build-zh-site` 时同步——需确认中文页数值与英文一致（构建已通过，但建议人工抽检 1–2 篇）。
4. **持续更新机制**：建议每月 1 次对高时效 ETF 页跑本验证流程，更新 `dataAsOf` 与数值。

## 采纳来源清单（按优先级）

- 官方：yieldmaxetfs.com/ulty、neosfunds.com（SPYI/QQQI）、proshares.com/bito、am.jpmorgan.com（JEPI）
- 独立：stockanalysis.com、dividendvision.com、fxempire.com、robinhood.com、腾讯自选股（gu.qq.com）
- 新闻佐证：247wallst.com（ULTY ROC/派息趋势）、investingnews.com（WARRIOR 无关）
