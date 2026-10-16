import Link from 'next/link'

import { Arrow } from '@/components/Arrow'
import { Header } from '@/components/Header'

export default function NotFound() {
  return (
    <>
      <Header variant="solid" />
      <main id="main" className="container section">
        <h1 className="page-title">Page not found</h1>
        <p className="body">The page may have moved, or the property is no longer listed.</p>
        <Link href="/properties" className="text-btn">
          All properties <Arrow />
        </Link>
      </main>
    </>
  )
}
