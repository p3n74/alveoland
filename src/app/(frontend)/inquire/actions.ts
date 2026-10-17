'use server'

import { z } from 'zod'

import { getPayloadClient } from '@/lib/data'
import {
  INQUIRY_TYPES,
  PREFERRED_CHANNELS,
  VISIT_MODES,
  type InquiryTypeValue,
  type PreferredChannelValue,
  type VisitModeValue,
} from '@/lib/format'

export type InquiryField =
  | 'name'
  | 'email'
  | 'phone'
  | 'contact'
  | 'inquiryType'
  | 'property'
  | 'preferredChannel'
  | 'visitMode'
  | 'preferredDate'
  | 'buyerLocation'
  | 'isAbroad'
  | 'bestTimeToReach'
  | 'message'
  | 'privacyConsent'

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<InquiryField, string>>
  values?: Partial<Record<InquiryField, string>>
  channel?: PreferredChannelValue
  key: number
}

const oneOf = (values: readonly string[], message: string) =>
  z.string().refine((v) => v === '' || values.includes(v), message)

const manilaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date())

const schema = z
  .object({
    name: z.string().trim().min(2, 'Add your name.').max(120, 'Keep the name under 120 characters.'),
    email: z
      .string()
      .trim()
      .max(200)
      .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Check the email address.'),
    phone: z
      .string()
      .trim()
      .max(40, 'Keep the number under 40 characters.')
      .regex(/^[+()\d\s.-]*$/, 'Use digits, spaces, +, or dashes.'),
    inquiryType: z
      .string()
      .refine((v) => INQUIRY_TYPES.some((t) => t.value === v), 'Choose an inquiry type.'),
    property: z.string().trim().regex(/^\d*$/, 'Choose a property from the list.'),
    preferredChannel: oneOf(
      PREFERRED_CHANNELS.map((c) => c.value),
      'Choose how you would like to be reached.',
    ),
    visitMode: oneOf(
      VISIT_MODES.map((m) => m.value),
      'Choose on-site or video call.',
    ),
    preferredDate: z
      .string()
      .trim()
      .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Use the date picker.')
      .refine((v) => v === '' || v >= manilaToday(), 'Choose today or a later date.'),
    buyerLocation: z.string().trim().max(120, 'Keep this under 120 characters.'),
    isAbroad: z.string(),
    bestTimeToReach: z.string().trim().max(120, 'Keep this under 120 characters.'),
    message: z.string().trim().max(2000, 'Keep the message under 2,000 characters.'),
    privacyConsent: z.string().refine((v) => v === 'on', 'Tick the consent box so your details can be used to reply.'),
  })
  .superRefine((d, ctx) => {
    if (d.email === '' && d.phone === '') {
      ctx.addIssue({ code: 'custom', path: ['contact'], message: 'Add an email or a mobile number so you can be reached.' })
    }
    if (d.preferredChannel === 'email' && d.email === '') {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Add an email to be reached by email.' })
    }
    if (['call', 'viber', 'whatsapp'].includes(d.preferredChannel) && d.phone === '') {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Add a mobile number for this channel.' })
    }
    if (d.inquiryType === 'viewing' && d.visitMode === '') {
      ctx.addIssue({ code: 'custom', path: ['visitMode'], message: 'Choose on-site or video call.' })
    }
  })

const text = (data: FormData, key: string) => {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

const FIELDS = [
  'name',
  'email',
  'phone',
  'inquiryType',
  'property',
  'preferredChannel',
  'visitMode',
  'preferredDate',
  'buyerLocation',
  'isAbroad',
  'bestTimeToReach',
  'message',
  'privacyConsent',
] as const

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const key = Date.now()

  if (text(formData, 'company') !== '') {
    return { status: 'success', key }
  }

  const raw = Object.fromEntries(FIELDS.map((f) => [f, text(formData, f)])) as Record<(typeof FIELDS)[number], string>

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors: InquiryState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as InquiryField
      errors[field] ??= issue.message
    }
    return { status: 'error', message: 'Check the highlighted fields.', errors, values: raw, key }
  }

  const data = parsed.data
  const isViewing = data.inquiryType === 'viewing'

  try {
    const payload = await getPayloadClient()

    let propertyId: number | undefined
    if (data.property) {
      const found = await payload.find({
        collection: 'properties',
        where: { id: { equals: Number(data.property) } },
        limit: 1,
        depth: 0,
      })
      propertyId = found.docs[0]?.id
    }

    await payload.create({
      collection: 'inquiries',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        inquiryType: data.inquiryType as InquiryTypeValue,
        property: propertyId,
        preferredChannel: (data.preferredChannel || undefined) as PreferredChannelValue | undefined,
        visitMode: isViewing ? ((data.visitMode || undefined) as VisitModeValue | undefined) : undefined,
        preferredDate:
          isViewing && data.preferredDate ? new Date(`${data.preferredDate}T00:00:00+08:00`).toISOString() : undefined,
        buyerLocation: data.buyerLocation || undefined,
        isAbroad: data.isAbroad === 'on',
        bestTimeToReach: data.bestTimeToReach || undefined,
        message: data.message || undefined,
        privacyConsent: true,
        privacyConsentAt: new Date().toISOString(),
        status: 'new',
      },
    })
  } catch (error) {
    console.error('Inquiry could not be saved', error)
    return {
      status: 'error',
      message: 'The inquiry could not be sent just now. Try again, or call the corporate desk.',
      values: raw,
      key,
    }
  }

  return {
    status: 'success',
    channel: (data.preferredChannel || undefined) as PreferredChannelValue | undefined,
    key,
  }
}
