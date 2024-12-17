'use client'

import { useNoise } from '@/contexts/NoiseContext'

export function NoisePattern() {
  const { noiseEnabled } = useNoise()

  if (!noiseEnabled) return null

  return (
    <>
      <svg className="fixed isolate opacity-30 mix-blend-soft-light pointer-events-none -z-10" width="100%" height="100%">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/50 to-background" />
    </>
  )
}
