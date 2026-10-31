import { useEffect, useState } from 'react'
import { onSectionChange } from '../lib/scrollState'

export function useActiveSection() {
  const [section, setSection] = useState(0)
  useEffect(() => onSectionChange(setSection), [])
  return section
}
