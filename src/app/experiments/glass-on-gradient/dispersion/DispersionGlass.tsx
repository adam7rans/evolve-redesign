import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, createPortal } from "@react-three/fiber";
import { Leva, useControls, folder } from "leva";
import { useMemo, useRef, useContext, createContext } from "react";
import * as THREE from "three";
import { Mesh, ShaderMaterial, Group, WebGLRenderTarget } from 'three';
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import ScrollingBackgroundGradient from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient';

interface SceneProps {
  controlsFolder?: string;
}

// Create a context to share the background texture
const BackgroundTextureContext = createContext<THREE.Texture | null>(null);

const GradientScene = ({ controlsFolder }: { controlsFolder?: string }) => {
  return (
    <>
      <ScrollingBackgroundGradient 
        screens={1} 
        loopScroll={false} 
        controlsFolder={`${controlsFolder || 'Glass'}/Background`} 
      />
    </>
  );
};

const GradientBackground = ({ controlsFolder }: { controlsFolder?: string }) => {
  return (
    <Canvas 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
      }}
      gl={{ 
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true
      }}
      camera={{ position: [0, 0, 1] }}
    >
      <GradientScene controlsFolder={controlsFolder} />
    </Canvas>
  );
};

const SingleTorus = ({ controlsFolder }: { controlsFolder: string }) => {
  const mesh = useRef<Mesh<THREE.BufferGeometry, ShaderMaterial>>(null);
  const backgroundTexture = useContext(BackgroundTextureContext);

  const uniforms = useMemo(() => ({
    uTexture: { value: null },
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
    winResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        .multiplyScalar(Math.min(window.devicePixelRatio, 2)),
    },
  }), []);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.material.uniforms.uTexture.value = backgroundTexture;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh ref={mesh} position={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.3, 16, 100]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>
    </>
  );
};

const TorusCard = ({ index, controlsFolder }: { index: number; controlsFolder?: string }) => {
  return (
    <div className="torus-card" style={{
      width: '300px',
      height: '400px',
      margin: '20px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <h2 style={{ 
        margin: 0,
        color: '#fff',
        fontSize: '1.5rem'
      }}>
        Torus {index + 1}
      </h2>
      <div style={{ 
        height: '250px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        background: 'transparent'
      }}>
        <BackgroundTextureContext.Consumer>
          {(texture) => (
            <Canvas 
              camera={{ position: [0, 0, 3] }}
              gl={{ 
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
              }}
            >
              <SingleTorus controlsFolder={`${controlsFolder || 'Glass'}_${index}`} />
              <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
          )}
        </BackgroundTextureContext.Consumer>
      </div>
      <p style={{ 
        margin: 0,
        color: '#ccc',
        fontSize: '0.9rem',
        flex: 1
      }}>
        Interactive glass torus with chromatic aberration and dynamic refraction effects.
      </p>
      <button style={{
        padding: '10px 20px',
        backgroundColor: '#2a6c9c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s',
      }}>
        Explore Effects
      </button>
    </div>
  );
};

const Scene = ({ controlsFolder }: SceneProps) => {
  return (
    <main style={{ 
      position: 'relative',
      minHeight: '100vh',
      background: 'transparent',
      isolation: 'isolate'  // Create a new stacking context
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1
      }}>
        <Canvas 
          style={{
            width: '100%',
            height: '100%'
          }}
          gl={{ 
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: true
          }}
          camera={{ position: [0, 0, 1] }}
        >
          <GradientScene controlsFolder={controlsFolder} />
        </Canvas>
      </div>
      <div style={{
        width: "100%",
        minHeight: "100vh",
        position: 'relative',
        padding: '40px 20px',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          justifyItems: 'center',
        }}>
          {Array.from({ length: 9 }).map((_, index) => (
            <TorusCard key={index} index={index} controlsFolder={controlsFolder} />
          ))}
        </div>
        <Leva />
      </div>
    </main>
  );
};

export default Scene;
