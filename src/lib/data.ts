import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Media, Property } from '@/payload-types'
import { slugify, statusLabel, typeLabel } from './format'

export const getPayloadClient = () => getPayload({ config })

export const getProfile = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'profile', depth: 1 })
})

export const getProperties = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'properties',
    sort: ['order', 'name'],
    limit: 200,
    depth: 1,
  })
  return result.docs
})

export const getPropertyBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'properties',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return result.docs[0] ?? null
})

export const getCredibility = cache(async () => {
  const payload = await getPayloadClient()
  const [awards, testimonials, salesRecords] = await Promise.all([
    payload.find({ collection: 'awards', sort: '-year', limit: 50, depth: 0 }),
    payload.find({
      collection: 'testimonials',
      where: { and: [{ published: { equals: true } }, { consentOnFile: { equals: true } }] },
      limit: 50,
      depth: 0,
    }),
    payload.find({ collection: 'sales-records', limit: 50, depth: 0 }),
  ])
  return {
    awards: awards.docs,
    testimonials: testimonials.docs,
    salesRecords: salesRecords.docs,
  }
})

export function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export type Frame = { src: string; alt: string }

export function propertyFrames(property: Property): Frame[] {
  const uploads = (property.gallery ?? [])
    .filter(isMedia)
    .filter((m) => m.url)
    .map((m) => ({ src: m.url as string, alt: m.alt || property.name }))
  const remote = property.heroImageUrl ? [{ src: property.heroImageUrl, alt: property.name }] : []
  return uploads.length > 0 ? [...uploads, ...remote] : remote
}

export type CardData = {
  slug: string
  name: string
  city: string
  citySlug: string
  type: string
  typeLabel: string
  status: string
  image: Frame | null
}

export function toCard(property: Property): CardData {
  return {
    slug: property.slug,
    name: property.name,
    city: property.city,
    citySlug: slugify(property.city),
    type: property.type,
    typeLabel: typeLabel(property.type),
    status: statusLabel(property.status, property.type),
    image: propertyFrames(property)[0] ?? null,
  }
}

export function paragraphs(text: string | null | undefined) {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
