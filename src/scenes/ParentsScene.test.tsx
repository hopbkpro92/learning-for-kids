import 'fake-indexeddb/auto'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

it('a plain tap on the parent gate does not open the parents scene', async () => {
  vi.useFakeTimers()
  window.location.hash = '#/home'
  const { default: App } = await import('../App')
  render(<App />)
  fireEvent.pointerDown(document.querySelector('#parent-gate') as HTMLElement)
  act(() => {
    vi.advanceTimersByTime(2000)
  })
  expect(screen.getByLabelText('Màn nhà')).toBeTruthy()
  fireEvent.pointerUp(document.querySelector('#parent-gate') as HTMLElement)
  act(() => {
    vi.advanceTimersByTime(2000)
  })
  expect(screen.getByLabelText('Màn nhà')).toBeTruthy()
})

it('holding three seconds navigates to the parents scene', async () => {
  vi.useFakeTimers()
  window.location.hash = '#/home'
  const { default: App } = await import('../App')
  render(<App />)
  const gate = document.querySelector('#parent-gate') as HTMLElement
  act(() => {
    gate.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
  })
  act(() => {
    vi.advanceTimersByTime(3000)
  })
  expect(screen.getByLabelText('Góc của bố mẹ')).toBeTruthy()
})

it('requires two confirmations, then wipes data and returns home', async () => {
  window.location.hash = '#/parents'
  const { addStars } = await import('../state/progress')
  const { idbPut } = await import('../state/idb')
  addStars(4)
  await idbPut({ id: 'x', createdAt: 1, strokes: [{ color: '#FF6B6B', points: [{ x: 0, y: 0 }] }] })
  const { default: App } = await import('../App')
  render(<App />)
  expect(screen.getByLabelText('Góc của bố mẹ')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Xoá dữ liệu' }))
  expect(screen.getByRole('button', { name: 'Xác nhận lần 1' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Xác nhận lần 1' }))
  expect(screen.getByRole('button', { name: 'Xác nhận lần 2' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Xác nhận lần 2' }))
  await screen.findByText('Đã xoá dữ liệu của bé.')
  const { loadProgress } = await import('../state/progress')
  const { idbList } = await import('../state/idb')
  expect(loadProgress().stars).toBe(0)
  expect(await idbList()).toHaveLength(0)
  expect(screen.getByText('Đã xoá dữ liệu của bé.')).toBeTruthy()
})
