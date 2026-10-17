'use client'

import { useActionState, useEffect, useRef, useState } from 'react'

import { submitInquiry, type InquiryField, type InquiryState } from '@/app/(frontend)/inquire/actions'
import { INQUIRY_TYPES, PREFERRED_CHANNELS, VISIT_MODES, type InquiryTypeValue } from '@/lib/format'
import { Arrow } from './Arrow'
import { INTENT_EVENT } from './IntentLink'
import { TurnstileWidget } from './TurnstileWidget'

type Option = { id: number; name: string }

type Props = {
  properties?: Option[]
  fixedProperty?: Option
  defaultPropertyId?: number
  defaultType?: string
  headingId?: string
  contactName?: string | null
  responseHours?: string | null
  formToken: string
  turnstileSiteKey?: string
}

const initial: InquiryState = { status: 'idle', key: 0 }

const isType = (value: string | undefined): value is InquiryTypeValue =>
  INQUIRY_TYPES.some((t) => t.value === value)

export function InquiryForm({
  properties = [],
  fixedProperty,
  defaultPropertyId,
  defaultType,
  headingId,
  contactName,
  responseHours,
  formToken,
  turnstileSiteKey,
}: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const [dismissed, setDismissed] = useState<number | null>(null)
  const [inquiryType, setInquiryType] = useState<InquiryTypeValue>(
    isType(defaultType) ? defaultType : 'property-information',
  )
  const alertRef = useRef<HTMLParagraphElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (state.status === 'error') alertRef.current?.focus()
  }, [state])

  useEffect(() => {
    const onIntent = (event: Event) => {
      const intent = (event as CustomEvent<string>).detail
      if (!isType(intent)) return
      setDismissed(state.key)
      setInquiryType(intent)
      window.setTimeout(() => typeRef.current?.focus({ preventScroll: true }), 0)
    }
    window.addEventListener(INTENT_EVENT, onIntent)
    return () => window.removeEventListener(INTENT_EVENT, onIntent)
  }, [state.key])

  if (state.status === 'success' && dismissed !== state.key) {
    const who = contactName || 'Your Alveo sales contact'
    const via = PREFERRED_CHANNELS.find((c) => c.value === state.channel)?.reply ?? 'using the details you left'
    return (
      <div className="form-success" role="status">
        <p className="form-success__title">Inquiry received</p>
        <p className="body">
          Thank you. {who} will reply {via}
          {fixedProperty ? ` about ${fixedProperty.name}` : ''}.
        </p>
        {responseHours ? <p className="body body--meta">Reply hours: {responseHours}</p> : null}
        <button type="button" className="text-btn" onClick={() => setDismissed(state.key)}>
          Send another inquiry <Arrow />
        </button>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.errors ?? {}) : {}
  const values = state.status === 'error' ? (state.values ?? {}) : {}
  const describe = (...fields: InquiryField[]) => {
    const ids = fields.filter((f) => errors[f]).map((f) => `${f}-error`)
    return ids.length > 0 ? { 'aria-invalid': true as const, 'aria-describedby': ids.join(' ') } : {}
  }
  const errorText = (field: InquiryField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="field__error">
        {errors[field]}
      </p>
    ) : null

  return (
    <form key={state.key} action={action} className="form" aria-labelledby={headingId} noValidate>
      {state.status === 'error' && state.message ? (
        <p ref={alertRef} className="form__alert" role="alert" tabIndex={-1}>
          {state.message}
        </p>
      ) : null}

      <div className="field">
        <label htmlFor="inquiryType">Inquiry type</label>
        <select
          ref={typeRef}
          id="inquiryType"
          name="inquiryType"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryTypeValue)}
          {...describe('inquiryType')}
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errorText('inquiryType')}
      </div>

      {fixedProperty ? (
        <div className="field">
          <label htmlFor="property-display">Property</label>
          <input id="property-display" value={fixedProperty.name} readOnly />
          <input type="hidden" name="property" value={String(fixedProperty.id)} />
        </div>
      ) : properties.length > 0 ? (
        <div className="field">
          <label htmlFor="property">Property (optional)</label>
          <select
            id="property"
            name="property"
            defaultValue={values.property ?? (defaultPropertyId ? String(defaultPropertyId) : '')}
            {...describe('property')}
          >
            <option value="">Not sure yet</option>
            {properties.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>
          {errorText('property')}
        </div>
      ) : null}

      {inquiryType === 'viewing' ? (
        <div className="field-row">
          <div className="field">
            <label htmlFor="visitMode">Viewing *</label>
            <select id="visitMode" name="visitMode" defaultValue={values.visitMode ?? ''} {...describe('visitMode')}>
              <option value="" disabled>
                Choose one
              </option>
              {VISIT_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {errorText('visitMode')}
          </div>
          <div className="field">
            <label htmlFor="preferredDate">Preferred date</label>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              defaultValue={values.preferredDate}
              {...describe('preferredDate')}
            />
            {errorText('preferredDate')}
          </div>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="name">Name *</label>
        <input id="name" name="name" autoComplete="name" required defaultValue={values.name} {...describe('name')} />
        {errorText('name')}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values.email}
            {...describe('email', 'contact')}
          />
          {errorText('email')}
        </div>
        <div className="field">
          <label htmlFor="phone">Mobile</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+63 917 123 4567"
            defaultValue={values.phone}
            {...describe('phone', 'contact')}
          />
          {errorText('phone')}
        </div>
      </div>
      {errors.contact ? (
        <p id="contact-error" className="field__error field__error--row">
          {errors.contact}
        </p>
      ) : (
        <p className="field__hint">Leave an email or a mobile number, or both.</p>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="preferredChannel">Best way to reach you</label>
          <select
            id="preferredChannel"
            name="preferredChannel"
            defaultValue={values.preferredChannel ?? ''}
            {...describe('preferredChannel')}
          >
            <option value="">No preference</option>
            {PREFERRED_CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errorText('preferredChannel')}
        </div>
        <div className="field">
          <label htmlFor="bestTimeToReach">Best time to reach you</label>
          <input
            id="bestTimeToReach"
            name="bestTimeToReach"
            placeholder="Weekdays after 6pm PH time"
            defaultValue={values.bestTimeToReach}
            {...describe('bestTimeToReach')}
          />
          {errorText('bestTimeToReach')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="buyerLocation">Where you are based</label>
        <input
          id="buyerLocation"
          name="buyerLocation"
          autoComplete="address-level2"
          placeholder="Quezon City, or Dubai, UAE"
          defaultValue={values.buyerLocation}
          {...describe('buyerLocation')}
        />
        {errorText('buyerLocation')}
      </div>
      <div className="check">
        <input id="isAbroad" name="isAbroad" type="checkbox" defaultChecked={values.isAbroad === 'on'} />
        <label htmlFor="isAbroad">I live or work outside the Philippines</label>
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} defaultValue={values.message} {...describe('message')} />
        {errorText('message')}
      </div>

      <div className="check">
        <input
          id="privacyConsent"
          name="privacyConsent"
          type="checkbox"
          required
          defaultChecked={values.privacyConsent === 'on'}
          {...describe('privacyConsent')}
        />
        <label htmlFor="privacyConsent">
          I agree that the details in this form may be used to reply to this inquiry. Read the{' '}
          <a href="/data-privacy" target="_blank" rel="noopener">
            Data Privacy Notice
          </a>
          .
        </label>
      </div>
      {errorText('privacyConsent')}

      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="formToken" value={formToken} />
      {turnstileSiteKey ? <TurnstileWidget siteKey={turnstileSiteKey} /> : null}

      <div className="form__submit">
        <button type="submit" className="btn" disabled={pending}>
          {pending ? 'Sending…' : 'Send inquiry'}
        </button>
        {responseHours ? <p className="field__hint">Reply hours: {responseHours}</p> : null}
      </div>
    </form>
  )
}
