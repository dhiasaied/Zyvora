import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useColorTween, initialColor } from '../../hooks/useColorTween'

const { lerp } = THREE.MathUtils

// Model space: head points +Z, up is +Y, ~2.6 units long.
// Each elytron is a half-dome hinged at the front of the dorsal seam.
const SHELL_ORIGIN = new THREE.Vector3(0, 0.15, -0.1)
const SHELL_SCALE = [0.95, 0.72, 1.2]
const HINGE = new THREE.Vector3(0.05, 0.5, 0.92)
const SHELL_OFFSET = SHELL_ORIGIN.clone().sub(HINGE).toArray()
const WING_ROOT = [0.18, 0.42, 0.5]
const ANTENNA_BASE = new THREE.Vector3(0.1, 0.3, 1.6)

// Spots in unit-dome space (direction + radius), mapped onto the ellipsoid by the shell scale.
const SPOTS = [
  [0.42, 0.84, 0.34, 0.17],
  [0.82, 0.42, 0.06, 0.15],
  [0.44, 0.72, -0.54, 0.16],
  [0.72, 0.3, 0.62, 0.11],
  [0.72, 0.32, -0.62, 0.12],
  [0.16, 0.92, -0.36, 0.09],
].map(([x, y, z, r]) => {
  const dir = new THREE.Vector3(x, y, z).normalize()
  return {
    position: dir.toArray(),
    quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir),
    r,
  }
})

const LEGS = [
  { z: 0.5, splay: -0.65, phase: 0 },
  { z: 0.02, splay: -0.05, phase: 2.1 },
  { z: -0.42, splay: 0.6, phase: 4.2 },
]

function wingShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.7, -0.14, 1.65, -0.1, 2.3, 0.14)
  s.bezierCurveTo(2.48, 0.46, 2.05, 0.86, 1.35, 0.86)
  s.bezierCurveTo(0.75, 0.86, 0.28, 0.6, 0, 0.18)
  s.closePath()
  return s
}

function buildGeometries(seg) {
  const along = (geo, len) => {
    geo.rotateZ(-Math.PI / 2)
    geo.translate(len / 2, 0, 0)
    return geo
  }
  const shape = wingShape()
  const veinPairs = [
    [0.02, 0.02, 2.25, 0.17],
    [0.04, 0.08, 1.85, 0.64],
    [0.04, 0.12, 1.2, 0.84],
    [0.04, 0.16, 0.6, 0.72],
    [0.7, 0.05, 1.55, 0.5],
  ]
  const veins = new THREE.BufferGeometry()
  veins.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(veinPairs.flatMap(([a, b, c, d]) => [a, b, 0.002, c, d, 0.002]), 3),
  )
  const antennaCurve = new THREE.CatmullRomCurve3(
    [new THREE.Vector3(0.1, 0.3, 1.6), new THREE.Vector3(0.24, 0.5, 1.85), new THREE.Vector3(0.42, 0.62, 2.12)].map((v) =>
      v.sub(ANTENNA_BASE),
    ),
  )

  return {
    shell: new THREE.SphereGeometry(1, seg, Math.round(seg / 2), Math.PI / 2, Math.PI, 0, Math.PI / 2),
    seam: new THREE.TorusGeometry(1, 0.012, 6, seg, Math.PI),
    sphere: new THREE.SphereGeometry(1, Math.round(seg / 1.5), Math.round(seg / 3)),
    spot: new THREE.SphereGeometry(1, 24, 12),
    femur: along(new THREE.CylinderGeometry(0.05, 0.038, 0.5, 10), 0.5),
    tibia: along(new THREE.CylinderGeometry(0.036, 0.022, 0.5, 10), 0.5),
    joint: new THREE.SphereGeometry(0.052, 12, 8),
    wing: new THREE.ShapeGeometry(shape, 32),
    wingEdge: new THREE.BufferGeometry().setFromPoints(shape.getPoints(48)),
    veins,
    antenna: new THREE.TubeGeometry(antennaCurve, 24, 0.014, 6),
    belt: new THREE.TorusGeometry(0.62, 0.012, 8, 96),
  }
}

function buildMaterials() {
  const accent = initialColor('accent')
  return {
    shell: new THREE.MeshPhysicalMaterial({
      color: initialColor('shell'),
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
    inner: new THREE.MeshStandardMaterial({ color: '#1a0c0a', roughness: 0.65, side: THREE.BackSide }),
    black: new THREE.MeshPhysicalMaterial({
      color: '#0a0a0d',
      roughness: 0.3,
      metalness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    }),
    white: new THREE.MeshPhysicalMaterial({ color: '#f3efe6', roughness: 0.35, clearcoat: 0.6 }),
    eye: new THREE.MeshPhysicalMaterial({
      color: '#050505',
      emissive: accent,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      clearcoat: 1,
    }),
    wing: new THREE.MeshPhysicalMaterial({
      color: '#dbe8ff',
      transparent: true,
      opacity: 0.42,
      roughness: 0.15,
      metalness: 0.1,
      iridescence: 1,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [200, 600],
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    vein: new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.6 }),
    belt: new THREE.MeshStandardMaterial({ color: '#000000', emissive: accent, emissiveIntensity: 2.5 }),
  }
}

function Leg({ leg, side, rig, geos, mats }) {
  const root = useRef()
  const femur = useRef()
  const knee = useRef()

  useFrame(({ clock }) => {
    const tuck = rig.current.wings
    const step = Math.sin(clock.elapsedTime * 2.6 + leg.phase + (side < 0 ? Math.PI : 0)) * 0.07 * (1 - tuck)
    root.current.rotation.y = leg.splay + step
    femur.current.rotation.z = lerp(-0.12, 0.3, tuck) + Math.max(0, step) * 0.9
    knee.current.rotation.z = lerp(-1.1, -2.35, tuck)
  })

  return (
    <group ref={root} position={[0.3, -0.04, leg.z]}>
      <group ref={femur}>
        <mesh geometry={geos.joint} material={mats.black} />
        <mesh geometry={geos.femur} material={mats.black} castShadow />
        <group ref={knee} position={[0.5, 0, 0]}>
          <mesh geometry={geos.joint} material={mats.black} scale={0.8} />
          <mesh geometry={geos.tibia} material={mats.black} castShadow />
          <mesh geometry={geos.joint} material={mats.black} position={[0.5, 0, 0]} scale={0.6} />
        </group>
      </group>
    </group>
  )
}

/** One mirrored half of the insect: elytron, hind wing, antenna, eye and three legs. */
function Side({ side, rig, geos, mats }) {
  const elytron = useRef()
  const wing = useRef()
  const antenna = useRef()

  useFrame(({ clock }) => {
    const { open, wings, flap } = rig.current
    const t = clock.elapsedTime

    elytron.current.rotation.set(0.38 * open, -0.28 * open, 0.72 * open)

    const w = wing.current
    w.visible = wings > 0.02
    const beat = Math.sin(t * 42) * 0.6 * flap
    w.rotation.set(0, lerp(Math.PI / 2 - 0.06, 0.2, wings), 0.16 * wings + beat)
    w.scale.set(lerp(0.4, 1, wings), 1, lerp(0.5, 1, wings))

    antenna.current.rotation.x = Math.sin(t * 1.7 + side) * 0.08
    antenna.current.rotation.y = Math.sin(t * 1.1 + side * 2) * 0.06
  })

  return (
    <group scale={[side, 1, 1]}>
      <group ref={elytron} position={HINGE}>
        <group position={SHELL_OFFSET} scale={SHELL_SCALE}>
          <mesh geometry={geos.shell} material={mats.shell} castShadow />
          <mesh geometry={geos.shell} material={mats.inner} />
          <mesh geometry={geos.seam} material={mats.black} rotation-y={Math.PI / 2} />
          {SPOTS.map((s, i) => (
            <mesh
              key={i}
              geometry={geos.spot}
              material={mats.black}
              position={s.position}
              quaternion={s.quaternion}
              scale={[s.r * 0.92, s.r * 0.92, 0.016]}
            />
          ))}
        </group>
      </group>

      <group ref={wing} position={WING_ROOT}>
        <group rotation-x={-Math.PI / 2}>
          <mesh geometry={geos.wing} material={mats.wing} renderOrder={2} />
          <lineLoop geometry={geos.wingEdge} material={mats.vein} />
          <lineSegments geometry={geos.veins} material={mats.vein} />
        </group>
      </group>

      <group ref={antenna} position={ANTENNA_BASE}>
        <mesh geometry={geos.antenna} material={mats.black} />
        <mesh geometry={geos.joint} material={mats.black} position={[0.32, 0.32, 0.52]} scale={0.85} />
      </group>

      <mesh geometry={geos.sphere} material={mats.eye} position={[0.19, 0.27, 1.6]} scale={0.085} />
      <mesh geometry={geos.sphere} material={mats.white} position={[0.36, 0.36, 1.1]} scale={[0.16, 0.11, 0.15]} />

      {LEGS.map((leg, i) => (
        <Leg key={i} leg={leg} side={side} rig={rig} geos={geos} mats={mats} />
      ))}
    </group>
  )
}

/**
 * Procedural, fully rigged ladybug drone. `rig.current` drives the animation:
 * open (elytra 0..1), wings (unfold 0..1), flap (wingbeat 0..1).
 */
export default function Ladybug({ rig, isMobile }) {
  const seg = isMobile ? 40 : 72
  const geos = useMemo(() => buildGeometries(seg), [seg])
  const mats = useMemo(buildMaterials, [])

  useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos])
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats])

  const shellRefs = useMemo(() => [{ current: mats.shell }], [mats])
  const glowRefs = useMemo(() => [{ current: mats.eye }, { current: mats.belt }], [mats])
  const lineRefs = useMemo(() => [{ current: mats.vein }], [mats])
  useColorTween('shell', shellRefs)
  useColorTween('accent', glowRefs, (m) => m.emissive)
  useColorTween('accent', lineRefs)

  useFrame(({ clock }) => {
    const { flap, open } = rig.current
    mats.belt.emissiveIntensity = 1.2 + open * 1.5 + flap * (1.5 + Math.sin(clock.elapsedTime * 8) * 0.8)
  })

  return (
    <group>
      {/* thorax / abdomen underside */}
      <mesh geometry={geos.sphere} material={mats.black} position={[0, 0.12, -0.1]} scale={[0.86, 0.42, 1.12]} castShadow />
      {/* pronotum */}
      <mesh geometry={geos.sphere} material={mats.black} position={[0, 0.3, 1.0]} scale={[0.6, 0.34, 0.42]} castShadow />
      {/* head */}
      <mesh geometry={geos.sphere} material={mats.black} position={[0, 0.2, 1.42]} scale={[0.3, 0.25, 0.28]} />
      {/* drone halo */}
      <mesh geometry={geos.belt} material={mats.belt} position={[0, -0.18, -0.1]} rotation-x={Math.PI / 2} scale={[1.2, 1.6, 1]} />

      <Side side={1} rig={rig} geos={geos} mats={mats} />
      <Side side={-1} rig={rig} geos={geos} mats={mats} />
    </group>
  )
}
