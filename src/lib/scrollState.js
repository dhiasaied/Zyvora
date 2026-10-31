/**
 * Mutable scroll state shared between the DOM and the 3D scene.
 * `t` is a continuous section index: it holds at an integer while that
 * [data-scene] section fills the viewport and blends to the next one across
 * the section boundary. The scene reads it every frame.
 */
export const scrollState = { t: 0, progress: 0, section: 0, count: 1 }

const listeners = new Set()

export function onSectionChange(fn) {
  listeners.add(fn)
  fn(scrollState.section)
  return () => listeners.delete(fn)
}

export function trackSections() {
  // [holdStart, holdEnd] in "viewport-center" page coordinates for each section.
  let anchors = []

  const update = () => {
    const center = window.scrollY + window.innerHeight / 2
    let t = 0
    const n = anchors.length
    if (n > 1) {
      if (center >= anchors[n - 1][0]) t = n - 1
      else {
        for (let i = 0; i < n - 1; i++) {
          const [, end] = anchors[i]
          const [nextStart] = anchors[i + 1]
          if (center <= end) {
            t = i
            break
          }
          if (center < nextStart) {
            t = i + (center - end) / (nextStart - end)
            break
          }
        }
      }
    }
    scrollState.t = t
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? Math.min(1, window.scrollY / max) : 0

    const section = Math.round(t)
    if (section !== scrollState.section) {
      scrollState.section = section
      listeners.forEach((fn) => fn(section))
    }
  }

  const measure = () => {
    const els = [...document.querySelectorAll('[data-scene]')]
    const half = window.innerHeight / 2
    anchors = els.map((el) => {
      const r = el.getBoundingClientRect()
      const top = r.top + window.scrollY
      const inset = Math.min(half, r.height / 2)
      return [top + inset, top + r.height - inset]
    })
    scrollState.count = els.length
    update()
  }

  measure()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', measure)
  const ro = new ResizeObserver(measure)
  ro.observe(document.body)

  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', measure)
    ro.disconnect()
  }
}
