import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
})

it('has at least six animals with unique keys', async () => {
  const { ANIMALS } = await import('./animals')
  expect(ANIMALS.length).toBeGreaterThanOrEqual(6)
  const keys = ANIMALS.map((a) => a.key)
  expect(new Set(keys).size).toBe(keys.length)
  for (const a of ANIMALS) {
    expect(a.vietnameseName.trim().length).toBeGreaterThan(0)
    expect(a.cryText.trim().length).toBeGreaterThan(0)
  }
})

it('rounds always contain the answer among 3 unique options', async () => {
  const { genRound } = await import('./animals')
  for (let i = 0; i < 20; i++) {
    const r = genRound()
    expect(r.options).toHaveLength(3)
    expect(new Set(r.options).size).toBe(3)
    expect(r.options).toContain(r.answer)
  }
})

it('cry text is Vietnamese onomatopoeia, non-empty', async () => {
  const { genRound } = await import('./animals')
  for (let i = 0; i < 20; i++) {
    expect(genRound().cry.trim().length).toBeGreaterThan(0)
  }
})
