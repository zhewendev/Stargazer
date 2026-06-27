// LatestEssaysSection — 3 most recent content items on Home.
//
// Data-driven: queries all files, sorts by modified date, takes top 3,
// renders as ContentCard with type badge.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import { queryRecent } from "../../lib/contentQuery"
import { SectionShell } from "./SectionShell"
import { ContentCard } from "../ContentCard"

interface LatestEssaysSectionProps {
  allFiles: QuartzPluginData[]
}

export function LatestEssaysSection({ allFiles }: LatestEssaysSectionProps) {
  const recent = queryRecent(allFiles, 3)

  if (recent.length === 0) return null

  return (
    <SectionShell title="最新文章">
      <div class="latest-essays-grid">
        {recent.map((file) => (
          <ContentCard
            key={file.slug}
            page={file}
            fileData={allFiles[0]}
          />
        ))}
      </div>
    </SectionShell>
  )
}
