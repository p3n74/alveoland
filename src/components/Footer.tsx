import Link from 'next/link'

import type { Profile } from '@/payload-types'
import { getChannels } from '@/lib/contact'
import { CORPORATE } from '@/lib/format'
import { ContactChannels } from './ContactChannels'

export function Footer({ profile }: { profile: Profile | null }) {
  const channels = getChannels(profile)
  const hasDirect = channels.length > 0 || Boolean(profile?.email)

  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        {hasDirect ? (
          <section aria-labelledby="footer-direct">
            <h2 id="footer-direct" className="site-footer__title">
              {profile?.name || 'Direct contact'}
            </h2>
            {profile?.name && profile.title ? <p className="site-footer__sub">{profile.title} · Alveo Land</p> : null}
            <ContactChannels channels={channels} tone="light" label="Direct contact channels" />
            {profile?.email ? (
              <dl className="site-footer__list">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </dd>
                </div>
              </dl>
            ) : null}
            {profile?.responseHours ? (
              <p className="site-footer__address">Reply hours: {profile.responseHours}</p>
            ) : null}
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
