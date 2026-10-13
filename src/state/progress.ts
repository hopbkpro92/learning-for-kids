export const KEY = 'btth-progress'

export interface Progress {
  stars: number
  unlockedDoors: string[]
  puzzleLevel: number
  countingStreak: number
  countMax: number
}

const BASE_DOORS = ['puzzle', 'songs', 'counting']

export function defaultProgress(): Progress {
  return {
    stars: 0,
    unlockedDoors: [...BASE_DOORS],
    puzzleLevel: 1,
    countingStreak: 0,
    countMax: 5,
  }
}

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw) as Partial<Progress>
    const d = defaultProgress()
    return {
      stars: typeof parsed.stars === 'number' ? parsed.stars : d.stars,
      unlockedDoors: Array.isArray(parsed.unlockedDoors)
        ? [...new Set([...BASE_DOORS, ...parsed.unlockedDoors])]
        : d.unlockedDoors,
      puzzleLevel: typeof parsed.puzzleLevel === 'number' ? parsed.puzzleLevel : d.puzzleLevel,
      countingStreak:
        typeof parsed.countingStreak === 'number' ? parsed.countingStreak : d.countingStreak,
      countMax: typeof parsed.countMax === 'number' ? parsed.countMax : d.countMax,
    }
  } catch {
    console.error('progress: storage unavailable, running without saving')
    return defaultProgress()
  }
}

export function loadProgress(): Progress {
  return read()
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    console.error('progress: cannot save, running without saving')
  }
}

function mutate(fn: (p: Progress) => Progress): Progress {
  const next = fn(read())
  saveProgress(next)
  return next
}

export function addStars(n: number): void {
  mutate((p) => ({ ...p, stars: p.stars + n }))
}

export function bumpPuzzleLevel(): void {
  mutate((p) => ({ ...p, puzzleLevel: Math.min(3, p.puzzleLevel + 1) }))
}

export function bumpCountingStreak(): number {
  const p = mutate((cur) => {
    const countingStreak = cur.countingStreak + 1
    const countMax = countingStreak >= 10 ? 10 : cur.countMax
    return { ...cur, countingStreak, countMax }
  })
  return p.countingStreak
}

export function resetCountingStreak(): void {
  mutate((p) => ({ ...p, countingStreak: 0 }))
}

export function unlockDoor(doorId: string): void {
  mutate((p) => ({
    ...p,
    unlockedDoors: [...new Set([...p.unlockedDoors, doorId])],
  }))
}
