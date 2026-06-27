// ResourcePage — filter tabs + two-column layout for resource collection.
//
// Filter tabs: 全部 / 书籍 / 工具 / 网站 / 论文 / 视频
// Left (70%): resource list as ContentCard items
// Right (30%): category sidebar with counts

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { ContentCard } from "./ContentCard"
import { ResourceSidebar } from "./ResourceSidebar"
import { queryResourceByType } from "../lib/contentQuery"

const RESOURCE_TYPES = [
  { value: "", label: "全部" },
  { value: "book", label: "书籍" },
  { value: "tool", label: "工具" },
  { value: "website", label: "网站" },
  { value: "paper", label: "论文" },
  { value: "video", label: "视频" },
]

const ResourcePage: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const title = (fm.title as string) ?? "资源库"
  const description = (fm.description as string) ?? "精选书籍、工具、网站、论文、视频等学习资源"

  // Get all resources
  const allResources = queryResourceByType(allFiles)

  return (
    <article class="resource-page">
      <div class="resource-header">
        <h1 class="resource-title">{title}</h1>
        {description && <p class="resource-desc">{description}</p>}
      </div>

      <div class="resource-filter" data-resource-filter>
        <nav class="resource-filter-tabs" role="tablist">
          {RESOURCE_TYPES.map(({ value, label }) => (
            <button
              key={value}
              class={`resource-filter-tab ${value === "" ? "active" : ""}`}
              role="tab"
              data-filter={value}
              aria-selected={value === "" ? "true" : "false"}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div class="resource-layout">
        <div class="resource-list" data-resource-list>
          {allResources.length > 0 ? (
            allResources.map((file) => (
              <ContentCard
                key={file.slug}
                page={file}
                fileData={fileData}
              />
            ))
          ) : (
            <p class="resource-empty">暂无资源</p>
          )}
        </div>

        <aside class="resource-sidebar">
          <ResourceSidebar allFiles={allFiles} />
        </aside>
      </div>
    </article>
  )
}

// Client-side filtering
ResourcePage.afterDOMLoaded = `
(() => {
  const container = document.querySelector("[data-resource-filter]");
  const list = document.querySelector("[data-resource-list]");
  if (!container || !list) return;
  const tabs = container.querySelectorAll("[data-filter]");
  const cards = list.querySelectorAll("[data-resource-type]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.getAttribute("data-filter");
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      cards.forEach((card) => {
        const type = card.getAttribute("data-resource-type");
        card.style.display = !filter || type === filter ? "" : "none";
      });
    });
  });
})();
`

export default (() => ResourcePage) satisfies () => QuartzComponent
