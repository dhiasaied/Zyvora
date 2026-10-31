import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PRESETS, useTheme } from '../../store/theme'
import { PaletteIcon } from './Icons'

const FIELDS = [
  { key: 'shell', label: 'Shell' },
  { key: 'accent', label: 'Accent' },
  { key: 'bg', label: 'Backdrop' },
]

/** "Shell Lab": live palette customizer for both the page and the 3D model. */
export default function ColorPicker() {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const panel = useRef(null)
  const first = useRef(true)

  useEffect(() => {
    const el = panel.current
    if (first.current) {
      first.current = false
      gsap.set(el, { autoAlpha: 0, y: 20, scale: 0.96 })
      return
    }
    gsap.to(el, { autoAlpha: open ? 1 : 0, y: open ? 0 : 20, scale: open ? 1 : 0.96, duration: 0.5, ease: 'expo.out' })
    if (open) {
      gsap.fromTo(
        el.querySelectorAll('.swatch'),
        { scale: 0.4, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, stagger: 0.04, duration: 0.5, ease: 'back.out(2)' },
      )
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="lab">
      <div className="lab__panel" ref={panel} role="dialog" aria-label="Shell Lab color customizer" aria-hidden={!open}>
        <header className="lab__head">
          <span className="mono">Shell Lab</span>
          <span className="lab__preset">{theme.preset}</span>
        </header>

        <div className="lab__swatches">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              className={`swatch ${theme.preset === p.name ? 'is-active' : ''}`}
              style={{ '--s': p.shell, '--a': p.accent, '--b': p.bg }}
              title={p.name}
              aria-label={`${p.name} palette`}
              onClick={() => theme.applyPreset(p)}
            >
              <span />
            </button>
          ))}
        </div>

        <div className="lab__fields">
          {FIELDS.map(({ key, label }) => (
            <label className="lab__field" key={key}>
              <span className="lab__chip" style={{ background: theme[key] }}>
                <input type="color" value={theme[key]} onChange={(e) => theme.setColor(key, e.target.value)} />
              </span>
              <span className="lab__label">{label}</span>
              <code>{theme[key].toUpperCase()}</code>
            </label>
          ))}
        </div>

        <div className="lab__actions">
          <button className="btn btn--ghost btn--sm" onClick={theme.randomize}>
            Randomize
          </button>
          <button className="btn btn--ghost btn--sm" onClick={() => theme.applyPreset(PRESETS[0])}>
            Reset
          </button>
        </div>
      </div>

      <button className="lab__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <PaletteIcon />
        <span>Shell Lab</span>
      </button>
    </div>
  )
}
