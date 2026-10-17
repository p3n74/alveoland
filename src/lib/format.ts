export const PROPERTY_TYPES = [
  { value: 'condo', singular: 'Condo', plural: 'Condos' },
  { value: 'residential-lot', singular: 'Residential lot', plural: 'Residential lots' },
  { value: 'commercial-lot', singular: 'Commercial lot', plural: 'Commercial lots' },
] as const

export type PropertyTypeValue = (typeof PROPERTY_TYPES)[number]['value']

export const PROPERTY_STATUSES = [
  { value: 'pre-selling', label: 'Pre-selling' },
  { value: 'under-construction', label: 'Under construction' },
  { value: 'ready-for-occupancy', label: 'Ready for occupancy' },
  { value: 'sold-out', label: 'Sold out' },
] as const

export type PropertyStatusValue = (typeof PROPERTY_STATUSES)[number]['value']

export const BALANCE_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank financing' },
  { value: 'pag-ibig', label: 'Pag-IBIG' },
  { value: 'in-house', label: 'In-house financing' },
] as const

export const INQUIRY_TYPES = [
  { value: 'payment-terms', label: 'Price list and payment terms' },
  { value: 'viewing', label: 'Book a viewing' },
  { value: 'similar-units', label: 'Similar available units' },
  { value: 'property-information', label: 'Property information' },
  { value: 'general', label: 'General question' },
] as const

export type InquiryTypeValue = (typeof INQUIRY_TYPES)[number]['value']

export const PREFERRED_CHANNELS = [
  { value: 'call', label: 'Phone call', reply: 'by phone' },
  { value: 'viber', label: 'Viber', reply: 'on Viber' },
  { value: 'whatsapp', label: 'WhatsApp', reply: 'on WhatsApp' },
  { value: 'messenger', label: 'Messenger', reply: 'on Messenger' },
  { value: 'email', label: 'Email', reply: 'by email' },
] as const

export type PreferredChannelValue = (typeof PREFERRED_CHANNELS)[number]['value']

export const VISIT_MODES = [
  { value: 'on-site', label: 'On-site visit' },
  { value: 'video-call', label: 'Video call' },
] as const

export type VisitModeValue = (typeof VISIT_MODES)[number]['value']

export function typeLabel(value: string | null | undefined, form: 'singular' | 'plural' = 'plural') {
  return PROPERTY_TYPES.find((t) => t.value === value)?.[form] ?? ''
}

export function statusLabel(value: string | null | undefined, type?: string | null) {
  if (value === 'ready-for-occupancy' && type && type !== 'condo') return 'Ready for turnover'
  return PROPERTY_STATUSES.find((s) => s.value === value)?.label ?? ''
}

export function balanceModeLabel(value: string | null | undefined) {
  return BALANCE_MODES.find((m) => m.value === value)?.label ?? ''
}

export function formatDate(value: string | null | undefined) {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeZone: 'Asia/Manila' }).format(new Date(value))
}

export function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const CORPORATE = {
  hotline: '(+632) 8848 5000',
  hotlineHref: 'tel:+63288485000',
  email: 'info@alveoland.com',
  address: 'Alveo Corporate Center, 728 28th Street, Bonifacio Global City, 1634 Taguig City',
}

export const VERIFY_LINKS = {
  prc: 'https://online.prc.gov.ph/Verification',
  dhsud: 'https://dhsud.gov.ph/',
}

export const ALVEO_LOGO =
  'https://www.alveoland.com.ph/app/uploads/2023/04/Alveo-white-e1682887996202.png'

export const HERO_IMAGE = 'https://www.alveoland.com.ph/app/uploads/2023/08/BGC.jpg'
