'use client';

import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Leva, folder, useControls } from "leva";
import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const vertexShader = `varying vec3 worldNormal;
varying vec3 eyeVector;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  eyeVector =  normalize(worldPos.xyz - cameraPosition);
}`;

const fragmentShader = `uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;

uniform float uSaturation;
uniform float uChromaticAberration;
uniform float uRefractPower;
uniform float uFresnelPower;
uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLight;

uniform vec2 winResolution;
uniform sampler2D uTexture;

varying vec3 worldNormal;
varying vec3 eyeVector;

vec3 sat(vec3 rgb, float adjustment) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inversefresnelFactor = 1.0 - fresnelFactor;
  
  return pow(inversefresnelFactor, power);
}

float specular(vec3 light, float shininess, float diffuseness) {
  vec3 normal = worldNormal;
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(eyeVector + lightVector);

  float NdotL = dot(normal, lightVector);
  float NdotH =  dot(normal, halfVector);
  float kDiffuse = max(0.0, NdotL);
  float NdotH2 = NdotH * NdotH;

  float kSpecular = pow(NdotH2, shininess);
  return  kSpecular + kDiffuse * diffuseness;
}

const int LOOP = 16;

void main() {
  float iorRatioRed = 1.0/uIorR;
  float iorRatioGreen = 1.0/uIorG;
  float iorRatioBlue = 1.0/uIorB;

  vec2 uv = gl_FragCoord.xy / winResolution.xy;
  vec3 normal = worldNormal;
  vec3 color = vec3(0.0);

  for ( int i = 0; i < LOOP; i ++ ) {
    float slide = float(i) / float(LOOP) * 0.1;

    vec3 refractVecR = refract(eyeVector, normal,(1.0/uIorR));
    vec3 refractVecY = refract(eyeVector, normal, (1.0/uIorY));
    vec3 refractVecG = refract(eyeVector, normal, (1.0/uIorG));
    vec3 refractVecC = refract(eyeVector, normal, (1.0/uIorC));
    vec3 refractVecB = refract(eyeVector, normal, (1.0/uIorB));
    vec3 refractVecP = refract(eyeVector, normal, (1.0/uIorP));

    float r = texture2D(uTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;

    float y = (texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

    float g = texture2D(uTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;

    float c = (texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
          
    float b = texture2D(uTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;

    float p = (texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

    float R = r + (2.0*p + 2.0*y - c)/3.0;
    float G = g + (2.0*y + 2.0*c - p)/3.0;
    float B = b + (2.0*c + 2.0*p - y)/3.0;

    color.r += R;
    color.g += G;
    color.b += B;

    color = sat(color, uSaturation);
  }

  color /= float( LOOP );

  float specularLight = specular(uLight, uShininess, uDiffuseness);
  color += specularLight;

  float f = fresnel(eyeVector, normal, uFresnelPower);
  color.rgb += f * vec3(1.0);

  gl_FragColor = vec4(color, 1.0);
}`;

interface CustomShaderMaterial extends THREE.ShaderMaterial {
  uniforms: {
    uTexture: { value: THREE.Texture | null };
    uIorR: { value: number };
    uIorY: { value: number };
    uIorG: { value: number };
    uIorC: { value: number };
    uIorB: { value: number };
    uIorP: { value: number };
    uRefractPower: { value: number };
    uChromaticAberration: { value: number };
    uSaturation: { value: number };
    uShininess: { value: number };
    uDiffuseness: { value: number };
    uFresnelPower: { value: number };
    uLight: { value: THREE.Vector3 };
    winResolution: { value: THREE.Vector2 };
  };
}

interface CustomMesh extends THREE.Mesh {
  material: CustomShaderMaterial;
  geometry: THREE.TorusGeometry;
}

interface ControlTypes {
  light: {
    x: number;
    y: number;
    z: number;
  };
  material: {
    diffuseness: number;
    shininess: number;
    fresnelPower: number;
  };
  ior: {
    iorR: number;
    iorY: number;
    iorG: number;
    iorC: number;
    iorB: number;
    iorP: number;
  };
  effects: {
    saturation: number;
    chromaticAberration: number;
    refraction: number;
  };
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Glass component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the 3D render.</div>;
    }

    return this.props.children;
  }
}

const range = (start: number, end: number, step: number = 1) => {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

const GlassGeometries = () => {
  const mesh = useRef<ThreeElements['mesh']>(null);
  const backgroundGroup = useRef<THREE.Group>(null);
  const mainRenderTarget = useFBO();

  const [resolution, setResolution] = useState<THREE.Vector2>(new THREE.Vector2(1, 1));

  const controls = useControls<ControlTypes>({
    light: folder({
      x: { value: -1.0, min: -5, max: 5, step: 0.1 },
      y: { value: 1.0, min: -5, max: 5, step: 0.1 },
      z: { value: 1.0, min: -5, max: 5, step: 0.1 },
    }),
    material: folder({
      diffuseness: {
        value: 0.2,
        min: 0,
        max: 1,
        step: 0.01,
      },
      shininess: {
        value: 40.0,
        min: 0,
        max: 100,
        step: 0.1,
      },
      fresnelPower: {
        value: 8.0,
        min: 0,
        max: 20,
        step: 0.1,
      },
    }),
    ior: folder({
      iorR: { min: 1.0, max: 2.333, step: 0.001, value: 1.15 },
      iorY: { min: 1.0, max: 2.333, step: 0.001, value: 1.16 },
      iorG: { min: 1.0, max: 2.333, step: 0.001, value: 1.18 },
      iorC: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      iorB: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      iorP: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    }),
    effects: folder({
      saturation: { 
        value: 1.08, 
        min: 1, 
        max: 1.25, 
        step: 0.01 
      },
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
    }),
  });

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
      value: resolution,
    },
  }), [resolution]);

  useEffect(() => {
    const updateResolution = () => {
      setResolution(
        new THREE.Vector2(window.innerWidth, window.innerHeight)
          .multiplyScalar(Math.min(window.devicePixelRatio, 2))
      );
    };

    updateResolution();
    window.addEventListener('resize', updateResolution);
    return () => window.removeEventListener('resize', updateResolution);
  }, []);

  useFrame((state) => {
    const material = mesh.current?.material;
    if (!material || !controls) return;

    const { gl, scene, camera } = state;
    
    if (!mesh.current) return;
    
    mesh.current.visible = false;
    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);

    if (!material.uniforms.uTexture) return;
    material.uniforms.uTexture.value = mainRenderTarget.texture;

    gl.setRenderTarget(null);
    mesh.current.visible = true;

    // Only update uniforms if all required control values are available
    if (controls.material && controls.light && controls.ior && controls.effects) {
      // Update material uniforms
      const uniformUpdates = {
        uDiffuseness: controls.material.diffuseness,
        uShininess: controls.material.shininess,
        uLight: new THREE.Vector3(controls.light.x, controls.light.y, controls.light.z),
        uFresnelPower: controls.material.fresnelPower,
        uIorR: controls.ior.iorR,
        uIorY: controls.ior.iorY,
        uIorG: controls.ior.iorG,
        uIorC: controls.ior.iorC,
        uIorB: controls.ior.iorB,
        uIorP: controls.ior.iorP,
        uSaturation: controls.effects.saturation,
        uChromaticAberration: controls.effects.chromaticAberration,
        uRefractPower: controls.effects.refraction,
      };

      // Update uniforms if they exist
      Object.entries(uniformUpdates).forEach(([name, value]) => {
        const uniform = material.uniforms[name as keyof typeof material.uniforms];
        if (uniform) {
          uniform.value = value;
        }
      });
    }
  });

  const columns = range(-7.5, 7.5, 2.5);
  const rows = range(-7.5, 7.5, 2.5);

  return (
    <>
      <color attach="background" args={["black"]} />
      <group ref={backgroundGroup}>
        {columns.map((col, i) =>
          rows.map((row, j) => (
            <mesh key={`${i}-${j}`} position={[col, row, -4]}>
              <icosahedronGeometry args={[0.5, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))
        )}
      </group>
      <mesh ref={mesh}>
        <torusGeometry args={[3, 1, 16, 100]} />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
        />
      </mesh>
    </>
  );
};

const Glass = () => {
  return (
    <>
      <Leva collapsed />
      <Canvas camera={{ position: [0, 0, 7] }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ErrorBoundary>
            <ambientLight intensity={1.0} />
            <GlassGeometries />
            <OrbitControls />
          </ErrorBoundary>
        </Suspense>
      </Canvas>
    </>
  );
};

export default Glass;
