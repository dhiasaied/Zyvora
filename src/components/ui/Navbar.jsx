import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Logo } from './Icons'
import { scrollToTarget, lockScroll } from '../../lib/smoothScroll'
import { useActiveSection } from '../../hooks/useActiveSection'

export const NAV_LINKS = [
  { id: 'overview', label: 'Overview', scene: 0 },
  { id: 'anatomy', label: 'Anatomy', scene: 1 },
  { id: 'specs', label: 'Specs', scene: 2 },
  { id: 'pricing', label: 'Pricing', scene: 3 },
  { id: 'faq', label: 'FAQ', scene: 5 },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const menu = useRef(null)

  useEffect(() => {
    const el = menu.current
    lockScroll(open)
    if (open) {
      gsap.set(el, { display: 'flex' })
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' })
      gsap.fromTo(el.querySelectorAll('a'), { yPercent: 120 }, { yPercent: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out', delay: 0.1 })
    } else if (el.style.display === 'flex') {
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'expo.in',
        onComplete: () => gsap.set(el, { display: 'none' }),
      })
    }
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(`#${id}`)
  }

  return (
    <>
      <header className="nav">
        <a href="#overview" className="nav__brand" onClick={(e) => go(e, 'overview')}>
          <Logo />
          <span>Zyvora</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.scene ? 'is-active' : ''} onClick={(e) => go(e, l.id)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__end">
          <a href="#launch" className="nav__cta" onClick={(e) => go(e, 'launch')}>
            Pre-order
          </a>
          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
          </button>
        </div>
      </header>

      <div className="menu" ref={menu} style={{ display: 'none' }}>
        {[...NAV_LINKS, { id: 'launch', label: 'Pre-order' }].map((l, i) => (
          <div className="menu__row" key={l.id}>
            <a href={`#${l.id}`} onClick={(e) => go(e, l.id)}>
              <span className="mono">0{i + 1}</span>
              {l.label}
            </a>
          </div>
        ))}
      </div>
    </>
  )
}
