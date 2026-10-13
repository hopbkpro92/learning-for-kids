import { beforeEach, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

beforeEach(() => {
  vi.resetModules()
  window.location.hash = ''
  window.location.hash = '#/home'
})

it('navigate switches the route', async () => {
  const { navigate, useRoute } = await import('./router')
  const { result } = renderHook(() => useRoute())
  act(() => navigate('#/door/puzzle'))
  expect(result.current).toBe('#/door/puzzle')
})

it('unknown hashes normalize to home', async () => {
  const { useRoute } = await import('./router')
  window.location.hash = '#/junk'
  const { result } = renderHook(() => useRoute())
  expect(result.current).toBe('#/home')
})

it('unknown door ids normalize to home', async () => {
  const { navigate, useRoute } = await import('./router')
  const { result } = renderHook(() => useRoute())
  act(() => navigate('#/door/Puzzle'))
  expect(result.current).toBe('#/home')
})
