// ResourcePage — filter tabs + two-column layout for resource collection.
//
// Per design Frame 05: breadcrumbs → title/description → filter tabs →
// resource list (icons + category labels) + sidebar → 最近更新 section.

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { ResourceSidebar } from "./ResourceSidebar"
import { queryResourceByType } from "../lib/contentQuery"
import { resolveRelative, FullSlug } from "../../quartz/util/path"

const RESOURCE_TYPES = [
  { value: "", label: "全部" },
  { value: "book", label: "书籍" },
  { value: "tool", label: "工具" },
  { value: "website", label: "网站" },
  { value: "paper", label: "论文" },
  { value: "video", label: "视频" },
]

const TYPE_ICONS: Record<string, string> = {
  book: "📖",
  tool: "🔧",
  website: "🌐",
  paper: "📄",
  video: "🎬",
  other: "📎",
}

const TYPE_LABELS: Record<string, string> = {
  book: "书籍",
  tool: "工具",
  website: "网站",
  paper: "论文",
  video: "视频",
  other: "其他",
}

const ResourcePage: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const title = (fm.title as string) ?? "资源库"
  const description = (fm.description as string) ?? "精选书籍、工具、网站、论文、视频等学习资源"

  const allResources = queryResourceByType(allFiles)

  // 最近更新: sort by modified date, limit 5
  const recentResources = [...allResources]
    .sort((a, b) => (b.dates?.modified?.getTime() ?? 0) - (a.dates?.modified?.getTime() ?? 0))
    .slice(0, 5)

  return (
    <article class="resource-page">
      <div class="resource-header">
        <h1 class="resource-title">{title}</h1>
        {description && <p class="resource-desc">{description}</p>}
      </div>

      {/* Filter tabs */}
      <div class="resource-filter" data-resource-filter>
        <nav class="resource-filter-tabs" role="tablist" aria-label="资源分类">
          {RESOURCE_TYPES.map(({ value, label }, i) => (
            <button
              key={value}
              class={`resource-filter-tab ${value === "" ? "active" : ""}`}
              role="tab"
              data-filter={value}
              aria-selected={value === "" ? "true" : "false"}
              tabIndex={value === "" ? 0 : -1}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div class="resource-layout">
        {/* Resource list */}
        <div class="resource-list" data-resource-list>
          {allResources.length > 0 ? (
            allResources.map((file) => {
              const fileFm = (file.frontmatter ?? {}) as Record<string, unknown>
              const resTitle = (fileFm.title as string) ?? file.slug?.split("/").pop() ?? ""
              const resDesc = (fileFm.description as string) ?? ""
              const resType = (fileFm["resource-type"] as string | undefined) ?? "other"
              const icon = TYPE_ICONS[resType] ?? TYPE_ICONS.other
              const typeLabel = TYPE_LABELS[resType] ?? resType
              const href = resolveRelative(fileData.slug as FullSlug, file.slug as FullSlug)

              return (
                <div
                  key={file.slug}
                  class="resource-item"
                  data-resource-type={resType}
                >
                  <span class="resource-item-icon" aria-hidden="true">{icon}</span>
                  <div class="resource-item-body">
                    <a class="resource-item-title" href={href}>{resTitle}</a>
                    {resDesc && <p class="resource-item-desc">{resDesc}</p>}
                  </div>
                  <span class="resource-item-type">{typeLabel}</span>
                </div>
              )
            })
          ) : (
            <p class="resource-empty">暂无资源</p>
          )}
        </div>

        {/* Sidebar */}
        <aside class="resource-sidebar">
          <ResourceSidebar allFiles={allFiles} />
        </aside>
      </div>

      {/* 最近更新 */}
      {recentResources.length > 0 && (
        <section class="resource-recent">
          <h2 class="resource-recent-title">最近更新</h2>
          <ul class="resource-recent-list">
            {recentResources.map((file) => {
              const fileFm = (file.frontmatter ?? {}) as Record<string, unknown>
              const resTitle = (fileFm.title as string) ?? file.slug?.split("/").pop() ?? ""
              const resType = (fileFm["resource-type"] as string | undefined) ?? "other"
              const icon = TYPE_ICONS[resType] ?? TYPE_ICONS.other
              const href = resolveRelative(fileData.slug as FullSlug, file.slug as FullSlug)
              const date = file.dates?.modified
              return (
                <li key={file.slug} class="resource-recent-item">
                  <span class="resource-recent-icon" aria-hidden="true">{icon}</span>
                  <a class="resource-recent-link" href={href}>{resTitle}</a>
                  {date && (
                    <span class="resource-recent-date">{date.toISOString().slice(0, 10)}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </article>
  )
}

ResourcePage.afterDOMLoaded = `
(function() {
  const container = document.querySelector("[data-resource-filter]");
  const list = document.querySelector("[data-resource-list]");
  if (!container || !list) return;
  const tabs = container.querySelectorAll("[data-filter]");
  const items = list.querySelectorAll("[data-resource-type]");

  function activateTab(index) {
    tabs.forEach((t, i) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
      t.tabIndex = i === index ? 0 : -1;
    });
    const tab = tabs[index];
    if (!tab) return;
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    tab.focus();
    const filter = tab.getAttribute("data-filter");
    items.forEach((item) => {
      const type = item.getAttribute("data-resource-type");
      item.style.display = !filter || type === filter ? "" : "none";
    });
  }

  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener("click", () => activateTab(i));
    tab.addEventListener("keydown", (e) => {
      let next = i;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      activateTab(next);
    });
  });
})();
`

export default (() => ResourcePage) satisfies () => QuartzComponent
