# Dividend Guide 全站 UI 改版方案

版本：v1.0  
状态：方案阶段，暂不修改代码、不提交、不部署  
参考方向：[Mobbin Fey 页面参考](https://mobbin.com/sites/fey-482f6c68-e130-4bf2-93a8-ddfec9ead2a6/f38127ea-2682-4730-90b9-f210da8ac947/preview)

## 一、改版目标

本次不是局部换色，而是对全站建立统一的金融编辑型设计系统：

1. 首页具有明确的品牌识别和内容入口。
2. 文章页面更像可信的研究资料，而不是普通博客模板。
3. Stocks、Calculator、Strategy 等工具页具有产品感和任务导向。
4. 每个页面使用同一套导航、间距、按钮、卡片和页脚规则。
5. 保留现有 URL、文章内容、SEO 元数据和结构化数据，避免改版造成收录损失。
6. 删除红色方块、巨大箭头、无语义装饰等突兀元素，所有视觉元素必须服务于品牌或信息层级。

## 二、设计方向

### 2.1 关键词

克制、清晰、专业、编辑感、数据可信、轻量产品化。

### 2.2 视觉原则

- 大面积使用暖白背景，不使用大面积纯白空洞区。
- 深海军蓝用于品牌、标题和重要信息。
- 靛蓝用于主要行动按钮和交互状态。
- 青绿色只用于数据来源、提醒、选中状态和少量重点，不用于大面积主按钮。
- 不使用随机渐变、巨大图标、装饰性箭头、漂浮 emoji 或无意义插画。
- 卡片只在确实表达信息分组时使用，避免每一段内容都包成卡片。
- 首页 Hero 使用真实市场图片或数据视觉，不再生成伪图标。

## 三、设计 Token

```css
--color-navy: #162B49;
--color-navy-deep: #0D1C32;
--color-indigo: #4057A6;
--color-indigo-dark: #33468A;
--color-teal: #2FA58A;
--color-teal-soft: #E8F6F1;
--color-bg: #F8FAFC;
--color-surface: #FFFFFF;
--color-surface-muted: #EEF2F7;
--color-text: #1F2937;
--color-text-muted: #64748B;
--color-border: #DBE3EE;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 18px;
--shadow-soft: 0 8px 24px rgba(22, 43, 73, .08);
```

规则：全站只使用一套圆角体系；主按钮统一靛蓝；青绿色不能单独承担 CTA 语义。

## 四、全站框架

### 4.1 顶部导航

- 使用 64px 高度的普通横向导航，不使用过度圆润的悬浮胶囊。
- 左侧：DG 标识 + Dividend Guide。
- 中间：Guide、Articles、Stocks、Calculator、Strategy。
- 右侧：语言切换。
- 当前页使用深海军蓝文字和 2px 底部指示线。
- 移动端使用横向滚动导航，保证文字和图标不挤压。

### 4.2 页面容器

- 桌面最大宽度：1120px。
- 文章正文最大宽度：760px。
- 工具页和数据页最大宽度：1120px。
- 桌面横向内边距：32px；移动端：18px。
- 页面区块之间使用 72–112px 的节奏，不通过空白撑高首屏。

### 4.3 页脚

- 深海军蓝背景。
- 左侧为品牌、教育免责声明和作者入口。
- 右侧为 Learn、About、Legal 三组链接。
- 底部显示版权、图片来源和数据声明。
- 不使用浅色导航盒子覆盖深色背景。

## 五、首页改版

### 5.1 Hero

采用“左侧内容 + 右侧数据视觉”的结构：

- 左侧：小型 eyebrow、H1、说明文字、作者信息、两个 CTA。
- 右侧：深色市场图表或简洁的收益率数据面板。
- 不放巨大的箭头、方块图标或装饰性 Logo。
- H1 控制在 2 行以内。
- 主按钮：Browse Stocks，靛蓝底色。
- 次按钮：Try Calculator，透明底 + 靛蓝边框。

### 5.2 数据来源条

放在 Hero 下方，采用轻量文本行：

`Sources: S&P Dow Jones Indices · Janus Henderson Global Dividend Index`

来源文字使用青绿色链接，但不使用醒目的红色或大面积色块。

### 5.3 核心数据指标

- 四列数据布局，使用细边框和统一数字字体。
- 不使用厚重卡片阴影。
- 每个指标包含数值、口径和数据年份。
- 移动端两列布局。

### 5.4 内容入口

首页必须突出四个入口：

- Dividend Investing Basics
- Dividend Stock Screening
- Dividend Calculator
- Dividend Strategies

入口采用 2×2 内容卡片，卡片内有标题、简短说明和轻量箭头，不使用大型图标。

### 5.5 首页内容顺序

1. Hero
2. Sources
3. Key metrics
4. What is Dividend Investing?
5. Four topic entry cards
6. Key metrics table
7. How to Start timeline
8. Risks and FAQ
9. Final CTA
10. Footer

## 六、Articles 页面

- 顶部使用页面标题、简介和文章数量。
- 增加主题筛选：Basics、Screening、High Yield、ETF History、News。
- 文章卡片采用左侧分类、标题、摘要、作者/更新时间，右侧显示箭头。
- 首屏只突出 1 篇精选文章，避免所有文章视觉权重相同。
- 每张卡片最多显示 2 行摘要。
- 文章列表保持服务器端可见，不依赖 JavaScript 才能读取。

## 七、文章详情页

### 7.1 顶部

- Breadcrumbs
- Category
- H1
- 摘要
- 作者、审核人、更新时间、数据截止日期
- 文章来源数量和研究方法入口

### 7.2 正文

- 正文宽度约 760px。
- H2 使用深海军蓝，H3 使用深灰。
- 数据表格使用浅灰表头和细边框。
- 重点结论使用左侧青绿色边框，而不是整块高饱和背景。
- 正文至少链接 2–4 篇相关内容。

### 7.3 研究信息

正文末尾固定展示：

- Sources
- Data as of
- Methodology
- Author and review
- Disclaimer

## 八、Stocks 页面

- 页面顶部使用“股票筛选”标题和简短说明。
- 筛选器采用横向条件栏，不做复杂的大表单面板。
- 首屏显示筛选条件摘要、结果数量和清除按钮。
- 股票列表采用紧凑表格：Ticker、Company、Yield、Growth、Payout、Risk。
- 移动端转为卡片，每张卡只保留最重要的 4 项数据。
- 风险等级使用文字和颜色同时表达，不能只依赖颜色。

## 九、Calculator 页面

- 左侧为输入区域，右侧为结果摘要。
- 输入区使用分组标题和明确单位。
- 结果区域突出 Annual Income、Monthly Income、Yield on Cost。
- 计算过程采用折叠说明，避免页面过长。
- 结果下方固定显示“示例不代表未来收益”的提示。
- 移动端先输入、后结果，按钮固定为靛蓝色。

## 十、Strategy 页面

- 顶部展示三种策略对比：Dividend Growth、High Yield、ETF Income。
- 每种策略使用统一结构：适合谁、优势、风险、关键指标、相关内容。
- 使用横向对比表，而不是三个完全相同的大卡片。
- 页面底部链接到 Calculator、Stocks 和核心文章。

## 十一、Topic Hub 页面

四个主题中心统一模板：

- 主题标题
- 主题说明
- 推荐入门文章
- 深入研究文章
- 相关工具
- 面包屑
- 最后更新日期

主题页要承担内部链接中心作用，不能只是文章列表复制页。

## 十二、About、Author、Editorial Standards、Legal 页面

- 使用统一的窄内容布局。
- 页面顶部显示清晰标题和更新时间。
- Author 页面突出 Henry Zhou 的身份、研究范围和局限，不虚构机构资质。
- Editorial Standards 页面说明选题、数据、复核、修订和更正流程。
- Disclaimer 页面使用可读的说明，不用大段全大写或高饱和警示色。

## 十三、404 页面

- 使用简洁的“页面不存在”信息。
- 提供返回首页、浏览文章、浏览股票三个入口。
- 不使用夸张插画或与品牌无关的装饰。

## 十四、响应式规则

### 桌面端

- Hero 左右分栏。
- 首页指标四列。
- 文章列表和工具页使用双栏或多栏布局。

### 移动端

- Hero 改为单列，图片/数据视觉放在文字后方。
- 导航允许横向滚动。
- 指标两列。
- 所有表格提供横向滚动或卡片化版本。
- CTA 按钮宽度至少 140px，不能发生文字换行。
- 页脚导航两列排列。

## 十五、SEO 和可访问性保护项

改版过程中不得改变：

- 现有文章 URL。
- canonical URL。
- Sitemap URL。
- Article、BreadcrumbList、Organization 结构化数据。
- 作者、来源、更新时间字段。
- 现有 Analytics 事件和表单字段。

必须验证：

- 所有页面 H1 唯一。
- 所有图片有准确 alt。
- 键盘可以访问导航、按钮、筛选器和折叠内容。
- 文本与背景符合 WCAG AA 对比度。
- 颜色不是唯一的信息表达方式。
- 首屏图片不造成布局跳动。

## 十六、实施顺序

### Phase 1：基础系统

1. 清理旧的冲突 CSS。
2. 建立颜色、间距、圆角、阴影 Token。
3. 统一 Header、Nav、Footer。
4. 统一按钮、卡片、表格和来源模块。

### Phase 2：首页和公共页面

1. 首页 Hero。
2. 首页指标和入口模块。
3. Articles 列表。
4. About、Author、Editorial Standards、Legal。

### Phase 3：核心功能页

1. Stocks。
2. Calculator。
3. Strategy。
4. Topic Hubs。

### Phase 4：文章模板和质量检查

1. 文章详情页。
2. 相关推荐和研究信息。
3. 移动端适配。
4. 404、错误状态和空状态。
5. 构建、链接、SEO 和可访问性检查。

## 十七、验收标准

- 首页不再出现巨大箭头、红色方块或随机装饰图形。
- 全站不再存在黑白/粉色旧样式覆盖。
- 所有页面的导航和页脚视觉一致。
- 主按钮统一使用靛蓝，青绿色只做强调。
- 首页、Articles、Stocks、Calculator、Strategy、文章详情和 Topic Hub 在移动端均可正常使用。
- 现有 URL 和 SEO 数据不发生迁移损失。
- `npm run build` 成功。
- 本地逐页检查后，再由用户明确决定是否提交或推送。
