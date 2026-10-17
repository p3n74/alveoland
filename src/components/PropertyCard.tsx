import Image from 'next/image'
import Link from 'next/link'

import type { CardData } from '@/lib/data'
import { Arrow } from './Arrow'

export const SUITE_CARD_SIZES = '(min-width: 1328px) 400px, (min-width: 700px) 50vw, 100vw'
export const FEATURED_CARD_SIZES = '(min-width: 1328px) 310px, (min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw'

export function PropertyCard({ property, sizes = SUITE_CARD_SIZES }: { property: CardData; sizes?: string }) {
  const href = `/properties/${property.slug}`
  return (
    <article className="card">
      <Link href={href} className="card__media" tabIndex={-1} aria-hidden="true">
        {property.image ? (
          <Image src={property.image.src} alt="" fill sizes={sizes} />
        ) : (
          <span className="name-frame">{property.name}</span>
        )}
      </Link>
      <h3 className="card__title">
        <Link href={href}>{property.name}</Link>
      </h3>
      <p className="card__city">{property.city}</p>
      <p className="card__meta">{[property.typeLabel, property.status].filter(Boolean).join(' · ')}</p>
      <Link href={href} className="text-btn" aria-label={`View ${property.name}`}>
        View <Arrow />
      </Link>
    </article>
  )
}
