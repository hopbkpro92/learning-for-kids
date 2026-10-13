import { beforeEach, expect, it, vi } from 'vitest'

export function mkCtx(state: string | undefined = 'running') {
  const oscs: Record<string, unknown>[] = []
  const ctx = {
    state,
    currentTime: 0,
    destination: {},
    createOscillator: () => {
      const o = {
        type: '',
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }
      oscs.push(o)
      return o
    },
    createGain: () => ({
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }),
    __oscs: oscs,
  }
  return ctx
}

export function stubCtx(state = 'running') {
  const ctor = vi.fn(() => mkCtx(state))
  vi.stubGlobal('AudioContext', ctor)
  return ctor
}
