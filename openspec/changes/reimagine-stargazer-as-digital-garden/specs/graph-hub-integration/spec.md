# Graph × Hub Integration

The Graph view is the global navigation surface for the vault's link structure. Hub pages integrate with the Graph in two ways: (a) hubs become prominent nodes in the global graph, (b) Hub pages may render a scoped mini-graph as a section.

## ADDED Requirements

### Requirement: Hubs appear in the global graph

Every Hub page MUST appear as a node in the global Graph view. Hubs MUST appear as nodes because (a) the Hub's `index.md` is a regular Quartz page (so it has a slug), and (b) Hub pages MUST be wikilinked from the root knowledge tree (drawer) and from member notes via tags.

#### Scenario: Hub node existence
- **WHEN** the global Graph view renders
- **THEN** every Hub page (e.g., `/Knowledge/Android`, `/Projects`) is present as a node

#### Scenario: Hub linked from members
- **WHEN** a note under `Knowledge/Android/Framework/` is opened
- **THEN** its tag `android` references the Hub; the graph shows an edge between the note and the Hub node

### Requirement: Hub node prominence

Hub nodes MUST render with larger radius (1.6× default) and MUST use `var(--accent-primary)` fill in light mode and `var(--status-evergreen)` fill in dark mode. Non-hub nodes MUST render at default size and color.

#### Scenario: Hub node rendering
- **WHEN** the global Graph view renders
- **THEN** Hub nodes are visibly larger and accent-colored
- **THEN** regular note nodes are default-sized and neutral-colored

### Requirement: Hub-scoped graph section

A Hub section with `type: graph` MUST render a scoped graph view containing only nodes that match the section's filter, plus their direct wikilink neighbors. The scoped graph MUST use the existing `graph` plugin's renderer with a pre-filtered node list.

#### Scenario: Scoped graph filter
- **WHEN** a Hub has a graph section with `filter: { tags: [android] }`
- **THEN** the rendered graph shows only Android-tagged notes plus their immediate wikilink neighbors

#### Scenario: Scoped graph isolation
- **WHEN** the same graph section is viewed
- **THEN** notes without `tags: [android]` and no direct link to an Android note MUST NOT appear

### Requirement: Scoped graph dimensions

A scoped graph section MUST respect the `height` field (default 320px) and MUST occupy the full width of its container. It MUST be keyboard-focusable and MUST expose an `aria-label` describing the graph's scope.

#### Scenario: Graph height
- **WHEN** a graph section declares `height: 480px`
- **THEN** the SVG container has `height: 480px`

#### Scenario: Graph accessibility
- **WHEN** a screen reader encounters the scoped graph
- **THEN** it announces an `aria-label` of the form "Graph scoped to: <hub title>"

### Requirement: Scoped graph interactions

A scoped graph MUST support the same interactions as the global graph: hover highlights neighbors, click navigates to the node's page, drag repositions nodes. It MUST NOT introduce new interactions that conflict with the global graph's behavior.

#### Scenario: Scoped graph hover
- **WHEN** the user hovers a node in a scoped graph
- **THEN** the node's direct neighbors highlight, identical to the global graph behavior

#### Scenario: Scoped graph navigation
- **WHEN** the user clicks a node in a scoped graph
- **THEN** the browser navigates to that node's page using Quartz's SPA transition
