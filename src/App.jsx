import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Experience from './components/three/Experience'
import Navbar from './components/ui/Navbar'
import ScrollHud from './components/ui/ScrollHud'
import ColorPicker from './components/ui/ColorPicker'
import Loader from './components/ui/Loader'
import Hero from './components/sections/Hero'
import Anatomy from './components/sections/Anatomy'
import Specs from './components/sections/Specs'
import Pricing from './components/sections/Pricing'
import Launch from './components/sections/Launch'
import FAQ from './components/sections/FAQ'
import Footer from './components/sections/Footer'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useThemeVars } from './hooks/useThemeVars'
import { initSmoothScroll } from './lib/smoothScroll'
import { trackSections } from './lib/scrollState'

function useScrollReveals(enabled) {
  useEffect(() => {
    if (!enabled) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 50,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const to = Number(el.dataset.count)
        const o = { v: 0 }
        el.textContent = '0'
        gsap.to(o, {
          v: to,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => (el.textContent = Math.round(o.v)),
        })
      })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [enabled])
}

export default function App() {
  const isMobile = useMediaQuery('(max-width: 900px)')
  const [sceneReady, setSceneReady] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  useThemeVars()
  useEffect(() => initSmoothScroll(), [])
  useEffect(() => trackSections(), [])
  useScrollReveals(introDone)

  return (
    <>
      <Experience isMobile={isMobile} onReady={() => setSceneReady(true)} />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <ScrollHud />
      <main>
        <Hero play={introDone} />
        <Anatomy />
        <Specs />
        <Pricing />
        <Launch />
        <FAQ />
      </main>
      <Footer />
      <ColorPicker />
      <Loader ready={sceneReady} onDone={() => setIntroDone(true)} />
    </>
  )
}
