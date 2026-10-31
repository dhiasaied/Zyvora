import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

const SPOTS = [
  { pos: [0.55, 0.95, -0.25], label: 'Elytra shell', detail: 'Carbon-ceramic · 0.4 mm' },
  { pos: [1.45, 0.7, 0.05], label: 'Membrane wing', detail: 'Origami fold · 2.3× span' },
  { pos: [-0.22, 0.32, 1.68], label: 'Optic array', detail: '4K stereo · 210° FOV' },
  { pos: [-1.0, -0.58, 0.5], label: 'Grip legs', detail: 'Micro-setae · any surface' },
]

/** Annotated anatomy markers, faded in only around the Anatomy section. */
export default function Hotspots({ rig }) {
  const els = useRef([])

  useFrame(() => {
    const v = rig.current.hotspots
    els.current.forEach((el, i) => {
      if (!el) return
      const vis = Math.min(1, Math.max(0, v * 1.5 - i * 0.12))
      el.style.opacity = vis
      el.style.visibility = vis < 0.02 ? 'hidden' : 'visible'
      el.classList.toggle('is-live', vis > 0.6)
    })
  })

  return SPOTS.map((s, i) => (
    <Html key={s.label} position={s.pos} center zIndexRange={[10, 0]}>
      <div className="hotspot" ref={(el) => (els.current[i] = el)} style={{ opacity: 0, visibility: 'hidden' }}>
        <span className="hotspot__dot" />
        <span className="hotspot__card">
          <b>{s.label}</b>
          <small>{s.detail}</small>
        </span>
      </div>
    </Html>
  ))
}
