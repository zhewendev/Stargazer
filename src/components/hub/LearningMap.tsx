// LearningMap — vertical timeline for learning path visualization.
//
// Reads `learningPath` from frontmatter: [{ stage, items[] }]
// Falls back gracefully if no data.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"

interface LearningStage {
  stage: string
  items: string[]
}

interface LearningMapProps {
  fileData: QuartzPluginData
}

export function LearningMap({ fileData }: LearningMapProps) {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const raw = fm.learningPath

  if (!Array.isArray(raw) || raw.length === 0) {
    return (
      <div class="learning-map learning-map-empty">
        <p class="learning-map-empty-text">暂无学习路径数据</p>
      </div>
    )
  }

  const stages = raw.filter(
    (s): s is LearningStage =>
      typeof s === "object" &&
      s !== null &&
      typeof (s as Record<string, unknown>).stage === "string",
  )

  if (stages.length === 0) {
    return (
      <div class="learning-map learning-map-empty">
        <p class="learning-map-empty-text">暂无学习路径数据</p>
      </div>
    )
  }

  return (
    <div class="learning-map">
      <ol class="learning-map-timeline">
        {stages.map((s, i) => (
          <li key={i} class="learning-map-stage">
            <div class="learning-map-marker" aria-hidden="true">
              <span class="learning-map-dot" />
              {i < stages.length - 1 && <span class="learning-map-line" />}
            </div>
            <div class="learning-map-content">
              <h4 class="learning-map-stage-title">{s.stage}</h4>
              {Array.isArray(s.items) && s.items.length > 0 && (
                <ul class="learning-map-items">
                  {s.items.map((item, j) => (
                    <li key={j} class="learning-map-item">{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
