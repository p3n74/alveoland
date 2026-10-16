import type { MetadataRoute } from 'next'

import { getProperties } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const properties = await getProperties()
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/properties`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/inquire`, changeFrequency: 'yearly', priority: 0.5 },
    ...properties.map((p) => ({
      url: `${base}/properties/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
