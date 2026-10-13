import { beforeEach, expect, it, vi } from 'vitest'
import { stubCtx } from './test-audio-helper'

beforeEach(() => {
  vi.resetModules()
  vi.stubGlobal('speechSynthesis', undefined)
})

it('praise plays a 3-note chime', async () => {
  const ctor = stubCtx('running')
  const { praise } = await import('./sfx')
  expect(() => praise()).not.toThrow()
  const ctx = ctor.mock.results[0].value
  expect(ctx.__oscs.length).toBe(3)
  expect(ctx.__oscs[0].frequency.value).toBeCloseTo(523.25, 1)
  expect(ctx.__oscs[0].start).toHaveBeenCalledTimes(1)
})

it('praise skips audio without throwing when context is suspended', async () => {
  const ctor = stubCtx('suspended')
  const { praise } = await import('./sfx')
  expect(() => praise()).not.toThrow()
  const ctx = ctor.mock.results[0].value
  expect(ctx.__oscs.length).toBe(0)
})
