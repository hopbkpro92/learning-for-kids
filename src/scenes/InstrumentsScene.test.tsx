import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../audio/sfx', () => ({ praise: vi.fn() }))
vi.mock('../audio/synth', () => ({ synth: { playNote: vi.fn() }, BEAT_SECONDS: 0.5 }))

import { praise } from '../audio/sfx'
import { synth } from '../audio/synth'
import InstrumentsScene from './InstrumentsScene'

beforeEach(() => {
  vi.mocked(synth.playNote).mockClear()
  vi.mocked(praise).mockClear()
})

afterEach(() => cleanup())

it('each pad plays its note with the matching timbre', () => {
  render(<InstrumentsScene />)
  fireEvent.click(screen.getByRole('button', { name: 'Trống' }))
  expect(synth.playNote).toHaveBeenLastCalledWith('C2', expect.anything(), 'drum')
  fireEvent.click(screen.getByRole('button', { name: 'Chuông' }))
  expect(synth.playNote).toHaveBeenLastCalledWith('G5', expect.anything(), 'bell')
  fireEvent.click(screen.getByRole('button', { name: 'Kèn' }))
  expect(synth.playNote).toHaveBeenLastCalledWith('E4', expect.anything(), 'horn')
  fireEvent.click(screen.getByRole('button', { name: 'Đàn' }))
  expect(synth.playNote).toHaveBeenLastCalledWith('A3', expect.anything(), 'piano')
})

it('rapid taps re-trigger sounds (2 taps in 60ms = 2 plays)', () => {
  render(<InstrumentsScene />)
  const drum = screen.getByRole('button', { name: 'Trống' })
  fireEvent.click(drum)
  fireEvent.click(drum)
  expect(vi.mocked(synth.playNote).mock.calls.filter((c) => c[2] === 'drum')).toHaveLength(2)
})

it('play-along: tapping all 8 beats in time praises once', () => {
  vi.useFakeTimers()
  try {
    render(<InstrumentsScene />)
    fireEvent.click(screen.getByRole('button', { name: 'Gõ theo nhịp' }))
    for (let i = 0; i < 8; i++) {
      act(() => {
        vi.advanceTimersByTime(500)
      })
      fireEvent.click(screen.getByRole('button', { name: 'Trống' }))
    }
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(praise).toHaveBeenCalledTimes(1)
  } finally {
    vi.useRealTimers()
  }
})

it('play-along: missing beats does not praise, no error', () => {
  vi.useFakeTimers()
  try {
    render(<InstrumentsScene />)
    fireEvent.click(screen.getByRole('button', { name: 'Gõ theo nhịp' }))
    for (let i = 0; i < 2; i++) {
      act(() => {
        vi.advanceTimersByTime(500)
      })
    }
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(praise).toHaveBeenCalledTimes(0)
  } finally {
    vi.useRealTimers()
  }
})
