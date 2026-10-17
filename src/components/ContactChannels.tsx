import type { Channel } from '@/lib/contact'
import { Arrow } from './Arrow'

type Props = {
  channels: Channel[]
  tone?: 'light' | 'dark'
  label?: string
}

export function ContactChannels({ channels, tone = 'dark', label = 'Contact channels' }: Props) {
  if (channels.length === 0) return null
  return (
    <ul className={`channels channels--${tone}`} aria-label={label}>
      {channels.map((c) => (
        <li key={c.key}>
          <a
            href={c.href}
            className={`text-btn${tone === 'light' ? ' text-btn--light' : ''}`}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {c.label} <Arrow />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function ContactBar({ channels }: { channels: Channel[] }) {
  if (channels.length === 0) return null
  return (
    <nav className="contact-bar on-dark" aria-label="Quick contact">
      {channels.map((c) => (
        <a
          key={c.key}
          href={c.href}
          className="contact-bar__link"
          {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {c.label}
        </a>
      ))}
    </nav>
  )
}
