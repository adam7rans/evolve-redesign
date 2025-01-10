'use client';

import React from 'react';
import { Tetrahedron, Box, Octahedron, Dodecahedron, Icosahedron, OrbitControls } from '@react-three/drei';
import { MeshProps, ThreeEvent } from '@react-three/fiber';
import { BufferGeometry, Vector3, Float32BufferAttribute } from 'three';
import { Canvas } from '@react-three/fiber';
import { GlassMaterial } from './GlassMaterial';

interface SolidProps extends Omit<MeshProps, 'args'> {
  wireframe?: boolean;
  color?: string;
  truncationFactor?: number;
  scale?: number;
  segments?: number;
  detail?: number;
  radius?: number;
  smoothness?: number;
}

// Helper function to create a truncated tetrahedron
const createTruncatedTetrahedron = (truncationFactor: number = 0.3) => {
  // Tetrahedron vertices
  const vertices = [
    new Vector3(1, 1, 1),
    new Vector3(-1, -1, 1),
    new Vector3(-1, 1, -1),
    new Vector3(1, -1, -1)
  ];

  // Create truncated vertices
  const truncatedVertices: Vector3[] = [];
  const faces: number[][] = [];

  // For each vertex of the tetrahedron
  vertices.forEach((vertex, i) => {
    // Create three vertices for each corner truncation
    const otherVertices = vertices.filter((_, j) => j !== i);
    otherVertices.forEach((otherVertex) => {
      const direction = new Vector3().subVectors(otherVertex, vertex).normalize();
      const truncatedVertex = new Vector3()
        .copy(vertex)
        .addScaledVector(direction, truncationFactor);
      truncatedVertices.push(truncatedVertex);
    });
  });

  // Convert vertices to array for buffer geometry
  const positions: number[] = [];
  const indices: number[] = [];

  // Add vertices to positions array
  truncatedVertices.forEach((vertex) => {
    positions.push(vertex.x, vertex.y, vertex.z);
  });

  // Original triangular faces (now hexagonal)
  const hexFaces = [
    [0, 1, 2, 3, 4, 5],    // Front
    [6, 7, 8, 9, 10, 11],  // Right
    [1, 7, 8, 2, 3, 9],    // Top
    [0, 6, 11, 5, 4, 10]   // Bottom
  ];

  // Triangulate hexagonal faces
  hexFaces.forEach(face => {
    for (let i = 1; i < face.length - 1; i++) {
      indices.push(face[0], face[i], face[i + 1]);
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

export const TruncatedTetrahedron: React.FC<SolidProps> = ({ color = "#4287f5", truncationFactor = 0.3, ...props }) => (
  <mesh geometry={createTruncatedTetrahedron(truncationFactor)} {...props}>
    <GlassMaterial />
  </mesh>
);

export const Cuboctahedron: React.FC<SolidProps> = ({ color = "#42f54b", ...props }) => (
  <Octahedron args={[0.8]} {...props}>
    <GlassMaterial />
  </Octahedron>
);

export const TruncatedCube: React.FC<SolidProps> = ({ color = "#f542f2", ...props }) => (
  <Box args={[0.8, 0.8, 0.8]} {...props}>
    <GlassMaterial />
  </Box>
);

export const ArchimedeanSolids: React.FC = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TruncatedTetrahedron position={[-2, 0, 0]} />
        <Cuboctahedron position={[0, 0, 0]} />
        <TruncatedCube position={[2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
