# Hub Page

A Hub is a Wikipedia-Portal-style landing page for a knowledge domain. Every major knowledge area MUST have a Hub page (per AGENTS.md). The Hub pageType interprets a declarative sections DSL declared in the folder's `index.md` frontmatter.

## ADDED Requirements

### Requirement: Hub pageType registration

The system MUST register a new `hub` pageType via `quartz/plugins/emitters/hub.ts`. The matcher MUST select the hub pageType when `fileData.frontmatter?.type === "hub"`. The Hub pageType MUST bypass the default `folder-page` matcher.

#### Scenario: Hub activation
- **WHEN** a folder's `index.md` declares `type: hub`
- **THEN** the Hub pageType renders this folder's index page

#### Scenario: Folder without type: hub
- **WHEN** a folder's `index.md` does not declare `type: hub`
- **THEN** the default folder-page renders (or, for the home folder, the Home pageType)

### Requirement: Hub sections DSL

A Hub's `index.md` MUST declare a `sections` array. Each entry MUST have `title` (string) and `type` (one of `cards`, `list`, `compact-list`, `graph`). Each entry MUST have a `filter` object with at least one of: `tags` (string[]), `status` (string), `featured` (boolean), `featuredType` (string).

A Hub section's effective scope MUST be the intersection of (a) the Hub's folder containment (all notes in the Hub's folder tree under `content/`) and (b) the section's `filter` object. Tags are secondary refinement, never the primary scope — folder containment is always applied first.

When `filter.tags` declares multiple tags, the section MUST default to ANY-match semantics. An author MAY opt into ALL-match by setting `match: all` at the top level of the section entry (sibling to `title`/`type`/`filter`).

#### Scenario: Hub with three sections
- **WHEN** a Hub declares sections of types `cards`, `list`, and `graph`
- **THEN** the Hub renders three sections in the declared order

#### Scenario: Hub section with invalid type
- **WHEN** a section declares `type: timeline`
- **THEN** the build MUST fail with a clear error listing the allowed section types

#### Scenario: Tag filter defaults to ANY
- **WHEN** a Hub section declares `filter.tags: [android, kotlin]` and does not set `match`
- **THEN** the section shows notes tagged `android` OR `kotlin`

#### Scenario: Author opts into ALL match
- **WHEN** a Hub section declares `match: all` and `filter.tags: [android, kotlin]`
- **THEN** the section shows only notes tagged with both `android` AND `kotlin`

#### Scenario: Folder containment limits tag scope
- **WHEN** a Hub at `/Knowledge/Android/` declares a section with `filter.tags: [kotlin]` but no `match`
- **THEN** the section shows only Kotlin-tagged notes that also live under `/Knowledge/Android/` (folder containment is applied first)
- **THEN** a Kotlin note under `/Knowledge/AI/` is excluded

### Requirement: Hub hero block

A Hub MUST render a hero block when its `index.md` declares `hubHero` (default `true`) AND `hubHero` is not `false`. The hero MUST show the Hub's `title`, `description`, the illustration variant from `heroStyle` (or `mountain` fallback), and an auto-computed stats line.

The stats line MUST be computed at build time from `allFiles` filtered by the Hub's folder containment. The format MUST be `"<total> 笔记 · <growing> 生长中 · <evergreen> 常青"`. No frontmatter field MAY override these numbers; the build is the single source of truth.

#### Scenario: Hub hero with stats
- **WHEN** a Hub's index declares `hubHero: true` (default) and `heroStyle: mountain`
- **THEN** the Hub renders a hero with title, description, MountainSVG, and a stats line

#### Scenario: Hub hero suppressed
- **WHEN** a Hub's index declares `hubHero: false`
- **THEN** the Hub renders only its sections, no hero block

#### Scenario: Hub stats auto-computed
- **WHEN** the Hub is `content/Knowledge/Android/` and contains 47 notes (12 growing, 8 evergreen)
- **THEN** the stats line reads "47 笔记 · 12 生长中 · 8 常青"

#### Scenario: Hub stats update on rebuild
- **WHEN** the Hub's folder contains 48 notes after a new note is added (now 13 growing)
- **THEN** the stats line MUST read "48 笔记 · 13 生长中 · 8 常青" without any author action

#### Scenario: Stats override is rejected
- **WHEN** a Hub's index declares any field named `stats` in frontmatter
- **THEN** the build MUST ignore that field (stats are always computed)

### Requirement: Cards section type

A section with `type: cards` MUST render each matching note as a card with cover image (if `cover` frontmatter present), title, description, and optional meta (status chip, date). The section MUST respect `limit` (default 6) and `sort` (default `featuredOrder` then `modified` desc).

#### Scenario: Cards section with cover
- **WHEN** a cards section filter matches three notes, one with `cover: ./cover.png`
- **THEN** the section renders three cards; the one with cover shows the cover image at the top

#### Scenario: Cards section limit
- **WHEN** a cards section has `limit: 6` and ten matching notes
- **THEN** the section renders six cards

### Requirement: List section type

A section with `type: list` MUST render each matching note as a horizontal row with title (linked), date, status chip, and tags. No cover image. The section MUST respect `limit` (default 10).

#### Scenario: List section with status chips
- **WHEN** a list section matches notes with statuses `growing` and `evergreen`
- **THEN** each row shows the corresponding status chip

### Requirement: Compact list section type

A section with `type: compact-list` MUST render each matching note as a single-line row with title and date only, separated by thin dividers. Used for maturity-filtered sections (e.g., "生长中" or "常青") where density matters.

#### Scenario: Compact list density
- **WHEN** a compact-list section has 20 matching notes
- **THEN** the section renders all 20 in a single dense block with thin dividers

### Requirement: Graph section type

A section with `type: graph` MUST render a scoped graph view containing only nodes that pass its filter, plus their direct wikilink neighbors. The graph MUST use a height declared by `height` (default 320px).

#### Scenario: Scoped graph
- **WHEN** a Hub has a graph section filtered to `tags: [android]`
- **THEN** the section renders a graph containing only Android-related nodes plus their direct neighbors

#### Scenario: Graph height
- **WHEN** a graph section declares `height: 480px`
- **THEN** the rendered graph container has height 480px

### Requirement: Hub layout composition

A Hub MUST render `Breadcrumbs` in `beforeBody`, `Explorer` in `left` (desktop-only), `TOC` and `Backlinks` in `right`. A Hub MUST use `BrandHeader` in `header` (same as content pages).

#### Scenario: Hub layout
- **WHEN** a Hub page renders
- **THEN** the page shows brand header, breadcrumb, explorer sidebar (desktop), TOC, backlinks, and the Hub body
