'use server'

import { z } from 'zod'

import { getPayloadClient } from '@/lib/data'
import { INQUIRY_TYPES, type InquiryTypeValue } from '@/lib/format'

export type InquiryField = 'name' | 'email' | 'phone' | 'inquiryType' | 'property' | 'message'

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<InquiryField, string>>
  values?: Partial<Record<InquiryField, string>>
  key: number
}

const inquiryTypes = INQUIRY_TYPES.map((t) => t.value) as [InquiryTypeValue, ...InquiryTypeValue[]]

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
    inquiryType: z.enum(inquiryTypes, { errorMap: () => ({ message: 'Choose an inquiry type.' }) }),
    property: z.string().trim().regex(/^\d*$/, 'Choose a property from the list.'),
    message: z.string().trim().max(2000, 'Keep the message under 2,000 characters.'),
  })
  .refine((d) => d.email !== '' || d.phone !== '', {
    path: ['email'],
    message: 'Add an email or a mobile number so you can be reached.',
  })

const text = (data: FormData, key: string) => {
  const value = data.get(key)
  return typeof value === 'string' ? value : ''
}

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const key = Date.now()

  if (text(formData, 'company') !== '') {
    return { status: 'success', key }
  }

  const raw = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    phone: text(formData, 'phone'),
    inquiryType: text(formData, 'inquiryType'),
    property: text(formData, 'property'),
    message: text(formData, 'message'),
  }

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
        inquiryType: data.inquiryType,
        property: propertyId,
        message: data.message || undefined,
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

  return { status: 'success', key }
}
