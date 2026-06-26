## ADDED Requirements

### Requirement: Learning Timeline Rendering
The system MUST render a horizontal stepper component visualizing a sequential learning path from data provided in frontmatter.

#### Scenario: Hub page with full learning path
- **WHEN** a Hub page's frontmatter contains a `learningPath` array with 3 or more entries
- **THEN** the system MUST render a horizontal stepper with each entry as a connected node, ordered as in the array

#### Scenario: Topic page with topic-specific path
- **WHEN** a Topic page's frontmatter contains a `learningPath` array
- **THEN** the system MUST render the same stepper component on the topic page, scoped to that topic's path

#### Scenario: Empty or missing learning path
- **WHEN** a page's frontmatter lacks a `learningPath` field or the array is empty
- **THEN** the system MUST NOT render the stepper component and MUST NOT show an empty placeholder

### Requirement: Learning Timeline Node Data
Each stepper node MUST display a label and link to a target note, both sourced from frontmatter.

#### Scenario: Node with label and link
- **WHEN** a `learningPath` entry contains `{ label: "Linux 内核", slug: "linux-kernel" }`
- **THEN** the rendered node MUST display "Linux 内核" as text and link to the note at slug `linux-kernel`

#### Scenario: Optional status indicator
- **WHEN** a `learningPath` entry contains an optional `status` field with value `current`
- **THEN** the system MUST visually mark that node as the current step in the progression

### Requirement: Learning Timeline Responsive Layout
The stepper MUST remain readable on mobile (≤375px) viewports.

#### Scenario: Mobile viewport adaptation
- **WHEN** viewport width is ≤375px
- **THEN** the stepper MUST collapse to a vertical list while preserving node labels and links

#### Scenario: Desktop viewport
- **WHEN** viewport width is >375px
- **THEN** the stepper MUST render horizontally with connecting lines between nodes