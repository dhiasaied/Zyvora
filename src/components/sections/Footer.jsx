import { Logo } from '../ui/Icons'
import { NAV_LINKS } from '../ui/Navbar'
import { scrollToTarget } from '../../lib/smoothScroll'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Logo size={34} />
          <p>Hard shell. Soft flight. A concept micro-drone built from the anatomy of a ladybug.</p>
        </div>
        <nav className="footer__cols" aria-label="Footer">
          <div>
            <span className="mono">Explore</span>
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(`#${l.id}`)
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <span className="mono">Company</span>
            <a href="#overview">About</a>
            <a href="#overview">Press</a>
            <a href="#overview">Careers</a>
          </div>
        </nav>
      </div>
      <div className="footer__word" aria-hidden="true">
        Zyvora
      </div>
      <div className="footer__bottom mono">
        <span>© 2026 Zyvora Labs — concept experience</span>
        <span>Built with React · Three.js · GSAP</span>
      </div>
    </footer>
  )
}
