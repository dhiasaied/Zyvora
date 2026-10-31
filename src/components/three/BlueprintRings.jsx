import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { useColorTween, initialColor } from '../../hooks/useColorTween'

const circle = (r, n = 160) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [Math.cos(a) * r, Math.sin(a) * r, 0]
  })

const RINGS = [
  { r: 2.05, rot: [1.35, 0, 0], dashed: false, speed: 0.1, opacity: 0.45 },
  { r: 2.6, rot: [1.2, 0.35, 0], dashed: true, speed: -0.06, opacity: 0.3 },
  { r: 3.3, rot: [1.65, -0.25, 0.2], dashed: true, speed: 0.04, opacity: 0.18 },
]

function tickGeometry(radius, count) {
  const pts = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const len = i % 6 === 0 ? 0.16 : 0.07
    const c = Math.cos(a)
    const s = Math.sin(a)
    pts.push(c * radius, s * radius, 0, c * (radius + len), s * (radius + len), 0)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

/** Animated blueprint orbit rings that follow the model around the page. */
export default function BlueprintRings({ isMobile }) {
  const spinners = useRef([])
  const lineRefs = useMemo(() => RINGS.map(() => ({ current: null })), [])
  const extraRefs = useMemo(() => [{ current: null }, { current: null }, { current: null }], [])
  const ticks = useMemo(() => tickGeometry(2.05, 96), [])
  const accent = useMemo(() => initialColor('accent'), [])

  useColorTween('accent', lineRefs, (o) => o.material.color)
  useColorTween('accent', extraRefs, (o) => o.material.color)

  useFrame((_, dt) => {
    spinners.current.forEach((g, i) => {
      if (g) g.rotation.z += dt * RINGS[i].speed
    })
  })

  return (
    <group>
      {RINGS.map((ring, i) => (
        <group key={i} rotation={ring.rot}>
          <group ref={(el) => (spinners.current[i] = el)}>
            <Line
              ref={lineRefs[i]}
              points={circle(ring.r)}
              color={accent}
              lineWidth={isMobile ? 1 : 1.2}
              dashed={ring.dashed}
              dashSize={0.14}
              gapSize={0.1}
              transparent
              opacity={ring.opacity}
              depthWrite={false}
            />
            {i === 0 && (
              <>
                <lineSegments ref={extraRefs[0]} geometry={ticks}>
                  <lineBasicMaterial color={accent} transparent opacity={0.3} depthWrite={false} />
                </lineSegments>
                <mesh ref={extraRefs[1]} position={[ring.r, 0, 0]}>
                  <sphereGeometry args={[0.045, 16, 16]} />
                  <meshBasicMaterial color={accent} toneMapped={false} />
                </mesh>
              </>
            )}
            {i === 1 && (
              <mesh ref={extraRefs[2]} position={[0, -ring.r, 0]}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshBasicMaterial color={accent} toneMapped={false} />
              </mesh>
            )}
          </group>
        </group>
      ))}
    </group>
  )
}
