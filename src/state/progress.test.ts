import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const KEY = 'btth-progress'

beforeEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

it('addStars accumulates and loadProgress reads it back', async () => {
  const { addStars, loadProgress } = await import('./progress')
  addStars(2)
  addStars(3)
  expect(loadProgress().stars).toBe(5)
  expect(JSON.parse(localStorage.getItem(KEY) ?? '{}').stars).toBe(5)
})

it('loadProgress falls back to defaults when storage throws', async () => {
  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
  })
  const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const { addStars, loadProgress } = await import('./progress')
  expect(() => addStars(1)).not.toThrow()
  expect(loadProgress().stars).toBe(0)
  expect(loadProgress().puzzleLevel).toBe(1)
  expect(loadProgress().unlockedDoors).toContain('puzzle')
  expect(loadProgress().unlockedDoors).toContain('songs')
  expect(loadProgress().unlockedDoors).toContain('counting')
  errSpy.mockRestore()
})

it('puzzleLevel raises but never above 3', async () => {
  const { bumpPuzzleLevel, loadProgress } = await import('./progress')
  bumpPuzzleLevel()
  bumpPuzzleLevel()
  bumpPuzzleLevel()
  bumpPuzzleLevel()
  expect(loadProgress().puzzleLevel).toBe(3)
})

it('countStreak follows good answers and resets on wrong', async () => {
  const { bumpCountingStreak, resetCountingStreak, loadProgress } = await import('./progress')
  bumpCountingStreak()
  bumpCountingStreak()
  expect(loadProgress().countingStreak).toBe(2)
  resetCountingStreak()
  expect(loadProgress().countingStreak).toBe(0)
})
