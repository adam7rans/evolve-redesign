'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';

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
    
    float f = fresnel(viewDirection, normal);
    
    vec3 refractedR = disperseRefract(viewDirection, normal, iorR, -1.0);
    vec3 refractedG = disperseRefract(viewDirection, normal, iorG, 0.0);
    vec3 refractedB = disperseRefract(viewDirection, normal, iorB, 1.0);
    
    vec2 uv = gl_FragCoord.xy / winResolution;
    
    float r = texture2D(uTexture, uv + refractedR.xy * refractionRatio).r;
    float g = texture2D(uTexture, uv + refractedG.xy * refractionRatio).g;
    float b = texture2D(uTexture, uv + refractedB.xy * refractionRatio).b;
    
    vec3 color = vec3(r, g, b);
    vec3 reflection = reflect(viewDirection, normal);
    
    vec3 finalColor = mix(color, reflection, f * reflectivity);
    
    // Apply basic tone mapping
    finalColor = finalColor / (finalColor + vec3(1.0));
    
    // Convert to sRGB space
    finalColor = pow(finalColor, vec3(1.0 / 2.2));
    
    gl_FragColor = vec4(finalColor, opacity);
  }
`;

interface GlassMaterialProps {
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

export const GlassMaterial: React.FC<GlassMaterialProps> = ({
  iorR = 1.14,
  iorG = 1.16,
  iorB = 1.18,
  fresnelPower = 2.0,
  opacity = 0.8,
  roughness = 0.1,
  metalness = 0.5,
  reflectivity = 0.5,
  chromaticAberration = 0.1,
  refractionRatio = 0.1
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const renderTarget = useFBO();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null },
      winResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
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
    [iorR, iorG, iorB, fresnelPower, opacity, roughness, metalness, reflectivity, chromaticAberration, refractionRatio]
  );

  useFrame((state) => {
    if (materialRef.current) {
      state.gl.setRenderTarget(renderTarget);
      state.gl.render(state.scene, state.camera);
      state.gl.setRenderTarget(null);
      
      materialRef.current.uniforms.uTexture.value = renderTarget.texture;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
    />
  );
};
