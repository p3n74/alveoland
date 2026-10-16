import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { Header } from '@/components/Header'
import { SuiteGrid } from '@/components/SuiteGrid'
import { getProperties, toCard } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Alveo Land condos, residential lots, and commercial lots, filtered by city and property type.',
  alternates: { canonical: '/properties' },
}

export default async function PropertiesPage() {
  const cards = (await getProperties()).map(toCard)

  return (
    <>
      <Header variant="solid" current="properties" />
      <main id="main">
        <div className="container page-head">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <Link href="/">Home</Link> <span aria-hidden="true">›</span> <span>Properties</span>
          </nav>
          <h1 className="page-title">The digital suite</h1>
          <p className="body page-lead">
            Public Alveo projects across the Philippines. Filter by city or property type, then open a project for its
            facts and an inquiry.
          </p>
        </div>
        <Suspense fallback={null}>
          <SuiteGrid properties={cards} />
        </Suspense>
      </main>
    </>
  )
}
