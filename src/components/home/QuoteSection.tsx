// QuoteSection — single static quote line from config.
//
// Data-driven: reads cfg.brand.quote, renders as a styled blockquote.

import type { QuartzPluginData } from "../../../quartz/plugins/vfile"
import type { GlobalConfiguration } from "../../../quartz/cfg"

interface QuoteSectionProps {
  cfg: GlobalConfiguration
  fileData: QuartzPluginData
}

export function QuoteSection({ cfg }: QuoteSectionProps) {
  const brand = (cfg as any)?.brand ?? {}
  const quote = brand.quote ?? "知识只有在连接中，才能真正产生价值。"

  return (
    <div class="quote-section">
      <p class="quote-text">{quote}</p>
    </div>
  )
}
