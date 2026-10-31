import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowIcon } from '../ui/Icons'
import { scrollToTarget } from '../../lib/smoothScroll'

const Line = ({ children }) => (
  <span className="line">
    <span className="line-inner">{children}</span>
  </span>
)

export default function Hero({ play }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.line-inner', { yPercent: 115 })
      gsap.set('[data-fade]', { autoAlpha: 0, y: 24 })
      const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero__left', { xPercent: -16, autoAlpha: 0, ease: 'none', scrollTrigger: scrub })
      gsap.to('.hero__right', { xPercent: 16, autoAlpha: 0, ease: 'none', scrollTrigger: { ...scrub } })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!play) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, delay: 0.35 })
        .to('.line-inner', { yPercent: 0, duration: 1.5, stagger: 0.09 })
        .to('[data-fade]', { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, '-=1.1')
    }, root)
    return () => ctx.revert()
  }, [play])

  return (
    <section id="overview" className="section hero" data-scene ref={root}>
      <div className="hero__left">
        <p className="eyebrow" data-fade>
          <span className="pulse" /> Bio-inspired micro-drone · Series 01
        </p>
        <h1 className="display" aria-label="Hard shell, soft flight">
          <Line>Hard</Line>
          <Line>
            Shell<em className="slash">/</em>
          </Line>
        </h1>
        <p className="hero__lede" data-fade>
          Zyvora folds a 2.3× wingspan under a carbon-ceramic shell no bigger than your palm. Seal it. Toss it. Watch it open.
        </p>
        <div className="hero__actions" data-fade>
          <button className="btn btn--light" onClick={() => scrollToTarget('#pricing')}>
            Arm up
          </button>
          <button className="btn-round" aria-label="Explore the anatomy" onClick={() => scrollToTarget('#anatomy')}>
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className="hero__right">
        <div className="stat-card" data-fade>
          <span className="stat-card__ring" />
          <div>
            <strong>14K+</strong>
            <span>Shells in the field</span>
          </div>
        </div>
        <p className="display display--right" aria-hidden="true">
          <Line>
            <em className="slash">/</em>Soft
          </Line>
          <Line>Flight</Line>
        </p>
      </div>

      <div className="hero__foot" data-fade>
        <span className="mono">
          <span className="hide-sm">Drag to rotate · Click</span>
          <span className="show-sm">Tap</span> to deploy
        </span>
        <span className="scroll-cue" aria-hidden="true">
          <i />
        </span>
        <span className="mono hide-sm">N 36.80° · E 10.18°</span>
      </div>
    </section>
  )
}
