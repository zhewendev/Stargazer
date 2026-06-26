# Priority 2: Digital Garden Domain Refactor — Architecture Review

> **Status:** Awaiting user approval. Do not start coding until confirmed.
> **Branch:** `main`. **Date drafted:** end of Priority 1.

---

## Background

Priority 1 completed Navigation SSOT, Header/Drawer/Footer refactor. The site now has a single `NAV_ITEMS` source and 5 nav items (Knowledge / Topics / Resources / Graph / About), with Footer redesigned as 4 zones (Explore · Connect · About · Motto/Credit) and Drawer pulling hubs from `pageTypeRegistry.getHubs()` instead of path-scanning.

However, **Project remains a first-class domain concept** across the codebase:

- Header shows "Topics" (label) but URL is still `/projects` and the concept is project-driven
- Home still has a Projects section
- Metadata still emphasizes "Project" as a type label
- Drawer / Content Query / Card system still branch on `featuredType: project`
- PageType doesn't have "Topic" as a concept

The Information Architecture is inconsistent with the Digital Garden model. Priority 2 unifies the domain model so UI, IA, and content all align.

---

## Current State

**Project is a first-class domain concept** that has leaked across every layer of the system. Confirmed via `Explore` agent:

| Layer | Where "Project" lives today |
|-------|----------------------------|
| **Navigation** | `src/lib/navigation.ts:23` — top-level nav item `{id: "projects", href: "/projects"}`. BrandHeader, DrawerNav, BrandFooter all consume this. |
| **Folder** | `content/Projects/` — top-level content folder, contains `index.md` (`type: hub`) + 3 child pages. |
| **PageType** | Not a pageType, but used as `featuredType: project` on 3 files. **Hub layout shared with Resources/Knowledge/生活与效率 etc.** |
| **Section** | `content/index.md:8-12` — `sectionOrder: [hero, now, featured, projects]`. Home has dedicated Projects section. |
| **Card** | `src/components/home/FeaturedSection.tsx:23,45-63,95,98` — three-variant card system (Article/Project/Note), each with distinct CSS. |
| **Section component** | `src/components/home/ProjectsSection.tsx` — entire file dedicated to project listing. |
| **Query** | `src/components/home/ProjectsSection.tsx:7,16` — `queryFolder(allFiles, "projects")`. `src/lib/contentQuery.ts:17` — `FeaturedType = "article" \| "project" \| "note"`. |
| **Metadata** | `src/components/MetadataPanel.tsx:12` — `FEATURED_TYPE_LABELS.project = "项目"`. |
| **Hero CTA** | `content/Home/hero.md:11-13` — "查看项目 → /projects". |
| **CSS** | `src/styles/home.scss:251-292` (`.projects-grid`, `.project-card*`), `src/styles/components.scss:339-349,426-428` (`.featured-card-project`, `.project-card-body`). |
| **Brand** | `quartz.config.yaml:7` — `brand.project: "Stargazer"` (used in Hero subtitle). |

**"Topics" has zero current surface area** — not in nav, no `type: topic`, no class names.

---

## Target State

### Information Architecture (final, irreversible)

```
Home → Knowledge → Topics → Resources → Graph → About
```

**Project is demoted from domain to content type.** It is a `type: project` value among other content types (article, note, experiment) — not a navigation, folder, pageType, layout, section, or query category.

### New domain model

| Concept | Role | PageType | Examples |
|---------|------|----------|----------|
| **Home** | Brand entrance | `home` | `/` |
| **Knowledge** | Long-term knowledge domains (hubs) | `hub` | `Knowledge/Android`, `Knowledge/AI` |
| **Topic** | Long-term exploration theme (hubs) | `topic` | `Topics/Android-Performance`, `Topics/AI-Workflow` |
| **Resource** | External references | `resource` | `Resources/Books`, `Resources/Tools` |
| **Content** | A note/article/project/experiment under a hub | (fallback `content`) | `Knowledge/Android/启动流程.md` |
| **Graph** | Knowledge atlas | `graph` | `/graph` |
| **About** | Personal intro | `about` | `/about` |

### New pageType set

| pageType | Matcher | Layout |
|----------|---------|--------|
| `home` | `slug === "index"` AND `type === "home"` | Hero + Knowledge Areas + Latest Essays + Quote |
| `hub` | `slug.endsWith("/index")` AND `type === "hub"` | Sections DSL (existing) |
| `topic` | `slug.endsWith("/index")` AND `type === "topic"` | Same as hub (twin layout) |
| `resource` | `slug.endsWith("/index")` AND `type === "resource"` | Same as hub |
| `about` | `slug === "about"` | Simple long-form |
| `graph` | `slug === "graph"` | (unchanged) |
| `content` | (fallback) | Article layout |

### New content type set (frontmatter)

```
type: project | article | note | experiment
```

All treated identically by query — only the **Type badge** differs visually on a card.

### New nav (5 items)

| id        | label     | href                      | expandable       |
| --------- | --------- | ------------------------- | ---------------- |
| knowledge | Knowledge | /knowledge                | yes (hubs)       |
| topics    | Topics    | /projects (TODO: /topics) | yes (topic list) |
| resources | Resources | /resources                | no               |
| graph     | Graph     | /graph                    | no               |
| about     | About     | /about                    | no               |

**Compatibility path:** Keep `content/Projects/` folder and `/projects` URL temporarily (AGENTS.md prohibits automatic file renames). Add explicit `// TODO(domain-migration): rename folder to Topics/ and update URL to /topics` marker. All code references switch to "Topics" vocabulary.

### New Home composition

```
Hero                  (brand · tagline · Currently Exploring · 2 CTAs)
↓
Knowledge Areas       (5 area cards: Android / AI / Automation / Reading / Digital Garden)
↓
Latest Essays         (3 cards max, mixed content types)
↓
Quote                 (single static line from config)
↓
Footer
```

No Now section. No Projects section. No Featured section. No timeline. No feed.

### New Drawer composition

```
[Search]
Knowledge  ▾
  · Android
  · AI
  · Automation
  · Architecture
  · Reading
  · Life
Topics     ▾
  · Android Performance
  · AI Workflow
  · Automation
  · Digital Garden
  · Reading
Projects
Resources
Graph
About
```

**Two expandable sections.** Knowledge shows `type: hub` from anywhere; Topics shows `type: topic`. Both populated by `pageTypeRegistry.getHubs()` / `getTopics()` — no path prefixes, no hardcoding.

### New Footer composition

```
Explore   |  Connect        |  About
Knowledge |  ⌘ GitHub       |  ↑ Top
Topics    |  ✉ Email        |
Resources |  ⊿ RSS          |
Graph     |
─────────────────────────────
Motto
© year · Built with Quartz
```

No "Projects" anywhere. Topics replaces Projects.

### New Metadata panel

```
Topic        [Android]
Type         [Project] [Article] [Note] [Experiment]
Status       [● Evergreen]
Tags         [android] [framework]
Updated      2026-06-20
Created      2024-03-14
```

"Topic" is the primary classification; "Type" is one of the content types; "Project" is no longer the subject.

### New Card system

**One `ContentCard` component.** Visual variants are gone. Each card shows:
- Icon (from frontmatter or default)
- Title
- Description
- Status (chip, monochrome in cards per existing P2 polish)
- Type badge (small label, e.g., "Project" / "Article" / "Note")
- Tags
- Date

Used in: Home Knowledge Areas, Home Latest Essays, Hub sections, Folder pages, Tag pages, Search results, Graph-related.

### New ContentQuery surface

| Function | Purpose |
|----------|---------|
| `queryByTopic(allFiles, topicSlug)` | All files in a topic's scope |
| `queryKnowledge(allFiles)` | All files under any Knowledge/ hub |
| `queryResources(allFiles)` | All files under any Resources/ hub |
| `queryFeatured(allFiles, limit?)` | All `featured: true` files, sorted by `featuredOrder` |
| `queryRecent(allFiles, limit?)` | Recent files, by modified date |

**Delete:** `queryFolder("projects")` usage in Home. The function itself stays as a generic utility (used by `queryByTopic` internally). The `FeaturedType` union no longer needs `"project"`.

---

## Impact Summary

| Layer | Impact | Reversibility |
|-------|--------|---------------|
| Navigation | 1 item relabeled (Projects → Topics); URL stays /projects | Easy — `navigation.ts` edit |
| Folder | `content/Projects/` kept as-is; TODO marker added | Hard later (AGENTS.md blocks auto-rename) |
| PageType | Add 3 new specs (topic, resource, about); none deleted | Easy — additive |
| Card | 3 variants → 1 ContentCard; ~40 lines of CSS removed | Medium — touches FeaturedSection, ProjectsSection |
| Home | 4 sections → 4 sections but 3 redesigns; Now/Projects removed | Medium — touches Home.tsx, content/index.md, hero.md |
| Metadata | Reorder fields; drop "项目" label | Easy |
| Query | New functions; FeaturedType slimmed; "projects" folder query removed | Easy |
| Drawer | 1 expandable section → 2 expandable sections | Medium |
| Footer | 1 item relabeled (Projects → Topics) | Easy |

**No breaking change for readers** — all existing URLs (`/projects`, `/Knowledge/Android`, etc.) still resolve. The visual change is the removal of Now/Projects on Home and the unification of cards.

**Breaking change for content authors:** the `featuredType: project` filter on `Projects/index.md` hub will no longer match (since `FeaturedType` is being slimmed). All 3 project files need their `featuredType` value either removed (so they fall back to no featured-type filter) or replaced with their actual type. Hub index's `sections[0].filter` needs the same update.

---

## Migration Plan (8 phases, sequential, stop after each)

### Phase 2.1 — PageType registry: add `topic`, `resource`, `about`

**Files:**
- `src/lib/pageTypeRegistry.ts` — append 3 new PageTypeSpec entries
- `src/lib/pageTypeRegistry.ts` — append `getTopics(allFiles, cfg)`, `getResources(allFiles, cfg)`, `getAbout(allFiles, cfg)` (mirror `getHubs`)
- `quartz.config.yaml` — extend `byPageType` with `topic:`, `resource:`, `about:` layout overrides (each same as `hub:`)

**Acceptance:** build succeeds, no content files have the new `type` values yet so no behavior change visible.

### Phase 2.2 — ContentQuery refactor

**Files:**
- `src/lib/contentQuery.ts` — add `queryByTopic`, `queryKnowledge`, `queryResources`, `queryFeatured`, `queryRecent`; keep `querySection`/`queryFolder` as internal primitives; `FeaturedType` becomes `"article" | "note" | "experiment"` (drop `"project"`)
- No consumer changes yet — this phase just makes the new API available

**⚠ ORDERING CONSTRAINT:** Do NOT drop `"project"` from `FeaturedType` yet. The 3 `content/Projects/*.md` files still use `featuredType: project`, and `Projects/index.md` hub uses it in its `sections[0].filter`. Defer the drop to Phase 2.7 when content is also migrated. **Adjusted:** in Phase 2.2, KEEP `"project"` in the union; only ADD the new query functions. The union slim happens in 2.7.

**Acceptance:** build succeeds, no behavior change.

### Phase 2.3 — Card system unification

**Files:**
- `src/components/ContentCard.tsx` — add `type` prop (renders Type badge); keep existing variant-agnostic logic
- `src/components/home/FeaturedSection.tsx` — drop `ProjectCard` and the `bucket.type === "project"` branch; render all buckets as `ContentCard` with type prop
- `src/components/home/ProjectsSection.tsx` — **delete** (replaced by TopicsSection in 2.5)
- `src/styles/home.scss` — remove `.projects-grid`, `.project-card*` (lines 251-292)
- `src/styles/components.scss` — remove `.featured-card-project`, `.project-card-body`, `.project-card:focus-visible` (lines 339-349, 426-428)

**Acceptance:** Home Featured section renders all items as ContentCard with Type badge; visual is calmer.

### Phase 2.4 — Metadata refactor

**Files:**
- `src/components/MetadataPanel.tsx` — add `Topic` field (compute from URL: which hub/topic owns this file); remove `project: "项目"` from labels; field order: Topic → Type → Status → Tags → Updated → Created
- `src/lib/contentQuery.ts` — add helper `getOwningHub(file, allFiles)` (returns the nearest enclosing hub/topic slug, if any)

**Acceptance:** any article's metadata panel shows the owning topic first, then type, then status, then tags, then dates. No "项目" label.

### Phase 2.5 — Navigation & Drawer reorganization

**Files:**
- `src/lib/navigation.ts` — change `id: "projects"` → `id: "topics"`, `label: "Projects"` → `label: "Topics"`, keep `href: "/projects"`, add `expandable: true` and `// TODO(domain-migration): rename content/Projects/ → content/Topics/ and update href to /topics` comment
- `src/components/DrawerNav.tsx` — add a second expandable section for Topics, populated via `getTopics()`; filter out top-level nav items (Knowledge, Topics, Resources, Graph) from both sections
- `src/components/BrandHeader.tsx` — no change (consumes `getNavItems()` automatically)
- `src/components/BrandFooter.tsx` — Explore column now reads Topics instead of Projects (consumes `getNavItems()` automatically)

**Acceptance:** Header shows Knowledge / Topics / Resources / Graph / About; Drawer has Knowledge ▾ and Topics ▾; Footer Explore shows Topics instead of Projects. All three still pull from `navigation.ts`.

### Phase 2.6 — Home redesign

**Files:**
- `src/components/Home.tsx` — drop `"now" | "projects"` from `Order` type and `DEFAULT_ORDER`; add `"knowledge-areas" | "latest" | "quote"`; new components `KnowledgeAreasSection`, `LatestEssaysSection`, `QuoteSection`
- `src/components/home/KnowledgeAreasSection.tsx` — **NEW** — 5 area cards (one per Knowledge hub)
- `src/components/home/LatestEssaysSection.tsx` — **NEW** — 3 most recent content items as ContentCard
- `src/components/home/QuoteSection.tsx` — **NEW** — single line from config (`cfg.brand.quote ?? "..."`)
- `content/index.md` — change `sectionOrder: [hero, now, featured, projects]` → `sectionOrder: [hero, knowledge-areas, latest, quote]`
- `content/Home/hero.md` — change "查看项目" CTA → "Browse Topics" pointing to `/projects`; first CTA becomes "Enter Knowledge" pointing to `/knowledge`; add `currentlyExploring:` frontmatter field for the 3-5 currently active topics (displayed above CTAs)
- `quartz.config.yaml` — add `brand.quote: "..."` (a single static line)

**Acceptance:** Home is ≤1 screen on desktop (no scroll required to see Hero + Knowledge Areas). Now/Projects/Featured are gone. Brand voices a single line + Currently Exploring + 2 CTAs.

### Phase 2.7 — Content frontmatter migration

**Files:**
- `content/Projects/index.md` — change `type: hub` → `type: topic`; rename title from "项目" to "Topics"; reframe sections DSL (drop `featuredType: project` filter, use `queryByTopic` or remove featuredType entirely)
- `content/Projects/ai-workflow.md` — drop `featuredType: project`; add `type: project` (content type, not pageType)
- `content/Projects/auto-account.md` — same
- `content/Projects/fastbuild.md` — same
- `content/Resources/index.md` — `type: hub` → `type: resource`
- `content/About.md` — add `type: about`
- `content/index.md` — already updated in 2.6
- `src/lib/contentQuery.ts` — NOW drop `"project"` from `FeaturedType` union (last because content migration is done)

**Acceptance:** build succeeds, all pages still render; each content file has correct `type:` value.

### Phase 2.8 — Verification + Remaining Issues

**Actions:**
- `npm run quartz build` — must succeed, no new warnings
- `npx tsc --noEmit` — surface any new type errors
- Screenshot 1440 / 768 / 390 — Home, Knowledge hub, Projects (now Topics) hub, About page, Graph page
- Assert: Header has 5 items, Drawer has Knowledge ▾ + Topics ▾ + 3 flat, Footer Explore has 4 items (Knowledge/Topics/Resources/Graph), Home has Hero + Knowledge Areas + Latest Essays + Quote, no "Project" string appears in any rendered HTML
- Output: `Remaining Issues` list (folder migration TODO, any deprecation warnings, anything not covered)

---

## Risk

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Existing `featuredType: project` filter on `Projects/index.md` breaks when FeaturedType is slimmed in 2.2 | High | Captured above: keep `"project"` in FeaturedType during 2.2-2.6, drop it only in 2.7 (when content is migrated). |
| `/projects` URL stays, but folder name "Projects" is misleading in editor | Medium | Add `// TODO` marker in `navigation.ts`; document in AGENTS.md under "Future Migrations" |
| Three-variant card removal (Phase 2.3) may regress visual variety | Medium | ContentCard with Type badge + status chip already gives enough signal. If visual feels flat after screenshots, add a subtle left-border accent per type (separate phase). |
| Drawer's two expandable sections take more vertical space | Low | Default state shows only section headers; user expands on demand. No screen space cost when collapsed. |
| Hub `type: hub` is currently used by 7 files (5 Knowledge + 1 Resources + 1 Projects). Changing Projects to `type: topic` means 6 hubs remain under `type: hub` — `getHubs()` should still find them. | Low | Verified: `type: hub` matcher is `slug.endsWith("/index")` AND `type === "hub"`. The 6 remaining hubs all have `type: hub`. |
| Content authors don't know they need to set `type:` on new files | Medium | Add a small comment block at the top of `content/index.md` documenting the new type values |
| `getOwningHub()` computation in 2.4 is O(n) per article — for 24 files it's fine, for 1000+ it could be slow | Low | Memoize at build start; for now, direct computation is acceptable for 24 files |
| `quartz.config.yaml` `byPageType` may need new entries for `topic`/`resource`/`about`; if not added, they fall back to `content` layout which is wrong for the new pages | Medium | Phase 2.1 adds all 3 layout overrides explicitly. |

---

## Files (consolidated across all 8 phases)

| Phase | File | Action |
|-------|------|--------|
| 2.1 | `src/lib/pageTypeRegistry.ts` | Add 3 specs + 3 enumerators |
| 2.1 | `quartz.config.yaml` | Add 3 byPageType entries |
| 2.2 | `src/lib/contentQuery.ts` | Add 5 query functions; **keep** `"project"` in FeaturedType for now |
| 2.3 | `src/components/ContentCard.tsx` | Add `type` prop + Type badge |
| 2.3 | `src/components/home/FeaturedSection.tsx` | Drop ProjectCard branch; render all as ContentCard |
| 2.3 | `src/components/home/ProjectsSection.tsx` | **Delete** |
| 2.3 | `src/styles/home.scss` | Remove 5 project-specific classes |
| 2.3 | `src/styles/components.scss` | Remove 3 project-specific classes |
| 2.4 | `src/components/MetadataPanel.tsx` | Add Topic field; drop `project` label |
| 2.4 | `src/lib/contentQuery.ts` | Add `getOwningHub` helper |
| 2.5 | `src/lib/navigation.ts` | Relabel + add TODO |
| 2.5 | `src/components/DrawerNav.tsx` | Add Topics expandable section |
| 2.5 | `src/components/BrandFooter.tsx` | No code change (consumes nav automatically) |
| 2.6 | `src/components/Home.tsx` | Replace Order type and switch |
| 2.6 | `src/components/home/KnowledgeAreasSection.tsx` | **NEW** |
| 2.6 | `src/components/home/LatestEssaysSection.tsx` | **NEW** |
| 2.6 | `src/components/home/QuoteSection.tsx` | **NEW** |
| 2.6 | `content/index.md` | Update sectionOrder |
| 2.6 | `content/Home/hero.md` | Update CTAs, add currentlyExploring |
| 2.6 | `quartz.config.yaml` | Add `brand.quote` |
| 2.7 | `content/Projects/index.md` | type: hub → type: topic; reframe sections |
| 2.7 | `content/Projects/ai-workflow.md` | Drop featuredType; add type: project |
| 2.7 | `content/Projects/auto-account.md` | Same |
| 2.7 | `content/Projects/fastbuild.md` | Same |
| 2.7 | `content/Resources/index.md` | type: hub → type: resource |
| 2.7 | `content/About.md` | Add type: about |
| 2.7 | `src/lib/contentQuery.ts` | NOW drop `"project"` from FeaturedType |
| 2.8 | (verification) | Build, typecheck, screenshots, remaining-issues report |

**Not modified (explicit non-goals for this phase):**
- `src/components/Hub.tsx` (generic DSL — works for any hub-like page)
- `src/components/hub/sections.tsx` (generic)
- `src/components/ArticleMeta.tsx` (no project logic)
- `src/components/CardGrid.tsx` (generic)
- `src/components/StatusChip.tsx`
- `src/components/ScopedGraph.tsx`
- `src/styles/tokens.scss` (no change)
- `src/styles/typography.scss` (no change)
- All `.quartz/plugins/**` (AGENTS.md)
- `content/Knowledge/**` (no change — they remain `type: hub`)
- `content/Now/**` (no change — Now stays on disk, just not on Home anymore; user can still navigate via search)
- `content/生活与效率/`, `content/阅读与思考/`, `content/自动化与工具/` (no change — these remain `type: hub` in Knowledge drawer)

---

## Verification (per phase + final)

**Per phase:**
1. `npm run quartz build` — exit 0, no new warnings vs previous phase baseline
2. Manual review of changed files: diff confirms only the planned edits, no scope creep
3. Stop and report `Remaining Issues` before next phase

**After Phase 2.8 (final):**
1. `npm run quartz build` — exit 0
2. `npx tsc --noEmit` — surface pre-existing vs new type errors (only "new" ones are blocking)
3. Playwright assertions:
   - Header has 5 nav items: `["Knowledge", "Topics", "Resources", "Graph", "About"]`
   - Drawer has 7 visible sections: `["Knowledge ▾", "Topics ▾", "Resources", "Graph", "About"]` (the two expandables are visible in default state, hubs/topics list shown when expanded)
   - Footer Explore has 4 items: `["Knowledge", "Topics", "Resources", "Graph"]`
   - Home HTML contains sections: `["hero", "knowledge-areas", "latest", "quote"]` and does NOT contain `projects-section` or `now-section` class
   - No rendered HTML anywhere contains the substring `Project Card` or `项目` (search via `grep -r "项目" public/` returns only the home/projects URLs in nav, not labels)
4. Screenshots: Home (1440/768/390), Knowledge/Android hub (1440), Topics hub (1440), About (1440), Graph (1440). Verify: Hero ≤1 screen, no Now section, no Projects section on Home, cards are uniform ContentCard, drawer has two expandable sections.

---

## Appendix: Full surface-area map

- `content/Projects/{index.md, ai-workflow.md, auto-account.md, fastbuild.md}` — only 4 files contain `featuredType: project`
- 0 files contain `type: project` (no pageType pollution)
- 0 files contain `tags: [project]`
- 0 files contain `project: "..."` frontmatter
- 7 `type: hub` files: `Projects/index.md`, `Resources/index.md`, `Knowledge/AI/index.md`, `Knowledge/Android/index.md`, `生活与效率/index.md`, `阅读与思考/index.md`, `自动化与工具/index.md`
- "Topics" has zero current surface area — fully new concept

---

**STOP. 等候确认后再开始 Phase 2.1.**

If approved, proceed in strict phase order: 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7 → 2.8, stopping after each with a `Remaining Issues` report.
