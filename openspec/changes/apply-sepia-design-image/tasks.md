# Tasks — `apply-sepia-design-image`

**Authority hierarchy:** Page design → design image (1:1). Non-page-design → user principles (calm, breathing space, accessibility, subtle animation). See `principle-alignment.md` for conflicts.

**Tag legend per task:**
- `K` Keep / No change
- `M` Modify existing
- `R` Replace existing
- `N` New component
- `Re` Reuse existing (as-is)

**Phase rules (per user):** Before every phase, explain Current / Target / Files / Reason / Screenshots. Never modify unrelated files. Each phase must compile (`npm run quartz build`). Each phase needs screenshots at 1440 / 768 / 390.

**Design fidelity phases (13-17):** Added 2026-06-27 after deployment revealed Hub/Topic/Resource pages diverge significantly from design frames 02/03/05. These phases close the gap. Breadcrumbs already handled by plugin (Phase 13 is config-only).

---

## Phase 1: Audit (no code)

**Status:** COMPLETE.
**Artifacts produced:**
- `audit.md` — current state of codebase
- `migration.md` — design image vs current state, mapped
- `principle-alignment.md` — principle vs image conflicts identified
- `design.md` — revised with two-track authority rule
- `tasks.md` — this file, restructured to 12 phases

---

## Phase 2: Theme Polish (Spacing / Typography / Cards)

**Status:** COMPLETE (2026-06-27).

**Current state:** All card styles use token-based shadow (`--shadow-flat` default, `--shadow-soft` hover). No borders on cards. Padding `--space-6` (24px) all sides. StatusChip `subtle` variant auto-applied in card contexts. Typography: 16px body, 1.6 line-height, heading scale 2.25/1.75/1.375/1.125rem. All spacing uses `--space-*` tokens.
**Target state:** Cards lighter (reduced shadow, no border, more spacing). Status chip subtle in card contexts. Typography generous. Spacing standardized.
**Files modified:** `src/styles/components.scss` (content-card shadow tokenized).

### Tasks

- [x] 2.1 **[M]** Audit existing card styles; document current shadow/border/spacing values
- [x] 2.2 **[M]** Reduce card shadow: `--shadow-flat` for default, `--shadow-soft` only on hover
- [x] 2.3 **[M]** Reduce card border: thin (1px) `--border` color or no border (use spacing for separation)
- [x] 2.4 **[M]** Increase card padding: minimum `--space-6` (24px) on all sides
- [x] 2.5 **[M]** Add `subtle` size variant to `StatusChip` for card contexts (lower opacity, smaller)
- [x] 2.6 **[M]** Verify body typography: ≥16px, line-height ≥1.6
- [x] 2.7 **[M]** Verify heading scale: h1 > h2 > h3 with adequate contrast in size
- [x] 2.8 **[M]** Audit spacing usage across components; replace hardcoded values with `--space-*` tokens
- [x] 2.9 **[K]** Tokens palette unchanged (per user — do NOT redesign colors)
- [x] 2.10 **[M]** `npx quartz build` — passes ✅

---

## Phase 3: Home Page (Image-faithful)

**Status:** COMPLETE (2026-06-27).

**CONFLICT FLAGGED:** Principles say "one-screen hero only." Image says multi-screen with stats + cards + quote. **Image wins per user rule.** Proceeding with image layout.

**Current state:** `Home.tsx` composes Hero + KnowledgeAreasSection + LatestEssaysSection + QuoteSection. `Home/hero.md` provides tagline + CTAs. `content/index.md` has `sectionOrder: [hero, knowledge-areas, latest, quote]`. Now/Featured/Projects removed from Home.
**Target state:** Per design image Frame 01 — Hero (persona + CTAs) → Knowledge Areas (hub cards) → Latest Essays (3 ContentCards) → Quote callout.
**Files modified:** `content/Home/hero.md`, `content/index.md`, `src/components/Home.tsx`, `src/components/home/KnowledgeAreasSection.tsx`, `src/components/home/LatestEssaysSection.tsx`, `src/components/home/QuoteSection.tsx`.
**Note:** Site-wide stats (128/24/36/18/320+) deferred to `contentStats` plugin.

### Tasks

- [x] 3.1 **[M]** Update `Home/hero.md` frontmatter: tagline + CTAs ("进入知识库" / "探索专题") ✅
- [x] 3.2 **[M]** Update `content/index.md` `sectionOrder`: `[hero, knowledge-areas, latest, quote]` ✅
- [x] 3.3 **[M]** Update `src/components/Home.tsx` to render new sections ✅
- [x] 3.4 **[M]** `SectionShell.tsx` supports new section types ✅
- [x] 3.5 **[N]** `KnowledgeAreasSection.tsx` — auto-discovers hubs, renders grid ✅
- [x] 3.6 **[N]** `LatestEssaysSection.tsx` — queries recent 3, renders ContentCards ✅
- [x] 3.7 **[N]** `QuoteSection.tsx` — reads `brand.quote` from config ✅
- [x] 3.8 **[M]** Now/Featured/Projects removed from Home sectionOrder ✅
- [x] 3.9 **[M]** `npx quartz build` — passes ✅
- [ ] 3.10 **[M]** Screenshots at 1440 / 768 / 390 — deferred to Phase 12

---

## Phase 4: Knowledge Hub Refinement (Image-faithful)

**Status:** MOSTLY DONE (2026-06-27). Components created. Wiring deferred (no Knowledge/index.md with `type: hub`).

**Current state:** `Hub.tsx` + `hub/sections.tsx` render declarative sections. `HubHeader.tsx`, `HubStats.tsx`, `CoreTopicsGrid.tsx` exist in `src/components/hub/` but are not yet integrated into `Hub.tsx` (no root Knowledge/index.md). `TopicPage.tsx` and `ResourcePage.tsx` are standalone components registered as separate pageTypes.
**Target state:** Per image Frame 02 — Hub hero → sections. Topic/Resource pages have their own layouts.
**Note:** LearningTimeline removed per user decision. Topic/Resources implemented as standalone pageTypes (not Hub DSL extensions).

### Tasks

- [x] 4.1 **[N]** `HubHeader.tsx` — title + description + stats ✅
- [x] 4.2 **[N]** `HubStats.tsx` — 5-cell stats row (笔记/专题/标签/系列/链接) ✅
- [x] 4.3 **[N]** `CoreTopicsGrid.tsx` — grid of `type: topic` child pages ✅
- [x] 4.4 **[N]** `TopicPage.tsx` — 3-tab layout (概览/核心文章/相关资源) ✅
- [x] 4.5 **[N]** `ResourcePage.tsx` — filter tabs + sidebar ✅
- [x] 4.6 **[N]** `ResourceSidebar.tsx` — category counts ✅
- [x] 4.7 **[M]** `pageTypeRegistry.ts` — topic/resource pageType specs + enumerators ✅
- [ ] 4.8 **[M]** Wire HubHeader/CoreTopicsGrid into Hub.tsx — **deferred** (needs Knowledge/index.md with `type: hub`)
- [ ] 4.9 **[M]** Create `content/Knowledge/index.md` with `type: hub` — **optional, deferred**
- [x] 4.10 **[M]** `npx quartz build` — passes ✅
- [ ] 4.11 **[M]** Screenshots — deferred to Phase 12

---

## Phase 5: Article Refinement (Image-faithful)

**Status:** COMPLETE (2026-06-27).

**Current state:** Article layout has: TOC + Backlinks + MetadataPanel in right slot, ArticleMeta + Breadcrumbs in beforeBody. NEW: ArticleMiniGraph (scoped graph ~200px) added to right slot. ArticlePrevNext (prev/next nav) added to afterBody.
**Target state:** Per image Frame 04 — Title → Summary → Metadata → Content → Backlinks → Mini Graph → Footer navigation (Previous/Next).
**Files modified:** `src/components/ArticleMiniGraph.tsx` (new), `src/components/ArticlePrevNext.tsx` (new), `quartz/plugins/loader/config-loader.ts`, `src/styles/components.scss`.

### Tasks

- [x] 5.1 **[N]** Create `src/components/ArticleMiniGraph.tsx` — scoped graph ~200px ✅
- [x] 5.2 **[N]** Create `src/components/ArticlePrevNext.tsx` — prev/next navigation ✅
- [x] 5.3 **[Re]** MetadataPanel already in right slot ✅
- [x] 5.4 **[Re]** TOC already in right slot ✅
- [x] 5.5 **[Re]** Backlinks already in right slot ✅
- [x] 5.6 **[M]** Register components in `config-loader.ts` ✅
- [x] 5.7 **[M]** Add CSS for mini graph + prev/next ✅
- [x] 5.8 **[M]** `npx quartz build` — passes ✅
- [ ] 5.9 **[M]** Screenshots — deferred to Phase 12

---

## Phase 6: Rename Project → Topic

**Status:** MOSTLY COMPLETE (2026-06-27). Nav labels + folder renamed. Remaining: ContentCard type badge CSS.

**Current state:** `navigation.ts` SSOT has Chinese labels (知识库/专题/资源/图谱/关于). `content/Projects/` renamed to `content/Topics/`. `DrawerNav` shows Topics ▾ expandable section. `MetadataPanel` shows Topic field. `BrandHeader` uses SVG search icon.
**Target state:** Per design — all nav in Chinese, "专题" label, folder at `/topics`.
**Files modified:** `src/lib/navigation.ts`, `src/components/BrandHeader.tsx`, `src/components/DrawerNav.tsx`, `src/components/MetadataPanel.tsx`, `content/Topics/` (renamed from Projects).
**Reason:** Principles: "Topics are long-term knowledge collections, not software projects." Image also uses 专题.

### Tasks

- [x] 6.1 **[M]** `navigation.ts`: all 5 nav titles changed to Chinese (知识库/专题/资源/图谱/关于)
- [x] 6.2 **[M]** `BrandHeader.tsx`: search icon changed from `🔍` emoji to SVG magnifying glass
- [x] 6.3 **[M]** `content/Projects/` renamed to `content/Topics/`; `Topics/index.md` has `type: topic`
- [x] 6.4 **[M]** `DrawerNav.tsx`: Topics ▾ expandable section with auto-discovered topic pages
- [x] 6.5 **[M]** `MetadataPanel.tsx`: Topic field added, Type field shows content type badge
- [x] 6.6 **[M]** Verify nav order: 知识库 / 专题 / 资源 / 图谱 / 关于 (5 items) ✅
- [x] 6.7 **[M]** Add `.content-card-type` CSS styling ✅ (added to `components.scss`)
- [x] 6.8 **[M]** `npx quartz build` — passes ✅
- [ ] 6.9 **[M]** Screenshots at 1440 / 768 / 390 — verify nav labels

---

## Phase 7: About Page (Image layout + Principle-aligned copy)

**Status:** COMPLETE (2026-06-27).

**Current state:** `content/About.md` has type: about with `principles` and `quickLinks` frontmatter arrays. `AboutPrinciples` and `QuickLinksGrid` components registered in `config-loader.ts` `beforeBody` slot for about pageType. Layout: bio → principles (2×2/4-col) → quick links grid → 关于花园 → 联系.
**Target state:** Per image Frame 07 — bio + 4 principles (Seed/Growing/Evergreen/Complete) + 4-column quick links grid + contact section. Copy: concise (per principles).
**Files modified:** `content/About.md`, `src/components/AboutPrinciples.tsx` (new), `src/components/QuickLinksGrid.tsx` (new), `quartz/plugins/loader/config-loader.ts`, `src/styles/components.scss`.
**Reason:** Design image Frame 07 (layout). Principles: less personal info, more philosophy/tools.
**Expected screenshots:** About at 1440 / 768 / 390 px.

### Tasks

- [x] 7.1 **[M]** Update `content/About.md` frontmatter with `principles`, `quickLinks` arrays ✅
- [x] 7.2 **[M]** Rewrite About copy per principles: concise (no career timeline, no learning history) ✅
- [x] 7.3 **[N]** Create `src/components/AboutPrinciples.tsx` — 4 principles display with stage icons ✅
- [x] 7.4 **[N]** Create `src/components/QuickLinksGrid.tsx` — 4-column link grid ✅
- [x] 7.5 **[M]** Wire `AboutPrinciples` and `QuickLinksGrid` into `config-loader.ts` about beforeBody ✅
- [x] 7.6 **[Re]** Added CSS for principles grid + quick links grid to `components.scss` ✅
- [x] 7.7 **[M]** `npx quartz build` — passes ✅
- [ ] 7.8 **[M]** Screenshots at 1440 / 768 / 390 — deferred to Phase 12

---

## Phase 8: Footer Refinement (Image-faithful + Back to Top from principles)

**Status:** MOSTLY COMPLETE (2026-06-27). 4-column layout done. Mountain motif + Back to Top deferred.

**Current state:** `BrandFooter.tsx` enhanced in place with 4-column grid layout (探索/花园/联系/关于). Footer background is transparent (user reverted warm beige — felt uncoordinated without full-width).
**Target state:** Per image Frame 08 — 4-column footer (探索 / 花园 / 联系 / 关于). Per principles — Back to Top anchor (deferred). Mountain motif (deferred — only works with full-width footer).
**Files modified:** `src/components/BrandFooter.tsx`, `src/styles/layout.scss`.
**Reason:** Design image Frame 08 (4 columns). Principles add Back to Top.
**Note:** Original plan was to create `SiteFooter.tsx` and delete `BrandFooter.tsx`. Decision: enhance `BrandFooter.tsx` in place — same 4-column result, less churn.

### Tasks

- [x] 8.1 **[M]** `BrandFooter.tsx` rewritten: 4-column grid (探索/花园/联系/关于)
- [x] 8.2 **[M]** `layout.scss`: `.brand-footer-grid` uses `repeat(4, 1fr)` on desktop, stacks on mobile
- [x] 8.3 **[M]** 联系 column: GitHub / Email / RSS (migrated from old socials)
- [x] 8.4 **[M]** 探索 column: reads from `getNavItems()` (auto Chinese labels)
- [x] 8.5 **[M]** 花园 column: titles only (随机游走/最新动态/归档 — no links yet)
- [x] 8.6 **[M]** 关于 column: 关于花园/使用说明/开源地址
- [x] 8.7 **[M]** Bottom section: brand name + motto + copyright + last updated
- [ ] 8.8 **[N]** Mountain motif decoration (deferred — needs full-width footer to look right)
- [ ] 8.9 **[N]** "Back to Top" anchor link (deferred)
- [x] 8.10 **[M]** Verify footer renders on every pageType ✅
- [x] 8.11 **[M]** `npx quartz build` — passes ✅
- [ ] 8.12 **[M]** Screenshots at 1440 / 768 / 390 — verify footer matches image

---

## Phase 9: Mobile Polish (Principles — 375 / 390 / 430)

**Status:** MOSTLY COMPLETE (2026-06-27). Touch targets fixed. Responsive CSS verified.

**Current state:** DrawerNav exists. Responsive media queries in all components. Content cards single-column on mobile. Footer single-column on mobile. Touch targets ≥44×44px for drawer trigger, search, footer links. Knowledge areas 2-column on mobile. Latest essays single-column on mobile.
**Target state:** All pages work cleanly at 375 / 390 / 430 px. Cards single-column. Footer collapses to single column. Touch targets ≥44×44px.
**Files modified:** `src/styles/layout.scss`, `src/styles/components.scss`.

### Tasks

- [x] 9.1 **[M]** DrawerNav: 86vw on mobile, 50vw on tablet — already implemented ✅
- [x] 9.2 **[M]** Knowledge areas: 2-column on mobile, 3 on tablet, 5 on desktop — already implemented ✅
- [x] 9.3 **[M]** Latest essays: single-column on mobile, 3 on desktop — already implemented ✅
- [x] 9.4 **[M]** Now grid: single-column on mobile, 3 on desktop — already implemented ✅
- [x] 9.5 **[M]** Footer: single-column on mobile, 4-column on desktop — already implemented ✅
- [x] 9.6 **[M]** Content card: reduced padding `--space-4` on mobile, `--space-6` on desktop ✅
- [x] 9.7 **[M]** Touch targets: drawer trigger + search + footer links ≥44×44px ✅
- [x] 9.8 **[M]** `npx quartz build` — passes ✅
- [ ] 9.9 **[M]** Screenshots at 375 / 390 / 430 — deferred to Phase 12

---

## Phase 10: Accessibility (Principles — AA)

**Status:** MOSTLY COMPLETE (2026-06-27). Focus rings implemented, reduced-motion supported.

**Current state:** Focus-visible rings on all interactive elements (links, buttons, tabs, cards). `prefers-reduced-motion: reduce` disables all transitions. ARIA labels on drawer, MetadataPanel, search trigger.
**Target state:** AA contrast everywhere. Keyboard nav complete. Visible focus rings. ARIA labels on all interactive elements.
**Files modified:** `src/styles/components.scss`, `src/styles/layout.scss`, `src/styles/tokens.scss`.

### Tasks

- [x] 10.1 **[M]** Focus rings: `outline: 2px solid var(--accent-primary); outline-offset: 2px` on all `:focus-visible` ✅
- [x] 10.2 **[M]** `prefers-reduced-motion` sets all motion tokens to 0ms ✅
- [x] 10.3 **[M]** Drawer has ARIA labels (open/close) ✅
- [x] 10.4 **[M]** Search trigger has ARIA label ✅
- [ ] 10.5 **[M]** Audit text/background AA contrast — deferred
- [ ] 10.6 **[M]** Keyboard navigation audit — deferred
- [ ] 10.7 **[M]** Screenshots — deferred to Phase 12

---

## Phase 11: Animation Polish (Principles — Subtle Only)

**Status:** MOSTLY COMPLETE (2026-06-27). Motion tokens exist, transitions use them.

**Current state:** Motion tokens (`--motion-fast/base/slow`, `--motion-easing`). All transitions use tokens. `prefers-reduced-motion` supported.
**Target state:** All animations use only fade / opacity / translateY. No scale, no bounce. All respect `prefers-reduced-motion`.
**Files modified:** `src/styles/tokens.scss`, component CSS.

### Tasks

- [x] 11.1 **[M]** Motion tokens defined in `tokens.scss` ✅
- [x] 11.2 **[M]** All transitions use `var(--motion-*)` tokens ✅
- [x] 11.3 **[M]** `prefers-reduced-motion` disables all animations ✅
- [x] 11.4 **[M]** Content card hover uses only translateY (no scale, no bounce) ✅
- [x] 11.5 **[M]** Drawer transition uses motion tokens ✅
- [x] 11.6 **[M]** `npx quartz build` — passes ✅
**Expected screenshots:** N/A (functional verification).

### Tasks

- [ ] 11.1 **[M]** Audit all CSS transitions and animations across components
- [ ] 11.2 **[M]** Replace any `transform: scale()` with `transform: translateY()` or opacity
- [ ] 11.3 **[M]** Replace any bounce/cubic-bezier playfulness with ease-out
- [ ] 11.4 **[M]** Verify all animations ≤300ms
- [ ] 11.5 **[M]** Add `@media (prefers-reduced-motion: reduce)` overrides where missing
- [ ] 11.6 **[M]** Verify drawer slide-in is subtle (translateX, ≤280ms)
- [ ] 11.7 **[M]** `npx tsup && npx quartz build` — must succeed

---

## Phase 12: Final Screenshots & Acceptance

**Current state:** All previous phases complete.
**Target state:** Every page type rendered at 1440 / 768 / 390 px. Acceptance criteria verified.
**Files modified:** none (verification phase).
**Reason:** User requirement: every phase needs screenshots; final acceptance check.
**Expected screenshots:** Complete set.

### Tasks

- [ ] 12.1 **[M]** Use `run` skill to launch dev server
- [ ] 12.2 **[M]** Screenshot Home at 1440 / 768 / 390 px
- [ ] 12.3 **[M]** Screenshot Knowledge Hub (Android) at 1440 / 768 / 390 px
- [ ] 12.4 **[M]** Screenshot Topic at 1440 / 768 / 390 px
- [ ] 12.5 **[M]** Screenshot Article at 1440 / 768 / 390 px
- [ ] 12.6 **[M]** Screenshot Resources at 1440 / 768 / 390 px
- [ ] 12.7 **[M]** Screenshot Knowledge Graph at 1440 / 768 / 390 px
- [ ] 12.8 **[M]** Screenshot About at 1440 / 768 / 390 px
- [ ] 12.9 **[M]** Screenshot Footer (any page) at 1440 / 768 / 390 px
- [ ] 12.10 **[M]** Acceptance check: calm, premium, elegant, knowledge-first, minimal, timeless?
- [ ] 12.11 **[M]** Verify no visual complexity creep (back off if added)
- [ ] 12.12 **[M]** Update README and docs with final design overview
- [ ] 12.13 **[M]** Update AGENTS.md "Plugin Source Modifications" table if needed

---

## Cross-Phase: Foundation Tasks (run once, support multiple phases)

These tasks support multiple phases and should be completed early.

### Frontmatter Schema Extensions (supports Phases 3, 4, 7)

- [ ] F.1 **[M]** Add `mastery` field (enum: 已掌握 / 已记录 / 相关 / 未涉及; default: 已记录)
- [ ] F.2 **[M]** Add `learningPath` field (array of `{ label, slug, status? }`)
- [ ] F.3 **[M]** Add `coreArticles` field (array of slugs)
- [ ] F.4 **[M]** Add `relatedTopics` field (array of slugs)
- [ ] F.5 **[M]** Add `principles` field (array of `{ name, description, stage }`)
- [ ] F.6 **[M]** Add `quickLinks` field (object of category → links)
- [ ] F.7 **[M]** Add `contacts` field (array of `{ label, url, icon }`)
- [ ] F.8 **[M]** Add `quote` and `quoteAuthor` fields
- [ ] F.9 **[M]** Add `area` field (object `{ name, icon, description, slug }`)
- [ ] F.10 **[M]** Document new fields in `docs/frontmatter.md`

### contentStats Plugin (supports Phases 3, 6)

- [ ] F.11 **[N]** Create `src/lib/plugins/contentStats.ts` — Quartz plugin computing site-wide stats
- [ ] F.12 **[N]** Implement `emit()`: scan all MarkdownMetadata, compute `{ notes, topics, tags, series, links }`
- [ ] F.13 **[N]** Implement per-area note counts
- [ ] F.14 **[N]** Implement WikiLink deduplication for `links` count
- [ ] F.15 **[M]** Register plugin in `quartz.config.ts`
- [ ] F.16 **[M]** Verify stats appear in component data context
- [ ] F.17 **[K]** Test build with sample add/remove

### Mastery Graph (supports Phases 5, 11)

- [ ] F.18 **[N]** Create `src/components/MasteryGraph.tsx` — wraps `ScopedGraph.tsx` with mastery coloring
- [ ] F.19 **[M]** Apply mastery color rules: 已掌握 solid / 已记录 outline / 相关 dashed / 未涉及 light
- [ ] F.20 **[N]** Create `src/components/MasteryLegend.tsx` — category legend
- [ ] F.21 **[N]** Create `src/components/MasteryFilter.tsx` — toggle controls

### Resources Page (supports Phase 4 if image-faithful)

- [ ] F.22 **[M]** Update `content/Resources/index.md` frontmatter with category metadata
- [ ] F.23 **[N]** Create `src/components/ResourceFilterBar.tsx`
- [ ] F.24 **[N]** Create `src/components/ResourceCategorySidebar.tsx`
- [ ] F.25 **[M]** Wire filter components into Resources hub layout

---

## Phase 13: Breadcrumbs Configuration (Quick fix)

**Status:** PENDING.
**Current state:** Breadcrumbs plugin already renders in `beforeBody` for hub/topic/resource pages. Root label defaults to `"Home"`.
**Target state:** Root label changed to `"首页"`. Breadcrumbs visible on all non-index pages.
**Files modified:** `quartz.config.yaml`.
**Reason:** Design image shows `首页 / 知识库` breadcrumbs on every page.

### Tasks

- [ ] 13.1 **[M]** Add `rootName: "首页"` to breadcrumbs plugin options in `quartz.config.yaml`
- [ ] 13.2 **[M]** Verify breadcrumbs render correctly on hub/topic/resource/content pages
- [ ] 13.3 **[M]** `npx quartz build` — must succeed

---

## Phase 14: Knowledge Hub Page (Frame 02 — Image-faithful)

**Status:** PENDING.
**Current state:** `Hub.tsx` renders HubHero + flat sections via DSL. HubStats exists but is not wired. No tab navigation. No learning map.
**Target state:** Per design Frame 02 — breadcrumbs → title/subtitle → 5-cell stats → tab navigation (学习地图/知识树/核心专题/推荐阅读/图谱概览) → tab content.
**Files modified:** `src/components/Hub.tsx` (rewrite body), new `src/components/hub/HubTabs.tsx`, new `src/components/hub/LearningMap.tsx`, `src/components/hub/CoreTopicsGrid.tsx` (add icon), `src/styles/hub.scss`.
**Reason:** Design image Frame 02 (1:1 fidelity). Knowledge areas are the primary navigation surface.

### Tasks

- [ ] 14.1 **[N]** Create `src/components/hub/HubTabs.tsx` — accessible tab component with `role="tablist"` / `role="tab"` / `role="tabpanel"`, Arrow key navigation, client-side switching
- [ ] 14.2 **[N]** Create `src/components/hub/LearningMap.tsx` — vertical timeline reading `learningPath` from frontmatter `[{ stage, items[] }]`; graceful fallback if no data
- [ ] 14.3 **[M]** Rewrite `src/components/Hub.tsx` body: integrate HubStats + HubTabs with 5 tab panels
- [ ] 14.4 **[M]** `CoreTopicsGrid.tsx`: read `icon` field from child frontmatter, render icon above title
- [ ] 14.5 **[M]** `src/styles/hub.scss`: tab bar styles (horizontal scroll on mobile), timeline styles, icon styles
- [ ] 14.6 **[M]** `content/Knowledge/AI/index.md` frontmatter: add `learningPath` array, `icon`, ensure `type: hub`
- [ ] 14.7 **[M]** `content/Knowledge/Android/index.md` frontmatter: same
- [ ] 14.8 **[M]** `npx quartz build` — must succeed
- [ ] 14.9 **[M]** Screenshots at 1440 / 768 / 390 — verify against design Frame 02

---

## Phase 15: Topic Page (Frame 03 — Image-faithful)

**Status:** PENDING.
**Current state:** `TopicPage.tsx` has 3 tabs (概览/核心文章/相关资源). No breadcrumbs (handled by plugin). No tags row, no stats row, no learning path.
**Target state:** Per design Frame 03 — breadcrumbs → title/subtitle → tags row → stats row → 6 tabs (概览/学习路径/核心文章/工具与资源/相关专题/图谱视图).
**Files modified:** `src/components/TopicPage.tsx` (rewrite), `src/styles/` (topic-specific styles).
**Reason:** Design image Frame 03 (1:1 fidelity).

### Tasks

- [ ] 15.1 **[M]** `TopicPage.tsx`: add tags row rendering from `fm.tags`
- [ ] 15.2 **[M]** `TopicPage.tsx`: add stats row (更新日期 / 笔记数 / 系列数)
- [ ] 15.3 **[M]** `TopicPage.tsx`: rewrite tab system to 6 tabs with accessible tab component
- [ ] 15.4 **[M]** Tab: 概览 — render description + overview content
- [ ] 15.5 **[N]** Tab: 学习路径 — reuse `LearningMap.tsx` from Phase 14
- [ ] 15.6 **[M]** Tab: 核心文章 — article list with title + tags + date per item
- [ ] 15.7 **[N]** Tab: 工具与资源 — render `resources` frontmatter array `[{ title, url, description }]`
- [ ] 15.8 **[N]** Tab: 相关专题 —基于 tags 的关联推荐，graceful fallback
- [ ] 15.9 **[M]** Tab: 图谱视图 — reuse `ScopedGraph` with topic scope
- [ ] 15.10 **[M]** `content/Topics/*.md` frontmatter: add `learningPath`, `resources`, `relatedTopics` where applicable
- [ ] 15.11 **[M]** `npx quartz build` — must succeed
- [ ] 15.12 **[M]** Screenshots at 1440 / 768 / 390 — verify against design Frame 03

---

## Phase 16: Resource Page (Frame 05 — Image-faithful)

**Status:** PENDING.
**Current state:** `ResourcePage.tsx` has filter tabs + sidebar. Resource items use generic `ContentCard` without icons or category labels. No "最近更新" section.
**Target state:** Per design Frame 05 — breadcrumbs → title/subtitle → filter tabs → resource list (icons + category labels) + sidebar → 最近更新 section.
**Files modified:** `src/components/ResourcePage.tsx` (enhance), `src/styles/resource.scss`.
**Reason:** Design image Frame 05 (1:1 fidelity).

### Tasks

- [ ] 16.1 **[M]** `ResourcePage.tsx`: add icon mapping per `resource-type` (📖 书籍 / 🔧 工具 / 🌐 网站 / 📄 论文 / 🎬 视频)
- [ ] 16.2 **[M]** `ResourcePage.tsx`: render `resource-type` as visible category label on each item
- [ ] 16.3 **[N]** `ResourcePage.tsx`: add "最近更新" section at bottom, showing resources sorted by `dates.modified` desc, limit 5
- [ ] 16.4 **[M]** `ResourcePage.tsx`: ensure `data-resource-type` attribute on each card for client-side filtering
- [ ] 16.5 **[M]** `src/styles/resource.scss`: resource item icon styles, category badge styles, "最近更新" section styles
- [ ] 16.6 **[M]** `npx quartz build` — must succeed
- [ ] 16.7 **[M]** Screenshots at 1440 / 768 / 390 — verify against design Frame 05

---

## Phase 17: Mobile + Accessibility for New Components

**Status:** PENDING.
**Current state:** Phases 14-16 add new components without mobile/a11y pass.
**Target state:** All new tab/timeline/list components work at 375/390/430. Tabs keyboard-navigable. Timelines degrade gracefully.
**Files modified:** `src/styles/hub.scss`, `src/styles/resource.scss`, component files.
**Reason:** Principles: mobile-first, accessibility AA.

### Tasks

- [ ] 17.1 **[M]** HubTabs: horizontal scroll on mobile, active tab indicator, Arrow key + Home/End navigation
- [ ] 17.2 **[M]** LearningMap: collapse to simple list on ≤600px (no connecting lines)
- [ ] 17.3 **[M]** TopicPage tabs: same mobile treatment as HubTabs
- [ ] 17.4 **[M]** ResourcePage: single-column on mobile, sidebar below content
- [ ] 17.5 **[M]** All new components: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`
- [ ] 17.6 **[M]** `npx quartz build` — must succeed
- [ ] 17.7 **[M]** Screenshots at 375 / 390 / 430 — verify mobile layout

---

## Summary

| Phase | Focus | Authority | Status |
|---|---|---|---|
| 1 | Audit | (no code) | **DONE** |
| 2 | Theme polish | Principles | **DONE** |
| 3 | Home | Image (CONFLICT flagged) | **DONE** |
| 4 | Hub | Image (CONFLICT flagged) | **MOSTLY DONE** — components created, wiring deferred |
| 5 | Article | Image | **DONE** |
| 6 | Project → Topic rename | Both aligned | **MOSTLY DONE** — nav Chinese, folder renamed, ContentCard CSS added |
| 7 | About | Image + principles copy | **DONE** |
| 8 | Footer | Image + Back to Top | **MOSTLY DONE** — 4-col layout. Mountain motif + Back to Top deferred |
| 9 | Mobile (375/390/430) | Principles | **MOSTLY DONE** — touch targets fixed, responsive CSS verified |
| 10 | Accessibility | Principles | **MOSTLY DONE** — focus rings + reduced-motion done, contrast audit pending |
| 11 | Animation | Principles | **DONE** |
| 12 | Final screenshots | Both | Pending |
| 13 | Breadcrumbs config | Image | Pending |
| 14 | Knowledge Hub page | Image (1:1) | Pending |
| 15 | Topic page | Image (1:1) | Pending |
| 16 | Resource page | Image (1:1) | Pending |
| 17 | Mobile + A11y for new components | Principles | Pending |

**Conflicts surfaced: 4** (Home density, Hub sections, About depth, Footer nav). Image wins in each. User informed.
**Design fidelity gap identified:** Phases 14-16 close the gap between current implementation and design frames 02/03/05.

**Implementation deviations from original plan:**
- Footer: enhanced `BrandFooter.tsx` in place (not replaced with `SiteFooter.tsx`)
- Home: `KnowledgeAreasSection` / `LatestEssaysSection` / `QuoteSection` (not `StatsRow` / `KnowledgeAreaCards` / `QuoteCallout`)
- Topic/Resources: standalone `TopicPage.tsx` / `ResourcePage.tsx` (not Hub DSL extensions)
- Search icon: SVG magnifying glass (not in original tasks)

**Last updated:** 2026-06-27 (post Priority 2 implementation)