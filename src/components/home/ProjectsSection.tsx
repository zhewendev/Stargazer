// ProjectsSection — lists files under content/Projects/.
//
// Per home-page.md requirement. Each project renders with circular icon,
// title, and description.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { queryFolder } from "../../lib/contentQuery"
import { SectionShell } from "./SectionShell"
import { resolveRelative, FullSlug } from "../../../quartz/util/path"

interface ProjectsSectionProps {
  allFiles: QuartzPluginData[]
}

export function ProjectsSection({ allFiles }: ProjectsSectionProps) {
  const projects = queryFolder(allFiles, "projects")

  if (projects.length === 0) return null

  return (
    <SectionShell title="项目" moreHref="/projects">
      <div class="projects-grid">
        {projects.map((project) => {
          const href = resolveRelative("index" as FullSlug, project.slug as FullSlug)
          const title = (project.frontmatter?.title as string | undefined) ?? project.slug
          const desc = (project.frontmatter?.description as string | undefined) ?? ""
          const icon = (project.frontmatter?.icon as string | undefined) ?? "◇"
          return (
            <a key={project.slug} class="project-card" href={href}>
              <div class="project-card-icon" aria-hidden="true">{icon}</div>
              <div>
                <h3 class="project-card-title">{title}</h3>
                {desc && <p class="project-card-desc">{desc}</p>}
              </div>
            </a>
          )
        })}
      </div>
    </SectionShell>
  )
}
