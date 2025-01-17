'use client';

import { InterlockedStarNestView } from './InterlockedStarNestView';
import { MobiusView } from './MobiusView';
import { OrderlyTangleView } from './OrderlyTangleView';
import { PseudoCatenoidView } from './PseudoCatenoidView';

export function GltfModels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <InterlockedStarNestView />
      <MobiusView />
      <OrderlyTangleView />
      <PseudoCatenoidView />
    </div>
  );
}
