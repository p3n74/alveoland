import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { BALANCE_MODES, PROPERTY_STATUSES, PROPERTY_TYPES, slugify } from '../lib/format'

const dayOnly = { date: { pickerAppearance: 'dayOnly' as const } }

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
        {
          name: 'status',
          type: 'select',
          options: PROPERTY_STATUSES.map(({ value, label }) => ({ value, label })),
          admin: { description: 'Leave empty if the current status is not confirmed.' },
        },
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
      type: 'collapsible',
      label: 'Buying basics',
      admin: { description: 'Empty fields show an “Ask me” link on the site instead of a value.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'reservationFee', type: 'text', admin: { description: 'e.g. ₱50,000' } },
            { name: 'targetTurnover', type: 'text', admin: { description: 'e.g. Q4 2029' } },
            { name: 'termsAsOf', label: 'Terms as of', type: 'date', admin: dayOnly },
          ],
        },
        {
          name: 'paymentSchemes',
          type: 'array',
          labels: { singular: 'Payment scheme', plural: 'Payment schemes' },
          fields: [
            { name: 'label', type: 'text', required: true, admin: { description: 'e.g. Spot down payment' } },
            {
              type: 'row',
              fields: [
                { name: 'downPaymentPercent', label: 'Down payment %', type: 'number', min: 0, max: 100 },
                { name: 'downPaymentMonths', label: 'Over (months)', type: 'number', min: 0 },
                { name: 'balancePercent', label: 'Balance %', type: 'number', min: 0, max: 100 },
                {
                  name: 'balanceMode',
                  type: 'select',
                  options: BALANCE_MODES.map(({ value, label }) => ({ value, label })),
                },
              ],
            },
            { name: 'note', type: 'text' },
          ],
        },
        {
          name: 'unitTypes',
          type: 'array',
          labels: { singular: 'Unit type', plural: 'Unit types' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, admin: { description: 'e.g. 1 bedroom' } },
                { name: 'areaRange', type: 'text', admin: { description: 'e.g. 52–60 sqm' } },
                { name: 'priceFrom', type: 'text' },
              ],
            },
          ],
        },
        {
          name: 'location',
          label: 'Location and landmarks',
          type: 'textarea',
        },
        { name: 'mapUrl', type: 'text', admin: { description: 'Google Maps link' } },
        { name: 'dhsudLtsNumber', label: 'DHSUD license to sell no.', type: 'text' },
      ],
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
