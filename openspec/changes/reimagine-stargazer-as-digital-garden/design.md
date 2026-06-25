## Context

Stargazer is a personal digital garden built on Quartz 5, GitHub Pages, and Obsidian. The repository currently ships with the default Quartz configuration, the bundled `quartz-themes` plugin at the `default` theme, a single placeholder page (`content/index.md`), and no custom visual or structural identity. The `AGENTS.md` mandates a knowledge-first, evergreen, hub-driven garden with hard rules against hardcoded content and folder-only navigation.

Reference design sources:
- **lapis.cafe** — homepage layout, hero composition, card density, whitespace, palette (`#F7F6F2`, `#EDE7DF`, `#C9A97E`, `#333333`, `#686868`).
- **veryjack.com** — drawer navigation pattern (slide-out, full-height, dark surface, hierarchical tree). Interpreted, not copied.

Constraints driving design choices:
- Quartz 5 pageType system (`renderPage.tsx`) composes `head / header / beforeBody / pageBody / afterBody / left / right / footer` slots. New pageTypes must register an emitter and a matcher.
- The Obsidian vault at `content/` must remain the single source of truth for content. Code changes cannot be required to author a new note.
- `AGENTS.md` forbids deleting content, breaking backlinks, breaking the graph, breaking search, and renaming files automatically.

## Goals / Non-Goals

**Goals**
- Establish a warm, generous, lapis-cafe-inspired visual system expressed entirely through SCSS tokens and minimal Quartz config edits.
- Deliver a data-driven Home page whose every section (Hero copy, Featured articles, Now tracks, Projects) is sourced from markdown content + frontmatter.
- Deliver a declarative Hub pageType so every major knowledge area can define its own sections, hero, and scoped graph without code.
- Introduce a status lifecycle (`seed | growing | evergreen | complete`) and a featured system (`featured` + `featuredType`) that auto-partition content across Home and Hub views.
- Build a pluggable Hero illustration registry so visual style can evolve via frontmatter, not code.
- Build a drawer navigation that respects the VeryJack pattern (full-height slide-out, dark surface, hierarchical tree) without copying its structure, while preserving Explorer on desktop.
- Keep all custom work under `src/` so `quartz/` updates do not clobber brand work.

**Non-Goals**
- No comment system, no analytics beyond what is already configured (Plausible).
- No dark-mode rework beyond the token system (warm dark variant is in scope; Quartz default toggle stays).
- No migration of legacy notes; `content/` currently holds only `index.md`.
- No i18n / language toggle; site is Chinese-first with mixed-language notes acceptable.
- No custom Domain / hosting changes; deployment remains GitHub Pages.

## Decisions

### D1. Custom layer in `src/`, bridged via `quartz/styles/custom.scss`

**Choice.** Place all new SCSS in `src/styles/{tokens,typography,components,layout,home}.scss` and all new TSX in `src/components/`. `quartz/styles/custom.scss` `@use`s the five SCSS files. New components are imported by `quartz/components/index.ts` and referenced by `quartz.config.yaml` layout slots.

**Why.** Quartz 5 is cloned into `quartz/` and may be regenerated on framework updates. Keeping brand work outside `quartz/` survives such updates. The five-file SCSS split mirrors industry conventions (tokens → typography → components → layout → page) and lets each layer be reasoned about independently.

**Alternatives considered.**
- _Single `custom.scss` blob_ — rejected: AGENTS.md says maintainability is long-term; split enables per-layer review.
- _`quartz-themes` plugin prebuilt theme_ — rejected: limited palette/typography fit; Lapis Cafe warmth is bespoke.

### D2. New pageTypes registered via emitters

**Choice.** Create `quartz/components/pages/Home.tsx` and `quartz/components/pages/Hub.tsx`. Register emitters `quartz/plugins/emitters/home.ts` and `hub.ts` that match on `fileData.frontmatter?.type` (`home` for `index.md`, `hub` for any folder `index.md` with `type: hub`).

**Why.** Quartz's pageType matcher (`plugins/pageTypes/matchers.ts`) is the canonical extension point. A custom pageType lets us bypass the default `content` page layout for the home and produce arbitrary JSX composition. Hub pages share the same pageType code path but differ in the `index.md` frontmatter that drives them.

**Alternatives considered.**
- _Embed everything in `index.md` via HTML/transclusion_ — rejected: fragile, mixes markdown with JSX, breaks Obsidian live preview.
- _Override `folder-page` only_ — insufficient for Home; Hub-specific frontmatter DSL needs its own pageType.

### D3. Frontmatter schema as the single contract

**Choice.** Define a unified frontmatter schema in `specs/frontmatter-schema/` covering every new field. The schema is consumed by the Hub pageType (sections DSL), the Home pageType (frontmatter lookups on `index.md` and `Home/hero.md`), the FeaturedSystem (filter logic), the StatusSystem (chip rendering + filter), the HeroIllustration registry (variant lookup), and the Graph component (node prominence rules).

**Why.** AGENTS.md mandates "everything from frontmatter or content." The schema is the boundary between authoring (Obsidian + markdown) and rendering (Quartz + TSX). A single source of truth for field names prevents drift between components.

**Alternatives considered.**
- _Each component owns its own field set_ — rejected: leads to inconsistent naming and ad-hoc conventions.

### D4. Drawer + Explorer coexistence, not replacement

**Choice.** `DrawerNav` is a new component positioned in the `header` slot and wrapped in `MobileOnly`. `Explorer` remains enabled but its layout `display` is set to `desktop-only` so it disappears on small viewports. On desktop, the "知识库" link in `BrandHeader` doubles as a drawer trigger (chevron icon). On mobile, the ☰ icon triggers the drawer.

**Why.** AGENTS.md "Folder structure should never be the only navigation method" implies the drawer must exist. Power users on desktop benefit from a persistent Explorer for deep tree traversal. Mobile users need a focused nav surface, not a sidebar.

**Alternatives considered.**
- _Drawer replaces Explorer entirely_ — rejected: loses desktop outliner value.
- _Drawer only on mobile, no desktop trigger_ — rejected: under-uses the brand-defining pattern.

### D5. Featured system partitions by `featuredType`

**Choice.** A note opts into featuring via `featured: true` and declares its category via `featuredType: article | project | note`. `featuredOrder: number` provides explicit sort. Home and Hub sections query `allFiles` with these filters and render auto-partitioned grids. The third bucket is labeled "精选笔记" in the UI to keep schema and display labels distinct.

**Why.** AGENTS.md mandates data-driven cards. Without partitioning, all featured items collapse into one bucket, mixing projects with articles. `featuredType` lets the same note be in its knowledge folder AND featured on home AND featured on its hub, without duplication.

**Alternatives considered.**
- _Tag-based (`tags: [featured-article, featured-project]`)_ — rejected: scatters the convention across tag names; no schema enforcement.
- _Folder-based (`_featured/articles/`)_ — rejected: forces relocation, breaks the "stay in your knowledge tree" principle.

### D6. Hero illustration as a pluggable registry

**Choice.** `src/components/heroStyles/index.ts` exports a registry `{ mountain: MountainSVG, ocean: OceanSVG, forest: ForestSVG, … }`. `Hero.tsx` looks up the registry by `fileData.frontmatter?.heroStyle ?? 'mountain'`. New variants are added by dropping a new module into `heroStyles/` and registering it.

**Why.** AGENTS.md mandates data-driven content. Hardcoding one illustration prevents evolution. A registry is a 30-line abstraction that costs nothing and unlocks infinite future variants.

**Alternatives considered.**
- _Single inline SVG in `Hero.tsx`_ — rejected: every variant requires a code change.
- _Static image in `public/`_ — rejected: payload, no crisp scaling, no animation.

### D7. Status lifecycle with chip + filter

**Choice.** Every note may declare `status: seed | growing | evergreen | complete`. `StatusChip.tsx` renders a colored dot + label in the article header (left of date). The metadata panel in the right slot exposes a filter dropdown scoped to the current section.

**Why.** Digital gardens distinguish evergreen notes from seed ideas. Surfacing status at every read site sets reader expectations and signals author investment. Filter support lets readers curate their reading list.

**Alternatives considered.**
- _Status visible only in metadata panel_ — rejected: missed signal on the read surface.
- _Status as a tag (`#evergreen`)_ — rejected: conflated with topic tags, no schema enforcement.

### D8. Hub sections DSL

**Choice.** Each Hub's `index.md` declares a `sections` array. Each entry has `title`, `type` (`cards | list | compact-list | graph`), `filter` (frontmatter predicate), `layout` props (`limit`, `sort`, `height` for graphs), and optional `scope` for graphs. The Hub pageType interprets this DSL at render time.

**Why.** Wikipedia Portals use declarative section lists. Authoring a Hub is editing one YAML block; rendering is one component. Power + simplicity.

**Alternatives considered.**
- _Hardcoded four sections per hub (精选 / 最新 / 生长中 / 常青)_ — rejected: rigid; some hubs (Resources) need different sections.
- _Each section is its own TSX file_ — rejected: multiplies components; one interpreter suffices.

### D9. Graph × Hub: wikilink prominence + scoped graph section

**Choice.** Hubs appear in the global graph because each member note's `tags` reference the hub domain (or the hub is wikilinked from members). The graph component's node-sizing rule gives hub-domain nodes larger radius. A new Hub section type `graph` renders a scoped mini-graph using the existing `graph` plugin with a pre-filtered node list.

**Why.** Wikilinks are the natural graph primitive in Obsidian. Visual emphasis costs almost nothing in the graph component. The scoped mini-graph is a Wikipedia Portal staple.

**Alternatives considered.**
- _Virtual supernode per hub_ — rejected: duplicates reality, breaks single source of truth.
- _Hub-scoped graph only on demand_ — rejected: portal feel requires it to be discoverable.

### D10. Layout config: per-pageType slot composition

**Choice.** `quartz.config.yaml` extends `layout.byPageType`:
- `home`: `header: [BrandHeader, Spacer]`, `beforeBody: []`, `left: []`, `right: []`, `pageBody: Home`. No Explorer, no TOC.
- `hub`: `header: [BrandHeader, Spacer]`, `beforeBody: [Breadcrumbs]`, `left: [Explorer]`, `right: [TOC, Backlinks]`, `pageBody: Hub`.
- `content`: unchanged from current (Explorer desktop-only, TOC, Backlinks).
- `folder`: same as `content`; folder-page disabled (replaced by Hub for typed folders).

**Why.** Each page type earns its own composition. Home is a marketing surface; Hub is a portal; content is a reader.

### D11. PageType Registry pattern

**Choice.** Centralize pageType metadata in `src/lib/pageTypeRegistry.ts` as a `PageTypeSpec[]` array. Each spec declares `name`, `layout`, pure `match(fileData) → boolean`, and `description`. The Quartz emitters in `quartz/plugins/emitters/home.ts` and `hub.ts` become thin wrappers that read the spec from the registry and delegate `match` to it. Adding a new pageType becomes a one-line addition to the registry plus a thin emitter.

```ts
// src/lib/pageTypeRegistry.ts
interface PageTypeSpec {
  name: "home" | "hub"
  layout: string                       // matches layout.byPageType key
  match: (fd: QuartzPluginData) => boolean
  description: string
}

export const pageTypeRegistry: PageTypeSpec[] = [
  {
    name: "home",
    layout: "home",
    match: (fd) => fd.slug === "index" && fd.frontmatter?.type === "home",
    description: "Root index; Hero+Now+Featured+Projects composition"
  },
  {
    name: "hub",
    layout: "hub",
    match: (fd) =>
      fd.frontmatter?.type === "hub" && (fd.slug ?? "").endsWith("/index"),
    description: "Wikipedia-Portal landing; declarative sections DSL"
  },
]

export function findPageType(fd: QuartzPluginData): PageTypeSpec | undefined {
  return pageTypeRegistry.find((s) => s.match(fd))
}
```

**Why.** P2 user constraint: "Implement a PageType Registry instead of scattered conditional logic." Matchers scattered across emitter files duplicate knowledge of slug/frontmatter shape and invite drift. The registry centralizes the predicates; emitters become mechanical wiring.

**Alternatives considered.**
- _Each emitter owns its matcher_ — rejected: violates constraint, scattered conditionals.
- _Class hierarchy of pageType subclasses_ — rejected: Quartz components are functions, not classes; class hierarchies add ceremony with no benefit here.

### D12. Content query abstraction

**Choice.** A pure function `querySection(allFiles, filter, ctx?)` in `src/lib/contentQuery.ts` that computes the intersection of: (a) optional folder scope (folder-containment default for Hubs), (b) optional tag filter with ANY/ALL semantics (`match: 'any' | 'all'`, default `any`), (c) optional status, featured, featuredType equality predicates, (d) optional explicit sort. The function returns matching `QuartzPluginData[]` and is used by both Hub sections and Home pageType sub-queries (Featured, Now, Projects).

```ts
interface SectionFilter {
  tags?: string[]
  status?: string
  featured?: boolean
  featuredType?: "article" | "project" | "note"
  match?: "any" | "all"        // default: "any"
}

interface QueryContext {
  hubScope?: string             // folder path; if set, scope to folder tree
  sort?: SortFn                 // optional explicit sort
  limit?: number
}

function querySection(
  allFiles: QuartzPluginData[],
  filter: SectionFilter,
  ctx?: QueryContext
): QuartzPluginData[]
```

**Why.** P2 user constraint: "Introduce a reusable content query abstraction for Hub section filtering." Without it, every section renderer in Hub.tsx re-implements filtering, and Home.tsx has its own query code. With it, the predicate logic lives in one tested function; callers compose filters declaratively.

**Alternatives considered.**
- _Inline filtering in each component_ — rejected: duplication, drift risk.
- _External query library (lunr, fuse.js)_ — rejected: overkill for equality predicates; full-text search is a different concern (Quartz already provides the search plugin).

### D13. Drawer is brand navigation, not Explorer

**Choice.** `DrawerNav` and `Explorer` are distinct components with distinct purposes. The drawer surfaces the brand's curated top-level navigation (Home, Knowledge hubs, Projects, Now, Resources, Graph, About). `Explorer` is the file-tree surface for content discovery (every folder and file under `content/`). They coexist: drawer always available via ☰ trigger; Explorer present on desktop (≥1200px), hidden on mobile.

**Why.** P3 constraint: "Drawer is not Explorer. Drawer is brand navigation, Explorer remains content navigation." Conflating them produces a drawer that tries to render every file in a 1000-note vault — both visually noisy and a performance cliff.

**Alternatives considered.**
- _Drawer replaces Explorer everywhere_ — rejected: power users on desktop want the persistent file tree.
- _Single mega-tree with brand filters on top_ — rejected: same problem as "replaces"; tree becomes the navigation, brand becomes a search filter on the tree.

### D14. Drawer scales to 1000+ notes

**Choice.** The drawer MUST expose only top-level entries (the seven nav items in D17). Knowledge is the only expandable group, and its children are top-level hubs (`Knowledge/Android`, `Knowledge/AI`, etc.) — never article trees. Each hub link shows a `(N)` count badge derived from `querySection(allFiles, {}, { hubScope: 'Knowledge/<hub>' }).length`. Counts are computed at build time from `allFiles`; the drawer never walks the filesystem at runtime.

**Why.** P3 constraint: "Drawer must scale to 1000+ notes. Only expose top-level hubs, never article trees." A drawer that expands into 500 notes defeats its purpose as a quick-jump surface.

**Alternatives considered.**
- _Lazy-load subtree on hub click_ — rejected: violates "single click to navigate" mental model; defers the slowness to user interaction.
- _Full tree with virtual scrolling_ — rejected: tree becomes a searchable surface, not a navigation; that's Explorer's job.

### D15. Header emphasizes personal brand

**Choice.** `BrandHeader` surfaces the personal brand prominently: logo glyph (✦), site name (`Stargazer` from `cfg.pageTitle`), tagline ("Digital Garden" from a new optional `cfg.brand.tagline` field, defaulting to "Digital Garden"). Nav links (D17) sit center/right. The header does NOT render the page title (that's the article-title plugin's job for content pages).

**Why.** P3 constraint: "Header should emphasize personal brand: Stargazer / 温哲 / Digital Garden instead of a generic blog title." The brand is the site; the article title is the page.

**Alternatives considered.**
- _Brand left + page title center + nav right_ — rejected: doubles the visual hierarchy; brand and title compete.
- _Brand left + tagline_ as full logo lockup_ — selected: tagline ("Digital Garden") gives a one-glance identity statement.

### D16. Drawer search semantics

**Choice.** Drawer search filters the navigation surface in real time as the user types. Navigation is manual: pressing Enter on the keyboard MUST navigate to the highlighted/focused result (or the first match if none is focused); tapping a result on touch viewports MUST navigate. The system MUST NOT auto-navigate as the user types.

**Why.** P3 constraint: "filter results first, manual navigation on selection." Earlier Q3 resolution (filter + navigate) is consistent with this: both typing-filter and selection-navigate are user-driven. The refinement here is explicit: no auto-navigation on keystroke.

**Alternatives considered.**
- _Auto-navigate to first match on every keystroke_ — rejected: jarring; user loses reading position; conflicts with intent ("I'm filtering, not jumping yet").
- _Search-only filters a separate list, not the tree_ — rejected: tree is the only navigation surface; a parallel list doubles cognitive load.

### D17. Navigation contract

**Choice.** The site has exactly seven top-level navigation entries, in this order:

| # | Label | Target | Expandable | Notes |
|---|---|---|---|---|
| 1 | Home | `/` | no | Root index page |
| 2 | Knowledge | `/Knowledge` | **yes** | Expands into top-level hubs (Knowledge/<hub>); never article trees |
| 3 | Projects | `/Projects` | no | Hub page lists projects |
| 4 | Now | `/Now` | no | Hub page lists tracks |
| 5 | Resources | `/Resources` | no | Hub page lists resources |
| 6 | Graph | `/graph` | no | **Reserved** — entry exists before standalone page; today points to a placeholder, after group 14 ships it points to the dedicated `/graph` route |
| 7 | About | `/About` | no | Single page |

**Why.** P3 constraint: "Lock navigation contract" + "reserve a Graph navigation entry even before the standalone graph page exists." A locked contract keeps the IA stable; reserving Graph maintains its first-class nav status while the standalone page is tracked in the follow-up change.

**Alternatives considered.**
- _Tags as nav entries_ — rejected: tags are metadata (per Q5 Folder Primary, Tag Secondary), not navigation surface.
- _No Knowledge expansion in drawer_ — rejected: Knowledge without its hubs makes the drawer a flat list of 7 with no way to reach Android/AI without another click.

### D18. Status is visible everywhere it matters

**Choice.** `StatusChip` MUST render in four surfaces:

1. **Note header (article meta strip)** — every content page shows the status chip in the meta row beneath the H1, alongside date and reading time.
2. **Home featured cards** — every featured card (article / project / note variants) shows the status chip in its meta row.
3. **Hub cards** — cards rendered inside Hub `cards` sections show the status chip in their meta row.
4. **Metadata panel** — every content page renders a right-slot metadata panel showing the status chip, featured indicator, description, and tags.

**Why.** P4 constraint: "Status must appear consistently" in those four surfaces. Without status visibility, the site still feels like a traditional blog. Status is the digital-garden signal that distinguishes "freshly drafted" from "well-curated evergreen."

**Alternatives considered.**
- _Status only on note header_ — rejected: cards carry the same meaning and would lie about maturity if unmarked.
- _Status as a CSS pseudo-element on h1_ — rejected: not addressable; no accessible label.

### D19. Status uses both color and shape

**Choice.** StatusChip MUST render **both** a color and a shape so the chip is distinguishable without color vision:

| Status | Shape | Glyph | Color (light) |
|---|---|---|---|
| seed | hollow ring | ○ | `#9C9C9C` |
| growing | half-filled | ◐ | `#84A59D` |
| evergreen | filled | ● | `#C9A97E` |
| complete | ring + dot | ◉ | `#6B6B6B` |

Color comes from `var(--status-<name>)`; the glyph is the chip's text content. A `aria-label` on the chip provides the screen-reader name ("Status: growing").

**Why.** P4 constraint: "Status must use both color and shape." Color-only signaling fails for color-blind readers; shape-only signaling fails for monochrome printing. Redundant encoding is accessibility hygiene.

**Alternatives considered.**
- _Color + text label only_ — accepted as a fallback but insufficient on its own; shape adds scanability.
- _Custom SVG shapes per status_ — rejected: more code, no readability benefit over Unicode glyphs.

### D20. Featured cards visually distinguish type

**Choice.** Featured cards MUST render with distinct visual variants by `featuredType`:

| Type | Card shape | Icon style |
|---|---|---|
| article | vertical card with cover image on top, title + description below | (cover-driven) |
| project | horizontal card with circular icon on the left, title + description on the right | 48px circle, accent-tinted |
| note | compact card with small icon, title, date only | 16px icon, no description |

The distinction is data-driven from `featuredType`; never from per-note styling fields.

**Why.** P4 constraint: "Featured cards should visually distinguish article / project / note." Mixing these shapes in the same row confuses readers about what they're looking at; aligned shapes per type make the Featured section scannable.

**Alternatives considered.**
- _Identical cards, label via text_ — rejected: doesn't scale visually; reader must read every title to know the type.
- _Type indicated only by color_ — rejected: same accessibility concern as D19.

### D21. Featured and status are orthogonal

**Choice.** `featured` and `status` are independent frontmatter fields. The system MUST allow any combination:

```yaml
featured: true
status: seed          # freshly drafted, but worth featuring on Home
```
```yaml
featured: true
status: growing       # actively maintained and featured
```
```yaml
featured: true
status: evergreen     # well-maintained, re-readable, featured
```
```yaml
featured: true
status: complete       # finished; still curated as evergreen
```

The two fields are validated independently — `featured: true` without `featuredType` still fails; `status` with an invalid value still fails — but neither field's presence affects the other's validity.

**Why.** P4 constraint: "featured and status remain fully orthogonal." The two fields answer different questions (curation vs. maturity); conflating them would force authors to invent fake status values to express curation intent.

**Alternatives considered.**
- _Single `curation` field combining both_ — rejected: collapses two distinct signals into one; loses the ability to mark a mature note as not-yet-curated.
- _Status required when featured_ — rejected: forces a status value to express curation; same as above.

### D22. Hub section status filter accepts multiple values

**Choice.** A Hub section's `filter.status` MUST accept either a single string or an array of strings. Multiple values are OR-combined (a note matches if its status is any of the listed values).

```yaml
sections:
  - title: 生长中
    type: compact-list
    filter:
      status: [growing]
  - title: 不只是种子
    type: list
    filter:
      status: [growing, evergreen]    # either status matches
```

`contentQuery.querySection` is updated to normalize `status` to an array internally; the predicate is `statuses.includes(fileStatus)`.

**Why.** P4 constraint: "Add status-based query support for Hub sections." Arrays are essential for sections like "everything not yet seed" without inventing negative filters. The single-string form is preserved as a convenience for the common one-value case.

**Alternatives considered.**
- _AND semantics across statuses_ — rejected: a note can only have one status; AND across statuses would always return empty.
- _Separate `statuses` (plural) field_ — rejected: same semantics, more verbose; the single field with array fallback is cleaner.

### D23. Hero is background, not the main attraction

**Choice.** Hero illustrations MUST occupy a restrained vertical band (~240–280px) and MUST NOT compete with text for visual weight. The Home Hero illustration is rendered behind/beside text at low opacity (≈0.3–0.5) so the title, subtitle, and tagline read first. The illustration is supporting atmosphere, not the focal point.

**Why.** P5 constraint: "Hero is background, not the main attraction. Keep height restrained." The illustration should make the page feel alive without stealing attention from the brand text.

**Alternatives considered.**
- _Full-bleed hero illustration at viewport height_ — rejected: makes illustration the focal point; brand text becomes decoration.
- _Illustration as a small accent in a corner_ — selected for Hub Hero; Home Hero uses background-illustration style.

### D24. Hero supports content and branding

**Choice.** The Home Hero carries three brand elements in this hierarchy:

1. **温哲** — primary identifier (the person behind the garden)
2. **Android × AI × Automation** — domain tagline (what this garden is about)
3. **Digital Garden** — form identifier (what kind of site this is)

These MUST be readable as the page loads. The SVG illustration MUST stay secondary to this text — opacity, position, and weight all defer to the words.

**Why.** P5 constraint: "Hero must support content and branding. SVG stays secondary." Text-first heroes are common in digital gardens (Maggie Appleton, Andy Matuschak, Tom Critchlow) because the brand is the differentiator; the illustration is mood.

**Alternatives considered.**
- _Illustration-first, text as caption_ — rejected: makes the illustration carry weight it shouldn't have.
- _Text + illustration equal weight_ — rejected: no clear hierarchy; reader doesn't know where to look first.

### D25. Minimal monochrome line-art style

**Choice.** Hero illustrations MUST be rendered as line-art SVG with these constraints:

- **No gradients** (forbidden by `prefers-reduced-motion` and accessibility)
- **No drop shadows** (line art shouldn't cast shadows)
- **No heavy illustration detail** — silhouettes, simple strokes, ≤1.5 stroke-width
- **Stroke color**: `currentColor`, themed via parent CSS `color` property so dark/light modes work without changes
- **Background**: transparent — illustration sits on the page background, no separate `<rect>` fills

**Why.** P5 constraint: "Use a minimal monochrome line-art style. Avoid gradients, shadows, and illustration-heavy designs." Line-art is the lowest-bandwidth, most-accessible illustration style; it pairs naturally with monochrome brand palettes and adapts to any background.

**Alternatives considered.**
- _Multi-color illustrations_ — rejected: clashes with the warm monochrome brand palette; harder to keep accessible.
- _Photographic illustration_ — rejected: heavy assets; off-brand for a personal digital garden.
- _AI-generated hero images_ — rejected: opaque, hard to iterate, defeats the registry's pluggability.

### D26. Registry is extensible without modifying Hero.tsx

**Choice.** Adding a new Hero variant is a one-step change: implement the variant component, register it in `src/components/heroStyles/index.ts`. `Hero.tsx` and `HubHero.tsx` look up the variant by name and MUST NOT be modified when adding new variants.

```ts
// src/components/heroStyles/index.ts
export interface HeroStyleProps {
  palette: { accent: string; text: string; muted: string; surface: string; surfaceElevated: string }
  seed: string                       // for deterministic variation
  height: number
}

export type HeroStyleComponent = (props: HeroStyleProps) => JSX.Element

export const heroStyles: Record<string, HeroStyleComponent> = {
  mountain: MountainStyle,
  // Phase B additions:
  // ocean: OceanStyle,
  // forest: ForestStyle,
}

export const reservedHeroStyles: string[] = [
  "graph",   // Phase C — reserved for graph hub variant
]

export function getHeroStyle(name: string | undefined): HeroStyleComponent {
  const n = name?.toLowerCase()
  if (!n) return heroStyles.mountain
  if (heroStyles[n]) return heroStyles[n]
  if (reservedHeroStyles.includes(n)) {
    console.warn(`[hero] '${n}' is reserved for a future phase; falling back to mountain`)
  } else {
    console.warn(`[hero] unknown heroStyle '${n}'; falling back to mountain`)
  }
  return heroStyles.mountain
}
```

**Why.** P5 constraint: "Registry must be extensible. Future variants: forest, ocean, without modifying Hero.tsx." The registry pattern keeps variant authoring decoupled from Hero composition.

**Alternatives considered.**
- _Switch statement in Hero.tsx per variant_ — rejected: violates the constraint; couples Hero to each variant.
- _Class hierarchy_ — rejected: Quartz components are functions, not classes; classes add ceremony.

### D27. Home Hero and Hub Hero are separate design systems

**Choice.** Home Hero and Hub Hero are distinct components with distinct purposes:

- **Home Hero** (`src/components/home/Hero.tsx`) — brand entry. Carries 温哲 + Android × AI × Automation + Digital Garden. Restrained illustration (low opacity, secondary). Per D23–D25.
- **Hub Hero** (`src/components/hub/HubHero.tsx`) — knowledge portal. Carries hub name + hub description + auto-computed stats (笔记数 / 生长中 / 常青). More functional, less brand-y. Different illustration usage (smaller accent, or no illustration).

Both share the HeroStyle registry so the visual language is consistent. They differ in **which text** they emphasize and **how much** illustration they include.

**Why.** P5 constraint: "Home Hero and Hub Hero are separate design systems. Home = brand entry. Hub = knowledge portal." A brand entry and a portal serve different cognitive functions and shouldn't share the same hero composition.

**Alternatives considered.**
- _Single Hero component with a `variant` prop_ — rejected: Hub Hero carries domain-specific data (stats line) that the brand Hero doesn't need; coupling them via props would mean conditional rendering branches everywhere.
- _Two completely unrelated components_ — rejected: they should share the illustration registry for visual consistency.

### D28. Graph hero variant reserved in the registry

**Choice.** The registry MUST declare `graph` as a reserved variant name, even though no implementation exists in Phase A. `getHeroStyle("graph")` MUST log a warning and fall back to mountain. The variant will be implemented in Phase C (alongside the standalone `/graph` page from group 14).

**Why.** P5 constraint: "Reserve a future graph hero variant in the registry." Reserving the name in Phase A makes it visible in the spec/config docs and prevents ad-hoc naming when Phase C ships.

**Alternatives considered.**
- _Implement graph as a placeholder SVG now_ — rejected: placeholder art becomes a trap; reserving without an implementation is more honest.
- _Don't reserve; decide later_ — rejected: late discovery of name conflicts between independent phases.

### D36. Graph as knowledge discovery tool

**Choice.** The graph is positioned as a knowledge discovery surface, not a decorative visualization. The standalone `/graph` page surfaces connection density (link counts), node prominence (status-based radii), and navigation aids (hover highlighting, click-to-navigate). The Related Notes section surfaces the most-connected notes; Recent Updates shows temporal activity.

**Why.** D36 user constraint: "Graph is a knowledge discovery tool, not just a visualization." A decorative graph is glanced at and dismissed. A discovery tool invites exploration — "What's connected?", "What's missing?", "What's central?"

**Alternatives considered.**
- _Graph as a sidebar widget only_ — rejected: sidebar crop limits readability; global graph deserves full viewport.
- _Graph as a static image_ — rejected: no interaction, no discovery value.

### D37. Scoped Hub graphs over global graphs

**Choice.** Hub pages default to scoped graphs (via `type: graph` sections) that show only the hub's notes plus one-hop neighbors. The global graph is available via the "完整图谱 →" link on every scoped graph and via the standalone `/graph` page.

**Why.** D37 user constraint: "Prioritize scoped Hub graphs over global graphs." A global graph with 500+ nodes is overwhelming on a Hub page. A scoped graph with 5-20 nodes reveals the hub's internal structure and immediate connections.

**Alternatives considered.**
- _Global graph everywhere, filtered client-side_ — rejected: too many nodes, poor UX on Hub pages.
- _Scoped graphs only, no global access_ — rejected: loses the big-picture value of the global graph.

### D38. Hub DSL `type: graph` section support

**Choice.** The existing Hub sections DSL already declares `type: "graph"` as an allowed type. P11 replaces the placeholder with `ScopedGraph`, a component that:
- Reads `querySection()` results at build time
- Serializes scope slugs + status→radius map into `data-cfg`
- Renders a PixiJS/D3 force graph limited to the scope
- Shows a "完整图谱 →" link to `/graph`

```yaml
sections:
  - title: 知识图谱
    type: graph
    filter:
      status: [growing, evergreen]
    height: 400
```

**Why.** D38 user constraint: "Support Hub DSL sections with type: graph." The DSL already reserved this type; implementing it completes the contract without changing the authoring experience.

### D39. Node hierarchy by status

**Choice.** Node radii are multiplied by status:
| Status | Multiplier | Rationale |
|--------|-----------|-----------|
| Hub (folder index) | 1.8× | Structural anchor of the knowledge area |
| Evergreen | 1.4× | Mature, reliable, central to understanding |
| Growing | 1.2× | Active, evolving, gaining connections |
| Seed / Complete | 1.0× | Baseline — present but not visually dominant |

The formula: `radius = (2 + √linkCount) × statusMultiplier`

**Why.** D39 user constraint: explicit multipliers for each status tier. Visual prominence should reflect knowledge maturity, not just connection count. A seed note with 10 links shouldn't outsize an evergreen with 8.

**Alternatives considered.**
- _Radius by link count only (default D3 behavior)_ — rejected: ignores the garden's maturity signal.
- _Fixed sizes per type_ — rejected: doesn't scale as notes gain/lose connections.

### D40. Standalone /graph page layout

**Choice.** The `/graph` page uses a dedicated `graph` pageType (registered in `pageTypeRegistry` with `match: slug === "graph"`). Layout:

```
┌─────────────────────────────────────┐
│         Graph Hero (知识图谱)        │
│   Knowledge Atlas — tagline + stats  │
├─────────────────────────────────────┤
│                                     │
│        Full Graph View              │
│        (70vh, no sidebar crop)       │
│                                     │
├─────────────────────────────────────┤
│  Related Notes (6 most-connected)   │
├─────────────────────────────────────┤
│  Recent Updates (10 most recent)    │
└─────────────────────────────────────┘
```

No sidebars, no TOC, no backlinks — the graph occupies the full page width.

**Why.** D40 user constraint: "Graph page should not be graph-only." A full-page graph component with no context is disorienting. The hero explains what it is; related notes show what's worth exploring; recent updates show what's active.

### D41. Navigation label: 知识图谱

**Choice.** The nav entry is labeled "知识图谱" (Knowledge Atlas) instead of the raw English "Graph". Both BrandHeader and DrawerNav use this label.

**Why.** D41 user constraint. "图谱" conveys the knowledge-network meaning; "Graph" alone sounds like a chart. "知识图谱" = Knowledge Atlas = a map of interconnected concepts.

### D42. Reserved metadata slots: backlinks and wikilinks

**Choice.** The card grid's `content-card-graph-meta` footer area (reserved in P9/D35) now populates:
- **backlinks** — count of other notes linking to this one (computed by scanning all `frontmatter.links` across `allFiles`)
- **wikilinks** — count of outgoing links from this note (from `frontmatter.links.length`)

Values render as small numbers in the slot; zero-count slots remain empty but maintain consistent footer height.

**Why.** D42 user constraint. These graph signals answer "is this note central?" (backlinks) and "is this note well-connected?" (wikilinks) at a glance in the card grid.

### D43. Graph deep links: /graph?focus=<slug>

**Choice.** The `/graph` page reads `?focus=<slug>` from the URL. When present, after the graph simulation settles (2s delay), it highlights the target node and its neighbors. The node is not automatically centered (PixiJS stage pan would require additional camera logic), but the visual highlighting makes it immediately findable.

**Why.** D43 user constraint. Deep links enable "Show me this note's neighborhood" from card grids, search results, or external references.

### D44. Plugin override strategy

**Choice.** Third-party plugins under `.quartz/plugins/` must NOT be modified directly. Customizations use:
1. **Wrapper components** in `src/components/` (e.g., `ScopedGraph.tsx` wraps graph rendering without touching the plugin)
2. **Config-level overrides** via `quartz.config.yaml` `layout.byPageType`
3. **CSS overrides** in `src/styles/`

When source modification is unavoidable (as with folder-page/tag-page PageList for card-grid), the change is documented in `AGENTS.md` under "Plugin Source Modifications (tracked)" with a table recording plugin, file, change, reason, and date.

**Why.** D44 user constraint: "Avoid further direct modifications of third-party plugin repositories." Documenting the strategy prevents drift and makes future maintenance predictable.

## Risks / Trade-offs

- **[Frontmatter drift]** → _Mitigation_: schema documented in `specs/frontmatter-schema/`; every new field tested by at least one section or component.
- **[Hub DSL complexity]** → _Mitigation_: DSL limited to four section types; filters restricted to equality on `tags`, `status`, `featured`, `featuredType`; tag combination defaults to ANY with opt-in ALL via `match: all`.
- **[Drawer accessibility]** → _Mitigation_: focus trap on open, ESC closes, ARIA labels, `prefers-reduced-motion` disables slide animation.
- **[Graph component extensibility]** → _Mitigation_: scoped graph renders through existing `graph` plugin with pre-filtered data; no fork needed.
- **[Quartz framework updates clobbering work in `quartz/`]** → _Mitigation_: only `quartz/styles/custom.scss` and `quartz/components/index.ts` are modified; new components live in `src/`.
- **[CSS specificity wars between token layer and base Quartz]** → _Mitigation_: tokens use `:root` variables; component layer uses component-scoped class selectors only.
- **[Featured sort order]** → _Mitigation_: explicit `featuredOrder` field; if absent, sort by `modified` desc as fallback.
- **[Status field absent on legacy notes]** → _Mitigation_: default rendering treats missing status as `seed`; no breaking change.

## Migration Plan

1. Ship P1 (tokens, typography, components, layout SCSS) without changing visible output. Compare rendered site byte-for-byte against baseline; revert on visual diff.
2. Ship P2 (drawer + brand header) behind a flag: `layout.byPageType.home.header = [BrandHeader, Spacer]` only on the home pageType; other pages keep default Header. Roll out hub pages in P3.
3. Ship P3 (Home + Hub pageTypes) as new emitters; default pageType for `index.md` and folder `index.md` with `type: hub`. Disable `content-page` matcher for these slugs.
4. Ship P4 (card-grid PageList override) for folder and tag pages.
5. Ship P5 (brand footer) globally.
6. P6 (content skeleton) is author-driven; no migration logic needed.
7. P7 (polish) is config + CSS tuning; rolled out incrementally.

Rollback at any phase: revert `quartz.config.yaml` and the matching `quartz/styles/custom.scss` edit. `src/` files have no effect when not `@use`d.

## Future Work

The following items are intentionally **out of scope** for this change and tracked for a follow-up:

- **Standalone `/graph` page** — the Graph component currently renders as a right-sidebar widget on content pages (narrow column, cropped to viewport). Per the Digital Garden IA, Graph is a first-class navigation item and needs its own dedicated page that renders the full global graph with all notes and hub prominence rules. Tracked in `tasks.md` group 14.
- **Real-time collaboration features** (presence, multi-cursor) — out of scope; static-site generator.
- **Comments system** — out of scope; the `comments` plugin is currently disabled and stays that way.

## Open Questions

All open questions from exploration are resolved as follows:

- **Q1 (`featuredType: evergreen` vs `status: evergreen`)** — _RESOLVED_: rename `featuredType` value `evergreen` → `note`; render the third Featured bucket as label "精选笔记" so schema and display no longer overlap with `status: evergreen`.
- **Q2 (Hub section `filter.tags` ANY vs ALL)** — _RESOLVED_: default to ANY (any tag matches). Author opts into ALL via top-level `match: all` on the section entry. ALL is rare in practice; ANY is the natural default for "notes about Android OR Kotlin".
- **Q3 (Drawer search on mobile — filter vs auto-navigate)** — _RESOLVED_: both. Typing filters the tree in real time; tapping a result navigates. Auto-navigation on Enter (desktop + mobile).
- **Q4 (Hub stats line — auto or author-supplied)** — _RESOLVED_: auto-computed at build time from `allFiles`. No frontmatter override. Single source of truth, zero drift.
- **Q5 (Folder Primary, Tag Secondary — NEW)** — _RESOLVED_: codified as a top-level design principle. Folder containment under `content/` is the primary structure for hubs, drawer tree, and explorer. Tags are secondary metadata for cross-cutting refinement. Hub sections default to their folder's scope; `filter.tags` is an opt-in refinement, not a primary scope. Tag pages (`tag-page` plugin) remain enabled but render with a simpler layout to reflect their secondary role.
