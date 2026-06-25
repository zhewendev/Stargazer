## Why

Stargazer is currently a default Quartz 5 blog with one placeholder page (`content/index.md`) and no visual identity. The vision documented in `AGENTS.md` is a **personal digital garden** — knowledge-first, evergreen, hub-driven, fully data-driven — but the codebase reflects neither the brand nor the information architecture. This change transforms the project into that garden by introducing a warm Lapis-Cafe-inspired visual system, a VeryJack-flavored drawer navigation, a declarative Hub page type, and a content taxonomy (frontmatter schema, status lifecycle, featured partitioning, pluggable hero illustrations) that lets the garden evolve without code changes.

## What Changes

- **New `src/` layer** outside `quartz/` for custom SCSS and TSX (token system, components, hero illustration registry) so framework updates don't clobber brand work.
- **New Home pageType** (`pages/Home.tsx`) that composes Hero + Now + Featured + Projects from markdown content and frontmatter — no hardcoded cards or copy.
- **New Hub pageType** (`pages/Hub.tsx`) for every major knowledge area, rendering declarative sections from `index.md` frontmatter.
- **New DrawerNav component** with knowledge tree, search, and three interaction states (desktop / tablet / mobile); Explorer remains visible on desktop, drawer replaces it on mobile.
- **New BrandHeader / BrandFooter** components with logo, asymmetric nav (☰ | brand | nav | 🔍), social links, and theme credit.
- **Frontmatter schema**: new fields `status`, `featured`, `featuredType`, `featuredOrder`, `heroStyle`, `type`, `sections`, plus extended `tags` taxonomy.
- **Featured system**: items auto-partition by `featuredType: article | project | note` into "精选文章 / 项目 / 精选笔记" sections on Home.
- **Status system**: every note carries a maturity lifecycle (`seed | growing | evergreen | complete`) with chip + filter UI.
- **Hero illustration registry**: pluggable SVG variants selected via `heroStyle` frontmatter; future variants add without homepage code changes.
- **Graph × Hub**: hub pages register as nodes in the global graph (via wikilinks) and may render a scoped mini-graph as a Hub section.
- **Content skeleton**: Knowledge/{Android, AI, 自动化与工具, 阅读与思考, 生活与效率}, Projects/, Now/{ai-coding, auto-account, android, reading}, About.md, Resources/, Home/hero.md.
- **Layout config**: `quartz.config.yaml` reworked — colors/typography block replaced, `layout.byPageType` extended with `home` and `hub`, Explorer demoted to mobile-disabled.

**BREAKING**: `content/index.md` semantics change from "blog post" to "frontmatter-only home config". All hero copy, section lists, and CTA URLs move to `content/Home/hero.md` and per-note frontmatter.

## Capabilities

### New Capabilities

- `frontmatter-schema`: unified frontmatter taxonomy covering identity, status, featured, hero, and hub config.
- `design-tokens`: palette, typography stack, spacing, radii, shadows, and motion tokens.
- `drawer-nav`: drawer navigation component with knowledge tree, search, and responsive behavior.
- `home-page`: Home pageType composing Hero, Now, Featured, and Projects sections from data.
- `hub-page`: Hub pageType with declarative section DSL, optional hero, and optional scoped graph.
- `featured-system`: featured content partitioning by `featuredType` across Home and Hub sections.
- `status-system`: note maturity lifecycle with chip UI and filter support.
- `hero-illustration`: pluggable SVG variant registry selected via `heroStyle`.
- `graph-hub-integration`: hub node prominence in global graph and scoped mini-graph section.

### Modified Capabilities

_None._ No existing OpenSpec specs exist; this is a greenfield capability set.

## Impact

- **`src/`** — new directory tree at project root (`src/styles/`, `src/components/`, `src/components/home/`, `src/components/heroStyles/`). Lives outside `quartz/` to survive framework updates.
- **`quartz/styles/custom.scss`** — entry point; `@use`s the five `src/styles/*.scss` files.
- **`quartz/components/`** — new files `pages/Home.tsx`, `pages/Hub.tsx`; modified `index.ts` re-exports; new `BrandHeader`, `DrawerNav`, `BrandFooter`, `StatusChip`, `WikiLink` components.
- **`quartz/plugins/emitters/`** — new emitters register `home` and `hub` pageTypes with the dispatcher.
- **`quartz.config.yaml`** — replaced colors/typography block; `plugins.Explorer` layout downgraded to desktop-only; new layout entries for `home` and `hub` pageTypes.
- **`content/index.md`** — frontmatter-only (`title`, `heroStyle`, `type: home`).
- **`content/`** — new folders `Knowledge/`, `Projects/`, `Now/`, `Resources/`, `Home/`; existing files preserved.
- **AGENTS.md** — referenced as the source-of-truth for digital-garden principles ("Content > UI", "Hub Pages Required", "All homepage content must be data-driven").
