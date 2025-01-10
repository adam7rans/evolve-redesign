'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { GlassObject } from './GlassObject';
import * as THREE from 'three';

interface GlassModelProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: number;
  iorR?: number;
  iorG?: number;
  iorB?: number;
  fresnelPower?: number;
  opacity?: number;
  roughness?: number;
  metalness?: number;
  reflectivity?: number;
  chromaticAberration?: number;
  refractionRatio?: number;
}

export function GlassModel({
  modelPath,
  position = [0, 0, 0],
  scale = 1,
  ...glassProps
}: GlassModelProps) {
  const { scene } = useGLTF(modelPath);
  
  // Extract the first mesh from the loaded model
  const geometry = useMemo<THREE.BufferGeometry | null>(() => {
    let result: THREE.BufferGeometry | null = null;
    
    scene.traverse((child) => {
      if (!result && child instanceof THREE.Mesh) {
        const geo = child.geometry;
        if (geo instanceof THREE.BufferGeometry) {
          result = geo.clone();
        }
      }
    });
    
    return result;
  }, [scene]);

  useEffect(() => {
    // Preload the model
    useGLTF.preload(modelPath);
    
    // Cleanup function
    return () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry instanceof THREE.BufferGeometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    };
  }, [modelPath, scene]);

  if (!geometry) {
    console.warn('No mesh found in the model');
    return null;
  }

  return (
    <GlassObject
      geometry={geometry}
      position={position}
      scale={scale}
      {...glassProps}
    />
  );
}
