import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { randomPalette, shade } from '../lib/color'

export const PRESETS = [
  { name: 'Ladybug', shell: '#d4231b', accent: '#ff8a3d', bg: '#0b1a36', bg2: '#03060e' },
  { name: 'Ember', shell: '#ff6b1a', accent: '#ffd166', bg: '#24110a', bg2: '#080302' },
  { name: 'Glacier', shell: '#22b8cf', accent: '#a5f3fc', bg: '#062430', bg2: '#01080c' },
  { name: 'Orchid', shell: '#8b5cf6', accent: '#f472b6', bg: '#170d33', bg2: '#05020f' },
  { name: 'Aurum', shell: '#d9a52b', accent: '#fff0b3', bg: '#1b170b', bg2: '#060502' },
  { name: 'Venom', shell: '#2fd27a', accent: '#d4ff4f', bg: '#08201a', bg2: '#010806' },
]

const colorsOf = ({ shell, accent, bg, bg2 }) => ({ shell, accent, bg, bg2 })

const storage = createJSONStorage(() => {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
})

/**
 * Global palette store. Lives outside React so both the DOM tree and the
 * R3F canvas (a separate reconciler) can read it, including per-frame via getState().
 */
export const useTheme = create(
  persist(
    (set) => ({
      ...colorsOf(PRESETS[0]),
      preset: PRESETS[0].name,
      setColor: (key, value) =>
        set(key === 'bg' ? { bg: value, bg2: shade(value, 0.3), preset: 'Custom' } : { [key]: value, preset: 'Custom' }),
      applyPreset: (p) => set({ ...colorsOf(p), preset: p.name }),
      randomize: () => set({ ...randomPalette(), preset: 'Custom' }),
    }),
    {
      name: 'zyvora-shell-lab',
      storage,
      partialize: ({ shell, accent, bg, bg2, preset }) => ({ shell, accent, bg, bg2, preset }),
    },
  ),
)
