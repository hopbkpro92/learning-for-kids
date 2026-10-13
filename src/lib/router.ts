import { useSyncExternalStore } from 'react'

export const ROUTE_PATTERN =
  /^#\/(home|rest|parents|door\/(puzzle|songs|counting|drawing|instruments|sorting|whois))$/

export function normalize(hash: string): string {
  return ROUTE_PATTERN.test(hash) ? hash : '#/home'
}

export function navigate(path: string): void {
  const target = normalize(path)
  if (window.location.hash === target) return
  window.location.hash = target
  window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL: '', newURL: '' }))
}

function subscribe(cb: () => void): () => void {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

function getSnapshot(): string {
  return normalize(window.location.hash)
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, getSnapshot, () => '#/home')
}
