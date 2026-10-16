'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Frame } from '@/lib/data'

export function Gallery({ frames, name }: { frames: Frame[]; name: string }) {
  const [index, setIndex] = useState(0)
  const frame = frames[index]

  if (!frame) {
    return (
      <div className="gallery__main">
        <span className="name-frame">{name}</span>
      </div>
    )
  }

  return (
    <div className="gallery">
      <div className="gallery__main">
        <Image src={frame.src} alt={frame.alt} fill priority sizes="(min-width: 1200px) 1200px, 100vw" />
      </div>
      {frames.length > 1 ? (
        <div className="gallery__thumbs" role="group" aria-label="Photos">
          {frames.map((f, i) => (
            <button
              key={`${f.src}-${i}`}
              type="button"
              className="gallery__thumb"
              aria-pressed={i === index}
              aria-label={`Photo ${i + 1} of ${frames.length}`}
              onClick={() => setIndex(i)}
            >
              <Image src={f.src} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
