import { useState } from 'react'
import { ArrowIcon, CheckIcon } from '../ui/Icons'

export default function Launch() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (/\S+@\S+\.\S+/.test(email)) setSent(true)
  }

  return (
    <section id="launch" className="section launch" data-scene>
      <p className="display display--xl" data-reveal>
        Open <em className="slash">/</em>
      </p>
      <div className="launch__middle">
        <p className="eyebrow" data-reveal>
          <span className="pulse" /> First batch ships Spring 2027
        </p>
      </div>
      <p className="display display--xl display--right" data-reveal>
        your shell
      </p>

      <form className="launch__form" onSubmit={submit} data-reveal>
        {sent ? (
          <p className="launch__done">
            <CheckIcon /> You're on the list. We'll ping you before the shells go out.
          </p>
        ) : (
          <>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn--accent" type="submit">
              Reserve <ArrowIcon />
            </button>
          </>
        )}
      </form>
    </section>
  )
}
