import { beforeEach, expect, it, vi } from 'vitest'
import { stubCtx } from './test-audio-helper'

beforeEach(() => {
  vi.resetModules()
  stubCtx('running')
})

it('playNote starts one oscillator with mapped freq', async () => {
  const { synth } = await import('./synth')
  synth.playNote('C4', 1, 'drum')
  const ctor = vi.mocked(AudioContext)
  const ctx = ctor.mock.results[0].value
  expect(ctx.__oscs.length).toBe(1)
  expect(ctx.__oscs[0].frequency.value).toBeCloseTo(261.63, 1)
  expect(ctx.__oscs[0].start).toHaveBeenCalledTimes(1)
  expect(ctx.__oscs[0].type).toBe('square')
})

it('different timbres map to different wave types', async () => {
  const { synth } = await import('./synth')
  synth.playNote('A4', 1, 'piano')
  synth.playNote('A4', 1, 'bell')
  synth.playNote('A4', 1, 'horn')
  const ctor = vi.mocked(AudioContext)
  const ctx = ctor.mock.results[0].value
  const types = ctx.__oscs.map((o) => (o as { type: string }).type)
  expect(types[0]).toBe('triangle')
  expect(types[1]).toBe('sine')
  expect(types[2]).toBe('sawtooth')
})
