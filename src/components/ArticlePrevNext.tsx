// ArticlePrevNext — previous/next navigation for article pages.
//
// Shows "← 上一篇" and "下一篇 →" links based on sorted article order.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { resolveRelative, FullSlug } from "../../quartz/util/path"

function safeSlug(slug: unknown): FullSlug {
  return (typeof slug === "string" ? slug : "") as FullSlug
}

const ArticlePrevNext: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const currentSlug = fileData.slug ?? ""
  if (!currentSlug) return null

  // Get all content files (excluding index pages), sorted by modified date desc
  const sorted = allFiles
    .filter((f) => {
      const s = f.slug ?? ""
      return s && !s.endsWith("/index") && s !== currentSlug
    })
    .sort((a, b) => {
      const ad = a.dates?.modified?.getTime() ?? 0
      const bd = b.dates?.modified?.getTime() ?? 0
      return bd - ad
    })

  const currentIdx = sorted.findIndex((f) => f.slug === currentSlug)
  if (currentIdx === -1) return null

  const prev = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null
  const next = currentIdx > 0 ? sorted[currentIdx - 1] : null

  if (!prev && !next) return null

  return (
    <nav class="article-prev-next" aria-label="文章导航">
      {prev && (
        <a
          class="article-prev-next-link article-prev"
          href={resolveRelative(safeSlug(currentSlug), safeSlug(prev.slug))}
          aria-label={`上一篇: ${prev.frontmatter?.title ?? prev.slug}`}
        >
          <span class="article-prev-next-label" aria-hidden="true">← 上一篇</span>
          <span class="article-prev-next-title">{prev.frontmatter?.title ?? prev.slug}</span>
        </a>
      )}
      {next && (
        <a
          class="article-prev-next-link article-next"
          href={resolveRelative(safeSlug(currentSlug), safeSlug(next.slug))}
          aria-label={`下一篇: ${next.frontmatter?.title ?? next.slug}`}
        >
          <span class="article-prev-next-label" aria-hidden="true">下一篇 →</span>
          <span class="article-prev-next-title">{next.frontmatter?.title ?? next.slug}</span>
        </a>
      )}
    </nav>
  )
}

export default (() => ArticlePrevNext) satisfies () => QuartzComponent
