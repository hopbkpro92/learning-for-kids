import { beforeEach, expect, it, vi } from 'vitest'

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
    addEventListener: vi.fn(),
    getVoices: () => voices,
  }
  vi.stubGlobal('speechSynthesis', synth)
  return synth
}

beforeEach(() => {
  utts = []
  ;(globalThis as Record<string, unknown>).SpeechSynthesisUtterance = FakeUtterance
  vi.resetModules()
})

it('speak sets vi-VN lang and uses the picked voice', async () => {
  const voice = mkFakeViVoice()
  const synth = fakeSynth([voice])
  const { speak } = await import('./speak')
  speak('Chào bé')
  expect(synth.speak).toHaveBeenCalledTimes(1)
  expect(utts[0].text).toBe('Chào bé')
  expect(utts[0].lang).toBe('vi-VN')
  expect(utts[0].voice).toBe(voice)
})

it('speak still works when no vi voice exists', async () => {
  const synth = fakeSynth([{ lang: 'en-US', name: 'English' }])
  const { speak } = await import('./speak')
  expect(() => speak('Xin chào')).not.toThrow()
  expect(synth.speak).toHaveBeenCalledTimes(1)
  expect(utts[0].lang).toBe('vi-VN')
  expect(utts[0].voice).toBeNull()
})

it('speak cancels an active utterance first', async () => {
  const synth = fakeSynth([mkFakeViVoice()], true)
  const { speak } = await import('./speak')
  speak('Câu mới')
  expect(synth.cancel).toHaveBeenCalledTimes(1)
})

it('speak picks the vi voice that arrives late via voiceschanged', async () => {
  let voices: FakeVoice[] = []
  const synth = fakeSynth(voices)
  ;(synth as unknown as { getVoices: () => FakeVoice[] }).getVoices = () => voices
  const { speak, initSpeak } = await import('./speak')
  initSpeak()
  speak('Lần đầu chưa có giọng')
  expect(utts[0].voice).toBeNull()
  expect(synth.addEventListener).toHaveBeenCalledWith('voiceschanged', expect.any(Function))
  voices = [mkFakeViVoice()]
  const handler = vi.mocked(synth.addEventListener).mock.calls.find(
    (c) => c[0] === 'voiceschanged',
  )?.[1] as () => void
  handler()
  speak('Lần hai đã có giọng vi')
  expect(utts[1].voice?.lang).toBe('vi-VN')
})
