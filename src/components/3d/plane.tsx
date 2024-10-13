'use client';

import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// Explicitly import Math methods
const { PI, sqrt, atan2, sin, cos } = Math;

// Tailwind spacing to viewport units mapping
const tailwindToViewport = {
  '96': 0.96,  // 24rem
  '80': 0.8,   // 20rem
  '64': 0.64,  // 16rem
  '48': 0.48,  // 12rem
  '32': 0.32,  // 8rem
  '16': 0.16,  // 4rem
  // Add more mappings as needed
};

type TailwindSpacing = keyof typeof tailwindToViewport;

interface StaticPlaneProps {
  size: TailwindSpacing;
  waveFrequency1?: number;
  waveAmplitude1?: number;
  waveSpeed1?: number;
  waveFrequency2?: number;
  waveAmplitude2?: number;
  waveSpeed2?: number;
  resolution?: number;
}

// Define min and max values for each wave parameter
const waveRanges = {
  frequency1: { min: 10, max: 55 },
  amplitude1: { min: 0.05, max: 0.1 },
  speed1: { min: 0.5, max: 0.7 },
  frequency2: { min: 3, max: 10 },
  amplitude2: { min: 0.03, max: 0.07 },
  speed2: { min: 0.3, max: 1.0 },
};

function oscillate(min: number, max: number, speed: number, time: number): number {
  const range = max - min;
  const offset = sin(time * speed) * 0.5 + 0.5;
  return min + offset * range;
}

function StaticPlane({ 
  size, 
  resolution = 200,
}: StaticPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, resolution, resolution);
    const pos = geo.attributes.position;
    const newPositions = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      newPositions[i * 3] = pos.getX(i);
      newPositions[i * 3 + 1] = pos.getY(i);
      newPositions[i * 3 + 2] = pos.getZ(i);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    return geo;
  }, [resolution]);

  useEffect(() => {
    if (meshRef.current) {
      const scaleFactor = tailwindToViewport[size];
      const scaleX = viewport.width * scaleFactor;
      const scaleY = viewport.height * scaleFactor;
      meshRef.current.scale.set(scaleX, scaleY, 1);
      meshRef.current.position.set(0, 0, 0);
    }
  }, [viewport, size]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();

      // Oscillate wave parameters
      const waveFrequency1 = oscillate(waveRanges.frequency1.min, waveRanges.frequency1.max, 0.1, time);
      const waveAmplitude1 = oscillate(waveRanges.amplitude1.min, waveRanges.amplitude1.max, 0.03, time);
      const waveSpeed1 = oscillate(waveRanges.speed1.min, waveRanges.speed1.max, 0.03, time);

      const waveFrequency2 = oscillate(waveRanges.frequency2.min, waveRanges.frequency2.max, 0.08, time);
      const waveAmplitude2 = oscillate(waveRanges.amplitude2.min, waveRanges.amplitude2.max, 0.01, time);
      const waveSpeed2 = oscillate(waveRanges.speed2.min, waveRanges.speed2.max, 0.02, time);

      const positions = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        const radius = sqrt(x * x + y * y);
        let angle = atan2(y, x);
        
        // Calculate wave effects
        // Counterclockwise wave
        const waveEffect1 = sin(waveFrequency1 * (angle - time * waveSpeed1)) * waveAmplitude1;
        // Clockwise wave
        const waveEffect2 = sin(waveFrequency2 * (angle + time * waveSpeed2)) * waveAmplitude2;
        
        // Combine wave effects
        const combinedWaveEffect = waveEffect1 + waveEffect2;
        
        // Apply wave effect with intensity decreasing towards the center
        const intensityFactor = smoothstep(0, 0.5, radius);
        const z = combinedWaveEffect * intensityFactor;
        
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-PI / 2, 0, 0]} geometry={geometry}>
      <meshStandardMaterial color="#333333" side={THREE.DoubleSide} emissive="#333333" emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function ThreePlane() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
      <Canvas 
        camera={{ 
          fov: 75, 
          near: 0.1, 
          far: 1000,
          position: [0, 10, 0],
          up: [0, 0, -1]
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <StaticPlane 
          size="96" 
          resolution={200}
        />
        <OrbitControls target={[0, 0, 0]} />
        <gridHelper args={[100, 100]} rotation={[Math.PI / 2, 0, 0]} />
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Define smoothstep function
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x * x * (3 - 2 * x);
}
