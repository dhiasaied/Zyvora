import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import Ladybug from './Ladybug'
import Hotspots from './Hotspots'
import BlueprintRings from './BlueprintRings'
import { DESKTOP, MOBILE, sampleKeyframes } from './keyframes'
import { scrollState } from '../../lib/scrollState'
import { pointer } from '../../lib/pointer'

const { damp, clamp } = THREE.MathUtils
const BOOST_SECONDS = 3.2

/**
 * Positions the ladybug for the current scroll position and layers the
 * interactions on top: pointer parallax, drag-to-rotate and click-to-deploy.
 */
export default function LadybugRig({ isMobile }) {
  const mover = useRef()
  const turner = useRef()
  const rig = useRef({ open: 0, wings: 0, flap: 0, hotspots: 0 })
  const drag = useRef({ active: false, moved: 0, lastX: 0, lastY: 0, yaw: 0, pitch: 0 })
  const boost = useRef(0)
  const pose = useMemo(() => ({ pos: [0, 0, 0], rot: [0, 0, 0], scale: 1, open: 0, wings: 0, flap: 0 }), [])
  const [hovered, setHovered] = useState(false)
  useCursor(hovered, 'grab')

  useEffect(() => {
    if (import.meta.env.DEV) window.__rig = rig.current
    const move = (e) => {
      const d = drag.current
      if (!d.active) return
      const dx = e.clientX - d.lastX
      const dy = e.clientY - d.lastY
      d.lastX = e.clientX
      d.lastY = e.clientY
      d.moved += Math.abs(dx) + Math.abs(dy)
      d.yaw += dx * 0.01
      d.pitch = clamp(d.pitch + dy * 0.006, -0.6, 0.6)
    }
    const up = () => {
      const d = drag.current
      if (!d.active) return
      d.active = false
      if (d.moved < 6) boost.current = BOOST_SECONDS
      document.body.classList.remove('is-dragging')
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  const onPointerDown = (e) => {
    e.stopPropagation()
    Object.assign(drag.current, { active: true, moved: 0, lastX: e.clientX, lastY: e.clientY })
    document.body.classList.add('is-dragging')
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const k = sampleKeyframes(isMobile ? MOBILE : DESKTOP, scrollState.t, pose)
    const time = state.clock.elapsedTime
    const d = drag.current
    const r = rig.current

    boost.current = Math.max(0, boost.current - dt)
    const b = boost.current > 0 ? 1 : 0
    if (!d.active) {
      d.yaw = damp(d.yaw, 0, 0.8, dt)
      d.pitch = damp(d.pitch, 0, 1.5, dt)
    }

    // Choreography: elytra open first, wings unfold once the shell clears, flap once fully spread.
    const wantWings = Math.max(k.wings, b)
    r.open = damp(r.open, Math.max(k.open, b, clamp(r.wings * 1.6, 0, 1)), 5, dt)
    r.wings = damp(r.wings, wantWings * clamp((r.open - 0.45) / 0.55, 0, 1), 4, dt)
    r.flap = damp(r.flap, Math.max(k.flap, b) * (r.wings > 0.85 ? 1 : 0), 4, dt)
    r.hotspots = clamp(1 - Math.abs(scrollState.t - 1) * 2.4, 0, 1)

    const g = mover.current
    const hover = Math.sin(time * 1.3) * 0.04 + r.flap * (0.12 + Math.sin(time * 2.2) * 0.07) + b * 0.25
    g.position.x = damp(g.position.x, k.pos[0], 3, dt)
    g.position.y = damp(g.position.y, k.pos[1] + hover, 3, dt)
    g.position.z = damp(g.position.z, k.pos[2], 3, dt)
    g.scale.setScalar(damp(g.scale.x, k.scale, 3, dt))

    const tr = turner.current
    tr.rotation.x = damp(tr.rotation.x, k.rot[0] - pointer.y * 0.15 + d.pitch, 3.5, dt)
    tr.rotation.y = damp(tr.rotation.y, k.rot[1] + pointer.x * 0.3 + d.yaw, 3.5, dt)
    tr.rotation.z = damp(tr.rotation.z, k.rot[2] + Math.sin(time * 0.9) * 0.04 * r.flap, 3.5, dt)
  })

  return (
    <group ref={mover}>
      <BlueprintRings isMobile={isMobile} />
      <group ref={turner}>
        <group
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
          onPointerDown={onPointerDown}
        >
          <Ladybug rig={rig} isMobile={isMobile} />
        </group>
        <Hotspots rig={rig} />
      </group>
    </group>
  )
}
