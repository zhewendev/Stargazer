// MetadataPanel — right-slot panel for content pages.
//
// Per design.md D18: surfaces status, featured indicator, description, tags.
// Sits alongside TOC and Backlinks in the right slot.

import type { QuartzComponent, QuartzComponentProps } from "../../quartz/components/types"
import { StatusChip } from "./StatusChip"
import { Date, getDate } from "../../quartz/components/Date"

const FEATURED_TYPE_LABELS: Record<string, string> = {
  article: "精选文章",
  project: "项目",
  note: "精选笔记",
}

const MetadataPanel: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
  const status = fileData.frontmatter?.status as string | undefined
  const featured = Boolean(fileData.frontmatter?.featured)
  const featuredType = fileData.frontmatter?.featuredType as string | undefined
  const description = (fileData.frontmatter?.description as string | undefined) ?? ""
  const tags = (fileData.frontmatter?.tags ?? []) as string[]
  const created = fileData.dates?.created
  const modified = fileData.dates?.modified
  const locale = cfg.locale ?? "zh-CN"

  return (
    <aside class="metadata-panel" aria-label="笔记元数据">
      <h3 class="metadata-panel-title">笔记信息</h3>

      {status && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">状态</span>
          <StatusChip status={status} size="md" />
        </div>
      )}

      {featured && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">精选</span>
          <span class="metadata-panel-value">
            {featuredType ? FEATURED_TYPE_LABELS[featuredType] ?? featuredType : "精选"}
          </span>
        </div>
      )}

      {description && (
        <div class="metadata-panel-row metadata-panel-row-stack">
          <span class="metadata-panel-label">简介</span>
          <p class="metadata-panel-desc">{description}</p>
        </div>
      )}

      {tags.length > 0 && (
        <div class="metadata-panel-row metadata-panel-row-stack">
          <span class="metadata-panel-label">标签</span>
          <div class="metadata-panel-tags">
            {tags.map((tag) => (
              <a key={tag} class="metadata-panel-tag" href={`/tags/${tag}`}>
                #{tag}
              </a>
            ))}
          </div>
        </div>
      )}

      {modified && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">更新</span>
          <span class="metadata-panel-value">
            <Date date={modified} locale={locale} />
          </span>
        </div>
      )}

      {created && (
        <div class="metadata-panel-row">
          <span class="metadata-panel-label">创建</span>
          <span class="metadata-panel-value">
            <Date date={created} locale={locale} />
          </span>
        </div>
      )}
    </aside>
  )
}

export default (() => MetadataPanel) satisfies QuartzComponent