import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../store/theme'

const defaultPick = (obj) => obj.color

/**
 * Smoothly eases a THREE.Color on each referenced object towards a palette color.
 * `pick` selects which color on the object to drive (color, emissive, material.color...).
 */
export function useColorTween(key, refs, pick = defaultPick, speed = 4) {
  const target = useMemo(() => new THREE.Color(), [])
  useFrame((_, dt) => {
    target.set(useTheme.getState()[key])
    const a = 1 - Math.exp(-Math.min(dt, 0.1) * speed)
    for (const ref of refs) {
      const color = ref.current && pick(ref.current)
      if (color) color.lerp(target, a)
    }
  })
}

/** Read a palette color once (for initial material values, avoids a flash). */
export const initialColor = (key) => useTheme.getState()[key]
