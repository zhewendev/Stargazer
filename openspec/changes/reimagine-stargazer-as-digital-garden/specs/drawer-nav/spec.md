# Drawer Navigation

`DrawerNav` is the brand-defining navigation surface. It is inspired by veryjack.com's drawer pattern (full-height, dark surface, hierarchical tree, slide animation) but is its own design, not a copy. The drawer coexists with `Explorer` on desktop and replaces it on mobile.

## ADDED Requirements

### Requirement: Drawer trigger placement

The drawer MUST be triggerable from two contexts: (a) a ☰ icon in the leftmost position of `BrandHeader` on every viewport, and (b) the "知识库" nav link in `BrandHeader` on desktop (≥1200px). Both triggers MUST open the same drawer instance.

#### Scenario: Mobile hamburger trigger
- **WHEN** the viewport is below 800px
- **THEN** `BrandHeader` renders a ☰ icon as its leftmost element
- **THEN** clicking the icon opens the drawer

#### Scenario: Desktop knowledge link trigger
- **WHEN** the viewport is at least 1200px
- **THEN** the "知识库" nav link renders with a chevron indicator
- **THEN** clicking the link opens the drawer instead of navigating

### Requirement: Drawer dimensions per breakpoint

The drawer MUST occupy 360px width on desktop (≥1200px), 50vw on tablet (800-1199px), and 86vw on mobile (<800px). The drawer MUST always occupy the full viewport height.

#### Scenario: Desktop open drawer
- **WHEN** the drawer opens at viewport width 1440px
- **THEN** its width resolves to 360px

#### Scenario: Mobile open drawer
- **WHEN** the drawer opens at viewport width 375px
- **THEN** its width resolves to 86vw (322.5px)

### Requirement: Drawer animation

The drawer MUST slide in from the right over `var(--motion-base)` (280ms) using `cubic-bezier(.22, 1, .36, 1)` easing. A semi-transparent scrim MUST fade in behind the drawer over the same duration. Both MUST be disabled when `prefers-reduced-motion: reduce`.

#### Scenario: Drawer open transition
- **WHEN** the drawer opens
- **THEN** `transform: translateX(0)` transitions from `translateX(100%)` over 280ms

#### Scenario: Reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is set
- **THEN** the drawer appears instantly with no slide animation

### Requirement: Knowledge tree rendering

The drawer MUST render the vault's folder tree under a "知识库" section header. Each top-level folder under `content/Knowledge/` MUST be a collapsible group. Groups MUST render their child folders and notes nested. Each note link MUST show a count badge with the total notes under that node (folder + descendants).

#### Scenario: Folder with children
- **WHEN** a folder has 5 notes and 2 subfolders
- **THEN** its row renders a chevron toggle and a badge `(12)` showing total descendant count

#### Scenario: Empty folder
- **WHEN** a folder has no children
- **THEN** its row renders without a chevron toggle
- **THEN** the row is rendered as a non-clickable label

### Requirement: Drawer search

The drawer MUST include a sticky search input at the top of its scroll area. Typing MUST filter the visible navigation entries (top-level items + Knowledge hubs when expanded) to nodes whose label or slug matches the query. Clearing the input MUST restore the full navigation surface.

Navigation after search is manual: pressing Enter on the keyboard MUST navigate to the **focused** filtered result (the first match if no result is focused). Tapping a filtered result on touch viewports (<800px) MUST also navigate to that entry's page. The system MUST NOT auto-navigate as the user types.

#### Scenario: Search filters tree
- **WHEN** the user types "Android" in the drawer search input
- **THEN** the navigation surface shows only entries whose label or slug contains "Android"

#### Scenario: Search cleared
- **WHEN** the user clears the drawer search input
- **THEN** the navigation surface restores to its unfiltered state

#### Scenario: Enter navigates to focused result
- **WHEN** the user types "Android" and presses Enter with no result focused
- **THEN** the browser navigates to the first matching entry's page
- **THEN** the drawer closes after navigation

#### Scenario: Enter navigates to highlighted result
- **WHEN** the user has used arrow keys to focus a specific filtered result
- **THEN** pressing Enter navigates to that focused result (not the first match)

#### Scenario: Tap navigates on mobile
- **WHEN** a touch user (viewport <800px) taps a filtered result
- **THEN** the browser navigates to that entry's page
- **THEN** the drawer closes after navigation

#### Scenario: No auto-navigate on keystroke
- **WHEN** the user types any character
- **THEN** the drawer MUST NOT navigate automatically
- **THEN** navigation only occurs on explicit Enter or tap

### Requirement: Drawer close behaviors

The drawer MUST close when any of the following occur: clicking the ✕ button in the drawer header, clicking the scrim, pressing the ESC key, or successfully navigating to a note. Navigation-triggered close MUST occur before the page transition begins.

#### Scenario: ESC closes drawer
- **WHEN** the drawer is open and the user presses ESC
- **THEN** the drawer closes and focus returns to the trigger element

#### Scenario: Scrim click closes drawer
- **WHEN** the user clicks the scrim area outside the drawer
- **THEN** the drawer closes

### Requirement: Drawer accessibility

The drawer MUST trap focus while open. The drawer MUST expose `role="dialog"` and `aria-modal="true"` when open. The drawer MUST have an `aria-label` identifying it as "导航". All interactive elements MUST be reachable via keyboard.

#### Scenario: Focus trap
- **WHEN** the drawer is open and the user presses Tab repeatedly
- **THEN** focus cycles only within the drawer's interactive elements

#### Scenario: Screen reader announcement
- **WHEN** the drawer opens
- **THEN** assistive technology announces the dialog via `aria-modal` and `aria-label`

### Requirement: Explorer coexistence

The `Explorer` component MUST remain visible on desktop viewports (≥1200px) and MUST be hidden on viewports below 1200px. When the drawer is open on desktop, both `Explorer` and the drawer MUST be visible (drawer overlays).

#### Scenario: Desktop with drawer closed
- **WHEN** the viewport is 1440px and the drawer is closed
- **THEN** `Explorer` renders in the left slot

#### Scenario: Mobile with no Explorer
- **WHEN** the viewport is 375px
- **THEN** `Explorer` is not rendered (display: none)
- **THEN** the drawer is the only tree surface
