# Design Tokens

Design tokens are the SCSS variables exposed under `src/styles/tokens.scss` and consumed by every other stylesheet. Tokens are split into palette, typography, spacing, radii, shadows, and motion. All token values MUST reference the Lapis Cafe inspired palette.

## ADDED Requirements

### Requirement: Color palette tokens

The system MUST expose five palette tokens in light mode and their counterparts in dark mode: `surface-canvas`, `surface-elevated`, `accent-primary`, `text-primary`, `text-muted`. Light mode values MUST be `#F7F6F2`, `#EDE7DF`, `#C9A97E`, `#333333`, `#686868` respectively. Dark mode values MUST be `#1A1816`, `#23201D`, `#C9A97E`, `#F0ECE6`, `#9C9C9C`.

#### Scenario: Light mode background
- **WHEN** the site renders in light mode
- **THEN** `<body>` background uses `var(--surface-canvas)` which resolves to `#F7F6F2`

#### Scenario: Accent on primary buttons
- **WHEN** a primary button is rendered
- **THEN** its background uses `var(--accent-primary)` which resolves to `#C9A97E`

#### Scenario: Dark mode toggle
- **WHEN** the user toggles dark mode
- **THEN** `data-theme="dark"` on `<html>` causes every token to resolve to its dark value

### Requirement: Status color tokens

The system MUST expose four status tokens: `status-seed`, `status-growing`, `status-evergreen`, `status-complete`. Values MUST be `#9C9C9C`, `#84A59D`, `#C9A97E`, `#6B6B6B` respectively. Status tokens MUST be referenced by `StatusChip` only.

#### Scenario: Growing note chip
- **WHEN** a note has `status: growing`
- **THEN** the chip dot uses `var(--status-growing)` resolving to `#84A59D`

### Requirement: Drawer palette tokens

The system MUST expose three drawer tokens: `drawer-bg`, `drawer-fg`, `drawer-accent`. Values MUST be `#1A1816`, `#F0ECE6`, `#C9A97E`. Drawer tokens MUST be referenced by `DrawerNav` and any descendant tree-node component.

#### Scenario: Open drawer surface
- **WHEN** the drawer is open
- **THEN** its background uses `var(--drawer-bg)` resolving to `#1A1816`

### Requirement: Typography stack tokens

The system MUST expose three typography tokens: `font-display`, `font-body`, `font-mono`. Values MUST be `"Noto Sans SC", "Inter", system-ui, sans-serif`, `"Noto Sans SC", "Inter", system-ui, sans-serif`, and `"JetBrains Mono", ui-monospace, monospace` respectively.

#### Scenario: Article body text
- **WHEN** an article paragraph is rendered
- **THEN** `font-family` resolves to `var(--font-body)`

#### Scenario: Inline code
- **WHEN** an inline `<code>` is rendered
- **THEN** `font-family` resolves to `var(--font-mono)`

### Requirement: Spacing scale tokens

The system MUST expose an eight-step spacing scale: `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px), `space-12` (48px), `space-16` (64px). All component padding, margin, and gap declarations MUST reference these tokens.

#### Scenario: Card padding
- **WHEN** a featured card is rendered
- **THEN** its padding uses `var(--space-6)` resolving to 24px

### Requirement: Border radius tokens

The system MUST expose three radius tokens: `radius-sm` (6px), `radius-md` (12px), `radius-lg` (20px). Buttons and chips MUST use `radius-sm`. Cards MUST use `radius-md`. Hero illustration container MUST use `radius-lg`.

#### Scenario: Card corner
- **WHEN** a card is rendered
- **THEN** its `border-radius` uses `var(--radius-md)` resolving to 12px

### Requirement: Shadow scale tokens

The system MUST expose three shadow tokens: `shadow-flat` (none), `shadow-soft` (`0 2px 8px rgba(0,0,0,0.04)`), `shadow-elevated` (`0 8px 24px rgba(0,0,0,0.08)`). Cards MUST use `shadow-flat` at rest and `shadow-soft` on hover. The drawer MUST use `shadow-elevated` when open.

#### Scenario: Card hover
- **WHEN** a card is hovered
- **THEN** its `box-shadow` transitions to `var(--shadow-soft)`

### Requirement: Motion tokens

The system MUST expose three motion tokens: `motion-fast` (160ms), `motion-base` (280ms), `motion-slow` (480ms). All transitions MUST use `cubic-bezier(.22, 1, .36, 1)` easing. Transitions MUST be disabled when `prefers-reduced-motion: reduce`.

#### Scenario: Drawer slide
- **WHEN** the drawer opens
- **THEN** its `transform` transitions over `var(--motion-base)` (280ms)

#### Scenario: Reduced motion preference
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** every transition becomes instant (no animation)
