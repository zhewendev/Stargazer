// TopicPage — tabbed layout for topic pages.
//
// Per design Frame 03: breadcrumbs → title/description → tags → stats → 6 tabs.
// Tabs: 概览 / 学习路径 / 核心文章 / 工具与资源 / 相关专题 / 图谱视图

import type { QuartzPluginData } from "../../quartz/plugins/vfile"
import type { QuartzComponent } from "../../quartz/components/types"
import { queryByTopic } from "../lib/contentQuery"
import { LearningMap } from "./hub/LearningMap"
import { ScopedGraph } from "./ScopedGraph"
import { resolveRelative, FullSlug } from "../../quartz/util/path"

interface ResourceLink {
  title: string
  url: string
  description?: string
}

const TopicPage: QuartzComponent = ({ fileData, allFiles }: {
  fileData: QuartzPluginData
  allFiles: QuartzPluginData[]
}) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const title = (fm.title as string) ?? (fileData.slug ?? "").split("/").pop() ?? ""
  const description = (fm.description as string) ?? ""
  const topicSlug = (fileData.slug ?? "").replace(/\/index$/, "")
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : []
  const modified = fileData.dates?.modified
  const resources = Array.isArray(fm.resources)
    ? (fm.resources as ResourceLink[]).filter((r) => r?.title && r?.url)
    : []
  const relatedTopics = Array.isArray(fm.relatedTopics) ? (fm.relatedTopics as string[]) : []

  // Child articles
  const articles = queryByTopic(allFiles, topicSlug)

  // Related topics (files matching tags)
  const relatedTopicFiles = relatedTopics.length > 0
    ? allFiles.filter((f) => {
        const fTags = Array.isArray(f.frontmatter?.tags) ? (f.frontmatter!.tags as string[]) : []
        return relatedTopics.some((t) => fTags.includes(t)) && f.slug !== fileData.slug
      }).slice(0, 6)
    : []

  const TABS = [
    { id: "overview", label: "概览" },
    { id: "learning-path", label: "学习路径" },
    { id: "articles", label: `核心文章 (${articles.length})` },
    ...(resources.length > 0 ? [{ id: "tools", label: "工具与资源" }] : []),
    ...(relatedTopicFiles.length > 0 ? [{ id: "related", label: "相关专题" }] : []),
    { id: "graph", label: "图谱视图" },
  ]

  return (
    <article class="topic-page" data-script="topic-tabs">
      {/* Header */}
      <div class="topic-header">
        <h1 class="topic-title">{title}</h1>
        {description && <p class="topic-desc">{description}</p>}
        {tags.length > 0 && (
          <div class="topic-tags">
            {tags.map((tag) => (
              <span key={tag} class="topic-tag">#{tag}</span>
            ))}
          </div>
        )}
        <div class="topic-stats">
          {modified && (
            <span class="topic-stat">更新 {modified.toISOString().slice(0, 10)}</span>
          )}
          <span class="topic-stat">{articles.length} 笔记</span>
        </div>
      </div>

      {/* Tabs */}
      <div class="hub-tabs">
        <div class="hub-tabs-bar" role="tablist" aria-label="专题导航">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              role="tab"
              class={`hub-tabs-tab ${i === 0 ? "is-active" : ""}`}
              aria-selected={i === 0 ? "true" : "false"}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={i === 0 ? 0 : -1}
              type="button"
              data-tab={tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div class="hub-tabs-panels">
          {/* 概览 */}
          <div role="tabpanel" class="hub-tabs-panel is-active" id="panel-overview" aria-labelledby="tab-overview">
            {description ? (
              <div class="topic-overview">
                <p>{description}</p>
              </div>
            ) : (
              <p class="topic-empty">暂无概述</p>
            )}
          </div>

          {/* 学习路径 */}
          <div role="tabpanel" class="hub-tabs-panel" id="panel-learning-path" aria-labelledby="tab-learning-path" hidden>
            <LearningMap fileData={fileData} />
          </div>

          {/* 核心文章 */}
          <div role="tabpanel" class="hub-tabs-panel" id="panel-articles" aria-labelledby="tab-articles" hidden>
            {articles.length > 0 ? (
              <ul class="topic-article-list">
                {articles.map((file) => {
                  const href = resolveRelative(fileData.slug as FullSlug, file.slug as FullSlug)
                  const articleTitle = (file.frontmatter?.title as string) ?? file.slug
                  const articleTags = Array.isArray(file.frontmatter?.tags)
                    ? (file.frontmatter!.tags as string[]).slice(0, 3)
                    : []
                  const date = file.dates?.modified
                  return (
                    <li key={file.slug} class="topic-article-item">
                      <a class="topic-article-link" href={href}>{articleTitle}</a>
                      <div class="topic-article-meta">
                        {articleTags.map((t) => (
                          <span key={t} class="topic-article-tag">#{t}</span>
                        ))}
                        {date && (
                          <span class="topic-article-date">{date.toISOString().slice(0, 10)}</span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p class="topic-empty">暂无文章</p>
            )}
          </div>

          {/* 工具与资源 */}
          {resources.length > 0 && (
            <div role="tabpanel" class="hub-tabs-panel" id="panel-tools" aria-labelledby="tab-tools" hidden>
              <ul class="topic-resources-list">
                {resources.map((res) => (
                  <li key={res.url} class="topic-resource-item">
                    <a class="topic-resource-link" href={res.url} target="_blank" rel="noopener noreferrer">
                      {res.title}
                    </a>
                    {res.description && <span class="topic-resource-desc">{res.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 相关专题 */}
          {relatedTopicFiles.length > 0 && (
            <div role="tabpanel" class="hub-tabs-panel" id="panel-related" aria-labelledby="tab-related" hidden>
              <div class="core-topics-grid">
                {relatedTopicFiles.map((topic) => {
                  const topicFm = (topic.frontmatter ?? {}) as Record<string, unknown>
                  const topicTitle = (topicFm.title as string) ?? topic.slug?.split("/").pop() ?? ""
                  const topicDesc = (topicFm.description as string) ?? ""
                  const icon = (topicFm.icon as string | undefined) ?? "📄"
                  return (
                    <a key={topic.slug} class="core-topic-card" href={resolveRelative(fileData.slug as FullSlug, topic.slug as FullSlug)}>
                      <span class="core-topic-icon" aria-hidden="true">{icon}</span>
                      <h3 class="core-topic-title">{topicTitle}</h3>
                      {topicDesc && <p class="core-topic-desc">{topicDesc}</p>}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* 图谱视图 */}
          <div role="tabpanel" class="hub-tabs-panel" id="panel-graph" aria-labelledby="tab-graph" hidden>
            <ScopedGraph
              title=""
              height={400}
              filter={{ tags: [] }}
              hubScope={topicSlug}
              allFiles={allFiles}
              fileData={fileData}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

TopicPage.afterDOMLoaded = `
(function() {
  const container = document.querySelector("[data-script='topic-tabs']");
  if (!container) return;
  const tabs = container.querySelectorAll("[role='tab']");
  const panels = container.querySelectorAll("[role='tabpanel']");
  if (tabs.length === 0) return;

  function activate(index) {
    tabs.forEach((t, i) => {
      t.classList.toggle("is-active", i === index);
      t.setAttribute("aria-selected", i === index ? "true" : "false");
      t.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((p, i) => {
      p.classList.toggle("is-active", i === index);
      p.hidden = i !== index;
    });
    tabs[index]?.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(i));
    tab.addEventListener("keydown", (e) => {
      let next = i;
      if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      activate(next);
    });
  });
})();
`

export default (() => TopicPage) satisfies () => QuartzComponent
