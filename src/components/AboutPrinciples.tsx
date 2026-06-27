// AboutPrinciples — 4 garden growth principles for About page.
//
// Renders principles from frontmatter: [{ name, description, stage }]
// Stages: Seed / Growing / Evergreen / Complete with matching icons.

import type { QuartzComponent, QuartzComponentConstructor } from "../quartz/plugins/types"
import type { QuartzPluginData } from "../quartz/plugins/vfile"

interface Principle {
  name: string
  description: string
  stage: "Seed" | "Growing" | "Evergreen" | "Complete"
}

const STAGE_ICONS: Record<Principle["stage"], string> = {
  Seed: "○",
  Growing: "◐",
  Evergreen: "●",
  Complete: "◉",
}

const STAGE_LABELS: Record<Principle["stage"], string> = {
  Seed: "种子",
  Growing: "生长中",
  Evergreen: "常青",
  Complete: "完成",
}

function isPrincipleArray(val: unknown): val is Principle[] {
  if (!Array.isArray(val)) return false
  return val.every(
    (p) =>
      typeof p === "object" &&
      p !== null &&
      typeof (p as Record<string, unknown>).name === "string" &&
      typeof (p as Record<string, unknown>).description === "string" &&
      typeof (p as Record<string, unknown>).stage === "string",
  )
}

const AboutPrinciples: QuartzComponent = ({ fileData }: { fileData: QuartzPluginData }) => {
  const fm = (fileData.frontmatter ?? {}) as Record<string, unknown>
  const raw = fm.principles
  if (!isPrincipleArray(raw) || raw.length === 0) return null

  return (
    <div class="about-principles">
      <h2 class="about-principles-title">花园原则</h2>
      <div class="about-principles-grid">
        {raw.map((p) => (
          <article key={p.name} class="about-principle-card">
            <span class="about-principle-icon" aria-hidden="true">
              {STAGE_ICONS[p.stage] ?? "○"}
            </span>
            <h3 class="about-principle-name">{p.name}</h3>
            <span class="about-principle-stage">{STAGE_LABELS[p.stage] ?? p.stage}</span>
            <p class="about-principle-desc">{p.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default (() => AboutPrinciples) satisfies QuartzComponentConstructor
