import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import * as THREE from 'three';

type GLTFResult = GLTF & {
  nodes: {
    Object_8: THREE.Mesh
  }
  materials: {
    material_0: THREE.MeshStandardMaterial
  }
}

export function OrderlyTangle(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/models/scene.gltf') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Object_8.geometry}
        position={[2, 0, 0]}
      >
        {props.children}
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/scene.gltf');
