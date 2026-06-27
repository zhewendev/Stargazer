// PageType Registry — single source of truth for Stargazer pageTypes.
//
// Per design.md D11. This module centralizes pageType metadata (name, layout,
// matcher predicate, description). Quartz emitters in quartz/plugins/pageTypes/
// read from this registry and delegate their `match` predicate to it.
//
// Adding a new pageType is a one-line addition to `pageTypeRegistry` plus a thin
// emitter. No scattered conditional logic across emitter files.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import { match } from "../../quartz/plugins/pageTypes/matchers"
import type { PageMatcher } from "../../quartz/plugins/types"
import type { GlobalConfiguration } from "../../quartz/cfg"

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
    name: "topic",
    layout: "hub",
    priority: 89,
    match: match.and(
      ({ slug }) => (slug ?? "").endsWith("/index"),
      match.frontmatter("type", (v) => v === "topic"),
    ),
    description:
      "Topic hub page; renders tabbed layout (overview / core articles / related resources) for a long-term exploration theme.",
  },
  {
    name: "resource",
    layout: "hub",
    priority: 88,
    match: match.and(
      ({ slug }) => (slug ?? "").endsWith("/index"),
      match.frontmatter("type", (v) => v === "resource"),
    ),
    description:
      "Resource collection page; renders filter tabs and two-column layout for curated external references.",
  },
  {
    name: "about",
    layout: "about",
    priority: 87,
    match: match.and(
      ({ slug }) => slug === "about",
      match.frontmatter("type", (v) => v === "about"),
    ),
    description:
      "Personal introduction page; simple long-form layout for author info and garden philosophy.",
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
  cfg?: GlobalConfiguration,
): PageTypeSpec | undefined {
  const args = { slug: fileData.slug ?? "", fileData, cfg: cfg as GlobalConfiguration }
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
  cfg?: GlobalConfiguration,
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
        (other) => other.slug && other.slug !== slug && other.slug.startsWith(folder + "/"),
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

/**
 * Enumerate all topic pages in the site.
 *
 * A "topic" is any file whose `findPageType` resolves to the `topic` spec
 * (i.e. slug ends with `/index` AND frontmatter.type === "topic"). The Drawer
 * uses this to render the Topics expandable list.
 */
export function getTopics(
  allFiles: QuartzPluginData[],
  cfg?: GlobalConfiguration,
): HubEntry[] {
  const topicSpec = getPageType("topic")
  if (!topicSpec) return []
  return allFiles
    .filter((f) => findPageType(f, cfg) === topicSpec)
    .map((f) => {
      const slug = f.slug ?? ""
      const folder = slug.replace(/\/index$/, "")
      const fm = (f.frontmatter ?? {}) as Record<string, unknown>
      const childCount = allFiles.filter(
        (other) => other.slug && other.slug !== slug && other.slug.startsWith(folder + "/"),
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

/**
 * Enumerate all resource pages in the site.
 *
 * A "resource" is any file whose `findPageType` resolves to the `resource` spec
 * (i.e. slug ends with `/index` AND frontmatter.type === "resource").
 */
export function getResources(
  allFiles: QuartzPluginData[],
  cfg?: GlobalConfiguration,
): HubEntry[] {
  const resourceSpec = getPageType("resource")
  if (!resourceSpec) return []
  return allFiles
    .filter((f) => findPageType(f, cfg) === resourceSpec)
    .map((f) => {
      const slug = f.slug ?? ""
      const folder = slug.replace(/\/index$/, "")
      const fm = (f.frontmatter ?? {}) as Record<string, unknown>
      const childCount = allFiles.filter(
        (other) => other.slug && other.slug !== slug && other.slug.startsWith(folder + "/"),
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

/**
 * Find the about page in the site.
 *
 * An "about" page is any file whose `findPageType` resolves to the `about` spec
 * (i.e. slug === "about" AND frontmatter.type === "about").
 */
export function getAbout(
  allFiles: QuartzPluginData[],
  cfg?: GlobalConfiguration,
): HubEntry | undefined {
  const aboutSpec = getPageType("about")
  if (!aboutSpec) return undefined
  const f = allFiles.find((f) => findPageType(f, cfg) === aboutSpec)
  if (!f) return undefined
  const slug = f.slug ?? ""
  const fm = (f.frontmatter ?? {}) as Record<string, unknown>
  return {
    folder: slug,
    href: "/" + slug,
    title: (fm.title as string) ?? slug,
    description: fm.description as string | undefined,
    childCount: 0,
  }
}

export interface HubStats {
  /** Number of child pages (non-index, non-hub files in hub scope). */
  notes: number
  /** Number of child pages with type: topic. */
  topics: number
  /** Number of unique tags across all child pages. */
  tags: number
  /** Number of unique series values across all child pages. */
  series: number
  /** Total outbound wiki-links + external links across all child pages. */
  links: number
}

/**
 * Compute stats for a hub page by counting its child pages' attributes.
 *
 * Stats are computed at build time from the hub's child pages:
 * - `notes`: child pages (non-index, non-hub files in hub scope)
 * - `topics`: child pages with `type: topic`
 * - `tags`: unique tags across all child pages
 * - `series`: unique `series` values across all child pages
 * - `links`: total outbound wiki-links + external links across all child pages
 */
export function getHubStats(
  hubFile: QuartzPluginData,
  allFiles: QuartzPluginData[],
): HubStats {
  const slug = hubFile.slug ?? ""
  const folder = slug.replace(/\/index$/, "")

  const children = allFiles.filter(
    (f) =>
      f.slug !== slug &&
      f.slug?.startsWith(folder + "/") &&
      !f.slug?.endsWith("/index"),
  )

  const tagSet = new Set<string>()
  const seriesSet = new Set<string>()
  let linkCount = 0
  let topicCount = 0

  for (const child of children) {
    const fm = (child.frontmatter ?? {}) as Record<string, unknown>

    // Count tags
    const tags = fm.tags
      ? Array.isArray(fm.tags)
        ? fm.tags
        : String(fm.tags).split(",").map((t: string) => t.trim())
      : []
    for (const tag of tags) {
      if (tag) tagSet.add(tag)
    }

    // Count series
    const series = fm.series
      ? Array.isArray(fm.series)
        ? fm.series
        : [String(fm.series)]
      : []
    for (const s of series) {
      if (s) seriesSet.add(s)
    }

    // Count topics (child pages with type: topic)
    if (fm.type === "topic") {
      topicCount++
    }

    // Link counting is deferred to a future phase (requires markdown parsing)
  }

  return {
    notes: children.length,
    topics: topicCount,
    tags: tagSet.size,
    series: seriesSet.size,
    links: linkCount,
  }
}
