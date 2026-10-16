import type { Property } from '../payload-types'

type SeedProperty = Pick<
  Property,
  'name' | 'slug' | 'city' | 'type' | 'status' | 'area' | 'priceFrom' | 'summary' | 'heroImageUrl' | 'featured' | 'order'
>

const uploads = 'https://www.alveoland.com.ph/app/uploads'

export const SEED_PROPERTIES: SeedProperty[] = [
  {
    name: 'Patio Suites Abreeza',
    slug: 'patio-suites-abreeza',
    city: 'Davao',
    type: 'condo',
    status: 'Pre-selling',
    area: 'About 26–156 sqm',
    priceFrom: 'Starts at ₱8,232,000',
    summary:
      'Final residential tower Alveo has offered in the Abreeza district, beside the mall and corporate center in Davao. Studios through three-bedroom units.',
    heroImageUrl: `${uploads}/2023/12/Patio-Suites-Abreeza-835x467.png`,
    featured: true,
    order: 10,
  },
  {
    name: 'Mergent Residences',
    slug: 'mergent-residences',
    city: 'Makati',
    type: 'condo',
    status: 'Pre-selling',
    area: 'About 31–106 sqm',
    priceFrom: 'Starts at ₱10,432,050',
    summary:
      'First Alveo high-rise in Poblacion, Makati, along Makati Avenue, with Gil Puyat, Kalayaan, and J.P. Rizal nearby. Studios through two-bedroom units.',
    heroImageUrl: `${uploads}/2023/12/MERGENT-RESIDENCES-Pool-Area-835x467.jpg`,
    featured: true,
    order: 20,
  },
  {
    name: 'Sentrove',
    slug: 'sentrove',
    city: 'Quezon City',
    type: 'condo',
    status: 'Public listing',
    area: 'About 30–279 sqm',
    priceFrom: 'Starts at ₱8,300,000',
    summary:
      'High-rise residence in the 11-hectare Cloverleaf district at Balintawak, Quezon City, beside Ayala Malls Cloverleaf.',
    heroImageUrl: `${uploads}/2023/12/SENTROVE-835x467.jpg`,
    featured: true,
    order: 30,
  },
  {
    name: 'Callisto',
    slug: 'callisto',
    city: 'Makati',
    type: 'condo',
    status: 'Ready for occupancy',
    area: 'About 30–60 sqm',
    priceFrom: '',
    summary:
      'Tower at West Gala Drive corner Theater Drive, Circuit Makati. The public listing marks it ready for occupancy.',
    heroImageUrl: `${uploads}/2023/12/CALLISTO-835x467.jpg`,
    featured: true,
    order: 40,
  },
  {
    name: 'Astela',
    slug: 'astela',
    city: 'Makati',
    type: 'condo',
    status: 'Pre-selling',
    area: 'About 33–126 sqm',
    priceFrom: '₱11 million to ₱48.5 million',
    summary: 'Lower-density tower at Circuit Makati. The public condos archive lists it as pre-selling.',
    heroImageUrl: `${uploads}/2017/12/ASTELA-10-835x467.jpg`,
    featured: false,
    order: 50,
  },
  {
    name: 'Westborough',
    slug: 'westborough',
    city: 'Cavite',
    type: 'commercial-lot',
    status: 'Sold out',
    area: 'Commercial lots',
    priceFrom: '',
    summary:
      'Commercial-lot community in Cavite. The public property page describes it as sold out, with a large share of the land kept open.',
    heroImageUrl: `${uploads}/2023/12/WESTBOROUGH-2-1-835x467.jpg`,
    featured: false,
    order: 60,
  },
  {
    name: 'Hillside Ridge',
    slug: 'hillside-ridge',
    city: 'Cavite',
    type: 'residential-lot',
    status: 'Ready for turnover',
    area: 'Residential lots',
    priceFrom: '₱11.4 million to ₱30.8 million',
    summary:
      'Hillside Ridge Southmont, listed under Cavite on the public lots archive as residential lots ready for turnover.',
    heroImageUrl: `${uploads}/2023/12/HILLSIDE-RIDGE-Clubhouse-2-835x467.jpg`,
    featured: false,
    order: 70,
  },
  {
    name: 'South Palmgrove',
    slug: 'south-palmgrove',
    city: 'Batangas',
    type: 'residential-lot',
    status: 'Pre-selling',
    area: 'Lots about 200–499 sqm',
    priceFrom: '₱6.5 million to ₱18.6 million',
    summary:
      'Alveo’s first residential address in Lipa, Batangas: a 58.9-hectare subdivision with mountain views and a clubhouse.',
    heroImageUrl: `${uploads}/2023/12/South-Palmgrove-Guardhouse-Aerial-View.jpg`,
    featured: false,
    order: 80,
  },
  {
    name: 'Cerca',
    slug: 'cerca',
    city: 'Las Piñas–Alabang',
    type: 'condo',
    status: 'District',
    area: '6.6 hectares',
    priceFrom: '',
    summary:
      'Mixed-use district along Investment Drive, Alabang, Muntinlupa. Public residences include Viento and Nuveo.',
    heroImageUrl: `${uploads}/2023/06/Cerca-Whole-Development-Plan.jpg`,
    featured: false,
    order: 90,
  },
]
