import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Arrow } from '@/components/Arrow'
import { ContactBar, ContactChannels } from '@/components/ContactChannels'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { InquiryForm } from '@/components/InquiryForm'
import { IntentLink } from '@/components/IntentLink'
import { VerifyBlock } from '@/components/VerifyBlock'
import { getChannels } from '@/lib/contact'
import { getProfile, getPropertyBySlug, paragraphs, propertyFrames } from '@/lib/data'
import { balanceModeLabel, formatDate, INQUIRY_TYPES, SALES, statusLabel, typeLabel } from '@/lib/format'
import { createFormToken, turnstileSiteKey } from '@/lib/inquiry-guard'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ intent?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyBySlug((await params).slug)
  if (!property) return { title: 'Property not found' }
  const image = propertyFrames(property)[0]
  return {
    title: property.name,
    description:
      property.summary ?? `${property.name}, ${typeLabel(property.type, 'singular')} in ${property.city} by Alveo Land.`,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: image ? { images: [image.src] } : undefined,
  }
}

const askMe = (
  <IntentLink intent="payment-terms" className="ask-link">
    Ask me <Arrow />
  </IntentLink>
)

function percent(value: number | null | undefined) {
  return value == null ? '' : `${value}%`
}

export default async function PropertyPage({ params, searchParams }: Props) {
  const [{ slug }, query, profile] = await Promise.all([params, searchParams, getProfile()])
  const property = await getPropertyBySlug(slug)
  if (!property) notFound()

  const soldOut = property.status === 'sold-out'
  const requested = INQUIRY_TYPES.find((t) => t.value === query.intent)?.value
  const defaultType = requested ?? (soldOut ? 'similar-units' : 'property-information')
  const frames = propertyFrames(property)
  const schemes = property.paymentSchemes ?? []
  const unitTypes = property.unitTypes ?? []
  const channels = getChannels(profile, property.name)

  const facts: { label: string; value: ReactNode; wide?: boolean; note?: ReactNode }[] = [
    {
      label: 'Price',
      value: property.priceFrom || 'On request',
      wide: true,
      note: property.priceVerified ? null : 'Price to be confirmed. Ask for the current Alveo price list.',
    },
    { label: 'City', value: property.city },
    { label: 'Type', value: typeLabel(property.type, 'singular') },
  ]
  if (soldOut) {
    facts.push({
      label: 'Status',
      value: (
        <IntentLink intent="similar-units" className="ask-link">
          Sold out — ask about similar <Arrow />
        </IntentLink>
      ),
    })
  } else if (property.status) {
    facts.push({ label: 'Status', value: statusLabel(property.status, property.type) })
  }
  if (property.area) facts.push({ label: 'Area', value: property.area })
  facts.push(
    { label: 'Reservation fee', value: property.reservationFee || askMe },
    { label: 'Turnover', value: property.targetTurnover || askMe },
    {
      label: 'Payment terms',
      value:
        schemes.length > 0 ? (
          <a href="#payment-terms" className="ask-link">
            See schemes below <Arrow />
          </a>
        ) : (
          askMe
        ),
    },
  )

  return (
    <>
      <Header variant="solid" current="properties" />
      <main id="main">
        <div className="container page-head">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link href="/">Home</Link> <span aria-hidden="true">›</span> <Link href="/properties">Properties</Link>{' '}
            <span aria-hidden="true">›</span> <span>{property.name}</span>
          </nav>
          <p className="eyebrow">
            {property.city} · {typeLabel(property.type)}
          </p>
          <h1 className="page-title">{property.name}</h1>
        </div>

        <div className="container">
          <Gallery frames={frames} name={property.name} />
        </div>

        <section className="container section section--tight" aria-label="Facts">
          <div className="intents">
            {soldOut ? (
              <IntentLink intent="similar-units" className="btn">
                Ask about similar units
              </IntentLink>
            ) : (
              <>
                <IntentLink intent="payment-terms" className="btn">
                  Get price list and payment terms
                </IntentLink>
                <IntentLink intent="viewing" className="text-btn">
                  Book a viewing (on-site or video call) <Arrow />
                </IntentLink>
              </>
            )}
          </div>

          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label} className={`fact${f.wide ? ' fact--wide' : ''}`}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
                {f.note ? <dd className="fact__note">{f.note}</dd> : null}
              </div>
            ))}
          </dl>

          {property.summary ? <p className="body detail__summary">{property.summary}</p> : null}
          {property.location || property.mapUrl ? (
            <div className="detail__location">
              <h2 className="sub-label">Location</h2>
              {paragraphs(property.location).map((p, i) => (
                <p key={i} className="body">
                  {p}
                </p>
              ))}
              {property.mapUrl && /^https:\/\//.test(property.mapUrl) ? (
                <a href={property.mapUrl} className="text-btn" target="_blank" rel="noopener noreferrer">
                  Open the map <Arrow />
                </a>
              ) : null}
            </div>
          ) : null}
          <p className="body body--meta detail__source">
            Facts follow public Alveo listings and are confirmed with you before any reservation.
          </p>
          <Link href="/properties" className="text-btn">
            All properties <Arrow />
          </Link>
        </section>

        {schemes.length > 0 ? (
          <section id="payment-terms" className="container section" aria-labelledby="schemes-title">
            <h2 id="schemes-title" className="sub-label">
              Payment terms
            </h2>
            {property.termsAsOf ? <p className="body body--meta">As of {formatDate(property.termsAsOf)}</p> : null}
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Scheme</th>
                    <th scope="col">Down payment</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map((s) => (
                    <tr key={s.id ?? s.label}>
                      <th scope="row">{s.label}</th>
                      <td>
                        {[
                          percent(s.downPaymentPercent),
                          s.downPaymentMonths ? `over ${s.downPaymentMonths} months` : '',
                        ]
                          .filter(Boolean)
                          .join(' ') || '—'}
                      </td>
                      <td>{[percent(s.balancePercent), balanceModeLabel(s.balanceMode)].filter(Boolean).join(' · ') || '—'}</td>
                      <td>{s.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="body body--meta">Subject to change; confirm before reserving.</p>
          </section>
        ) : null}

        {unitTypes.length > 0 ? (
          <section className="container section" aria-labelledby="units-title">
            <h2 id="units-title" className="sub-label">
              Unit types
            </h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Unit</th>
                    <th scope="col">Area</th>
                    <th scope="col">Price from</th>
                  </tr>
                </thead>
                <tbody>
                  {unitTypes.map((u) => (
                    <tr key={u.id ?? u.label}>
                      <th scope="row">{u.label}</th>
                      <td>{u.areaRange || '—'}</td>
                      <td>{u.priceFrom || 'On request'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <div className="container section">
          <VerifyBlock profile={profile} property={property} />
        </div>

        <section id="inquire" className="container section form-section" aria-labelledby="inquire-title">
          <h2 id="inquire-title" className="form-title">
            Inquire about {property.name}
          </h2>
          <p className="body">
            Leave your details and a short note. {profile.name || SALES.name} will reply by email.
          </p>
          <ContactChannels channels={channels} label={`Contact about ${property.name}`} />
          <InquiryForm
            fixedProperty={{ id: property.id, name: property.name }}
            defaultType={defaultType}
            headingId="inquire-title"
            contactName={profile.name || SALES.name}
            responseHours={profile.responseHours}
            formToken={createFormToken()}
            turnstileSiteKey={turnstileSiteKey()}
          />
        </section>
      </main>
      <ContactBar channels={channels} />
    </>
  )
}
