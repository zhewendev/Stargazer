# Home Page

The Home pageType is the brand's front door. It composes Hero, Now, Featured, and Projects sections entirely from markdown content and frontmatter — no hardcoded copy, no hardcoded cards, no hardcoded knowledge areas (per AGENTS.md).

## ADDED Requirements

### Requirement: Home pageType registration

The system MUST register a new `home` pageType via `quartz/plugins/emitters/home.ts`. The matcher MUST select the home pageType when `fileData.slug === "index"` AND `fileData.frontmatter?.type === "home"`. The Home pageType MUST bypass the default content page layout.

#### Scenario: Home activation
- **WHEN** `content/index.md` declares `type: home`
- **THEN** the Home pageType renders instead of the default content page

#### Scenario: Non-home index
- **WHEN** a folder `index.md` declares `type: hub`
- **THEN** the Home pageType is NOT selected; the Hub pageType is selected

### Requirement: Hero section data sourcing

The Hero section MUST read its content from `content/Home/hero.md`. The Hero MUST support the following frontmatter on `Home/hero.md`: `subtitle`, `tagline`, `ctas` (array of `{label, url, variant}`). The Hero body of `Home/hero.md` MUST be rendered as the reflective quote beneath the title.

#### Scenario: Hero with subtitle and tagline
- **WHEN** `Home/hero.md` declares `subtitle` and `tagline`
- **THEN** the Hero renders the title from `index.md` and the subtitle/tagline beneath

#### Scenario: Hero CTAs
- **WHEN** `Home/hero.md` declares two CTAs
- **THEN** the Hero renders both as buttons in the declared order
- **THEN** the first CTA renders with `variant: primary` styling
- **THEN** the second CTA renders with `variant: secondary` styling

### Requirement: Now section data sourcing

The Now section MUST list every file under `content/Now/`. Each file MUST render as a card with title, a one-line description from frontmatter, and a small icon declared via frontmatter (`icon` field). The section MUST render its title from `index.md` Home configuration or, if absent, the literal string "现在在做".

#### Scenario: Now section populated
- **WHEN** `content/Now/` contains `ai-coding.md`, `auto-account.md`, `android.md`, `reading.md`
- **THEN** the Now section renders four cards in alphabetical order

#### Scenario: Empty Now section
- **WHEN** `content/Now/` is empty
- **THEN** the Now section renders a placeholder card inviting the author to add a track

### Requirement: Featured section auto-partitioning

The Featured section MUST query `allFiles` for notes with `featured: true`, group them by `featuredType`, and render each group as a labeled subsection. Subsections MUST be labeled "精选文章" (article), "项目" (project), "精选笔记" (note). Within each subsection, items MUST sort by `featuredOrder` ascending, then by `modified` date descending.

#### Scenario: Mixed featured items
- **WHEN** the vault contains one `featuredType: article` item and one `featuredType: project` item
- **THEN** the Featured section renders two labeled subsections
- **THEN** "精选文章" shows the article, "项目" shows the project

#### Scenario: Ordered featured items
- **WHEN** two articles have `featuredOrder: 2` and `featuredOrder: 1` respectively
- **THEN** the article with order 1 renders first

### Requirement: Projects section data sourcing

The Projects section MUST list every file under `content/Projects/`. Each project MUST render as a card with title, description, and a circular icon (declared via frontmatter `icon`). The section MUST label itself "项目".

#### Scenario: Projects section populated
- **WHEN** `content/Projects/` contains three files
- **THEN** the Projects section renders three cards in alphabetical order

### Requirement: Home excludes sidebar slots

The Home pageType MUST NOT render `Explorer`, `TOC`, or `Backlinks` in any slot. The Home page MUST be a single full-width column.

#### Scenario: Home without sidebar
- **WHEN** the Home page renders
- **THEN** no left or right sidebar is rendered
- **THEN** the page occupies the full content width

### Requirement: Section ordering on Home

The Home MUST render its sections in the following order: Hero, Now, Featured, Projects. A Home configuration MAY override order via a `sectionOrder` array on `index.md`.

#### Scenario: Default section order
- **WHEN** `index.md` declares `type: home` with no `sectionOrder`
- **THEN** sections render in the default order: Hero, Now, Featured, Projects

#### Scenario: Custom section order
- **WHEN** `index.md` declares `sectionOrder: [hero, featured, now, projects]`
- **THEN** sections render in the declared order
