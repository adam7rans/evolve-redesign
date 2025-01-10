import React, { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  width: 100%;
  height: 100vh;
`;

const CellContainer = styled.div`
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const Title = styled.h3`
  text-align: center;
  margin: 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: calc(100% - 36px);
`;

interface CellProps {
  title: string;
  children?: ReactNode;
}

const Cell: React.FC<CellProps> = ({ title, children }) => (
  <CellContainer>
    <Title>{title}</Title>
    <CanvasContainer>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {children}
        <OrbitControls />
      </Canvas>
    </CanvasContainer>
  </CellContainer>
);

const ThreeDExperiment: React.FC = () => {
  return (
    <GridContainer>
      {/* Row 1: Regular Platonic Solids */}
      <Cell title="Tetrahedron">
        {/* Tetrahedron component will go here */}
      </Cell>
      <Cell title="Cube">
        {/* Cube component will go here */}
      </Cell>
      <Cell title="Octahedron">
        {/* Octahedron component will go here */}
      </Cell>

      {/* Row 2 */}
      <Cell title="Dodecahedron">
        {/* Dodecahedron component will go here */}
      </Cell>
      <Cell title="Icosahedron">
        {/* Icosahedron component will go here */}
      </Cell>
      <Cell title="Truncated Tetrahedron">
        {/* Truncated Tetrahedron component will go here */}
      </Cell>

      {/* Row 3 */}
      <Cell title="Cuboctahedron">
        {/* Cuboctahedron component will go here */}
      </Cell>
      <Cell title="Truncated Cube">
        {/* Truncated Cube component will go here */}
      </Cell>
      <Cell title="Truncated Octahedron">
        {/* Truncated Octahedron component will go here */}
      </Cell>

      {/* Row 4 */}
      <Cell title="Rhombicuboctahedron">
        {/* Rhombicuboctahedron component will go here */}
      </Cell>
      <Cell title="Snub Cube">
        {/* Snub Cube component will go here */}
      </Cell>
      <Cell title="Icosidodecahedron">
        {/* Icosidodecahedron component will go here */}
      </Cell>

      {/* Row 5 */}
      <Cell title="Truncated Dodecahedron">
        {/* Truncated Dodecahedron component will go here */}
      </Cell>
      <Cell title="Truncated Icosahedron">
        {/* Truncated Icosahedron component will go here */}
      </Cell>
      <Cell title="Rhombicosidodecahedron">
        {/* Rhombicosidodecahedron component will go here */}
      </Cell>

      {/* Row 6 */}
      <Cell title="Snub Dodecahedron">
        {/* Snub Dodecahedron component will go here */}
      </Cell>
      <Cell title="Empty 1">
        {/* Empty cell */}
      </Cell>
      <Cell title="Empty 2">
        {/* Empty cell */}
      </Cell>
    </GridContainer>
  );
};

export default ThreeDExperiment;
