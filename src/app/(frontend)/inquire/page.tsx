import type { Metadata } from 'next'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { InquiryForm } from '@/components/InquiryForm'
import { getProperties } from '@/lib/data'
import { INQUIRY_TYPES } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Send an inquiry',
  description: 'Ask about an Alveo Land property, a viewing, or payment terms.',
  alternates: { canonical: '/inquire' },
}

type Props = { searchParams: Promise<{ property?: string; type?: string }> }

export default async function InquirePage({ searchParams }: Props) {
  const [properties, query] = await Promise.all([getProperties(), searchParams])
  const preset = properties.find((p) => p.slug === query.property)
  const defaultType = INQUIRY_TYPES.some((t) => t.value === query.type) ? query.type : undefined

  return (
    <>
      <Header variant="solid" current="inquire" />
      <main id="main">
        <section className="container section form-section" aria-labelledby="inquire-title">
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
          />
        </section>
      </main>
    </>
  )
}
