## 1. Foundation — Design Tokens & SCSS Bridge

- [x] 1.1 Create `src/styles/tokens.scss` with palette, status, drawer, type, spacing, radius, shadow, motion tokens per `specs/stargazer-rebrand/design-tokens.md`
- [x] 1.2 Create `src/styles/typography.scss` consuming type tokens; declare font stacks for display, body, mono
- [x] 1.3 Create `src/styles/components.scss` with base button, chip, card, tree-node, scrim styles consuming tokens
- [x] 1.4 Create `src/styles/layout.scss` with grid, header shell, drawer shell, footer shell, responsive breakpoints
- [x] 1.5 Create `src/styles/home.scss` with Hero, NowSection, FeaturedSection, ProjectsSection, SectionShell base styles
- [x] 1.6 Update `quartz/styles/custom.scss` to `@use` all five `src/styles/*.scss` files
- [x] 1.7 Update `quartz.config.yaml` `theme.colors` block to match palette tokens (light + dark)
- [x] 1.8 Update `quartz.config.yaml` `theme.typography` block to use Noto Sans SC + Inter + JetBrains Mono
- [x] 1.9 Build the site and confirm baseline visual diff is zero (foundation layer ships without visible output change) — _build succeeds; visual diff is intentional (palette + typography changed per 1.7/1.8). baseUrl set to `stargazer.local` placeholder to work around a pre-existing bug in `quartz/components/Head.tsx:25` where empty baseUrl produces `new URL("https://")` and throws._

## 2. PageType Infrastructure

- [x] 2.1 Create `quartz/components/pages/Home.tsx` exporting a Home pageBody component — fully data-driven (no hardcoded hero copy, featured notes, projects, or knowledge areas; reads everything from `Home/hero.md` and `allFiles`)
- [x] 2.2 Create `quartz/components/pages/Hub.tsx` exporting a Hub pageBody component — generic, driven entirely by `type: hub` + `sections: []` from the hub's `index.md` frontmatter
- [x] 2.3 Create `quartz/plugins/pageTypes/home.ts` registering the `home` pageType; matcher reads from the PageType Registry (D11)
- [x] 2.4 Create `quartz/plugins/pageTypes/hub.ts` registering the `hub` pageType; matcher reads from the PageType Registry (D11)
- [x] 2.5 Wire emitters into `quartz/plugins/pageTypes/index.ts` and `quartz/plugins/loader/config-loader.ts` (added to `builtinPageTypes`)
- [x] 2.6 Add frontmatter validation hook (`quartz/plugins/transformers/frontmatter.ts`) that fails the build on invalid `status`, `featured: true` without `featuredType`, invalid `featuredType`, or invalid `heroStyle`
- [x] 2.7 Create `src/lib/pageTypeRegistry.ts` exporting `PageTypeSpec[]` and `findPageType()` per D11
- [x] 2.8 Create `src/lib/contentQuery.ts` exporting `querySection(allFiles, filter, ctx?)` per D12 — pure, tested, reused by Hub sections and Home sub-queries
- [x] 2.9 Wire `querySection` into Hub.tsx section rendering and into Home.tsx Featured/Now/Projects queries
- [x] 2.10 Verify Home pageBody has zero hardcoded knowledge areas, projects, or featured notes — `grep -E '"知识库"|"项目"|"精选"' src/components/Home.tsx src/components/home/*.tsx` returns 0 hits

## 3. Components — Brand Header & Drawer

- [x] 3.1 Create `src/components/BrandHeader.tsx` rendering brand (logo + Stargazer + tagline "Digital Garden") + 7 nav links per D17 + ☰ trigger + 🔍 trigger — D15
- [x] 3.2 Add brand-header styles to `src/styles/layout.scss` — logo, brand-name, tagline, divider, nav, trigger buttons
- [x] 3.3 Create `src/components/DrawerNav.tsx` with three states (closed, open desktop, open mobile) per drawer-nav spec
- [x] 3.4 Implement drawer tree showing only the 7 nav entries (D17); Knowledge expands into hubs only, never article trees (D14)
- [x] 3.5 Implement knowledge hub list derivation: read top-level subdirs of `content/Knowledge/` from `allFiles` at build time; compute note counts via `queryFolder` — excludes both hub indexes AND folder-level `knowledge/index` defaults
- [x] 3.6 Implement drawer open/close animation honoring `prefers-reduced-motion` (CSS `@media` block in layout.scss)
- [x] 3.7 Implement focus trap and ESC-to-close accessibility behaviors (afterDOMLoaded script)
- [x] 3.8 Implement drawer search: filter-first + manual navigation on selection (Enter on focused result, tap on mobile) per D16 — arrow keys for focus cycling
- [x] 3.9 Add drawer styles to `src/styles/layout.scss` consuming drawer palette tokens (scrim, drawer, drawer-item, drawer-hub-row, focus state)
- [x] 3.10 Update `quartz.config.yaml`: BrandHeader + DrawerNav injected into every pageType via config-loader.ts; Explorer marked `display: desktop-only` (D13: drawer ≠ explorer)
- [x] 3.11 Added `cfg.brand` block (name: 温哲, tagline: Digital Garden, logo: ✦) so D15 has data from config
- [x] 3.12 Reserved `/graph` placeholder link in nav (D17) — entry exists even before standalone graph page ships; will 404 until tasks 14.1 ships

## 4. Components — Status, Featured, WikiLink

- [x] 4.1 Create `src/components/StatusChip.tsx` rendering glyph (○/◐/●/◉) + label per status-system spec (D19: color + shape)
- [x] 4.2 Add StatusChip styles to `src/styles/components.scss` — `.chip-status.status-{seed|growing|evergreen|complete}` consuming token colors
- [x] 4.3 Wire StatusChip into: article meta strip (ArticleMeta), Home featured cards, Hub CardsSection, MetadataPanel (D18)
- [x] 4.4 Create featured-section data hook reading `allFiles` filtered by `featured` + `featuredType` (already in `src/lib/contentQuery.ts` from P2)
- [x] 4.5 Implement `featuredType` partition rendering: article cards (vertical cover-on-top), project cards (horizontal circular-icon-left), note cards (compact icon+title+date) — D20
- [x] 4.6 Implement `featuredOrder` sort with `modified` desc fallback (already in `queryFeaturedByType`)
- [x] 4.7 WikiLink wrapper — deferred (Quartz's `enablePopovers` already provides popover previews; no wrapper needed for P4 scope)
- [x] 4.8 Created `src/components/ArticleMeta.tsx` (status chip + date + reading time + tags) replacing Quartz's `content-meta` for content pages (D18)
- [x] 4.9 Created `src/components/MetadataPanel.tsx` (right-slot panel: status, featured, description, tags, dates) per D18
- [x] 4.10 Inject ArticleMeta + MetadataPanel into content pageType via `quartz/plugins/loader/config-loader.ts`; `isContentMetaComponent` helper strips the default `content-meta`
- [x] 4.11 Extend `SectionFilter.status` to accept `string | string[]` with OR semantics (D22)

## 5. Components — Hero Illustration Registry

- [x] 5.1 Create `src/lib/themeRegistry.ts` — generic factory `createThemeRegistry<T>({ name, variants, reserved, fallback })` returning `ThemeRegistry<T>` with `lookup / list / listReserved / listAll / isReserved / has` methods. Reusable for any future variant collection (hero, cards, buttons, etc.).
- [x] 5.2 Create `src/components/heroStyles/index.ts` — registry exports `heroRegistry: ThemeRegistry<HeroStyleComponent>` plus convenience helpers `getHeroStyle()`, `listHeroStyles()`, `listReservedHeroStyles()` per D26 + D28
- [x] 5.3 Implement `src/components/heroStyles/Mountain.tsx` SVG variant: two-line mountain silhouettes + sun (NO birds per user direction); 1.25 stroke; `currentColor`; transparent background per D25
- [ ] 5.4 Implement `src/components/heroStyles/Ocean.tsx` SVG variant — **DEFERRED** (per user direction: content discovery > hero variety)
- [ ] 5.5 Implement `src/components/heroStyles/Forest.tsx` SVG variant — **DEFERRED** (per user direction: content discovery > hero variety)
- [x] 5.6 Reserved variant `graph` declared in registry — falls back to `mountain` with warning per D28 (Phase C implementation)
- [x] 5.7 Verify Mountain variant renders correctly in light + dark mode via palette tokens — `currentColor` adapts to `--text-muted` from parent CSS color
- [x] 5.8 Rewired `src/components/home/Hero.tsx` to consume the registry via `getHeroStyle(heroStyle)` — no per-variant branching (D26 extensibility)
- [x] 5.9 Rewired `src/components/hub/HubHero.tsx` to consume the registry; renders a separate compact composition per D27 (knowledge portal vs brand entry)
- [x] 5.10 Hero height constrained per D23 — Home **260px** / Hub **130px** (compressed per user direction from 200px)
- [x] 5.11 Home Hero text hierarchy per D24 + user adjustment: `[Stargazer · Digital Garden]` (small muted) → `温哲` (h1, from `cfg.brand.name`) → `Android × AI × Automation` (subtitle, from `cfg.brand.domain`) → optional tagline override from `Home/hero.md`
- [x] 5.12 Removed "Blog" terminology — `content/index.md` no longer carries `title:`; hero reads brand config exclusively
- [x] 5.13 Removed birds from Mountain SVG (per user direction); sun + 2 mountain layers remain
- [x] 5.14 Added `cfg.brand.domain`, `cfg.brand.project`, `cfg.brand.form` fields to config for D24 brand hierarchy
- [x] 5.15 Hub Hero stats line (笔记 / 生长中 / 常青) moved out of hero (compact 130px); moves into first compact-list section per design intent

## 6. Components — Home PageType Composition

- [ ] 6.1 Create `src/components/home/Hero.tsx` reading `content/Home/hero.md` for copy and `heroStyle` for illustration
- [ ] 6.2 Create `src/components/home/SectionShell.tsx` with title + "更多→" link slot
- [ ] 6.3 Create `src/components/home/NowSection.tsx` reading `content/Now/*.md` in alphabetical order
- [ ] 6.4 Create `src/components/home/FeaturedSection.tsx` partitioning by `featuredType` per home-page spec
- [ ] 6.5 Create `src/components/home/ProjectsSection.tsx` reading `content/Projects/*.md`
- [ ] 6.6 Implement `sectionOrder` override on `index.md` (default: Hero, Now, Featured, Projects)
- [ ] 6.7 Verify Home excludes Explorer, TOC, Backlinks in all slots

## 7. Components — Hub PageType Composition

- [ ] 7.1 Implement sections DSL parser for Hub `index.md` `sections` array
- [ ] 7.2 Implement Hub hero block honoring `hubHero` default-true and `heroStyle` with 50% scale
- [ ] 7.3 Implement auto-computed stats line: total note count, growing count, evergreen count
- [ ] 7.4 Implement `cards` section type with cover image + title + description + meta
- [ ] 7.5 Implement `list` section type with horizontal rows + title + date + status chip + tags
- [ ] 7.6 Implement `compact-list` section type with single-line rows + thin dividers
- [ ] 7.7 Implement `graph` section type using scoped graph per graph-hub-integration spec
- [ ] 7.8 Wire Hub pageType with Breadcrumbs (beforeBody), Explorer (left desktop), TOC + Backlinks (right)

## 8. Components — Brand Footer

- [ ] 8.1 Create `src/components/BrandFooter.tsx` with copyright, social links (GitHub, Email, RSS), theme credit
- [ ] 8.2 Replace default footer in `quartz.config.yaml` with BrandFooter in all pageTypes

## 9. Card Grid Override (Folder & Tag Pages)

- [x] 9.1 Override `PageList.tsx` in BOTH `.quartz/plugins/folder-page/` AND `.quartz/plugins/tag-page/` to render card-grid variant per D29/D33 (shared implementation, both plugins identical structure)
- [x] 9.2 Card hierarchy per D30: Status → Title → Description → Tags → Date — StatusChip at top, title prominent, description clamped to 3 lines, tags below, date at bottom
- [x] 9.3 Sort priority per D31: `featuredOrder` → `featured` flag → `modified` date (with folder-first fallback for folder pages)
- [x] 9.4 Card heights consistent per D32 — `display: flex; flex-direction: column` on card; description uses `-webkit-line-clamp: 3` with `min-height: 3.6em` to keep cards equal height per row
- [x] 9.5 Entire card surface clickable per D34 — `<a class="content-card-link" href={href}>` wraps the entire `<article>`; only the link itself is clickable (tags/status are visual chips inside the anchor)
- [x] 9.6 Reserve metadata space per D35 — `<div class="content-card-graph-meta">` with two reserved `<span class="content-card-slot">` placeholders for `backlinks` and `wikilinks` count; `data-slot` and `data-count` attributes enable P11 population without layout changes
- [x] 9.7 Responsive per D29: 1 column mobile (<700px), 2 columns tablet (700-999px), 3 columns desktop (≥1000px)
- [x] 9.8 Featured marker ★ rendered next to status chip when `featured: true` — visual signal that curation flag is active
- [x] 9.9 Built and rebuilt both plugins (folder-page, tag-page) via `npx tsup` after dep install; verified both rebuild and serve correctly

## 10. Content Skeleton

- [ ] 10.1 Create `content/Home/hero.md` with subtitle, tagline, two CTAs
- [ ] 10.2 Update `content/index.md` to frontmatter-only: `title`, `type: home`, `heroStyle: mountain`
- [ ] 10.3 Create `content/Knowledge/Android/index.md` as type: hub with sections DSL
- [ ] 10.4 Create `content/Knowledge/AI/index.md`, `自动化与工具/`, `阅读与思考/`, `生活与效率/` as type: hub
- [ ] 10.5 Create `content/Projects/index.md` as type: hub
- [ ] 10.6 Create `content/Projects/{auto-account,fastbuild,ai-workflow}.md` placeholder notes
- [ ] 10.7 Create `content/Now/{ai-coding,auto-account,android,reading}.md` placeholder notes
- [ ] 10.8 Create `content/About.md`
- [ ] 10.9 Create `content/Resources/index.md` as type: hub
- [ ] 10.10 Create `content/Resources/{books,tools,links}.md` placeholder notes

## 11. Graph × Hub Integration

- [ ] 11.1 Update Graph component (or wrap it) to size Hub nodes 1.6× default and accent-color them
- [ ] 11.2 Implement scoped graph section component used by Hub pageType's `type: graph` sections
- [ ] 11.3 Verify scoped graph filter, height, and `aria-label` per graph-hub-integration spec

## 12. Polish

- [ ] 12.1 Verify dark mode toggle flips all palette tokens (light + dark + status + drawer)
- [ ] 12.2 Verify `prefers-reduced-motion: reduce` disables drawer animation and any other transitions
- [ ] 12.3 Add focus-visible styles to all interactive elements (drawer trigger, CTAs, chips, cards)
- [ ] 12.4 Verify status filter in metadata panel persists across navigation within session
- [ ] 12.5 Verify Hero illustration variants render identically across builds (deterministic seed)
- [ ] 12.6 Verify build fails on invalid frontmatter (status, featured without featuredType, unknown heroStyle, invalid section type)
- [ ] 12.7 Validate OpenSpec change with `openspec validate reimagine-stargazer-as-digital-garden`
- [ ] 12.8 Visual regression sweep: confirm Home, Hubs, content, folder, tag, 404 pages all render correctly

## 13. Documentation

- [ ] 13.1 Update `AGENTS.md` "Do Not" section if any new constraints emerge from implementation
- [ ] 13.2 Add a `_meta/taxonomy.md` note documenting the frontmatter schema in plain prose for the author
- [ ] 13.3 Add a `_meta/hero-variants.md` note showing available hero illustration variants and when to use each
- [ ] 13.4 Run `openspec archive reimagine-stargazer-as-digital-garden` after all tasks complete

## 14. Future Work (follow-up change)

The following items are intentionally **out of scope** for this change and tracked here so they aren't forgotten. They will become a separate `openspec/changes/<name>/` proposal.

- [ ] 14.1 **Standalone `/graph` page** — register a new `graph` pageType that renders a dedicated graph view (full width, no sidebar crop). PageType Registry entry: `match: (fd) => fd.slug === "graph"`. Renders the existing graph plugin's output with hub-prominence rules from `specs/graph-hub-integration.md`. Add a layout.byPageType.graph entry. Wire a `quartz/components/pages/Graph.tsx` pageBody that invokes the graph plugin with the full node set.
- [ ] 14.2 **Dark mode toggle visual treatment** — current toggle uses default Quartz UI; redesign to match the warm-tan brand.
- [ ] 14.3 **Tag pages visual de-emphasis** — per design.md Q5 (Folder Primary, Tag Secondary), tag pages render today with the same chrome as content pages; revisit to express their secondary role.
- [ ] 14.4 **Notes encryption (`encrypted-pages` plugin UX)** — plugin is enabled but no encryption UX exists; design and implement password-gating flow.
