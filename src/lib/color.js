const clamp255 = (v) => Math.round(Math.max(0, Math.min(255, v)))

export function hexToRgb(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const rgbToHex = (r, g, b) => '#' + [r, g, b].map((v) => clamp255(v).toString(16).padStart(2, '0')).join('')

/** Multiply a color towards black (f < 1) — used to derive the deep backdrop tone. */
export function shade(hex, f) {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex(r * f, g * f, b * f)
}

export function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255)
}

/** A harmonious random palette: saturated shell, warm-shifted accent, deep complementary backdrop. */
export function randomPalette() {
  const h = Math.floor(Math.random() * 360)
  const bg = hslToHex((h + 200) % 360, 55, 10)
  return {
    shell: hslToHex(h, 78, 50),
    accent: hslToHex((h + 35) % 360, 95, 64),
    bg,
    bg2: shade(bg, 0.3),
  }
}
