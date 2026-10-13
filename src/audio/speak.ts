type AnyVoice = { lang: string; name: string }

function getSynth(): SpeechSynthesis | undefined {
  return (globalThis as { speechSynthesis?: SpeechSynthesis }).speechSynthesis
}

function getUtteranceCtor():
  | (new (text: string) => SpeechSynthesisUtterance)
  | undefined {
  return (globalThis as Record<string, unknown>).SpeechSynthesisUtterance as
    | (new (text: string) => SpeechSynthesisUtterance)
    | undefined
}

let cachedVoices: AnyVoice[] | null = null
let voicesReady = false

function refreshVoices(synth: SpeechSynthesis): AnyVoice[] {
  try {
    cachedVoices = typeof synth.getVoices === 'function' ? synth.getVoices() : []
  } catch {
    cachedVoices = []
  }
  if (cachedVoices.length) voicesReady = true
  return cachedVoices
}

export function initSpeak(): void {
  const synth = getSynth()
  if (!synth) return
  refreshVoices(synth)
  if (!voicesReady) {
    try {
      synth.addEventListener('voiceschanged', () => refreshVoices(synth))
    } catch {
      /* trình duyệt cũ không có addEventListener */
    }
  }
}

function pickVoice(synth: SpeechSynthesis): AnyVoice | null {
  if (!voicesReady) refreshVoices(synth)
  const voices = cachedVoices ?? []
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('vi')) ?? null
}

export function speak(text: string): void {
  const synth = getSynth()
  const Ctor = getUtteranceCtor()
  if (!synth || !Ctor) return
  if (synth.speaking && typeof synth.cancel === 'function') synth.cancel()
  const u = new Ctor(text)
  u.lang = 'vi-VN'
  const v = pickVoice(synth)
  if (v) u.voice = v as SpeechSynthesisVoice
  synth.speak(u)
}

export function cancelSpeak(): void {
  const synth = getSynth()
  if (synth && typeof synth.cancel === 'function') synth.cancel()
}
