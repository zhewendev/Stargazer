// HeroStyle registry — pluggable SVG variants for Home Hero and Hub Hero.
//
// Per design.md D26 (extensible without modifying Hero.tsx), D28 (graph
// reserved for Phase C). Backed by the generic ThemeRegistry factory
// (src/lib/themeRegistry.ts) so the same pattern is available for future
// variant systems (cards, buttons, etc.).
//
// Adding a new variant:
//   1. Implement a new file in this directory (e.g. Ocean.tsx)
//   2. Add `ocean: OceanStyle` to the `variants` object below
// No changes to Hero.tsx or HubHero.tsx required.

import type { JSX } from "preact"
import { MountainStyle } from "./Mountain"
import { createThemeRegistry } from "../../lib/themeRegistry"

export interface HeroPalette {
  accent: string
  text: string
  muted: string
  surface: string
  surfaceElevated: string
}

export interface HeroStyleProps {
  palette: HeroPalette
  /** Deterministic seed; same seed = same composition. */
  seed: string
  /** Target height in pixels. Caller may pass ~240–280 per D23. */
  height: number
}

export type HeroStyleComponent = (props: HeroStyleProps) => JSX.Element

/** Hero variants. Add new variants here, one entry per line. */
const heroVariants: Record<string, HeroStyleComponent> = {
  mountain: MountainStyle,
  // Phase B (paused per user direction — content discovery > hero variety):
  // ocean: OceanStyle,
  // forest: ForestStyle,
}

/** Variants declared for future implementation. */
const reservedVariants = ["graph"] // Phase C — graph hub variant (group 14 follow-up)

export const heroRegistry = createThemeRegistry<HeroStyleComponent>({
  name: "hero",
  variants: heroVariants,
  reserved: reservedVariants,
  fallback: MountainStyle,
})

/** Convenience for Hero.tsx / HubHero.tsx — wraps `heroRegistry.lookup`. */
export function getHeroStyle(name: string | undefined): HeroStyleComponent {
  return heroRegistry.lookup(name)
}

/** List registered variant names (for docs / introspection). */
export function listHeroStyles(): string[] {
  return heroRegistry.list()
}

/** List reserved (declared but unimplemented) variant names. */
export function listReservedHeroStyles(): string[] {
  return heroRegistry.listReserved()
}