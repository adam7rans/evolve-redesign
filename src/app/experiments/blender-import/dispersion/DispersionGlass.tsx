'use client';

import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Leva, useControls, folder } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Mesh, ShaderMaterial, Group } from 'three';
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

const Scene = () => {
  const meshRef = useRef<Mesh<THREE.BufferGeometry, ShaderMaterial>>(null);
  const backgroundGroup = useRef<Group>(null);
  const mainRenderTarget = useFBO();
  const secondaryRenderTarget = useFBO();
  const { scene, camera, gl } = useThree();
  
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
  } = useControls('Glass', {
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
    saturation: { value: 1.00, min: 1, max: 1.25, step: 0.01 },
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

  const uniforms = useMemo(() => ({
    uTexture: {
      value: null,
    },
    uIorR: { value: 1.15 },
    uIorY: { value: 1.16 },
    uIorG: { value: 1.18 },
    uIorC: { value: 1.22 },
    uIorB: { value: 1.22 },
    uIorP: { value: 1.22 },
    uRefractPower: { value: 0.4 },
    uChromaticAberration: { value: 0.6 },
    uSaturation: { value: 1.0 },
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

  const range = (start: number, end: number, step: number = 1) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  };

  useEffect(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });

    // Create background grid
    const backgroundGroup = new THREE.Group();
    const columns = range(-7.5, 7.5, 2.5);
    const rows = range(-7.5, 7.5, 2.5);
    
    columns.forEach((col) =>
      rows.forEach((row) => {
        const mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.5, 8),
          new THREE.MeshStandardMaterial({ 
            color: 'white',
            roughness: 0.1,
            metalness: 0.1
          })
        );
        mesh.position.set(col, row, -4);
        backgroundGroup.add(mesh);
      })
    );
    scene.add(backgroundGroup);

    // Add ambient and directional light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Set scene background
    scene.background = new THREE.Color(0x000000);

    // Add torus with glass material
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.5, 16, 100),
      material.clone()
    );
    torus.position.set(-3, 0, 0);
    torus.rotation.x = Math.PI / 4;
    scene.add(torus);

    // Add cube with glass material
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      material.clone()
    );
    cube.position.set(3, 0, 0);
    cube.rotation.y = Math.PI / 4;
    scene.add(cube);

    // Add cone with glass material
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      material.clone()
    );
    cone.position.set(0, 6, 0); 
    cone.rotation.x = -Math.PI / 6;
    scene.add(cone);

    // Set camera position to see all objects
    camera.position.set(0, 3, 20); 
    camera.lookAt(0, 2, 0);

    return () => {
      scene.remove(backgroundGroup);
    };
  }, [camera, scene, uniforms]);

  useFrame((state) => {
    // First render the scene to the texture
    const glassObjects: THREE.Mesh[] = [];
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.ShaderMaterial) {
        glassObjects.push(obj);
        obj.visible = false;
      }
    });

    state.gl.setRenderTarget(mainRenderTarget);
    state.gl.render(state.scene, state.camera);

    // Then render the glass objects with the scene texture
    glassObjects.forEach((obj) => {
      obj.visible = true;
      const material = obj.material as THREE.ShaderMaterial;
      material.uniforms.uTexture.value = mainRenderTarget.texture;
      material.uniforms.uIorR.value = iorR;
      material.uniforms.uIorY.value = iorY;
      material.uniforms.uIorG.value = iorG;
      material.uniforms.uIorC.value = iorC;
      material.uniforms.uIorB.value = iorB;
      material.uniforms.uIorP.value = iorP;
      material.uniforms.uRefractPower.value = refraction;
      material.uniforms.uChromaticAberration.value = chromaticAberration;
      material.uniforms.uSaturation.value = saturation;
      material.uniforms.uShininess.value = shininess;
      material.uniforms.uDiffuseness.value = diffuseness;
      material.uniforms.uFresnelPower.value = fresnelPower;
      material.uniforms.uLight.value = new THREE.Vector3(light.x, light.y, light.z);
      material.uniforms.winResolution.value.set(
        window.innerWidth,
        window.innerHeight
      ).multiplyScalar(Math.min(window.devicePixelRatio, 2));
    });

    state.gl.setRenderTarget(null);
    state.gl.render(state.scene, state.camera);
  });

  return null;
};

const DispersionGlass = () => {
  return (
    <div className="w-full h-screen">
      <Canvas 
        camera={{ position: [0, 2, 12] }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene />
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
      <Leva />
    </div>
  );
};

export default DispersionGlass;
