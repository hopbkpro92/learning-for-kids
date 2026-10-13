import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../../audio/sfx', () => ({ praise: vi.fn() }))

vi.mock('../../lib/router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/router')>()
  return { ...actual, navigate: vi.fn() }
})

import { praise } from '../../audio/sfx'
import { navigate } from '../../lib/router'
import { solveBoard } from './shape'
import PuzzleScene from './PuzzleScene'

const BOARD_PX = 400
const MOVE_EPS = 0.06

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
  cleanup()
})

function pieceEl(id: string): HTMLElement {
  return document.querySelector(`[data-piece-id="${id}"]`) as HTMLElement
}

function drag(pieceIndex: number, targetIndex: number, level: 1 | 2 | 3) {
  const { targets } = solveBoard(level)
  const startTarget = targets[(pieceIndex + 1) % targets.length]
  const endTarget = targets[targetIndex]
  const piece = pieceEl(`piece-${pieceIndex}`)
  fireEvent(
    piece,
    new MouseEvent('pointerdown', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  )
  const pieceStart = { x: (startTarget.x + startTarget.w / 2) * BOARD_PX, y: (startTarget.y + startTarget.h / 2) * BOARD_PX }
  const pieceEnd = { x: (endTarget.x + endTarget.w / 2) * BOARD_PX, y: (endTarget.y + endTarget.h / 2) * BOARD_PX }
  fireEvent(
    piece,
    new MouseEvent('pointermove', {
      bubbles: true,
      clientX: pieceEnd.x - pieceStart.x,
      clientY: pieceEnd.y - pieceStart.y,
    }),
  )
  fireEvent(piece, new MouseEvent('pointerup', { bubbles: true }))
}

it('a correct drop snaps the piece and raises solved count', () => {
  render(<PuzzleScene />)
  drag(0, 0, 1)
  const board = screen.getByTestId('puzzle-board')
  expect(board.getAttribute('data-solved-count')).toBe('1')
  expect(pieceEl('piece-0').getAttribute('data-solved')).toBe('true')
})

it('a wrong drop returns the piece, no solved count', () => {
  render(<PuzzleScene />)
  // kéo đi 50px — không đủ gần vùng đích nào
  const piece = pieceEl('piece-0')
  fireEvent(piece, new MouseEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }))
  fireEvent(piece, new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 40 }))
  fireEvent(piece, new MouseEvent('pointerup', { bubbles: true }))
  const board = screen.getByTestId('puzzle-board')
  expect(board.getAttribute('data-solved-count')).toBe('0')
  expect(piece.getAttribute('data-solved')).toBe('false')
})

it('solving all pieces praises and goes home after 1.2s', () => {
  render(<PuzzleScene />)
  drag(0, 0, 1)
  drag(1, 1, 1)
  drag(2, 2, 1)
  expect(praise).toHaveBeenCalledTimes(1)
  vi.advanceTimersByTime(1200)
  expect(navigate).toHaveBeenCalledWith('#/home')
})
