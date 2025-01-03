import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { Mesh } from 'three';

const vertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 winResolution;
  uniform float iorR;
  uniform float iorG;
  uniform float iorB;
  uniform float fresnelPower;
  uniform float opacity;
  uniform float roughness;
  uniform float metalness;
  uniform float reflectivity;
  uniform float chromaticAberration;
  uniform float refractionRatio;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  float fresnel(vec3 viewDirection, vec3 normal) {
    float fresnelFactor = 1.0 - max(0.0, dot(viewDirection, normal));
    return pow(fresnelFactor, fresnelPower);
  }

  vec3 disperseRefract(vec3 viewDirection, vec3 normal, float ior, float aberration) {
    float adjustedIor = ior + aberration * chromaticAberration;
    return refract(viewDirection, normal, 1.0/adjustedIor);
  }

  void main() {
    vec3 viewDirection = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    
    // Apply roughness to normal
    if (roughness > 0.0) {
      vec3 roughNormal = normal + roughness * (vec3(
        fract(sin(dot(vPosition.xy ,vec2(12.9898,78.233))) * 43758.5453),
        fract(sin(dot(vPosition.yz ,vec2(12.9898,78.233))) * 43758.5453),
        fract(sin(dot(vPosition.zx ,vec2(12.9898,78.233))) * 43758.5453)
      ) * 2.0 - 1.0);
      normal = normalize(mix(normal, roughNormal, roughness));
    }
    
    vec3 refractedR = disperseRefract(viewDirection, normal, iorR, 1.0);
    vec3 refractedG = disperseRefract(viewDirection, normal, iorG, 0.0);
    vec3 refractedB = disperseRefract(viewDirection, normal, iorB, -1.0);
    
    vec2 uvR = gl_FragCoord.xy / winResolution + refractedR.xy * refractionRatio;
    vec2 uvG = gl_FragCoord.xy / winResolution + refractedG.xy * refractionRatio;
    vec2 uvB = gl_FragCoord.xy / winResolution + refractedB.xy * refractionRatio;
    
    vec4 refractedColor = vec4(
      texture2D(uTexture, uvR).r,
      texture2D(uTexture, uvG).g,
      texture2D(uTexture, uvB).b,
      1.0
    );
    
    float f = fresnel(viewDirection, normal);
    vec3 reflectedColor = vec3(f);
    
    // Mix reflection and refraction based on metalness and reflectivity
    vec3 finalColor = mix(
      refractedColor.rgb,
      reflectedColor,
      f * reflectivity + metalness
    );
    
    gl_FragColor = vec4(finalColor, opacity);
  }
`;

interface GlassObjectProps {
  geometry?: 'sphere' | 'torus' | 'cone' | 'cylinder';
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

export const GlassObject = ({ 
  geometry = 'sphere',
  position = [0, 0, 0],
  scale = 1,
  iorR = 1.14,
  iorG = 1.16,
  iorB = 1.18,
  fresnelPower = 2.0,
  opacity = 1.0,
  roughness = 0.0,
  metalness = 0.0,
  reflectivity = 0.0,
  chromaticAberration = 0.0,
  refractionRatio = 0.0
}: GlassObjectProps) => {
  const mesh = useRef<Mesh>(null);
  const mainRenderTarget = useFBO();
  const targetScale = useRef(scale);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: null,
      },
      winResolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
      },
      iorR: { value: iorR },
      iorG: { value: iorG },
      iorB: { value: iorB },
      fresnelPower: { value: fresnelPower },
      opacity: { value: opacity },
      roughness: { value: roughness },
      metalness: { value: metalness },
      reflectivity: { value: reflectivity },
      chromaticAberration: { value: chromaticAberration },
      refractionRatio: { value: refractionRatio }
    }),
    []  // Empty dependency array since we'll update manually
  );

  // Update uniforms when props change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.iorR.value = iorR;
      materialRef.current.uniforms.iorG.value = iorG;
      materialRef.current.uniforms.iorB.value = iorB;
      materialRef.current.uniforms.fresnelPower.value = fresnelPower;
      materialRef.current.uniforms.opacity.value = opacity;
      materialRef.current.uniforms.roughness.value = roughness;
      materialRef.current.uniforms.metalness.value = metalness;
      materialRef.current.uniforms.reflectivity.value = reflectivity;
      materialRef.current.uniforms.chromaticAberration.value = chromaticAberration;
      materialRef.current.uniforms.refractionRatio.value = refractionRatio;
    }
  }, [iorR, iorG, iorB, fresnelPower, opacity, roughness, metalness, reflectivity, chromaticAberration, refractionRatio]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    const { gl, scene, camera } = state;
    mesh.current.visible = false;
    
    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);
    
    if (mesh.current.material) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTexture.value = mainRenderTarget.texture;
    }
    
    gl.setRenderTarget(null);
    mesh.current.visible = true;

    targetScale.current = scale;
    mesh.current.scale.lerp(new THREE.Vector3(scale, scale, scale), delta * 2);
  });

  const getGeometry = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[1, 64, 64]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 32, 100]} />;
      case 'cone':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      default:
        return <sphereGeometry args={[1, 64, 64]} />;
    }
  };

  return (
    <mesh
      ref={mesh as React.RefObject<Mesh>}
      position={position}
      scale={scale}
    >
      {getGeometry()}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};
