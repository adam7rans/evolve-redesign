'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { InterlockedStarNest } from '@/components/3d/models/InterlockedStarNest';
import { GlassMaterial } from './GlassMaterial';
import { Group } from 'three';

function RotatingModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.2;
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={0.9}>
      <InterlockedStarNest>
        <GlassMaterial 
          iorR={1.14} 
          iorG={1.16} 
          iorB={1.18}
          opacity={0.8}
          chromaticAberration={0.1}
        />
      </InterlockedStarNest>
    </group>
  );
}

export function InterlockedStarNestView() {
  return (
    <div className="aspect-square">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingModel />
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
}
