'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

import { ENTRY_ACK_KEY, LEGAL_PATHS } from '@/lib/legal-links'

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

const readAck = () => {
  try {
    return window.localStorage.getItem(ENTRY_ACK_KEY) !== null
  } catch {
    return false
  }
}

export function EntryGate({ ownerName, children }: { ownerName: string; children: ReactNode }) {
  const pathname = usePathname()
  const storedAck = useSyncExternalStore(subscribe, readAck, () => false)
  const [acceptedNow, setAcceptedNow] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showError, setShowError] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  const open = !LEGAL_PATHS.includes(pathname) && !storedAck && !acceptedNow

  useEffect(() => {
    document.documentElement.classList.toggle('gate-open', open)
    if (open) dialogRef.current?.focus()
  }, [open])

  function accept() {
    if (!checked) {
      setShowError(true)
      return
    }
    try {
      window.localStorage.setItem(ENTRY_ACK_KEY, new Date().toISOString())
    } catch {}
    setAcceptedNow(true)
  }

  return (
    <>
      <div className="site-root" inert={open}>
        {children}
      </div>
      {open ? (
        <div className="entry-gate">
          <div
            ref={dialogRef}
            className="entry-gate__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="entry-gate-title"
            aria-describedby="entry-gate-desc"
            tabIndex={-1}
          >
            <h2 id="entry-gate-title" className="entry-gate__title">
              Before you continue
            </h2>
            <p id="entry-gate-desc" className="body">
              This is the personal site of {ownerName}, not the official Alveo Land website. Please read and acknowledge
              the three documents below. Your acknowledgement is kept only in this browser.
            </p>
            <div className="check entry-gate__check">
              <input
                id="entry-ack"
                type="checkbox"
                checked={checked}
                required
                aria-invalid={showError && !checked ? true : undefined}
                aria-describedby={showError && !checked ? 'entry-ack-error' : undefined}
                onChange={(e) => {
                  setChecked(e.target.checked)
                  if (e.target.checked) setShowError(false)
                }}
              />
              <label htmlFor="entry-ack">
                I have read and accept the <Link href="/terms">Terms</Link>, the{' '}
                <Link href="/privacy">Privacy Policy</Link>, and the{' '}
                <Link href="/data-privacy">Data Privacy Notice</Link>.
              </label>
            </div>
            {showError && !checked ? (
              <p id="entry-ack-error" className="field__error">
                Tick the box to confirm you have read the three documents.
              </p>
            ) : null}
            <div>
              <button type="button" className="btn" onClick={accept}>
                Accept and continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
