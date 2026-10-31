export const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

export const PaletteIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.5-.2-.8-.4-1.1-.3-.3-.4-.6-.4-1 0-.9.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5C21 6.5 17 3 12 3Z" />
    <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
    <circle cx="10.5" cy="7.2" r="1.2" fill="currentColor" />
    <circle cx="15" cy="7.6" r="1.2" fill="currentColor" />
  </svg>
)

export const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const Logo = ({ size = 26 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <ellipse cx="16" cy="18" rx="11" ry="12" fill="var(--shell)" />
    <path d="M16 6v24" stroke="var(--bg2)" strokeWidth="2" />
    <circle cx="11.2" cy="15.5" r="2.4" fill="var(--bg2)" />
    <circle cx="20.8" cy="15.5" r="2.4" fill="var(--bg2)" />
    <circle cx="12" cy="23" r="1.8" fill="var(--bg2)" />
    <circle cx="20" cy="23" r="1.8" fill="var(--bg2)" />
    <circle cx="16" cy="5" r="3.2" fill="var(--accent)" />
  </svg>
)
