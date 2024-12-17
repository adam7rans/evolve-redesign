'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from 'next/link'
import { RotatingText } from "@/components/ui/rotating-text"

const rotatingWords = ["AI agents", "compute", "community intelligence", "token value"]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-48">
      
      {/* Hero Section */}
      <section id="overview" className="text-center my-24 space-y-6">
        <h1 className="text-7xl font-bold flex flex-col gap-2">
          <span>Decentralized Network</span>
          <span>for Scalable</span>
          <RotatingText 
            words={rotatingWords} 
            className="bg-gradient-to-r from-blue-900 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
          />
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
        A decentralized platform that empowers developers to create, deploy, and monetize AI agents while enabling seamless collaboration and data sharing across the network.        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="outline">Get Started</Button>
        </div>
      </section>

      {/* Network Overview */}
      <section id="features" className="space-y-10 mb-96">
        <div className="flex items-center gap-2 justify-center">
          <h2 className="text-6xl font-bold">Core Features</h2>
        </div>  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-[90rem] mx-auto">
          {/* Agent Platform */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="aspect-square w-full bg-placeholder-light dark:bg-placeholder-dark rounded-lg flex items-center justify-center">
              <Icons.blocks className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold">Agent Platform</h3>
            <p className="text-muted-foreground">
              Create, deploy, and monetize AI agents with our no-code platform and pre-made templates.
            </p>
            <Button variant="outline" asChild>
              <Link href="/agents">Learn More</Link>
            </Button>
          </div>

          {/* Node Network */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="aspect-square w-full bg-placeholder-light dark:bg-placeholder-dark rounded-lg flex items-center justify-center">
              <Icons.cpu className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold">Node Network</h3>
            <p className="text-muted-foreground">
              Decentralized network of GPU compute nodes powering distributed AI inference.
            </p>
            <Button variant="outline" asChild>
              <Link href="/network">Learn More</Link>
            </Button>
          </div>

          {/* Token */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="aspect-square w-full bg-placeholder-light dark:bg-placeholder-dark rounded-lg flex items-center justify-center">
              <Icons.token className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold">$EVOLVE Token</h3>
            <p className="text-muted-foreground">
              Utility token for governance, staking, and accessing premium network features.
            </p>
            <Button variant="outline" asChild>
              <Link href="/token">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Agent Platform Features */}
      <section id="network" className="space-y-12 mb-96">
        <div className="flex items-center gap-2 justify-center">
          <h2 className="text-6xl font-bold">Agent Platform</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {/* Agents Flow */}
          <div className="space-y-6">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-lg flex items-center justify-center">
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Agents Flow</h3>
            </div>
            <ul className="space-y-4">
              {["Natural language agent design", "No-code agent editor", 
                "Pre-made agent templates", "CrewAI framework integration"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Icons.check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Hub */}
          <div className="space-y-6">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-lg flex items-center justify-center">
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Data Hub</h3>
            </div>
            <ul className="space-y-4">
              {["Personal knowledge vault", "AI agent memory management", 
                "Secure and private e2e encryption", "IPFS integration"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Icons.check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compute Network */}
          <div className="space-y-6">
            <div className="aspect-square bg-placeholder-light dark:bg-placeholder-dark rounded-lg flex items-center justify-center">
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Compute Network</h3>
            </div>
            <ul className="space-y-4">
              {["Distributed GPU access", "Model swarms support", 
                "Petals node integration", "Real-time resource monitoring"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Icons.check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Token Utility Section */}
      <section className="relative space-y-12 mb-96">
        <div className="flex items-center gap-2 justify-center">
          <h2 className="text-6xl font-bold">Token Utility</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side - Image */}
          <div className="md:col-span-2 relative aspect-video bg-placeholder-light dark:bg-placeholder-dark rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.token className="w-32 h-32 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-12 py-8">
            {/* Validation & Incentives */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Validation & Incentives</h3>
              <ul className="space-y-4">
                {[
                  "Peer work validation",
                  "Quality assessment system",
                  "Performance-based rewards",
                  "Community governance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Icons.check className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Infrastructure */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Technical Infrastructure</h3>
              <ul className="space-y-4">
                {[
                  "DHT-based transactions",
                  "ERC token standard",
                  "Wallet-based identity",
                  "DAO governance structure"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <Icons.check className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="token" className="space-y-12 mb-96">
        <div className="flex items-center gap-2 justify-center">
          <h2 className="text-6xl font-bold">Roadmap</h2>
        </div>
        <div className="relative w-full py-20">
          {/* Main horizontal line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
          
          {/* Timeline events */}
          <div className="relative max-w-6xl mx-auto grid grid-cols-8 gap-4 z-10">
            {/* Research */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">Research</span>
                <span className="text-sm text-muted-foreground block">March, 2023</span>
              </div>
            </div>

            {/* Webapp Launched */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">Webapp Launched</span>
                <span className="text-sm text-muted-foreground block">August 2024</span>
              </div>
            </div>

            {/* Private Sale */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">Private Sale</span>
                <span className="text-sm text-muted-foreground block">November 2024</span>
                <span className="text-sm text-muted-foreground block">$200K</span>
                <span className="text-sm text-muted-foreground block">(650M $EVOLVE)</span>
              </div>
            </div>

            {/* New Landing Page */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">New Landing Page</span>
                <span className="text-sm text-muted-foreground block">15 December 2024</span>
              </div>
            </div>

            {/* TGE */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">TGE</span>
                <span className="text-sm text-muted-foreground block">25 December 2024</span>
              </div>
            </div>

            {/* Private Sale */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">Private Sale</span>
                <span className="text-sm text-muted-foreground block">10 Jan 2025</span>
              </div>
            </div>

            {/* Public Sale (DEX) */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">Public Sale (DEX)</span>
                <span className="text-sm text-muted-foreground block">15 Jan 2025</span>
              </div>
            </div>

            {/* Smart contracts */}
            <div className="flex flex-col items-center relative">
              <div className="w-4 h-4 rounded-full bg-primary mb-4 relative z-10" />
              <div className="absolute w-0.5 h-8 bg-zinc-200 dark:bg-zinc-800 top-8 left-1/2 -translate-x-1/2" />
              <div className="text-center mt-8">
                <span className="font-semibold block">Smart contracts for airdrops and staking</span>
                <span className="text-sm text-muted-foreground block">20 Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
