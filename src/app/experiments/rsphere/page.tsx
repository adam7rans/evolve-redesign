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
    refraction,
    flightPathRadius,
    flightPathSpeed
  } = useControls({
    Glass: folder({
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
    }),
    'Flight Path': folder({
      flightPathRadius: { value: 12, min: 0, max: 20, step: 0.5 },
      flightPathSpeed: { value: 1, min: 0.2, max: 3, step: 0.1 }
    })
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

    // Create flying sphere
    const flyingSphereRadius = 1;
    const flyingSphereGeometry = new THREE.SphereGeometry(flyingSphereRadius, 32, 32);
    const flyingSphereMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.0,
      metalness: 0.0,
      roughness: 0.0,
    });
    
    const flyingSphere = new THREE.Mesh(flyingSphereGeometry, flyingSphereMaterial);
    // Position the sphere on the circular path
    const initialRadius = flightPathRadius; // Use the value from Leva controls
    flyingSphere.position.set(initialRadius, 0, -15);
    scene.add(flyingSphere);

    // Create a clone of the flying sphere for the background scene
    const backgroundFlyingSphere = flyingSphere.clone();
    backgroundScene.add(backgroundFlyingSphere);

    // Add point light to follow each sphere
    const flyingSphereLight = new THREE.PointLight(0xffffff, 2, 10);
    flyingSphere.add(flyingSphereLight);
    const backgroundFlyingSphereLight = new THREE.PointLight(0xffffff, 2, 10);
    backgroundFlyingSphere.add(backgroundFlyingSphereLight);

    // Animation parameters for flying sphere
    const flyingSphereParams = {
      radius: initialRadius,
      zOffset: -15,
      duration: 5000 / flightPathSpeed,
      lastUpdateTime: Date.now(),
      progress: 0
    };

    // Create glass sphere first
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

    // Create nodes on sphere surface
    const nodeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.0,
      metalness: 0.0,
      roughness: 0.0,
    });

    // Helper function to get random points on sphere surface
    const getRandomSpherePoint = (radius: number) => {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    };

    // Create 250 nodes
    const nodes: THREE.Mesh[] = [];
    const sphereRadius = 2.5; // Same as glass sphere radius

    // Create a group for nodes in the background scene
    const nodesGroup = new THREE.Group();
    backgroundScene.add(nodesGroup);

    // Create line material for connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });

    // Create material for animated lines
    const animatedLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
    });

    // Function to calculate distance between two points on sphere surface
    const sphericalDistance = (p1: THREE.Vector3, p2: THREE.Vector3): number => {
      // Convert to spherical coordinates
      const phi1 = Math.acos(p1.y / sphereRadius);
      const theta1 = Math.atan2(p1.z, p1.x);
      const phi2 = Math.acos(p2.y / sphereRadius);
      const theta2 = Math.atan2(p2.z, p2.x);
      
      // Calculate great circle distance
      const deltaTheta = Math.abs(theta2 - theta1);
      const deltaPhi = Math.abs(phi2 - phi1);
      return Math.acos(
        Math.sin(phi1) * Math.sin(phi2) * Math.cos(deltaTheta) +
        Math.cos(phi1) * Math.cos(phi2)
      ) * sphereRadius;
    };

    // Store node positions for connection creation
    const nodePositions: THREE.Vector3[] = [];
    const connections: THREE.Line[] = [];

    // Store connection paths for animation
    const connectionPaths: { points: THREE.Vector3[]; progress: number; speed: number }[] = [];

    for (let i = 0; i < 250; i++) {
      // Create node for the glass sphere
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const position = getRandomSpherePoint(sphereRadius);
      node.position.copy(position);
      node.lookAt(0, 0, 0);
      simpleGlassSphere.add(node);
      nodes.push(node);
      nodePositions.push(position.clone());

      // Create corresponding emissive node in background scene
      const emissiveNode = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      const backgroundPosition = position.clone().multiplyScalar(1.2);
      emissiveNode.position.copy(backgroundPosition);
      emissiveNode.lookAt(0, 0, 0);
      nodesGroup.add(emissiveNode);

      // Add point light at node position
      const pointLight = new THREE.PointLight(0xffffff, 0.05, 2);
      pointLight.position.copy(backgroundPosition);
      backgroundScene.add(pointLight);
    }

    // Create connections between nearby nodes
    const connectionThreshold = sphereRadius * 0.8; // Maximum distance for connection
    const maxConnectionsPerNode = 3; // Limit connections per node for cleaner look
    
    for (let i = 0; i < nodePositions.length; i++) {
      let connectionsCount = 0;
      const distances: { index: number; distance: number }[] = [];
      
      // Calculate distances to all other nodes
      for (let j = i + 1; j < nodePositions.length; j++) {
        const distance = sphericalDistance(nodePositions[i], nodePositions[j]);
        if (distance < connectionThreshold) {
          distances.push({ index: j, distance });
        }
      }
      
      // Sort by distance and create connections to closest nodes
      distances.sort((a, b) => a.distance - b.distance);
      for (const { index } of distances.slice(0, maxConnectionsPerNode)) {
        const points = [];
        // Create curved line following sphere surface
        const start = nodePositions[i];
        const end = nodePositions[index];
        const segments = 10;
        
        for (let t = 0; t <= segments; t++) {
          const point = start.clone().lerp(end, t / segments);
          point.normalize().multiplyScalar(sphereRadius);
          points.push(point);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        simpleGlassSphere.add(line);
        connections.push(line);

        // Store path for animation
        connectionPaths.push({
          points: points,
          progress: Math.random(), // Random starting position
          speed: 1.0 + Math.random() * 1.5, // Much faster speed between 1.0 and 2.5
        });
      }
    }

    // Create animated lines
    const animatedLines: THREE.Line[] = connectionPaths.map(() => {
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const line = new THREE.Line(geometry, animatedLineMaterial);
      simpleGlassSphere.add(line);
      return line;
    });

    // Add ambient and directional light to both scenes
    const sceneAmbientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(sceneAmbientLight);
    backgroundScene.add(sceneAmbientLight.clone());

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    backgroundScene.add(directionalLight.clone());

    // Animation loop
    let frameId: number;

    function animate() {
      frameId = requestAnimationFrame(animate);
      controls.update();
      
      // Animate flying sphere
      const currentTime = Date.now();
      const deltaTime = currentTime - flyingSphereParams.lastUpdateTime;
      flyingSphereParams.progress += deltaTime / flyingSphereParams.duration;

      if (flyingSphereParams.progress >= 1) {
        // Reset progress and update last time
        flyingSphereParams.progress = 0;
        flyingSphereParams.lastUpdateTime = currentTime;
      }

      // Calculate position on circular path (counter-clockwise)
      const angle = -flyingSphereParams.progress * Math.PI * 2;
      const newX = Math.cos(angle) * flightPathRadius;
      const newY = Math.sin(angle) * flightPathRadius;
      const newZ = flyingSphereParams.zOffset;

      // Update both spheres' positions
      flyingSphere.position.set(newX, newY, newZ);
      backgroundFlyingSphere.position.set(newX, newY, newZ);

      flyingSphereParams.lastUpdateTime = currentTime;
      
      // Rotate the sphere slowly
      simpleGlassSphere.rotation.y += 0.001;

      // Update animated lines
      connectionPaths.forEach((path, index) => {
        path.progress += path.speed * 0.05; // Increased speed multiplier from 0.01 to 0.05
        if (path.progress >= 1) {
          path.progress = 0;
        }

        // Calculate current position on the path
        const pointIndex = Math.floor(path.progress * (path.points.length - 1));
        const nextPointIndex = (pointIndex + 1) % path.points.length;
        const subProgress = path.progress * (path.points.length - 1) - pointIndex;

        const currentPoint = path.points[pointIndex].clone();
        const nextPoint = path.points[nextPointIndex].clone();
        const position = currentPoint.lerp(nextPoint, subProgress);

        // Update line geometry
        const lineLength = 0.2; // Length of the animated line segment
        const endProgress = Math.min(1, path.progress + lineLength);
        const endPointIndex = Math.floor(endProgress * (path.points.length - 1));
        const endNextPointIndex = (endPointIndex + 1) % path.points.length;
        const endSubProgress = endProgress * (path.points.length - 1) - endPointIndex;

        const endCurrentPoint = path.points[endPointIndex].clone();
        const endNextPoint = path.points[endNextPointIndex].clone();
        const endPosition = endCurrentPoint.lerp(endNextPoint, endSubProgress);

        const positions = new Float32Array([
          position.x, position.y, position.z,
          endPosition.x, endPosition.y, endPosition.z
        ]);
        animatedLines[index].geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      });

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

      // Rotate the background nodes group to match the glass sphere
      nodesGroup.rotation.copy(simpleGlassSphere.rotation);

      // Update duration based on current speed
      flyingSphereParams.duration = 5000 / flightPathSpeed;

      // Render background to texture
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(backgroundScene, camera);
      renderer.setRenderTarget(null);

      // Render main scene (now includes the flying sphere)
      renderer.clear();
      renderer.render(scene, camera);
    }

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
  }, [uniforms, iorR, iorY, iorG, iorC, iorB, iorP, refraction, chromaticAberration, saturation, shininess, diffuseness, fresnelPower, light, flightPathRadius, flightPathSpeed]);

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