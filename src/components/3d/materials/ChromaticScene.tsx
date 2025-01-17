import { useRef } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { ReactNode } from 'react';
import { folder, useControls, LevaInputs } from 'leva';
import * as THREE from 'three';
import { ShaderMaterial, Vector3, Mesh, Object3D, Texture, IUniform } from 'three';

interface ChromaticSceneProps {
  children: ReactNode;
}

interface ChromaticUniforms {
  uTexture: IUniform<Texture | null>;
  uDiffuseness: IUniform<number>;
  uShininess: IUniform<number>;
  uLight: IUniform<Vector3>;
  uFresnelPower: IUniform<number>;
  uIorR: IUniform<number>;
  uIorY: IUniform<number>;
  uIorG: IUniform<number>;
  uIorC: IUniform<number>;
  uIorB: IUniform<number>;
  uIorP: IUniform<number>;
  uSaturation: IUniform<number>;
  uChromaticAberration: IUniform<number>;
  uRefractPower: IUniform<number>;
}

type ChromaticMaterial = ShaderMaterial & {
  uniforms: ChromaticUniforms;
};

interface ChromaticControls {
  light: [number, number, number];
  diffuseness: number;
  shininess: number;
  fresnelPower: number;
  iorR: number;
  iorY: number;
  iorG: number;
  iorC: number;
  iorB: number;
  iorP: number;
  saturation: number;
  chromaticAberration: number;
  refraction: number;
}

export function ChromaticScene({ children }: ChromaticSceneProps) {
  const mesh = useRef<Mesh>(null);
  const mainRenderTarget = useFBO();

  const controls = useControls('Chromatic Effect', {
    light: {
      value: [-1.0, 1.0, 1.0] as [number, number, number],
      step: 0.1,
    },
    diffuseness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.1,
    },
    shininess: {
      value: 40.0,
      min: 1,
      max: 100,
      step: 1,
    },
    fresnelPower: {
      value: 8.0,
      min: 1,
      max: 20,
      step: 0.1,
    },
    iorR: { min: 1.0, max: 2.333, step: 0.001, value: 1.15 },
    iorY: { min: 1.0, max: 2.333, step: 0.001, value: 1.16 },
    iorG: { min: 1.0, max: 2.333, step: 0.001, value: 1.18 },
    iorC: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    iorB: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    iorP: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    saturation: { value: 1.08, min: 1, max: 1.25, step: 0.01 },
    chromaticAberration: {
      value: 0.6,
      min: 0,
      max: 1.5,
      step: 0.01,
    },
    refraction: {
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  useFrame((state) => {
    const { gl, scene, camera } = state;

    // First render the scene to a texture
    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Update all chromatic materials in the scene
    scene.traverse((node: Object3D) => {
      if (!(node instanceof Mesh)) return;
      if (!node.material) return;

      const material = node.material as ChromaticMaterial;
      if (material.type !== 'ShaderMaterial') return;

      const {
        uTexture,
        uDiffuseness,
        uShininess,
        uLight,
        uFresnelPower,
        uIorR,
        uIorY,
        uIorG,
        uIorC,
        uIorB,
        uIorP,
        uSaturation,
        uChromaticAberration,
        uRefractPower,
      } = material.uniforms;

      // Update all the uniforms
      if (uTexture) uTexture.value = mainRenderTarget.texture;
      if (uDiffuseness) uDiffuseness.value = controls.diffuseness;
      if (uShininess) uShininess.value = controls.shininess;
      if (uLight) uLight.value = new Vector3(...controls.light);
      if (uFresnelPower) uFresnelPower.value = controls.fresnelPower;
      if (uSaturation) uSaturation.value = controls.saturation;
      if (uChromaticAberration) uChromaticAberration.value = controls.chromaticAberration;
      if (uRefractPower) uRefractPower.value = controls.refraction;

      type UniformKey = 'uIorR' | 'uIorY' | 'uIorG' | 'uIorC' | 'uIorB' | 'uIorP';
      type IorKey = 'iorR' | 'iorY' | 'iorG' | 'iorC' | 'iorB' | 'iorP';

      const iorMapping: Record<UniformKey, IorKey> = {
        uIorR: 'iorR',
        uIorY: 'iorY',
        uIorG: 'iorG',
        uIorC: 'iorC',
        uIorB: 'iorB',
        uIorP: 'iorP',
      };

      Object.entries({ uIorR, uIorY, uIorG, uIorC, uIorB, uIorP } as Record<UniformKey, IUniform<number> | undefined>)
        .forEach(([key, uniform]) => {
          if (uniform) {
            const colorKey = iorMapping[key as UniformKey];
            uniform.value = controls[colorKey];
          }
        });
    });
  });

  return (
    <group>
      <color attach="background" args={["black"]} />
      {children}
    </group>
  );
}