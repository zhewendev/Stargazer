// StatusChip — visual maturity indicator.
//
// Per design.md D18 (visibility everywhere) and D19 (color + shape).
// Renders a glyph (○ ◐ ● ◉) and a label, with color driven by status tokens.
//
// The chip is suppressed when status is absent (legacy notes); per
// status-system spec, omitted status is treated as seed for sorting only.

import type { QuartzComponentProps } from "../../quartz/components/types"

export type Status = "seed" | "growing" | "evergreen" | "complete"

interface StatusChipProps {
  status: Status | string | undefined
  size?: "subtle" | "sm" | "md"
}

const GLYPHS: Record<string, string> = {
  seed: "○",
  growing: "◐",
  evergreen: "●",
  complete: "◉",
}

const LABELS: Record<string, string> = {
  seed: "种子",
  growing: "生长中",
  evergreen: "常青",
  complete: "完成",
}

export function StatusChip({ status, size = "sm" }: StatusChipProps) {
  if (!status || !GLYPHS[status]) return null
  const glyph = GLYPHS[status]
  const label = LABELS[status]
  return (
    <span
      class={`chip chip-status status-${status} status-chip status-chip-${size}`}
      aria-label={`状态: ${label}`}
    >
      <span class="chip-glyph" aria-hidden="true">{glyph}</span>
      <span class="chip-label">{label}</span>
    </span>
  )
}

export default StatusChip