'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { CardData } from '@/lib/data'
import { PROPERTY_TYPES } from '@/lib/format'
import { PropertyCard } from './PropertyCard'

const ALL = 'all'

export function SuiteGrid({ properties }: { properties: CardData[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const cities = Array.from(new Map(properties.map((p) => [p.citySlug, p.city])).entries())
  const requestedCity = params.get('city') ?? ALL
  const requestedType = params.get('type') ?? ALL
  const city = cities.some(([slug]) => slug === requestedCity) ? requestedCity : ALL
  const type = PROPERTY_TYPES.some((t) => t.value === requestedType) ? requestedType : ALL

  const matches = (p: CardData, c: string, t: string) =>
    (c === ALL || p.citySlug === c) && (t === ALL || p.type === t)

  const visible = properties.filter((p) => matches(p, city, type))
  const cityChoices = cities.filter(([slug]) => properties.some((p) => matches(p, slug, type)))
  const typeChoices = PROPERTY_TYPES.filter((t) => properties.some((p) => matches(p, city, t.value)))

  function apply(nextCity: string, nextType: string) {
    if (nextCity !== ALL && nextType !== ALL && !properties.some((p) => matches(p, nextCity, nextType))) {
      if (nextCity !== city) nextType = ALL
      else nextCity = ALL
    }
    const next = new URLSearchParams(params.toString())
    if (nextCity === ALL) next.delete('city')
    else next.set('city', nextCity)
    if (nextType === ALL) next.delete('type')
    else next.set('type', nextType)
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <>
      <div className="filters">
        <div className="container">
          <div className="filters__group" role="group" aria-labelledby="filter-city">
            <p id="filter-city" className="filters__label">
              City
            </p>
            <div className="filters__options">
              <FilterButton active={city === ALL} onClick={() => apply(ALL, type)}>
                All
              </FilterButton>
              {cityChoices.map(([slug, label]) => (
                <FilterButton key={slug} active={city === slug} onClick={() => apply(slug, type)}>
                  {label}
                </FilterButton>
              ))}
            </div>
          </div>
          <div className="filters__group" role="group" aria-labelledby="filter-type">
            <p id="filter-type" className="filters__label">
              Property type
            </p>
            <div className="filters__options">
              <FilterButton active={type === ALL} onClick={() => apply(city, ALL)}>
                All
              </FilterButton>
              {typeChoices.map((t) => (
                <FilterButton key={t.value} active={type === t.value} onClick={() => apply(city, t.value)}>
                  {t.plural}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container section section--tight">
        <p className="count" aria-live="polite">
          {visible.length === 1 ? '1 property' : `${visible.length} properties`}
        </p>
        {visible.length > 0 ? (
          <div className="card-grid">
            {visible.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        ) : (
          <p className="body">No property matches these filters.</p>
        )}
      </div>
    </>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button type="button" className="filter-btn" aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}
