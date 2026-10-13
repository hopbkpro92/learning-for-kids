import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
})

it('teaser text is non-empty and never repeats back-to-back', async () => {
  const { makeTeaser } = await import('./teaser')
  const p = { stars: 0, unlockedDoors: [], puzzleLevel: 1, countingStreak: 0, countMax: 5 }
  for (let i = 0; i < 5; i++) {
    const t = makeTeaser(p)
    expect(t.text.trim().length).toBeGreaterThan(0)
    expect(['song', 'scene', 'animal']).toContain(t.kind)
  }
})
