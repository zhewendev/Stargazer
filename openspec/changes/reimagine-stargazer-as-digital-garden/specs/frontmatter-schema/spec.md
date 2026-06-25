# Frontmatter Schema

The unified frontmatter schema is the contract between Obsidian authoring and Quartz rendering. Every field below MUST be honored by the Home pageType, Hub pageType, FeaturedSystem, StatusSystem, HeroIllustration registry, and Graph component.

## ADDED Requirements

### Requirement: Universal identity fields

Every note MUST support `title`, `description`, `tags`, and `aliases`. The system SHALL treat missing `title` as a build error for non-folder notes. The system SHALL treat missing `description` as a build error for any note with `featured: true`.

#### Scenario: Note with all identity fields
- **WHEN** a note declares `title`, `description`, and `tags`
- **THEN** the note renders with the declared title in H1, the description in the metadata strip, and tags as filter chips

#### Scenario: Missing title on a regular note
- **WHEN** a note omits `title`
- **THEN** the build MUST fail with a clear error referencing the file path

#### Scenario: Missing description on a featured note
- **WHEN** a note has `featured: true` but no `description`
- **THEN** the build MUST fail with a clear error referencing the file path

### Requirement: Status field

Every note MUST support an optional `status` field with one of four values: `seed`, `growing`, `evergreen`, `complete`. The system SHALL render a `StatusChip` for every note whose `status` is set, and SHALL treat omitted `status` as `seed` for sorting purposes only (no chip rendered).

#### Scenario: Note with status: growing
- **WHEN** a note declares `status: growing`
- **THEN** the article header renders a `StatusChip` with the growing visual treatment

#### Scenario: Note with omitted status
- **WHEN** a note omits `status`
- **THEN** no `StatusChip` is rendered in the article header
- **THEN** the note is treated as `seed` when sorting by maturity

#### Scenario: Note with invalid status value
- **WHEN** a note declares `status` to any value other than `seed | growing | evergreen | complete`
- **THEN** the build MUST fail with a clear error listing the allowed values

### Requirement: Featured system fields

A note MAY opt into featuring via `featured: true`. When `featured: true` is set, the note MUST also declare `featuredType` as one of `article`, `project`, or `note`. The note MAY declare `featuredOrder: number` for explicit sort position.

#### Scenario: Featured article
- **WHEN** a note declares `featured: true` and `featuredType: article`
- **THEN** the Home pageType renders this note in the "精选文章" section
- **THEN** any Hub page whose `sections` filter matches this note renders it in its declared section

#### Scenario: Featured without featuredType
- **WHEN** a note declares `featured: true` without `featuredType`
- **THEN** the build MUST fail with a clear error

#### Scenario: Featured item with featuredOrder
- **WHEN** two featured items of the same `featuredType` both declare `featuredOrder`
- **THEN** the lower number renders first; ties break by `modified` date descending

### Requirement: Hero illustration field

Any note (typically `index.md` for Home or Hubs) MAY declare `heroStyle` as a string identifying a registered illustration variant. The Home and Hub pageTypes SHALL look up the variant in the HeroIllustration registry and render the matching SVG. Unknown variants MUST fall back to `mountain`.

#### Scenario: Index with heroStyle: mountain
- **WHEN** `index.md` declares `heroStyle: mountain`
- **THEN** the Hero component renders the `MountainSVG` variant from the registry

#### Scenario: Index with unknown heroStyle
- **WHEN** `index.md` declares `heroStyle: galaxy` (unregistered)
- **THEN** the Hero component renders the `MountainSVG` fallback
- **THEN** a warning is logged at build time listing the unknown variant

### Requirement: Hub configuration fields

A folder `index.md` MAY declare `type: hub` to mark its folder as a Hub page. When `type: hub` is set, the note MUST declare a `sections` array describing how the Hub renders its content. The note MAY also declare `hubHero: false` to suppress the hub hero (default `true`).

#### Scenario: Folder index declared as hub
- **WHEN** a folder's `index.md` declares `type: hub`
- **THEN** the Hub pageType renders this folder instead of the default FolderPage

#### Scenario: Hub with hubHero disabled
- **WHEN** a Hub's `index.md` declares `hubHero: false`
- **THEN** the Hub renders only its sections, skipping the hero block

#### Scenario: Hub with no sections declared
- **WHEN** a Hub's `index.md` declares `type: hub` with empty `sections`
- **THEN** the Hub renders an empty body with a console warning suggesting section DSL examples

### Requirement: Home configuration fields

The Home page's `index.md` MUST declare `type: home`. Hero copy (subtitle, tagline, CTA labels and URLs) MUST live in `content/Home/hero.md` so future edits do not require code changes. The Home `index.md` MAY declare `heroStyle` to select the Hero illustration variant.

#### Scenario: Home pageType activation
- **WHEN** `content/index.md` declares `type: home`
- **THEN** the Home pageType renders instead of the default content page
- **THEN** `content/Home/hero.md` is read for hero copy and CTA configuration

#### Scenario: Hero CTA configuration
- **WHEN** `content/Home/hero.md` declares two CTAs in frontmatter
- **THEN** the Hero component renders both CTAs as buttons in the declared order
