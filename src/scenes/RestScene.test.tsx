import { cleanup, render, screen } from '@testing-library/react'
import { act, fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function defineVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
}

it('App forces the rest scene once real play time passes the threshold', async () => {
  defineVisibility('visible')
  const { registerPlay } = await import('../state/session')
  registerPlay(1081)
  window.location.hash = '#/door/songs'
  const { default: App } = await import('../App')
  render(<App />)
  expect(screen.getByLabelText('Giờ nghỉ')).toBeTruthy()
})

it('hash navigation is ignored while resting, home returns after rest ends', async () => {  defineVisibility('visible')
  const { registerPlay, tickRest, restLeft } = await import('../state/session')
  registerPlay(1081)
  const { default: App } = await import('../App')
  render(<App />)
  expect(screen.getByLabelText('Giờ nghỉ')).toBeTruthy()
  act(() => {
    window.location.hash = '#/home'
  window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL: '', newURL: '' }))
  })
  expect(screen.getByLabelText('Giờ nghỉ')).toBeTruthy()
  expect(restLeft()).toBeGreaterThan(0)
  act(() => {
    for (let i = 0; i < 180; i++) tickRest(1)
  })
  expect(restLeft()).toBe(0)
  act(() => {
    for (let i = 0; i < 180; i++) tickRest(1)
    window.location.hash = '#/home'
  })
  expect(restLeft()).toBe(0)
  // mỏng tới model mới: App mỏngphan giữ quyết định theo session hiện hành
  cleanup()
  render(<App />)
  expect(screen.getByLabelText('Màn nhà')).toBeTruthy()
})

it('RestScene interval auto-homes after three minutes of visible rest', async () => {
  defineVisibility('visible')
  const { default: RestScene } = await import('./RestScene')
  render(<RestScene />)
  act(() => {
    vi.advanceTimersByTime(180_000)
  })
  expect(window.location.hash).toBe('#/home')
})

it('hidden tab does not count rest time', async () => {
  defineVisibility('hidden')
  const { beginRest, tickRest, restLeft } = await import('../state/session')
  beginRest()
  const { default: RestScene } = await import('./RestScene')
  render(<RestScene />)
  act(() => {
    vi.advanceTimersByTime(300_000)
  })
  expect(restLeft()).toBeGreaterThan(0)
  act(() => {
    tickRest(10)
  })
  expect(restLeft()).toBe(170)
})
