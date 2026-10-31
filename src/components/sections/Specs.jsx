import SectionHeading from '../ui/SectionHeading'

const STATS = [
  { value: 38, unit: 'g', label: 'Total weight' },
  { value: 42, unit: 'min', label: 'Hover time' },
  { value: 120, unit: 'Hz', label: 'Wingbeat' },
  { value: 34, unit: 'dB', label: 'At two meters' },
]

const TABLE = [
  ['Shell', 'Carbon-ceramic composite'],
  ['Span', '11.4 cm open · 5 cm sealed'],
  ['Range', '1.2 km line of sight'],
  ['Charge', 'USB-C · 18 min to 80%'],
  ['Sensors', 'Stereo optics · ToF · 9-axis IMU'],
]

export default function Specs() {
  return (
    <section id="specs" className="section" data-scene>
      <div className="split split--right">
        <div className="panel">
          <SectionHeading eyebrow="Field specs" title="Small body." accent="Big sky." />
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label} data-reveal>
                <div className="stat__value">
                  <span data-count={s.value}>{s.value}</span>
                  <small>{s.unit}</small>
                </div>
                <span className="stat__label mono">{s.label}</span>
              </div>
            ))}
          </div>
          <dl className="spec-table" data-reveal>
            {TABLE.map(([k, v]) => (
              <div key={k}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
