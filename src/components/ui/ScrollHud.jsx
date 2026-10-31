import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { scrollState } from '../../lib/scrollState'
import { useActiveSection } from '../../hooks/useActiveSection'

const NAMES = ['Overview', 'Anatomy', 'Specs', 'Pricing', 'Launch', 'FAQ']

/** Top progress bar + side section counter, driven without React re-renders per frame. */
export default function ScrollHud() {
  const bar = useRef(null)
  const rail = useRef(null)
  const active = useActiveSection()

  useEffect(() => {
    const tick = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${scrollState.progress})`
      if (rail.current) rail.current.style.transform = `scaleY(${scrollState.progress})`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={bar} />
      </div>
      <aside className="hud" aria-hidden="true">
        <span className="hud__num">{String(active + 1).padStart(2, '0')}</span>
        <span className="hud__rail">
          <span ref={rail} />
        </span>
        <span className="hud__num hud__num--dim">{String(NAMES.length).padStart(2, '0')}</span>
        <span className="hud__name">{NAMES[active]}</span>
      </aside>
    </>
  )
}
