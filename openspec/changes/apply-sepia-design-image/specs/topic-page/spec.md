## ADDED Requirements

### Requirement: Topic Page Layout Structure
A Topic page MUST render four zones in order: topic hero, learning path timeline, core articles grid, and related topics section.

#### Scenario: Topic page with all zones
- **WHEN** a topic page has frontmatter with title, description, learningPath, and coreArticles
- **THEN** the page MUST render hero → learning path → core articles grid → related topics in that vertical order

#### Scenario: Topic page missing zones
- **WHEN** a topic page frontmatter lacks `coreArticles`
- **THEN** the core articles grid zone MUST be hidden without placeholder text

### Requirement: Topic Hero Zone
The hero zone MUST display topic name, description, and counters (笔记 / 工具 / 案例).

#### Scenario: Hero content
- **WHEN** a topic page renders
- **THEN** the hero MUST show: topic name as `<h1>`, description paragraph, and three counter badges showing computed counts

### Requirement: Core Articles Grid
The core articles grid MUST display featured notes for the topic.

#### Scenario: Article cards
- **WHEN** the `coreArticles` frontmatter field lists note slugs
- **THEN** the grid MUST render one card per slug with title, summary (from frontmatter `description` or first paragraph), and link

#### Scenario: Maximum 6 cards
- **WHEN** `coreArticles` lists more than 6 entries
- **THEN** the grid MUST show only the first 6 with a "查看更多 →" link to the topic's full listing

### Requirement: Related Topics Section
The related topics section MUST display up to 4 related topics as cards.

#### Scenario: Related topics rendering
- **WHEN** a topic's frontmatter contains a `relatedTopics` array
- **THEN** the section MUST render up to 4 related topic cards with name and one-line description