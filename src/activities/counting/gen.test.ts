import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
})

it('answer always equals items count', async () => {
  const { genQuestion } = await import('./gen')
  for (let i = 0; i < 50; i++) {
    const q = genQuestion(5)
    expect(q.answer).toBe(q.items)
  }
})

it('options are exactly 3 unique numbers containing the answer', async () => {
  const { genQuestion } = await import('./gen')
  for (let i = 0; i < 50; i++) {
    const q = genQuestion(5)
    expect(q.options).toHaveLength(3)
    expect(new Set(q.options).size).toBe(3)
    expect(q.options).toContain(q.answer)
    for (const o of q.options) {
      expect(o).toBeGreaterThanOrEqual(1)
      expect(o).toBeLessThanOrEqual(5)
    }
  }
})

it('never asks above maxCount', async () => {
  const { genQuestion } = await import('./gen')
  for (let i = 0; i < 50; i++) {
    const q = genQuestion(5)
    expect(q.items).toBeLessThanOrEqual(5)
  }
})

it('item sprite stays a valid illustration id', async () => {
  const { genQuestion } = await import('./gen')
  const { VALID_COUNT_SPRITES } = await import('./gen')
  for (let i = 0; i < 20; i++) {
    expect(VALID_COUNT_SPRITES.includes(genQuestion(5).sprite)).toBe(true)
  }
})
