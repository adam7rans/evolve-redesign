'use client'

import { useEffect, useState } from 'react'

interface RotatingTextProps {
  words: string[]
  interval?: number
  className?: string
}

export function RotatingText({ words, interval = 2000, className = '' }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval, words.length])

  return (
    <span className={`inline-block transition-opacity duration-500 leading-normal py-1 ${className}`}>
      {words[currentIndex]}
    </span>
  )
}
