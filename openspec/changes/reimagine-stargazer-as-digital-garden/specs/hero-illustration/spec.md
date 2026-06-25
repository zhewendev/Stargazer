# Hero Illustration System

Hero illustrations are pluggable SVG variants selected by frontmatter. The Home pageType and Hub pageType both look up the variant via the `heroStyle` field. New variants are added without code changes to the calling page.

## ADDED Requirements

### Requirement: Registry structure

The system MUST expose a registry at `src/components/heroStyles/index.ts` exporting an object whose keys are variant names (matching `heroStyle` values) and whose values are Preact components that render the SVG illustration. The registry MUST include at minimum the variants `mountain`, `ocean`, and `forest`.

#### Scenario: Registry exports
- **WHEN** `src/components/heroStyles/index.ts` is imported
- **THEN** it exports an object with at least keys `mountain`, `ocean`, `forest`
- **THEN** each value is a Preact component that renders an SVG

#### Scenario: Missing required variant
- **WHEN** the registry is built without `mountain`
- **THEN** the build MUST fail with a clear error

### Requirement: Variant selection

The Hero component MUST look up `fileData.frontmatter?.heroStyle` in the registry. If the field is missing or unknown, the component MUST fall back to `mountain` and log a warning at build time.

#### Scenario: Known variant selection
- **WHEN** `index.md` declares `heroStyle: ocean`
- **THEN** the Hero component renders the OceanSVG variant

#### Scenario: Unknown variant fallback
- **WHEN** `index.md` declares `heroStyle: galaxy` (unregistered)
- **THEN** the Hero component renders MountainSVG
- **THEN** a build-time warning lists the unknown variant name

#### Scenario: Missing variant fallback
- **WHEN** `index.md` omits `heroStyle`
- **THEN** the Hero component renders MountainSVG with no warning

### Requirement: Variant styling contract

Every registered variant MUST accept the following props: `palette` (the design-tokens palette object for the current mode) and `seed` (a string used to derive deterministic per-page variation, e.g., cloud positions). Each variant MUST render an SVG that fills its container and respects the current text/accent palette.

#### Scenario: Dark mode adaptation
- **WHEN** the user is in dark mode
- **THEN** each variant MUST render with palette tokens that work on dark surfaces (no hardcoded light-mode colors)

#### Scenario: Deterministic variation
- **WHEN** the same `seed` is passed across builds
- **THEN** the variant MUST render identically (no Math.random without seed)

### Requirement: Adding new variants

Adding a new variant MUST require only two changes: (1) create a new file in `src/components/heroStyles/` exporting a Preact component, (2) register it in `src/components/heroStyles/index.ts`. The Hero component MUST NOT require modification.

#### Scenario: Adding a "desert" variant
- **WHEN** a developer creates `src/components/heroStyles/Desert.tsx` and registers it as `desert`
- **THEN** any `index.md` declaring `heroStyle: desert` renders the new variant
- **THEN** no other component requires modification

### Requirement: Hub hero variant

The Hub pageType MUST honor `heroStyle` on the Hub's `index.md` using the same registry as Home. Hubs MUST render a smaller-scale illustration than the Home hero (50% container height by default).

#### Scenario: Hub with heroStyle: mountain
- **WHEN** a Hub's index declares `heroStyle: mountain` and `hubHero: true`
- **THEN** the Hub renders the MountainSVG at 50% of its home scale
