// ResourceSidebar — category counts for resource collection.
//
// Computes counts from `resource-type` frontmatter field and renders
// a sidebar with category labels and counts.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"

interface ResourceSidebarProps {
  allFiles: QuartzPluginData[]
}

const CATEGORIES = [
  { value: "book", label: "书籍" },
  { value: "tool", label: "工具" },
  { value: "website", label: "网站" },
  { value: "paper", label: "论文" },
  { value: "video", label: "视频" },
]

export function ResourceSidebar({ allFiles }: ResourceSidebarProps) {
  // Count resources by type
  const counts: Record<string, number> = {}
  for (const file of allFiles) {
    const slug = file.slug ?? ""
    if (!slug.startsWith("Resources/") || slug.endsWith("/index")) continue
    const rt = ((file.frontmatter as Record<string, unknown>)?.["resource-type"] as string) ?? "other"
    counts[rt] = (counts[rt] ?? 0) + 1
  }

  return (
    <div class="resource-sidebar-content">
      <h3 class="resource-sidebar-title">资源分类</h3>
      <ul class="resource-sidebar-list">
        {CATEGORIES.map(({ value, label }) => (
          <li key={value} class="resource-sidebar-item">
            <span class="resource-sidebar-label">{label}</span>
            <span class="resource-sidebar-count">{counts[value] ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
