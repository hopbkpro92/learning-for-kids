import { getAudioCtx } from './ctx'
import { speak } from './speak'

export const PRAISE_PHRASES = [
  'Giá»i quÃ¡!',
  'BÃ© lÃ m tá»‘t láº¯m!',
  'Tuyá»‡t vá»i!',
  'ÄÃºng rá»“i Ä‘Ã³!',
  'Xuáº¥t sáº¯c!',
]

const CHIME = ['C5', 'E5', 'G5']
const CHIME_STEP = 0.12

function praiseChime(): void {
  const ac = getAudioCtx()
  if (!ac || typeof ac.createOscillator !== 'function') return
  const t0 = ac.currentTime
  CHIME.forEach((note, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = { C5: 523.25, E5: 659.25, G5: 783.99 }[note] ?? 0
    const gain = ac.createGain()
    const at = t0 + i * CHIME_STEP
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.35, at + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.35)
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.start(at)
    osc.stop(at + 0.4)
  })
}

function nextPhrase(): string {
  const i = praiseIndex % PRAISE_PHRASES.length
  praiseIndex = (praiseIndex + 1) % PRAISE_PHRASES.length
  return PRAISE_PHRASES[i]
}

let praiseIndex = 0

export function praise(): void {
  praiseChime()
  speak(nextPhrase())
}
