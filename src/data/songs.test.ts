import { expect, it } from 'vitest'
import { SONGS } from './songs'

it('has at least three traditional songs with unique ids', () => {
  expect(SONGS.length).toBeGreaterThanOrEqual(3)
  const ids = SONGS.map((s) => s.id)
  expect(new Set(ids).size).toBe(ids.length)
})

it('every note is a well-formed pitch', () => {
  for (const song of SONGS) {
    for (const line of song.lines) {
      expect(line.notes.length).toBeGreaterThan(0)
      for (const n of line.notes) {
        expect(n.note).toMatch(/^[A-G][#b]?[1-7]$/)
        expect(n.beats).toBeGreaterThan(0)
      }
    }
  }
})

it('each song has at least two lyric lines', () => {
  for (const song of SONGS) {
    expect(song.lines.length).toBeGreaterThanOrEqual(2)
    for (const line of song.lines) {
      expect(line.lyric.trim().length).toBeGreaterThan(0)
    }
  }
})

it('tempos land in the 90-110 range', () => {
  for (const song of SONGS) {
    expect(song.tempo).toBeGreaterThanOrEqual(90)
    expect(song.tempo).toBeLessThanOrEqual(110)
  }
})
