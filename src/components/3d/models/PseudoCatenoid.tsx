import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import * as THREE from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Object_10: THREE.Mesh
    Object_11: THREE.Mesh
  }
  materials: {
    material_0: THREE.MeshStandardMaterial
  }
}

export function PseudoCatenoid(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/models/scene.gltf') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_10.geometry}>
        {props.children}
      </mesh>
      <mesh geometry={nodes.Object_11.geometry}>
        {props.children}
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/scene.gltf');
