// Content query abstraction — reusable filtering for Hub sections and Home
// sub-queries (Featured, Now, Projects).
//
// Per design.md D12. A single pure function that computes the intersection of:
//   (a) optional folder scope (hub containment, default for Hubs)
//   (b) optional tag filter with ANY/ALL semantics (default ANY)
//   (c) optional status, featured, featuredType equality predicates
//   (d) optional explicit sort + limit
//
// Used by:
//   - Hub.tsx: section rendering (one querySection per section)
//   - Home.tsx: FeaturedSection (by featuredType), NowSection (by folder),
//     ProjectsSection (by folder)

import type { QuartzPluginData } from "../../quartz/plugins/vfile"

export type FeaturedType = "article" | "note"

export interface SectionFilter {
  tags?: string[]
  /** Single status or array of statuses (OR semantics per D22). */
  status?: string | string[]
  featured?: boolean
  featuredType?: FeaturedType
  /** How multiple tags combine. Default: "any". */
  match?: "any" | "all"
}

export type SortFn = (a: QuartzPluginData, b: QuartzPluginData) => number

export interface QueryContext {
  /** Folder slug to scope to (e.g. "Knowledge/Android" or "Now"). */
  hubScope?: string
  /** Optional sort (overrides default date-desc). */
  sort?: SortFn
  /** Optional max results. */
  limit?: number
}

const DEFAULT_SORT: SortFn = (a, b) => {
  const ad = a.dates?.modified?.getTime() ?? 0
  const bd = b.dates?.modified?.getTime() ?? 0
  return bd - ad
}

function inFolderScope(file: QuartzPluginData, hubScope?: string): boolean {
  if (!hubScope) return true
  const slug = file.slug ?? ""
  // Exclude the folder's own index.md (it's metadata, not an item)
  if (slug === hubScope || slug === `${hubScope}/index`) return false
  // Match exact folder or any descendant
  return slug === hubScope || slug.startsWith(`${hubScope}/`)
}

function matchesTags(
  file: QuartzPluginData,
  tags: string[] | undefined,
  mode: "any" | "all",
): boolean {
  if (!tags || tags.length === 0) return true
  const fileTags = (file.frontmatter?.tags ?? []) as string[]
  if (mode === "all") {
    return tags.every((t) => fileTags.includes(t))
  }
  return tags.some((t) => fileTags.includes(t))
}

/**
 * Pure query function. Returns files matching all supplied predicates.
 */
export function querySection(
  allFiles: QuartzPluginData[],
  filter: SectionFilter = {},
  ctx: QueryContext = {},
): QuartzPluginData[] {
  const mode = filter.match ?? "any"

  let results = allFiles.filter((file) => {
    if (!inFolderScope(file, ctx.hubScope)) return false
    if (!matchesTags(file, filter.tags, mode)) return false

    if (filter.status !== undefined) {
      const fileStatus = (file.frontmatter?.status ?? "seed") as string
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status]
      // Empty array is an explicit filter that excludes all (D22 scenario).
      if (statuses.length === 0) return false
      if (!statuses.includes(fileStatus)) return false
    }
    if (filter.featured !== undefined) {
      const isFeatured = Boolean(file.frontmatter?.featured)
      if (isFeatured !== filter.featured) return false
    }
    if (filter.featuredType !== undefined) {
      const ft = file.frontmatter?.featuredType as string | undefined
      if (ft !== filter.featuredType) return false
    }
    return true
  })

  const sortFn = ctx.sort ?? DEFAULT_SORT
  results = [...results].sort(sortFn)

  if (ctx.limit !== undefined && ctx.limit > 0) {
    results = results.slice(0, ctx.limit)
  }

  return results
}

/** Convenience: featured partition (used by Home FeaturedSection). */
export function queryFeaturedByType(
  allFiles: QuartzPluginData[],
  featuredType: FeaturedType,
  limit?: number,
): QuartzPluginData[] {
  return querySection(
    allFiles,
    { featured: true, featuredType },
    { sort: sortByFeaturedOrder, limit },
  )
}

const sortByFeaturedOrder: SortFn = (a, b) => {
  const ao = (a.frontmatter?.featuredOrder as number | undefined) ?? Number.MAX_SAFE_INTEGER
  const bo = (b.frontmatter?.featuredOrder as number | undefined) ?? Number.MAX_SAFE_INTEGER
  if (ao !== bo) return ao - bo
  // tie-break by modified desc
  const ad = a.dates?.modified?.getTime() ?? 0
  const bd = b.dates?.modified?.getTime() ?? 0
  return bd - ad
}

/** Convenience: all files inside a folder (used by Now, Projects sections). */
export function queryFolder(
  allFiles: QuartzPluginData[],
  folderSlug: string,
  limit?: number,
): QuartzPluginData[] {
  return querySection(allFiles, {}, { hubScope: folderSlug, limit })
}

// ============================================================================
// New query functions (Priority 2.2)
// ============================================================================

/** All files in a topic's scope (excludes the topic's own index.md). */
export function queryByTopic(
  allFiles: QuartzPluginData[],
  topicSlug: string,
  limit?: number,
): QuartzPluginData[] {
  return querySection(allFiles, {}, { hubScope: topicSlug, limit })
}

/** All files under any Knowledge/ hub. */
export function queryKnowledge(
  allFiles: QuartzPluginData[],
  limit?: number,
): QuartzPluginData[] {
  const knowledgeFiles = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    return slug.startsWith("Knowledge/") && !slug.endsWith("/index")
  })
  const sorted = [...knowledgeFiles].sort(DEFAULT_SORT)
  return limit ? sorted.slice(0, limit) : sorted
}

/** All files under any Resources/ hub. */
export function queryResources(
  allFiles: QuartzPluginData[],
  limit?: number,
): QuartzPluginData[] {
  const resourceFiles = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    return slug.startsWith("Resources/") && !slug.endsWith("/index")
  })
  const sorted = [...resourceFiles].sort(DEFAULT_SORT)
  return limit ? sorted.slice(0, limit) : sorted
}

/** All `featured: true` files, sorted by `featuredOrder`. */
export function queryFeatured(
  allFiles: QuartzPluginData[],
  limit?: number,
): QuartzPluginData[] {
  return querySection(allFiles, { featured: true }, { sort: sortByFeaturedOrder, limit })
}

/** Recent files, sorted by modified date descending. */
export function queryRecent(
  allFiles: QuartzPluginData[],
  limit?: number,
): QuartzPluginData[] {
  const sorted = [...allFiles].sort(DEFAULT_SORT)
  return limit ? sorted.slice(0, limit) : sorted
}

/** Resources filtered by `resource-type` frontmatter field. */
export function queryResourceByType(
  allFiles: QuartzPluginData[],
  resourceType?: string,
  limit?: number,
): QuartzPluginData[] {
  let results = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    if (!slug.startsWith("Resources/") || slug.endsWith("/index")) return false
    if (resourceType) {
      const rt = (f.frontmatter?.["resource-type"] ?? "") as string
      return rt === resourceType
    }
    return true
  })
  const sorted = [...results].sort(DEFAULT_SORT)
  return limit ? sorted.slice(0, limit) : sorted
}

// ============================================================================
// Hub/Topic ownership helper
// ============================================================================

/**
 * Find the nearest enclosing hub or topic that owns a given file.
 *
 * Returns the slug of the closest parent hub/topic (e.g. "Knowledge/Android"
 * or "Projects/ai-workflow"), or undefined if the file is top-level or not
 * inside any hub/topic scope.
 *
 * Computation is O(hubs × files) — acceptable for current scale (~24 files).
 */
export function getOwningHub(
  file: QuartzPluginData,
  allFiles: QuartzPluginData[],
): string | undefined {
  const slug = file.slug ?? ""
  // Collect all hub/topic index slugs (e.g. "Knowledge/Android/index", "Projects/index")
  const hubSlugs = allFiles
    .filter((f) => {
      const s = f.slug ?? ""
      const fm = (f.frontmatter ?? {}) as Record<string, unknown>
      return (
        s.endsWith("/index") &&
        (fm.type === "hub" || fm.type === "topic" || fm.type === "resource")
      )
    })
    .map((f) => f.slug ?? "")

  // Find the longest matching hub scope (most specific)
  let best: string | undefined
  for (const hubSlug of hubSlugs) {
    const folder = hubSlug.replace(/\/index$/, "")
    if (slug.startsWith(folder + "/") && slug !== hubSlug) {
      if (!best || folder.length > best.length) {
        best = folder
      }
    }
  }
  return best
}
