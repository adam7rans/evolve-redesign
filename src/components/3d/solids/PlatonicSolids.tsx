'use client';

import React from 'react';
import { Tetrahedron, Box, Octahedron, Dodecahedron, Icosahedron, OrbitControls } from '@react-three/drei';
import { MeshProps, ThreeEvent } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { GlassMaterial } from './GlassMaterial';

interface SolidProps extends Omit<MeshProps, 'args'> {
  wireframe?: boolean;
  color?: string;
}

export const TetrahedronSolid: React.FC<SolidProps> = ({ color = "#4287f5", ...props }) => (
  <Tetrahedron args={[1]} {...props}>
    <GlassMaterial />
  </Tetrahedron>
);

export const CubeSolid: React.FC<SolidProps> = ({ color = "#42f54b", ...props }) => (
  <Box args={[1, 1, 1]} {...props}>
    <GlassMaterial />
  </Box>
);

export const OctahedronSolid: React.FC<SolidProps> = ({ color = "#f54242", ...props }) => (
  <Octahedron args={[1]} {...props}>
    <GlassMaterial />
  </Octahedron>
);

export const DodecahedronSolid: React.FC<SolidProps> = ({ color = "#f542f2", ...props }) => (
  <Dodecahedron args={[1]} {...props}>
    <GlassMaterial />
  </Dodecahedron>
);

export const IcosahedronSolid: React.FC<SolidProps> = ({ color = "#f5d442", ...props }) => (
  <Icosahedron args={[1]} {...props}>
    <GlassMaterial />
  </Icosahedron>
);

export const PlatonicSolids: React.FC = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TetrahedronSolid position={[-4, 0, 0]} />
        <CubeSolid position={[-2, 0, 0]} />
        <OctahedronSolid position={[0, 0, 0]} />
        <DodecahedronSolid position={[2, 0, 0]} />
        <IcosahedronSolid position={[4, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
