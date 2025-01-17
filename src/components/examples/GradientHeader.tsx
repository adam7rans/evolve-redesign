'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '../shared/Logo'

export function GradientHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo showText={false} />
            <Link href="/experiments" className="text-white text-sm hover:opacity-80 transition-opacity">
              ← Back to Experiments
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
