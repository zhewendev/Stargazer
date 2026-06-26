# Migration Map — `apply-sepia-design-image`

**Date:** 2026-06-26
**Source of truth:** `audit.md`
**Purpose:** For each design-image requirement, decide: Keep / Modify / Remove / Replace / New. Documented per zone so revisions to `design.md` and `tasks.md` are deterministic.

---

## Legend

- **Keep Existing (K)** — Use as-is. No code change.
- **Modify Existing (M)** — Extend or adjust in place. Component still serves same purpose.
- **Replace Existing (R)** — Substantially rewrite. Same role, different implementation.
- **Remove Existing (X)** — Delete or disable.
- **New (N)** — Build from scratch.

---

## Zone 1: Home Page (Frame 01)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav (5 items: 知识库/专题/资源/图谱/关于) | **M** | `BrandHeader.tsx` (currently 7 items) | Reduce nav items; preserve drawer as full nav surface |
| "Stargazer* · Digital Garden" brand lockup | **K** | `BrandHeader.tsx` | No change |
| Persona h1 ("温哲") | **K** | `cfg.brand.name` in `Home.tsx` → `home/Hero.tsx` | No change |
| Subtitle (Android 开发者 · AI 探索者 · 自动化实践者) | **K** | `cfg.brand.domain` | No change (already in config) |
| Personal statement ("在技术的世界里持续学习…") | **N** | — | Add to `Home/hero.md` frontmatter `tagline` field (already supported!) |
| Mountain illustration as background | **K** | `heroStyles/Mountain.tsx` | Reuse (verify sizing at homepage scale) |
| CTA buttons (进入知识库 / 探索专题) | **M** | `home/Hero.tsx` (ctas already supported) | Update `Home/hero.md` `ctas` array with these two |
| Stats row (128笔记 / 24专题 / 36标签 / 18系列 / 320+链接) | **N** | — | New `StatsRow` component + new `contentStats` plugin |
| Knowledge area cards (Android/AI/Automation/Reading × 4) | **N** | — | New `KnowledgeAreaCards` component (different from FeaturedSection — it's a 4-card grid of *areas*, not featured items) |
| Quote callout ("知识只有在连接中,才能真正产生价值") | **N** | — | New `QuoteCallout` component (data-driven from frontmatter) |
| Footer (探索/花园/联系/关于 + mountain motif) | **R** | `BrandFooter.tsx` (currently socials only) | Replace with 4-column layout |
| Last updated / copyright | **K** | `BrandFooter.tsx` | Migrate to new footer |

---

## Zone 2: Knowledge Hub Page (Frame 02)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav | **M** | `BrandHeader.tsx` | Same as Home (5 items) |
| Breadcrumb (首页 / 知识库) | **K** | breadcrumbs plugin | Already enabled |
| Page h1 (Android 知识库) | **K** | `hub/HubHero.tsx` | Reuse |
| Description | **K** | `hub/HubHero.tsx` | Reuse |
| Stats row (128/24/36/18/320+) | **N** | — | Same `StatsRow` component as Home |
| Tab navigation (学习地图 / 知识讲解 / 核心专题 / 推荐阅读 / 图谱视图) | **N** | — | New `HubTabs` or just section anchors; depends on final decision (see Open Q1) |
| Learning timeline (Linux 内核 → Init → SystemServer → Binder → SurfaceFlinger → Jetpack Compose) | **N** | — | New `LearningTimeline` component |
| Core topic grid (Framework / 性能优化 / 系统服务 / 图形渲染 / 工具链与开发) | **M** | `hub/sections.tsx` CardsSection | Reuse, refine labels, ensure 5-card grid |
| "查看全部专题 →" link | **N** | — | Add link pattern; data-driven from frontmatter |

---

## Zone 3: Topic Page (Frame 03)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Page layout (topic hero + learning path + core articles + related topics) | **M** | `Hub.tsx` (declarative sections DSL) | Add two new section types: `timeline` and `related-topics` |
| Topic hero (h1 + description + 3 counters: 笔记/工具/案例) | **M** | `hub/HubHero.tsx` | Already has hero; refine to 3 counters |
| Learning path timeline (smaller variant) | **N** | — | Same `LearningTimeline` component, smaller variant |
| Core articles list with status | **M** | `hub/sections.tsx` ListSection | Reuse, refine card design |
| Related topics section | **N** | — | New `RelatedTopics` section type |

---

## Zone 4: Article Page (Frame 04)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav | **K** | `BrandHeader.tsx` | No change |
| Article header (title + meta strip) | **K** | `ArticleMeta.tsx` + article-title plugin | No change |
| Status badge (growing, etc.) | **K** | `StatusChip.tsx` | No change |
| Right rail — 目录 (TOC) | **K** | table-of-contents plugin | Already enabled |
| Right rail — 本文信息 (status/tags/dates) | **K** | `MetadataPanel.tsx` | Reuse (already in right slot via config) |
| Right rail — 知识连接 | **N** | — | New `KnowledgeConnections` zone composes backlinks + mini graph |
| Mini scoped graph in sidebar | **N** | `ScopedGraph.tsx` (exists for hubs, not for articles) | Reuse component with different defaults |
| Related notes section | **M** | backlinks plugin | Already renders; verify position |

---

## Zone 5: Resources Page (Frame 05)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav | **K** | `BrandHeader.tsx` | No change |
| Breadcrumb (首页 / 资源) | **K** | breadcrumbs plugin | Reuse |
| Page h1 (资源库) | **K** | `HubHero.tsx` | Reuse |
| Description | **K** | `HubHero.tsx` | Reuse |
| Filter bar (全部 / 书籍 / 工具 / 文章 / 网站 / 论文 + tags) | **N** | — | New `ResourceFilterBar` component |
| Resource list with category badges | **M** | `hub/sections.tsx` ListSection | Refine card layout; data-driven category |
| Category sidebar (with counts) | **N** | — | New `ResourceCategorySidebar` component |
| Recent updates list | **K** | `hub/sections.tsx` ListSection | Reuse with modified date filter |

---

## Zone 6: Knowledge Graph Page (Frame 06)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav | **K** | `BrandHeader.tsx` | No change |
| Breadcrumb (首页 / 图谱) | **K** | breadcrumbs plugin | Reuse |
| Knowledge graph (large, with categorized nodes) | **M** | `graph` plugin | Apply mastery-based coloring via wrapper; filter by mastery |
| Category legend (已掌握 / 已记录 / 相关 / 未涉及) | **N** | — | New `MasteryLegend` component |
| Category filters (toggle nodes) | **N** | — | New `MasteryFilter` component |
| Graph meta (节点 256 / 连接 642 / 节点 8) | **N** | — | Same `StatsRow` component, scoped to graph data |
| "Frame" keyword (框架) | **K** | `BrandFooter.tsx` (rebuilt as part of footer) | Migrate |

---

## Zone 7: About Page (Frame 07)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav | **K** | `BrandHeader.tsx` | No change |
| Breadcrumb (首页 / 关于) | **K** | breadcrumbs plugin | Reuse |
| h1 (关于温哲) | **K** | `About.md` frontmatter `title` | Reuse |
| Tagline | **M** | `About.md` frontmatter `description` | Refine copy |
| Body paragraph | **K** | `About.md` body | Reuse |
| Philosophy principles (Seed / Growing / Evergreen / Complete) | **N** | — | New `AboutPrinciples` component + `principles` frontmatter field |
| Quick links grid (4 columns) | **N** | — | New `QuickLinksGrid` component + `quickLinks` frontmatter |
| Contact section (GitHub / Email / RSS 订阅) | **M** | `BrandFooter.tsx` (already has these) | Promote to About page too; remove from footer or duplicate |
| 知识阅读原则 link | **K** | drawer nav Knowledge | Already linked |

---

## Zone 8: Footer (Frame 08)

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| 探索 (知识库/专题/资源/图谱) | **R** | `BrandFooter.tsx` | New column in 4-column footer |
| 花园 (随机漫步/最新动态/标签/归档) | **R** | — | New column |
| 联系 (GitHub/Email/RSS订阅) | **K** | `BrandFooter.tsx` (socials) | Migrate to 4-column layout |
| 关于 (关于花园/使用须知/开源地址/LICENSE) | **R** | — | New column |
| Mountain motif decoration | **N** | — | Reuse `Mountain.tsx` at smaller size in footer |
| "© 2026 温哲 · Stargazer Digital Garden" credit | **K** | `BrandFooter.tsx` | Migrate |

---

## Zone 9: Mobile (375px) — All Frames

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Hamburger menu (drawer trigger visible) | **K** | `BrandHeader.tsx` (drawer-trigger button) | Verify always visible at mobile |
| Drawer slide-in | **K** | `DrawerNav.tsx` | Reuse |
| Knowledge area cards → single column | **M** | `home.scss` | Add 375px media query |
| Hub core topics → single column | **M** | layout styles | Add 375px media query |
| Article sidebar → below body | **M** | `quartz.config.yaml` (right slot) | Verify Quartz responsive behavior; possibly override |
| Timeline → vertical | **M** | new `LearningTimeline.tsx` | Add vertical variant in same component |
| Touch targets ≥ 44px | **M** | global CSS | Audit button/link padding |
| Typography scale (h1≤28, h2≤22, h3≤18, body≥16) | **M** | `typography.scss` | Add mobile overrides |
| Bottom padding for content (avoid fixed bottom UI) | **M** | layout styles | Verify |

---

## Cross-Cutting Concerns

### Frontmatter schema additions

| Field | Type | Allowed values | Used by |
|---|---|---|---|
| `mastery` | enum | `已掌握` \| `已记录` \| `相关` \| `未涉及` (default: `已记录`) | `MasteryGraph`, knowledge graph filters |
| `learningPath` | array | `[{ label: string, slug: string, status?: 'current' \| 'done' }]` | `LearningTimeline` |
| `coreArticles` | array of slugs | `[string]` | `RelatedTopics` / hub section |
| `relatedTopics` | array of slugs | `[string]` | `RelatedTopics` section |
| `principles` | array | `[{ name, description, stage: 'Seed' \| 'Growing' \| 'Evergreen' \| 'Complete' }]` | `AboutPrinciples` |
| `quickLinks` | object | `{ [category]: [{ label, href }] }` | `QuickLinksGrid` |
| `contacts` | array | `[{ label, url, icon }]` | About page (replaces cfg.brand.social for About) |
| `quote` | string | — | `QuoteCallout` (also `author` optional) |
| `area` | object | `{ name, icon, description, slug }` | `KnowledgeAreaCards` |

### Plugin / pageType additions

| Addition | Decision | Notes |
|---|---|---|
| `topic-page` pageType | **NO** | Fold into Hub; Hub DSL gains `timeline` and `related-topics` section types |
| `resources-page` pageType | **NO** | Fold into Hub; Resources hub gains `filter-bar` and `category-sidebar` |
| `about-page` pageType | **NO** | About remains single page; components are added |
| `contentStats` plugin | **YES (N)** | New Quartz plugin; computes site-wide stats |
| `MasteryGraph` component | **YES (N)** | Wraps existing `ScopedGraph.tsx` |
| `KnowledgeAreaCards` component | **YES (N)** | New; renders 4-area card grid on home |
| `LearningTimeline` component | **YES (N)** | New; horizontal/vertical timeline |
| `QuoteCallout` component | **YES (N)** | New; data-driven quote display |
| `ArticleSidebar` wrapper | **YES (N)** | New; composes MetadataPanel + mini graph + backlinks |
| `ResourceFilterBar` component | **YES (N)** | New; filter UI for Resources |
| `MasteryLegend` + `MasteryFilter` | **YES (N)** | New; graph controls |
| `AboutPrinciples` component | **YES (N)** | New; renders principles from frontmatter |
| `QuickLinksGrid` component | **YES (N)** | New; renders quick links from frontmatter |
| `KnowledgeAreaCard` component | **YES (N)** | New; renders a single area card |

---

## Summary of Work

| Decision | Count |
|---|---|
| **Keep Existing (K)** | ~14 components/features |
| **Modify Existing (M)** | ~12 components/features |
| **Replace Existing (R)** | 1 (BrandFooter) |
| **Remove Existing (X)** | 0 |
| **New (N)** | ~13 components + 1 plugin + 9 frontmatter fields |

**Total scope:** Modest. Most work is refinement of existing foundation, with a focused set of new components for design-specific patterns.

---

## Open Decisions Required Before Tasks.md Rewrite

These are answered in the updated `design.md` (see "Resolved Decisions" section):

1. **Q1: Nav count** — 5 items (design) vs 7 items (current). **RESOLVED:** 5 items in main nav; full 7-item nav available in drawer.
2. **Q2: Are stats (128/24/36/18/320+) aspirational or current?** **RESOLVED:** Computed at build time from actual content. If mismatch, fix content or fix expectations.
3. **Q3: Status vs Mastery — parallel or replace?** **RESOLVED:** Parallel. `status` = article maturity (seed/growing/evergreen/complete). `mastery` = knowledge depth (已掌握/已记录/相关/未涉及). Independent fields.
4. **Q4: Quote — hardcoded or data-driven?** **RESOLVED:** Data-driven via `quote` field on `Home/index.md` frontmatter.
5. **Q5: Single mountain SVG or multiple variants?** **RESOLVED:** Single `Mountain.tsx` reused at multiple sizes via CSS; no new variants.