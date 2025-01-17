'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { GradientHeader } from '@/components/examples/GradientHeader';
import {
  TetrahedronSolid,
  CubeSolid,
  OctahedronSolid,
  DodecahedronSolid,
  IcosahedronSolid,
} from '@/components/3d/solids/SimpleSolids';

export default function SolidsPage() {
  return (
    <div className="w-full h-screen">
      <GradientHeader />
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <group position={[-4, 2, 0]}>
        <TetrahedronSolid />
      </group>
      <group position={[-2, 2, 0]}>
        <CubeSolid />
      </group>
      <group position={[0, 2, 0]}>
        <OctahedronSolid />
      </group>
      <group position={[2, 2, 0]}>
        <DodecahedronSolid />
      </group>
      <group position={[4, 2, 0]}>
        <IcosahedronSolid />
      </group>

      <group position={[-3, -2, 0]}>
        <TetrahedronSolid wireframe color="#ffffff" />
      </group>
      <group position={[-1, -2, 0]}>
        <CubeSolid wireframe color="#ffffff" />
      </group>
      <group position={[1, -2, 0]}>
        <OctahedronSolid wireframe color="#ffffff" />
      </group>
      <group position={[3, -2, 0]}>
        <DodecahedronSolid wireframe color="#ffffff" />
      </group>
    </>
  );
}
