import React from 'react';

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-24 mb-48">
        {/* Left Column - Image */}
        <div className="relative">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
        </div>

        {/* Right Column - Text */}
        <div className="flex flex-col justify-end">
          <h1 className="text-8xl font-bold mb-4">Roadmap</h1>
          <p className="text-2xl text-muted-foreground mb-0">
            Our vision for the future of decentralized AI. Explore our journey and upcoming milestones.
          </p>
        </div>
      </div>

      {/* Vertical Roadmap */}
      <div className="space-y-24 mb-16 max-w-6xl mx-auto">
        {/* Phase 1 - Foundation */}
        <div className="grid grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-placeholder-light dark:bg-placeholder-dark font-semibold mb-4">Jan 2025</div>
            <h2 className="text-4xl font-bold mb-4">Foundation</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Establishing the core infrastructure and community foundation for the Evolve Network.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Website and Documentation Launch</li>
              <li>Community Building and Social Media Presence</li>
              <li>Core Team Formation</li>
              <li>Initial Partnerships</li>
            </ul>
          </div>
        </div>

        {/* Phase 2 - Token Launch */}
        <div className="grid grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-placeholder-light dark:bg-placeholder-dark font-semibold mb-4">Mar 2025</div>
            <h2 className="text-4xl font-bold mb-4">Token Launch</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Introduction of the $EVOLVE token and initial platform features.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>$EVOLVE Token Launch</li>
              <li>Token Distribution</li>
              <li>Staking Platform</li>
              <li>Basic AI Model Access</li>
            </ul>
          </div>
        </div>

        {/* Phase 3 - Network Development */}
        <div className="grid grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-placeholder-light dark:bg-placeholder-dark font-semibold mb-4">May 2025</div>
            <h2 className="text-4xl font-bold mb-4">Network Development</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Expanding network capabilities and introducing advanced features.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Advanced AI Model Integration</li>
              <li>Network Node Deployment</li>
              <li>Developer SDK Release</li>
              <li>Enhanced Security Features</li>
            </ul>
          </div>
        </div>

        {/* Phase 4 - DAO Launch */}
        <div className="grid grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-placeholder-light dark:bg-placeholder-dark font-semibold mb-4">Jul 2025</div>
            <h2 className="text-4xl font-bold mb-4">DAO Launch</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Implementing decentralized governance and community control.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Governance Framework</li>
              <li>DAO Smart Contracts</li>
              <li>Proposal System</li>
              <li>Treasury Management</li>
            </ul>
          </div>
        </div>

        {/* Phase 5 - Ecosystem Growth */}
        <div className="grid grid-cols-2 gap-24 items-center">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-placeholder-light dark:bg-placeholder-dark font-semibold mb-4">Sep 2025</div>
            <h2 className="text-4xl font-bold mb-4">Ecosystem Growth</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Expanding the ecosystem through partnerships and integrations.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Cross-chain Integrations</li>
              <li>DApp Ecosystem</li>
              <li>Enterprise Partnerships</li>
              <li>Global Community Expansion</li>
            </ul>
          </div>
        </div>

        {/* Phase 6 - Network Evolution */}
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-placeholder-light dark:bg-placeholder-dark rounded-lg" />
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-placeholder-light dark:bg-placeholder-dark font-semibold mb-4">Phase 6</div>
            <h2 className="text-4xl font-bold mb-4">Network Evolution</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Achieving full decentralization and advanced network capabilities.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Full Decentralization</li>
              <li>Advanced AI Features</li>
              <li>Network Scaling Solutions</li>
              <li>Research and Innovation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
