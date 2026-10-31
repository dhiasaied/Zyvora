import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let locked = false

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })
  // The intro is choreographed from the top of the page.
  lenis.scrollTo(0, { immediate: true, force: true })
  if (locked) lenis.stop()
  if (import.meta.env.DEV) window.__lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

/** Freeze page scrolling (used while the intro loader is on screen). */
export function lockScroll(value) {
  locked = value
  document.documentElement.classList.toggle('is-locked', value)
  if (lenis) value ? lenis.stop() : lenis.start()
}
