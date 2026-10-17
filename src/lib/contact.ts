import type { Profile } from '@/payload-types'

export type Channel = {
  key: 'call' | 'viber' | 'whatsapp' | 'messenger'
  label: string
  href: string
  external: boolean
}

export function toE164(raw: string | null | undefined) {
  if (!raw) return null
  const compact = raw.replace(/[^\d+]/g, '')
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact
  const digits = compact.replace(/\D/g, '')
  if (/^09\d{9}$/.test(digits)) return `+63${digits.slice(1)}`
  if (/^639\d{9}$/.test(digits)) return `+${digits}`
  return null
}

export function getChannels(profile: Profile | null | undefined, topic?: string): Channel[] {
  if (!profile) return []
  const mobile = toE164(profile.mobileE164) ?? toE164(profile.phone)
  const viberNumber = toE164(profile.viber) ?? mobile
  const text = encodeURIComponent(
    topic
      ? `Hello, I found your site and would like to ask about ${topic}.`
      : 'Hello, I found your site and would like to ask about an Alveo property.',
  )
  const messenger = profile.messengerUsername?.trim().replace(/^@/, '')

  const channels: Channel[] = []
  if (mobile) channels.push({ key: 'call', label: 'Call', href: `tel:${mobile}`, external: false })
  if (profile.viberEnabled && viberNumber) {
    channels.push({
      key: 'viber',
      label: 'Viber',
      href: `viber://chat?number=${encodeURIComponent(viberNumber)}`,
      external: false,
    })
  }
  if (profile.whatsappEnabled && mobile) {
    channels.push({
      key: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/${mobile.slice(1)}?text=${text}`,
      external: true,
    })
  }
  if (messenger) {
    channels.push({
      key: 'messenger',
      label: 'Messenger',
      href: `https://m.me/${encodeURIComponent(messenger)}?text=${text}`,
      external: true,
    })
  } else if (profile.messengerUrl && /^https:\/\//.test(profile.messengerUrl)) {
    channels.push({ key: 'messenger', label: 'Messenger', href: profile.messengerUrl, external: true })
  }
  return channels
}
