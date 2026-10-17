'use client'

import type { ReactNode } from 'react'

import type { InquiryTypeValue } from '@/lib/format'

export const INTENT_EVENT = 'inquiry-intent'

type Props = {
  intent: InquiryTypeValue
  className?: string
  target?: string
  children: ReactNode
}

export function IntentLink({ intent, className, target = 'inquire', children }: Props) {
  const href = `?intent=${intent}#${target}`
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        const node = document.getElementById(target)
        if (!node) return
        event.preventDefault()
        window.history.replaceState(null, '', href)
        window.dispatchEvent(new CustomEvent<InquiryTypeValue>(INTENT_EVENT, { detail: intent }))
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      }}
    >
      {children}
    </a>
  )
}
