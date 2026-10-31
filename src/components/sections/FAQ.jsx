import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../ui/SectionHeading'

const ITEMS = [
  {
    q: 'How long does a charge last?',
    a: '42 minutes of active hover, up to 70 in glide-assisted mode. A USB-C top-up takes it from 0 to 80% in 18 minutes.',
  },
  {
    q: 'Is it loud?',
    a: 'The 120 Hz wingbeat is tuned below 34 dB at two meters — quieter than a whisper and well under ambient city noise.',
  },
  {
    q: 'What happens when it rains?',
    a: 'The elytra snap shut in 80 ms. Sealed, Zyvora is rated IP67 and simply waits the weather out.',
  },
  {
    q: 'Can I swap the shell color?',
    a: 'Yes — shells are magnetic and hot-swappable. Open the Shell Lab in the corner of this page to preview any palette live.',
  },
  {
    q: 'Where do you ship?',
    a: '38 countries at launch, with carbon-neutral shipping and a 30-day flight-tested return window.',
  },
]

function Item({ item, open, onToggle, index }) {
  const body = useRef(null)
  useEffect(() => {
    gsap.to(body.current, {
      height: open ? 'auto' : 0,
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => ScrollTrigger.refresh(),
    })
  }, [open])

  return (
    <div className={`faq__item ${open ? 'is-open' : ''}`} data-reveal>
      <button className="faq__q" aria-expanded={open} aria-controls={`faq-${index}`} onClick={onToggle}>
        <span className="mono">0{index + 1}</span>
        <span className="faq__text">{item.q}</span>
        <span className="faq__icon" aria-hidden="true" />
      </button>
      <div className="faq__a" id={`faq-${index}`} ref={body} style={{ height: 0 }}>
        <p>{item.a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="section" data-scene>
      <div className="split">
        <div className="panel">
          <SectionHeading eyebrow="FAQ" title="Before you" accent="take off." />
          <div className="faq">
            {ITEMS.map((item, i) => (
              <Item key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
