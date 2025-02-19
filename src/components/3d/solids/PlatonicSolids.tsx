'use client';

import React from 'react';
import { Tetrahedron, Box, Octahedron, Dodecahedron, Icosahedron, OrbitControls } from '@react-three/drei';
import { MeshProps, ThreeEvent } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import '../materials/ChromaticMaterial';
import { ChromaticMaterialWrapper } from '../materials/ChromaticMaterialWrapper';
import { ChromaticScene } from '../materials/ChromaticScene';

interface SolidProps extends Omit<MeshProps, 'args'> {
  wireframe?: boolean;
  color?: string;
}

export const TetrahedronSolid: React.FC<SolidProps> = ({ color = "#4287f5", ...props }) => (
  <Tetrahedron args={[1]} {...props}>
    <ChromaticMaterialWrapper />
  </Tetrahedron>
);

export const CubeSolid: React.FC<SolidProps> = ({ color = "#42f54b", ...props }) => (
  <Box args={[1, 1, 1]} {...props}>
    <ChromaticMaterialWrapper />
  </Box>
);

export const OctahedronSolid: React.FC<SolidProps> = ({ color = "#f54242", ...props }) => (
  <Octahedron args={[1]} {...props}>
    <ChromaticMaterialWrapper />
  </Octahedron>
);

export const DodecahedronSolid: React.FC<SolidProps> = ({ color = "#f542f2", ...props }) => (
  <Dodecahedron args={[1]} {...props}>
    <ChromaticMaterialWrapper />
  </Dodecahedron>
);

export const IcosahedronSolid: React.FC<SolidProps> = ({ color = "#f5d442", ...props }) => (
  <Icosahedron args={[1]} {...props}>
    <ChromaticMaterialWrapper />
  </Icosahedron>
);

export const PlatonicSolids: React.FC = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ChromaticScene>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <TetrahedronSolid position={[-4, 0, 0]} />
          <CubeSolid position={[-2, 0, 0]} />
          <OctahedronSolid position={[0, 0, 0]} />
          <DodecahedronSolid position={[2, 0, 0]} />
          <IcosahedronSolid position={[4, 0, 0]} />
          <OrbitControls />
        </ChromaticScene>
      </Canvas>
    </div>
  );
};
