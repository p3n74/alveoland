import Image from 'next/image'
import Link from 'next/link'

import { Arrow } from '@/components/Arrow'
import { ContactBar } from '@/components/ContactChannels'
import { Header } from '@/components/Header'
import { FEATURED_CARD_SIZES, PropertyCard } from '@/components/PropertyCard'
import { VerifyBlock } from '@/components/VerifyBlock'
import { getChannels } from '@/lib/contact'
import { getCredibility, getProfile, getProperties, isMedia, paragraphs, toCard } from '@/lib/data'
import { HERO_IMAGE } from '@/lib/format'

export default async function HomePage() {
  const [profile, properties, credibility] = await Promise.all([getProfile(), getProperties(), getCredibility()])

  const title = profile.title || 'Senior Sales'
  const intro = paragraphs(profile.intro)
  const featured = properties.filter((p) => p.featured).map(toCard)
  const { awards, testimonials, salesRecords } = credibility
  const hasRecord = awards.length + testimonials.length + salesRecords.length > 0
  const portrait = isMedia(profile.portrait) && profile.portrait.url ? profile.portrait : null
  const showroom = isMedia(profile.showroomPhoto) && profile.showroomPhoto.url ? profile.showroomPhoto : null
  const channels = getChannels(profile)

  const cities = (profile.cities ?? []).map((c) => c.city).filter(Boolean)
  const accreditation = (profile.accreditation ?? []).map((a) => a.item).filter(Boolean)
  const facts = [
    cities.length > 0 && { label: 'Cities covered', value: cities.join(', ') },
    profile.yearsWithAlveo != null && {
      label: 'With Alveo',
      value: profile.yearsWithAlveo === 1 ? '1 year' : `${profile.yearsWithAlveo} years`,
    },
    accreditation.length > 0 && { label: 'Accreditation', value: accreditation.join(' · ') },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <section className="hero on-dark" aria-labelledby="hero-title">
        <Image src={HERO_IMAGE} alt="Bonifacio Global City at dusk" fill priority sizes="100vw" className="hero__img" />
        <Header variant="overlay" showRecord={hasRecord} />
        <div className="container hero__content">
          <h1 id="hero-title" className="hero__title">
            {profile.name || title}
          </h1>
          <p className="hero__role">
            {profile.name ? `${title} · Alveo Land` : 'Alveo Land · living and working well'}
          </p>
          <p className="hero__intro">
            {intro[0] ??
              'A personal guide to the Alveo portfolio: condos, residential lots, and commercial lots in growth centers across the Philippines.'}
          </p>
          <div className="hero__actions">
            <Link href="#featured" className="text-btn text-btn--light">
              Featured properties <Arrow />
            </Link>
            <Link href="/inquire" className="text-btn text-btn--light">
              Send an inquiry <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <main id="main">
        <section id="meet" className="section container" aria-labelledby="meet-title">
          <h2 id="meet-title" className="section-label">
            Meet Luthgarda
          </h2>
          <div className={`guide${facts.length > 0 || portrait || showroom ? ' guide--split' : ''}`}>
            <div className="guide__copy">
              {intro.slice(1).map((p, i) => (
                <p key={i} className="body">
                  {p}
                </p>
              ))}
              <p className="body">
                As Ayala Land’s upscale residential arm, Alveo offers a portfolio of prime spaces for living and working
                well, set within growth centers across the Philippines.
              </p>
              <p className="body">
                This site is a personal guide into that portfolio. Send an inquiry about a condo, a residential lot, or
                a commercial lot, and you will be walked through what you need to know before choosing to invest: the
                project, the unit or lot, and the payment terms.
              </p>
              <p className="body body--meta">
                Figures on this site follow public Alveo listings and may have changed. Ask for the current price list
                before you reserve.
              </p>
            </div>
            {facts.length > 0 || portrait || showroom ? (
              <aside className="guide__aside">
                {portrait ? (
                  <div className="portrait">
                    <Image
                      src={portrait.url as string}
                      alt={portrait.alt || profile.name || 'Portrait'}
                      fill
                      sizes="(min-width: 860px) 360px, 100vw"
                    />
                  </div>
                ) : null}
                {showroom ? (
                  <div className="portrait portrait--wide">
                    <Image
                      src={showroom.url as string}
                      alt={showroom.alt || profile.name || 'Showroom photo'}
                      fill
                      sizes="(min-width: 860px) 360px, 100vw"
                    />
                  </div>
                ) : null}
                {facts.length > 0 ? (
                  <dl className="facts-panel on-dark">
                    {facts.map((f) => (
                      <div key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </aside>
            ) : null}
          </div>
        </section>

        <div className="container section">
          <VerifyBlock profile={profile} />
        </div>

        {hasRecord ? (
          <section id="record" className="section container" aria-labelledby="record-title">
            <h2 id="record-title" className="section-label">
              Record
            </h2>

            {salesRecords.length > 0 ? (
              <div className="record-block">
                <h3 className="sub-label">Sales record</h3>
                <dl className="stats">
                  {salesRecords.map((r) => (
                    <div key={r.id} className="stat">
                      <dt className="stat__label">
                        {r.label}
                        {r.period ? ` · ${r.period}` : ''}
                      </dt>
                      <dd className="stat__value">{r.value}</dd>
                      {r.note ? <dd className="stat__note">{r.note}</dd> : null}
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {awards.length > 0 ? (
              <div className="record-block">
                <h3 className="sub-label">Recognition</h3>
                <ul className="rows">
                  {awards.map((a) => (
                    <li key={a.id} className="row">
                      <div>
                        <p className="row__title">{a.title}</p>
                        <p className="row__meta">{[a.issuer, a.year].filter(Boolean).join(' · ')}</p>
                      </div>
                      {a.note ? <p className="body">{a.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {testimonials.length > 0 ? (
              <div className="record-block">
                <h3 className="sub-label">Client notes</h3>
                <div className="quotes">
                  {testimonials.map((t) => (
                    <figure key={t.id} className="quote">
                      <blockquote>
                        <p>{t.quote}</p>
                      </blockquote>
                      <figcaption>
                        {t.clientName}
                        {t.clientContext ? ` · ${t.clientContext}` : ''}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {featured.length > 0 ? (
          <section id="featured" className="section container" aria-labelledby="featured-title">
            <h2 id="featured-title" className="section-label">
              Featured properties
            </h2>
            <div className="card-grid card-grid--featured">
              {featured.map((p) => (
                <PropertyCard key={p.slug} property={p} sizes={FEATURED_CARD_SIZES} />
              ))}
            </div>
            <Link href="/properties" className="text-btn section__more">
              View all properties <Arrow />
            </Link>
          </section>
        ) : null}

        <section className="band on-dark" aria-labelledby="cta-title">
          <div className="container band__inner">
            <h2 id="cta-title" className="section-label">
              Send an inquiry
            </h2>
            <p className="body band__copy">
              Ask about a project, a viewing, or payment terms. Your message is saved for a direct reply.
            </p>
            <Link href="/inquire" className="text-btn text-btn--light">
              Start an inquiry <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <ContactBar channels={channels} />
    </>
  )
}
