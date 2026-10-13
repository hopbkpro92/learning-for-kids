import { expect, it } from 'vitest'
import { PUZZLE_IMAGE_IDS, solveBoard, type PieceTarget } from './shape'

it('piece count grows slowly by level', () => {
  expect(solveBoard(1).targets).toHaveLength(3)
  expect(solveBoard(2).targets).toHaveLength(4)
  expect(solveBoard(3).targets).toHaveLength(6)
  expect(solveBoard(1).piecesPerRow).toBe(3)
  expect(solveBoard(2).piecesPerRow).toBe(2)
  expect(solveBoard(3).piecesPerRow).toBe(3)
})

it('targets stay inside the board bounds', () => {
  for (const level of [1, 2, 3] as const) {
    for (const t of solveBoard(level).targets) {
      expect(t.x).toBeGreaterThanOrEqual(0)
      expect(t.x + t.w).toBeLessThanOrEqual(1.0001)
      expect(t.y).toBeGreaterThanOrEqual(0)
      expect(t.y + t.h).toBeLessThanOrEqual(1.0001)
    }
  }
})

it('pieces reference valid illustration ids', () => {
  for (const level of [1, 2, 3] as const) {
    for (const id of solveBoard(level).targets.map((t) => t.imageId)) {
      expect(PUZZLE_IMAGE_IDS.includes(id)).toBe(true)
    }
  }
})

it('target ids are unique per board', () => {
  for (const level of [1, 2, 3] as const) {
    const ids = solveBoard(level).targets.map((t: PieceTarget) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  }
})
