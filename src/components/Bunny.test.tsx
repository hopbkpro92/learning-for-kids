import { render } from '@testing-library/react'
import { it, expect } from 'vitest'
import Bunny from './Bunny'

it('changes mood class by prop', () => {
  const { container, rerender } = render(<Bunny mood="wave" />)
  expect(container.querySelector('.bunny-wave')).toBeTruthy()
  rerender(<Bunny mood="sleepy" />)
  expect(container.querySelector('.bunny-sleepy')).toBeTruthy()
})

it('is vector art, no emoji', () => {
  const { container } = render(<Bunny mood="happy" />)
  expect(container.querySelectorAll('path').length).toBeGreaterThan(5)
  const markup = container.innerHTML
  const emoji = /\p{Extended_Pictographic}/u.test(markup)
  expect(emoji).toBe(false)
})
