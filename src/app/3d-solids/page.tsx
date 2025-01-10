'use client';

import { ArchimedeanSolids } from '@/components/3d/solids/ArchimedeanSolids';
import { PlatonicSolids } from '@/components/3d/solids/PlatonicSolids';
import { CustomSolids } from '@/components/3d/solids/CustomSolids';
import { GltfModels } from '@/components/3d/solids/GltfModels';

export default function SolidsPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">3D Solids</h1>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">Custom Glass Solids</h2>
          <CustomSolids />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">Mathematical Models</h2>
          <GltfModels />
        </section>
        <section>
           <h2 className="text-2xl font-semibold mb-4 text-white">Platonic Solids</h2>
          <PlatonicSolids />
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">Archimedean Solids</h2>
          <ArchimedeanSolids />
        </section>
      </div>
    </div>
  );
}
