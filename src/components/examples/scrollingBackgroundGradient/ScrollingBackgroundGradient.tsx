'use client'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'
import { gradientPresets } from './colorPresets'

gsap.registerPlugin(ScrollTrigger)

interface ScrollingBackgroundGradientProps {
  screens: number
  loopScroll?: boolean
  controlsFolder?: string
}

export default function ScrollingBackgroundGradient({
  screens,
  loopScroll = false,
  controlsFolder,
}: ScrollingBackgroundGradientProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollProgressRef = useRef(0)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uScale: { value: 1.5 },
      uIterations: { value: 3 },
      uIntensity: { value: 0.2 },
      uTimeMultiplier: { value: 1.0 },
      uColorA: { value: new THREE.Vector3() },
      uColorB: { value: new THREE.Vector3() },
      uColorC: { value: new THREE.Vector3() },
      uColorD: { value: new THREE.Vector3() },
    }),
    []
  )

  const { palette, timeMultiplier, scale, iterations, intensity } = useControls(
    controlsFolder || 'Gradient',
    {
      palette: {
        value: 'sunset',
        options: Object.keys(gradientPresets),
      },
      timeMultiplier: { value: 0.1, min: 0, max: 2, step: 0.1 },
      scale: { value: 3.7, min: 0.1, max: 5, step: 0.1 },
      iterations: { value: 1.0, min: 1, max: 5, step: 0.1 },
      intensity: { value: 0.15, min: 0, max: 1, step: 0.01 },
    }
  )

  useEffect(() => {
    if (!materialRef.current) return

    const colors = gradientPresets[palette]
    materialRef.current.uniforms.uColorA.value.copy(colors.a)
    materialRef.current.uniforms.uColorB.value.copy(colors.b)
    materialRef.current.uniforms.uColorC.value.copy(colors.c)
    materialRef.current.uniforms.uColorD.value.copy(colors.d)
  }, [palette])

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTimeMultiplier.value = timeMultiplier
    materialRef.current.uniforms.uScale.value = scale
    materialRef.current.uniforms.uIterations.value = iterations
    materialRef.current.uniforms.uIntensity.value = intensity
  }, [timeMultiplier, scale, iterations, intensity])

  useEffect(() => {
    ScrollTrigger.create({
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (!materialRef.current) return
        const progress = self.progress * screens
        scrollProgressRef.current = progress
        materialRef.current.uniforms.uProgress.value = progress
      },
    })
  }, [screens])

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
