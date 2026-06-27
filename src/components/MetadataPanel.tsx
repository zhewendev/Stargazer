// MetadataPanel — right-slot panel for content pages.
//
// Per design.md D18: surfaces status, featured indicator, description, tags.
// Per P2.4: adds Topic field, reorders to Topic → Type → Status → Tags → Updated → Created.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { StatusChip } from "./StatusChip"
import { Date } from "../../quartz/components/Date"
import { getOwningHub } from "../lib/contentQuery"

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  project: "Project",
  note: "Note",
  experiment: "Experiment",
}

const MetadataPanel: QuartzComponent = ({ cfg, fileData, allFiles }: QuartzComponentProps) => {
  const status = fileData.frontmatter?.status as string | undefined
  const type = fileData.frontmatter?.type as string | undefined
  const featuredType = fileData.frontmatter?.featuredType as string | undefined
  const tags = (fileData.frontmatter?.tags ?? []) as string[]
  const created = fileData.dates?.created
  const modified = fileData.dates?.modified
  const locale = cfg.locale ?? "zh-CN"

  const basePath: string = (() => {
    try {
      if (!cfg.baseUrl) return ""
      return new URL(`https://${cfg.baseUrl}`).pathname.replace(/\/$/, "")
    } catch { return "" }
  })()

  // Compute owning hub/topic from file position
  const owningHub = getOwningHub(fileData, allFiles)
  const topicLabel = owningHub?.split("/").pop() ?? owningHub

  // Type badge: prefer explicit `type`, fall back to `featuredType`
  const typeValue = type ?? featuredType
  const typeLabel = typeValue ? (TYPE_LABELS[typeValue] ?? typeValue) : undefined

  return (
    <aside class="metadata-panel" aria-label="笔记元数据">
      <h3 class="metadata-panel-title">本文信息</h3>

      {topicLabel && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">Topic</span>
          <span class="metadata-panel-value">{topicLabel}</span>
        </div>
      )}

      {typeLabel && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">Type</span>
          <span class="metadata-panel-value">{typeLabel}</span>
        </div>
      )}

      {status && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">Status</span>
          <StatusChip status={status} size="md" />
        </div>
      )}

      {tags.length > 0 && (
        <div class="metadata-panel-row metadata-panel-row-stack">
          <span class="metadata-panel-label">Tags</span>
          <div class="metadata-panel-tags">
            {tags.map((tag) => (
              <a key={tag} class="metadata-panel-tag" href={basePath + `/tags/${tag}`}>
                #{tag}
              </a>
            ))}
          </div>
        </div>
      )}

      {modified && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">Updated</span>
          <span class="metadata-panel-value">
            <Date date={modified} locale={locale} />
          </span>
        </div>
      )}

      {created && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">Created</span>
          <span class="metadata-panel-value">
            <Date date={created} locale={locale} />
          </span>
        </div>
      )}
    </aside>
  )
}

export default (() => MetadataPanel) satisfies QuartzComponent
