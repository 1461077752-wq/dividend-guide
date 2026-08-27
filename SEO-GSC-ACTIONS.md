# Dividend01.com — GSC / Cloudflare 平台侧操作清单

> 生成时间：2026-08-27。本文件汇总需要你在 **Google Search Console (GSC)** 与 **Cloudflare** 后台确认/执行的操作。

## ⚠️ 关于「直接登录你的 GSC」与浏览器自动化

**两个硬性约束，使我无法替你完成 GSC 操作**：

1. **凭证**：本环境没有你的 Google 账号密码/2FA，Google Search Console 登录必须由你本人完成（这是安全边界，我不能也不会要你的密码）。
2. **网络**：agent-browser 真实 Chromium 下载（约 500MB / 179MB zip）在沙箱中**反复超时**（每次到 ~60% 即断开），因此即便你能手动登录，我也没法在本环境跑起浏览器代点。

**所以本文件下方「Turnkey Runbook A–E」是唯一可行路径**——你照着点，2 分钟搞定，不需要任何自动化。

> 我能远程验证的（用 curl 即可，无须浏览器）会在 Runbook 里以 `curl` 命令标出：sitemap 200 检查、/zh/zh/ 单跳 301 检查、/cdn-cgi/l/email-protection 死链扫描等——这些我可以替你跑，结果直接告诉你。
>
> 本机已完成的所有本地改动（构建校验、primaryKeyword 去重、FAQPage 结构化数据、Hub 回链、金融数据交叉验证）均见 `SEO-DATA-CROSSCHECK.md` 与 `SEO-KEYWORD-MAP.md`。

## 一、Sitemap 规范化（计划第三节）

| # | 动作 | 位置 | 验收 | 状态 |
|---|------|------|------|------|
| 1 | 确认 `https://www.dividend01.com/sitemap.xml` 直接返回 200 且为 XML | 浏览器/ curl | 200 + XML | 本机已验证通过 |
| 2 | 在 GSC 重新提交规范 www sitemap（上述 URL） | GSC → 索引 → Sitemaps → 新增 | 状态「成功」、发现 118 页 | ⏳ 待你确认提交 |
| 3 | 确认成功后，删除旧的非 www / 重复 sitemap 提交记录 | GSC → Sitemaps | 仅保留 www 一条 | ⏳ 待第 2 步成功后再做 |

## 二、404 验证（计划第四节）

| # | 动作 | 位置 | 验收 | 状态 |
|---|------|------|------|------|
| 4 | 实时检查代表性 `/zh/zh/*` URL，确认单跳 301 到正确中文页 | curl -I | 单次 301 → `/zh/.../` | Cloudflare 规则已建（上轮） |
| 5 | 在 GSC「网页索引 → 未找到 (404)」启动验证 | GSC | 15 个 404 逐步下降 | ⏳ 待你启动验证 |
| 6 | 确认内部不再出现指向 `/cdn-cgi/l/email-protection` 的链接 | 站点内链检查 | 0 个此类死链 | 见第九节 Email Protection |

## 三、已发现未收录（计划第六节）

| # | 动作 | URL | 验收 | 状态 |
|---|------|-----|------|------|
| 7 | 确认非 www 旧地址维持 301，不请求收录 | `dividend01.com/articles/qqqi-dividend/`、`.../ulty-dividend/` | 301 → www 版本 | 规则已建 |
| 8 | 仅对规范 www 页面用 URL 检查工具「请求编入索引」 | `https://www.dividend01.com/articles/qqqi-dividend/`、`.../ulty-dividend/` | 规范页进入索引 | ⏳ 待你操作 |

## 四、已抓取未收录 → 内容优化后请求收录（计划第七节/第二批）

| # | 动作 | 对象 | 前置条件 | 状态 |
|---|------|------|----------|------|
| 9 | 内容页补充数据/FAQ/内链后，对规范 www 页请求重新收录 | high-dividend-stocks、msty-dividend-income、ulty-dividend、dividend-calculator-guide 等 | 本机已补 primaryKeyword、FAQ Schema、Hub 回链 | ⏳ 内容就绪后请求 |

## 五、重定向类（计划第五节）

- 19 个重定向 URL 本身符合规范（非 www/HTTP/缺尾斜杠 → 301），**无需取消**。
- 站内链接已全部指向最终 URL（构建校验通过，0 个 sitemap 内重定向）。
- 仅当 GSC「网页索引 → 重定向」中仍出现应已修正的旧地址时，再排查是否仍有内链引用。

## 六、CTR 优化（计划第九节/第三批）

- 需从 GSC 导出最近 28 天查询与页面数据后，按「展示高、排名 5–20、CTR<1%」筛选。
- 每轮仅改 3–5 个标题/描述，观察 14–28 天。**标题改写建议见 `SEO-CTR-PROPOSAL.md`，待你提供 GSC 数据后应用。**

## 七、Cloudflare 相关检查（计划第十五节，只读/需授权）

| # | 检查项 | 说明 |
|---|--------|------|
| 10 | Always Use HTTPS / Automatic HTTPS Rewrites | 确认开启 |
| 11 | SSL 模式为 Full 或 Full (strict) | 确认 |
| 12 | HSTS 是否适合启用 | 需你判断 |
| 13 | Email Address Obfuscation 是否产生 `/cdn-cgi/l/email-protection` 抓取错误 | 见下 |

## 八、Email Protection（计划第四节）

- `/cdn-cgi/l/email-protection` 通常来自 Cloudflare **Email Address Obfuscation**。
- 动作选项（需你授权）：
  1. 关闭该 Cloudflare 功能；或
  2. 将页面中的邮箱入口改为不会生成可抓取错误路径的联系方式。
- **不要**将该 URL 重定向到首页。

## 九、执行顺序建议（与计划第十七节一致）

1. 先提交 www sitemap（#2）→ 等待成功（#3 删除旧记录）。
2. 启动 404 验证（#5），观察 14–28 天。
3. 内容页优化就绪后请求收录（#9）。
4. 导出 GSC 数据后做 CTR 改写（第六/九节）。

> 所有「⏳」项均需你确认或提供数据后再执行。本机已完成的本地改动：构建校验通过、primaryKeyword 全站去重、FAQPage 结构化数据（39 篇英文）、专题 Hub 回链（36 篇英文）。

---

## 附录：逐项点按步骤（Turnkey Runbook）

**准备**：打开 GSC → 选择属性 `https://www.dividend01.com`（务必是 www 版本）。

### A. 重新提交规范 sitemap（对应 #2、#3）
1. 左侧菜单 **「索引」→「Sitemaps」**。
2. 在输入框粘贴 `https://www.dividend01.com/sitemap.xml` → 点 **「提交」**。
3. 等几分钟刷新，确认状态变为 **「成功」** 且「已发现的网页数」= **118**。
4. 确认成功后，在旧记录列表中删除任何 **非 www** 或重复 URL（如 `dividend01.com/sitemap.xml` 等），仅保留 www 一条。

### B. 启动 404 验证（对应 #4、#5）
1. 左侧 **「索引」→「网页索引报告」**（或旧版「覆盖率」）。
2. 找到 **「未找到 (404)」** 条，点开 → 右上角 **「验证修复」/「Validate Fix」**。
3. 用 curl 自测几条代表 URL 应先确认单跳 301（见 #4）：
   - `curl -sI "https://www.dividend01.com/zh/zh/topics/high-yield-dividend-stocks/"` → 应 301 到 `https://www.dividend01.com/zh/topics/high-yield-dividend-stocks/`
4. 观察 14–28 天，404 数应逐步下降。

### C. 请求规范页收录（对应 #8、#9）
1. 左侧 **「URL 检查」**，粘贴规范 www URL（如 `https://www.dividend01.com/articles/ulty-dividend/`）。
2. 确认结果显示 **「网址在 Google 上收录」** 或「未收录但可请求」→ 点 **「请求编入索引」**（如未收录）。
3. 对以下已优化内容页重复：high-dividend-stocks、msty-dividend-income、dividend-calculator-guide、qqqi-dividend、ulty-dividend。
4. **不要**对非 www 旧地址请求收录（它们应 301 到 www）。

### D. CTR 数据导出（对应第六/九节）
1. 左侧 **「效果」** → 日期选 **最近 28 天**。
2. 勾选 **「平均排名」「点击率」「展示次数」** 等列。
3. 筛选：展示高、平均排名 5–20、CTR < 1%、且「网页已收录」。
4. 将筛选结果贴回给我（或导出 CSV），我据此应用 `SEO-CTR-PROPOSAL.md` 中剩余标题改写（每轮 3–5 页）。

### E. Cloudflare 只读检查（对应第七/八节，需你授权）
1. Cloudflare 控制台 → dividend01.com → **「SSL/TLS」→「概述」**：确认模式为 **Full** 或 **Full (strict)**。
2. **「SSL/TLS」→「边缘证书」**：确认 **Always Use HTTPS** = 开、**Automatic HTTPS Rewrites** = 开。
3. **「速度」→「优化」**：检查 **Email Address Obfuscation** 是否开启（若开且产生 `/cdn-cgi/l/email-protection` 抓取错误，建议关闭或改联系方式入口）。
4. 现有 3 条 Redirect Rules 与 DNS 代理**保持不变**（上轮已建 `/zh/zh/*` → `/zh/*` 301）。

> 以上 A–E 如需我通过浏览器自动化代点，请先确认你已登录 Google 并授权；否则按上述步骤自行操作即可。
