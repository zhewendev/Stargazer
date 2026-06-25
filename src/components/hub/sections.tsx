// Hub section renderers.
//
// Each section type (cards, list, compact-list, graph) is a thin component
// that calls querySection() and renders the result.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { querySection, type SectionFilter } from "../../lib/contentQuery"
import { resolveRelative, FullSlug } from "../../../quartz/util/path"
import { StatusChip } from "../StatusChip"
import { ScopedGraph } from "../ScopedGraph"

export interface HubSectionSpec {
  title: string
  type: "cards" | "list" | "compact-list" | "graph"
  filter?: SectionFilter
  match?: "any" | "all"
  limit?: number
  height?: number
  scope?: string
}

// ── Cards ───────────────────────────────────────────────────────
export function CardsSection({
  spec,
  allFiles,
  hubScope,
}: {
  spec: HubSectionSpec
  allFiles: QuartzPluginData[]
  hubScope?: string
}) {
  const items = querySection(
    allFiles,
    { ...spec.filter, match: spec.match ?? spec.filter?.match },
    { hubScope: spec.scope ?? hubScope, limit: spec.limit ?? 6 },
  )
  if (items.length === 0) return null

  return (
    <div class="hub-section">
      <h3 class="hub-section-title">{spec.title}</h3>
      <div class="featured-grid">
        {items.map((file) => {
          const href = resolveRelative("index" as FullSlug, file.slug as FullSlug)
          const title = (file.frontmatter?.title as string | undefined) ?? file.slug
          const desc = (file.frontmatter?.description as string | undefined) ?? ""
          const cover = (file.frontmatter?.cover as string | undefined) ?? null
          const status = file.frontmatter?.status as string | undefined
          return (
            <a key={file.slug} class="card featured-card featured-card-article hub-card" href={href}>
              {cover && <img class="card-cover" src={cover} alt="" loading="lazy" />}
              <h4 class="featured-card-title">{title}</h4>
              {desc && <p class="featured-card-desc">{desc}</p>}
              <div class="card-meta">
                {status && <StatusChip status={status} />}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

// ── List ────────────────────────────────────────────────────────
export function ListSection({
  spec,
  allFiles,
  hubScope,
}: {
  spec: HubSectionSpec
  allFiles: QuartzPluginData[]
  hubScope?: string
}) {
  const items = querySection(
    allFiles,
    { ...spec.filter, match: spec.match ?? spec.filter?.match },
    { hubScope: spec.scope ?? hubScope, limit: spec.limit ?? 10 },
  )
  if (items.length === 0) return null

  return (
    <div class="hub-section">
      <h3 class="hub-section-title">{spec.title}</h3>
      <ul class="hub-list">
        {items.map((file) => {
          const href = resolveRelative("index" as FullSlug, file.slug as FullSlug)
          const title = (file.frontmatter?.title as string | undefined) ?? file.slug
          const date = file.dates?.modified
          return (
            <li key={file.slug} class="hub-list-row">
              <a class="hub-list-link" href={href}>{title}</a>
              {date && (
                <span class="hub-list-date">{date.toISOString().slice(0, 10)}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Compact list ───────────────────────────────────────────────
export function CompactListSection({
  spec,
  allFiles,
  hubScope,
}: {
  spec: HubSectionSpec
  allFiles: QuartzPluginData[]
  hubScope?: string
}) {
  const items = querySection(
    allFiles,
    { ...spec.filter, match: spec.match ?? spec.filter?.match },
    { hubScope: spec.scope ?? hubScope },
  )
  if (items.length === 0) return null

  return (
    <div class="hub-section">
      <h3 class="hub-section-title">{spec.title}</h3>
      <ul class="hub-compact-list">
        {items.map((file) => {
          const href = resolveRelative("index" as FullSlug, file.slug as FullSlug)
          const title = (file.frontmatter?.title as string | undefined) ?? file.slug
          return (
            <li key={file.slug} class="hub-compact-row">
              <a class="hub-compact-link" href={href}>{title}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ── Graph (scoped knowledge graph; P11) ──────────────────────────
export function GraphSection({
  spec,
  allFiles,
  hubScope,
}: {
  spec: HubSectionSpec
  allFiles: QuartzPluginData[]
  hubScope?: string
}) {
  return (
    <ScopedGraph
      spec={spec}
      allFiles={allFiles}
      hubScope={spec.scope ?? hubScope}
    />
  )
}

// ── Dispatcher ──────────────────────────────────────────────────
export function HubSectionDispatcher(props: {
  spec: HubSectionSpec
  allFiles: QuartzPluginData[]
  hubScope?: string
}) {
  switch (props.spec.type) {
    case "cards":
      return <CardsSection {...props} />
    case "list":
      return <ListSection {...props} />
    case "compact-list":
      return <CompactListSection {...props} />
    case "graph":
      return <GraphSection spec={props.spec} />
    default:
      return null
  }
}
