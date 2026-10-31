import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { lockScroll } from '../../lib/smoothScroll'

const FALLBACK_MS = 6000

/** Intro curtain: holds until the WebGL context is live, then wipes away. */
export default function Loader({ ready, onDone }) {
  const root = useRef(null)
  const bar = useRef(null)
  const count = useRef(null)
  const [gone, setGone] = useState(false)
  const [forced, setForced] = useState(false)
  const leaving = ready || forced

  const paint = (v) => {
    if (bar.current) bar.current.style.transform = `scaleX(${v})`
    if (count.current) count.current.textContent = String(Math.round(v * 100)).padStart(3, '0')
  }

  useEffect(() => {
    lockScroll(true)
    const prog = { v: 0 }
    const tween = gsap.to(prog, { v: 0.82, duration: 1.4, ease: 'power2.out', onUpdate: () => paint(prog.v) })
    const timer = setTimeout(() => setForced(true), FALLBACK_MS)
    return () => {
      tween.kill()
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!leaving || !root.current) return
    const prog = { v: 0.82 }
    const tl = gsap.timeline({ delay: 0.5 })
    tl.to(prog, { v: 1, duration: 0.5, ease: 'power2.inOut', onUpdate: () => paint(prog.v) })
      .to(root.current.querySelector('.loader__inner'), { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: 'power3.in' })
      .to(root.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.1,
        ease: 'expo.inOut',
        onStart: () => {
          lockScroll(false)
          onDone()
        },
      }, '-=0.2')
      .add(() => setGone(true))
    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  if (gone) return null

  return (
    <div className="loader" ref={root} role="status" aria-label="Loading experience">
      <div className="loader__inner">
        <span className="mono loader__tag">Sealing shell</span>
        <h2 className="loader__word">Zyvora</h2>
        <div className="loader__bar">
          <span ref={bar} />
        </div>
        <span className="mono loader__count" ref={count}>
          000
        </span>
      </div>
    </div>
  )
}
