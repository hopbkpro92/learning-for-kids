/// <reference types="fake-indexeddb/auto" />

export interface Stroke {
  color: string
  points: { x: number; y: number }[]
}

export interface Artwork {
  id: string
  createdAt: number
  strokes: Stroke[]
}

const DB_NAME = 'btth-art'
const STORE = 'artworks'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('indexedDB unavailable'))
  })
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const req = fn(t.objectStore(STORE))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error ?? new Error('indexedDB request failed'))
        t.oncomplete = () => db.close()
      }),
  )
}

export async function idbPut(art: Artwork): Promise<void> {
  if (!art.strokes.length) throw new Error('artwork has no strokes')
  await tx('readwrite', (s) => s.put(art) as IDBRequest)
}

export async function idbList(): Promise<Artwork[]> {
  const all = await tx<Artwork[]>('readonly', (s) => s.getAll() as IDBRequest<Artwork[]>)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function idbAllDelete(): Promise<void> {
  await tx('readwrite', (s) => s.clear() as IDBRequest)
}
