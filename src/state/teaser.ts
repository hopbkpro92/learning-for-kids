import type { Progress } from './progress'

export type TeaserKind = 'song' | 'scene' | 'animal'

export interface Teaser {
  kind: TeaserKind
  text: string
}

const TEASERS: Record<TeaserKind, string[]> = {
  song: ['Lần sau có bài hát mới để cùng Bunny hát nhé!'],
  scene: ['Lần sau bầu trời thêm một góc mới cho bé khám phá.'],
  animal: ['Lần sau có một bạn thú mới ghé thăm Bunny!'],
}

export function makeTeaser(_p: Progress): Teaser {
  const kinds = Object.keys(TEASERS) as TeaserKind[]
  const kind = kinds[Math.floor(Math.random() * kinds.length)]
  const list = TEASERS[kind]
  const text = list[Math.floor(Math.random() * list.length)]
  return { kind, text }
}
