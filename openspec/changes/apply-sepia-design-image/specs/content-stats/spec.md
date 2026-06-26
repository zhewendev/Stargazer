## ADDED Requirements

### Requirement: Build-Time Stats Computation
The system MUST compute five content statistics at build time: notes, topics, tags, series, and links.

#### Scenario: Build-time aggregation
- **WHEN** the Quartz build runs
- **THEN** the system MUST scan all content frontmatter and produce `{ notes: N, topics: T, tags: G, series: S, links: L }` once before page generation

#### Scenario: Incremental builds
- **WHEN** only a subset of content changes between builds
- **THEN** the system MUST update only the affected counts without rescanning all files

### Requirement: Stats Data Exposure
Computed stats MUST be available to all page components as a data dependency.

#### Scenario: Component consumption
- **WHEN** any component requests stats via the component data context
- **THEN** the system MUST provide the precomputed counts without triggering a rescan

#### Scenario: Cache invalidation
- **WHEN** content frontmatter changes between builds
- **THEN** the stats cache MUST invalidate and recompute on next build

### Requirement: Stats Display Format
Stats MUST be displayable in compact and full formats.

#### Scenario: Compact format
- **WHEN** a component requests stats in compact form
- **THEN** each stat MUST render as `128` with a small Chinese label (`笔记`)

#### Scenario: Full format
- **WHEN** the homepage hero requests stats in full form
- **THEN** stats MUST render as a row of `number | label` pairs in larger typography

### Requirement: Knowledge Area Stats
Per-area note counts MUST be computable for knowledge area cards.

#### Scenario: Area count
- **WHEN** the homepage renders knowledge area cards
- **THEN** each card MUST show the count of notes within that area, computed at build time

#### Scenario: Zero-count area
- **WHEN** an area folder contains zero notes
- **THEN** the area card MUST still render but show `0 笔记` rather than hide

### Requirement: Stats Source of Truth
Stats MUST be derived from content frontmatter only — not from hardcoded values.

#### Scenario: No hardcoded counts
- **WHEN** the system generates stats
- **THEN** the counts MUST come exclusively from scanning content files
- **WHEN** a content file is added or removed
- **THEN** the corresponding counts MUST update on the next build

#### Scenario: Graph link count
- **WHEN** computing the total `links` stat
- **THEN** the system MUST count all WikiLinks across all notes, deduplicated by target