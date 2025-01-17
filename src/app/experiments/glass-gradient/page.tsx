'use client'

import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'

import { GradientHeader } from '@/components/examples/GradientHeader'
import ScrollingBackgroundGradient from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient'

const DispersionGlass = dynamic(
  () => import('../glass/dispersion/DispersionGlass'),
  { ssr: false }
)

const SCREENS = 1

export default function GlassGradientExperiment() {
  return (
    <main className="relative w-full min-h-screen" style={{ height: `${SCREENS * 100}vh` }}>
      {/* Background Canvas for Gradient */}
      <div className="fixed inset-0">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 0, 0.1] }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}>
          <ScrollingBackgroundGradient 
            screens={SCREENS - 1} 
            loopScroll={false} 
            controlsFolder="Gradient Controls"
          />
        </Canvas>
      </div>

      {/* Glass Scene */}
      <div className="absolute inset-0" style={{ background: 'transparent' }}>
        <Canvas 
          className="w-full h-full"
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}>
          <color attach="background" args={['transparent']} />
          <DispersionGlass controlsFolder="Glass Controls" />
        </Canvas>
      </div>

      {/* UI Elements */}
      <div className="relative z-20">
        <GradientHeader />
      </div>

      {/* Single Leva panel that will contain both foldered controls */}
      <Leva 
        titleBar={{ 
          title: 'Scene Controls',
          position: { x: -8, y: 64 } 
        }} 
      />
    </main>
  )
}
