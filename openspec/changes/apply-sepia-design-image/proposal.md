## Why

The Stargazer digital garden has a finished framework (`reimagine-stargazer-as-digital-garden` at 111/115) but no unified visual identity. A new design image (9 frames: Home, Knowledge Hub, Topic, Article, Resources, Knowledge Graph, About, Footer, plus mobile) provides a complete visual specification that needs to be implemented 1:1. The opportunity: crystallize the garden's personality around a warm sepia palette with mountain motifs, make every page feel like part of one coherent system, and bring content-forward metrics (笔记数、专题数、链接数) to the surface — all while keeping every piece of copy data-driven per the project's strict no-hardcoded-content principle.

## What Changes

- **Apply sepia theme** across all pages: warm amber/orange accent palette, beige backgrounds, mountain illustration as recurring brand asset
- **Restructure homepage** with persona card (温哲 · Android 开发者 · AI 探索者 · 自动化实践者), computed stats row, knowledge area cards, and quote callout
- **Add "学习地图" / "学习路径" timeline component** — horizontal stepper used on Hub and Topic pages to visualize learning progression (e.g. Linux 内核 → Init → SystemServer → Binder → SurfaceFlinger → Jetpack Compose)
- **Add article page sidebar** — three-zone right rail: 目录 (TOC), 本文信息 (metadata + status), 知识连接 (backlinks + mini scoped graph)
- **Add knowledge graph with mastery categorization** — group nodes into 已掌握 / 已记录 / 相关 / 未涉及 based on a new frontmatter field
- **Add build-time stats aggregator** — counts of notes, topics, tags, series, links computed from content, exposed as data for the homepage and hub
- **Add Topic page layout** — topic hero + learning path timeline + core articles + sidebar
- **Add Resources page** — categorized resource library with tag/group filtering
- **Add About page** — about-the-author with philosophy principles (Seed / Growing / Evergreen / Complete)
- **Add mobile responsive layouts** — 375px breakpoint adaptation for all 9 frames
- **Refine site-wide footer** — four-column nav (探索 / 花园 / 联系 / 关于) with brand signature

This change assumes the in-progress `reimagine-stargazer-as-digital-garden` change is completed and archived first (it provides the base design-tokens, hero-illustration, frontmatter-schema, drawer-nav, and home/hub foundations this change builds on).

## Capabilities

### New Capabilities
- `learning-timeline`: Horizontal stepper component visualizing sequential learning paths. Used on Knowledge Hub (top-level progression) and Topic pages (per-topic path). Pure data-driven — nodes come from frontmatter arrays, not hardcoded.
- `article-sidebar`: Article page right rail with three zones — TOC (from headings), 本文信息 (status, tags, dates), and 知识连接 (backlinks list + mini scoped graph). Reactive to article content.
- `mastery-graph`: Knowledge graph visualization with node grouping by mastery level (已掌握 / 已记录 / 相关 / 未涉及). Reads a new frontmatter field and renders a categorized force-directed view.
- `topic-page`: Topic hub page layout — topic hero (name + description + counters), learning path timeline, core articles grid, related topics section.
- `resources-page`: Resource library page — categorized items (books, articles, tools, websites, papers), filterable by group and tag.
- `about-page`: About page — author bio, philosophy principles (Seed / Growing / Evergreen / Complete), quick links grid, contact info.
- `mobile-responsive`: 375px breakpoint layouts for all page types — collapsing multi-column layouts, stacked nav, touch-friendly interactions.
- `content-stats`: Build-time aggregator that counts notes, topics, tags, series, and links from content metadata. Exposed as a data dependency for home and hub pages.

### Modified Capabilities
<!-- This change builds on outputs of `reimagine-stargazer-as-digital-garden` which is not yet archived.
     Once archived, the following will need delta spec updates:
     - design-tokens: refine to sepia-specific palette values
     - hero-illustration: standardize mountain as the brand asset
     - home-page: restructure to match design image
     - hub-page: restructure to match design image
     - graph-hub-integration: extend with mastery categorization
     - frontmatter-schema: add `mastery` field
     Listing here for traceability once prerequisites are met. -->

## Impact

**Affected systems:**
- `quartz.config.ts` — page-type layouts may need adjustment for new pages (topic, resources, about)
- `src/components/` — new components for timeline, sidebar, persona card, mobile layouts
- `src/styles/` — sepia theme tokens, mobile breakpoint styles
- `content/Home/`, `content/Knowledge/`, etc. — frontmatter updates for new fields (`mastery`, etc.)
- `.quartz/plugins/` — NO direct modifications (per AGENTS.md); all customizations via wrappers/config/CSS

**Affected artifacts:**
- New: `learning-timeline.tsx`, `article-sidebar.tsx`, `mastery-graph.tsx`, `persona-card.tsx`, `site-footer.tsx`, `mobile-*` layouts
- Modified: existing components from `reimagine-stargazer-as-digital-garden` (theme tokens, home, hub)

**Dependencies:**
- `reimagine-stargazer-as-digital-garden` must be completed and archived first

**Risks:**
- Sepia palette + mountain illustration must NOT be hardcoded into components — must remain themable via tokens
- Mobile layouts span all pages — risk of inconsistency; needs shared responsive primitives
- Mastery categorization needs careful frontmatter schema to avoid breakage of existing notes