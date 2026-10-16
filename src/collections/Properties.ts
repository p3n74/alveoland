import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { PROPERTY_TYPES, slugify } from '../lib/format'

export const Properties: CollectionConfig = {
  slug: 'properties',
  defaultSort: 'order',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'type', 'status', 'featured', 'priceVerified', 'order'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Used in the page address. Filled from the name when left empty.',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) =>
            slugify(typeof value === 'string' && value ? value : String(siblingData?.name ?? '')),
        ],
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: PROPERTY_TYPES.map(({ value, singular }) => ({ value, label: singular })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'text', admin: { description: 'e.g. Pre-selling, Ready for occupancy' } },
        { name: 'area', type: 'text', admin: { description: 'e.g. About 26–156 sqm' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priceFrom',
          type: 'text',
          admin: { description: 'Free text, e.g. Starts at ₱8,232,000. Leave empty to show “On request”.' },
        },
        {
          name: 'priceVerified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Tick once the price is confirmed against the current Alveo price list.',
          },
        },
      ],
    },
    { name: 'summary', type: 'textarea' },
    {
      name: 'heroImageUrl',
      type: 'text',
      admin: {
        description: 'Public image URL on www.alveoland.com.ph. An uploaded gallery image takes over when present.',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the landing page.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
