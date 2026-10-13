export type SceneImageId =
  | 'bunny'
  | 'duck'
  | 'chicken'
  | 'apple'
  | 'banana'
  | 'milk'
  | 'fish'
  | 'leaf'
  | 'star'
  | 'cat'
  | 'dog'
  | 'cow'
  | 'frog'

export const PUZZLE_IMAGE_IDS: SceneImageId[] = ['bunny', 'duck', 'chicken']

export interface PieceTarget {
  id: string
  x: number
  y: number
  w: number
  h: number
  imageId: SceneImageId
}

export interface PuzzleBoard {
  piecesPerRow: number
  targets: PieceTarget[]
}

const LAYOUT: Record<1 | 2 | 3, { count: number; perRow: number }> = {
  1: { count: 3, perRow: 3 },
  2: { count: 4, perRow: 2 },
  3: { count: 6, perRow: 3 },
}

export function solveBoard(level: 1 | 2 | 3): PuzzleBoard {
  const { count, perRow } = LAYOUT[level]
  const rows = Math.ceil(count / perRow)
  const targets: PieceTarget[] = []
  for (let i = 0; i < count; i++) {
    const col = i % perRow
    const row = Math.floor(i / perRow)
    targets.push({
      id: `piece-${i}`,
      x: col / perRow,
      y: row / rows,
      w: 1 / perRow,
      h: 1 / rows,
      imageId: PUZZLE_IMAGE_IDS[i % PUZZLE_IMAGE_IDS.length],
    })
  }
  return { piecesPerRow: perRow, targets }
}
