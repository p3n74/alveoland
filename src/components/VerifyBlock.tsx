import type { Profile, Property } from '@/payload-types'
import { formatDate, VERIFY_LINKS } from '@/lib/format'

type Props = {
  profile: Profile | null
  property?: Property
}

export function VerifyBlock({ profile, property }: Props) {
  const items = [
    profile?.prcAccreditationNo && {
      label: 'PRC accreditation no.',
      value: profile.prcValidUntil
        ? `${profile.prcAccreditationNo} · valid until ${formatDate(profile.prcValidUntil)}`
        : profile.prcAccreditationNo,
    },
    profile?.supervisingBrokerName && {
      label: 'Supervising broker',
      value: profile.supervisingBrokerPrcNo
        ? `${profile.supervisingBrokerName} · PRC no. ${profile.supervisingBrokerPrcNo}`
        : profile.supervisingBrokerName,
    },
    property?.dhsudLtsNumber && {
      label: `DHSUD license to sell, ${property.name}`,
      value: property.dhsudLtsNumber,
    },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section className="verify" aria-labelledby="verify-title">
      <h2 id="verify-title" className="sub-label">
        Verify before you reserve
      </h2>
      {items.length > 0 ? (
        <dl className="verify__list">
          {items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <p className="verify__payment">
        Payments for any Alveo property go only to Alveo Land’s official accounts, never to a salesperson’s personal
        account.
      </p>
      <p className="verify__links">
        <a href={VERIFY_LINKS.prc} target="_blank" rel="noopener noreferrer">
          Check a PRC license online
        </a>
        <a href={VERIFY_LINKS.dhsud} target="_blank" rel="noopener noreferrer">
          DHSUD project registration
        </a>
      </p>
    </section>
  )
}
