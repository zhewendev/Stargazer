## ADDED Requirements

### Requirement: Mobile Breakpoint Definition
The system MUST apply mobile layouts at viewport widths ≤375px.

#### Scenario: Width detection
- **WHEN** viewport width is ≤375px
- **THEN** all mobile-specific styles MUST apply
- **WHEN** viewport width is >375px
- **THEN** desktop styles MUST apply

### Requirement: Mobile Navigation
Mobile viewports MUST use a drawer-style menu instead of horizontal nav.

#### Scenario: Hamburger menu
- **WHEN** viewport width is ≤375px on any page
- **THEN** the horizontal navigation MUST be hidden and a hamburger icon MUST be visible

#### Scenario: Drawer open
- **WHEN** a user taps the hamburger icon
- **THEN** the drawer MUST slide in from the right with all navigation links

#### Scenario: Drawer close
- **WHEN** a user taps outside the drawer or the close icon
- **THEN** the drawer MUST close

### Requirement: Mobile Layout Adaptation
Multi-column desktop layouts MUST collapse to single column on mobile.

#### Scenario: Home page mobile
- **WHEN** viewport is ≤375px on the home page
- **THEN** the knowledge area cards grid MUST collapse to single column

#### Scenario: Hub page mobile
- **WHEN** viewport is ≤375px on a Hub page
- **THEN** the core topic grid MUST collapse to single column and the learning timeline MUST stack vertically

#### Scenario: Article page mobile
- **WHEN** viewport is ≤375px on an article page
- **THEN** the article body MUST take full width and the sidebar MUST move below the body

### Requirement: Mobile Touch Targets
All interactive elements MUST have a minimum 44×44px touch target on mobile.

#### Scenario: Button sizing
- **WHEN** viewport is ≤375px
- **THEN** all buttons and links MUST have padding ensuring at least 44×44px clickable area

#### Scenario: Filter chips
- **WHEN** viewport is ≤375px on the Resources page
- **THEN** filter chips MUST have sufficient padding for finger taps

### Requirement: Mobile Typography Scale
Font sizes MUST scale appropriately on mobile viewports.

#### Scenario: Heading sizes
- **WHEN** viewport is ≤375px
- **THEN** `<h1>` MUST be ≤28px, `<h2>` ≤22px, `<h3>` ≤18px

#### Scenario: Body text
- **WHEN** viewport is ≤375px
- **THEN** body text MUST remain ≥16px for readability