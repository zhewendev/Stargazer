// PageType Registry — single source of truth for Stargazer pageTypes.
//
// Per design.md D11. This module centralizes pageType metadata (name, layout,
// matcher predicate, description). Quartz emitters in quartz/plugins/pageTypes/
// read from this registry and delegate their `match` predicate to it.
//
// Adding a new pageType is a one-line addition to `pageTypeRegistry` plus a thin
// emitter. No scattered conditional logic across emitter files.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import { match, type PageMatcher } from "../../quartz/plugins/pageTypes/matchers"

export interface PageTypeSpec {
  /** Stable identifier; matches `quartz.config.yaml layout.byPageType.<key>`. */
  name: string
  /** Key into `quartz.config.yaml layout.byPageType`. */
  layout: string
  /** Composable predicate; built from `match` helpers in `pageTypes/matchers.ts`. */
  match: PageMatcher
  /** Priority for tie-breaking when multiple pageTypes match. Higher wins. */
  priority?: number
  /** Human-readable description; surfaced in docs and audits. */
  description: string
}

/**
 * The canonical list of Stargazer pageTypes.
 *
 * Order matters: the dispatcher iterates in registration order. Quartz's
 * built-in `content` pageType is the fallback and must come last. Our
 * `home` and `hub` pageTypes win when applicable.
 */
export const pageTypeRegistry: PageTypeSpec[] = [
  {
    name: "home",
    layout: "home",
    priority: 100,
    match: match.and(
      ({ slug }) => slug === "index",
      match.frontmatter("type", (v) => v === "home"),
    ),
    description:
      "Root index page; composes Hero+Now+Featured+Projects from frontmatter + allFiles.",
  },
  {
    name: "hub",
    layout: "hub",
    priority: 90,
    match: match.and(
      ({ slug }) => (slug ?? "").endsWith("/index"),
      match.frontmatter("type", (v) => v === "hub"),
    ),
    description:
      "Wikipedia-Portal-style landing page; renders declarative `sections` from index.md.",
  },
  {
    name: "graph",
    layout: "graph",
    priority: 80,
    match: ({ slug }) => slug === "graph",
    description:
      "Standalone knowledge atlas page; full-width global graph with related notes and recent updates.",
  },
]

/**
 * Resolve which pageType spec applies to a file. Returns `undefined` when no
 * spec matches, in which case Quartz's fallback `content` pageType renders.
 */
export function findPageType(
  fileData: QuartzPluginData,
  cfg?: unknown,
): PageTypeSpec | undefined {
  const args = { slug: fileData.slug ?? "", fileData, cfg }
  return pageTypeRegistry.find((spec) => spec.match(args))
}

/** Look up by name (used by emitters to read their own spec). */
export function getPageType(name: string): PageTypeSpec | undefined {
  return pageTypeRegistry.find((spec) => spec.name === name)
}

export interface HubEntry {
  /** Folder slug, with any trailing `/index` stripped. e.g. "Projects". */
  folder: string
  /** URL path derived from the folder, e.g. "/Projects". */
  href: string
  title: string
  description?: string
  /** Number of files inside the hub folder, excluding the index itself. */
  childCount: number
}

/**
 * Enumerate all hub pages in the site.
 *
 * A "hub" is any file whose `findPageType` resolves to the `hub` spec
 * (i.e. slug ends with `/index` AND frontmatter.type === "hub"). The Drawer
 * uses this to render Knowledge's expandable list without depending on a
 * specific directory path prefix — adding a new `type: hub` page anywhere
 * in `content/` will appear automatically.
 *
 * Callers that want a subset (e.g. exclude top-level nav items from the
 * Knowledge drawer) filter the returned list against their own NAV_ITEMS.
 */
export function getHubs(
  allFiles: QuartzPluginData[],
  cfg?: unknown,
): HubEntry[] {
  const hubSpec = getPageType("hub")
  if (!hubSpec) return []
  return allFiles
    .filter((f) => findPageType(f, cfg) === hubSpec)
    .map((f) => {
      const slug = f.slug ?? ""
      const folder = slug.replace(/\/index$/, "")
      const fm = (f.frontmatter ?? {}) as Record<string, unknown>
      const childCount = allFiles.filter(
        (other) => other.slug !== slug && other.slug.startsWith(folder + "/"),
      ).length
      return {
        folder,
        href: "/" + folder,
        title: (fm.title as string) ?? folder,
        description: fm.description as string | undefined,
        childCount,
      }
    })
}
