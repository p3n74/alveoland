import type { Metadata } from 'next'

import { LegalPage } from '@/components/LegalPage'
import { getLegalDoc } from '@/lib/legal'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDoc('terms')
  return { title: doc.title, alternates: { canonical: '/terms' } }
}

export default function TermsPage() {
  return <LegalPage slug="terms" />
}
