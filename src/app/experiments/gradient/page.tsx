'use client'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'

import ScrollDownArrow from '@/components/examples/ScrollDown'
import ScrollingBackgroundGradient from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient'
import { GradientHeader } from '@/components/examples/GradientHeader'

// Steps:
// 1. Create a fullscreen shader background using a <ScreenQuad> component
// 2. Implement a gradient using the cosine color function & presets
// 3. Add Y translation that matches the users scroll
// 4. Add noise and time to the shader
// 5. Add config controls using Leva

const SCREENS = 5

export default function ScrollingBackgroundShaderExample() {
  return (
    <main className="relative w-full min-h-screen" style={{ height: `${SCREENS * 100}vh` }}>
      <Canvas
        className="fixed inset-0 w-full h-full"
        camera={{ position: [0, 0, 0.1] }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: 'high-performance',
        }}>
        <ScrollingBackgroundGradient screens={SCREENS - 1} loopScroll={true} />
      </Canvas>

      <GradientHeader />
      <ScrollDownArrow />
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </main>
  )
}
