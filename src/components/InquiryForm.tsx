'use client'

import { useActionState, useState } from 'react'

import { submitInquiry, type InquiryField, type InquiryState } from '@/app/(frontend)/inquire/actions'
import { INQUIRY_TYPES } from '@/lib/format'
import { Arrow } from './Arrow'

type Option = { id: number; name: string }

type Props = {
  properties?: Option[]
  fixedProperty?: Option
  defaultPropertyId?: number
  defaultType?: string
  headingId?: string
}

const initial: InquiryState = { status: 'idle', key: 0 }

export function InquiryForm({ properties = [], fixedProperty, defaultPropertyId, defaultType, headingId }: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const [dismissed, setDismissed] = useState<number | null>(null)

  if (state.status === 'success' && dismissed !== state.key) {
    return (
      <div className="form-success" role="status">
        <p className="form-success__title">Inquiry received</p>
        <p className="body">
          Thank you. Your message has been saved
          {fixedProperty ? ` with ${fixedProperty.name}` : ''}, and you will be contacted through the details you
          left.
        </p>
        <button type="button" className="text-btn" onClick={() => setDismissed(state.key)}>
          Send another inquiry <Arrow />
        </button>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.errors ?? {}) : {}
  const values = state.status === 'error' ? (state.values ?? {}) : {}
  const err = (field: InquiryField) =>
    errors[field] ? { 'aria-invalid': true as const, 'aria-describedby': `${field}-error` } : {}
  const errorText = (field: InquiryField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="field__error">
        {errors[field]}
      </p>
    ) : null

  return (
    <form key={state.key} action={action} className="form" aria-labelledby={headingId} noValidate>
      {state.status === 'error' && state.message ? (
        <p className="form__alert" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="field">
        <label htmlFor="inquiryType">Inquiry type</label>
        <select
          id="inquiryType"
          name="inquiryType"
          defaultValue={values.inquiryType ?? defaultType ?? INQUIRY_TYPES[0].value}
          {...err('inquiryType')}
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
            {...err('property')}
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

      <div className="field">
        <label htmlFor="name">Name *</label>
        <input id="name" name="name" autoComplete="name" required defaultValue={values.name} {...err('name')} />
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
            {...err('email')}
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
            defaultValue={values.phone}
            {...err('phone')}
          />
          {errorText('phone')}
        </div>
      </div>
      <p className="field__hint">Leave an email or a mobile number, or both.</p>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} defaultValue={values.message} {...err('message')} />
        {errorText('message')}
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? 'Sending…' : 'Send inquiry'}
        </button>
      </div>
    </form>
  )
}
