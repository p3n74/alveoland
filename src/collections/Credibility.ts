import type { CollectionConfig, FieldAccess, Where } from 'payload'

import { anyone, isAdmin } from '../access'

const adminField: FieldAccess = ({ req }) => Boolean(req.user)

const publicTestimonials: Where = {
  and: [{ published: { equals: true } }, { consentOnFile: { equals: true } }],
}

const adminWrite = {
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

export const Awards: CollectionConfig = {
  slug: 'awards',
  defaultSort: '-year',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'issuer'],
    group: 'Credibility',
    description: 'Only her own recognitions. The section stays hidden while this is empty.',
  },
  access: { read: anyone, ...adminWrite },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'year', type: 'number' },
    { name: 'issuer', type: 'text' },
    { name: 'note', type: 'textarea' },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'clientContext', 'published'],
    group: 'Credibility',
    description: 'Shown on the site only when Published and Consent on file are both ticked.',
  },
  access: {
    read: ({ req }) => (req.user ? true : publicTestimonials),
    ...adminWrite,
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'clientName', type: 'text', required: true },
    {
      name: 'clientContext',
      type: 'text',
      admin: { description: 'e.g. Buyer, Patio Suites Abreeza, Davao' },
    },
    { name: 'published', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'consentOnFile',
      type: 'checkbox',
      defaultValue: false,
      access: { read: adminField, create: adminField, update: adminField },
      admin: { position: 'sidebar', description: 'Tick only when the client’s written permission is on file.' },
    },
  ],
}

export const SalesRecords: CollectionConfig = {
  slug: 'sales-records',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'period'],
    group: 'Credibility',
  },
  labels: { singular: 'Sales record', plural: 'Sales records' },
  access: { read: anyone, ...adminWrite },
  fields: [
    { name: 'label', type: 'text', required: true, admin: { description: 'e.g. Units sold' } },
    { name: 'value', type: 'text', required: true, admin: { description: 'e.g. 120' } },
    { name: 'period', type: 'text', admin: { description: 'e.g. 2019–2025' } },
    { name: 'note', type: 'textarea' },
  ],
}
