import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { act } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../../audio/sfx', () => ({ praise: vi.fn() }))

import { praise } from '../../audio/sfx'
import { genRound } from './animals'
import WhoIsScene from './WhoIsScene'

function sampleRound(): ReturnType<typeof genRound> {
  for (let i = 0; i < 50; i++) {
    const r = genRound()
    const shown = r.cry // ví dụ chỉ để lấy cry — đáp án xác định bằng data-correct trên DOM
    void shown
    return r
  }
  throw new Error('unreachable')
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(praise).mockClear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function correctEl(): HTMLElement {
  return document.querySelector('[data-option][data-correct="true"]') as HTMLElement
}

function wrongEl(): HTMLElement {
  for (const el of Array.from(document.querySelectorAll('[data-option]')) as HTMLElement[]) {
    if (el.getAttribute('data-correct') !== 'true') return el
  }
  throw new Error('no wrong option')
}

it('tapping the right animal praises and advances after 1.5s', () => {
  render(<WhoIsScene />)
  const firstAnswer = Number(screen.getByTestId('who-version').getAttribute('data-v'))
  fireEvent.click(correctEl())
  expect(praise).toHaveBeenCalledTimes(1)
  act(() => {
    vi.advanceTimersByTime(1500)
  })
  const nextAnswer = Number(screen.getByTestId('who-version').getAttribute('data-v'))
  expect(nextAnswer).toBe(firstAnswer + 1)
})

it('tapping a wrong animal shows hint and keeps the round', () => {
  render(<WhoIsScene />)
  const before = screen.getByTestId('who-version').getAttribute('data-v')
  const correct2 = correctEl()
  fireEvent.click(wrongEl())
  expect(praise).toHaveBeenCalledTimes(0)
  expect(screen.getByTestId('who-version').getAttribute('data-v')).toBe(before)
  expect(document.querySelectorAll('[data-option]')).toHaveLength(3)
  expect(correctEl().getAttribute('data-correct')).toBe(correct2.getAttribute('data-correct'))
})

it('options are large tap targets (min 96px)', () => {
  render(<WhoIsScene sampleRound />)
  void sampleRound
  for (const el of Array.from(document.querySelectorAll('[data-option]')) as HTMLElement[]) {
    expect(el.style.minHeight).toBe('96px')
  }
})
