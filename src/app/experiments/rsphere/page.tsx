'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useControls, folder } from 'leva';

export default function RSpherePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const backgroundSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Create controls for the glass material
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
    diffuseness: { value: 0.2 },
    shininess: { value: 40.0 },
    fresnelPower: { value: 8.0 },
    ior: folder({
      iorR: { min: 1.0, max: 2.333, step: 0.001, value: 1.15 },
      iorY: { min: 1.0, max: 2.333, step: 0.001, value: 1.16 },
      iorG: { min: 1.0, max: 2.333, step: 0.001, value: 1.18 },
      iorC: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      iorB: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      iorP: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    }),
    saturation: { value: 1.00, min: 1, max: 1.25, step: 0.01 },
    chromaticAberration: { value: 0.6, min: 0, max: 1.5, step: 0.01 },
    refraction: { value: 0.4, min: 0, max: 1, step: 0.01 },
  });

  // Create uniforms for the shader material
  const { uniforms } = useMemo(() => {
    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
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
      uLight: { value: new THREE.Vector3(-1.0, 1.0, 1.0) },
      winResolution: { value: new THREE.Vector2(1, 1) },
    };

    return { uniforms };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create render target for background
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false,
        depthBuffer: true
      }
    );
    renderTargetRef.current = renderTarget;
    uniforms.uTexture.value = renderTarget.texture;

    // Create a separate scene for background elements
    const backgroundScene = new THREE.Scene();
    backgroundSceneRef.current = backgroundScene;
    backgroundScene.background = new THREE.Color(0x000000);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Create background pillars
    const backgroundGroup = new THREE.Group();
    const numPillars = 20;
    const pillarSpacing = 2;
    const totalWidth = (numPillars - 1) * pillarSpacing;
    const startX = -totalWidth / 2;

    const pillarMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.0,
      metalness: 0.0,
      emissive: 0xffffff,
      emissiveIntensity: 0.8
    });
    
    // Create pillars
    for (let i = 0; i < numPillars; i++) {
      const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      const x = startX + (i * pillarSpacing);
      pillar.position.set(x, 0, -6);
      backgroundGroup.add(pillar);
    }

    backgroundScene.add(backgroundGroup);

    // Add ambient and directional light to both scenes
    const sceneAmbientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(sceneAmbientLight);
    backgroundScene.add(sceneAmbientLight.clone());

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    backgroundScene.add(directionalLight.clone());

    // Create glass sphere
    const simpleGlassSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 64, 64),
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: require('./shaders/vertex.glsl').default,
        fragmentShader: require('./shaders/fragment.glsl').default,
        transparent: true,
      })
    );
    scene.add(simpleGlassSphere);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderTarget.setSize(width, height);
      uniforms.winResolution.value.set(width, height);

      // Re-render background when resizing
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(backgroundScene, camera);
      renderer.setRenderTarget(null);
    };

    window.addEventListener('resize', handleResize);

    // Set initial window resolution and render background
    uniforms.winResolution.value.set(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(backgroundScene, camera);
    renderer.setRenderTarget(null);

    // Animation loop
    let frameId: number;

    function animate() {
      frameId = requestAnimationFrame(animate);
      controls.update();
      
      // Rotate the sphere slowly
      simpleGlassSphere.rotation.y += 0.001;

      // Update uniforms for glass material
      uniforms.uIorR.value = iorR;
      uniforms.uIorY.value = iorY;
      uniforms.uIorG.value = iorG;
      uniforms.uIorC.value = iorC;
      uniforms.uIorB.value = iorB;
      uniforms.uIorP.value = iorP;
      uniforms.uRefractPower.value = refraction;
      uniforms.uChromaticAberration.value = chromaticAberration;
      uniforms.uSaturation.value = saturation;
      uniforms.uShininess.value = shininess;
      uniforms.uDiffuseness.value = diffuseness;
      uniforms.uFresnelPower.value = fresnelPower;
      uniforms.uLight.value.set(light.x, light.y, light.z);

      // Render background to texture
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(backgroundScene, camera);
      renderer.setRenderTarget(null);

      // Render main scene
      renderer.clear();
      renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      renderTarget.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [uniforms, iorR, iorY, iorG, iorC, iorB, iorP, refraction, chromaticAberration, saturation, shininess, diffuseness, fresnelPower, light]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}