'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GlassMaterial } from './GlassMaterial';
import { Mesh, BufferGeometry } from 'three';

interface CustomSolidProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  modelPath: string;
  materialProps?: {
    iorR?: number;
    iorG?: number;
    iorB?: number;
    opacity?: number;
    chromaticAberration?: number;
  };
}

const models = [
  '/models/scene.gltf'
];

const CustomSolid: React.FC<CustomSolidProps> = ({ 
  position = [0, 0, 0], 
  scale = 1,
  rotation = [0, 0, 0],
  modelPath,
  materialProps = {}
}) => {
  const { scene } = useGLTF(modelPath);
  
  // Extract the first mesh's geometry
  const geometry = React.useMemo(() => {
    let meshGeometry: BufferGeometry | null = null;
    scene.traverse((child) => {
      if (child instanceof Mesh && !meshGeometry) {
        meshGeometry = child.geometry.clone();
      }
    });
    return meshGeometry;
  }, [scene]);

  if (!geometry) {
    return null;
  }

  const {
    iorR = 1.14,
    iorG = 1.16,
    iorB = 1.18,
    opacity = 0.8,
    chromaticAberration = 0.1
  } = materialProps;

  return (
    <mesh 
      position={position}
      scale={scale}
      geometry={geometry}
      rotation={rotation}
    >
      <GlassMaterial 
        iorR={iorR}
        iorG={iorG}
        iorB={iorB}
        fresnelPower={2.0}
        opacity={opacity}
        roughness={0.1}
        metalness={0.5}
        reflectivity={0.5}
        chromaticAberration={chromaticAberration}
        refractionRatio={0.1}
      />
    </mesh>
  );
};

export const CustomSolids: React.FC = () => {
  // Preload all models
  React.useEffect(() => {
    models.forEach(model => useGLTF.preload(model));
  }, []);

  return (
    <div className="w-full h-[500px] bg-black">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* Bottom row */}
        <CustomSolid 
          modelPath={models[0]}
          position={[-4, 0, 0]} 
          scale={0.8} 
          rotation={[0, Math.PI * 0.1, 0]}
          materialProps={{ iorR: 1.12, iorG: 1.14, iorB: 1.16, opacity: 0.85 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[-2, 0, 0]} 
          scale={0.7} 
          rotation={[0, -Math.PI * 0.1, 0]}
          materialProps={{ iorR: 1.16, iorG: 1.18, iorB: 1.20, opacity: 0.75 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[0, 0, 0]} 
          scale={0.9} 
          rotation={[Math.PI * 0.05, 0, 0]}
          materialProps={{ chromaticAberration: 0.15 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[2, 0, 0]} 
          scale={0.75} 
          rotation={[0, Math.PI * 0.15, 0]}
          materialProps={{ iorR: 1.18, iorG: 1.20, iorB: 1.22, opacity: 0.9 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[4, 0, 0]} 
          scale={0.85} 
          rotation={[0, -Math.PI * 0.05, 0]}
          materialProps={{ chromaticAberration: 0.05 }}
        />
        {/* Top row */}
        <CustomSolid 
          modelPath={models[0]}
          position={[-3, 2, 0]} 
          scale={0.7} 
          rotation={[0, Math.PI * 0.2, 0]}
          materialProps={{ opacity: 0.7 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[-1, 2, 0]} 
          scale={0.8} 
          rotation={[Math.PI * 0.1, 0, 0]}
          materialProps={{ chromaticAberration: 0.2 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[1, 2, 0]} 
          scale={0.75} 
          rotation={[0, -Math.PI * 0.2, 0]}
          materialProps={{ iorR: 1.20, iorG: 1.22, iorB: 1.24 }}
        />
        <CustomSolid 
          modelPath={models[0]}
          position={[3, 2, 0]} 
          scale={0.85} 
          rotation={[Math.PI * 0.05, Math.PI * 0.1, 0]}
          materialProps={{ opacity: 0.95 }}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
