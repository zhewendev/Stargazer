// ContentCard — single card for folder/tag listings.
//
// Per P9 design constraints:
// - D30 hierarchy: Status → Title → Description → Tags → Date
// - D32 consistent heights: description clamped to 2-3 lines via CSS
// - D34 entire surface clickable via <a> wrapping the card
// - D35 metadata footer reserves space for future graph signals
//   (backlinks count, wikilinks count, related notes)

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import { resolveRelative, FullSlug } from "../../quartz/util/path"
import { StatusChip } from "./StatusChip"

interface ContentCardProps {
  page: QuartzPluginData
  fileData: QuartzPluginData
  /** Content type badge (e.g. "Article", "Project", "Note"). */
  type?: string
}

function safeSlug(slug: unknown): FullSlug {
  return (typeof slug === "string" ? slug : "") as FullSlug
}

function displayTitle(page: QuartzPluginData): string {
  const fmTitle = page.frontmatter?.title as string | undefined
  if (fmTitle) return fmTitle
  const slug = page.slug ?? ""
  const base = slug.split("/").pop() ?? slug
  return base
}

/** Memoized future slots — never changes between renders. */
const FUTURE_SLOTS = [
  { key: "backlinks", label: "反链" },
  { key: "wikilinks", label: "链出" },
] as const

export function ContentCard({ page, fileData, type }: ContentCardProps) {
  const href = resolveRelative(safeSlug(fileData.slug), safeSlug(page.slug))
  const title = displayTitle(page)
  const status = page.frontmatter?.status as string | undefined
  const description = (page.frontmatter?.description as string | undefined) ?? ""
  const rawTags = page.frontmatter?.tags
  const tags: string[] = Array.isArray(rawTags) ? rawTags.filter((t): t is string => typeof t === "string") : []
  const date = page.dates?.modified
  const typeLabel = type ?? (page.frontmatter?.type as string | undefined)

  // D35: future graph metadata slots (backlinks, wikilinks count, related).
  // Reserved as data-attributes so P11 can populate them without touching
  // the card layout. Empty slots are still rendered so the footer height
  // is consistent across cards (D32).

  const isoDate = date?.toISOString()

  return (
    <article
      class="content-card"
      data-status={status ?? "none"}
      data-featured={page.frontmatter?.featured ? "true" : "false"}
      data-featured-order={String(page.frontmatter?.featuredOrder ?? "")}
    >
      <a class="content-card-link" href={href}>
        {/* D30 hierarchy: Status → Title → Description → Tags → Date */}
        <div class="content-card-meta-top">
          {status && <StatusChip status={status} />}
          {typeLabel && (
            <span class="content-card-type">{typeLabel}</span>
          )}
          {/* Reserved for future curated marker (e.g., "精选") */}
          {page.frontmatter?.featured && (
            <span class="content-card-featured" aria-hidden="true">★</span>
          )}
        </div>

        <h3 class="content-card-title">{title}</h3>

        {description && (
          <p class="content-card-desc">{description}</p>
        )}

        {tags.length > 0 && (
          <div class="content-card-tags">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} class="content-card-tag">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span class="content-card-tag-more">+{tags.length - 3}</span>
            )}
          </div>
        )}

        <div class="content-card-footer">
          {isoDate && (
            <time class="content-card-date" dateTime={isoDate}>
              {isoDate.slice(0, 10)}
            </time>
          )}
          {/* D35 reserved space for graph signals — keeps footer height consistent */}
          <div
            class="content-card-graph-meta"
            aria-hidden="true"
            data-slots={FUTURE_SLOTS.map((s) => s.key).join(",")}
          >
            {FUTURE_SLOTS.map((slot) => (
              <span
                key={slot.key}
                class={`content-card-slot content-card-slot-${slot.key}`}
                data-slot={slot.key}
                data-count=""
                title={slot.label}
              />
            ))}
          </div>
        </div>
      </a>
    </article>
  )
}