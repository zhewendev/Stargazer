// CoreTopicsGrid — grid of `type: topic` child pages for Knowledge Hub.
//
// Renders child pages that have `type: topic` as cards with title + note count.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { resolveRelative, FullSlug } from "../../../quartz/util/path"

interface CoreTopicsGridProps {
  hubSlug: string
  allFiles: QuartzPluginData[]
}

export function CoreTopicsGrid({ hubSlug, allFiles }: CoreTopicsGridProps) {
  // Find child pages with type: topic
  const topics = allFiles.filter((f) => {
    const slug = f.slug ?? ""
    const fm = (f.frontmatter ?? {}) as Record<string, unknown>
    return (
      slug.startsWith(hubSlug + "/") &&
      slug !== hubSlug + "/index" &&
      fm.type === "topic"
    )
  })

  if (topics.length === 0) return null

  return (
    <div class="core-topics-grid">
      {topics.map((topic) => {
        const fm = (topic.frontmatter ?? {}) as Record<string, unknown>
        const title = (fm.title as string) ?? topic.slug?.split("/").pop() ?? ""
        const description = (fm.description as string) ?? ""

        // Count child pages of this topic
        const topicSlug = topic.slug ?? ""
        const childCount = allFiles.filter(
          (f) => f.slug?.startsWith(topicSlug + "/") && f.slug !== topicSlug + "/index",
        ).length

        return (
          <a key={topic.slug} class="core-topic-card" href={"/" + topic.slug}>
            <h3 class="core-topic-title">{title}</h3>
            {description && <p class="core-topic-desc">{description}</p>}
            <span class="core-topic-count">{childCount} 笔记</span>
          </a>
        )
      })}
    </div>
  )
}
