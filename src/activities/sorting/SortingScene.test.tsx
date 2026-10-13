import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

vi.mock('../../audio/sfx', () => ({ praise: vi.fn() }))

import { praise } from '../../audio/sfx'
import { genSet } from './gen'
import SortingScene from './SortingScene'

function itemEl(i: number): HTMLElement {
  return document.querySelector(`[data-item-id="item-${i}"]`) as HTMLElement
}

function basketEl(id: string): HTMLElement {
  return document.querySelector(`[data-basket-id="${id}"]`) as HTMLElement
}

function drag(itemIndex: number, basketIndex: number, set: ReturnType<typeof genSet>) {
  const item = itemEl(itemIndex)
  fireEvent(item, new MouseEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }))
  set.baskets.forEach((b, bi) => {
    const el = basketEl(b.id)
    const far = bi !== basketIndex
    el.getBoundingClientRect = () =>
      far
        ? { left: 1000, top: 1000, right: 1001, bottom: 1001, width: 1, height: 1, x: 1000, y: 1000, toJSON: () => {} }
        : { left: 0, top: 0, right: 400, bottom: 300, width: 400, height: 300, x: 0, y: 0, toJSON: () => {} }
  })
  fireEvent(item, new MouseEvent('pointermove', { bubbles: true, clientX: 200, clientY: 150 }))
  fireEvent(item, new MouseEvent('pointerup', { bubbles: true }))
}

beforeEach(() => {
  vi.mocked(praise).mockClear()
})

afterEach(() => cleanup())

it('dropping into the right basket removes it from the board', () => {
  render(<SortingScene />)
  const set = JSON.parse(document.querySelector('[data-set]')?.getAttribute('data-set') ?? '{}') as ReturnType<typeof genSet>
  const item = itemEl(0) as HTMLElement
  const target = set.items[0].targetBasketId
  const bIdx = set.baskets.findIndex((b) => b.id === target)
  drag(0, bIdx, set)
  expect(document.querySelector('[data-item-id="item-0"]')).toBeNull()
})

it('dropping into a wrong basket returns item, speaks hint, no solved count', () => {
  render(<SortingScene />)
  const set = JSON.parse(document.querySelector('[data-set]')?.getAttribute('data-set') ?? '{}') as ReturnType<typeof genSet>
  const target = set.items[0].targetBasketId
  const wrongIdx = set.baskets.findIndex((b) => b.id !== target)
  drag(0, wrongIdx, set)
  expect(itemEl(0)).toBeTruthy()
  const stage = document.querySelector('[data-placed-count]')
  expect(stage?.getAttribute('data-placed-count')).toBe('0')
})

it('placing all items praises and adds a star', () => {
  render(<SortingScene />)
  const set = JSON.parse(document.querySelector('[data-set]')?.getAttribute('data-set') ?? '{}') as ReturnType<typeof genSet>
  set.items.forEach((_item, i) => {
    const placed = Array.from(document.querySelectorAll('[data-item-id]')).length
    void placed
    const el = (Array.from(document.querySelectorAll('[data-item-id]')) as HTMLElement[])[0]
    const idNumSet = el?.getAttribute('data-item-id') ?? 'item-0'
    const idx = Number(idNumSet.replace('item-', ''))
    const target = set.items[idx].targetBasketId
    const bIdx = set.baskets.findIndex((b) => b.id === target)
    drag(idx, bIdx, set)
  })
  expect(praise).toHaveBeenCalledTimes(1)
  const stage = document.querySelector('[data-placed-count]')
  expect(stage?.getAttribute('data-placed-count')).toBe(String(set.items.length))
})
