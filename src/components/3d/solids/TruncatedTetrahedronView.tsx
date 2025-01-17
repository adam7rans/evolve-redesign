'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TruncatedTetrahedron } from './ArchimedeanSolids';

export function TruncatedTetrahedronView() {
  return (
    <div className="aspect-square">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TruncatedTetrahedron position={[0, 0, 0]} />
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
}
