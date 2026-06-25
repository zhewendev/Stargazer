# Status System

The Status system implements the digital-garden note-maturity lifecycle. Every note can declare its stage of development (`seed | growing | evergreen | complete`) so readers know what to expect.

## ADDED Requirements

### Requirement: Status field values

The `status` field MUST accept exactly four values: `seed`, `growing`, `evergreen`, `complete`. Any other value MUST cause a build failure. Omitting `status` MUST be treated as `seed` for sorting purposes, but MUST NOT render a `StatusChip` (to avoid visual noise on legacy notes).

#### Scenario: Valid status values
- **WHEN** a note declares `status: growing`
- **THEN** the note renders with the growing status chip and is sorted as growing in any maturity-ordered list

#### Scenario: Invalid status value
- **WHEN** a note declares `status: blooming`
- **THEN** the build MUST fail with a clear error listing the four allowed values

#### Scenario: Missing status
- **WHEN** a note omits `status`
- **THEN** no chip is rendered in the article header
- **THEN** the note is treated as `seed` for sorting purposes

### Requirement: StatusChip shape and color (D19)

`StatusChip` MUST render both a color AND a shape so the chip is distinguishable without color vision:

| Status | Glyph | Color token | Label |
|---|---|---|---|
| `seed` | ○ | `--status-seed` | 种子 |
| `growing` | ◐ | `--status-growing` | 生长中 |
| `evergreen` | ● | `--status-evergreen` | 常青 |
| `complete` | ◉ | `--status-complete` | 完成 |

The chip MUST expose `aria-label="状态: <label>"` so screen readers announce the full status name. The glyph is the chip's text content; the color is the chip's `color` style, driven by the `chip-status.<status>` CSS class.

#### Scenario: Growing note chip renders half-filled glyph
- **WHEN** a note has `status: growing`
- **THEN** the chip renders `◐` followed by "生长中"
- **THEN** the chip's color is `--status-growing`
- **THEN** the chip's `aria-label` reads "状态: 生长中"

#### Scenario: Evergreen note chip renders filled glyph
- **WHEN** a note has `status: evergreen`
- **THEN** the chip renders `●` followed by "常青"
- **THEN** the chip's color is `--status-evergreen`

### Requirement: StatusChip placement (D18)

`StatusChip` MUST render in four surfaces:

1. **Note header meta strip** — in the `beforeBody` slot of every content page, alongside date and reading time.
2. **Home featured cards** — in the meta row of every `article`, `project`, and `note` card on the Home page.
3. **Hub cards** — in the meta row of cards rendered by Hub `cards` sections.
4. **Metadata panel** — in the right slot of every content page, as part of a dedicated metadata panel.

#### Scenario: Chip in article header
- **WHEN** a content page renders
- **THEN** the meta strip shows: `StatusChip` · date · reading time

#### Scenario: Chip on Home featured card
- **WHEN** the Featured section renders an article card for a note with `status: growing`
- **THEN** the card's meta row shows the growing chip

#### Scenario: Chip on Hub card
- **WHEN** a Hub `cards` section renders a card for a note with `status: evergreen`
- **THEN** the card's meta row shows the evergreen chip

#### Scenario: Chip in metadata panel
- **WHEN** a content page renders
- **THEN** the right-slot metadata panel shows the status chip prominently

### Requirement: Status filter in metadata panel

The metadata panel in the right slot MUST expose a status filter with four toggleable options (种子 / 生长中 / 常青 / 完成). Toggling a filter MUST hide notes not matching the selected statuses from any list rendered in the same context (Hub sections, tag pages).

#### Scenario: Filter shows only evergreen
- **WHEN** the user enables only the 常青 filter in the metadata panel
- **THEN** all rendered lists in that page show only evergreen notes

#### Scenario: Filter persistence
- **WHEN** the user enables the 常青 filter and navigates to another Hub
- **THEN** the filter persists across navigation within the session

### Requirement: Status ordering

Maturity-ordered lists (e.g., a Hub "生长中" section) MUST order items by status: `growing` first, then `evergreen`, then `complete`, then `seed` last. Within each status, items sort by `modified` descending.

#### Scenario: Growing section ordering
- **WHEN** a section filters by `status: growing` and shows five growing notes
- **THEN** the five notes are ordered by `modified` descending

### Requirement: Status array filter (D22)

A Hub section's `filter.status` MUST accept either a single string or an array of strings. When given an array, the predicate matches if the note's status is ANY of the listed values.

#### Scenario: Single status filter
- **WHEN** a Hub section declares `filter.status: growing`
- **THEN** only notes with `status: growing` match

#### Scenario: Array status filter
- **WHEN** a Hub section declares `filter.status: [growing, evergreen]`
- **THEN** notes with `status: growing` OR `status: evergreen` match

#### Scenario: Empty status array
- **WHEN** a Hub section declares `filter.status: []`
- **THEN** no notes match (empty array is an explicit filter that excludes all)