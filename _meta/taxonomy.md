# Frontmatter Taxonomy

本文档记录 Stargazer 数字花园中所有可用的 frontmatter 字段、含义及用法。此文件仅供作者参考，不会被 Quartz 渲染为页面。

---

## 通用字段（所有笔记）

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | string | 笔记标题，显示在页面顶部和卡片中 | `"Android 性能优化实战"` |
| `description` | string | 简短描述，显示在卡片、列表和搜索结果中 | `"内存、布局、卡顿全方位优化"` |
| `tags` | string[] | 标签列表，用于分类和筛选 | `["android", "performance"]` |
| `status` | string | 笔记生长状态，见下方枚举 | `"evergreen"` |
| `featured` | boolean | 是否为精选内容，出现在首页 Featured 区域 | `true` |
| `featuredType` | string | 精选分类，设置 `featured: true` 时必填 | `"article"` |
| `featuredOrder` | number | 精选排序权重，数字越小越靠前 | `1` |
| `icon` | string | 卡片图标（emoji 或单字符），用于 Now/Projects 区域 | `"🤖"` |
| `cover` | string | 卡片封面图片 URL | `"/assets/android-boot.png"` |
| `cssclasses` | string[] | 附加 CSS 类名 | `["wide"]` |

---

## Status 枚举

| 值 | 中文 | 说明 |
|----|------|------|
| `seed` | 种子 | 初步想法或草稿，内容不完整 |
| `growing` | 生长中 | 正在迭代完善的笔记 |
| `evergreen` | 常青 | 成熟、经过多次修订的笔记 |
| `complete` | 完成 | 不再更新的完结笔记 |

---

## Featured 精选系统

设置 `featured: true` 后，笔记会出现在首页 **精选内容** 区域。同时必须设置 `featuredType`：

| featuredType | 显示分区 | 卡片样式 |
|-------------|---------|---------|
| `article` | 精选文章 | 封面图 + 标题 + 描述 + StatusChip |
| `project` | 项目 | 圆形图标 + 标题 + 描述 + StatusChip |
| `note` | 精选笔记 | 标题 + StatusChip + 日期 |

使用 `featuredOrder` 控制同类型内的排序（数字越小越靠前），不设置则按修改时间倒序。

---

## Hub 页面专用字段

Hub 页面是 `type: hub` 的知识领域入口页（如 `Knowledge/Android/index.md`）。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 设为 `"hub"` 激活 Hub 页面 |
| `heroStyle` | string | Hero 插画变体，默认 `"mountain"` |
| `hubHero` | boolean | 设为 `false` 隐藏 Hero 区域 |
| `sections` | array | 内容区域定义，见下方 DSL |

### Sections DSL

每个 section 是一个对象：

```yaml
sections:
  - title: 精选文章       # 区域标题
    type: cards          # 渲染类型: cards | list | compact-list | graph
    filter:              # 内容筛选（可选）
      tags: [android]
      status: evergreen
      featured: true
      featuredType: article
    match: any           # 多条件逻辑: any（默认）| all
    limit: 6             # 最大显示数量
```

| type | 效果 |
|------|------|
| `cards` | 卡片网格：封面 + 标题 + 描述 + StatusChip，默认 6 条 |
| `list` | 水平行列表：标题 + StatusChip + Tags + 日期，默认 10 条 |
| `compact-list` | 紧凑双列：仅标题链接 |
| `graph` | 局部知识图谱（ScopedGraph），默认高度 320px |

---

## Home 页面专用字段

`content/index.md` 设置 `type: home` 激活首页。

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 设为 `"home"` |
| `heroStyle` | string | Hero 插画变体 |
| `sectionOrder` | string[] | 区域排列顺序，默认 `[hero, now, featured, projects]` |

Home 页的 Hero 文案来自 `content/Home/hero.md`：

```yaml
subtitle: "Android 开发者 · AI 探索者"
tagline: "专注于..."
ctas:
  - label: 开始阅读
    url: /Knowledge
    variant: primary
  - label: 查看项目
    url: /Projects
    variant: secondary
```
