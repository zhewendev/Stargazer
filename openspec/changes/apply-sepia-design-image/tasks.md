# Tasks — `apply-sepia-design-image`

**Authority hierarchy:** Page design → design image (1:1). Non-page-design → user principles (calm, breathing space, accessibility, subtle animation). See `principle-alignment.md` for conflicts.

**Tag legend per task:**
- `K` Keep / No change
- `M` Modify existing
- `R` Replace existing
- `N` New component
- `Re` Reuse existing (as-is)

**Phase rules (per user):** Before every phase, explain Current / Target / Files / Reason / Screenshots. Never modify unrelated files. Each phase must compile (`npm run quartz build`). Each phase needs screenshots at 1440 / 768 / 390.

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

**Current state:** `tokens.scss` has sepia palette, spacing scale (4px base), radius/shadow/motion tokens. `typography.scss` has type scale. Cards use shadow + border treatment across components.
**Target state:** Cards lighter (reduced shadow, reduced border, more spacing). Status chip subtle in card contexts. Typography generous (body ≥16px, line-height ≥1.6). Spacing standardized on `--space-*` tokens.
**Files modified:** `src/styles/tokens.scss`, `src/styles/typography.scss`, `src/styles/components.scss`, possibly `src/components/StatusChip.tsx` (add subtle variant).
**Reason:** Principles P5 (breathing space) + P6 (calm — lighter cards).
**Expected screenshots:** home + hub + article before/after at 1440px.

### Tasks

- [ ] 2.1 **[M]** Audit existing card styles; document current shadow/border/spacing values
- [ ] 2.2 **[M]** Reduce card shadow: `--shadow-flat` for default, `--shadow-soft` only on hover
- [ ] 2.3 **[M]** Reduce card border: thin (1px) `--border` color or no border (use spacing for separation)
- [ ] 2.4 **[M]** Increase card padding: minimum `--space-6` (24px) on all sides
- [ ] 2.5 **[M]** Add `subtle` size variant to `StatusChip` for card contexts (lower opacity, smaller)
- [ ] 2.6 **[M]** Verify body typography: ≥16px, line-height ≥1.6
- [ ] 2.7 **[M]** Verify heading scale: h1 > h2 > h3 with adequate contrast in size
- [ ] 2.8 **[M]** Audit spacing usage across components; replace hardcoded values with `--space-*` tokens
- [ ] 2.9 **[K]** Tokens palette unchanged (per user — do NOT redesign colors)
- [ ] 2.10 **[M]** `npx tsup && npx quartz build` — must succeed with no warnings

---

## Phase 3: Home Page (Image-faithful)

**CONFLICT FLAGGED:** Principles say "one-screen hero only." Image says multi-screen with stats + cards + quote. **Image wins per user rule.** Proceeding with image layout.

**Current state:** `Home.tsx` composes Hero + Now + Featured + Projects. `Home/hero.md` provides CTA overrides. `content/index.md` has sectionOrder.
**Target state:** Per design image Frame 01 — Hero (persona + CTAs) → Stats row (128/24/36/18/320+) → 4 knowledge area cards (Android/AI/Automation/Reading) → Quote callout → Footer.
**Files modified:** `content/Home/hero.md`, `content/index.md`, `src/components/Home.tsx`, `src/components/home/SectionShell.tsx`, new components: `StatsRow`, `KnowledgeAreaCard(s)`, `QuoteCallout`.
**Reason:** Design image Frame 01 (1:1 fidelity).
**Expected screenshots:** Home at 1440 / 768 / 390 px.

### Tasks

- [ ] 3.1 **[M]** Update `Home/hero.md` frontmatter: tagline (e.g. "在技术的世界里持续学习, 用知识连接思考, 用实践创造价值"), CTAs ("进入知识库 →", "探索专题")
- [ ] 3.2 **[M]** Update `content/index.md` `sectionOrder`: `[hero, stats, area-cards, quote]` (move Now/Featured/Projects to lower priority or remove for image fidelity)
- [ ] 3.3 **[M]** Update `src/components/Home.tsx` to render new sections: StatsRow, KnowledgeAreaCards, QuoteCallout
- [ ] 3.4 **[M]** Update `src/components/home/SectionShell.tsx` to support new section types
- [ ] 3.5 **[N]** Create `src/components/StatsRow.tsx` — site-wide stats display (consumes contentStats plugin)
- [ ] 3.6 **[N]** Create `src/components/KnowledgeAreaCard.tsx` — single area card with computed count
- [ ] 3.7 **[N]** Create `src/components/KnowledgeAreaCards.tsx` — 4-card grid wrapper
- [ ] 3.8 **[N]** Create `src/components/QuoteCallout.tsx` — data-driven quote display
- [ ] 3.9 **[Re]** Keep existing `home/Hero.tsx` (refine CTAs only via frontmatter)
- [ ] 3.10 **[M]** Decision needed: keep or remove NowSection / FeaturedSection / ProjectsSection on Home? Image doesn't show them. **Default per image: remove from Home sectionOrder; they remain available as components**
- [ ] 3.11 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 3.12 **[M]** Screenshots at 1440 / 768 / 390 — verify against design image

---

## Phase 4: Knowledge Hub Refinement (Image-faithful)

**CONFLICT FLAGGED:** Principles say 4 sections. Image says 5 (incl. learning timeline). **Image wins.** Proceeding with image.

**Current state:** `Hub.tsx` + `hub/sections.tsx` render declarative sections. `Knowledge/Android/index.md` has 3 sections (精选文章, 最新笔记, 生长中).
**Target state:** Per image Frame 02 — Hub hero → 5 sections including learning timeline (学习地图 / 知识讲解 / 核心专题 / 推荐阅读 / 图谱视图).
**Files modified:** `src/components/hub/sections.tsx`, `src/components/hub/HubHero.tsx`, `content/Knowledge/Android/index.md`, `content/Knowledge/AI/index.md`.
**Reason:** Design image Frame 02 (1:1 fidelity).
**Expected screenshots:** Android hub + AI hub at 1440 / 768 / 390 px.

### Tasks

- [ ] 4.1 **[M]** Update `src/components/hub/sections.tsx` to add `timeline` section type (renders `LearningTimeline`)
- [ ] 4.2 **[M]** Update `src/components/hub/sections.tsx` to add `related-topics` section type
- [ ] 4.3 **[M]** Update `Hub.tsx` `ALLOWED_TYPES` to include new types
- [ ] 4.4 **[M]** Update `src/components/hub/HubHero.tsx` to support 3-counter display (笔记 / 工具 / 案例) per design
- [ ] 4.5 **[M]** Update `content/Knowledge/Android/index.md` frontmatter with `learningPath` array and 5 sections matching image
- [ ] 4.6 **[M]** Update `content/Knowledge/AI/index.md` frontmatter similarly
- [ ] 4.7 **[M]** Update other knowledge hub index files (`生活与效率/`, `阅读与思考/`, `自动化与工具/`) with appropriate sections
- [ ] 4.8 **[N]** Create `src/components/LearningTimeline.tsx` — horizontal stepper from `learningPath` frontmatter
- [ ] 4.9 **[N]** Add responsive vertical variant in `LearningTimeline` (≤375px)
- [ ] 4.10 **[Re]** Keep existing `HubHero` core; refine counters only
- [ ] 4.11 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 4.12 **[M]** Screenshots at 1440 / 768 / 390 — verify against design image

---

## Phase 5: Article Refinement (Image-faithful)

**Current state:** Article layout uses default `content` pageType. `quartz.config.yaml` `layout.byPageType.content.right` has `[TOC, Backlinks]`.
**Target state:** Per image Frame 04 — Title → Summary → Metadata → Content → Backlinks → Mini Graph → Footer navigation (Previous/Next).
**Files modified:** `src/components/ArticleMeta.tsx`, new `src/components/ArticleSidebar.tsx`, `quartz.config.yaml`.
**Reason:** Design image Frame 04 (1:1 fidelity). Principles: reading first, metadata second, graph third.
**Expected screenshots:** Article page at 1440 / 768 / 390 px.

### Tasks

- [ ] 5.1 **[N]** Create `src/components/ArticleSidebar.tsx` — composes TOC + MetadataPanel + mini-graph + backlinks + prev/next
- [ ] 5.2 **[Re]** Reuse existing `MetadataPanel.tsx` as middle zone (本文信息)
- [ ] 5.3 **[Re]** Reuse table-of-contents plugin output as top zone (目录)
- [ ] 5.4 **[Re]** Reuse backlinks plugin output as list within 知识连接 zone
- [ ] 5.5 **[Re]** Reuse `ScopedGraph.tsx` for mini graph (depth=1, smaller height ~200px)
- [ ] 5.6 **[N]** Add previous/next navigation component (or use existing if available)
- [ ] 5.7 **[M]** Update `quartz.config.yaml` `layout.byPageType.content.right` to use `ArticleSidebar`
- [ ] 5.8 **[M]** Verify article layout: title at top, summary below, content in main column, sidebar on right
- [ ] 5.9 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 5.10 **[M]** Screenshots at 1440 / 768 / 390 — verify against design image

---

## Phase 6: Rename Project → Topic

**Current state:** `BrandHeader` and `DrawerNav` use "项目" (Projects) label. `content/Projects/index.md` exists.
**Target state:** Label "项目" → "专题" (Topic) in nav. Image uses "专题" already.
**Files modified:** `src/components/BrandHeader.tsx`, `src/components/DrawerNav.tsx`, possibly `content/Projects/index.md` (title).
**Reason:** Principles: "Topics are long-term knowledge collections, not software projects." Image also uses 专题.
**Expected screenshots:** Header nav at 1440 / 768 / 390 px.

### Tasks

- [ ] 6.1 **[M]** `BrandHeader.tsx`: change `{ key: "projects", label: "项目", href: "/projects" }` → label "专题"
- [ ] 6.2 **[M]** `DrawerNav.tsx`: same change
- [ ] 6.3 **[M]** `content/Projects/index.md`: update `title` from "项目" to "专题" if needed
- [ ] 6.4 **[K]** Folder name `Projects/` stays (folder names not surfaced)
- [ ] 6.5 **[M]** Verify nav order: 知识库 / 专题 / 资源 / 图谱 / 关于 (5 items)
- [ ] 6.6 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 6.7 **[M]** Screenshots at 1440 / 768 / 390 — verify nav labels

---

## Phase 7: About Page (Image layout + Principle-aligned copy)

**CONFLICT FLAGGED:** Principles say concise (no resume). Image shows full bio + 4 principles + 4-col links + contact. **Image wins for layout; principles inform the copy.**

**Current state:** `content/About.md` has prose sections (关于我 / 关于这座花园 / 花园原则 / 联系).
**Target state:** Per image Frame 07 — bio + 4 principles (Seed/Growing/Evergreen/Complete) + 4-column quick links grid + contact section. Copy: concise (per principles).
**Files modified:** `content/About.md`, `src/components/` (new: `AboutPrinciples`, `QuickLinksGrid`).
**Reason:** Design image Frame 07 (layout). Principles: less personal info, more philosophy/tools.
**Expected screenshots:** About at 1440 / 768 / 390 px.

### Tasks

- [ ] 7.1 **[M]** Update `content/About.md` frontmatter with `principles`, `quickLinks`, `contacts` arrays (per design)
- [ ] 7.2 **[M]** Rewrite About copy per principles: concise (no career timeline, no learning history)
- [ ] 7.3 **[N]** Create `src/components/AboutPrinciples.tsx` — 4 principles display with stage icons
- [ ] 7.4 **[N]** Create `src/components/QuickLinksGrid.tsx` — 4-column link grid
- [ ] 7.5 **[M]** Wire `AboutPrinciples` and `QuickLinksGrid` into About page layout
- [ ] 7.6 **[Re]** Keep existing About page prose structure; refine copy only
- [ ] 7.7 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 7.8 **[M]** Screenshots at 1440 / 768 / 390 — verify layout matches image, copy is principle-aligned

---

## Phase 8: Footer Refinement (Image-faithful + Back to Top from principles)

**Current state:** `BrandFooter.tsx` is single-row socials + credit.
**Target state:** Per image Frame 08 — 4-column footer (探索 / 花园 / 联系 / 关于) + mountain motif. Per principles — add **Back to Top** anchor.
**Files modified:** Replace `BrandFooter.tsx` with `SiteFooter.tsx`; update `quartz.config.yaml`.
**Reason:** Design image Frame 08 (4 columns). Principles add Back to Top.
**Expected screenshots:** Footer at 1440 / 768 / 390 px.

### Tasks

- [ ] 8.1 **[R]** Create `src/components/SiteFooter.tsx` — 4-column layout (探索 / 花园 / 联系 / 关于)
- [ ] 8.2 **[N]** Add mountain motif decoration in `SiteFooter.tsx` (reuse `Mountain.tsx` SVG at smaller size)
- [ ] 8.3 **[M]** Migrate `BrandFooter.tsx` socials (GitHub/Email/RSS) into 联系 column
- [ ] 8.4 **[M]** Update `quartz.config.yaml` to use `SiteFooter` instead of `BrandFooter`
- [ ] 8.5 **[M]** Move brand credit line (© year 温哲 · Stargazer) to new footer
- [ ] 8.6 **[N]** Add "Back to Top" anchor link in footer (principles addition)
- [ ] 8.7 **[X]** Delete `src/components/BrandFooter.tsx` (after wiring verified)
- [ ] 8.8 **[M]** Verify footer renders on every pageType (home, hub, content, graph, about, tag, folder)
- [ ] 8.9 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 8.10 **[M]** Screenshots at 1440 / 768 / 390 — verify footer matches image

---

## Phase 9: Mobile Polish (Principles — 375 / 390 / 430)

**Current state:** `DrawerNav` exists. Mobile media queries exist in some component CSS.
**Target state:** All pages work cleanly at 375 / 390 / 430 px. Cards single-column. Footer collapses to single column. Touch targets ≥44×44px.
**Files modified:** `src/styles/components.scss`, component-specific CSS, possibly `src/components/LearningTimeline.tsx` (vertical variant).
**Reason:** Principles: mobile first, multiple breakpoints, graceful footer collapse, single-column cards.
**Expected screenshots:** All page types at 375 / 390 / 430 px.

### Tasks

- [ ] 9.1 **[M]** Audit all custom components for 375 / 390 / 430 px behavior
- [ ] 9.2 **[M]** Add `@media (max-width: 430px)` and `@media (max-width: 390px)` and `@media (max-width: 375px)` blocks as needed
- [ ] 9.3 **[M]** Collapse `KnowledgeAreaCards` grid to single column on mobile
- [ ] 9.4 **[M]** Collapse hub core topics grid to single column on mobile
- [ ] 9.5 **[M]** Stack `ArticleSidebar` below article body on mobile (≤430px)
- [ ] 9.6 **[M]** Stack 4-column `SiteFooter` to single column on mobile (≤430px)
- [ ] 9.7 **[M]** Verify hamburger menu visible at 430 / 390 / 375 px
- [ ] 9.8 **[M]** Apply mobile typography scale: h1 ≤28px, h2 ≤22px, h3 ≤18px, body ≥16px
- [ ] 9.9 **[M]** Audit all interactive elements for ≥44×44px touch targets
- [ ] 9.10 **[M]** Verify `LearningTimeline` switches to vertical layout at 375 / 390 / 430 px
- [ ] 9.11 **[M]** Verify `SiteFooter` mountain motif scales appropriately
- [ ] 9.12 **[M]** `npx tsup && npx quartz build` — must succeed
- [ ] 9.13 **[M]** Screenshots at 375 / 390 / 430 for all page types — verify against design

---

## Phase 10: Accessibility (Principles — AA)

**Current state:** Some components have ARIA labels (drawer, MetadataPanel); keyboard nav exists in drawer; `prefers-reduced-motion` is in `tokens.scss`.
**Target state:** AA contrast everywhere. Keyboard nav complete. Visible focus rings. ARIA labels on all interactive elements. `prefers-reduced-motion` guards on all animations.
**Files modified:** all components (audit), `src/styles/tokens.scss` (focus ring), possibly new utility classes.
**Reason:** Principles: AA contrast, keyboard navigation, focus ring, reduced motion support, ARIA labels.
**Expected screenshots:** N/A (functional verification — keyboard tab through pages).

### Tasks

- [ ] 10.1 **[M]** Audit all text/background combinations for AA contrast (use DevTools or axe)
- [ ] 10.2 **[M]** Add visible focus rings: `outline: 2px solid var(--accent-primary); outline-offset: 2px;` on all `:focus-visible`
- [ ] 10.3 **[M]** Audit keyboard navigation: every interactive element reachable via Tab
- [ ] 10.4 **[M]** Add ARIA labels to all icon-only buttons (search, drawer trigger, back to top, etc.)
- [ ] 10.5 **[M]** Verify `prefers-reduced-motion` disables all transitions/animations
- [ ] 10.6 **[M]** Audit semantic HTML: heading hierarchy (no skipped levels), landmark roles
- [ ] 10.7 **[M]** Run automated audit (axe DevTools or Lighthouse Accessibility)
- [ ] 10.8 **[M]** Fix any flagged issues
- [ ] 10.9 **[M]** `npx tsup && npx quartz build` — must succeed

---

## Phase 11: Animation Polish (Principles — Subtle Only)

**Current state:** Motion tokens exist (`--motion-fast/base/slow`). Some components have transitions.
**Target state:** All animations use only fade / opacity / translateY. No scale, no bounce. All respect `prefers-reduced-motion`.
**Files modified:** all component CSS, `src/styles/tokens.scss`.
**Reason:** Principles: subtle animation only.
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

## Summary

| Phase | Focus | Authority | Status |
|---|---|---|---|
| 1 | Audit | (no code) | **DONE** |
| 2 | Theme polish | Principles | Pending approval |
| 3 | Home | Image (CONFLICT flagged) | Pending approval |
| 4 | Hub | Image (CONFLICT flagged) | Pending approval |
| 5 | Article | Image | Pending approval |
| 6 | Project → Topic rename | Both aligned | Pending approval |
| 7 | About | Image + principles copy | Pending approval |
| 8 | Footer | Image + Back to Top | Pending approval |
| 9 | Mobile (375/390/430) | Principles | Pending approval |
| 10 | Accessibility | Principles | Pending approval |
| 11 | Animation | Principles | Pending approval |
| 12 | Final screenshots | Both | Pending approval |

**Conflicts surfaced: 4** (Home density, Hub sections, About depth, Footer nav). Image wins in each. User informed.

**Awaiting audit approval before Phase 2.**