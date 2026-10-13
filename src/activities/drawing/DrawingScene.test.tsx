import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../../audio/sfx', () => ({ praise: vi.fn() }))
vi.mock('../../state/idb', () => {
  const mem: { art: { id: string; createdAt: number; strokes: unknown[] }[] } = { art: [] }
  return {
    idbPut: vi.fn(async (art: { id: string; createdAt: number; strokes: unknown[] }) => {
      mem.art.push(art)
    }),
    idbList: vi.fn(async () => mem.art),
    __mem: mem,
  }
})

import { praise } from '../../audio/sfx'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import DrawingScene from './DrawingScene'

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#845EC2', '#2D2D2D']

beforeEach(() => {
  vi.mocked(praise).mockClear()
})

afterEach(() => {
  cleanup()
})

it('pointer stroke records points onto canvas state', () => {
  const { container } = render(<DrawingScene />)
  const canvas = container.querySelector('canvas') as HTMLElement
  expect(canvas).toBeTruthy()
  fireEvent(
    canvas,
    new MouseEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 }),
  )
  for (let i = 1; i <= 3; i++) {
    fireEvent(canvas, new MouseEvent('pointermove', { bubbles: true, clientX: 10 + i * 20, clientY: 10 + i * 5 }))
  }
  fireEvent(canvas, new MouseEvent('pointerup', { bubbles: true }))
  const stage = container.querySelector('[data-stroke-count]')
  expect(Number(stage?.getAttribute('data-stroke-count'))).toBe(1)
})

it('color row has exactly 5 fixed colors and switching works', () => {
  const { container } = render(<DrawingScene />)
  const dots = Array.from(container.querySelectorAll('[data-color]')) as HTMLElement[]
  expect(dots).toHaveLength(5)
  expect(dots.map((d) => d.getAttribute('data-color'))).toEqual(COLORS)
  expect(dots[0].getAttribute('data-active')).toBe('true')
  fireEvent.click(dots[2])
  expect(dots[2].getAttribute('data-active')).toBe('true')
  expect(dots[0].getAttribute('data-active')).toBe('false')
})

it('finish button praises and saves one artwork', async () => {
  const { container } = render(<DrawingScene />)
  const canvas = container.querySelector('canvas') as HTMLElement
  fireEvent(canvas, new MouseEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }))
  fireEvent(canvas, new MouseEvent('pointermove', { bubbles: true, clientX: 50, clientY: 30 }))
  fireEvent(canvas, new MouseEvent('pointerup', { bubbles: true }))
  fireEvent.click(container.querySelector('[data-finish]') as HTMLElement)
  await screen.findByLabelText('tranh đã lưu')
  expect(praise).toHaveBeenCalledTimes(1)
  expect(container.querySelectorAll('[data-artwork]').length).toBe(1)
})
