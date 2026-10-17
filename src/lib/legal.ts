import { readFile } from 'fs/promises'
import path from 'path'
import { cache } from 'react'

import { LEGAL_DOCS, type LegalSlug } from './legal-links'

export { LEGAL_DOCS, type LegalSlug }

export type Inline = { kind: 'text'; text: string } | { kind: 'link'; text: string; href: string } | { kind: 'br' }

export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; content: Inline[] }
  | { kind: 'paragraph'; content: Inline[] }
  | { kind: 'list'; items: Inline[][] }

function parseInline(source: string): Inline[] {
  const out: Inline[] = []
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g
  const pushText = (text: string) => {
    const parts = text.split('\n')
    parts.forEach((part, i) => {
      if (i > 0) out.push({ kind: 'br' })
      if (part) out.push({ kind: 'text', text: part })
    })
  }
  let last = 0
  for (const match of source.matchAll(pattern)) {
    pushText(source.slice(last, match.index))
    out.push({ kind: 'link', text: match[1], href: match[2] })
    last = match.index + match[0].length
  }
  pushText(source.slice(last))
  return out
}

export function parseMarkdown(markdown: string): Block[] {
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: string[] | null = null

  const flush = () => {
    if (paragraph.length > 0) {
      const joined = paragraph
        .map((line, i) => (i < paragraph.length - 1 && / {2,}$/.test(line) ? `${line.trimEnd()}\n` : `${line.trim()} `))
        .join('')
        .replace(/ \n/g, '\n')
        .trim()
      blocks.push({ kind: 'paragraph', content: parseInline(joined) })
      paragraph = []
    }
    if (list) {
      blocks.push({ kind: 'list', items: list.map(parseInline) })
      list = null
    }
  }

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    const item = /^\s*[-*]\s+(.*)$/.exec(line)
    if (heading) {
      flush()
      blocks.push({
        kind: 'heading',
        level: heading[1].length as 1 | 2 | 3,
        content: parseInline(heading[2].trim()),
      })
    } else if (item) {
      if (paragraph.length > 0) flush()
      list ??= []
      list.push(item[1].trim())
    } else if (line.trim() === '') {
      flush()
    } else if (list) {
      list[list.length - 1] += ` ${line.trim()}`
    } else {
      paragraph.push(line)
    }
  }
  flush()
  return blocks
}

export function inlineText(content: Inline[]) {
  return content.map((c) => (c.kind === 'br' ? ' ' : c.text)).join('')
}

export const getLegalDoc = cache(async (slug: LegalSlug) => {
  const doc = LEGAL_DOCS.find((d) => d.slug === slug)
  if (!doc) throw new Error(`Unknown legal document: ${slug}`)
  const markdown = await readFile(path.join(process.cwd(), 'content', 'legal', doc.file), 'utf8')
  const blocks = parseMarkdown(markdown)
  const h1 = blocks.find((b) => b.kind === 'heading' && b.level === 1)
  return {
    ...doc,
    title: h1 && h1.kind === 'heading' ? inlineText(h1.content) : doc.label,
    blocks,
  }
})
