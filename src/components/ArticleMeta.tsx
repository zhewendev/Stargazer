// ArticleMeta — replaces Quartz's content-meta for content pages.
//
// Per design.md D18: status chip + date + reading time + tags.
// Per status-system spec: StatusChip renders first, then date, reading time, tags.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { StatusChip } from "./StatusChip"
import { Date, getDate } from "../../quartz/components/Date"

function formatDate(date: Date | undefined, locale: string): string {
  if (!date) return ""
  try {
    return new Intl.DateTimeFormat(locale || "zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

function estimateReadingMinutes(text: string | undefined): number {
  if (!text) return 1
  // Chinese reading speed ~300 chars/min; English ~200 words/min.
  // Use character count as a rough proxy.
  const len = text.length
  return Math.max(1, Math.round(len / 600))
}

const ArticleMeta: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
  const status = fileData.frontmatter?.status as string | undefined
  const tags = (fileData.frontmatter?.tags ?? []) as string[]
  const date = getDate(fileData)
  const locale = cfg.locale ?? "zh-CN"
  const minutes = estimateReadingMinutes(fileData.text)

  const basePath: string = (() => {
    try {
      if (!cfg.baseUrl) return ""
      return new URL(`https://${cfg.baseUrl}`).pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  return (
    <div class="article-meta">
      <div class="article-meta-row">
        {status && <StatusChip status={status} size="md" />}
        {date && (
          <span class="article-meta-date">
            <Date date={date} locale={locale} />
          </span>
        )}
        <span class="article-meta-reading">约 {minutes} 分钟阅读</span>
      </div>
      {tags.length > 0 && (
        <div class="article-meta-tags">
          {tags.map((tag) => (
            <a key={tag} class="article-meta-tag" href={basePath + `/tags/${tag}`}>
              #{tag}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default (() => ArticleMeta) satisfies QuartzComponent