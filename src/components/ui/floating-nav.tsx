'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const navItems = [
  { name: 'Agents', href: '/agents' },
  { name: 'Network', href: '/network' },
  { name: 'Token', href: '/token' },
  { name: 'DAO', href: '/dao' },
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Docs', href: 'https://docs.evolvenetwork.ai/', external: true }
]

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 100
      setIsVisible(shouldShow)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn(
      'fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
    )}>
      <nav className="bg-zinc-100 dark:bg-zinc-900 shadow-lg backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 flex gap-2">
        {navItems.map((item) => (
          item.external ? (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {item.name}
            </a>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {item.name}
            </Link>
          )
        ))}
      </nav>
    </div>
  )
}
