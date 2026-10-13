import { beforeEach, expect, it, vi } from 'vitest'
import { speak } from './speak'

type FakeVoice = { lang: string; name: string }
type FakeUtt = { text: string; lang: string; voice: FakeVoice | null }

let utts: FakeUtt[]

function FakeUtterance(this: FakeUtt, text: string) {
  this.text = text
  this.lang = ''
  this.voice = null
  utts.push(this)
}

const mkFakeViVoice = (lang = 'vi-VN') => ({ lang, name: 'Vietnamese' })

function fakeSynth(voices: FakeVoice[], speaking = false) {
  const synth = {
    speaking,
    cancel: vi.fn(),
    speak: vi.fn(),
    getVoices: () => voices,
  }
  vi.stubGlobal('speechSynthesis', synth)
  return synth
}

beforeEach(() => {
  utts = []
  ;(globalThis as Record<string, unknown>).SpeechSynthesisUtterance = FakeUtterance
})

it('speak sets vi-VN lang and uses the picked voice', () => {
  const voice = mkFakeViVoice()
  const synth = fakeSynth([voice])
  speak('Chào bé')
  expect(synth.speak).toHaveBeenCalledTimes(1)
  expect(utts[0].text).toBe('Chào bé')
  expect(utts[0].lang).toBe('vi-VN')
  expect(utts[0].voice).toBe(voice)
})

it('speak still works when no vi voice exists', () => {
  const synth = fakeSynth([{ lang: 'en-US', name: 'English' }])
  expect(() => speak('Xin chào')).not.toThrow()
  expect(synth.speak).toHaveBeenCalledTimes(1)
  expect(utts[0].lang).toBe('vi-VN')
  expect(utts[0].voice).toBeNull()
})

it('speak cancels an active utterance first', () => {
  const synth = fakeSynth([mkFakeViVoice()], true)
  speak('Câu mới')
  expect(synth.cancel).toHaveBeenCalledTimes(1)
})
