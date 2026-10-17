import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactBar, ContactChannels } from '@/components/ContactChannels'
import { Header } from '@/components/Header'
import { InquiryForm } from '@/components/InquiryForm'
import { getChannels } from '@/lib/contact'
import { getProfile, getProperties } from '@/lib/data'
import { CORPORATE, INQUIRY_TYPES } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Send an inquiry',
  description: 'Ask about an Alveo Land property, a viewing, or payment terms.',
  alternates: { canonical: '/inquire' },
}

type Props = { searchParams: Promise<{ property?: string; type?: string; intent?: string }> }

export default async function InquirePage({ searchParams }: Props) {
  const [properties, profile, query] = await Promise.all([getProperties(), getProfile(), searchParams])
  const preset = properties.find((p) => p.slug === query.property)
  const requested = query.intent ?? query.type
  const defaultType = INQUIRY_TYPES.some((t) => t.value === requested) ? requested : undefined
  const channels = getChannels(profile, preset?.name)
  const hasDirect = channels.length > 0 || Boolean(profile.email)

  return (
    <>
      <Header variant="solid" current="inquire" />
      <main id="main" className="container section inquire-layout">
        <section className="inquire-main" aria-labelledby="inquire-title">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link href="/">Home</Link> <span aria-hidden="true">›</span> <span>Inquire</span>
          </nav>
          <h1 id="inquire-title" className="form-title">
            Send a message
          </h1>
          <p className="body">
            Ask about a project, a viewing, or payment terms. Your message is saved for a direct reply.
          </p>
          <InquiryForm
            properties={properties.map((p) => ({ id: p.id, name: p.name }))}
            defaultPropertyId={preset?.id}
            defaultType={defaultType}
            headingId="inquire-title"
            contactName={profile.name}
            responseHours={profile.responseHours}
          />
        </section>

        <aside className="inquire-aside on-dark" aria-label="Other ways to reach us">
          {hasDirect ? (
            <div className="inquire-aside__block">
              <p className="inquire-aside__label">{profile.name ? 'Direct contact' : 'Your sales contact'}</p>
              {profile.name ? <p className="inquire-aside__name">{profile.name}</p> : null}
              {profile.name && profile.title ? <p className="inquire-aside__sub">{profile.title} · Alveo Land</p> : null}
              <ContactChannels channels={channels} tone="light" label="Direct contact channels" />
              {profile.email ? (
                <p>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </p>
              ) : null}
              {profile.responseHours ? <p className="inquire-aside__note">Reply hours: {profile.responseHours}</p> : null}
            </div>
          ) : null}
          <div className="inquire-aside__block">
            <p className="inquire-aside__label">Corporate desk</p>
            <p>
              <a href={CORPORATE.hotlineHref}>{CORPORATE.hotline}</a>
            </p>
            <p>
              <a href={`mailto:${CORPORATE.email}`}>{CORPORATE.email}</a>
            </p>
            <p className="inquire-aside__note">{CORPORATE.address}</p>
          </div>
        </aside>
      </main>
      <ContactBar channels={channels} />
    </>
  )
}
