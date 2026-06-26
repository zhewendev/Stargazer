## ADDED Requirements

### Requirement: Mastery Frontmatter Field
The system MUST support a `mastery` frontmatter field on content notes with four allowed values: `已掌握`, `已记录`, `相关`, `未涉及`.

#### Scenario: Note with explicit mastery
- **WHEN** a note's frontmatter contains `mastery: 已掌握`
- **THEN** the system MUST classify that note as `已掌握` in all graph and aggregation contexts

#### Scenario: Note without mastery field
- **WHEN** a note's frontmatter lacks the `mastery` field
- **THEN** the system MUST default-classify it as `已记录`

#### Scenario: Invalid mastery value
- **WHEN** a note's frontmatter contains `mastery: 精通` (not in allowed set)
- **THEN** the system MUST warn at build time and treat it as `已记录` default

### Requirement: Graph Node Categorization
The knowledge graph MUST visually group nodes by mastery category.

#### Scenario: Color-coded categories
- **WHEN** the graph renders
- **THEN** nodes MUST be color-coded by mastery: `已掌握` (solid filled), `已记录` (filled outline), `相关` (dashed outline), `未涉及` (light/transparent)

#### Scenario: Category legend
- **WHEN** the graph page renders
- **THEN** a legend MUST display showing all four categories with their corresponding colors

### Requirement: Graph Filtering by Mastery
The graph view MUST allow filtering nodes by mastery level.

#### Scenario: Filter toggle
- **WHEN** a user toggles a mastery category in the legend
- **THEN** nodes of that category MUST show or hide in the graph

#### Scenario: Empty filter state
- **WHEN** all categories are toggled off
- **THEN** the graph MUST show a "请至少选择一个分类" message

### Requirement: Mastery-Aware Scoped Graph
The mini graph in article sidebars MUST respect mastery coloring.

#### Scenario: Sidebar mini graph colors
- **WHEN** an article sidebar renders its mini scoped graph
- **THEN** the mini graph MUST apply the same mastery-based color coding as the full graph page