import { getAudioCtx } from './ctx'

export const BEAT_SECONDS = 0.5

const SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

export function noteToFreq(note: string): number {
  const m = /^([A-G])([#b]?)([1-7])$/.exec(note)
  if (!m) return 0
  const base = SEMITONE[m[1]]
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0
  const octave = Number(m[3])
  const midi = 12 * (octave + 1) + base + acc
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export type Timbre = 'piano' | 'bell' | 'drum' | 'horn'

const WAVE: Record<Timbre, OscillatorType> = {
  piano: 'triangle',
  bell: 'sine',
  drum: 'square',
  horn: 'sawtooth',
}

export const synth = {
  playNote(note: string, beats = 1, timbre: Timbre = 'piano'): void {
    const ac = getAudioCtx()
    if (!ac || typeof ac.createOscillator !== 'function') return
    const freq = noteToFreq(note)
    if (!freq) return
    const t0 = ac.currentTime
    const dur = BEAT_SECONDS * beats
    const osc = ac.createOscillator()
    osc.type = WAVE[timbre]
    osc.frequency.value = freq
    const gain = ac.createGain()
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  },
}
