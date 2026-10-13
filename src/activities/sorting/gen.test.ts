import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
})

it('each item target basket is one of the baskets', async () => {
  const { genSet } = await import('./gen')
  for (let run = 0; run < 30; run++) {
    for (const level of [1, 2, 3] as const) {
      const set = genSet(level)
      for (const item of set.items) {
        expect(set.baskets.some((b) => b.id === item.targetBasketId)).toBe(true)
      }
    }
  }
})

it('level 1 is always 2 baskets with 4 items', async () => {
  const { genSet } = await import('./gen')
  const set = genSet(1)
  expect(set.baskets).toHaveLength(2)
  expect(set.items).toHaveLength(4)
})

it('sprites never repeat inside one set', async () => {
  const { genSet } = await import('./gen')
  for (const level of [1, 2, 3] as const) {
    const set = genSet(level)
    const ids = set.items.map((i) => i.sprite)
    expect(new Set(ids).size).toBe(ids.length)
  }
})

it('levels 2 and 3 use 3 baskets with 6 items', async () => {
  const { genSet } = await import('./gen')
  for (const level of [2, 3] as const) {
    const set = genSet(level)
    expect(set.baskets).toHaveLength(3)
    expect(set.items).toHaveLength(6)
  }
})

it('rule key is valid', async () => {
  const { genSet } = await import('./gen')
  for (const level of [1, 2, 3] as const) {
    expect(['color', 'shape', 'kind']).toContain(genSet(level).rule)
  }
})
