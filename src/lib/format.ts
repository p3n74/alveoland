export const PROPERTY_TYPES = [
  { value: 'condo', singular: 'Condo', plural: 'Condos' },
  { value: 'residential-lot', singular: 'Residential lot', plural: 'Residential lots' },
  { value: 'commercial-lot', singular: 'Commercial lot', plural: 'Commercial lots' },
] as const

export type PropertyTypeValue = (typeof PROPERTY_TYPES)[number]['value']

export const INQUIRY_TYPES = [
  { value: 'property-information', label: 'Property information' },
  { value: 'schedule-viewing', label: 'Schedule a viewing' },
  { value: 'payment-terms', label: 'Payment terms and financing' },
  { value: 'general', label: 'General question' },
] as const

export type InquiryTypeValue = (typeof INQUIRY_TYPES)[number]['value']

export function typeLabel(value: string | null | undefined, form: 'singular' | 'plural' = 'plural') {
  return PROPERTY_TYPES.find((t) => t.value === value)?.[form] ?? ''
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

export const ALVEO_LOGO =
  'https://www.alveoland.com.ph/app/uploads/2023/04/Alveo-white-e1682887996202.png'

export const HERO_IMAGE = 'https://www.alveoland.com.ph/app/uploads/2023/08/BGC.jpg'
