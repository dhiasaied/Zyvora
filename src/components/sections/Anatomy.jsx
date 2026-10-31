import SectionHeading from '../ui/SectionHeading'

const STEPS = [
  {
    n: '01',
    title: 'Lift the elytra',
    text: 'Two carbon-ceramic shell halves hinge open in 80 ms on a single magnetic actuator — sealed to IP67 the moment they close.',
  },
  {
    n: '02',
    title: 'Unfold the membrane',
    text: 'Origami-folded wings laminated from 12 µm polymer deploy to 2.3× body length — no motors in the wing itself.',
  },
  {
    n: '03',
    title: 'Take the air',
    text: 'A 120 Hz wingbeat and an on-board flight core hold a silent, rock-steady hover — indoors, outdoors, in the dark.',
  },
]

export default function Anatomy() {
  return (
    <section id="anatomy" className="section" data-scene>
      <div className="split">
        <div className="panel">
          <SectionHeading eyebrow="How it works" title="Anatomy of" accent="a flight" />
          <ol className="steps">
            {STEPS.map((s) => (
              <li className="step" key={s.n} data-reveal>
                <span className="step__n mono">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
