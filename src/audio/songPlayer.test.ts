import { beforeEach, expect, it, vi } from 'vitest'
import { playSong, type Song } from './songPlayer'

vi.mock('./synth', () => {
  const BEAT_SECONDS = 0.5
  return { synth: { playNote: vi.fn() }, BEAT_SECONDS }
})

async function playNoteMock() {
  const { synth } = await import('./synth')
  return vi.mocked(synth.playNote)
}

const fakeSong: Song = {
  id: 't',
  title: 'T',
  tempo: 100,
  lines: [
    { lyric: 'L1', notes: [{ note: 'C4', beats: 1 }, { note: 'D4', beats: 1 }] },
    { lyric: 'L2', notes: [{ note: 'E4', beats: 2 }] },
  ],
}

beforeEach(async () => {
  vi.useFakeTimers()
  vi.mocked((await import('./synth')).synth.playNote).mockClear()
})

it('schedules lines and notes along the tempo', async () => {
  const lines: string[] = []
  playSong(fakeSong, (l) => lines.push(l))
  vi.advanceTimersByTime(5000)
  expect(lines).toEqual(['L1', 'L2'])
  expect((await playNoteMock())).toHaveBeenCalledTimes(3)
})

it('stop() halts scheduled lines and notes', async () => {
  const lines: string[] = []
  const stop = playSong(fakeSong, (l) => lines.push(l))
  stop()
  vi.advanceTimersByTime(5000)
  expect(lines).toEqual([])
  expect((await playNoteMock())).toHaveBeenCalledTimes(0)
})
