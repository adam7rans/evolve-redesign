import React from 'react';

const AgentsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-2 gap-16 mb-48">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-8xl font-bold mb-4">Agent Platform</h1>
          <p className="text-2xl text-muted-foreground mb-8">
            The Evolve Network agent platform gives the user the ability to create, manage, and run AI agents and AI agent swarms from a single web app that's composed of the <strong>Agent Studio</strong> and <strong>Data Studio</strong>.
          </p>
        </div>
        {/* Right Column - Image */}
        <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
      </div>

      {/* Agent Studio Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Agent Studio</h2>
        <p className="text-2xl text-muted-foreground mb-16 max-w-3xl">
          A comprehensive environment for creating, deploying, and managing AI agents through a visual flow-based interface. Build agents with built-in tools, memory systems, and share them through the Agents Hub.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Create</h3>
            <p className="text-lg text-muted-foreground">
              Design and build your AI agents with an intuitive interface
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">APIs</h3>
            <p className="text-lg text-muted-foreground">
              Connect your agents to various services and data sources
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">My Agents</h3>
            <p className="text-lg text-muted-foreground">
              Run, manage, and monitor your deployed AI agents
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Hub</h3>
            <p className="text-lg text-muted-foreground">
              Discover and share agents with the community
            </p>
          </div>
        </div>
      </section>

      {/* Data Studio Section */}
      <section className="mb-48">
        <h2 className="text-6xl font-bold mb-16">Data Studio</h2>
        <p className="text-2xl text-muted-foreground mb-16 max-w-3xl">
          A centralized platform for managing and sharing AI-ready datasets, with built-in tools for data processing, versioning, and collaboration. Transform your raw data into structured collections ready for AI applications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[90rem] mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Create</h3>
            <p className="text-lg text-muted-foreground">
              Build and customize your data collections
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Collections</h3>
            <p className="text-lg text-muted-foreground">
              Organize and manage your data assets
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Hub</h3>
            <p className="text-lg text-muted-foreground">
              Access shared datasets and templates
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentsPage;