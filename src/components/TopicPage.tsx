// TopicPage — tabbed layout for topic pages.
//
// Tabs: 概览 / 核心文章 / 相关资源
// 概览: description + key concepts
// 核心文章: article list as ContentCard items
// 相关资源: related links, tools, references

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { ContentCard } from "./ContentCard"
import { queryByTopic } from "../lib/contentQuery"

const TopicPage: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const title = (fm.title as string) ?? (fileData.slug ?? "").split("/").pop() ?? ""
  const description = (fm.description as string) ?? ""
  const topicSlug = (fileData.slug ?? "").replace(/\/index$/, "")

  // Get child articles
  const articles = queryByTopic(allFiles, topicSlug)

  // Get related resources (external links from frontmatter)
  const relatedResources = (fm.relatedResources ?? []) as Array<{ title: string; url: string; description?: string }>

  return (
    <article class="topic-page">
      <div class="topic-header">
        <h1 class="topic-title">{title}</h1>
        {description && <p class="topic-desc">{description}</p>}
      </div>

      <div class="topic-tabs" data-topic-tabs>
        <nav class="topic-tab-nav" role="tablist">
          <button class="topic-tab active" role="tab" data-tab="overview" aria-selected="true">
            概览
          </button>
          <button class="topic-tab" role="tab" data-tab="articles" aria-selected="false">
            核心文章 ({articles.length})
          </button>
          {relatedResources.length > 0 && (
            <button class="topic-tab" role="tab" data-tab="resources" aria-selected="false">
              相关资源 ({relatedResources.length})
            </button>
          )}
        </nav>

        <div class="topic-tab-content" data-tab-content="overview">
          {description && (
            <div class="topic-overview">
              <p>{description}</p>
            </div>
          )}
        </div>

        <div class="topic-tab-content" data-tab-content="articles" hidden>
          {articles.length > 0 ? (
            <div class="topic-articles-list">
              {articles.map((file) => (
                <ContentCard
                  key={file.slug}
                  page={file}
                  fileData={fileData}
                />
              ))}
            </div>
          ) : (
            <p class="topic-empty">暂无文章</p>
          )}
        </div>

        {relatedResources.length > 0 && (
          <div class="topic-tab-content" data-tab-content="resources" hidden>
            <div class="topic-resources-list">
              {relatedResources.map((res) => (
                <a key={res.url} class="topic-resource-link" href={res.url} target="_blank" rel="noopener">
                  <span class="topic-resource-title">{res.title}</span>
                  {res.description && <span class="topic-resource-desc">{res.description}</span>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

// Client-side tab switching
TopicPage.afterDOMLoaded = `
(() => {
  const container = document.querySelector("[data-topic-tabs]");
  if (!container) return;
  const tabs = container.querySelectorAll("[data-tab]");
  const panels = container.querySelectorAll("[data-tab-content]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      panels.forEach((p) => { p.hidden = true; });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const panel = container.querySelector("[data-tab-content='" + target + "']");
      if (panel) panel.hidden = false;
    });
  });
})();
`

export default (() => TopicPage) satisfies () => QuartzComponent
