import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import { createHmac, timingSafeEqual } from 'crypto'
import type { Payload } from 'payload'

const secret = () => {
  const value = process.env.PAYLOAD_SECRET
  if (!value) throw new Error('PAYLOAD_SECRET is not set')
  return value
}

const hmac = (value: string) => createHmac('sha256', secret()).update(value).digest('hex')

const LIMITS = {
  ip: { max: 8, windowMinutes: 15 },
  email: { max: 4, windowMinutes: 60 },
  phone: { max: 4, windowMinutes: 60 },
} as const

type Kind = keyof typeof LIMITS

const LONGEST_WINDOW_MINUTES = Math.max(...Object.values(LIMITS).map((l) => l.windowMinutes))

export function clientIp(forwardedFor: string | null) {
  const parts = (forwardedFor ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.at(-1) ?? 'local'
}

export async function checkInquiryRate(
  payload: Payload,
  input: { ip: string; email: string; phone: string },
): Promise<{ allowed: boolean }> {
  const buckets: { kind: Kind; keyHash: string }[] = [{ kind: 'ip', keyHash: hmac(`ip:${input.ip}`) }]
  const email = input.email.trim().toLowerCase()
  const phone = input.phone.replace(/\D/g, '')
  if (email) buckets.push({ kind: 'email', keyHash: hmac(`email:${email}`) })
  if (phone) buckets.push({ kind: 'phone', keyHash: hmac(`phone:${phone}`) })

  const db = (payload.db as unknown as PostgresAdapter).drizzle

  await db.execute(
    sql`DELETE FROM "inquiry_guard" WHERE "created_at" < now() - make_interval(mins => ${LONGEST_WINDOW_MINUTES})`,
  )

  let allowed = true
  for (const { kind, keyHash } of buckets) {
    const { max, windowMinutes } = LIMITS[kind]
    const result = await db.execute(sql`
      SELECT count(*)::int AS n FROM "inquiry_guard"
      WHERE "kind" = ${kind} AND "key_hash" = ${keyHash}
        AND "created_at" > now() - make_interval(mins => ${windowMinutes})`)
    const count = Number((result.rows[0] as { n: number } | undefined)?.n ?? 0)
    if (count >= max) allowed = false
  }

  for (const { kind, keyHash } of buckets) {
    await db.execute(sql`INSERT INTO "inquiry_guard" ("kind", "key_hash") VALUES (${kind}, ${keyHash})`)
  }

  return { allowed }
}

const MIN_AGE_MS = 3_000
const MAX_AGE_MS = 2 * 60 * 60 * 1000

export function createFormToken(now = Date.now()) {
  const issued = String(now)
  return `${issued}.${hmac(`form:${issued}`)}`
}

export function verifyFormToken(token: string, now = Date.now()) {
  const match = /^(\d{10,16})\.([a-f0-9]{64})$/.exec(token)
  if (!match) return false
  const [, issued, signature] = match
  const expected = Buffer.from(hmac(`form:${issued}`), 'hex')
  const given = Buffer.from(signature, 'hex')
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false
  const age = now - Number(issued)
  return age >= MIN_AGE_MS && age <= MAX_AGE_MS
}

export type TurnstileConfig =
  | { mode: 'off' }
  | { mode: 'misconfigured' }
  | { mode: 'on'; siteKey: string; secretKey: string }

export function turnstileConfig(): TurnstileConfig {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim()
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (siteKey && secretKey) return { mode: 'on', siteKey, secretKey }
  if (siteKey || secretKey) return { mode: 'misconfigured' }
  return { mode: 'off' }
}

export function turnstileSiteKey() {
  const config = turnstileConfig()
  return config.mode === 'on' ? config.siteKey : undefined
}

export async function verifyTurnstile(secretKey: string, token: string) {
  if (!token) return false
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
      signal: AbortSignal.timeout(8000),
    })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}
