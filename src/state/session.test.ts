import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
})

it('registerPlay only counts real played seconds', async () => {
  const { registerPlay, restDue } = await import('./session')
  defineVisibility('visible')
  registerPlay(500)
  registerPlay(560)
  expect(restDue()).toBe(false)
  defineVisibility('hidden')
  registerPlay(600)
  defineVisibility('visible')
  registerPlay(600)
  expect(restDue()).toBe(true)
})

it('rest counts down to zero after beginRest', async () => {
  const { beginRest, restLeft, tickRest } = await import('./session')
  beginRest()
  expect(restLeft()).toBeGreaterThan(0)
  tickRest(180)
  expect(restLeft()).toBe(0)
})

it('REST_AFTER_SECONDS is inside the 15-20 minute spec window', async () => {
  const { REST_AFTER_SECONDS, REST_SECONDS } = await import('./session')
  expect(REST_AFTER_SECONDS).toBe(1080)
  expect(REST_SECONDS).toBe(180)
})

function defineVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
}
