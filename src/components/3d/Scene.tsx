import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GlassObject } from './GlassObject';
import * as THREE from 'three';

interface SceneParams {
  iorR: number;
  iorG: number;
  iorB: number;
  fresnelPower: number;
  opacity: number;
  roughness: number;
  metalness: number;
  reflectivity: number;
  chromaticAberration: number;
  refractionRatio: number;
  pointLightIntensity: number;
  pointLightDistance: number;
  pointLightDecay: number;
  ambientLightIntensity: number;
}

interface SceneProps {
  sceneParams: SceneParams;
}

// Grid component with animation
function AnimatedGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (gridRef.current) {
      // Move the grid upward
      gridRef.current.position.y += delta * 0.5;
      
      // Reset position when it moves too far
      if (gridRef.current.position.y > 60) {
        gridRef.current.position.y = 0;
      }
    }
  });

  return (
    <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} scale={2.5}>
      <gridHelper 
        args={[80, 160, '#ffffff', '#ffffff']}
        position={[0, 0, -4]}
      >
        <meshBasicMaterial 
          attach="material" 
          opacity={0.6} 
          transparent 
          color="#ffffff" 
        />
      </gridHelper>
    </group>
  );
}

export const Scene = ({ sceneParams }: SceneProps) => {
  const {
    iorR,
    iorG,
    iorB,
    fresnelPower,
    opacity,
    roughness,
    metalness,
    reflectivity,
    chromaticAberration,
    refractionRatio,
    pointLightIntensity,
    pointLightDistance,
    pointLightDecay,
    ambientLightIntensity
  } = sceneParams;

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, z: 8 });
  const containerRef = useRef<HTMLDivElement>(null);
  const initialScale = 2.2;
  const [scale, setScale] = useState(initialScale);

  // Handle mouse movement across entire viewport
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({
        x: x * 15,
        y: y * 10,
        z: 8
      });
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => container?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle scroll for scaling
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementCenter = elementTop + rect.height / 2;
      
      const newScale = Math.max(initialScale / 2, initialScale - (Math.abs(elementCenter) / viewportHeight) * (initialScale / 2));
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Grid */}
        <AnimatedGrid />

        {/* Lighting */}
        <ambientLight intensity={ambientLightIntensity} />
        <pointLight 
          position={[mousePosition.x, mousePosition.y, mousePosition.z]} 
          intensity={pointLightIntensity}
          color="#ffffff"
          distance={pointLightDistance}
          decay={pointLightDecay}
        >
          <mesh scale={0.1}>
            <sphereGeometry />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </pointLight>

        {/* Glass Object */}
        <GlassObject 
          scale={scale} 
          iorR={iorR}
          iorG={iorG}
          iorB={iorB}
          fresnelPower={fresnelPower}
          opacity={opacity}
          roughness={roughness}
          metalness={metalness}
          reflectivity={reflectivity}
          chromaticAberration={chromaticAberration}
          refractionRatio={refractionRatio}
        />
        
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};
