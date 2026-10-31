import { useEffect } from 'react'
import { useTheme } from '../store/theme'

/** Mirrors the palette store into CSS custom properties (animated via @property in CSS). */
export function useThemeVars() {
  const shell = useTheme((s) => s.shell)
  const accent = useTheme((s) => s.accent)
  const bg = useTheme((s) => s.bg)
  const bg2 = useTheme((s) => s.bg2)

  useEffect(() => {
    const style = document.documentElement.style
    style.setProperty('--shell', shell)
    style.setProperty('--accent', accent)
    style.setProperty('--bg', bg)
    style.setProperty('--bg2', bg2)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
  }, [shell, accent, bg, bg2])
}
