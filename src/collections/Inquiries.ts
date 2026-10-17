import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import { INQUIRY_TYPES, PREFERRED_CHANNELS, VISIT_MODES } from '../lib/format'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'inquiryType', 'property', 'preferredChannel', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        {
          name: 'preferredChannel',
          type: 'select',
          options: PREFERRED_CHANNELS.map(({ value, label }) => ({ value, label })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inquiryType',
          type: 'select',
          required: true,
          defaultValue: 'property-information',
          options: INQUIRY_TYPES.map(({ value, label }) => ({ value, label })),
        },
        { name: 'property', type: 'relationship', relationTo: 'properties' },
      ],
    },
    {
      type: 'row',
      admin: { condition: (data) => data?.inquiryType === 'viewing' },
      fields: [
        {
          name: 'visitMode',
          type: 'select',
          options: VISIT_MODES.map(({ value, label }) => ({ value, label })),
        },
        { name: 'preferredDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'buyerLocation', type: 'text' },
        { name: 'isAbroad', label: 'Based abroad', type: 'checkbox', defaultValue: false },
        { name: 'bestTimeToReach', type: 'text' },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'privacyConsent',
          label: 'Privacy consent (RA 10173)',
          type: 'checkbox',
          defaultValue: false,
          admin: { readOnly: true },
        },
        { name: 'privacyConsentAt', type: 'date', admin: { readOnly: true } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'scheduled', label: 'Viewing scheduled' },
        { value: 'visited', label: 'Visited' },
        { value: 'closed', label: 'Closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
