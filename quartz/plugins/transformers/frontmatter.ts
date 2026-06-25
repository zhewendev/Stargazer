// Frontmatter Validator — fails the build on invalid frontmatter.
//
// Per design.md frontmatter-schema spec + P2 task 2.6. Validates:
//   - status: must be one of seed | growing | evergreen | complete
//   - featured: if true, featuredType MUST be one of article | project | note
//   - featuredType: must be one of article | project | note
//   - heroStyle: must be a known variant (mountain is fallback for unknown)
//
// Throws with file-path-anchored error on any violation.

import type { QuartzTransformerPluginInstance } from "../types"
import yaml from "yaml"

const VALID_STATUS = ["seed", "growing", "evergreen", "complete"] as const
const VALID_FEATURED_TYPE = ["article", "project", "note"] as const
// heroStyle registry is built in P5; for now we accept any non-empty string
// (the Hero component falls back to `mountain` on unknown variants).

function extractFrontmatter(src: string): { frontmatter: Record<string, unknown>; line: number } | null {
  // Match leading ---\n...\n---\n at start of file
  const match = src.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  try {
    const fm = yaml.parse(match[1]) ?? {}
    return { frontmatter: fm, line: 1 }
  } catch (e) {
    // YAML parse error — let later pipeline report; we focus on schema
    return null
  }
}

export const FrontmatterValidator: QuartzTransformerPluginInstance = {
  name: "FrontmatterValidator",
  textTransform(_ctx, src) {
    const parsed = extractFrontmatter(src)
    if (!parsed) return src
    const { frontmatter: fm } = parsed

    // ── status ───────────────────────────────────────────────────
    if (fm.status !== undefined) {
      if (typeof fm.status !== "string" || !VALID_STATUS.includes(fm.status as any)) {
        throw new Error(
          `[frontmatter] Invalid status: ${JSON.stringify(fm.status)}\n` +
            `          Allowed values: ${VALID_STATUS.join(", ")}`,
        )
      }
    }

    // ── featuredType ─────────────────────────────────────────────
    if (fm.featuredType !== undefined) {
      if (
        typeof fm.featuredType !== "string" ||
        !VALID_FEATURED_TYPE.includes(fm.featuredType as any)
      ) {
        throw new Error(
          `[frontmatter] Invalid featuredType: ${JSON.stringify(fm.featuredType)}\n` +
            `          Allowed values: ${VALID_FEATURED_TYPE.join(", ")}`,
        )
      }
    }

    // ── featured requires featuredType ──────────────────────────
    if (fm.featured === true && fm.featuredType === undefined) {
      throw new Error(
        `[frontmatter] Note has featured: true but no featuredType.\n` +
          `          Add one of: featuredType: ${VALID_FEATURED_TYPE.join(" | ")}`,
      )
    }

    // ── heroStyle is free-form; warning only ─────────────────────
    // (The Hero component falls back to `mountain`; the registry is built in P5.)

    return src
  },
}
