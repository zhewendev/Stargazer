## ADDED Requirements

### Requirement: Resources Page Layout
The Resources page MUST render three zones: filter bar, resource list, and category sidebar.

#### Scenario: Resources page initial render
- **WHEN** the Resources page loads
- **THEN** it MUST display all resources grouped by category with the filter bar visible at top

### Requirement: Resource Item Schema
Each resource MUST have: title, category, tags, URL, and optional description, all from frontmatter.

#### Scenario: Resource rendering
- **WHEN** a resource's frontmatter contains `title`, `category: books`, `url`, and `tags: [Android, Framework]`
- **THEN** the resource MUST render as a card with title, category badge, tag chips, and external link icon

#### Scenario: Resource without URL
- **WHEN** a resource lacks a `url` field
- **THEN** the card MUST render without an external link icon and the title MUST be plain text

### Requirement: Category Filtering
The filter bar MUST allow filtering by category and tag.

#### Scenario: Category filter
- **WHEN** a user selects a category from the filter bar
- **THEN** only resources matching that category MUST remain visible

#### Scenario: Tag filter
- **WHEN** a user selects a tag
- **THEN** only resources tagged with that tag MUST remain visible

#### Scenario: Combined filter
- **WHEN** both a category and tag are selected
- **THEN** only resources matching both MUST be visible (AND logic)

#### Scenario: Clear filters
- **WHEN** a user clicks "清除" (Clear)
- **THEN** all filters MUST reset and all resources MUST be visible

### Requirement: Category Sidebar
The category sidebar MUST list all categories with item counts.

#### Scenario: Sidebar counts
- **WHEN** the resources page renders
- **THEN** the sidebar MUST list each category with a count badge (e.g. `书籍 26`, `工具 36`)