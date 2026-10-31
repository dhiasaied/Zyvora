import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../../store/theme'
import { useColorTween, initialColor } from '../../hooks/useColorTween'
import { scrollState } from '../../lib/scrollState'

const FLOOR_Y = -1.6

function useDotSprite() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.25, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])
}

/** Drifting luminous dust with scroll parallax. */
function Dust({ count }) {
  const points = useRef()
  const mat = useRef()
  const sprite = useDotSprite()
  const accent = useMemo(() => initialColor('accent'), [])
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 24
      p[i * 3 + 1] = (Math.random() - 0.5) * 14
      p[i * 3 + 2] = -Math.random() * 16 + 3
    }
    return p
  }, [count])

  useColorTween('accent', [mat])

  useFrame((state, dt) => {
    const p = points.current
    p.rotation.y += dt * 0.012
    p.position.y = THREE.MathUtils.damp(p.position.y, scrollState.t * 0.8, 2, dt)
    mat.current.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={sprite}
        color={accent}
        size={0.07}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Backdrop({ isMobile }) {
  const accent = useTheme((s) => s.accent)

  return (
    <>
      <Dust count={isMobile ? 260 : 700} />
      <Grid
        position={[0, FLOOR_Y, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#ffffff"
        sectionSize={2.5}
        sectionThickness={1.1}
        sectionColor={accent}
        fadeDistance={isMobile ? 16 : 24}
        fadeStrength={1.6}
        infiniteGrid
        followCamera={false}
      />
      <ContactShadows
        position={[0, FLOOR_Y + 0.01, 0]}
        scale={16}
        blur={2.6}
        far={5}
        opacity={0.6}
        resolution={isMobile ? 256 : 512}
        color="#000000"
      />
    </>
  )
}
