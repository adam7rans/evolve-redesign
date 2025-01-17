import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector2 } from 'three'
import { ChromaticMaterial } from './ChromaticMaterial'

export function ChromaticMaterialWrapper(props: any) {
  const materialRef = useRef<any>()
  const { size } = useThree()

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.winResolution = new Vector2(size.width, size.height)
    }
  }, [size])

  return <chromaticMaterial ref={materialRef} {...props} />
}
