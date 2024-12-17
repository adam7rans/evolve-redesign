'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type NoiseContextType = {
  noiseEnabled: boolean
  toggleNoise: () => void
}

const NoiseContext = createContext<NoiseContextType | undefined>(undefined)

export function NoiseProvider({ children }: { children: React.ReactNode }) {
  const [noiseEnabled, setNoiseEnabled] = useState(true)

  useEffect(() => {
    // Get initial state from localStorage
    const stored = localStorage.getItem('noiseEnabled')
    if (stored !== null) {
      setNoiseEnabled(stored !== 'false')
    }
  }, [])

  const toggleNoise = () => {
    setNoiseEnabled(prev => {
      const newState = !prev
      localStorage.setItem('noiseEnabled', String(newState))
      return newState
    })
  }

  return (
    <NoiseContext.Provider value={{ noiseEnabled, toggleNoise }}>
      {children}
    </NoiseContext.Provider>
  )
}

export function useNoise() {
  const context = useContext(NoiseContext)
  if (context === undefined) {
    throw new Error('useNoise must be used within a NoiseProvider')
  }
  return context
}
