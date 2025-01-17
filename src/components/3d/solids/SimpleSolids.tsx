'use client';

import React from 'react';
import { Tetrahedron, Box, Octahedron, Dodecahedron, Icosahedron } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';

interface SolidProps extends Omit<MeshProps, 'args'> {
  wireframe?: boolean;
  color?: string;
}

export const TetrahedronSolid: React.FC<SolidProps> = ({ color = "#4287f5", ...props }) => (
  <Tetrahedron args={[1]} {...props}>
    <meshPhongMaterial color={color} wireframe={props.wireframe} />
  </Tetrahedron>
);

export const CubeSolid: React.FC<SolidProps> = ({ color = "#42f587", ...props }) => (
  <Box args={[1, 1, 1]} {...props}>
    <meshPhongMaterial color={color} wireframe={props.wireframe} />
  </Box>
);

export const OctahedronSolid: React.FC<SolidProps> = ({ color = "#f54242", ...props }) => (
  <Octahedron args={[1]} {...props}>
    <meshPhongMaterial color={color} wireframe={props.wireframe} />
  </Octahedron>
);

export const DodecahedronSolid: React.FC<SolidProps> = ({ color = "#f542f2", ...props }) => (
  <Dodecahedron args={[1]} {...props}>
    <meshPhongMaterial color={color} wireframe={props.wireframe} />
  </Dodecahedron>
);

export const IcosahedronSolid: React.FC<SolidProps> = ({ color = "#f5d442", ...props }) => (
  <Icosahedron args={[1]} {...props}>
    <meshPhongMaterial color={color} wireframe={props.wireframe} />
  </Icosahedron>
);
