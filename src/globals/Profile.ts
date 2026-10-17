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
      type: 'collapsible',
      label: 'Contact channels',
      admin: { description: 'Only filled and enabled channels appear on the site.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'mobileE164',
              label: 'Mobile (international format)',
              type: 'text',
              admin: { description: 'e.g. +639171234567. Used for Call, Viber, and WhatsApp.' },
              validate: (value: string | null | undefined) =>
                !value || /^\+[1-9]\d{7,14}$/.test(value) || 'Use + then country code and number, no spaces.',
            },
            { name: 'email', type: 'email' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'viberEnabled', label: 'Show Viber', type: 'checkbox', defaultValue: false },
            { name: 'whatsappEnabled', label: 'Show WhatsApp', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'messengerUsername',
          type: 'text',
          admin: { description: 'The part after m.me/, e.g. your.page' },
        },
        {
          name: 'responseHours',
          type: 'text',
          admin: { description: 'e.g. Mon–Sat, 9am–7pm PH time' },
        },
        {
          type: 'row',
          fields: [
            { name: 'phone', label: 'Phone (display, legacy)', type: 'text' },
            { name: 'viber', label: 'Viber number (legacy)', type: 'text' },
            { name: 'messengerUrl', label: 'Messenger URL (legacy)', type: 'text' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Accreditation for buyers to verify',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'prcAccreditationNo', label: 'PRC accreditation no.', type: 'text' },
            { name: 'prcValidUntil', label: 'PRC valid until', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'supervisingBrokerName', type: 'text' },
            { name: 'supervisingBrokerPrcNo', label: 'Supervising broker PRC no.', type: 'text' },
          ],
        },
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
