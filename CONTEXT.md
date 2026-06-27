# Stargazer — Current Context (hand-off)

> Last updated: end of Priority 1 + Priority 2 architecture review.
> Branch: `main`. Working dir: `/Users/11085273/myself/mistDoc/Stargazer`.

## Where we are

| Phase | Status | Output |
|-------|--------|--------|
| **Priority 1** (Navigation SSOT + Footer + Drawer hub refactor) | ✅ Complete | `screenshots/phase1-navigation/`, 6 files modified, 1 new (`src/lib/navigation.ts`), build clean |
| **Priority 2** (Digital Garden Domain Refactor — 10 parts) | ⏸ Awaiting approval | Architecture review delivered as `ARCHITECTURE-REVIEW-priority2.md` |

**Do not start coding Priority 2 until the user confirms the review.**

## Quick orientation

- **Stack:** Quartz 5, GitHub Pages, Obsidian, Sepia theme
- **AGENTS.md** (project root) holds the working rules. Key recent addition: **Design Guardrail** — "Every UI change must remove complexity before adding new components." Critical when reviewing the 10-part Priority 2.
- **Two-track authority** (still in effect): page design follows the design image, everything else follows principles. Conflicts: image wins, but must be reported.
- **Plugin override strategy:** never modify `.quartz/plugins/` directly. Use wrappers, config, CSS.

## What was changed in Priority 1

| File | Role |
|------|------|
| `src/lib/navigation.ts` (NEW) | Single source of truth: `NavItem` interface + `NAV_ITEMS` (Knowledge, Topics, Resources, Graph, About) + `getNavItems()` |
| `src/lib/pageTypeRegistry.ts` | Added `getHubs(allFiles, cfg)` — pageType-driven hub enumeration. The Drawer no longer path-scans |
| `src/components/BrandHeader.tsx` | Consumes `getNavItems()`; no local NAV_ITEMS |
| `src/components/DrawerNav.tsx` | Consumes `getNavItems()` + `getHubs()`; top-level nav mirrors header; Knowledge ▾ shows 5 hubs (auto-discovered) |
| `src/components/BrandFooter.tsx` | 4 zones: Explore (4 nav items) · Connect (socials) · About (↑ Top) · Motto + Copyright |
| `src/styles/layout.scss` | `.drawer-trigger` hidden ≥1200px; `.brand-footer` is now a 3-col grid (desktop) / 1-col stack (mobile) |
| `quartz.config.yaml` | Added `brand.motto: "Growing slowly, learning publicly."` |

**Vocabulary decision (Priority 1 → 2 handoff):** "Projects" is the nav label with URL `/projects`. The folder `content/Projects/` is still there. The user's Priority 2 will rename this concept to "Topics" and add a TODO marker for folder migration later (AGENTS.md blocks auto-rename).

## What Priority 2 will change (architecture review summary)

**The refactor demotes "Project" from a first-class domain concept to a content type.** It introduces "Topic" as a new top-level concept.

**10 parts:**
1. Delete Project as a domain (nav, folder-as-hub, pageType-as-category, section, card variant, metadata emphasis)
2. Add Topic Hub concept
3. Redesign Home: Hero + Knowledge Areas + Latest Essays + Quote (drop Now, Featured, Projects)
4. Drawer: two expandable sections (Knowledge ▾ + Topics ▾)
5. Footer: 4-column layout (探索/花园/联系/更多) replacing Projects with Topics
6. Metadata: Topic is primary, Project is a Type
7. Card: one `ContentCard` with Type badge (no more Article/Project/Note variants)
8. ContentQuery: `queryByTopic`, `queryKnowledge`, `queryResources`, `queryFeatured`, `queryRecent`, `getHubStats` (no more `queryFolder("projects")`)
9. PageType: add `topic`, `resource`, `about`; remove `featuredType: project` from FeaturedType union
10. Folder: keep `content/Projects/` for now (AGENTS.md no-rename) + add TODO marker

**Plus enhanced page layouts:**
- Knowledge Hub: stats row + core topics grid + tabs
- Topic: 3-tab layout (概览/核心文章/相关资源)
- Resource: filter tabs + two-column layout

**8 implementation phases** (each stops with build + typecheck + screenshots + Remaining Issues):
- 2.1 PageType registry: add topic/resource/about specs + enumerators
- 2.2 ContentQuery refactor
- 2.3 Card unification
- 2.4 Metadata refactor
- 2.5 Navigation & Drawer (relabel Projects → Topics, add Topics ▾)
- 2.6 Home redesign
- 2.7 Content frontmatter migration (this is the gate for slimming FeaturedType)
- 2.8 Verification + Remaining Issues

**Key ordering constraint:** Phases 2.2 and 2.7 are coupled. Do NOT drop `"project"` from `FeaturedType` in 2.2 — defer to 2.7 when the content migration is also done. (Adjusted from the original plan; captured in the review's Risk section.)

## Build status

- `npm run quartz build` — passes, 127 files emitted, 0 warnings
- `npx tsc --noEmit` — pre-existing errors in `Graph.tsx`, `ArticleMeta.tsx`, `DrawerNav.tsx`, `MetadataPanel.tsx`, `StatusChip.tsx`, `pageTypeRegistry.ts` (not introduced by Priority 1; `npx quartz build` succeeds anyway because tsup is lenient)
- Pre-existing `screenshots/phase2/` from earlier work — may have stale visuals from before Priority 1

## TODO markers added (so far)

- `src/lib/navigation.ts` — **no TODO yet** (will be added in Priority 2.5: `// TODO(domain-migration): rename content/Projects/ → content/Topics/ and update href to /topics`)

## Files to read first when resuming

1. `AGENTS.md` — rules (esp. Design Guardrail at the bottom)
2. `ARCHITECTURE-REVIEW-priority2.md` — the Priority 2 plan awaiting approval
3. `src/lib/navigation.ts` — SSOT for nav
4. `src/lib/pageTypeRegistry.ts` — pageType registry + `getHubs()`
5. `src/components/DrawerNav.tsx` — example consumer of both
6. `src/components/Home.tsx` — what will be redesigned in 2.6

## Open questions for the user (Priority 2)

1. ~~Approve the 8-phase plan as-is, or reorder / skip phases?~~ ✅ Approved
2. ~~Specifically: confirm Home redesign removes Now, Featured, Projects sections entirely (per spec)?~~ ✅ Confirmed
3. ~~Confirm footer Explore replaces "Projects" with "Topics" (nav label changes but URL stays `/projects`)?~~ ✅ Confirmed
4. ~~Confirm Drawer gets TWO expandable sections (Knowledge ▾ + Topics ▾) instead of one?~~ ✅ Confirmed

## Design decisions (confirmed)

| Page | Decision |
|------|----------|
| **Home** | Follow plan — no "探索知识领域" cards, just Hero + Knowledge Areas + Latest Essays + Quote |
| **Knowledge Hub** | Enhanced per design — stats row (auto-computed) + core topics grid + tabs (学习路径 deferred) |
| **Topic** | Per design — tabs: 概览 / 核心文章 / 相关资源. **No 学习路径** (removed per user) |
| **Article** | Follow plan for now, optimize later |
| **Resource** | Per design — filter tabs (全部/书籍/工具/网站/论文/视频) + two-column layout |
| **Graph** | Follow plan |
| **About** | Follow plan |
| **Footer** | Per design — 4 columns: 探索 / 花园 (titles only) / 联系 / 关于 |

## Verification artifacts

- `screenshots/phase1-navigation/` — header, drawer, footer, full home at 1440/768/390
- `screenshots/phase1-navigation.cjs` — Playwright assertion script (asserts nav consistency + desktop hides hamburger)
- `screenshots/phase2/` — older work, may be stale
