import React from 'react';

export default function DAOPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-16 mb-48">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-8xl font-bold mb-4">Evolve DAO</h1>
          <p className="text-2xl text-muted-foreground mb-8">
            Decentralized governance for the future of AI. Shape the evolution of our network through community-driven decision making.
          </p>
        </div>
        {/* Right Column - Image */}
        <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
      </div>

      {/* Core Features Section */}
      <section id="features" className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Voting Power</h3>
            <p className="text-lg text-muted-foreground">
              Stake $EVOLVE tokens to gain voting power. The more tokens staked, the greater your influence in governance decisions.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Proposal System</h3>
            <p className="text-lg text-muted-foreground">
              Submit and vote on proposals that shape the network's future, from protocol upgrades to treasury allocations.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Treasury Management</h3>
            <p className="text-lg text-muted-foreground">
              Community-controlled treasury for funding development, marketing, and ecosystem growth initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Governance Process Section */}
      <section id="governance" className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Governance Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto">
          <div className="aspect-[2/1] bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">1. Proposal Creation</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Any community member can create a proposal by staking the required amount of $EVOLVE tokens.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Minimum stake requirement: 100,000 $EVOLVE</li>
              <li>2-day discussion period</li>
              <li>Clear implementation plan required</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto mt-16">
          <div className="aspect-[2/1] bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">2. Voting Period</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Token holders can vote on active proposals using their staked $EVOLVE tokens.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>5-day voting period</li>
              <li>One token = One vote</li>
              <li>Minimum quorum required</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Proposal Types Section */}
      <section id="proposals" className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Proposal Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Protocol Changes</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Network parameters</li>
              <li>Smart contract upgrades</li>
              <li>Security improvements</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Treasury Allocation</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Development funding</li>
              <li>Marketing initiatives</li>
              <li>Community rewards</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Ecosystem Growth</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Partnership proposals</li>
              <li>Integration requests</li>
              <li>Feature additions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Participation Requirements */}
      <section id="participate" className="mb-48">
        <h2 className="text-6xl font-bold mb-16">How to Participate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Stake to Vote</h3>
            <p className="text-lg text-muted-foreground">
              Stake your $EVOLVE tokens in the governance contract to participate in voting. Your voting power is proportional to your staked amount.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Create Proposals</h3>
            <p className="text-lg text-muted-foreground">
              Meet the minimum stake requirement and submit your proposal through the governance portal. Ensure your proposal includes clear implementation details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
