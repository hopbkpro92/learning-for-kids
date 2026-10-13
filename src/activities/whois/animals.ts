import type { SceneImageId } from '../../components/ShapeSprite'

export interface Animal {
  key: SceneImageId
  vietnameseName: string
  cryText: string
}

export const ANIMALS: Animal[] = [
  { key: 'cat', vietnameseName: 'Mèo', cryText: 'meo meo' },
  { key: 'dog', vietnameseName: 'Chó', cryText: 'au au' },
  { key: 'chicken', vietnameseName: 'Gà', cryText: 'ó ó o' },
  { key: 'duck', vietnameseName: 'Vịt', cryText: 'quạc quạc' },
  { key: 'cow', vietnameseName: 'Bò', cryText: 'úm bò' },
  { key: 'frog', vietnameseName: 'Ếch', cryText: 'ẹt ẹt' },
]

export interface WhoRound {
  cry: string
  name: string
  options: SceneImageId[]
  answer: SceneImageId
}

function randInt(n: number): number {
  return Math.floor(Math.random() * n)
}

export function genRound(): WhoRound {
  const answer = ANIMALS[randInt(ANIMALS.length)]
  const options = new Set<SceneImageId>([answer.key])
  while (options.size < 3) {
    const other = ANIMALS[randInt(ANIMALS.length)]
    if (other.key !== answer.key) options.add(other.key)
  }
  const shuffled = [...options]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randInt(i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return {
    cry: answer.cryText,
    name: answer.vietnameseName,
    options: shuffled,
    answer: answer.key,
  }
}
