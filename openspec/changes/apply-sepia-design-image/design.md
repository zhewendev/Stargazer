## Context

**Background.** Stargazer is a personal digital garden (Quartz 5 + GitHub Pages + Obsidian). The change `reimagine-stargazer-as-digital-garden` (111/115 tasks) is substantively complete — it produced the foundation: sepia palette tokens, `BrandHeader`/`BrandFooter`, `DrawerNav`, `Home`/`Hub` pageTypes, declarative Hub DSL (`cards`/`list`/`compact-list`/`graph`), featured system, status lifecycle, `MetadataPanel`, `ScopedGraph`, hero registry with `Mountain` variant.

**Trigger.** A design image provides a complete visual specification for the site (9 frames: home, knowledge hub, topic, article, resources, knowledge graph, about, footer, plus 375px mobile). The user wants structural 1:1 fidelity with strict data-driven principles (per AGENTS.md: no hardcoded content, plugins not modified directly).

**Audit reality.** `audit.md` and `migration.md` show the design image is **mostly a refinement** of existing work, not a from-scratch rebuild:
- Sepia palette, mountain illustration, brand identity, hero, hub, sidebar — **already exist**
- Missing: LearningTimeline, KnowledgeAreaCards, QuoteCallout, ResourceFilterBar, MasteryGraph wrapper, AboutPrinciples, QuickLinksGrid, contentStats plugin, 4-column footer, mastery frontmatter field, mobile breakpoint verification
- One replace: `BrandFooter` (minimal → 4-column)

**Constraints (AGENTS.md):**
- No hardcoded content; all copy from frontmatter/config
- No direct `.quartz/plugins/` modifications
- Knowledge-First / Content-First / Reading-First
- Long-term maintainability (data-driven > hardcoded)

## Authority Hierarchy (Two-Track)

**Per user clarification (2026-06-26):** This change has TWO authority tracks, not one.

| Track | Authority | Scope |
|---|---|---|
| **Page design** | Design image (1:1 fidelity) | Page layouts, content placement, visual structure |
| **Non-page-design** | User principles (lapis.cafe / veryjack.com inspired) | Theme polish, animation, accessibility, mobile breakpoints, card style density, footer enhancements (Back to Top) |

**Conflict resolution rule:** When the two authorities conflict, the **design image wins**, but I MUST report the conflict (see `principle-alignment.md` for the full conflict table).

**Known conflicts (4 found, image wins in each):**
1. **Home content density** — Image: stats + area cards + quote. Principles: hero-only one-screen. **Image wins** → multi-screen Home.
2. **Hub sections** — Image: 5 sections including learning timeline. Principles: 4 sections (Featured/Growing/Evergreen/Latest). **Image wins** → 5 sections where applicable.
3. **About content depth** — Image: full bio + 4 principles + 4-col links + contact. Principles: concise bio + interests + philosophy + tools. **Image wins (layout)** + principles inform the **copy**.
4. **Footer nav** — Image: 4-column (探索/花园/联系/关于). Principles: nav + Search + RSS + GitHub + Back to Top. **Image wins (columns)** + principles add **Back to Top**.

**Principles win (4 areas, no conflict):**
- Animation: subtle fade/opacity/translateY only (no scale, no bounce)
- Mobile breakpoints: 375 / 390 / 430 (image only specified 375)
- Accessibility: AA contrast, keyboard nav, focus rings, ARIA, reduced-motion
- Card style: lighter shadows, less border density, more spacing

## Goals / Non-Goals

**Goals:**
- **Image-faithful page design** (1:1 to all 9 design frames)
- **Principle-aligned everything else** (calm, breathing space, accessibility, subtle animation)
- Strict data-driven copy (no hardcoded content per AGENTS.md)
- Modify existing components where possible; build only what's genuinely new
- Maintain all current functionality (backlinks, search, graph, SPA)
- Mobile layouts verified at 375 / 390 / 430 px
- AA accessibility across all custom components

**Non-Goals:**
- Pixel-perfect color matching (sepia is a palette, not exact hex)
- New pageTypes beyond what's needed (Topic/Resources fold into Hub DSL)
- Mobile menu redesign (existing drawer pattern works)
- Touch interactions beyond menu/drawer (no swipe, no bottom-sheet)
- Real-time collaboration, comments, auth
- Heavy animations (scale, bounce, parallax)

## Decisions

### 1. Navigation structure — 5 main items, drawer as full nav

**Decision:** Reduce `BrandHeader` main nav to 5 items matching the design image: 知识库 / 专题 / 资源 / 图谱 / 关于. Keep the 7-item full navigation accessible via `DrawerNav` (Home, Knowledge, Projects, Now, Resources, Graph, About).

**Rationale:** Matches design 1:1. The drawer (already exists) serves as the expanded nav surface; current 7-item header is over-busy. Mobile-first design intent.

**Alternatives considered:**
- Keep 7 items in main nav → rejected: doesn't match design
- 5 items everywhere (remove Home/Projects/Now) → rejected: those pages still need to be reachable

### 2. Status vs Mastery — parallel fields

**Decision:** Keep existing `status` (seed/growing/evergreen/complete — article maturity) and ADD `mastery` (已掌握/已记录/相关/未涉及 — knowledge depth). Independent frontmatter fields. Default `mastery` to `已记录` for backwards compatibility.

**Rationale:** Status answers "is this note mature?"; mastery answers "how deep is this note's coverage?". Different concepts. Conflating them loses semantic precision.

**Alternatives considered:**
- Replace status with mastery → rejected: status is established in active change; mastery is new and orthogonal
- Mastery derived from status (mapping) → rejected: not all articles have mastery info; derived mapping is fragile

### 3. Content stats — computed at build time, plugin-based

**Decision:** Implement `contentStats` as a custom Quartz plugin. Compute `{ notes, topics, tags, series, links }` once at build time, expose via component data context. Per-area counts and WikiLink deduplication included.

**Rationale:** Centralized computation; consistent across home and hub; build-time cost amortized. Components don't scan filesystem at render.

**Pattern:** Plugin emits to `ctx.stats` during transform phase; components read via `props`.

**Alternatives considered:**
- Compute per-component → rejected: O(N×M) on every render
- Pre-build JSON → rejected: extra build step, sync issues

### 4. Quote and other "brand voice" copy — data-driven

**Decision:** All "voice" copy (homepage quote, tagline, principles) lives in frontmatter. Components render verbatim with no fallback copy.

**Rationale:** AGENTS.md mandates data-driven. Fallback copy invites drift. If frontmatter is missing, component renders nothing rather than hardcoding.

**Implementation:** `quote` field on `Home/index.md`. `tagline` field on `Home/hero.md` (already supported). `principles` array on `About.md`.

### 5. Mountain SVG — single component, scaled

**Decision:** Reuse existing `Mountain.tsx` at multiple sizes via CSS. No new SVG variants for this change.

**Rationale:** The hero mountain and footer mountain are the same composition at different scales. Adding variants adds maintenance cost without visual benefit. If future variants are needed, the registry pattern (D26) supports drop-in addition.

### 6. Topic and Resources pages — standalone components (revised from Hub DSL)

**Decision (revised):** Topic and Resources are implemented as standalone components (`TopicPage.tsx`, `ResourcePage.tsx`) registered as separate pageTypes in `pageTypeRegistry.ts`, NOT as Hub DSL extensions.

**Rationale:** Simpler implementation. Topic has 3-tab layout with JS filtering. Resource has filter tabs + sidebar. Both have distinct UI patterns that don't fit neatly into Hub's section DSL. Standalone components are easier to maintain and evolve independently.

**Original plan:** Fold into Hub DSL with `timeline` and `related-topics` section types. **Revised:** Standalone pageTypes with dedicated components.

### 7. Footer — enhanced in place (revised from full rewrite)

**Decision (revised):** Enhance `BrandFooter.tsx` in place with 4-column grid layout. NOT replaced with `SiteFooter.tsx`.

**Rationale:** Same 4-column result (探索/花园/联系/关于) with less churn. Mountain motif and Back to Top deferred — mountain only works with full-width footer (user confirmed), Back to Top is a future addition.

**Original plan:** Create `SiteFooter.tsx`, delete `BrandFooter.tsx`. **Revised:** Enhance existing `BrandFooter.tsx`.

### 8. Article sidebar — compose, don't replace

**Decision:** Add new `ArticleSidebar.tsx` that composes existing `MetadataPanel.tsx` + scoped mini-graph + backlinks list. The current `MetadataPanel` becomes the middle zone of the new sidebar. Wire into `quartz.config.yaml` `layout.byPageType.content.right`.

**Rationale:** Each piece exists in some form. The sidebar is a layout wrapper, not a re-implementation.

**Layout:**
```
┌─────────────────────────┐
│ 目录 (from TOC plugin)   │  ← existing
├─────────────────────────┤
│ 本文信息 (MetadataPanel)│  ← existing
├─────────────────────────┤
│ 知识连接                 │  ← NEW zone
│  ├─ 相关图谱 (mini)     │
│  └─ Backlinks list       │
└─────────────────────────┘
```

### 9. Mastery graph — wrap existing ScopedGraph

**Decision:** Create `MasteryGraph.tsx` as a wrapper around existing `ScopedGraph.tsx`. After scope resolution, post-process nodes to apply mastery-based coloring. Filter toggles implemented as client-side component-level state.

**Rationale:** Doesn't modify graph plugin. Coloring is post-process. Filters are React-level state.

### 10. Mobile layouts — CSS-only at 375px breakpoint

**Decision:** Use `@media (max-width: 375px)` with CSS Grid/Flexbox. No JS resize listeners. Touch targets ≥ 44px enforced via utility class.

**Rationale:** Quartz pages are static; CSS-only is sufficient. Single 375px breakpoint matches design's iPhone SE width.

## Resolved Decisions (formerly Open Questions)

- **Q1: Nav count** — 5 items (design) in main nav; full 7-item nav available in drawer.
- **Q2: Stats (128/24/36/18/320+) — current or aspirational?** — Computed at build time from actual content. If computed values don't match design, content additions needed (not hardcoded numbers).
- **Q3: Status vs Mastery** — Parallel fields. See decision 2 above.
- **Q4: Quote — hardcoded?** — Data-driven via `quote` frontmatter on `Home/index.md`.
- **Q5: Single mountain or variants?** — Single `Mountain.tsx` reused at multiple sizes. See decision 5.

## Risks / Trade-offs

- **[Nav reduction breaks deep links]** Users who bookmarked `now` directly still work; nav just doesn't advertise it. → **Mitigation:** Drawer surfaces all 7 items.
- **[Mastery defaults] Existing notes without `mastery` default to `已记录`.** → **Mitigation:** Acceptable; visually distinct from explicit `已掌握` (which becomes a deliberate authoring choice).
- **[Stats accuracy]** Computed values may differ from design's "128/24/36/18/320+". → **Mitigation:** Trust build-time aggregation. Update content rather than hardcoding.
- **[4-column footer on mobile]** May not fit. → **Mitigation:** Stack columns vertically at 375px.
- **[Mini-graph in sidebar]** PixiJS+ D3 init on every article page → bloat. → **Mitigation:** Lazy-load (intersection observer); only init when scrolled into view.
- **[Hub DSL extension] Adding `timeline` section type changes Hub renderer contract.** → **Mitigation:** Validate against existing ALLOWED_TYPES; allow opt-out via `hubHero: false`.

## Migration Plan

This change is **additive + 1 replacement**. `BrandFooter.tsx` is the only component replaced. Everything else refines or extends existing work.

**Phase 1: Foundation (token + frontmatter)**
- Add new frontmatter fields to schema
- Verify token completeness (no new tokens needed; current sepia palette is sufficient)
- Update `Home/hero.md` with new CTAs and tagline

**Phase 2: New components (no dependencies on each other)**
- `LearningTimeline.tsx` (used by Hub + Topic)
- `KnowledgeAreaCard.tsx` + `KnowledgeAreaCards.tsx` (Home)
- `QuoteCallout.tsx` (Home)
- `ResourceFilterBar.tsx` + `ResourceCategorySidebar.tsx` (Resources Hub)
- `MasteryGraph.tsx` (Graph page + Article sidebar)
- `MasteryLegend.tsx` + `MasteryFilter.tsx` (Graph controls)
- `AboutPrinciples.tsx` + `QuickLinksGrid.tsx` (About page)
- `SiteFooter.tsx` (replaces BrandFooter)
- `ArticleSidebar.tsx` (composes MetadataPanel + mini graph + backlinks)

**Phase 3: contentStats plugin**
- Implement plugin
- Wire into `quartz.config.ts`
- Verify on sample home + hub

**Phase 4: Page integration**
- Update `Home/index.md` frontmatter (sections, stats keys, quote)
- Update `Knowledge/Android/index.md` with learning path + tabs
- Update `Resources/index.md` with filter frontmatter
- Update `About.md` with principles + quick links + contacts
- Update `graph.md` with mastery categorization
- Update `Home/hero.md` with new CTAs

**Phase 5: PageType routing**
- Adjust `quartz.config.yaml` to use new components
- Wire `SiteFooter` globally; remove `BrandFooter` reference
- Configure `ArticleSidebar` in content pageType right slot

**Phase 6: Mobile**
- Add `@media (max-width: 375px)` blocks
- Verify all 9 page types at 375px
- Touch target audit

**Phase 7: Verification**
- Build (`npx tsup && npx quartz build`)
- Visual diff against design image (run + verify skills)
- simplify + security-review skill runs
- No-regression check (search, backlinks, graph, SPA navigation)

**Rollback:** Each phase is independent. Reverting a phase removes only that phase's components/changes. The single replacement (`BrandFooter` → `SiteFooter`) reverts to current footer.

## Open Questions

None at this point. All five original open questions resolved above.

Future considerations (not blocking):
- Touch gestures (swipe drawer) — out of scope; click-only acceptable for v1
- Real-time stats refresh on content edit — out of scope; build-time only
- Animated graph transitions on filter — out of scope; instant filter acceptable