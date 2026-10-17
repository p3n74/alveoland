export const LEGAL_DOCS = [
  { slug: 'terms', file: 'terms.md', label: 'Terms' },
  { slug: 'privacy', file: 'privacy-policy.md', label: 'Privacy Policy' },
  { slug: 'data-privacy', file: 'data-privacy.md', label: 'Data Privacy Notice' },
] as const

export type LegalSlug = (typeof LEGAL_DOCS)[number]['slug']

export const LEGAL_PATHS: readonly string[] = LEGAL_DOCS.map((d) => `/${d.slug}`)

export const ENTRY_ACK_KEY = 'alveo-entry-ack-2026-10-17'
