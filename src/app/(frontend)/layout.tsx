import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import React from 'react'

import { EntryGate } from '@/components/EntryGate'
import { Footer } from '@/components/Footer'
import { getProfile } from '@/lib/data'
import { HERO_IMAGE, SALES } from '@/lib/format'
import { ENTRY_ACK_KEY } from '@/lib/legal-links'
import './globals.css'

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-poppins',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  const title = profile.title || 'Senior Sales'
  const siteName = profile.name ? `${profile.name} · ${title}, Alveo Land` : `${title} · Alveo Land`
  const description =
    'A personal guide to Alveo Land condos, residential lots, and commercial lots across the Philippines, with a direct inquiry.'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: { default: siteName, template: `%s · ${siteName}` },
    description,
    openGraph: { siteName, description, images: [HERO_IMAGE], type: 'website', locale: 'en_PH' },
  }
}

const ackScript = `try{if(localStorage.getItem(${JSON.stringify(ENTRY_ACK_KEY)})!==null)document.documentElement.classList.add('gate-ack')}catch(e){}`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ackScript }} />
      </head>
      <body>
        <EntryGate ownerName={profile.name || SALES.name}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {children}
          <Footer profile={profile} />
        </EntryGate>
      </body>
    </html>
  )
}
