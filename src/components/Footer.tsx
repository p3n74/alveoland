import Link from 'next/link'

import type { Profile } from '@/payload-types'
import { CORPORATE } from '@/lib/format'

export function Footer({ profile }: { profile: Profile | null }) {
  const direct = [
    profile?.phone && {
      label: 'Mobile',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, '')}`,
    },
    profile?.email && { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile?.viber && {
      label: 'Viber',
      value: profile.viber,
      href: `viber://chat?number=${encodeURIComponent(profile.viber.replace(/[^\d+]/g, ''))}`,
    },
    profile?.messengerUrl && { label: 'Messenger', value: 'Send a message', href: profile.messengerUrl },
  ].filter(Boolean) as { label: string; value: string; href: string }[]

  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        {direct.length > 0 ? (
          <section aria-labelledby="footer-direct">
            <h2 id="footer-direct" className="site-footer__title">
              {profile?.name || 'Direct contact'}
            </h2>
            {profile?.name && profile.title ? <p className="site-footer__sub">{profile.title} · Alveo Land</p> : null}
            <dl className="site-footer__list">
              {direct.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    <a href={item.href}>{item.value}</a>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section aria-labelledby="footer-corporate">
          <h2 id="footer-corporate" className="site-footer__title">
            Corporate desk
          </h2>
          <dl className="site-footer__list">
            <div>
              <dt>Hotline</dt>
              <dd>
                <a href={CORPORATE.hotlineHref}>{CORPORATE.hotline}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${CORPORATE.email}`}>{CORPORATE.email}</a>
              </dd>
            </div>
          </dl>
          <p className="site-footer__address">{CORPORATE.address}</p>
        </section>

        <nav aria-label="Footer" className="site-footer__links">
          <Link href="/properties">Properties</Link>
          <Link href="/inquire">Send an inquiry</Link>
          <a href="https://www.alveoland.com.ph/" rel="noopener">
            alveoland.com.ph
          </a>
        </nav>
      </div>
      <div className="container site-footer__legal">
        <p>
          Personal site of an Alveo Land sales associate, not the official Alveo Land website. Project facts follow
          public Alveo listings and may change.
        </p>
      </div>
    </footer>
  )
}
