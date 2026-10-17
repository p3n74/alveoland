import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from '../payload.config'
import { SALES } from '../lib/format'
import { SEED_PROPERTIES } from './properties'

const photosDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'photos')

const INTRO = [
  'I am Luthgarda Pazon, senior sales at Alveo Land. I help buyers look at condos, residential lots, and commercial lots, and I answer directly.',
  'Write to me about a project, a unit or lot, or the current payment terms. I will walk you through what you need to know before you reserve.',
].join('\n\n')

const payload = await getPayload({ config })

for (const property of SEED_PROPERTIES) {
  const existing = await payload.find({
    collection: 'properties',
    where: { slug: { equals: property.slug } },
    limit: 1,
  })
  if (existing.totalDocs > 0) {
    payload.logger.info(`Property exists, left unchanged: ${property.slug}`)
    continue
  }
  await payload.create({
    collection: 'properties',
    data: { ...property, priceVerified: false },
  })
  payload.logger.info(`Property created: ${property.slug}`)
}

async function placeholderPhoto(alt: string, filename: string) {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(photosDir, filename),
    overrideAccess: true,
  })
  payload.logger.info(`Photo uploaded: ${filename}`)
  return created.id
}

const portrait = await placeholderPhoto('Portrait of Luthgarda Pazon', 'luthgarda-pazon-portrait.jpg')
const showroomPhoto = await placeholderPhoto(
  'Luthgarda Pazon in a showroom',
  'luthgarda-pazon-site.jpg',
)

await payload.updateGlobal({
  slug: 'profile',
  data: {
    name: SALES.name,
    title: 'Senior Sales',
    email: SALES.email,
    intro: INTRO,
    portrait,
    showroomPhoto,
  },
})
payload.logger.info(`Profile set for ${SALES.name}`)

const users = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD

if (users.totalDocs > 0) {
  payload.logger.info('An admin user already exists; none created.')
} else if (!email || !password) {
  payload.logger.warn('No users yet. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin.')
} else {
  await payload.create({ collection: 'users', data: { email, password } })
  payload.logger.info(`Admin user created: ${email}`)
}

process.exit(0)
