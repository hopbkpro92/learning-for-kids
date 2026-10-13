export const REST_AFTER_SECONDS = 1080
export const REST_SECONDS = 180

let playedSeconds = 0
let remaining = 0

export function registerPlay(seconds: number): void {
  if (document.visibilityState !== 'visible') return
  playedSeconds += seconds
}

export function restDue(): boolean {
  return playedSeconds >= REST_AFTER_SECONDS
}

export function beginRest(): void {
  remaining = REST_SECONDS
}

export function restLeft(): number {
  return remaining
}

export function tickRest(seconds: number): void {
  remaining = Math.max(0, remaining - seconds)
  if (remaining === 0) playedSeconds = 0
}

export function playedSecondsValue(): number {
  return playedSeconds
}
