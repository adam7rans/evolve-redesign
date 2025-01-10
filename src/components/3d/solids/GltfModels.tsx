import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { InterlockedStarNest } from '@/components/3d/models/InterlockedStarNest';
import { Mobius } from '@/components/3d/models/Mobius';
import { OrderlyTangle } from '@/components/3d/models/OrderlyTangle';
import { PseudoCatenoid } from '@/components/3d/models/PseudoCatenoid';
import { GlassMaterial } from './GlassMaterial';

export function GltfModels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <InterlockedStarNest>
            <GlassMaterial 
              iorR={1.14} 
              iorG={1.16} 
              iorB={1.18}
              opacity={0.8}
              chromaticAberration={0.1}
            />
          </InterlockedStarNest>
          <OrbitControls autoRotate />
        </Canvas>
      </div>
      <div className="aspect-square">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Mobius>
            <GlassMaterial 
              iorR={1.16} 
              iorG={1.18} 
              iorB={1.20}
              opacity={0.85}
              chromaticAberration={0.15}
            />
          </Mobius>
          <OrbitControls autoRotate />
        </Canvas>
      </div>
      <div className="aspect-square">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrderlyTangle>
            <GlassMaterial 
              iorR={1.12} 
              iorG={1.14} 
              iorB={1.16}
              opacity={0.75}
              chromaticAberration={0.08}
            />
          </OrderlyTangle>
          <OrbitControls autoRotate />
        </Canvas>
      </div>
      <div className="aspect-square">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <PseudoCatenoid>
            <GlassMaterial 
              iorR={1.18} 
              iorG={1.20} 
              iorB={1.22}
              opacity={0.9}
              chromaticAberration={0.12}
            />
          </PseudoCatenoid>
          <OrbitControls autoRotate />
        </Canvas>
      </div>
    </div>
  );
}
