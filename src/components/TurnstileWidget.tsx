'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type Turnstile = {
  render: (container: HTMLElement, options: { sitekey: string; theme?: 'light' | 'dark' | 'auto' }) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

export function TurnstileWidget({ siteKey }: { siteKey: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const turnstile = window.turnstile
    if (!turnstile || !ref.current) return
    const id = turnstile.render(ref.current, { sitekey: siteKey, theme: 'light' })
    return () => turnstile.remove(id)
  }, [ready, siteKey])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={ref} className="turnstile" />
    </>
  )
}
