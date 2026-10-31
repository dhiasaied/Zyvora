export default function SectionHeading({ eyebrow, title, accent, align = 'left' }) {
  return (
    <header className={`heading heading--${align}`}>
      <p className="eyebrow" data-reveal>
        <span className="pulse" /> {eyebrow}
      </p>
      <h2 className="title" data-reveal>
        {title} <span className="accent">{accent}</span>
      </h2>
    </header>
  )
}
