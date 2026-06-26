## ADDED Requirements

### Requirement: Article Sidebar Three-Zone Layout
The article page MUST render a right-rail sidebar containing three zones: TOC, metadata, and knowledge connections.

#### Scenario: Article with all sidebar zones
- **WHEN** a user views an article page
- **THEN** the sidebar MUST render in this order: 目录 (TOC from headings), 本文信息 (status/tags/dates), 知识连接 (backlinks + mini graph)

#### Scenario: Article without backlinks
- **WHEN** an article has no incoming backlinks
- **THEN** the knowledge connections zone MUST show a "暂无反向链接" placeholder rather than failing

### Requirement: Article Metadata Display
The 本文信息 zone MUST display article status, tags, and dates from frontmatter.

#### Scenario: Status badge display
- **WHEN** article frontmatter contains a `status` field with value `growing`
- **THEN** the sidebar MUST display a status badge labeled `growing`

#### Scenario: Tag list display
- **WHEN** article frontmatter contains a `tags` array
- **THEN** the sidebar MUST display each tag as a clickable link to the tag page

#### Scenario: Date display
- **WHEN** article frontmatter contains `created` and `updated` dates
- **THEN** the sidebar MUST display both dates in `YYYY-MM-DD` format with Chinese labels (创建 / 更新)

### Requirement: Knowledge Connections Zone
The 知识连接 zone MUST list backlinks and render a mini scoped graph.

#### Scenario: Backlinks list
- **WHEN** one or more notes link to the current article
- **THEN** the zone MUST list each linking note's title as a clickable link

#### Scenario: Mini scoped graph
- **WHEN** the article has any connected notes (backlinks or forward links)
- **THEN** the zone MUST render a small (≤200px height) force-directed graph showing the current article and its direct neighbors

#### Scenario: No connections
- **WHEN** the article has no connected notes
- **THEN** the mini graph zone MUST be hidden entirely (not show empty state)

### Requirement: Sidebar Responsive Behavior
The sidebar MUST adapt to mobile viewports by reordering below the article content.

#### Scenario: Mobile viewport
- **WHEN** viewport width is ≤375px
- **THEN** the sidebar MUST render below the article body, not beside it