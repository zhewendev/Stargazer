// MountainStyle — line-art mountain silhouette (no birds per user direction).
//
// Per design.md D25: minimal monochrome line-art. No gradients, no shadows,
// simple strokes. Stroke color inherits from CSS `color` (currentColor).

import type { HeroStyleComponent } from "./index"

export const MountainStyle: HeroStyleComponent = ({ height }) => {
  return (
    <svg
      class="hero-style hero-style-mountain"
      viewBox="0 0 400 280"
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="远山轮廓"
      fill="none"
      stroke="currentColor"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {/* Sun — a single thin circle, top right */}
      <circle cx="320" cy="70" r="22" stroke-width="1" />

      {/* Far mountain layer (lighter stroke implied by lower opacity) */}
      <path
        d="M0 200 L60 130 L100 160 L160 90 L210 140 L260 110 L320 150 L370 120 L400 160 L400 280 L0 280 Z"
        opacity="0.55"
      />

      {/* Near mountain layer (full opacity, dominant silhouette) */}
      <path d="M0 240 L40 190 L90 220 L150 150 L200 200 L260 170 L320 210 L370 180 L400 220 L400 280 L0 280 Z" />
    </svg>
  )
}

export default MountainStyle