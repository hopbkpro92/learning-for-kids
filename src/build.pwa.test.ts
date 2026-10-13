import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, it, describe } from 'vitest'

describe('built app is PWA-ready for offline use', () => {
  const dist = resolve(process.cwd(), 'dist')

  it('dist contains a service worker', () => {
    expect(existsSync(resolve(dist, 'sw.js'))).toBe(true)
  })

  it('manifest uses a relative start_url and Vietnamese name', () => {
    const file = resolve(dist, 'manifest.webmanifest')
    expect(existsSync(file)).toBe(true)
    const manifest = JSON.parse(readFileSync(file, 'utf8')) as {
      name?: string
      start_url?: string
    }
    expect(manifest.name).toBe('Bầu trời tí hon')
    expect(manifest.start_url).toBe('./')
  })
})
