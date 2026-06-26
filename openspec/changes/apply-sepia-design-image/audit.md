# Architecture Audit — `apply-sepia-design-image`

**Date:** 2026-06-26
**Scope:** Current state of Stargazer's `src/`, `content/`, `quartz.config.yaml`, and `reimagine-stargazer-as-digital-garden` outputs.
**Purpose:** Ground the design-image implementation in reality before writing code. Identify what already exists, what needs modification, what needs replacement, and what genuinely needs to be built.

---

## 1. File Inventory

### 1.1 `src/components/` (13 files)

| File | Status | Purpose |
|---|---|---|
| `ArticleMeta.tsx` | **Reusable** | Article meta strip (status, date, reading time) |
| `BrandFooter.tsx` | **Reusable** | Socials + credit line |
| `BrandHeader.tsx` | **Reusable** | Logo + tagline + 7 nav items + drawer trigger + search |
| `CardGrid.tsx` | **Reusable** | Generic card grid wrapper |
| `ContentCard.tsx` | **Reusable** | Generic content card |
| `DrawerNav.tsx` | **Reusable** | Slide-out nav drawer with filter, ESC, focus trap |
| `Home.tsx` | **Reusable** | pageBody for `index.md`; composes Hero+Now+Featured+Projects |
| `Hub.tsx` | **Reusable** | pageBody for hub folders; declarative sections DSL |
| `MetadataPanel.tsx` | **Reusable** | Right-rail: status, featured, description, tags, dates |
| `ScopedGraph.tsx` | **Reusable** | D3+PixiJS scoped force graph; status-based radii |
| `StatusChip.tsx` | **Reusable** | Glyph + label status indicator (seed/growing/evergreen/complete) |
| `heroStyles/Mountain.tsx` | **Reusable** | Default hero SVG (line-art mountains + sun) |
| `heroStyles/index.ts` | **Reusable** | Registry with `mountain` implemented; `graph` reserved |
| `home/Hero.tsx` | **Reusable** | Home hero: brand identity, illustration, CTAs |
| `home/NowSection.tsx` | **Reusable** | "Now" tracks section |
| `home/ProjectsSection.tsx` | **Reusable** | Projects grid |
| `home/FeaturedSection.tsx` | **Reusable** | Auto-partitioned featured by type |
| `home/SectionShell.tsx` | **Reusable** | Section title + container |
| `hub/HubHero.tsx` | **Reusable** | Hub hero: title, description, computed stats |
| `hub/sections.tsx` | **Reusable** | 4 section renderers (cards, list, compact-list, graph) |

### 1.2 `src/lib/` (3 files)

| File | Status | Purpose |
|---|---|---|
| `contentQuery.ts` | **Reusable** | `querySection()` pure filter; tag/status/featured/scope predicates |
| `pageTypeRegistry.ts` | **Reusable** | PageType registry (home, hub, graph) |
| `themeRegistry.ts` | **Reusable** | Theme registry (extensibility point) |

### 1.3 `src/styles/` (5 files)

| File | Status | Contents |
|---|---|---|
| `tokens.scss` | **Foundation** | Sepia palette (`#f7f6f2`, `#ede7df`, `#c9a97e`), status lifecycle, drawer tokens, typography stacks, spacing/radius/shadow/motion |
| `typography.scss` | **Foundation** | Type scale + Noto Sans SC + Inter + JetBrains Mono |
| `components.scss` | **Foundation** | Component styles |
| `layout.scss` | **Foundation** | Layout primitives |
| `home.scss` | **Foundation** | Home page-specific styles |

### 1.4 `quartz.config.yaml`

- Brand: `温哲`, `Stargazer`, domain `Android × AI × Automation`, form `Digital Garden`, logo `✦`
- Sepia palette already in light/dark mode (matches design image)
- PageType routing: `404`, `content`, `home`, `graph`, `hub`, `folder`, `tag`, `canvas`, `bases`
- Layout positions: `header`, `beforeBody`, `left`, `right`, `afterBody`
- Graph plugin enabled (right slot), Explorer desktop-only, breadcrumbs beforeBody

### 1.5 `content/` structure

```
content/
├── index.md                    # Home (type: home)
├── About.md                    # About page
├── graph.md                    # Graph placeholder
├── Home/                       # (Hero source content lives here)
├── Projects/                   # Hub page
├── Resources/                  # Hub page (books, tools, links)
│   ├── books.md
│   ├── links.md
│   └── tools.md
├── Now/                        # Hub page
├── Knowledge/                  # Hub page (parent)
│   ├── Android/                # Hub page (sub-hub)
│   │   ├── AMS启动.md
│   │   ├── 启动流程.md
│   │   └── 性能优化.md
│   └── AI/                     # Hub page (sub-hub)
├── 自动化与工具/                # Hub page (Chinese)
├── 生活与效率/                  # Hub page (Chinese)
└── 阅读与思考/                  # Hub page (Chinese)
```

### 1.6 `reimagine-stargazer-as-digital-garden` outputs (111/115 done)

**Substantively complete.** The 4 remaining tasks are: deferred hero variants (Ocean/Forest), an archive step, and an unrelated encryption feature.

**Already-delivered capabilities** (per `design.md` D1–D44):
- D1: Custom `src/` layer bridged via `quartz/styles/custom.scss`
- D2: New pageTypes (Home, Hub) registered via emitters
- D3: Frontmatter schema as single contract
- D4: Drawer + Explorer coexistence
- D5: Featured system partitions by `featuredType`
- D6: Hero illustration registry (pluggable)
- D7: Status lifecycle (seed/growing/evergreen/complete) + chip
- D8: Hub sections DSL (cards/list/compact-list/graph)
- D9: Graph×Hub wikilink prominence + scoped graph
- D10: Layout config per pageType
- D11: PageType Registry pattern
- D12: Content query abstraction (`querySection`)
- D13: Drawer is brand nav, not Explorer
- D14: Drawer scales to 1000+ notes (top-level hubs only)
- D15: Header emphasizes personal brand
- D16: Drawer search semantics (filter + manual nav)
- D17: Navigation contract (7 items: Home/Knowledge/Projects/Now/Resources/Graph/About)
- D18–D19: Status visible everywhere (color + shape)
- D20: Featured cards visually distinguish type
- D21–D22: Featured/status orthogonal; status filter accepts array
- D23–D25: Hero restrained, line-art monochrome
- D26: Hero registry extensible
- D27: Home Hero vs Hub Hero distinct
- D28: `graph` reserved in hero registry
- D36–D39: Graph as discovery; scoped over global; node radii by status
- D40: Standalone `/graph` page layout
- D41: Nav label "知识图谱"
- D42–D43: Reserved metadata slots + graph deep links
- D44: Plugin override strategy documented

---

## 2. What's Already Aligned with the Design Image

| Design element | Existing implementation | Notes |
|---|---|---|
| **Sepia palette** | `tokens.scss` has `#f7f6f2`, `#ede7df`, `#c9a97e` | Already matches the design's warm tones |
| **Mountain illustration** | `heroStyles/Mountain.tsx` | Line-art mountain + sun, used by Home and Hub heroes |
| **Personal brand identity** | `BrandHeader.tsx` (温哲 · Stargazer · Digital Garden) | Matches design's 温哲 header |
| **Site nav** | `BrandHeader.tsx` (7 items) | **DIFFERS** — design shows 5 items (no "首页" / "现在" / "项目" entries in main nav, uses "专题" instead of "项目") |
| **Hero with persona** | `home/Hero.tsx` (温哲 + domain + CTAs) | Partial match — design shows "进入知识库 →" + "探索专题" CTAs |
| **Featured cards** | `home/FeaturedSection.tsx` (article/project/note variants) | Matches design's card grid pattern |
| **Status lifecycle** | `StatusChip.tsx` (seed/growing/evergreen/complete) | Different vocabulary from design's mastery levels |
| **Hub pages** | `Hub.tsx` + `hub/sections.tsx` (cards/list/compact-list/graph) | **Close match** but no built-in "学习地图" timeline |
| **Footer** | `BrandFooter.tsx` (socials + credit) | **DIFFERS** — design shows 4-column footer (探索/花园/联系/关于) |
| **Right-rail metadata** | `MetadataPanel.tsx` | Matches design's "本文信息" zone |
| **Scoped graph** | `ScopedGraph.tsx` (D3+PixiJS) | Design shows similar mini-graph in sidebar |
| **Drawer nav** | `DrawerNav.tsx` (VeryJack-flavored) | Matches mobile nav pattern |

---

## 3. What's Genuinely Missing from Design Image

| Design element | Status | Required work |
|---|---|---|
| **"学习地图" / "学习路径" timeline** | Not present | **NEW** — horizontal stepper component |
| **Knowledge area cards on home (4 areas)** | Not present (FeaturedSection uses different model) | **NEW** — KnowledgeAreaCard component |
| **Stats row (128笔记 / 24专题 / etc.)** | Partially present (Hub hero has "N笔记 · 生长中 · 常青") | **NEW** — site-wide content stats aggregator |
| **Quote callout ("知识只有在连接中,才能真正产生价值")** | Not present | **NEW** — QuoteCallout component |
| **Article sidebar's "知识连接" with mini graph + backlinks** | Partial — MetadataPanel exists; Backlinks via Quartz plugin; no integrated sidebar | **NEW** — ArticleSidebar composes existing pieces |
| **Resources filter bar (category + tag)** | Not present | **NEW** — ResourceFilter component |
| **About page with principles (Seed/Growing/Evergreen/Complete)** | Partial — About.md has prose, no principles component | **NEW** — AboutPrinciples component |
| **Mastery categorization (已掌握/已记录/相关/未涉及)** | Not present (status system is different vocabulary) | **NEW** — MasteryGraph wrapper + mastery frontmatter field |
| **Mobile (375px) breakpoint layouts** | Partial — drawer exists, but layouts may not collapse cleanly | **REFINE** — verify and add 375px styles |
| **Mountain "brand asset" beyond hero** | Not present (mountain is hero-only currently) | **NEW** — MountainDecoration component for footer/home accent |
| **Topic page (专题)** | Not present as distinct pageType (folded into Hub) | **REFINE** — extend Hub DSL with topic-specific sections |

---

## 4. Capability Completion Matrix (Active Change vs Design Image)

| Active change spec | Status | Design image fit | Action |
|---|---|---|---|
| `design-tokens` | Done | Matches (palette exists) | **Reuse Existing** — no new tokens needed |
| `drawer-nav` | Done | Matches (mobile nav pattern) | **Reuse Existing** |
| `featured-system` | Done | Partial (different card model) | **Refine Existing** — extend for area cards |
| `frontmatter-schema` | Done | Partial (no `mastery` field) | **Modify Existing** — add `mastery`, `learningPath`, `principles`, `quickLinks`, `contacts` |
| `graph-hub-integration` | Done | Partial (no mastery coloring) | **Modify Existing** — add mastery-based node coloring |
| `hero-illustration` | Done | Matches | **Reuse Existing** |
| `home-page` | Done | Partial (no area cards / stats / quote) | **Modify Existing** — add 3 new sections |
| `hub-page` | Done | Close match | **Refine Existing** — add LearningTimeline option |
| `status-system` | Done | Conflicts with mastery | **Replace Concept** — keep status, add parallel mastery field |

---

## 5. Plugin Override Status

Per AGENTS.md "Plugin Override Strategy":
- ✅ No `.quartz/plugins/` source files modified (verified)
- ✅ All custom work in `src/`
- ✅ Brand wrapper components: `BrandHeader`, `BrandFooter`, `BrandLockup`
- ✅ Config-level overrides via `quartz.config.yaml` `layout.byPageType`
- ✅ CSS tokens via `src/styles/tokens.scss`

**No AGENTS.md "Plugin Source Modifications" entry needed yet.**

---

## 6. Risk Findings from Audit

1. **Navigation vocabulary mismatch.** Active change uses 7 nav items (Home, Knowledge, Projects, Now, Resources, Graph, About). Design image shows 5 (知识库, 专题, 资源, 图谱, 关于). Need to decide: match design exactly (remove Home/Projects/Now from main nav; rely on drawer), or keep current 7-item nav.
2. **Status vs Mastery vocabulary conflict.** Status system: seed/growing/evergreen/complete. Design mastery: 已掌握/已记录/相关/未涉及. Different concept. Recommendation: keep status (article maturity) AND add mastery (knowledge depth) as independent fields.
3. **Stats aggregator is genuinely new work.** Active change has only per-hub stats (Hub hero). Design needs site-wide stats (128笔记 / 24专题 / 36标签 / 18系列 / 320+链接). New component, new plugin if pre-computed.
4. **Mountain SVG variant count.** Active change has one Mountain style. Design shows full landscape (home) + smaller decorative (footer). Single SVG at different sizes may suffice; check.
5. **Topic page is conceptually new.** Design's "专题" page (Android 知识库, AI Coding Workflow) maps to current Hub pages. May not need new pageType; just refine Hub with new section types.
6. **Resources page filter bar is genuinely new.** Active change's Resources hub has three list sections (books/tools/links); design shows a filter bar + category sidebar + filterable list. Different interaction model.

---

## 7. Retention Recommendations

| Component | Recommendation | Rationale |
|---|---|---|
| `BrandHeader` | **Refine** | Adjust nav item count and labels per design (5 items) |
| `BrandFooter` | **Replace** | Current footer is minimal; design shows 4-column structure |
| `Hero` | **Refine** | Adjust CTAs and persona copy per design |
| `HubHero` | **Refine** | Add LearningTimeline above hero or after |
| `Hub` | **Refine** | Add new section types (timeline, area-cards) |
| `FeaturedSection` | **Refine** | Add area-card variant for knowledge areas |
| `MetadataPanel` | **Reuse** | Matches design's "本文信息" zone |
| `StatusChip` | **Reuse** | Keep as article maturity indicator |
| `ScopedGraph` | **Refine** | Add mastery-based coloring |
| `Mountain` SVG | **Refine** | Verify it scales for footer decoration |
| `DrawerNav` | **Reuse** | Matches mobile nav |
| `querySection` | **Reuse** | Extends to new filters via existing pattern |

**Summary:**
- **Reuse Existing:** 6 components (no changes)
- **Refine Existing:** 6 components (modify in place)
- **Replace Existing:** 1 component (BrandFooter restructure)
- **New Component:** ~8 components (LearningTimeline, KnowledgeAreaCard, QuoteCallout, ArticleSidebar, MasteryGraph, ResourceFilter, AboutPrinciples, SiteFooter)

---

## 8. Conclusion

The architecture is **well-aligned with the design image's intent** (sepia palette, mountain brand, personal identity, hub-driven structure, data-driven everything). The design image is less a "redesign" and more a **visual refinement + component extension** of work already done.

Key strategic decisions needed before coding:
1. Nav count: 5 items (design) vs 7 items (current)
2. Status vs Mastery: parallel fields or replace?
3. New component count: 8 new (manageable in 1-2 sessions)

**Recommendation:** Proceed with revision. The audit shows ~80% reuse + refinement, ~20% new components. This is far less work than the original 70-task proposal suggested.