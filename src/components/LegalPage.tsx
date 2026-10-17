import Link from 'next/link'
import type { ReactNode } from 'react'

import { Header } from '@/components/Header'
import { getLegalDoc, inlineText, LEGAL_DOCS, type Inline, type LegalSlug } from '@/lib/legal'

function renderInline(content: Inline[]): ReactNode[] {
  return content.map((part, i) => {
    if (part.kind === 'br') return <br key={i} />
    if (part.kind === 'text') return part.text
    if (part.href.startsWith('/')) {
      return (
        <Link key={i} href={part.href}>
          {part.text}
        </Link>
      )
    }
    const external = /^https?:\/\//.test(part.href)
    return (
      <a key={i} href={part.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {part.text}
      </a>
    )
  })
}

function LegalNav({ current }: { current: LegalSlug }) {
  return (
    <nav aria-label="Legal documents" className="legal-nav">
      {LEGAL_DOCS.map((d) => (
        <Link key={d.slug} href={`/${d.slug}`} aria-current={d.slug === current ? 'page' : undefined}>
          {d.label}
        </Link>
      ))}
    </nav>
  )
}

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = await getLegalDoc(slug)

  return (
    <>
      <Header variant="solid" />
      <main id="main" className="container section legal">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">›</span> <span>{doc.title}</span>
        </nav>
        <LegalNav current={slug} />
        <article className="legal__doc">
          {doc.blocks.map((block, i) => {
            if (block.kind === 'heading') {
              if (block.level === 1) {
                return (
                  <h1 key={i} className="page-title legal__title">
                    {renderInline(block.content)}
                  </h1>
                )
              }
              const Tag = block.level === 2 ? 'h2' : 'h3'
              return <Tag key={i}>{renderInline(block.content)}</Tag>
            }
            if (block.kind === 'list') {
              return (
                <ul key={i}>
                  {block.items.map((item, j) => (
                    <li key={j}>{renderInline(item)}</li>
                  ))}
                </ul>
              )
            }
            const isUpdated = /^Last updated:/i.test(inlineText(block.content))
            return (
              <p key={i} className={isUpdated ? 'legal__updated' : undefined}>
                {renderInline(block.content)}
              </p>
            )
          })}
        </article>
        <LegalNav current={slug} />
      </main>
    </>
  )
}
