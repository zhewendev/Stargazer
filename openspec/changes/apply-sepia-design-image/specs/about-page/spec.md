## ADDED Requirements

### Requirement: About Page Layout
The About page MUST render four zones: author bio, philosophy principles, quick links grid, and contact section.

#### Scenario: About page initial render
- **WHEN** the About page loads
- **THEN** it MUST render all four zones in order: bio → principles → links → contact

### Requirement: Author Bio Zone
The bio zone MUST display name, tagline, and a personal statement, all from frontmatter.

#### Scenario: Bio content
- **WHEN** about page frontmatter contains `name: 温哲`, `tagline: Android 开发者 · AI 探索者 · 自动化实践者`, and a `bio` paragraph
- **THEN** the zone MUST render name as `<h1>`, tagline as subtitle, and bio as paragraph

### Requirement: Philosophy Principles
The principles zone MUST display four named principles with descriptions.

#### Scenario: Principles rendering
- **WHEN** frontmatter contains a `principles` array with 4 entries (each having `name`, `description`, `stage`)
- **THEN** the zone MUST render each principle as a card with name, description, and a stage indicator

#### Scenario: Principle stages
- **WHEN** a principle's `stage` is one of `Seed`, `Growing`, `Evergreen`, `Complete`
- **THEN** the stage MUST be visually marked with an icon matching the garden growth metaphor

### Requirement: Quick Links Grid
The quick links grid MUST display four link categories with examples.

#### Scenario: Link categories
- **WHEN** frontmatter contains a `quickLinks` object with 4 categories
- **THEN** each category MUST render as a column with category name and 2-3 example links

### Requirement: Contact Section
The contact section MUST list contact methods as clickable links.

#### Scenario: Contact links
- **WHEN** frontmatter contains `contacts: [{label: GitHub, url: ..., icon: github}, ...]`
- **THEN** each contact MUST render as a link with icon and label