import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../../audio/sfx', () => ({ praise: vi.fn() }))

import { praise } from '../../audio/sfx'
import CountingScene from './CountingScene'

function correctEl(): HTMLElement {
  return document.querySelector('[data-option][data-correct="true"]') as HTMLElement
}

function wrongEl(): HTMLElement {
  for (const el of Array.from(document.querySelectorAll('[data-option]')) as HTMLElement[]) {
    if (el.getAttribute('data-correct') !== 'true') return el
  }
  throw new Error('no wrong option found')
}

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  vi.mocked(praise).mockClear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

it('tapping the right answer praises and advances after 1.5s', () => {
  render(<CountingScene />)
  const first = correctEl()
  fireEvent.click(first)
  expect(praise).toHaveBeenCalledTimes(1)
  expect(first.getAttribute('data-solved')).toBe('true')
  act(() => {
    vi.advanceTimersByTime(1500)
  })
  const board = screen.getByTestId('counting-board')
  expect(Number(board.getAttribute('data-question-version'))).toBe(2)
})

it('tapping a wrong option keeps the question and adds no star', () => {
  render(<CountingScene />)
  fireEvent.click(correctEl())
  vi.advanceTimersByTime(1500)
  const stable = correctEl()
  fireEvent.click(wrongEl())
  expect(praise).toHaveBeenCalledTimes(1)
  expect(document.querySelectorAll('[data-option]')).toHaveLength(3)
  expect(correctEl().getAttribute('data-answer')).toBe(stable.getAttribute('data-answer'))
})

it('answer options are big and readable (min 72px)', () => {
  render(<CountingScene />)
  for (const el of Array.from(document.querySelectorAll('[data-option]')) as HTMLElement[]) {
    expect(el.style.minHeight).toBe('72px')
  }
})

it('board shows the right number of item sprites', () => {
  render(<CountingScene />)
  const board = screen.getByTestId('counting-board')
  expect(board.getAttribute('data-items')).toBe(correctEl().getAttribute('data-answer'))
})
