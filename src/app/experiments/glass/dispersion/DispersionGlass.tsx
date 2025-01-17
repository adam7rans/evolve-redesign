import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls, folder } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Mesh, ShaderMaterial, Group } from 'three';
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

interface SceneProps {
  controlsFolder?: string;
}

const Scene = ({ controlsFolder }: SceneProps) => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas 
        camera={{ position: [0, 0, 10] }}
        gl={{ 
          clearColor: '#000000',
          alpha: false 
        }}
      >
        <Geometries controlsFolder={controlsFolder} />
        <OrbitControls />
      </Canvas>
      <Leva />
    </div>
  );
};

interface GeometriesProps {
  controlsFolder?: string;
}

const Geometries = ({ controlsFolder }: GeometriesProps) => {
  const mesh = useRef<Mesh<THREE.BufferGeometry, ShaderMaterial>>(null);
  const backgroundGroup = useRef<Group>(null);
  const mainRenderTarget = useFBO();

  const {
    light,
    shininess,
    diffuseness,
    fresnelPower,
    iorR,
    iorY,
    iorG,
    iorC,
    iorB,
    iorP,
    saturation,
    chromaticAberration,
    refraction
  } = useControls(
    controlsFolder || 'Glass',
    {
      light: {
        value: { x: -1.0, y: 1.0, z: 1.0 },
        step: 0.1,
      },
      diffuseness: {
        value: 0.2,
      },
      shininess: {
        value: 40.0,
      },
      fresnelPower: {
        value: 8.0,
      },
      ior: folder({
        iorR: { min: 1.0, max: 2.333, step: 0.001, value: 1.15 },
        iorY: { min: 1.0, max: 2.333, step: 0.001, value: 1.16 },
        iorG: { min: 1.0, max: 2.333, step: 0.001, value: 1.18 },
        iorC: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
        iorB: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
        iorP: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      }),
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
    }
  );

  const uniforms = useMemo(() => ({
    uTexture: {
      value: null,
    },
    uIorR: { value: 1.0 },
    uIorY: { value: 1.0 },
    uIorG: { value: 1.0 },
    uIorC: { value: 1.0 },
    uIorB: { value: 1.0 },
    uIorP: { value: 1.0 },
    uRefractPower: {
      value: 0.2,
    },
    uChromaticAberration: {
      value: 1.0
    },
    uSaturation: { value: 0.0 },
    uShininess: { value: 40.0 },
    uDiffuseness: { value: 0.2 },
    uFresnelPower: { value: 8.0 },
    uLight: {
      value: new THREE.Vector3(-1.0, 1.0, 1.0),
    },
    winResolution: {
      value: new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
    },
  }), []);

  useFrame((state) => {
    const { gl, scene, camera } = state;
    mesh.current!.visible = false;
    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);

    mesh.current!.material.uniforms.uTexture.value = mainRenderTarget.texture;

    gl.setRenderTarget(null);
    mesh.current!.visible = true;

    mesh.current!.material.uniforms.uDiffuseness.value = diffuseness;
    mesh.current!.material.uniforms.uShininess.value = shininess;
    mesh.current!.material.uniforms.uLight.value = new THREE.Vector3(
      light.x,
      light.y,
      light.z
    );
    mesh.current!.material.uniforms.uFresnelPower.value = fresnelPower;

    mesh.current!.material.uniforms.uIorR.value = iorR;
    mesh.current!.material.uniforms.uIorY.value = iorY;
    mesh.current!.material.uniforms.uIorG.value = iorG;
    mesh.current!.material.uniforms.uIorC.value = iorC;
    mesh.current!.material.uniforms.uIorB.value = iorB;
    mesh.current!.material.uniforms.uIorP.value = iorP;

    mesh.current!.material.uniforms.uSaturation.value = saturation;
    mesh.current!.material.uniforms.uChromaticAberration.value = chromaticAberration;
    mesh.current!.material.uniforms.uRefractPower.value = refraction;
  });

  const range = (start: number, end: number, step: number = 1) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  };

  const columns = range(-7.5, 7.5, 2.5);
  const rows = range(-7.5, 7.5, 2.5);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group ref={backgroundGroup}>
        {columns.map((col, i) =>
          rows.map((row, j) => (
            <mesh key={`${i}-${j}`} position={[col, row, -4]}>
              <icosahedronGeometry args={[0.5, 8]} />
              <meshBasicMaterial color="white" />
            </mesh>
          ))
        )}
      </group>
      <mesh ref={mesh}>
        <torusGeometry args={[3, 1, 16, 100]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};

export default Scene;
