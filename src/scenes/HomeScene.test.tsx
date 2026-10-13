import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'

const navigateMock = vi.fn()

vi.mock('../lib/router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/router')>()
  return { ...actual, navigate: (path: string) => navigateMock(path) }
})

import HomeScene, { suggestDoor } from './HomeScene'

beforeEach(() => {
  navigateMock.mockClear()
  cleanup()
})

it('shows three doors with Vietnamese labels', () => {
  render(<HomeScene />)
  expect(screen.getByRole('button', { name: 'Xếp hình' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Ca hát' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Đếm số' })).toBeTruthy()
})

it('door buttons are at least 64px tall', () => {
  render(<HomeScene />)
  for (const btn of screen.getAllByRole('button')) {
    expect((btn as HTMLElement).style.minHeight).toBe('64px')
  }
})

it('a rapid double tap navigates only once', () => {
  render(<HomeScene />)
  const btn = screen.getByRole('button', { name: 'Xếp hình' })
  fireEvent.click(btn)
  fireEvent.click(btn)
  expect(navigateMock).toHaveBeenCalledTimes(1)
})

it('suggestDoor returns a different door', () => {
  expect(suggestDoor('puzzle')).not.toBe('puzzle')
  expect(suggestDoor('counting')).not.toBe('counting')
})
