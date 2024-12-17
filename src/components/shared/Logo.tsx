'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  showText?: boolean
  className?: string
}

export function Logo({ showText = true, className = '' }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Link href="/" className={`flex items-center space-x-2 overflow-visible ${className}`}>
        <div className="overflow-visible w-[60px] h-[60px] text-[#171717]">
          <img
            src="/evolve-logo.svg"
            alt="Evolve Network Logo"
            className="w-full h-full overflow-visible"
          />
        </div>
        {showText && <span className="font-bold text-lg">Evolve Network</span>}
      </Link>
    )
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 overflow-visible ${className}`}>
      <div className={`overflow-visible w-[60px] h-[60px]`}>
        <img
          src="/evolve-logo.svg"
          alt="Evolve Network Logo"
          className={`w-full h-full overflow-visible ${resolvedTheme === 'dark' ? 'invert' : ''}`}
        />
      </div>
      {showText && <span className="font-bold text-lg">Evolve Network</span>}
    </Link>
  )
}
