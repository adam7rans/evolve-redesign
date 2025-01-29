'use client';

import dynamic from 'next/dynamic';
import { GradientHeader } from '@/components/examples/GradientHeader';

const NeuralNetworkDemo = dynamic(
  () => import('./demo/NeuralNetworkDemo'),
  { ssr: false }
);

export default function NeuralNetworkExperiments() {
  return (
    <main>
      <GradientHeader />
      <NeuralNetworkDemo />
    </main>
  );
}
