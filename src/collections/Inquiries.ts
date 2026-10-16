import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access'
import { INQUIRY_TYPES } from '../lib/format'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'inquiryType', 'property', 'status', 'createdAt'],
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
      ],
    },
    {
      name: 'inquiryType',
      type: 'select',
      required: true,
      defaultValue: 'property-information',
      options: INQUIRY_TYPES.map(({ value, label }) => ({ value, label })),
    },
    { name: 'property', type: 'relationship', relationTo: 'properties' },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'closed', label: 'Closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
