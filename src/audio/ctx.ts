let cached: AudioContext | null = null

function newCtx(): AudioContext | null {
  try {
    return new AudioContext()
  } catch {
    return null
  }
}

export function getAudioCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!cached || cached.state === 'closed') cached = newCtx()
  if (!cached || cached.state !== 'running') return null
  return cached
}
