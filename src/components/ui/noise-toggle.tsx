'use client'

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useNoise } from "@/contexts/NoiseContext"

export function NoiseToggle() {
  const { noiseEnabled, toggleNoise } = useNoise()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleNoise}
      title={noiseEnabled ? "Disable noise effect" : "Enable noise effect"}
    >
      {noiseEnabled ? (
        <Icons.waves className="h-4 w-4" />
      ) : (
        <Icons.wavesOff className="h-4 w-4" />
      )}
    </Button>
  )
}
