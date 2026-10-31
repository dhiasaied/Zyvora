import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import Lighting from './Lighting'
import Backdrop from './Backdrop'
import LadybugRig from './LadybugRig'
import CameraRig from './CameraRig'

/** Fixed full-screen WebGL layer that sits behind the scrolling page. */
export default function Experience({ isMobile, onReady }) {
  const maxDpr = isMobile ? 1.5 : 2
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio, maxDpr))

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        shadows
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.6, isMobile ? 9.6 : 7], fov: isMobile ? 40 : 35, near: 0.1, far: 80 }}
        onCreated={() => onReady?.()}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, maxDpr))}
          onFallback={() => setDpr(1)}
        />
        <Suspense fallback={null}>
          <Lighting isMobile={isMobile} />
          <Backdrop isMobile={isMobile} />
          <LadybugRig isMobile={isMobile} />
        </Suspense>
        <CameraRig isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
