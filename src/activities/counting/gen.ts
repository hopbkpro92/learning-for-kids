import type { SceneImageId } from '../../components/ShapeSprite'

export const VALID_COUNT_SPRITES: SceneImageId[] = ['bunny', 'duck', 'chicken']

export interface CountingQuestion {
  items: number
  sprite: SceneImageId
  options: number[]
  answer: number
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function genQuestion(maxCount: number): CountingQuestion {
  const max = Math.max(1, Math.floor(maxCount))
  const items = randInt(1, max)
  const answer = items
  const options = new Set<number>([answer])
  while (options.size < 3) {
    const wrong = randInt(1, max)
    if (wrong !== answer) options.add(wrong)
  }
  const shuffled = [...options]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const sprite = VALID_COUNT_SPRITES[randInt(0, VALID_COUNT_SPRITES.length - 1)]
  return { items, sprite, options: shuffled, answer }
}
