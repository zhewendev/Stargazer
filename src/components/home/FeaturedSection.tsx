// FeaturedSection — auto-partitions featured items by featuredType.
//
// Per P2.3 unification: all buckets render as ContentCard with type badge.
// No more ArticleCard/ProjectCard/NoteCard variants.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { queryFeaturedByType, type FeaturedType } from "../../lib/contentQuery"
import { SectionShell } from "./SectionShell"
import { ContentCard } from "../ContentCard"

interface FeaturedSectionProps {
  allFiles: QuartzPluginData[]
}

const BUCKETS: Array<{ type: FeaturedType; label: string }> = [
  { type: "article", label: "精选文章" },
  { type: "note", label: "精选笔记" },
]

const TYPE_LABELS: Record<FeaturedType, string> = {
  article: "Article",
  note: "Note",
}

export function FeaturedSection({ allFiles }: FeaturedSectionProps) {
  const hasAny = BUCKETS.some((b) => queryFeaturedByType(allFiles, b.type).length > 0)
  if (!hasAny) return null

  return (
    <SectionShell title="精选内容">
      {BUCKETS.map((bucket) => {
        const items = queryFeaturedByType(allFiles, bucket.type)
        if (items.length === 0) return null
        return (
          <div key={bucket.type} class="featured-subsection">
            <h3 class="featured-subsection-title">{bucket.label}</h3>
            <div class="featured-grid">
              {items.map((file) => (
                <ContentCard
                  key={file.slug}
                  page={file}
                  fileData={allFiles[0]}
                  type={TYPE_LABELS[bucket.type]}
                />
              ))}
            </div>
          </div>
        )
      })}
    </SectionShell>
  )
}
