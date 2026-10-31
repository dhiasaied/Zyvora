const TAU = Math.PI * 2

/**
 * One pose per [data-scene] section, in page order:
 * overview, anatomy, specs, pricing, launch (CTA), faq.
 */
export const DESKTOP = [
  { pos: [0, -0.35, 0], rot: [0.5, 0.75, 0], scale: 1.05, open: 0, wings: 0, flap: 0 },
  { pos: [1.7, -0.1, -0.6], rot: [0.85, -1.15, 0.05], scale: 0.85, open: 1, wings: 0.85, flap: 0 },
  { pos: [-1.7, 0.15, -0.6], rot: [0.8, 0.85, -0.15], scale: 0.85, open: 1, wings: 1, flap: 1 },
  { pos: [3.3, 1.9, -4.5], rot: [1.0, -0.5, 0.15], scale: 0.75, open: 1, wings: 1, flap: 1 },
  { pos: [0, -0.15, 0.6], rot: [0.45, TAU - 0.6, 0], scale: 1.15, open: 0.5, wings: 0.25, flap: 0 },
  { pos: [2.0, -0.45, -0.5], rot: [0.4, TAU - 0.9, 0], scale: 0.95, open: 0, wings: 0, flap: 0 },
]

export const MOBILE = [
  { pos: [0, -0.15, 0], rot: [0.55, 0.75, 0], scale: 0.85, open: 0, wings: 0, flap: 0 },
  { pos: [0, 1.6, 0], rot: [0.85, -1.15, 0.05], scale: 0.62, open: 1, wings: 0.85, flap: 0 },
  { pos: [0, 1.7, 0], rot: [0.8, 0.85, -0.15], scale: 0.6, open: 1, wings: 1, flap: 1 },
  { pos: [0, 2.8, -4], rot: [1.1, 0, 0], scale: 0.7, open: 1, wings: 1, flap: 1 },
  { pos: [0, 0.1, 0], rot: [0.45, TAU - 0.6, 0], scale: 0.9, open: 0.5, wings: 0.25, flap: 0 },
  { pos: [0, 2.3, -1], rot: [0.4, TAU - 0.9, 0], scale: 0.7, open: 0, wings: 0, flap: 0 },
]

/** Smoothstep-blend the two poses around continuous section index `t` into `out`. */
export function sampleKeyframes(frames, t, out) {
  const max = frames.length - 1
  const tc = Math.min(Math.max(t, 0), max)
  const i = Math.min(Math.floor(tc), max - 1)
  let f = tc - i
  f = f * f * (3 - 2 * f)
  const a = frames[i]
  const b = frames[i + 1]
  const mix = (x, y) => x + (y - x) * f
  for (let k = 0; k < 3; k++) {
    out.pos[k] = mix(a.pos[k], b.pos[k])
    out.rot[k] = mix(a.rot[k], b.rot[k])
  }
  out.scale = mix(a.scale, b.scale)
  out.open = mix(a.open, b.open)
  out.wings = mix(a.wings, b.wings)
  out.flap = mix(a.flap, b.flap)
  return out
}
