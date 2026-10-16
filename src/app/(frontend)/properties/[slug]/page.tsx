import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Arrow } from '@/components/Arrow'
import { Gallery } from '@/components/Gallery'
import { Header } from '@/components/Header'
import { InquiryForm } from '@/components/InquiryForm'
import { getPropertyBySlug, propertyFrames } from '@/lib/data'
import { typeLabel } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

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

export default async function PropertyPage({ params }: Props) {
  const property = await getPropertyBySlug((await params).slug)
  if (!property) notFound()

  const frames = propertyFrames(property)
  const facts = [
    { label: 'City', value: property.city },
    { label: 'Type', value: typeLabel(property.type, 'singular') },
    property.status && { label: 'Status', value: property.status },
    property.area && { label: 'Area', value: property.area },
  ].filter(Boolean) as { label: string; value: string }[]

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
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            <div className="fact">
              <dt>Price</dt>
              <dd>{property.priceFrom || 'On request'}</dd>
              {!property.priceVerified ? (
                <dd className="fact__note">Price to be confirmed. Ask for the current Alveo price list.</dd>
              ) : null}
            </div>
          </dl>
          {property.summary ? <p className="body detail__summary">{property.summary}</p> : null}
          <p className="body body--meta">
            Facts follow public Alveo listings and are confirmed with you before any reservation.
          </p>
          <Link href="/properties" className="text-btn">
            All properties <Arrow />
          </Link>
        </section>

        <section className="container section form-section" aria-labelledby="inquire-title">
          <h2 id="inquire-title" className="form-title">
            Inquire about {property.name}
          </h2>
          <p className="body">Leave your details and a short note. The corporate desk remains available below.</p>
          <InquiryForm fixedProperty={{ id: property.id, name: property.name }} headingId="inquire-title" />
        </section>
      </main>
    </>
  )
}
