'use client';

import dynamic from 'next/dynamic';
import { GradientHeader } from '@/components/examples/GradientHeader';

const DispersionGlass = dynamic(
  () => import('./dispersion/DispersionGlass'),
  { ssr: false }
);

export default function BlenderImportExperiment() {
  return (
    <main>
      <GradientHeader />
      <DispersionGlass />
    </main>
  );
}
