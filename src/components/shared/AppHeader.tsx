'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'
import { NoiseToggle } from '@/components/ui/noise-toggle'

export function AppHeader() {
  return (
    <header className="w-full bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-foreground">
            <Image
              src="/Evolve Network Logo.svg"
              alt="Evolve Network Logo"
              width={60}
              height={60}
              className="h-15 w-15"
              style={{ color: 'inherit' }}
            />
            <span className="font-bold text-lg">Evolve Network</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link href="/agents" className="text-sm font-medium transition-colors hover:text-primary">
              Agents
            </Link>
            <Link href="/network" className="text-sm font-medium transition-colors hover:text-primary">
              Network
            </Link>
            <Link href="/token" className="text-sm font-medium transition-colors hover:text-primary">
              Token
            </Link>
            <Link href="/dao" className="text-sm font-medium transition-colors hover:text-primary">
              DAO
            </Link>
            <Link href="/roadmap" className="text-sm font-medium transition-colors hover:text-primary">
              Roadmap
            </Link>
            <a href="https://docs.evolvenetwork.ai/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors hover:text-primary">
              Docs
            </a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <NoiseToggle />
            <ThemeToggle />
            <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
