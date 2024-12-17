import React from 'react';

export default function NetworkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-16 mb-48">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-8xl font-bold mb-4">Network</h1>
          <p className="text-2xl text-muted-foreground mb-8">
            A decentralized infrastructure powering AI agent execution, data storage, and secure cross-chain communication through a network of distributed nodes.
          </p>
        </div>
        {/* Right Column - Image */}
        <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
      </div>

      {/* Network Features Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Node Infrastructure</h3>
            <p className="text-lg text-muted-foreground">
              Run network nodes to provide computational resources, storage, and secure validation for AI agent operations while earning rewards.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Cross-Chain Bridge</h3>
            <p className="text-lg text-muted-foreground">
              Enable seamless interoperability between different blockchain networks through secure cross-chain communication protocols.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Decentralized Storage</h3>
            <p className="text-lg text-muted-foreground">
              Leverage distributed storage solutions for secure and efficient data management across the network's nodes.
            </p>
          </div>
        </div>
      </section>

      {/* Node Runner Program Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Node Runner Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto">
          <div className="aspect-[2/1] bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">Join as Node Operator</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Become part of our decentralized infrastructure and earn rewards.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
              <li>Earn rewards for providing computational resources</li>
              <li>Participate in network validation and security</li>
              <li>Support AI agent execution and data processing</li>
              <li>Help scale the decentralized infrastructure</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blockchain Integration Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Blockchain Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-[90rem] mx-auto">
          <div className="aspect-[2/1] bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-4">Secure & Transparent</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Our network leverages blockchain technology for maximum security and transparency.
            </p>
            <ul className="list-disc list-inside space-y-2 text-lg text-muted-foreground">
              <li>Transparent and secure transactions</li>
              <li>Decentralized governance mechanisms</li>
              <li>Cross-chain interoperability</li>
              <li>Immutable record-keeping</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
