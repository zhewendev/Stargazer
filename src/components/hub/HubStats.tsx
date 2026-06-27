// HubStats — 5-cell stats row for Knowledge Hub pages.
//
// Auto-computed at build time from child pages:
// 笔记 · 专题 · 标签 · 系列 · 链接

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { getHubStats, type HubStats as HubStatsType } from "../../lib/pageTypeRegistry"

interface HubStatsProps {
  hubFile: QuartzPluginData
  allFiles: QuartzPluginData[]
}

const LABELS: Array<{ key: keyof HubStatsType; label: string }> = [
  { key: "notes", label: "笔记" },
  { key: "topics", label: "专题" },
  { key: "tags", label: "标签" },
  { key: "series", label: "系列" },
  { key: "links", label: "链接" },
]

export function HubStats({ hubFile, allFiles }: HubStatsProps) {
  const stats = getHubStats(hubFile, allFiles)

  return (
    <div class="hub-stats">
      {LABELS.map(({ key, label }) => (
        <div key={key} class="hub-stats-cell">
          <span class="hub-stats-value">{stats[key]}</span>
          <span class="hub-stats-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
