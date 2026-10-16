import Image from 'next/image'
import Link from 'next/link'

import { ALVEO_LOGO } from '@/lib/format'

type Props = {
  variant: 'overlay' | 'solid'
  current?: 'properties' | 'inquire'
  showRecord?: boolean
}

export function Header({ variant, current, showRecord = false }: Props) {
  return (
    <header className={`site-header site-header--${variant} on-dark`}>
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Home">
          <Image src={ALVEO_LOGO} alt="Alveo" width={104} height={28} priority unoptimized />
        </Link>
        <nav aria-label="Main" className="site-nav">
          <Link href="/#guide">The guide</Link>
          {showRecord ? <Link href="/#record">Record</Link> : null}
          <Link href="/properties" aria-current={current === 'properties' ? 'page' : undefined}>
            Properties
          </Link>
          <Link href="/inquire" aria-current={current === 'inquire' ? 'page' : undefined}>
            Inquire
          </Link>
        </nav>
      </div>
    </header>
  )
}
