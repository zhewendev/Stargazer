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

**Implementation note:** Originally planned as Hub DSL extension. Implemented as standalone `TopicPage.tsx` pageType.

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Page layout (topic hero + learning path + core articles + related topics) | **N** | `TopicPage.tsx` (standalone) | 3-tab layout: 概览 / 核心文章 / 相关资源 (学习路径 removed per user) |
| Topic hero (h1 + description) | **N** | `TopicPage.tsx` | Renders title + description from frontmatter |
| Core articles grid with ContentCards | **N** | `TopicPage.tsx` + `ContentCard.tsx` | Uses `queryByTopic()` to find child articles |
| Related resources (external links) | **N** | `TopicPage.tsx` | Reads `relatedResources` array from frontmatter |
| Tab navigation (JS) | **N** | `TopicPage.afterDOMLoaded` | Client-side tab switching (概览/核心文章/相关资源) |

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

**Implementation note:** Originally planned as Hub DSL extension. Implemented as standalone `ResourcePage.tsx` pageType.

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| Top nav | **K** | `BrandHeader.tsx` | No change |
| Breadcrumb (首页 / 资源) | **K** | breadcrumbs plugin | Reuse |
| Page h1 (资源库) | **N** | `ResourcePage.tsx` | Renders title from frontmatter |
| Filter bar (全部 / 书籍 / 工具 / 网站 / 论文 / 视频) | **N** | `ResourcePage.tsx` | Client-side filter tabs with JS |
| Resource list with ContentCards | **N** | `ResourcePage.tsx` + `ContentCard.tsx` | Uses `queryResourceByType()` to find resources |
| Category sidebar (with counts) | **N** | `ResourceSidebar.tsx` | Reads resource-type from frontmatter, computes counts |
| Client-side filtering (JS) | **N** | `ResourcePage.afterDOMLoaded` | Shows/hides cards by `data-resource-type` |

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

**Implementation note:** Enhanced `BrandFooter.tsx` in place (not replaced with `SiteFooter.tsx`). Mountain motif and Back to Top deferred.

| Design element | Decision | Existing target | Action |
|---|---|---|---|
| 探索 (知识库/专题/资源/图谱) | **M** | `BrandFooter.tsx` | Reads from `getNavItems()` (Chinese labels auto) |
| 花园 (随机漫步/最新动态/归档) | **N** | `BrandFooter.tsx` | Titles only (no links yet) |
| 联系 (GitHub/Email/RSS订阅) | **K** | `BrandFooter.tsx` (socials) | Migrated to 4-column layout |
| 关于 (关于花园/使用说明/开源地址) | **N** | `BrandFooter.tsx` | New column |
| Mountain motif decoration | **—** | — | **Deferred** (needs full-width footer) |
| "© 2026 温哲 · Stargazer" credit | **K** | `BrandFooter.tsx` | Migrated to bottom section |
| Back to Top | **—** | — | **Deferred** |

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
| `topic-page` pageType | **YES (N)** | Standalone `TopicPage.tsx` (revised from Hub DSL extension) |
| `resources-page` pageType | **YES (N)** | Standalone `ResourcePage.tsx` + `ResourceSidebar.tsx` (revised from Hub DSL extension) |
| `about-page` pageType | **NO** | About remains single page; components are added |
| `contentStats` plugin | **DEFERRED** | Stats computed inline via `getHubStats()` in `pageTypeRegistry.ts` |
| `MasteryGraph` component | **NOT STARTED** | Wraps existing `ScopedGraph.tsx` |
| `KnowledgeAreaCards` component | **DONE** as `KnowledgeAreasSection.tsx` | Auto-discovers hubs from `getHubs()` |
| `LearningTimeline` component | **REMOVED** per user | User decided: no 学习路径 on Topic pages |
| `QuoteCallout` component | **DONE** as `QuoteSection.tsx` | Reads from `brand.quote` config |
| `ArticleSidebar` wrapper | **NOT STARTED** | Composes MetadataPanel + mini graph + backlinks |
| `ResourceFilterBar` component | **DONE** inline in `ResourcePage.tsx` | Client-side filter tabs |
| `MasteryLegend` + `MasteryFilter` | **NOT STARTED** | Graph controls |
| `AboutPrinciples` component | **NOT STARTED** | Renders principles from frontmatter |
| `QuickLinksGrid` component | **NOT STARTED** | Renders quick links from frontmatter |
| `KnowledgeAreaCard` component | **DONE** as part of `KnowledgeAreasSection.tsx` | Single area card within grid |

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