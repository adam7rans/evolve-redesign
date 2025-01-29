'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Pulse {
  startNode: THREE.Vector3;
  endNode: THREE.Vector3;
  progress: number;
  line: THREE.Line;
  speed: number;
}

interface GlowEffect {
  mesh: THREE.Mesh;
  opacity: number;
  fadeSpeed: number;
}

export default function RSpherePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;

    // Create sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a2a2a,
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    // Set up rotation container
    const sphereContainer = new THREE.Object3D();
    sphereContainer.add(sphere);
    scene.add(sphereContainer);

    // Set initial rotation speed (radians per frame)
    const rotationSpeed = 0.01;

    // Add a slight tilt to mimic Earth's axis (about 23.5 degrees)
    sphereContainer.rotation.z = THREE.MathUtils.degToRad(23.5);

    // Glow effect management
    const glowEffects: GlowEffect[] = [];
    const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    
    function createGlowEffect(position: THREE.Vector3) {
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(position);
      scene.add(glowMesh);
      
      glowEffects.push({
        mesh: glowMesh,
        opacity: 0.8,
        fadeSpeed: 0.1,
      });
    }

    function updateGlowEffects() {
      for (let i = glowEffects.length - 1; i >= 0; i--) {
        const effect = glowEffects[i];
        effect.opacity -= effect.fadeSpeed;
        
        if (effect.opacity <= 0) {
          scene.remove(effect.mesh);
          glowEffects.splice(i, 1);
        } else {
          (effect.mesh.material as THREE.MeshBasicMaterial).opacity = effect.opacity;
        }
      }
    }

    // Generate random points on sphere surface
    const generateRandomSpherePoints = (numPoints: number, radius: number) => {
      const points: THREE.Vector3[] = [];

      for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const basePoint = new THREE.Vector3(x, y, z).normalize().multiplyScalar(radius);
        const elevation = radius * (1 + Math.random() * 0.06);
        const point = basePoint.normalize().multiplyScalar(elevation);
        points.push(point);
      }

      return points;
    };

    // Create nodes
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nodes: THREE.Mesh[] = [];
    
    const nodePositions = generateRandomSpherePoints(500, 5);
    
    nodePositions.forEach(position => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      scene.add(node);
      nodes.push(node);
    });

    // Store connected node pairs
    interface NodeConnection {
      start: THREE.Vector3;
      end: THREE.Vector3;
    }
    const connections: NodeConnection[] = [];

    // Create connections between nearby nodes
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });

    const maxDistance = 1.8;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < maxDistance) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position,
          ]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          
          connections.push({
            start: nodes[i].position.clone(),
            end: nodes[j].position.clone()
          });
        }
      }
    }

    // Energy pulse system
    const pulses: Pulse[] = [];
    const pulseMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    function createNewPulse() {
      if (connections.length === 0) return;
      
      const connection = connections[Math.floor(Math.random() * connections.length)];
      
      const pulseGeometry = new THREE.BufferGeometry().setFromPoints([
        connection.start,
        connection.start,
      ]);
      
      const pulseLine = new THREE.Line(pulseGeometry, pulseMaterial);
      scene.add(pulseLine);

      // Create glow effect at start node
      createGlowEffect(connection.start);

      pulses.push({
        startNode: connection.start,
        endNode: connection.end,
        progress: 0,
        line: pulseLine,
        speed: 0.1 + Math.random() * 0.15,
      });
    }

    // Create initial pulses
    for (let i = 0; i < 100; i++) {
      createNewPulse();
    }

    // Update pulses
    function updatePulses() {
      pulses.forEach((pulse, index) => {
        pulse.progress += pulse.speed;
        
        if (pulse.progress >= 1) {
          // Create glow effect at end node
          createGlowEffect(pulse.endNode);
          
          scene.remove(pulse.line);
          pulses.splice(index, 1);
          createNewPulse();
          return;
        }

        const currentPos = new THREE.Vector3().lerpVectors(
          pulse.startNode,
          pulse.endNode,
          pulse.progress
        );

        const points = [pulse.startNode, currentPos];
        pulse.line.geometry.setFromPoints(points);
      });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Position camera
    camera.position.z = 15;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the sphere container around its axis
      sphere.rotation.y += rotationSpeed;

      // Update existing animations
      updatePulses();
      updateGlowEffects();
      controls.update();
      renderer.render(scene, camera);
    }

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
