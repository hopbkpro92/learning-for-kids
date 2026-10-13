import { synth, BEAT_SECONDS } from './synth'

export interface SongNote {
  note: string
  beats: number
}

export interface SongLine {
  lyric: string
  notes: SongNote[]
}

export interface Song {
  id: string
  title: string
  tempo: number
  lines: SongLine[]
}

export type PlaySong = (song: Song, onLine: (lyric: string) => void) => () => void

export function playSong(song: Song, onLine: (lyric: string) => void): () => void {
  const timers: number[] = []
  const beatMs = 60000 / song.tempo
  const toSynthBeats = (beats: number) => (beats * beatMs) / (BEAT_SECONDS * 1000)

  let cursorMs = 0
  for (const line of song.lines) {
    const lineStartMs = Math.round(cursorMs)
    timers.push(window.setTimeout(() => onLine(line.lyric), lineStartMs))
    let noteMs = 0
    for (const n of line.notes) {
      const startAt = Math.round(cursorMs + noteMs)
      const synthBeats = toSynthBeats(n.beats)
      timers.push(
        window.setTimeout(() => synth.playNote(n.note, synthBeats, 'piano'), startAt),
      )
      noteMs += n.beats * beatMs
    }
    cursorMs += line.notes.reduce((sum, n) => sum + n.beats * beatMs, 0)
  }

  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    for (const t of timers) window.clearTimeout(t)
  }
}
