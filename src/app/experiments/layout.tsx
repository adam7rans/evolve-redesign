'use client';

import { usePathname } from 'next/navigation';

const ExperimentsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-black">
      <main>{children}</main>
    </div>
  );
};

export default ExperimentsLayout;
