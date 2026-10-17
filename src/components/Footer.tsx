import Link from 'next/link'

import type { Profile } from '@/payload-types'
import { getChannels } from '@/lib/contact'
import { CORPORATE, SALES } from '@/lib/format'
import { LEGAL_DOCS, type LegalSlug } from '@/lib/legal-links'

const FOOTER_LEGAL_ORDER: LegalSlug[] = ['privacy', 'data-privacy', 'terms']
import { ContactChannels } from './ContactChannels'

export function Footer({ profile }: { profile: Profile | null }) {
  const channels = getChannels(profile)
  const email = profile?.email || SALES.email
  const name = profile?.name || SALES.name

  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__grid">
        <section aria-labelledby="footer-direct">
          <h2 id="footer-direct" className="site-footer__title">
            {name}
          </h2>
          {profile?.title ? <p className="site-footer__sub">{profile.title} · Alveo Land</p> : null}
          <ContactChannels channels={channels} tone="light" label="Direct contact channels" />
          <dl className="site-footer__list">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${email}`}>{email}</a>
              </dd>
            </div>
          </dl>
          {profile?.responseHours ? (
            <p className="site-footer__address">Reply hours: {profile.responseHours}</p>
          ) : null}
        </section>

        <section aria-labelledby="footer-office">
          <h2 id="footer-office" className="site-footer__title">
            Alveo Land office
          </h2>
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
        <p className="site-footer__scam">
          Avoid scams. She will only reply from {SALES.email}. Payment goes only to Alveo Land official accounts.
        </p>
        <nav aria-label="Legal" className="site-footer__legal-links">
          {FOOTER_LEGAL_ORDER.map((slug) => {
            const doc = LEGAL_DOCS.find((d) => d.slug === slug)!
            return (
              <Link key={slug} href={`/${slug}`}>
                {doc.label}
              </Link>
            )
          })}
        </nav>
        <p>
          Personal site of an Alveo Land sales associate, not the official Alveo Land website. Project facts follow
          public Alveo listings and may change.
        </p>
      </div>
    </footer>
  )
}
