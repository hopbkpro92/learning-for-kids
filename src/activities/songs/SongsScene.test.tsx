import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../../audio/songPlayer', () => ({
  playSong: vi.fn(() => vi.fn()),
}))

import { playSong } from '../../audio/songPlayer'
import { SONGS } from '../../data/songs'
import SongsScene from './SongsScene'

beforeEach(() => {
  vi.mocked(playSong).mockClear()
})

afterEach(() => cleanup())

it('lists every song as a big tap target (min 64px)', () => {
  render(<SongsScene />)
  for (const song of SONGS) {
    const btn = screen.getByRole('button', { name: song.title })
    expect((btn as HTMLElement).style.minHeight).toBe('64px')
  }
})

it('tapping a song starts playback', () => {
  render(<SongsScene />)
  fireEvent.click(screen.getByRole('button', { name: 'Con vịt xòe ra hai cánh' }))
  expect(playSong).toHaveBeenCalledTimes(1)
  const call = vi.mocked(playSong).mock.calls[0]
  expect(call[0].id).toBe('con-vit')
})

it('shows the current lyric through the onLine callback', () => {
  vi.mocked(playSong).mockImplementation((song, onLine) => {
    onLine(song.lines[0].lyric)
    return () => {}
  })
  render(<SongsScene />)
  fireEvent.click(screen.getByRole('button', { name: 'Con vịt xòe ra hai cánh' }))
  const lyric = screen.getByLabelText('lời bài hát')
  expect(lyric.textContent).toContain('Con vịt xòe ra hai cánh')
})
