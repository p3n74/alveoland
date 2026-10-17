import type { Metadata } from 'next'

import { LegalPage } from '@/components/LegalPage'
import { getLegalDoc } from '@/lib/legal'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDoc('data-privacy')
  return { title: doc.title, alternates: { canonical: '/data-privacy' } }
}

export default function DataPrivacyPage() {
  return <LegalPage slug="data-privacy" />
}
