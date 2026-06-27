// Hub — pageBody for folder index pages with `type: hub`.
//
// Per design Frame 02: breadcrumbs → title/description → 5-cell stats → tab navigation.
// Tabs are driven by frontmatter `tabs` array. Falls back to sections DSL if no tabs.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { HubHero } from "./hub/HubHero"
import { HubStats } from "./hub/HubStats"
import HubTabs, { type TabSpec } from "./hub/HubTabs"
import { LearningMap } from "./hub/LearningMap"
import { CoreTopicsGrid } from "./hub/CoreTopicsGrid"
import {
  HubSectionDispatcher,
  type HubSectionSpec,
} from "./hub/sections"
import { ScopedGraph } from "./ScopedGraph"
import { querySection } from "../lib/contentQuery"
import { resolveRelative, FullSlug } from "../../quartz/util/path"

// ── Default tabs when frontmatter.tabs is absent ────────────────
const DEFAULT_TABS: Array<TabSpec & { type: string }> = [
  { id: "core-topics", label: "核心专题", type: "core-topics" },
  { id: "recommended", label: "推荐阅读", type: "list" },
  { id: "graph", label: "图谱概览", type: "graph" },
]

function resolveTabs(raw: unknown): Array<TabSpec & { type: string }> {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_TABS
  return raw
    .filter((t): t is { id: string; label: string; type: string } =>
      typeof t === "object" &&
      t !== null &&
      typeof (t as Record<string, unknown>).id === "string" &&
      typeof (t as Record<string, unknown>).label === "string" &&
      typeof (t as Record<string, unknown>).type === "string",
    )
}

const ALLOWED_SECTION_TYPES: HubSectionSpec["type"][] = ["cards", "list", "compact-list", "graph"]

function validateSections(raw: unknown): HubSectionSpec[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((s: Record<string, unknown>, idx: number): HubSectionSpec[] => {
    if (!s || typeof s !== "object") return []
    if (typeof s.title !== "string") return []
    if (!ALLOWED_SECTION_TYPES.includes(s.type as HubSectionSpec["type"])) {
      console.warn(`[hub] section #${idx} has invalid type: ${s.type}`)
      return []
    }
    return [{
      title: s.title as string,
      type: s.type as HubSectionSpec["type"],
      filter: s.filter as HubSectionSpec["filter"],
      match: s.match as "any" | "all" | undefined,
      limit: s.limit as number | undefined,
      height: s.height as number | undefined,
      scope: s.scope as string | undefined,
    }]
  })
}

function renderTabContent(
  tabType: string,
  hubFile: QuartzPluginData,
  allFiles: QuartzPluginData[],
  hubScope: string,
): JSX.Element | null {
  switch (tabType) {
    case "learning-map":
      return <LearningMap fileData={hubFile} />
    case "core-topics":
      return <CoreTopicsGrid hubSlug={hubScope} allFiles={allFiles} />
    case "graph": {
      return (
        <ScopedGraph
          title=""
          height={400}
          filter={{ tags: [] }}
          hubScope={hubScope}
          allFiles={allFiles}
          fileData={hubFile}
        />
      )
    }
    case "list": {
      const sections = validateSections(hubFile.frontmatter?.sections)
      const listSpec = sections.find((s) => s.type === "list") ?? {
        title: "推荐阅读",
        type: "list" as const,
        limit: 10,
      }
      const items = querySection(
        allFiles,
        { ...listSpec.filter, match: listSpec.match ?? listSpec.filter?.match },
        { hubScope, limit: listSpec.limit ?? 10 },
      )
      if (items.length === 0) return <p class="hub-tab-empty">暂无内容</p>
      return (
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
      )
    }
    case "cards": {
      const sections = validateSections(hubFile.frontmatter?.sections)
      const cardsSpec = sections.find((s) => s.type === "cards")
      if (!cardsSpec) return null
      return <HubSectionDispatcher spec={cardsSpec} allFiles={allFiles} hubScope={hubScope} />
    }
    default:
      return null
  }
}

const Hub: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const type = fileData.frontmatter?.type as string | undefined
  if (type !== "hub") return null

  const hubScope = (fileData.slug ?? "").replace(/\/index$/, "")
  const hubHeroDisabled = fileData.frontmatter?.hubHero === false
  const tabs = resolveTabs(fileData.frontmatter?.tabs)

  return (
    <article class="hub-page">
      {!hubHeroDisabled && <HubHero hubFile={fileData} allFiles={allFiles} hubScope={hubScope} />}
      <HubStats hubFile={fileData} allFiles={allFiles} />
      <HubTabs tabs={tabs} activeIndex={0}>
        {tabs.map((tab) => (
          renderTabContent(tab.type, fileData, allFiles, hubScope)
        ))}
      </HubTabs>
    </article>
  )
}

export default (() => Hub) satisfies () => QuartzComponent
