// CardGrid — shared card-grid implementation for folder + tag pages.
//
// Per P9 design constraints:
// - D29 folder/tag pages use this grid (not article lists)
// - D31 sort: featuredOrder → featured → updated
// - D33 shared implementation: this is the single source of truth

import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
} from "../../quartz/components/types"
import { ContentCard } from "./ContentCard"

/**
 * Sort priority (D31):
 *   1. featuredOrder (explicit number) — lower number first
 *   2. featured flag — featured items before non-featured
 *   3. modified date — most recent first
 */
function sortByFeaturedAndUpdated(a: QuartzPluginData, b: QuartzPluginData): number {
  const aOrder = a.frontmatter?.featuredOrder as number | undefined
  const bOrder = b.frontmatter?.featuredOrder as number | undefined

  // 1. featuredOrder (explicit ordering wins)
  if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder
  if (aOrder !== undefined) return -1
  if (bOrder !== undefined) return 1

  // 2. featured flag (featured items cluster at top)
  const aFeatured = Boolean(a.frontmatter?.featured)
  const bFeatured = Boolean(b.frontmatter?.featured)
  if (aFeatured && !bFeatured) return -1
  if (!aFeatured && bFeatured) return 1

  // 3. modified date (recent first)
  const aDate = a.dates?.modified?.getTime() ?? 0
  const bDate = b.dates?.modified?.getTime() ?? 0
  return bDate - aDate
}

interface CardGridProps extends QuartzComponentProps {
  limit?: number
}

export const CardGrid: QuartzComponent = ({ fileData, allFiles, limit }: CardGridProps) => {
  let list = [...allFiles].sort(sortByFeaturedAndUpdated)
  if (limit && limit > 0) {
    list = list.slice(0, limit)
  }

  if (list.length === 0) return null

  return (
    <div class="card-grid">
      {list.map((page) => (
        <ContentCard key={page.slug} page={page} fileData={fileData!} />
      ))}
    </div>
  )
}

export default (() => CardGrid) satisfies QuartzComponentConstructor