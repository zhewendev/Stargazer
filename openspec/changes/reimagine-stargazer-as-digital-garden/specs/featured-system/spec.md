# Featured System

The Featured system surfaces curated content on the Home page and within Hub sections. Items are partitioned by `featuredType` so different content shapes (articles, projects, notes) never collide in the same list. The third bucket uses the schema value `note` and the display label "精选笔记" to avoid schema/label conflation with `status: evergreen`.

## ADDED Requirements

### Requirement: Featured flag semantics

A note opts into featuring by setting `featured: true`. The flag MUST be honored by the Home pageType and any Hub section whose filter includes `featured: true`. The flag MUST NOT auto-promote a note anywhere else.

#### Scenario: Featured note on Home
- **WHEN** a note has `featured: true` and `featuredType: article`
- **THEN** the note appears in the Home page's "精选文章" subsection

#### Scenario: Non-featured note omitted
- **WHEN** a note does not declare `featured: true`
- **THEN** the note MUST NOT appear in any Featured section on Home or Hubs

### Requirement: FeaturedType partitioning

Featured items MUST be partitioned by `featuredType` into three buckets: `article`, `project`, `note`. Each bucket renders as its own labeled subsection with labels "精选文章", "项目", "精选笔记" respectively. A note missing `featuredType` MUST be excluded from all Featured rendering (and the build MUST fail if `featured: true` is set without `featuredType`).

#### Scenario: Three featured types
- **WHEN** the vault contains one featured article, one featured project, and one featured note
- **THEN** the Home Featured section renders three labeled subsections in order: 精选文章, 项目, 精选笔记

#### Scenario: Missing featuredType
- **WHEN** a note has `featured: true` but no `featuredType`
- **THEN** the build MUST fail with a clear error

### Requirement: Featured sort order

Within each `featuredType` bucket, items MUST sort by `featuredOrder` ascending; items lacking `featuredOrder` MUST sort after items that declare it, ordered by `modified` date descending.

#### Scenario: Explicit ordering wins
- **WHEN** two articles have `featuredOrder: 2` and `featuredOrder: 1` respectively
- **THEN** order 1 renders first

#### Scenario: Fallback to date
- **WHEN** two articles both lack `featuredOrder`
- **THEN** the more recently modified one renders first

### Requirement: Featured in Hub sections

A Hub section whose filter includes `featured: true` MUST surface matching featured items alongside non-featured items (matching the rest of the filter). The Featured flag is additive, not exclusive, when used inside Hub filters.

#### Scenario: Hub section filtering featured
- **WHEN** a Hub section has `filter: { featured: true, tags: [android] }`
- **THEN** the section shows Android-tagged notes that are also featured

### Requirement: Card variant per featuredType (D20)

Featured cards MUST render with a distinct visual variant per `featuredType`, and the variant MUST carry a `StatusChip` (D18) when the note declares a status:

| Type | Layout | Icon style | Status chip |
|---|---|---|---|
| `article` | vertical card; cover image on top (if `cover` set), title, description | (cover-driven) | yes |
| `project` | horizontal card; 48px circular icon on the left, title + description on the right | circular icon, accent-tinted background | yes |
| `note` | compact card; small icon, title, modified date | 16px icon, no description | yes |

The differentiation is data-driven from `featuredType`, never from arbitrary per-note styling fields.

#### Scenario: Article card variant
- **WHEN** a featured item has `featuredType: article` and a cover image
- **THEN** the rendered card shows the cover image at the top, then title, then description
- **THEN** the card's meta row shows the `StatusChip` for the note's status

#### Scenario: Project card variant
- **WHEN** a featured item has `featuredType: project` and `icon: ./icon.svg`
- **THEN** the rendered card shows the icon in a circular frame on the left, then title, then description
- **THEN** the card's meta row shows the `StatusChip` and (optionally) a "Featured" badge

#### Scenario: Note card variant
- **WHEN** a featured item has `featuredType: note`
- **THEN** the rendered card shows a small note icon, title, and modified date; no description
- **THEN** the card's meta row shows the `StatusChip`

### Requirement: Featured and status are orthogonal (D21)

The `featured` and `status` fields are independent. The system MUST accept any combination without error:

- `featured: true` + `status: seed` — valid (a freshly drafted note that the author wants to feature)
- `featured: true` + `status: growing` — valid
- `featured: true` + `status: evergreen` — valid
- `featured: true` + `status: complete` — valid
- `status` declared without `featured` — valid (the note has a maturity stage but isn't curated)
- `featured: true` without `status` — valid; the chip does not render on this note

Validation of `featured` (requires `featuredType`) MUST NOT depend on validation of `status` (must be one of the four values), and vice versa.

#### Scenario: Featured seed note
- **WHEN** a note declares `featured: true, featuredType: article, status: seed`
- **THEN** the build succeeds
- **THEN** the note appears in the Featured section with the seed chip visible

#### Scenario: Featured without status
- **WHEN** a note declares `featured: true, featuredType: project` without `status`
- **THEN** the build succeeds
- **THEN** the note appears in the Featured section without a status chip
