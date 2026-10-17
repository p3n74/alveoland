import type { Metadata } from 'next'

import { LegalPage } from '@/components/LegalPage'
import { getLegalDoc } from '@/lib/legal'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalDoc('privacy')
  return { title: doc.title, alternates: { canonical: '/privacy' } }
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />
}
