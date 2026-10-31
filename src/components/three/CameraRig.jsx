import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../../lib/pointer'
import { scrollState } from '../../lib/scrollState'

const { damp } = THREE.MathUtils

/** Eased camera with pointer parallax and a gentle scroll-driven dolly. */
export default function CameraRig({ isMobile }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const aspect = size.width / size.height
    const fov = isMobile ? 40 : 35
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    // Pull back on narrower windows so the side-placed model never crowds the copy.
    const baseZ = isMobile ? 9.6 : 7 * Math.pow(Math.max(1, 1.7 / aspect), 0.85)
    const dolly = Math.sin(Math.min(scrollState.t, 5) * Math.PI * 0.5) * 0.35

    camera.position.x = damp(camera.position.x, pointer.x * 0.35, 2, dt)
    camera.position.y = damp(camera.position.y, 0.55 + pointer.y * 0.22, 2, dt)
    camera.position.z = damp(camera.position.z, baseZ - dolly, 2, dt)
    camera.lookAt(0, 0, 0)
  })

  return null
}
