// FeaturedSection — auto-partitions featured items by featuredType.
//
// Per featured-system.md: buckets = article (cover+title+description),
// project (circular icon+title+description), note (small icon+title+date).
// Per home-page.md: subsections labeled 精选文章 / 项目 / 精选笔记.
// Per design.md D5 + Q1 resolution: third bucket uses schema value `note`,
// display label `精选笔记`.
// Per D18: every card shows a StatusChip in its meta row.
// Per D20: cards have visually distinct variants per featuredType.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { queryFeaturedByType, type FeaturedType } from "../../lib/contentQuery"
import { SectionShell } from "./SectionShell"
import { resolveRelative, FullSlug } from "../../../quartz/util/path"
import { StatusChip } from "../StatusChip"

interface FeaturedSectionProps {
  allFiles: QuartzPluginData[]
}

const BUCKETS: Array<{ type: FeaturedType; label: string }> = [
  { type: "article", label: "精选文章" },
  { type: "project", label: "项目" },
  { type: "note", label: "精选笔记" },
]

function ArticleCard({ file }: { file: QuartzPluginData }) {
  const href = resolveRelative("index" as FullSlug, file.slug as FullSlug)
  const title = (file.frontmatter?.title as string | undefined) ?? file.slug
  const desc = (file.frontmatter?.description as string | undefined) ?? ""
  const cover = (file.frontmatter?.cover as string | undefined) ?? null
  const status = file.frontmatter?.status as string | undefined
  return (
    <a class="card featured-card featured-card-article" href={href}>
      {cover && <img class="card-cover" src={cover} alt="" loading="lazy" />}
      <h3 class="featured-card-title">{title}</h3>
      {desc && <p class="featured-card-desc">{desc}</p>}
      <div class="card-meta">
        {status && <StatusChip status={status} />}
      </div>
    </a>
  )
}

function ProjectCard({ file }: { file: QuartzPluginData }) {
  const href = resolveRelative("index" as FullSlug, file.slug as FullSlug)
  const title = (file.frontmatter?.title as string | undefined) ?? file.slug
  const desc = (file.frontmatter?.description as string | undefined) ?? ""
  const icon = (file.frontmatter?.icon as string | undefined) ?? "◆"
  const status = file.frontmatter?.status as string | undefined
  return (
    <a class="project-card featured-card featured-card-project" href={href}>
      <div class="project-card-icon" aria-hidden="true">{icon}</div>
      <div class="project-card-body">
        <h3 class="project-card-title">{title}</h3>
        {desc && <p class="project-card-desc">{desc}</p>}
        <div class="card-meta">
          {status && <StatusChip status={status} />}
        </div>
      </div>
    </a>
  )
}

function NoteCard({ file }: { file: QuartzPluginData }) {
  const href = resolveRelative("index" as FullSlug, file.slug as FullSlug)
  const title = (file.frontmatter?.title as string | undefined) ?? file.slug
  const date = file.dates?.modified
  const status = file.frontmatter?.status as string | undefined
  return (
    <a class="card featured-card featured-card-note featured-note-card" href={href}>
      <h3 class="featured-card-title">{title}</h3>
      <div class="card-meta">
        {status && <StatusChip status={status} />}
        {date && (
          <time class="featured-card-date">{date.toISOString().slice(0, 10)}</time>
        )}
      </div>
    </a>
  )
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
            <div class={bucket.type === "project" ? "projects-grid" : "featured-grid"}>
              {items.map((file) => {
                if (bucket.type === "article") return <ArticleCard key={file.slug} file={file} />
                if (bucket.type === "project") return <ProjectCard key={file.slug} file={file} />
                return <NoteCard key={file.slug} file={file} />
              })}
            </div>
          </div>
        )
      })}
    </SectionShell>
  )
}