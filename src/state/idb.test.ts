import 'fake-indexeddb/auto'
import { beforeEach, expect, it } from 'vitest'
import { idbList, idbPut, type Artwork } from './idb'

beforeEach(async () => {
  await (await import('./idb')).idbAllDelete()
})

it('stores and lists artworks newest first', async () => {
  const a: Artwork = { id: 'a', createdAt: 100, strokes: [{ color: '#FF6B6B', points: [{ x: 0, y: 0 }] }] }
  const b: Artwork = { id: 'b', createdAt: 200, strokes: [{ color: '#4ECDC4', points: [{ x: 1, y: 1 }] }] }
  await idbPut(a)
  await idbPut(b)
  const listed = await idbList()
  expect(listed.map((x) => x.id)).toEqual(['b', 'a'])
})

it('rejects empty artwork', async () => {
  await expect(idbPut({ id: 'x', createdAt: 1, strokes: [] })).rejects.toThrow('artwork has no strokes')
})
