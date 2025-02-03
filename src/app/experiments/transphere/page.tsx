'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useControls } from 'leva';

interface Node {
  core: THREE.Mesh;
  glow: THREE.Mesh;
  glowIntensity: number;
}

// Function to generate random points on a sphere surface
function getRandomSpherePoint(radius: number): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  );
}

export default function TransSpherePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Create controls for the sphere material
  const { transparency, fogDensity, glowSize, glowIntensity, pulseSpeed } = useControls({
    transparency: { value: 0, min: 0, max: 1, step: 0.01 },
    fogDensity: { value: 0.15, min: 0, max: 0.3, step: 0.01 },
    glowSize: { value: 0.04, min: 0.01, max: 0.1, step: 0.01 },
    glowIntensity: { value: 2.0, min: 0.5, max: 5.0, step: 0.1 },
    pulseSpeed: { value: 1.0, min: 0.2, max: 3.0, step: 0.1 }
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Add fog for atmospheric depth
    scene.fog = new THREE.FogExp2(0x000000, fogDensity);
    
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

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Create main sphere
    const simpleSphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0 - transparency,
      metalness: 0.2,
      roughness: 0.1,
      side: THREE.DoubleSide,
      fog: true // Enable fog for the sphere
    });

    const simpleSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 64, 64),
      simpleSphereMaterial
    );
    scene.add(simpleSphere);

    // Create nodes on sphere surface
    const nodeGeometry = new THREE.SphereGeometry(glowSize / 2, 8, 8);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.0,
      metalness: 0.0,
      roughness: 0.0,
      fog: true
    });

    // Create glow material for nodes
    const glowGeometry = new THREE.SphereGeometry(glowSize, 16, 16);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xffffff) },
        glowIntensity: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowIntensity;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          // Calculate distance from center
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Create smooth radial gradient
          float alpha = smoothstep(1.0, 0.0, dist * 2.0) * glowIntensity;
          
          // Add extra intensity at the center
          float centerBoost = smoothstep(0.2, 0.0, dist) * glowIntensity;
          alpha = mix(alpha, 1.0, centerBoost);
          
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending
    });

    // Create 250 nodes
    const nodes: Node[] = [];
    const sphereRadius = 2.5; // Same as main sphere radius

    // Create line material for connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      fog: true // Enable fog for static lines
    });

    // Create material for animated lines
    const animatedLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,
      fog: true // Enable fog for animated lines
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
      // Create node core
      const nodeCore = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial.clone());
      const position = getRandomSpherePoint(sphereRadius);
      
      nodeCore.position.copy(position);
      glowSphere.position.copy(position);
      
      nodeCore.lookAt(0, 0, 0);
      glowSphere.lookAt(0, 0, 0);
      
      simpleSphere.add(nodeCore);
      simpleSphere.add(glowSphere);
      
      nodes.push({
        core: nodeCore,
        glow: glowSphere,
        glowIntensity: 0.0
      });
      nodePositions.push(position.clone());
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
        simpleSphere.add(line);
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
      simpleSphere.add(line);
      return line;
    });

    // Add ambient and directional light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    let frameId: number;

    function animate() {
      frameId = requestAnimationFrame(animate);
      controls.update();
      
      // Rotate the sphere slowly
      simpleSphere.rotation.y += 0.001;

      // Update animated lines
      connectionPaths.forEach((path, index) => {
        path.progress += pulseSpeed * 0.05;
        if (path.progress >= 1) {
          path.progress = 0;
          
          // Find the end node and make it glow
          const endPointIndex = path.points.length - 1;
          const endPosition = path.points[endPointIndex];
          
          // Find the closest node to the end position
          let closestNode: Node | null = null;
          let closestDistance = Infinity;
          
          (nodes as Node[]).forEach((node: Node) => {
            const distance = node.core.position.distanceTo(endPosition);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestNode = node;
            }
          });
          
          if (closestNode && closestDistance < 0.1) {
            closestNode.glowIntensity = glowIntensity;
          }
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

      // Update node glow effects
      nodes.forEach((node) => {
        if (node.glowIntensity > 0) {
          (node.glow.material as THREE.ShaderMaterial).uniforms.glowIntensity.value = node.glowIntensity;
          node.glowIntensity = Math.max(0, node.glowIntensity - 0.1);
        }
      });

      // Update sphere opacity and fog
      simpleSphereMaterial.opacity = 1.0 - transparency;
      scene.fog.density = fogDensity;

      renderer.render(scene, camera);
    }

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
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
  }, [transparency, fogDensity, glowSize, glowIntensity, pulseSpeed]);

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