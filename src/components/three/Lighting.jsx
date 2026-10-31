import { useMemo, useRef } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { useColorTween, initialColor } from '../../hooks/useColorTween'

/**
 * Studio lighting: a baked lightformer environment for crisp clearcoat
 * reflections, a warm key with soft shadows, and palette-tinted rim/under lights.
 */
export default function Lighting({ isMobile }) {
  const rim = useRef()
  const under = useRef()
  const accent = useMemo(() => initialColor('accent'), [])
  const shell = useMemo(() => initialColor('shell'), [])
  useColorTween('accent', [rim])
  useColorTween('shell', [under])

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.4}
        color="#fff4e6"
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-6, 2, -2]} intensity={0.6} color="#9db8ff" />
      <pointLight ref={rim} position={[-3.5, 1.8, -3]} intensity={40} distance={14} color={accent} />
      <pointLight ref={under} position={[2.5, -1.2, 2.5]} intensity={8} distance={8} color={shell} />

      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[6, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[10, 1.2, 1]} />
        <Lightformer form="ring" intensity={2.5} position={[2, 3, 6]} scale={3} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
    </>
  )
}
