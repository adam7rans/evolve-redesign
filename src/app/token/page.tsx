import React from 'react';

export default function TokenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-16 mb-48">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-8xl font-bold mb-4">$EVOLVE</h1>
          <p className="text-2xl text-muted-foreground mb-8">
            The native utility token powering our decentralized AI network. Stake, earn, and participate in governance to shape the future of AI.
          </p>
        </div>
        {/* Right Column - Image */}
        <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
      </div>

      {/* Core Features Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">DAO & Governance</h3>
            <p className="text-lg text-muted-foreground">
              Participate in protocol governance and shape the future of the network through voting and proposals.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Staking</h3>
            <p className="text-lg text-muted-foreground">
              Stake EVOLVE tokens to earn rewards and secure network operations while participating in the ecosystem.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Utility</h3>
            <p className="text-lg text-muted-foreground">
              Access premium features, deploy AI agents, and utilize advanced platform capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Access Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Platform Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto">
          <div className="aspect-[2/1] bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">Premium Features</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Unlock advanced capabilities and features with $EVOLVE tokens.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
              <li>Deploy advanced AI agents</li>
              <li>Access premium templates</li>
              <li>Priority compute resources</li>
              <li>Enhanced API access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Network Operations Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Network Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto">
          <div className="aspect-[2/1] bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">Participate & Earn</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Support network operations and earn rewards for your contribution.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
              <li>Stake tokens for network security</li>
              <li>Earn rewards for validation</li>
              <li>Participate in governance</li>
              <li>Support ecosystem growth</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
