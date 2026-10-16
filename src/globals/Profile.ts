import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'

export const Profile: GlobalConfig = {
  slug: 'profile',
  admin: {
    group: 'Content',
    description: 'Leave a field empty until the fact is confirmed. Empty fields are hidden on the site.',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'title', type: 'text', defaultValue: 'Senior Sales' },
      ],
    },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Short first-person introduction. Separate paragraphs with a blank line.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'viber', type: 'text', admin: { description: 'Number in international format, e.g. +639171234567' } },
        { name: 'messengerUrl', type: 'text', admin: { description: 'e.g. https://m.me/your.page' } },
      ],
    },
    {
      name: 'cities',
      type: 'array',
      labels: { singular: 'City', plural: 'Cities' },
      fields: [{ name: 'city', type: 'text', required: true }],
    },
    { name: 'yearsWithAlveo', type: 'number', min: 0 },
    {
      name: 'accreditation',
      type: 'array',
      labels: { singular: 'Accreditation', plural: 'Accreditation' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
  ],
}
