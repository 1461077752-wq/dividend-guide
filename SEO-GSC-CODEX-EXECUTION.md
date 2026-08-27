# Dividend01.com — GSC 执行文档（由 Codex 负责）

> 制定日期：2026-08-27  
> 负责人：Codex  
> 范围：只处理 Google Search Console 中的检查、提交、验证与数据导出。站点代码、内容和 Cloudflare 修改不包含在本文档中。

## 一、已经确认的线上前提

- 规范域名：`https://www.dividend01.com`
- 所有页面 URL 以 `/` 结尾；静态资源、`robots.txt` 和 `sitemap.xml` 除外。
- HTTP、非 www 和页面缺少尾斜杠时，均应 301 到最终规范 URL。
- `/zh/zh/.../` 已通过 Cloudflare 最高优先级规则单次 301 到 `/zh/.../`。
- `https://www.dividend01.com/sitemap.xml` 已实测返回 HTTP 200 和 XML 内容。
- 当前 sitemap 含 120 个 URL；验收以执行时 sitemap 的实际 `<loc>` 数量为准，不把 120 作为永久固定值。

## 二、执行前置条件

在 GSC 操作前，必须同时满足：

1. 用户已完成本轮站点修改、推送和线上部署。
2. 线上 sitemap 已反映最新页面。
3. 重点页面返回 200，canonical 指向自身规范 URL。
4. 用户已在应用内浏览器登录 Google Search Console。
5. GSC 中选择的是覆盖 `www.dividend01.com` 的正确属性；可以是域名属性，也可以是已验证的 `https://www.dividend01.com/` URL 前缀属性。

## 三、Codex 执行动作

### G1. 读取当前 GSC 状态

动作：

1. 打开“网页索引”“Sitemaps”“效果”和“HTTPS”报告。
2. 记录报告更新时间、已收录数、未收录数及各原因数量。
3. 保存当前 sitemap 列表、状态和发现页数。
4. 读取 404、重定向、已抓取未收录、已发现未收录的示例 URL。

验收：

- 获得一份带日期的基线数据。
- 区分历史报告与当前仍可复现的问题。

### G2. 提交规范 www sitemap

提交地址：

`https://www.dividend01.com/sitemap.xml`

动作：

1. 在 GSC 的 Sitemaps 页面提交规范 sitemap。
2. 等待并刷新状态。
3. 核对状态是否为“成功”。
4. 将“已发现的网页数”与线上 sitemap 实际 URL 数对照。

验收：

- 状态为“成功”。
- 发现页数与实际 sitemap 数量一致或处于合理的短暂同步阶段。
- 不出现“无法抓取”或 sitemap 格式错误。

异常处理：

- 如果仍显示“无法抓取”，先检查属性类型、提交路径和 Google 最近读取时间；不反复提交多个重复记录。
- 旧的非 www sitemap 记录暂不删除。它不会直接造成排名问题，待 www 记录稳定后再决定是否清理。

### G3. 启动 404 修复验证

动作：

1. 打开“网页索引 → 未找到 (404)”。
2. 核对示例 URL 是否主要为已经修复的 `/zh/zh/` 历史地址。
3. 单独检查是否仍包含 `/cdn-cgi/l/email-protection` 或其他尚未处理的 404。
4. 只有当报告中的已知原因均已处理或属于明确的历史状态时，点击“验证修复”。

验收：

- 验证状态变为“已开始”或“进行中”。
- `/zh/zh/` URL 后续逐步从 404 报告退出并转入重定向状态。

注意：

- 如果 `/cdn-cgi/l/email-protection` 仍能在线上复现，先不启动整组验证，以免整次验证失败。

### G4. 检查规范页面并请求编入索引

第一批候选：

- `https://www.dividend01.com/articles/ulty-dividend/`
- `https://www.dividend01.com/articles/qqqi-dividend/`
- `https://www.dividend01.com/articles/msty-dividend-income/`

第二批候选：

- `https://www.dividend01.com/articles/high-dividend-stocks/`
- `https://www.dividend01.com/articles/dividend-calculator-guide/`

动作：

1. 逐个使用 URL 检查。
2. 确认检查的是带 www、HTTPS 和尾斜杠的规范 URL。
3. 查看 Google 选择的 canonical 是否与用户声明的 canonical 一致。
4. 页面已经收录且无需更新时，不重复请求。
5. 页面未收录或刚完成实质更新时，执行“测试实际网址”，通过后请求编入索引。
6. 遇到每日配额时停止，下一次继续，不连续重复点击。

验收：

- 请求成功进入处理队列。
- 无 robots、noindex、canonical、抓取或服务器错误。

### G5. 导出可用于 CTR 优化的数据

数据范围：最近 28 天，同时保留最近 3 个月作为趋势参考。

动作：

1. 导出页面维度：页面、点击、展示、CTR、平均排名。
2. 筛选展示较高、平均排名约 5–20、CTR 低于 1% 的页面。
3. 对候选页面逐个设置页面筛选，再导出该页面对应的查询数据。
4. 标记品牌词、非目标意图词和样本量过低的查询。
5. 输出第一轮 3–5 个 CTR 测试页面，不一次性修改全站标题。

验收：

- 得到页面数据及其对应的主要查询。
- 每个标题调整都能对应到真实查询，而不是根据通用关键词猜测。

### G6. 输出执行结果

Codex 完成后向用户报告：

- GSC 报告读取日期和数据更新时间；
- sitemap 提交状态与发现页数；
- 404 验证是否启动；
- 哪些页面已请求收录、哪些无需重复请求；
- 未完成事项和原因；
- CTR 第一批候选页面及依据。

## 四、不执行的动作

- 不对非 www、HTTP、缺尾斜杠或 `/zh/zh/` 旧地址请求收录。
- 不把正常 301 URL 当成错误要求移除。
- 不为追求后台整洁立即删除旧 sitemap。
- 不在内容未部署前请求重新索引。
- 不保证“请求编入索引”一定会使页面收录；最终决定由 Google 作出。

## 五、完成标准

- 规范 www sitemap 在 GSC 中成功。
- 404 验证在满足前提后启动。
- 已完成实质升级的重点规范页面被检查并按需请求收录。
- 已导出可用于 CTR 决策的页面与查询数据。
- 所有操作都有明确日期、结果和异常记录。

## 六、2026-08-27 执行记录（本次复核）

### 本地与线上前置条件

- GitHub 与线上部署已同步，当前线上 sitemap 实测为 120 个规范 URL。
- 本地构建、中文站构建、sitemap 生成、JSON-LD 审计和 SEO 构建校验均通过。
- 线上规范检查 21/21 通过：`www`、HTTPS、尾斜杠、`/zh/zh/` 301 规则均符合预期。
- 当前仍发现 Cloudflare Email Address Obfuscation 生成的 `/cdn-cgi/l/email-protection` 真实 404；该项由 Cloudflare 配置/联系方式处理，不在本执行文档内直接修改。

### G1 读取结果

读取属性：`sc-domain:dividend01.com`
读取日期：2026-08-27

- 网页索引报告上次更新：2026-08-21。
- 已编入索引：118。
- 未编入索引：60。
- 未编入索引原因：自动重定向 19（验证失败）、404 15（未启动）、备用网页（有适当的规范标记）10（未启动）、已抓取尚未编入索引 14（未启动）、已发现尚未编入索引 2（未启动）。
- HTTPS：78 个良好、0 个非 HTTPS。
- 路径增强功能：81 个有效、0 个无效。

### G2 sitemap 状态

- `https://dividend01.com/sitemap.xml`：成功，GSC 当前显示发现 118 页。
- `https://www.dividend01.com/sitemap.xml`：成功，GSC 当前显示发现 118 页。
- 线上实际 sitemap：120 个 URL。
- 已执行：2026-08-27 重新提交规范 `www` sitemap；提交对话框确认成功。
- 提交后 GSC 显示：上次提交/读取 2026-08-27、状态“成功”、已发现 120 页、视频 0 个，与线上 sitemap 实际数量一致。
- 旧的非 www sitemap 记录保留：状态“成功”、发现 118 页；暂不删除，避免在规范记录稳定前引入无必要变更。

### G3 404 验证状态

- 暂不启动整组“未找到 (404)”验证。
- 原因：报告示例中仍包含 `/cdn-cgi/l/email-protection`，线上访问仍返回 404；若此时启动，整组验证可能因该项失败。
- `/zh/zh/.../` 历史地址已在线上单次 301 到规范 `/zh/.../`，待 Cloudflare 邮件保护 404 处理后再启动验证。

### G4 重点页面检查结果

以下 5 个规范 URL 均显示“网址已收录到 Google”，HTTPS 与路径增强项正常，因此本次不重复请求编入索引：

- `/articles/ulty-dividend/`
- `/articles/qqqi-dividend/`
- `/articles/msty-dividend-income/`
- `/articles/high-dividend-stocks/`
- `/articles/dividend-calculator-guide/`

### G5 效果数据读取/导出

- 最近 28 天（2026-07-28 至 2026-08-24）：14 次点击、13,320 次展示、CTR 0.1%、平均排名 13.6。
- 最近 3 个月（2026-07-26 至 2026-08-24）：16 次点击、13,323 次展示、CTR 0.1%、平均排名 13.6。
- 高展示查询示例：`best dividend stocks for beginners`（2 点击、10,929 展示）；其余主要查询为 `jepq dividend history`、`nvdy dividend history`、`股息如何運作` 等。
- 已从“效果”报告触发 CSV 导出；后续标题/摘要 CTR 测试仍应基于导出的页面—查询明细，不根据单一汇总词直接全站改标题。

### 当前完成度

- 已完成：G1、重点页面 G4 检查、G5 汇总读取/导出。
- 已完成：G2 规范 www sitemap 重新提交，状态成功且发现 120 页。
- 明确阻塞：G3 404 验证，等待 Cloudflare 邮件保护 404 处理。
