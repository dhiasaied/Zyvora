import SectionHeading from '../ui/SectionHeading'
import { CheckIcon } from '../ui/Icons'
import { scrollToTarget } from '../../lib/smoothScroll'

const PLANS = [
  {
    name: 'Larva',
    price: 149,
    note: 'For first flights',
    features: ['25 min hover', 'One sealed shell', 'App + gesture control', '1-year care'],
  },
  {
    name: 'Imago',
    price: 349,
    note: 'Most flown',
    featured: true,
    features: ['42 min hover', 'Three swappable shells', 'Follow & orbit modes', 'Swarm-ready firmware', '2-year care'],
  },
  {
    name: 'Swarm',
    price: 1199,
    note: 'Five units, one mind',
    features: ['5 × Imago units', 'Choreography studio', 'Rugged field case', 'Priority support'],
  },
]

function PlanCard({ plan }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <article className={`plan ${plan.featured ? 'plan--featured' : ''}`} onMouseMove={onMove} data-reveal>
      <header>
        <span className="mono">{plan.name}</span>
        {plan.featured && <span className="plan__badge">{plan.note}</span>}
      </header>
      <div className="plan__price">
        <sup>$</sup>
        {plan.price.toLocaleString('en-US')}
      </div>
      {!plan.featured && <p className="plan__note">{plan.note}</p>}
      {plan.featured && <p className="plan__note">The full Zyvora experience</p>}
      <ul>
        {plan.features.map((f) => (
          <li key={f}>
            <CheckIcon /> {f}
          </li>
        ))}
      </ul>
      <button className={`btn ${plan.featured ? 'btn--accent' : 'btn--ghost'}`} onClick={() => scrollToTarget('#launch')}>
        Choose {plan.name}
      </button>
    </article>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="section section--center" data-scene>
      <SectionHeading eyebrow="Pricing" title="Pick your" accent="stage." align="center" />
      <div className="plans">
        {PLANS.map((p) => (
          <PlanCard key={p.name} plan={p} />
        ))}
      </div>
    </section>
  )
}
