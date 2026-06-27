# Stargazer — Current Context (hand-off)

> Last updated: 2026-06-27 (post design fidelity review).
> Branch: `main`. Working dir: `G:\MistDoc\Stargazer`.

## Where we are

| Phase | Status | Output |
|-------|--------|--------|
| **Priority 1** (Navigation SSOT + Footer + Drawer hub refactor) | ✅ Complete | 6 files modified, 1 new (`src/lib/navigation.ts`), build clean |
| **Priority 2** (Digital Garden Domain Refactor) | ✅ Complete | Topics/Resources/About pageTypes, Home redesign, ContentCard unification |
| **apply-sepia-design-image** (12 phases) | MOSTLY DONE | Phases 1-11 complete, Phase 12 (screenshots) pending |
| **Design fidelity gap** (Phases 13-17) | PENDING | Hub/Topic/Resource pages diverge from design frames 02/03/05 |

## Quick orientation

- **Stack:** Quartz 5, GitHub Pages, Obsidian, Sepia theme (Lapis Cafe + VeryJack inspired)
- **AGENTS.md** (project root) holds the working rules. Key: **Design Guardrail** — "Every UI change must remove complexity before adding new components."
- **Two-track authority:** page design follows the design image, everything else follows principles. Conflicts: image wins, but must be reported.
- **Plugin override strategy:** never modify `.quartz/plugins/` directly. Use wrappers, config, CSS.
- **Build:** `npx quartz build` — 28 input / 134 output files, 0 errors

## What was changed (summary)

- **Navigation**: SSOT in `src/lib/navigation.ts` (Chinese labels: 知识库/专题/资源/图谱/关于)
- **Header**: BrandHeader with SVG search icon, consumes getNavItems()
- **Footer**: 4-column BrandFooter (探索/花园/联系/关于), transparent background
- **Drawer**: DrawerNav with expandable Topics section
- **Home**: Hero + KnowledgeAreasSection + LatestEssaysSection + QuoteSection
- **Hub**: HubHero + HubStats + CoreTopicsGrid + sections DSL (needs rewrite — Phase 14)
- **Topic**: 3-tab TopicPage (needs rewrite to 6 tabs — Phase 15)
- **Resource**: ResourcePage with filter tabs + ResourceSidebar (needs enhancement — Phase 16)
- **About**: AboutPrinciples + QuickLinksGrid (done)
- **Article**: ArticleMeta + MetadataPanel + ArticleMiniGraph + ArticlePrevNext (done)
- **Components**: ContentCard with type badge, StatusChip subtle variant, ScopedGraph
- **Styles**: Design tokens, typography, responsive breakpoints, focus rings, motion tokens

## What was changed (Priority 2 — completed)

- **PageTypes**: Added topic, resource, about pageTypes in `pageTypeRegistry.ts`
- **ContentQuery**: `queryByTopic`, `queryResources`, `queryRecent`, `getHubStats`
- **ContentCard**: Unified card with type badge (no Article/Project/Note variants)
- **Navigation**: Projects → Topics rename (folder + labels)
- **Home**: Hero + KnowledgeAreas + LatestEssays + Quote (removed Now, Featured, Projects)
- **Drawer**: Two expandable sections (知识库 ▾ + 专题 ▾)
- **MetadataPanel**: Topic field, Type field with content type badge

## Build status

- `npx quartz build` — passes, 28 input / 134 output files, 0 errors

## Files to read first when resuming

1. `AGENTS.md` — rules (esp. Design Guardrail)
2. `openspec/changes/apply-sepia-design-image/tasks.md` — phase tracking (Phases 13-17 are next)
3. `src/lib/navigation.ts` — SSOT for nav
4. `src/components/Hub.tsx` — needs rewrite (Phase 14)
5. `src/components/TopicPage.tsx` — needs rewrite (Phase 15)
6. `src/components/ResourcePage.tsx` — needs enhancement (Phase 16)

## Verification artifacts

- `npx quartz build` — primary verification command
- `public/` — built output for visual inspection

## Design decisions (confirmed)

| Page | Decision |
|------|----------|
| **Home** | Hero + Knowledge Areas + Latest Essays + Quote |
| **Knowledge Hub** | Stats row + tab navigation (学习地图/知识树/核心专题/推荐阅读/图谱概览) + learning map timeline |
| **Topic** | 6 tabs: 概览/学习路径/核心文章/工具与资源/相关专题/图谱视图 + tags row + stats row |
| **Article** | ArticleMeta + MetadataPanel + ArticleMiniGraph + ArticlePrevNext |
| **Resource** | Filter tabs + resource list (icons + category labels) + sidebar + 最近更新 section |
| **Graph** | ScopedGraph |
| **About** | Principles + Quick Links grid + contact |
| **Footer** | 4 columns: 探索/花园/联系/关于 |

## Design fidelity gap (identified 2026-06-27)

Hub/Topic/Resource pages diverge from design frames 02/03/05. Tracked in `openspec/changes/apply-sepia-design-image/tasks.md` Phases 13-17:
- Phase 13: Breadcrumbs config (rootName → "首页")
- Phase 14: Hub page rewrite (tabs, stats, learning map, icons)
- Phase 15: Topic page rewrite (6 tabs, tags, stats)
- Phase 16: Resource page enhancement (icons, category labels, 最近更新)
- Phase 17: Mobile + accessibility pass for new components

## Build status

- `npx quartz build` — passes, 28 input / 134 output files, 0 errors
