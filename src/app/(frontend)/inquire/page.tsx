import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactBar, ContactChannels } from '@/components/ContactChannels'
import { Header } from '@/components/Header'
import { InquiryForm } from '@/components/InquiryForm'
import { getChannels } from '@/lib/contact'
import { getProfile, getProperties } from '@/lib/data'
import { CORPORATE, INQUIRY_TYPES, SALES } from '@/lib/format'
import { createFormToken, turnstileSiteKey } from '@/lib/inquiry-guard'

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
  const email = profile.email || SALES.email
  const name = profile.name || SALES.name

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
            contactName={name}
            responseHours={profile.responseHours}
            formToken={createFormToken()}
            turnstileSiteKey={turnstileSiteKey()}
          />
        </section>

        <aside className="inquire-aside on-dark" aria-label="How to reach Luthgarda Pazon">
          <div className="inquire-aside__block">
            <p className="inquire-aside__label">Direct contact</p>
            <p className="inquire-aside__name">{name}</p>
            {profile.title ? <p className="inquire-aside__sub">{profile.title} · Alveo Land</p> : null}
            <ContactChannels channels={channels} tone="light" label="Direct contact channels" />
            <p>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
            {profile.responseHours ? <p className="inquire-aside__note">Reply hours: {profile.responseHours}</p> : null}
            <p className="inquire-aside__note">Alveo Land office: {CORPORATE.address}</p>
            <p className="inquire-aside__scam">
              Avoid scams. She will only reply from {SALES.email}. Payment goes only to Alveo Land official accounts.
            </p>
          </div>
        </aside>
      </main>
      <ContactBar channels={channels} />
    </>
  )
}
