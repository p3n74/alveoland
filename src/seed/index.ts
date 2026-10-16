import { getPayload } from 'payload'

import config from '../payload.config'
import { SEED_PROPERTIES } from './properties'

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
